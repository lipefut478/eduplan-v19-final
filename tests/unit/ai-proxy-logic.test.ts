import { describe, it, expect } from 'vitest';
import {
  checkRateLimit,
  estimateCost,
  sanitizePayload,
  buildUsageRecord,
  RATE_PER_MINUTE,
  RATE_PER_DAY,
  MAX_TOKENS_CAP,
} from '../../supabase/functions/ai-proxy/_logic';

// ──────────────────────────────────────────────────────────────────────────────
// checkRateLimit
// ──────────────────────────────────────────────────────────────────────────────
describe('checkRateLimit', () => {
  it('retorna exceeded=false quando ambos os contadores estão abaixo do limite', () => {
    const r = checkRateLimit(0, 0);
    expect(r.exceeded).toBe(false);
  });

  it('retorna exceeded=false com contadores nulos (primeiro uso)', () => {
    const r = checkRateLimit(null, null);
    expect(r.exceeded).toBe(false);
  });

  it('retorna exceeded=false no limite exato (não inclui o limite)', () => {
    const r = checkRateLimit(RATE_PER_MINUTE - 1, RATE_PER_DAY - 1);
    expect(r.exceeded).toBe(false);
  });

  it('retorna 429 quando countMin >= RATE_PER_MINUTE (21ª chamada)', () => {
    const r = checkRateLimit(RATE_PER_MINUTE, 10);
    expect(r.exceeded).toBe(true);
    if (r.exceeded) expect(r.message).toMatch(/req\/min/);
  });

  it('rate limit por minuto tem prioridade sobre diário', () => {
    const r = checkRateLimit(RATE_PER_MINUTE, RATE_PER_DAY);
    expect(r.exceeded).toBe(true);
    if (r.exceeded) expect(r.message).toMatch(/req\/min/);
  });

  it('retorna 429 quando countDay >= RATE_PER_DAY (201ª chamada no dia)', () => {
    const r = checkRateLimit(0, RATE_PER_DAY);
    expect(r.exceeded).toBe(true);
    if (r.exceeded) expect(r.message).toMatch(/req\/dia/);
  });

  it('simula 200 chamadas hoje + 1 → deve rejeitar', () => {
    // Arrange: tabela ai_usage mockada com 200 entradas hoje
    const mockCountDay = 200;
    const r = checkRateLimit(0, mockCountDay);
    expect(r.exceeded).toBe(true);
    if (r.exceeded) expect(r.message).toContain('200');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// estimateCost
// ──────────────────────────────────────────────────────────────────────────────
describe('estimateCost', () => {
  it('calcula custo zero quando tokens são zero', () => {
    expect(estimateCost(0, 0)).toBe(0);
  });

  it('calcula custo de entrada corretamente (1M tokens = $3)', () => {
    expect(estimateCost(1_000_000, 0)).toBeCloseTo(3.0, 4);
  });

  it('calcula custo de saída corretamente (1M tokens = $15)', () => {
    expect(estimateCost(0, 1_000_000)).toBeCloseTo(15.0, 4);
  });

  it('calcula custo combinado (1k input + 500 output)', () => {
    // 1000/1M * 3 + 500/1M * 15 = 0.003 + 0.0075 = 0.0105
    expect(estimateCost(1000, 500)).toBeCloseTo(0.0105, 6);
  });

  it('resultado é sempre positivo', () => {
    expect(estimateCost(100, 200)).toBeGreaterThanOrEqual(0);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// sanitizePayload
// ──────────────────────────────────────────────────────────────────────────────
describe('sanitizePayload', () => {
  const validBody = {
    messages: [{ role: 'user', content: 'Olá' }],
  };

  it('aceita payload mínimo válido', () => {
    const p = sanitizePayload(validBody);
    expect(p.messages).toHaveLength(1);
    expect(p.model).toBe('claude-sonnet-4-6');
    expect(p.max_tokens).toBe(4000);
  });

  it('usa model do payload quando fornecido', () => {
    const p = sanitizePayload({ ...validBody, model: 'claude-opus-4-7' });
    expect(p.model).toBe('claude-opus-4-7');
  });

  it('limita max_tokens ao teto máximo mesmo se enviado maior', () => {
    const p = sanitizePayload({ ...validBody, max_tokens: 99_999 });
    expect(p.max_tokens).toBe(MAX_TOKENS_CAP);
  });

  it('inclui system prompt quando fornecido', () => {
    const p = sanitizePayload({
      ...validBody,
      system: [{ type: 'text', text: 'Você é um treinador.' }],
    });
    expect(p.system).toBeDefined();
  });

  it('omite system quando não fornecido', () => {
    const p = sanitizePayload(validBody);
    expect(p.system).toBeUndefined();
  });

  it('lança erro para payload sem messages', () => {
    expect(() => sanitizePayload({ model: 'claude-sonnet-4-6' })).toThrow(/messages/);
  });

  it('lança erro quando messages não é array', () => {
    expect(() => sanitizePayload({ messages: 'texto inválido' })).toThrow(/messages/);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// buildUsageRecord
// ──────────────────────────────────────────────────────────────────────────────
describe('buildUsageRecord', () => {
  const userId = 'user-123';
  const model = 'claude-sonnet-4-6';

  it('popula todos os campos obrigatórios', () => {
    const r = buildUsageRecord(userId, model, 1000, 500);
    expect(r.user_id).toBe(userId);
    expect(r.model).toBe(model);
    expect(r.input_tokens).toBe(1000);
    expect(r.output_tokens).toBe(500);
    expect(r.estimated_cost_usd).toBeGreaterThan(0);
    expect(r.endpoint).toBe('ai-proxy');
  });

  it('endpoint padrão é "ai-proxy"', () => {
    const r = buildUsageRecord(userId, model, 0, 0);
    expect(r.endpoint).toBe('ai-proxy');
  });

  it('custo estimado corresponde ao estimateCost', () => {
    const r = buildUsageRecord(userId, model, 2000, 1000);
    expect(r.estimated_cost_usd).toBeCloseTo(estimateCost(2000, 1000), 8);
  });
});
