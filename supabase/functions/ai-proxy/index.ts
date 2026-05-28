import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const RATE_PER_MINUTE = 20;
const RATE_PER_DAY = 200;
const MAX_TOKENS_CAP = 8000;
// Claude Sonnet pricing per million tokens (USD)
const PRICE_INPUT_M = 3.0;
const PRICE_OUTPUT_M = 15.0;

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

    if ((cMin ?? 0) >= RATE_PER_MINUTE)
      return json({ error: `Limite de ${RATE_PER_MINUTE} req/min atingido. Aguarde.` }, 429);
    if ((cDay ?? 0) >= RATE_PER_DAY)
      return json({ error: `Limite de ${RATE_PER_DAY} req/dia atingido.` }, 429);

    // ── 3. Validar chave Anthropic ───────────────────────────────────────────
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) return json({ error: 'Serviço IA não configurado' }, 503);

    // ── 4. Parsear body e encaminhar ─────────────────────────────────────────
    const body = await req.json();
    const payload = {
      model: body.model ?? 'claude-sonnet-4-6',
      max_tokens: Math.min(body.max_tokens ?? 4000, MAX_TOKENS_CAP),
      ...(body.system && { system: body.system }),
      messages: body.messages,
    };

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
    const inputTokens = result.usage?.input_tokens ?? 0;
    const outputTokens = result.usage?.output_tokens ?? 0;
    const costUsd =
      (inputTokens / 1_000_000) * PRICE_INPUT_M +
      (outputTokens / 1_000_000) * PRICE_OUTPUT_M;

    await admin.from('ai_usage').insert({
      user_id: user.id,
      model: result.model ?? payload.model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      estimated_cost_usd: costUsd,
      endpoint: 'ai-proxy',
    });

    return json(result);
  } catch (err) {
    console.error('ai-proxy unhandled error', err);
    return json({ error: 'Erro interno no servidor' }, 500);
  }
});
