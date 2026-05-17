import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Save, Trash2, Calendar, ChevronDown } from 'lucide-react';
import { CATEGORIAS, MESES_ANO, FASES_MACRO } from '../data/footballData';

function initMeses() {
  return MESES_ANO.map(m => ({ mes: m, fase: '', objetivos: '', volume: 'medio', intensidade: 'medio' }));
}

export default function MacroPlano({ session, isDark, metodologia }) {
  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ titulo: '', categoria: 'Sub-11', temporada: '2025/2026', meses: initMeses() });
  const [saving, setSaving] = useState(false);

  const s = (l, d) => isDark ? d : l;

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const { data } = await supabase.from('planos_macro').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    setLista(data || []);
  }

  async function salvar() {
    if (!form.titulo) return alert('Informe um título para o plano.');
    setSaving(true);
    const payload = { user_id: session.user.id, ...form, updated_at: new Date().toISOString() };
    if (editando) {
      await supabase.from('planos_macro').update(payload).eq('id', editando);
    } else {
      await supabase.from('planos_macro').insert([payload]);
    }
    setSaving(false);
    setEditando(null);
    setForm({ titulo: '', categoria: 'Sub-11', temporada: '2025/2026', meses: initMeses() });
    carregar();
  }

  async function excluir(id) {
    if (!confirm('Excluir plano macro?')) return;
    await supabase.from('planos_macro').delete().eq('id', id);
    carregar();
  }

  function abrirEditar(p) {
    setEditando(p.id);
    setForm({ titulo: p.titulo, categoria: p.categoria, temporada: p.temporada, meses: p.meses?.length ? p.meses : initMeses() });
  }

  function setMes(i, field, value) {
    setForm(f => {
      const meses = [...f.meses];
      meses[i] = { ...meses[i], [field]: value };
      return { ...f, meses };
    });
  }

  const card = { background: s('#fff', '#1f2937'), borderRadius: 16, padding: 24, marginBottom: 20, border: `1px solid ${s('#e5e7eb', '#374151')}` };
  const input = { width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none', boxSizing: 'border-box' };
  const label = { fontWeight: 600, fontSize: 13, color: s('#374151', '#d1d5db'), marginBottom: 4, display: 'block' };

  const CARGA = ['baixo', 'medio', 'alto'];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>Planejamento Macro</h1>
          <p style={{ color: s('#6b7280', '#9ca3af'), fontSize: 14 }}>Planejamento anual da temporada por categoria.</p>
        </div>
        {!editando && (
          <button onClick={() => setEditando('novo')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            <Plus size={18} /> Novo Plano Macro
          </button>
        )}
      </div>

      {editando && (
        <div style={card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 20 }}>
            {editando === 'novo' ? 'Novo Plano Macro' : 'Editar Plano Macro'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={label}>Título do Plano</label>
              <input style={input} value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ex: Temporada 2025/2026 Sub-13" />
            </div>
            <div>
              <label style={label}>Categoria</label>
              <select style={input} value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Temporada</label>
              <input style={input} value={form.temporada} onChange={e => setForm(f => ({ ...f, temporada: e.target.value }))} placeholder="2025/2026" />
            </div>
          </div>

          {metodologia?.pilares?.length > 0 && (
            <div style={{ background: s('#f0fdf4', '#052e16'), borderRadius: 10, padding: '12px 16px', marginBottom: 20, border: `1px solid ${s('#bbf7d0', '#166534')}` }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 6 }}>REFERÊNCIA METODOLÓGICA</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {metodologia.pilares.map((p, i) => (
                  <span key={i} style={{ background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{p}</span>
                ))}
              </div>
            </div>
          )}

          <h3 style={{ fontSize: 15, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 14 }}>Planejamento Mensal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {form.meses.map((m, i) => {
              const fase = FASES_MACRO.find(f => f.id === m.fase);
              return (
                <div key={i} style={{
                  borderRadius: 10, padding: 14, border: `2px solid ${fase ? fase.cor : s('#e5e7eb', '#374151')}`,
                  background: s('#f9fafb', '#111827'),
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: s('#111827', '#f3f4f6'), marginBottom: 8 }}>{m.mes}</div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ ...label, fontSize: 11 }}>Fase</label>
                    <select style={{ ...input, fontSize: 12, padding: '6px 8px' }} value={m.fase} onChange={e => setMes(i, 'fase', e.target.value)}>
                      <option value="">Selecione...</option>
                      {FASES_MACRO.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ ...label, fontSize: 11 }}>Objetivos</label>
                    <textarea style={{ ...input, resize: 'none', minHeight: 48, fontSize: 12 }} value={m.objetivos} onChange={e => setMes(i, 'objetivos', e.target.value)} placeholder="Objetivos do mês..." />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <div>
                      <label style={{ ...label, fontSize: 11 }}>Volume</label>
                      <select style={{ ...input, fontSize: 12, padding: '6px 8px' }} value={m.volume} onChange={e => setMes(i, 'volume', e.target.value)}>
                        {CARGA.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...label, fontSize: 11 }}>Intensidade</label>
                      <select style={{ ...input, fontSize: 12, padding: '6px 8px' }} value={m.intensidade} onChange={e => setMes(i, 'intensidade', e.target.value)}>
                        {CARGA.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={salvar} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
              <Save size={18} /> {saving ? 'Salvando...' : 'Salvar Plano Macro'}
            </button>
            <button onClick={() => setEditando(null)} style={{ padding: '12px 20px', borderRadius: 10, background: s('#f3f4f6', '#374151'), color: s('#374151', '#d1d5db'), border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {!editando && (
        <div>
          {lista.length === 0 ? (
            <div style={{ ...card, textAlign: 'center', padding: 48 }}>
              <Calendar size={40} color={s('#d1d5db', '#4b5563')} style={{ margin: '0 auto 12px' }} />
              <p style={{ color: s('#6b7280', '#9ca3af') }}>Nenhum plano macro criado ainda.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {lista.map(p => (
                <div key={p.id} style={{ ...card, margin: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>{p.titulo}</div>
                  <div style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 4 }}>{p.categoria} — {p.temporada}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                    {(p.meses || []).filter(m => m.fase).map((m, i) => {
                      const fase = FASES_MACRO.find(f => f.id === m.fase);
                      return <span key={i} style={{ fontSize: 11, background: fase ? fase.cor + '22' : '#f3f4f6', color: fase ? fase.cor : '#6b7280', borderRadius: 12, padding: '2px 8px', fontWeight: 600 }}>{m.mes}: {fase?.label}</span>;
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => abrirEditar(p)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Editar</button>
                    <button onClick={() => excluir(p.id)} style={{ padding: '8px 12px', borderRadius: 8, background: s('#fee2e2', '#7f1d1d'), color: '#dc2626', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
