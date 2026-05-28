import React, { useState, useEffect } from 'react';
import { checkAppHealth } from '../lib/healthCheck';
import { Activity, CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

function CheckRow({ label, result, isDark }) {
  const s = (l, d) => isDark ? d : l;
  const icon = result?.ok
    ? <CheckCircle size={16} color="#16a34a" />
    : <XCircle size={16} color="#dc2626" />;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 16px', borderRadius: 10,
      background: s(result?.ok ? '#f0fdf4' : '#fef2f2', result?.ok ? '#052e16' : '#450a0a'),
      marginBottom: 8, border: `1px solid ${result?.ok ? '#bbf7d0' : '#fca5a5'}`,
    }}>
      <div style={{ marginTop: 1 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: s('#111827', '#f3f4f6') }}>{label}</div>
        {result?.latencyMs !== undefined && (
          <div style={{ fontSize: 12, color: s('#6b7280', '#9ca3af'), display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Clock size={11} /> {result.latencyMs}ms
          </div>
        )}
        {result?.missing && (
          <div style={{ fontSize: 12, color: '#dc2626', marginTop: 2 }}>
            Faltando: {result.missing.join(', ')}
          </div>
        )}
        {result?.error && (
          <div style={{ fontSize: 12, color: '#dc2626', marginTop: 2 }}>{result.error}</div>
        )}
      </div>
    </div>
  );
}

export default function Health({ isDark }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const s = (l, d) => isDark ? d : l;

  useEffect(() => {
    checkAppHealth().then(result => { setHealth(result); setLoading(false); });
  }, []);

  async function handleRefresh() {
    setLoading(true);
    const result = await checkAppHealth();
    setHealth(result);
    setLoading(false);
  }

  const STATUS_COLOR = {
    healthy:   '#16a34a',
    degraded:  '#d97706',
    unhealthy: '#dc2626',
  };

  const STATUS_LABEL = {
    healthy:   '✅ Saudável',
    degraded:  '⚠️ Degradado',
    unhealthy: '❌ Inoperante',
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Activity size={24} color="#16a34a" />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: s('#111827', '#f3f4f6'), margin: 0 }}>
            Health Check
          </h1>
          <p style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), margin: 0 }}>
            Status dos serviços do FootballPlan
          </p>
        </div>
        <button type="button" onClick={handleRefresh} disabled={loading} style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          background: s('#f3f4f6', '#374151'), color: s('#374151', '#d1d5db'), fontWeight: 600, fontSize: 13,
        }}>
          <RefreshCw size={14} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
          {loading ? 'Verificando...' : 'Atualizar'}
        </button>
      </div>

      {health && !loading && (
        <>
          {/* Status geral */}
          <div style={{
            padding: '16px 20px', borderRadius: 12, marginBottom: 20,
            background: s('#fff', '#1f2937'), border: `2px solid ${STATUS_COLOR[health.status]}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 28 }}>
              {health.status === 'healthy' ? '✅' : health.status === 'degraded' ? '⚠️' : '❌'}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: STATUS_COLOR[health.status] }}>
                {STATUS_LABEL[health.status]}
              </div>
              <div style={{ fontSize: 12, color: s('#6b7280', '#9ca3af'), marginTop: 2 }}>
                v{health.version} · {new Date(health.timestamp).toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Checks individuais */}
          <div>
            <CheckRow label="Variáveis de ambiente"  result={health.checks.envVars}  isDark={isDark} />
            <CheckRow label="Supabase (Auth/DB)"      result={health.checks.supabase} isDark={isDark} />
            <CheckRow label="Edge Function ai-proxy"  result={health.checks.aiProxy}  isDark={isDark} />
          </div>

          {health.status !== 'healthy' && (
            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 10,
              background: s('#fffbeb', '#451a03'), border: '1px solid #fbbf24',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <AlertTriangle size={16} color="#d97706" style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: s('#92400e', '#fde68a') }}>
                Consulte TESTE_MANUAL_ONDA_1.md para troubleshooting detalhado.
              </div>
            </div>
          )}
        </>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: s('#6b7280', '#9ca3af') }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
          <p style={{ fontSize: 14 }}>Verificando serviços...</p>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
