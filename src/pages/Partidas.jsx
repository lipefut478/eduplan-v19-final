import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Trophy, X, Save, Calendar, MapPin, BarChart2 } from 'lucide-react';
import { CATEGORIAS } from '../data/footballData';

const RESULTADOS = [
  { id: 'vitoria',  label: 'Vitória',  cor: '#16a34a' },
  { id: 'empate',   label: 'Empate',   cor: '#ca8a04' },
  { id: 'derrota',  label: 'Derrota',  cor: '#dc2626' },
  { id: 'pendente', label: 'Pendente', cor: '#6b7280' },
];

function PartidaModal({ partida, isDark, onClose, onSave }) {
  const [form, setForm] = useState(partida || {
    adversario: '', categoria: 'Sub-13', data: new Date().toISOString().split('T')[0],
    local: '', tipo: 'casa', gols_a_favor: 0, gols_contra: 0, resultado: 'pendente',
    observacoes: '', scouting: '',
  });

  const s = (l, d) => isDark ? d : l;
  const input = { width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none', boxSizing: 'border-box' };
  const label = { fontWeight: 600, fontSize: 13, color: s('#374151', '#d1d5db'), marginBottom: 4, display: 'block' };

  function calcResultado(gf, gc) {
    if (gf > gc) return 'vitoria';
    if (gf < gc) return 'derrota';
    return 'empate';
  }

  function salvar() {
    if (!form.adversario) return alert('Informe o adversário.');
    onSave({ ...form, resultado: form.resultado === 'pendente' && (form.gols_a_favor || form.gols_contra) ? calcResultado(form.gols_a_favor, form.gols_contra) : form.resultado });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: s('#fff', '#1f2937'), borderRadius: 16, padding: 28, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={s('#6b7280', '#9ca3af')} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 20 }}>{partida ? 'Editar Partida' : 'Nova Partida'}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={label}>Adversário *</label>
            <input style={input} value={form.adversario} onChange={e => setForm(f => ({ ...f, adversario: e.target.value }))} placeholder="Nome do time adversário" />
          </div>
          <div>
            <label style={label}>Categoria</label>
            <select style={input} value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Data</label>
            <input type="date" style={input} value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
          </div>
          <div>
            <label style={label}>Local</label>
            <input style={input} value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))} placeholder="Ex: Campo Municipal" />
          </div>
          <div>
            <label style={label}>Mandante</label>
            <select style={input} value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
              <option value="casa">Em Casa</option>
              <option value="fora">Fora</option>
              <option value="neutro">Campo Neutro</option>
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={label}>Placar</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', padding: 12, background: s('#f9fafb', '#111827'), borderRadius: 10 }}>
              <span style={{ fontWeight: 700, color: s('#111827', '#f3f4f6'), fontSize: 14 }}>Nós</span>
              <input type="number" min={0} max={50} style={{ ...input, width: 70, textAlign: 'center', fontSize: 22, fontWeight: 800, padding: 6 }} value={form.gols_a_favor} onChange={e => setForm(f => ({ ...f, gols_a_favor: Number(e.target.value) }))} />
              <span style={{ fontSize: 18, fontWeight: 700, color: s('#9ca3af', '#6b7280') }}>×</span>
              <input type="number" min={0} max={50} style={{ ...input, width: 70, textAlign: 'center', fontSize: 22, fontWeight: 800, padding: 6 }} value={form.gols_contra} onChange={e => setForm(f => ({ ...f, gols_contra: Number(e.target.value) }))} />
              <span style={{ fontWeight: 700, color: s('#111827', '#f3f4f6'), fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{form.adversario || '—'}</span>
            </div>
          </div>
          <div>
            <label style={label}>Status</label>
            <select style={input} value={form.resultado} onChange={e => setForm(f => ({ ...f, resultado: e.target.value }))}>
              {RESULTADOS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={label}>Observações da Partida</label>
            <textarea style={{ ...input, minHeight: 70, resize: 'vertical' }} value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} placeholder="Destaques, problemas, jogadores que se destacaram..." />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={label}>Scouting do Adversário</label>
            <textarea style={{ ...input, minHeight: 90, resize: 'vertical' }} value={form.scouting} onChange={e => setForm(f => ({ ...f, scouting: e.target.value }))} placeholder="Pontos fortes, fracos, formação tática típica, jogadores-chave..." />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={salvar} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            <Save size={16} /> Salvar Partida
          </button>
          <button onClick={onClose} style={{ padding: '12px 20px', borderRadius: 10, background: s('#f3f4f6', '#374151'), color: s('#374151', '#d1d5db'), border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default function Partidas({ session, isDark }) {
  const [lista, setLista] = useState([]);
  const [modal, setModal] = useState(null);
  const [filtro, setFiltro] = useState('todas');

  const s = (l, d) => isDark ? d : l;

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const { data } = await supabase.from('partidas').select('*').eq('user_id', session.user.id).order('data', { ascending: false });
    setLista(data || []);
  }

  async function salvar(form) {
    const payload = { ...form, user_id: session.user.id, updated_at: new Date().toISOString() };
    if (form.id) await supabase.from('partidas').update(payload).eq('id', form.id);
    else await supabase.from('partidas').insert([payload]);
    setModal(null);
    carregar();
  }

  async function excluir(id) {
    if (!confirm('Excluir partida?')) return;
    await supabase.from('partidas').delete().eq('id', id);
    carregar();
  }

  // Estatísticas
  const finalizadas = lista.filter(p => p.resultado !== 'pendente');
  const stats = {
    total: finalizadas.length,
    vitorias: finalizadas.filter(p => p.resultado === 'vitoria').length,
    empates: finalizadas.filter(p => p.resultado === 'empate').length,
    derrotas: finalizadas.filter(p => p.resultado === 'derrota').length,
    golsPro: finalizadas.reduce((a, p) => a + (p.gols_a_favor || 0), 0),
    golsContra: finalizadas.reduce((a, p) => a + (p.gols_contra || 0), 0),
  };
  const aproveitamento = stats.total > 0 ? Math.round(((stats.vitorias * 3 + stats.empates) / (stats.total * 3)) * 100) : 0;

  const filtered = lista.filter(p => filtro === 'todas' || p.resultado === filtro);
  const card = { background: s('#fff', '#1f2937'), borderRadius: 14, padding: 18, border: `1px solid ${s('#e5e7eb', '#374151')}` };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      {modal && <PartidaModal partida={modal === 'novo' ? null : modal} isDark={isDark} onClose={() => setModal(null)} onSave={salvar} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>Partidas</h1>
          <p style={{ fontSize: 14, color: s('#6b7280', '#9ca3af') }}>Registro de jogos, resultados e scouting</p>
        </div>
        <button onClick={() => setModal('novo')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
          <Plus size={18} /> Nova Partida
        </button>
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Aproveitamento', valor: `${aproveitamento}%`, cor: '#16a34a' },
            { label: 'Vitórias', valor: stats.vitorias, cor: '#16a34a' },
            { label: 'Empates', valor: stats.empates, cor: '#ca8a04' },
            { label: 'Derrotas', valor: stats.derrotas, cor: '#dc2626' },
            { label: 'Gols Pró', valor: stats.golsPro, cor: '#1d4ed8' },
            { label: 'Gols Contra', valor: stats.golsContra, cor: '#6b7280' },
            { label: 'Saldo', valor: (stats.golsPro - stats.golsContra >= 0 ? '+' : '') + (stats.golsPro - stats.golsContra), cor: (stats.golsPro - stats.golsContra) >= 0 ? '#16a34a' : '#dc2626' },
          ].map(s2 => (
            <div key={s2.label} style={{ ...card, borderTop: `3px solid ${s2.cor}`, padding: '14px 16px' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s2.cor }}>{s2.valor}</div>
              <div style={{ fontSize: 11, color: s('#6b7280', '#9ca3af'), fontWeight: 600 }}>{s2.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {['todas', 'vitoria', 'empate', 'derrota', 'pendente'].map(f => {
          const cfg = RESULTADOS.find(r => r.id === f);
          const ativo = filtro === f;
          return (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: ativo ? (cfg?.cor || '#16a34a') : s('#f3f4f6', '#374151'),
              color: ativo ? '#fff' : s('#374151', '#d1d5db'), border: 'none',
            }}>
              {f === 'todas' ? 'Todas' : cfg?.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: 48 }}>
          <Trophy size={40} color={s('#d1d5db', '#4b5563')} style={{ margin: '0 auto 12px' }} />
          <p style={{ color: s('#6b7280', '#9ca3af') }}>Nenhuma partida registrada.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(p => {
            const cfg = RESULTADOS.find(r => r.id === p.resultado);
            return (
              <div key={p.id} style={{ ...card, padding: '14px 18px', borderLeft: `4px solid ${cfg?.cor || '#6b7280'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{ minWidth: 80, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: cfg?.cor, textTransform: 'uppercase' }}>{cfg?.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s('#111827', '#f3f4f6'), marginTop: 2 }}>
                      {p.gols_a_favor ?? 0} × {p.gols_contra ?? 0}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: s('#111827', '#f3f4f6') }}>vs {p.adversario}</div>
                    <div style={{ fontSize: 12, color: s('#6b7280', '#9ca3af'), display: 'flex', gap: 12, marginTop: 2 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> {p.data}</span>
                      {p.local && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={11} /> {p.local} ({p.tipo})</span>}
                      <span>{p.categoria}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setModal(p)} style={{ padding: '6px 14px', borderRadius: 7, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Editar</button>
                    <button onClick={() => excluir(p.id)} style={{ padding: '6px 10px', borderRadius: 7, background: s('#fee2e2', '#7f1d1d'), color: '#dc2626', border: 'none', cursor: 'pointer' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
