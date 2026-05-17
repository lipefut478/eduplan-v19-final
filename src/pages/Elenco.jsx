import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Users, Star, X, Save, User } from 'lucide-react';
import { CATEGORIAS } from '../data/footballData';

const POSICOES = ['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante'];
const ATRIBUTOS = [
  { id: 'fisico',  label: 'Físico' },
  { id: 'tecnico', label: 'Técnico' },
  { id: 'tatico',  label: 'Tático' },
  { id: 'mental',  label: 'Mental' },
  { id: 'social',  label: 'Social' },
];

function JogadorModal({ jogador, isDark, onClose, onSave }) {
  const [form, setForm] = useState(jogador || {
    nome: '', idade: 10, posicao: 'Meia', numero: 10, categoria: 'Sub-11',
    avaliacao: { fisico: 5, tecnico: 5, tatico: 5, mental: 5, social: 5 },
    observacoes: '',
  });

  const s = (l, d) => isDark ? d : l;
  const input = { width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none', boxSizing: 'border-box' };
  const label = { fontWeight: 600, fontSize: 13, color: s('#374151', '#d1d5db'), marginBottom: 4, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: s('#fff', '#1f2937'), borderRadius: 16, padding: 28, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={s('#6b7280', '#9ca3af')} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 20 }}>{jogador ? 'Editar Jogador' : 'Novo Jogador'}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={label}>Nome *</label>
            <input style={input} value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome completo" />
          </div>
          <div>
            <label style={label}>Idade</label>
            <input type="number" style={input} value={form.idade} onChange={e => setForm(f => ({ ...f, idade: Number(e.target.value) }))} min={4} max={50} />
          </div>
          <div>
            <label style={label}>Camisa</label>
            <input type="number" style={input} value={form.numero} onChange={e => setForm(f => ({ ...f, numero: Number(e.target.value) }))} min={1} max={99} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <div>
            <label style={label}>Posição</label>
            <select style={input} value={form.posicao} onChange={e => setForm(f => ({ ...f, posicao: e.target.value }))}>
              {POSICOES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Categoria</label>
            <select style={input} value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 12 }}>Avaliação (1-10)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {ATRIBUTOS.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 80, fontSize: 13, fontWeight: 600, color: s('#374151', '#d1d5db') }}>{a.label}</span>
              <input
                type="range" min={1} max={10}
                value={form.avaliacao[a.id]}
                onChange={e => setForm(f => ({ ...f, avaliacao: { ...f.avaliacao, [a.id]: Number(e.target.value) } }))}
                style={{ flex: 1, accentColor: '#16a34a' }}
              />
              <span style={{ width: 30, fontSize: 14, fontWeight: 800, color: '#16a34a', textAlign: 'right' }}>{form.avaliacao[a.id]}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={label}>Observações</label>
          <textarea style={{ ...input, minHeight: 70, resize: 'vertical' }} value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} placeholder="Pontos fortes, pontos a melhorar..." />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => onSave(form)} disabled={!form.nome} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: form.nome ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 14, opacity: form.nome ? 1 : 0.5 }}>
            <Save size={16} /> Salvar
          </button>
          <button onClick={onClose} style={{ padding: '12px 20px', borderRadius: 10, background: s('#f3f4f6', '#374151'), color: s('#374151', '#d1d5db'), border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default function Elenco({ session, isDark }) {
  const [lista, setLista] = useState([]);
  const [modal, setModal] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const s = (l, d) => isDark ? d : l;

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const { data } = await supabase.from('jogadores').select('*').eq('user_id', session.user.id).order('numero', { ascending: true });
    setLista(data || []);
  }

  async function salvar(form) {
    const payload = { ...form, user_id: session.user.id, updated_at: new Date().toISOString() };
    if (form.id) await supabase.from('jogadores').update(payload).eq('id', form.id);
    else await supabase.from('jogadores').insert([payload]);
    setModal(null);
    carregar();
  }

  async function excluir(id) {
    if (!confirm('Excluir jogador?')) return;
    await supabase.from('jogadores').delete().eq('id', id);
    carregar();
  }

  const filtered = lista.filter(j => !filtroCategoria || j.categoria === filtroCategoria);

  function mediaAvaliacao(av) {
    if (!av) return 0;
    const vals = Object.values(av);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10;
  }

  const card = { background: s('#fff', '#1f2937'), borderRadius: 14, padding: 18, border: `1px solid ${s('#e5e7eb', '#374151')}` };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      {modal && <JogadorModal jogador={modal === 'novo' ? null : modal} isDark={isDark} onClose={() => setModal(null)} onSave={salvar} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>Elenco</h1>
          <p style={{ fontSize: 14, color: s('#6b7280', '#9ca3af') }}>{lista.length} jogador{lista.length !== 1 ? 'es' : ''} no elenco</p>
        </div>
        <button onClick={() => setModal('novo')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
          <Plus size={18} /> Adicionar Jogador
        </button>
      </div>

      <div style={{ marginBottom: 18 }}>
        <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, background: s('#fff', '#1f2937'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}` }}>
          <option value="">Todas as categorias</option>
          {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: 48 }}>
          <Users size={40} color={s('#d1d5db', '#4b5563')} style={{ margin: '0 auto 12px' }} />
          <p style={{ color: s('#6b7280', '#9ca3af') }}>Nenhum jogador no elenco. Adicione o primeiro!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(j => {
            const media = mediaAvaliacao(j.avaliacao);
            return (
              <div key={j.id} style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>
                    {j.numero}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: s('#111827', '#f3f4f6') }}>{j.nome}</div>
                    <div style={{ fontSize: 12, color: s('#6b7280', '#9ca3af') }}>{j.posicao} · {j.idade} anos · {j.categoria}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: media >= 7 ? '#16a34a' : media >= 5 ? '#ca8a04' : '#dc2626' }}>{media}</div>
                    <div style={{ fontSize: 10, color: s('#9ca3af', '#6b7280') }}>média</div>
                  </div>
                </div>
                {/* mini gráfico de barras */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                  {ATRIBUTOS.map(a => (
                    <div key={a.id} style={{ flex: 1 }}>
                      <div style={{ height: 6, background: s('#f3f4f6', '#374151'), borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(j.avaliacao?.[a.id] || 0) * 10}%`, background: '#16a34a' }} />
                      </div>
                      <div style={{ fontSize: 9, color: s('#6b7280', '#9ca3af'), textAlign: 'center', marginTop: 2 }}>{a.label.slice(0, 3)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setModal(j)} style={{ flex: 1, padding: '7px 0', borderRadius: 7, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Editar</button>
                  <button onClick={() => excluir(j.id)} style={{ padding: '7px 12px', borderRadius: 7, background: s('#fee2e2', '#7f1d1d'), color: '#dc2626', border: 'none', cursor: 'pointer' }}><Trash2 size={13} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
