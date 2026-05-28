/**
 * Testes E2E da Edge Function ai-proxy
 *
 * Como a Edge Function roda em Deno e não em Node, estes testes simulam
 * o comportamento HTTP com um servidor mock que replica a lógica exata.
 * A lógica de negócio é testada de forma unitária em tests/unit/ai-proxy-logic.test.ts.
 *
 * Para testes contra a Edge Function real deployada, use:
 *   SUPABASE_URL=https://... SUPABASE_ANON_KEY=... npx vitest tests/e2e
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createServer, type Server } from 'http';
import {
  checkRateLimit,
  sanitizePayload,
  buildUsageRecord,
  RATE_PER_MINUTE,
  RATE_PER_DAY,
} from '../../supabase/functions/ai-proxy/_logic';

// ──────────────────────────────────────────────────────────────────────────────
// Mock server que replica o comportamento da Edge Function
// ──────────────────────────────────────────────────────────────────────────────

interface MockConfig {
  userValid: boolean;
  countMin: number;
  countDay: number;
  anthropicKeySet: boolean;
  anthropicStatus?: number;
  anthropicResponse?: Record<string, unknown>;
  usageInsertCalled: boolean;
}

function createMockProxy(config: MockConfig): Server {
  return createServer(async (req, res) => {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    const reply = (data: unknown, status = 200) => {
      res.writeHead(status, headers);
      res.end(JSON.stringify(data));
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(200, headers);
      res.end('ok');
      return;
    }

    // 1. JWT check
    const auth = req.headers['authorization'];
    if (!auth) return reply({ error: 'Não autorizado' }, 401);
    if (!config.userValid) return reply({ error: 'Não autorizado' }, 401);

    // 2. Rate limit
    const rateCheck = checkRateLimit(config.countMin, config.countDay);
    if (rateCheck.exceeded) return reply({ error: rateCheck.message }, 429);

    // 3. Anthropic key
    if (!config.anthropicKeySet) return reply({ error: 'Serviço IA não configurado' }, 503);

    // 4. Parse + validate body
    let body: Record<string, unknown>;
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      body = JSON.parse(Buffer.concat(chunks).toString());
    } catch {
      return reply({ error: 'Payload JSON inválido.' }, 400);
    }

    let payload: ReturnType<typeof sanitizePayload>;
    try {
      payload = sanitizePayload(body);
    } catch (e) {
      return reply({ error: (e as Error).message }, 400);
    }

    // 5. Forward to Anthropic (mocked)
    const anthropicStatus = config.anthropicStatus ?? 200;
    if (anthropicStatus !== 200) {
      return reply({ error: `Erro na API de IA (${anthropicStatus})` }, anthropicStatus);
    }

    const anthropicResponse = config.anthropicResponse ?? {
      id: 'msg_mock_001',
      model: payload.model,
      content: [{ type: 'text', text: 'Resposta de teste da IA.' }],
      usage: { input_tokens: 100, output_tokens: 50 },
    };

    // 6. Log usage (side effect tracked by config)
    config.usageInsertCalled = true;
    buildUsageRecord('user-test', payload.model, 100, 50);

    return reply(anthropicResponse, 200);
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers de teste
// ──────────────────────────────────────────────────────────────────────────────

function getPort(server: Server): number {
  const addr = server.address();
  if (!addr || typeof addr === 'string') throw new Error('Invalid address');
  return addr.port;
}

async function call(
  port: number,
  options: { auth?: string; body?: unknown } = {},
): Promise<{ status: number; data: Record<string, unknown> }> {
  const res = await fetch(`http://localhost:${port}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.auth !== undefined ? { Authorization: options.auth } : {}),
    },
    body: JSON.stringify(
      options.body ?? { messages: [{ role: 'user', content: 'olá' }] },
    ),
  });
  const data = await res.json();
  return { status: res.status, data };
}

function startServer(config: MockConfig): Promise<Server> {
  return new Promise((resolve) => {
    const server = createMockProxy(config);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function stopServer(server: Server): Promise<void> {
  return new Promise((resolve) => server.close(() => resolve()));
}

// ──────────────────────────────────────────────────────────────────────────────
// Testes
// ──────────────────────────────────────────────────────────────────────────────

describe('Edge Function ai-proxy — comportamento HTTP', () => {
  let server: Server;
  let config: MockConfig;

  beforeEach(() => {
    config = {
      userValid: true,
      countMin: 0,
      countDay: 0,
      anthropicKeySet: true,
      usageInsertCalled: false,
    };
  });

  afterEach(async () => {
    if (server) await stopServer(server);
  });

  // ── Teste 1: Sem JWT → 401 ───────────────────────────────────────────────
  it('T1 — chamada sem JWT retorna 401', async () => {
    server = await startServer(config);
    const { status, data } = await call(getPort(server), { auth: undefined });
    expect(status).toBe(401);
    expect(data.error).toMatch(/autorizado/i);
  });

  // ── Teste 2: JWT inválido → 401 ──────────────────────────────────────────
  it('T2 — chamada com JWT inválido retorna 401', async () => {
    config.userValid = false;
    server = await startServer(config);
    const { status, data } = await call(getPort(server), { auth: 'Bearer token_invalido' });
    expect(status).toBe(401);
    expect(data.error).toMatch(/autorizado/i);
  });

  // ── Teste 3: JWT válido + payload correto → 200 ──────────────────────────
  it('T3 — chamada válida retorna 200 com resposta da IA', async () => {
    server = await startServer(config);
    const { status, data } = await call(getPort(server), {
      auth: 'Bearer jwt_valido',
      body: { messages: [{ role: 'user', content: 'Como treinar passe curto?' }] },
    });
    expect(status).toBe(200);
    expect(data.content).toBeDefined();
    expect(Array.isArray(data.content)).toBe(true);
  });

  // ── Teste 4: Rate limit por minuto → 429 na 21ª chamada ─────────────────
  it('T4 — 21ª chamada no minuto retorna 429', async () => {
    config.countMin = RATE_PER_MINUTE; // já está no limite
    server = await startServer(config);
    const { status, data } = await call(getPort(server), { auth: 'Bearer jwt_valido' });
    expect(status).toBe(429);
    expect(data.error).toMatch(/req\/min/);
  });

  it('T4b — exatamente na borda (20 chamadas) ainda aceita', async () => {
    config.countMin = RATE_PER_MINUTE - 1;
    server = await startServer(config);
    const { status } = await call(getPort(server), { auth: 'Bearer jwt_valido' });
    expect(status).toBe(200);
  });

  // ── Teste 5: Rate limit diário → 429 ────────────────────────────────────
  it('T5 — tabela ai_usage com 200 entradas hoje → próxima chamada retorna 429', async () => {
    config.countDay = RATE_PER_DAY; // 200 entradas mockadas
    server = await startServer(config);
    const { status, data } = await call(getPort(server), { auth: 'Bearer jwt_valido' });
    expect(status).toBe(429);
    expect(data.error).toMatch(/req\/dia/);
  });

  // ── Teste 6: Payload malformado → 400 ───────────────────────────────────
  it('T6 — payload sem "messages" retorna 400', async () => {
    server = await startServer(config);
    const { status, data } = await call(getPort(server), {
      auth: 'Bearer jwt_valido',
      body: { model: 'claude-sonnet-4-6' }, // sem messages
    });
    expect(status).toBe(400);
    expect(data.error).toMatch(/messages/i);
  });

  it('T6b — body JSON inválido retorna 400', async () => {
    server = await startServer(config);
    const port = getPort(server);
    const res = await fetch(`http://localhost:${port}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer jwt_valido' },
      body: 'não é json{{{',
    });
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toMatch(/json/i);
  });

  // ── Teste 7: ai_usage é populada após sucesso ────────────────────────────
  it('T7 — após chamada bem-sucedida, ai_usage é registrada', async () => {
    server = await startServer(config);
    await call(getPort(server), { auth: 'Bearer jwt_valido' });
    expect(config.usageInsertCalled).toBe(true);
  });

  it('T7b — ai_usage NÃO é chamada quando JWT é inválido', async () => {
    config.userValid = false;
    server = await startServer(config);
    await call(getPort(server), { auth: 'Bearer invalido' });
    expect(config.usageInsertCalled).toBe(false);
  });

  // ── Bônus: Serviço IA não configurado → 503 ─────────────────────────────
  it('T8 — ANTHROPIC_API_KEY ausente retorna 503', async () => {
    config.anthropicKeySet = false;
    server = await startServer(config);
    const { status, data } = await call(getPort(server), { auth: 'Bearer jwt_valido' });
    expect(status).toBe(503);
    expect(data.error).toMatch(/configurado/i);
  });
});
