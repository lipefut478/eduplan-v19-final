import { useState } from 'react'
import { supabase } from './supabaseClient'

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
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      setErro('Erro ao enviar o link. Verifique o e-mail e tente novamente.')
    } else {
      setMensagem('✅ Link enviado! Verifique sua caixa de entrada.')
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>EduPlan</h1>
        <p style={styles.subtitulo}>Digite seu e-mail para receber o link de acesso</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.botao}>
            {loading ? 'Enviando...' : 'Enviar Link de Acesso ✨'}
          </button>
        </form>

        {mensagem && <p style={styles.sucesso}>{mensagem}</p>}
        {erro && <p style={styles.erro}>{erro}</p>}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  titulo: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
  },
  subtitulo: {
    color: '#555',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
  },
  botao: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  sucesso: {
    marginTop: '1rem',
    color: '#16a34a',
    fontWeight: 'bold',
  },
  erro: {
    marginTop: '1rem',
    color: '#dc2626',
    fontWeight: 'bold',
  },
}