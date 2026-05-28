// Lógica pura extraída da Edge Function — testável sem Deno runtime
export const RATE_PER_MINUTE = 20;
export const RATE_PER_DAY = 200;
export const MAX_TOKENS_CAP = 8000;
export const PRICE_INPUT_M = 3.0;   // USD por milhão de tokens de entrada
export const PRICE_OUTPUT_M = 15.0; // USD por milhão de tokens de saída

export type RateLimitResult =
  | { exceeded: false }
  | { exceeded: true; message: string };

export function checkRateLimit(
  countMin: number | null,
  countDay: number | null,
): RateLimitResult {
  if ((countMin ?? 0) >= RATE_PER_MINUTE) {
    return {
      exceeded: true,
      message: `Limite de ${RATE_PER_MINUTE} req/min atingido. Aguarde.`,
    };
  }
  if ((countDay ?? 0) >= RATE_PER_DAY) {
    return {
      exceeded: true,
      message: `Limite de ${RATE_PER_DAY} req/dia atingido.`,
    };
  }
  return { exceeded: false };
}

export function estimateCost(inputTokens: number, outputTokens: number): number {
  return (
    (inputTokens / 1_000_000) * PRICE_INPUT_M +
    (outputTokens / 1_000_000) * PRICE_OUTPUT_M
  );
}

export function sanitizePayload(body: Record<string, unknown>) {
  if (!body.messages || !Array.isArray(body.messages)) {
    throw new Error('Campo "messages" obrigatório e deve ser um array.');
  }
  return {
    model: (body.model as string | undefined) ?? 'claude-sonnet-4-6',
    max_tokens: Math.min((body.max_tokens as number | undefined) ?? 4000, MAX_TOKENS_CAP),
    ...(body.system ? { system: body.system } : {}),
    messages: body.messages,
  };
}

export function buildUsageRecord(
  userId: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  endpoint = 'ai-proxy',
) {
  return {
    user_id: userId,
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    estimated_cost_usd: estimateCost(inputTokens, outputTokens),
    endpoint,
  };
}
