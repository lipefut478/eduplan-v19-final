import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './FootballApp.jsx'
import './index.css'

// Validação de variáveis obrigatórias no boot — falha rápido em dev
const REQUIRED_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const missing = REQUIRED_ENV.filter(k => !import.meta.env[k]);
if (missing.length > 0) {
  document.getElementById('root').innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;
                background:#fef2f2;font-family:system-ui;padding:24px;">
      <div style="max-width:480px;background:#fff;border-radius:16px;padding:32px;
                  border:2px solid #fca5a5;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <div style="font-size:32px;margin-bottom:12px;">⚙️</div>
        <h2 style="color:#dc2626;font-size:18px;margin:0 0 8px">Configuração necessária</h2>
        <p style="color:#374151;font-size:14px;margin:0 0 16px">
          As seguintes variáveis de ambiente estão faltando no arquivo <code>.env</code>:
        </p>
        <pre style="background:#fef2f2;padding:12px;border-radius:8px;font-size:13px;
                    color:#dc2626;overflow:auto;">${missing.join('\n')}</pre>
        <p style="color:#6b7280;font-size:12px;margin:16px 0 0">
          Copie <code>.env.example</code> para <code>.env</code> e preencha os valores.
          Veja o README para instruções.
        </p>
      </div>
    </div>`;
  throw new Error(`Variáveis de ambiente faltando: ${missing.join(', ')}`);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
