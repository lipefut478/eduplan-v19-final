import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Send, Bot, User, Trash2, Loader, Sparkles } from 'lucide-react';
import { buildMethodologyPrompt } from '../data/footballData';
import { toast } from '../lib/toast';
import { MESSAGES, messageFromSupabaseError } from '../lib/messages';

const PROMPTS_RAPIDOS = [
  'Como ensinar passe curto para iniciantes?',
  'Sugestões para melhorar a finalização do meu time',
  'Como trabalhar pressão alta no Sub-15?',
  'Exercícios para desenvolver a saída de bola',
  'Como adaptar treinos para tempo chuvoso?',
  'Como dividir uma partida em microciclos?',
];

export default function ChatIA({ session, isDark, metodologia }) {
  const [mensagens, setMensagens] = useState([
    { role: 'assistant', content: 'Olá! Sou seu assistente especialista em futebol. Posso ajudar com táticas, exercícios, periodização, gestão de elenco e qualquer dúvida sobre treino. Como posso ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const endRef = useRef(null);

  const s = (l, d) => isDark ? d : l;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  async function enviar(textoOverride) {
    const texto = textoOverride || input.trim();
    if (!texto || enviando) return;

    const novasMsgs = [...mensagens, { role: 'user', content: texto }];
    setMensagens(novasMsgs);
    setInput('');
    setEnviando(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-proxy', {
        body: {
          model: 'claude-sonnet-4-6',
          max_tokens: 1500,
          system: [{ type: 'text', text: `${buildMethodologyPrompt(metodologia)}\n\nVocê é um assistente especialista em futebol e treinamento esportivo. Responda de forma clara, prática e contextualizada. Use linguagem brasileira informal e amigável.`, cache_control: { type: 'ephemeral' } }],
          messages: novasMsgs.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
        },
      });

      if (error) throw new Error(error.message || 'Erro no servidor');
      const reply = data?.content?.[0]?.text || 'Erro ao processar resposta.';
      setMensagens(m => [...m, { role: 'assistant', content: reply }]);
      await supabase.from('chat_messages').insert([
        { user_id: session.user.id, role: 'user', content: texto },
        { user_id: session.user.id, role: 'assistant', content: reply },
      ]);
    } catch (e) {
      toast.error(messageFromSupabaseError(e instanceof Error ? { message: e.message } : e));
      setMensagens(m => [...m, { role: 'assistant', content: '❌ Erro ao processar sua mensagem. Tente novamente.' }]);
    }
    setEnviando(false);
  }

  function limpar() {
    if (!confirm('Limpar todo o histórico do chat?')) return;
    setMensagens([{ role: 'assistant', content: 'Histórico limpo. Como posso ajudar?' }]);
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px', height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={22} color="#1d4ed8" /> Assistente IA
          </h1>
          <p style={{ fontSize: 13, color: s('#6b7280', '#9ca3af') }}>Pergunte qualquer coisa sobre futebol e treinamento</p>
        </div>
        <button type="button" onClick={limpar} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: s('#fee2e2', '#7f1d1d'), color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          <Trash2 size={14} /> Limpar
        </button>
      </div>

      {/* Mensagens */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: s('#fff', '#1f2937'), borderRadius: 16, border: `1px solid ${s('#e5e7eb', '#374151')}`, marginBottom: 12 }}>
        {mensagens.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, flexDirection: isUser ? 'row-reverse' : 'row' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: isUser ? '#16a34a' : '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {isUser ? <User size={16} color="#fff" /> : <Bot size={16} color="#fff" />}
              </div>
              <div style={{
                maxWidth: '75%',
                background: isUser ? '#16a34a' : s('#f3f4f6', '#111827'),
                color: isUser ? '#fff' : s('#111827', '#f3f4f6'),
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>{m.content}</div>
            </div>
          );
        })}
        {enviando && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="#fff" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, background: s('#f3f4f6', '#111827'), color: s('#6b7280', '#9ca3af'), fontSize: 13 }}>
              <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Pensando...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {mensagens.length <= 1 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {PROMPTS_RAPIDOS.map(p => (
            <button type="button" key={p} onClick={() => enviar(p)} style={{
              padding: '6px 12px', borderRadius: 16, fontSize: 12, background: s('#dcfce7', '#052e16'),
              color: '#15803d', border: 'none', cursor: 'pointer', fontWeight: 500,
            }}>{p}</button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
          placeholder="Pergunte ao assistente..."
          rows={2}
          style={{ flex: 1, padding: '12px 16px', borderRadius: 12, fontSize: 14, background: s('#fff', '#1f2937'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
        <button type="button" onClick={() => enviar()} disabled={enviando || !input.trim()} style={{ padding: '12px 20px', borderRadius: 12, background: '#1d4ed8', color: '#fff', border: 'none', cursor: enviando ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: enviando ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Send size={16} />
        </button>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
