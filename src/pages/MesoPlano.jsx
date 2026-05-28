import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Save, Trash2, BarChart2 } from 'lucide-react';
import { CATEGORIAS, MESES_ANO } from '../data/footballData';

function initSemanas() {
  return [1, 2, 3, 4].map(n => ({
    semana: n, objetivos: '', num_treinos: 3, foco: '', volume: 'medio', intensidade: 'medio',
  }));
}

export default function MesoPlano({ session, isDark, metodologia }) {
  const [lista, setLista] = useState([]);
  const [macros, setMacros] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ titulo: '', categoria: 'Sub-11', mes_ref: 'Janeiro', macro_id: '', semanas: initSemanas(), justificativa_metodologica: '' });
  const [saving, setSaving] = useState(false);

  const s = (l, d) => isDark ? d : l;


  async function carregar() {
    const { data } = await supabase.from('planos_meso').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    setLista(data || []);
  }

  async function carregarMacros() {
    const { data } = await supabase.from('planos_macro').select('id, titulo, categoria').eq('user_id', session.user.id);
    setMacros(data || []);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { carregar(); carregarMacros(); }, []);

  async function salvar() {
    if (!form.titulo) return alert('Informe um título.');
    setSaving(true);
    const payload = { user_id: session.user.id, ...form, macro_id: form.macro_id || null, updated_at: new Date().toISOString() };
    if (editando && editando !== 'novo') {
      await supabase.from('planos_meso').update(payload).eq('id', editando);
    } else {
      await supabase.from('planos_meso').insert([payload]);
    }
    setSaving(false);
    setEditando(null);
    setForm({ titulo: '', categoria: 'Sub-11', mes_ref: 'Janeiro', macro_id: '', semanas: initSemanas(), justificativa_metodologica: '' });
    carregar();
  }

  async function excluir(id) {
    if (!confirm('Excluir plano meso?')) return;
    await supabase.from('planos_meso').delete().eq('id', id);
    carregar();
  }

  function abrirEditar(p) {
    setEditando(p.id);
    setForm({ titulo: p.titulo, categoria: p.categoria, mes_ref: p.mes_ref, macro_id: p.macro_id || '', semanas: p.semanas?.length ? p.semanas : initSemanas(), justificativa_metodologica: p.justificativa_metodologica || '' });
  }

  function setSemana(i, field, val) {
    setForm(f => { const s = [...f.semanas]; s[i] = { ...s[i], [field]: val }; return { ...f, semanas: s }; });
  }

  const card = { background: s('#fff', '#1f2937'), borderRadius: 16, padding: 24, marginBottom: 20, border: `1px solid ${s('#e5e7eb', '#374151')}` };
  const input = { width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none', boxSizing: 'border-box' };
  const label = { fontWeight: 600, fontSize: 13, color: s('#374151', '#d1d5db'), marginBottom: 4, display: 'block' };
  const CARGA = ['baixo', 'medio', 'alto'];
  const CARGA_COR = { baixo: '#0891b2', medio: '#ca8a04', alto: '#dc2626' };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>Planejamento Meso</h1>
          <p style={{ color: s('#6b7280', '#9ca3af'), fontSize: 14 }}>Ciclos mensais de treino vinculados ao plano macro.</p>
        </div>
        {!editando && (
          <button type="button" onClick={() => setEditando('novo')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            <Plus size={18} /> Novo Plano Meso
          </button>
        )}
      </div>

      {editando && (
        <div style={card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 20 }}>
            {editando === 'novo' ? 'Novo Plano Meso' : 'Editar Plano Meso'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={label}>Título</label>
              <input style={input} value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ex: Ciclo Técnico Janeiro" />
            </div>
            <div>
              <label style={label}>Categoria</label>
              <select style={input} value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Mês de Referência</label>
              <select style={input} value={form.mes_ref} onChange={e => setForm(f => ({ ...f, mes_ref: e.target.value }))}>
                {MESES_ANO.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Vincular a Macro</label>
              <select style={input} value={form.macro_id} onChange={e => setForm(f => ({ ...f, macro_id: e.target.value }))}>
                <option value="">Nenhum</option>
                {macros.map(m => <option key={m.id} value={m.id}>{m.titulo} ({m.categoria})</option>)}
              </select>
            </div>
          </div>

          {metodologia?.pilares?.length > 0 && (
            <div style={{ background: s('#f0fdf4', '#052e16'), borderRadius: 10, padding: '12px 16px', marginBottom: 20, border: `1px solid ${s('#bbf7d0', '#166534')}` }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 6 }}>REFERÊNCIA METODOLÓGICA</p>
              <p style={{ fontSize: 12, color: s('#374151', '#d1d5db') }}>{metodologia.estilo_jogo}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {metodologia.pilares.map((p, i) => (
                  <span key={i} style={{ background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{p}</span>
                ))}
              </div>
            </div>
          )}

          <h3 style={{ fontSize: 15, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 14 }}>Semanas do Ciclo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 20 }}>
            {form.semanas.map((sem, i) => (
              <div key={i} style={{ borderRadius: 12, padding: 16, background: s('#f9fafb', '#111827'), border: `1px solid ${s('#e5e7eb', '#374151')}` }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: s('#111827', '#f3f4f6'), marginBottom: 10 }}>Semana {sem.semana}</div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ ...label, fontSize: 11 }}>Objetivos da Semana</label>
                  <textarea style={{ ...input, minHeight: 52, resize: 'none', fontSize: 12 }} value={sem.objetivos} onChange={e => setSemana(i, 'objetivos', e.target.value)} placeholder="Objetivos..." />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ ...label, fontSize: 11 }}>Foco Técnico/Tático</label>
                  <input style={{ ...input, fontSize: 12, padding: '6px 10px' }} value={sem.foco} onChange={e => setSemana(i, 'foco', e.target.value)} placeholder="Ex: Cruzamento e finalização" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  <div>
                    <label style={{ ...label, fontSize: 11 }}>Nº Treinos</label>
                    <input type="number" style={{ ...input, fontSize: 12, padding: '6px 10px' }} value={sem.num_treinos} onChange={e => setSemana(i, 'num_treinos', Number(e.target.value))} min={1} max={7} />
                  </div>
                  <div>
                    <label style={{ ...label, fontSize: 11 }}>Volume</label>
                    <select style={{ ...input, fontSize: 12, padding: '6px 8px' }} value={sem.volume} onChange={e => setSemana(i, 'volume', e.target.value)}>
                      {CARGA.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ ...label, fontSize: 11 }}>Intensidade</label>
                    <select style={{ ...input, fontSize: 12, padding: '6px 8px' }} value={sem.intensidade} onChange={e => setSemana(i, 'intensidade', e.target.value)}>
                      {CARGA.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {['volume', 'intensidade'].map(campo => {
                    const val = sem[campo];
                    return <span key={campo} style={{ fontSize: 11, background: CARGA_COR[val] + '22', color: CARGA_COR[val], borderRadius: 12, padding: '2px 8px', fontWeight: 600, textTransform: 'capitalize' }}>{campo}: {val}</span>;
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={label}>Como este ciclo aplica a metodologia da escola?</label>
            <textarea style={{ ...input, minHeight: 70, resize: 'vertical' }} value={form.justificativa_metodologica} onChange={e => setForm(f => ({ ...f, justificativa_metodologica: e.target.value }))} placeholder="Descreva como este meso está alinhado com os pilares da metodologia..." />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={salvar} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
              <Save size={18} /> {saving ? 'Salvando...' : 'Salvar Plano Meso'}
            </button>
            <button type="button" onClick={() => setEditando(null)} style={{ padding: '12px 20px', borderRadius: 10, background: s('#f3f4f6', '#374151'), color: s('#374151', '#d1d5db'), border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
          </div>
        </div>
      )}

      {!editando && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {lista.length === 0 ? (
            <div style={{ ...card, gridColumn: '1/-1', textAlign: 'center', padding: 48 }}>
              <BarChart2 size={40} color={s('#d1d5db', '#4b5563')} style={{ margin: '0 auto 12px' }} />
              <p style={{ color: s('#6b7280', '#9ca3af') }}>Nenhum plano meso criado ainda.</p>
            </div>
          ) : lista.map(p => (
            <div key={p.id} style={{ ...card, margin: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>{p.titulo}</div>
              <div style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 4 }}>{p.categoria} — {p.mes_ref}</div>
              <div style={{ fontSize: 12, color: s('#9ca3af', '#6b7280'), marginBottom: 12 }}>{(p.semanas || []).length} semanas</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => abrirEditar(p)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Editar</button>
                <button type="button" onClick={() => excluir(p.id)} style={{ padding: '8px 12px', borderRadius: 8, background: s('#fee2e2', '#7f1d1d'), color: '#dc2626', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
