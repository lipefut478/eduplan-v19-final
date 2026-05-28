import { supabase } from '../supabaseClient';

export interface HealthResult {
  ok: boolean;
  latencyMs?: number;
  error?: string;
}

export interface AppHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  checks: {
    envVars: HealthResult & { missing?: string[] };
    supabase: HealthResult;
    aiProxy: HealthResult;
  };
}

const APP_VERSION = '1.0.0';

function checkEnvVars(): HealthResult & { missing?: string[] } {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const;
  const missing = required.filter((k) => !import.meta.env[k]);
  return missing.length > 0
    ? { ok: false, missing, error: `Variáveis faltando: ${missing.join(', ')}` }
    : { ok: true };
}

async function checkSupabase(): Promise<HealthResult> {
  const t0 = Date.now();
  try {
    // Usa .auth.getSession() como ping leve (não faz query no DB)
    const { error } = await supabase.auth.getSession();
    if (error) return { ok: false, error: error.message };
    return { ok: true, latencyMs: Date.now() - t0 };
  } catch (e) {
    return { ok: false, error: (e as Error).message, latencyMs: Date.now() - t0 };
  }
}

async function checkAiProxy(): Promise<HealthResult> {
  const t0 = Date.now();
  try {
    // Tenta invocar a função sem auth — esperamos 401, não 500/503
    // 401 = função está rodando e respondendo corretamente
    // 503/network error = função não deployada ou URL errada
    const { error } = await supabase.functions.invoke('ai-proxy', {
      body: { ping: true },
    });
    const latencyMs = Date.now() - t0;

    // FunctionsHttpError com status 401 = função está viva
    if (error && 'status' in error && (error as { status: number }).status === 401) {
      return { ok: true, latencyMs };
    }
    // Qualquer outro erro indica que a função não está disponível
    if (error) {
      const msg = (error as { message?: string }).message ?? String(error);
      // Se a mensagem indica "não autorizado" é 401 disfarçado — OK
      if (msg.toLowerCase().includes('autorizado') || msg.toLowerCase().includes('unauthorized')) {
        return { ok: true, latencyMs };
      }
      return { ok: false, error: msg, latencyMs };
    }
    return { ok: true, latencyMs };
  } catch (e) {
    return { ok: false, error: (e as Error).message, latencyMs: Date.now() - t0 };
  }
}

export async function checkAppHealth(): Promise<AppHealth> {
  const [envVars, supabaseCheck, aiProxy] = await Promise.all([
    Promise.resolve(checkEnvVars()),
    checkSupabase(),
    checkAiProxy(),
  ]);

  const checks = { envVars, supabase: supabaseCheck, aiProxy };
  const allOk = Object.values(checks).every((c) => c.ok);
  const anyFail = Object.values(checks).some((c) => !c.ok);

  return {
    status: allOk ? 'healthy' : anyFail ? 'degraded' : 'unhealthy',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    checks,
  };
}
