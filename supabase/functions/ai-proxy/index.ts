import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  checkRateLimit,
  sanitizePayload,
  buildUsageRecord,
} from './_logic.ts';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    // ── 1. Validar JWT Supabase ──────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Não autorizado' }, 401);

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authErr } = await supabaseUser.auth.getUser();
    if (authErr || !user) return json({ error: 'Não autorizado' }, 401);

    // Cliente admin para rate limiting (bypassa RLS)
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // ── 2. Rate limiting ─────────────────────────────────────────────────────
    const now = new Date();
    const oneMinAgo = new Date(now.getTime() - 60_000).toISOString();
    const oneDayAgo = new Date(now.getTime() - 86_400_000).toISOString();

    const [{ count: cMin }, { count: cDay }] = await Promise.all([
      admin.from('ai_usage').select('*', { count: 'exact', head: true })
        .eq('user_id', user.id).gte('created_at', oneMinAgo),
      admin.from('ai_usage').select('*', { count: 'exact', head: true })
        .eq('user_id', user.id).gte('created_at', oneDayAgo),
    ]);

    const rateCheck = checkRateLimit(cMin, cDay);
    if (rateCheck.exceeded) return json({ error: rateCheck.message }, 429);

    // ── 3. Validar chave Anthropic ───────────────────────────────────────────
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) return json({ error: 'Serviço IA não configurado' }, 503);

    // ── 4. Parsear body, validar e encaminhar ────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Payload JSON inválido.' }, 400);
    }

    let payload: ReturnType<typeof sanitizePayload>;
    try {
      payload = sanitizePayload(body);
    } catch (e) {
      return json({ error: (e as Error).message }, 400);
    }

    const anthropicResp = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!anthropicResp.ok) {
      const errBody = await anthropicResp.text().catch(() => '');
      console.error('Anthropic error', anthropicResp.status, errBody);
      return json({ error: `Erro na API de IA (${anthropicResp.status})` }, anthropicResp.status);
    }

    const result = await anthropicResp.json();

    // ── 5. Logar uso ─────────────────────────────────────────────────────────
    const usageRecord = buildUsageRecord(
      user.id,
      result.model ?? payload.model,
      result.usage?.input_tokens ?? 0,
      result.usage?.output_tokens ?? 0,
    );
    await admin.from('ai_usage').insert(usageRecord);

    return json(result);
  } catch (err) {
    console.error('ai-proxy unhandled error', err);
    return json({ error: 'Erro interno no servidor' }, 500);
  }
});
