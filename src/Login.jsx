import { useState } from 'react'
import { supabase } from './supabaseClient'

const FEATURES = [
  { icon: '📋', titulo: 'Planejamento Macro, Meso e Micro', desc: 'Periodização completa da temporada anual até o treino individual.' },
  { icon: '🤖', titulo: 'IA Geradora de Treinos', desc: 'Crie planos de treino completos automaticamente com Claude AI.' },
  { icon: '🎯', titulo: 'Lousa Tática Interativa', desc: 'Campo de futebol, society e futsal com drag-and-drop de jogadores.' },
  { icon: '📚', titulo: '1300+ Exercícios', desc: 'Banco de atividades com busca avançada e filtros por categoria.' },
  { icon: '👥', titulo: 'Elenco e Avaliação', desc: 'Cadastre jogadores e acompanhe avaliação em 5 atributos.' },
  { icon: '📅', titulo: 'Calendário Integrado', desc: 'Visualize todos os treinos e eventos em um só lugar.' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErro('')
    setMensagem('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) setErro('Erro ao enviar o link. Verifique o e-mail e tente novamente.')
    else setMensagem('✅ Link enviado! Verifique sua caixa de entrada.')

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #16a34a 100%)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center', minHeight: '100vh' }}>
        {/* Lado esquerdo - hero */}
        <div style={{ color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>⚽</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em' }}>FootballPlan</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Pro Edition</div>
            </div>
          </div>

          <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: '-0.03em' }}>
            O planejador profissional<br />para escolas de futebol.
          </h1>
          <p style={{ fontSize: 17, opacity: 0.92, lineHeight: 1.6, marginBottom: 32, maxWidth: 480 }}>
            Periodização Macro → Meso → Micro com IA, lousa tática para futebol, society e futsal, banco com mais de 1.300 exercícios e muito mais.
          </p>

          {/* Features grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, maxWidth: 560 }}>
            {FEATURES.map(f => (
              <div key={f.titulo} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{f.titulo}</div>
                <div style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lado direito - login */}
        <div style={{ background: '#fff', padding: '40px 36px', borderRadius: 20, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Entrar / Cadastrar</h2>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Digite seu e-mail e receba o link de acesso.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '13px 16px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15,
                outline: 'none', transition: 'border 0.15s',
              }}
              onFocus={e => e.currentTarget.style.border = '2px solid #16a34a'}
              onBlur={e => e.currentTarget.style.border = '2px solid #e5e7eb'}
            />
            <button type="submit" disabled={loading} style={{
              padding: '14px', borderRadius: 10, border: 'none',
              background: loading ? '#86efac' : '#16a34a', color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}>
              {loading ? 'Enviando...' : 'Enviar Link Mágico ✨'}
            </button>
          </form>

          {mensagem && (
            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: '#dcfce7', color: '#15803d', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{mensagem}</div>
          )}
          {erro && (
            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: '#fee2e2', color: '#dc2626', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{erro}</div>
          )}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Sem senhas. Sem complicação. Apenas seu e-mail.</p>
          </div>
        </div>
      </div>

      {/* Mobile responsivo */}
      <style>{`
        @media (max-width: 900px) {
          .lp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
