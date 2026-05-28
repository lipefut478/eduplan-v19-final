import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Search, Star, Trash2, Edit3, FileText, Download, X, Save, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import * as docx from 'docx';
import { saveAs } from 'file-saver';
import { BLOCOS_TREINO, GRUPOS_CATEGORIA, GRUPOS_LABEL } from '../data/footballData';

const GRUPOS = ['iniciacao', 'desenvolvimento', 'aperfeicoamento', 'alto_rendimento'];

function ExercicioModal({ exercicio, isDark, onClose, onSave }) {
  const [form, setForm] = useState(exercicio || {
    titulo: '', descricao: '', objetivos: [], materiais: '', organizacao: '', progressao: '',
    duracao_sugerida: 15, tags: [], categoria_grupo: 'desenvolvimento', bloco_tipo: 'tecnica', favorito: false,
  });
  const [novoObj, setNovoObj] = useState('');
  const [novaTag, setNovaTag] = useState('');

  const s = (l, d) => isDark ? d : l;
  const input = { width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none', boxSizing: 'border-box' };
  const label = { fontWeight: 600, fontSize: 13, color: s('#374151', '#d1d5db'), marginBottom: 4, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: s('#fff', '#1f2937'), borderRadius: 16, padding: 28, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={s('#6b7280', '#9ca3af')} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 20 }}>
          {exercicio ? 'Editar Exercício' : 'Novo Exercício'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={label}>Título *</label>
            <input style={input} value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Nome do exercício..." />
          </div>
          <div>
            <label style={label}>Categoria / Grupo</label>
            <select style={input} value={form.categoria_grupo} onChange={e => setForm(f => ({ ...f, categoria_grupo: e.target.value }))}>
              {GRUPOS.map(g => <option key={g} value={g}>{GRUPOS_LABEL[g]}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Bloco do Treino</label>
            <select style={input} value={form.bloco_tipo} onChange={e => setForm(f => ({ ...f, bloco_tipo: e.target.value }))}>
              {BLOCOS_TREINO.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Duração Sugerida (min)</label>
            <input type="number" style={input} value={form.duracao_sugerida} onChange={e => setForm(f => ({ ...f, duracao_sugerida: Number(e.target.value) }))} min={1} max={60} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={label}>Descrição</label>
            <textarea style={{ ...input, minHeight: 80, resize: 'vertical' }} value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descreva o exercício em detalhes..." />
          </div>
          <div>
            <label style={label}>Materiais</label>
            <input style={input} value={form.materiais} onChange={e => setForm(f => ({ ...f, materiais: e.target.value }))} placeholder="Ex: Bolas, cones, coletes..." />
          </div>
          <div>
            <label style={label}>Organização</label>
            <input style={input} value={form.organizacao} onChange={e => setForm(f => ({ ...f, organizacao: e.target.value }))} placeholder="Como organizar os jogadores..." />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={label}>Progressão</label>
            <input style={input} value={form.progressao} onChange={e => setForm(f => ({ ...f, progressao: e.target.value }))} placeholder="Como aumentar a dificuldade..." />
          </div>

          <div style={{ gridColumn: '1/-1' }}>
            <label style={label}>Objetivos</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {form.objetivos.map((o, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#dbeafe', color: '#1d4ed8', borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
                  {o} <button type="button" onClick={() => setForm(f => ({ ...f, objetivos: f.objetivos.filter((_, idx) => idx !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={11} color="#1d4ed8" /></button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...input, flex: 1 }} value={novoObj} onChange={e => setNovoObj(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && novoObj.trim()) { setForm(f => ({ ...f, objetivos: [...f.objetivos, novoObj.trim()] })); setNovoObj(''); } }} placeholder="Adicionar objetivo (Enter)" />
            </div>
          </div>

          <div style={{ gridColumn: '1/-1' }}>
            <label style={label}>Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {form.tags.map((t, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
                  {t} <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, idx) => idx !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={11} color="#15803d" /></button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...input, flex: 1 }} value={novaTag} onChange={e => setNovaTag(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && novaTag.trim()) { setForm(f => ({ ...f, tags: [...f.tags, novaTag.trim()] })); setNovaTag(''); } }} placeholder="Adicionar tag (Enter)" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" onClick={() => onSave(form)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
            <Save size={18} /> Salvar Exercício
          </button>
          <button type="button" onClick={onClose} style={{ padding: '12px 20px', borderRadius: 10, background: s('#f3f4f6', '#374151'), color: s('#374151', '#d1d5db'), border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default function BancoExercicios({ session, isDark }) {
  const [lista, setLista] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroGrupo, setFiltroGrupo] = useState('');
  const [filtroBloco, setFiltroBloco] = useState('');
  const [filtroFav, setFiltroFav] = useState(false);
  const [modal, setModal] = useState(null);

  const s = (l, d) => isDark ? d : l;

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const { data } = await supabase.from('exercicios').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    setLista(data || []);
  }

  async function salvarExercicio(form) {
    const payload = { ...form, user_id: session.user.id, updated_at: new Date().toISOString() };
    if (form.id) {
      await supabase.from('exercicios').update(payload).eq('id', form.id);
    } else {
      await supabase.from('exercicios').insert([payload]);
    }
    setModal(null);
    carregar();
  }

  async function excluir(id) {
    if (!confirm('Excluir exercício?')) return;
    await supabase.from('exercicios').delete().eq('id', id);
    carregar();
  }

  async function toggleFav(ex) {
    await supabase.from('exercicios').update({ favorito: !ex.favorito }).eq('id', ex.id);
    setLista(prev => prev.map(e => e.id === ex.id ? { ...e, favorito: !e.favorito } : e));
  }

  function exportarPDF(ex) {
    const pdf = new jsPDF();
    pdf.setFillColor(22, 163, 74);
    pdf.rect(0, 0, 210, 30, 'F');
    pdf.setTextColor(255); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(16);
    pdf.text(ex.titulo, 105, 18, { align: 'center' });
    pdf.setTextColor(0); let y = 40;

    const sections = [
      ['Descrição', ex.descricao], ['Objetivos', (ex.objetivos || []).join(', ')],
      ['Materiais', ex.materiais], ['Organização', ex.organizacao], ['Progressão', ex.progressao],
    ];
    sections.forEach(([title, val]) => {
      if (!val) return;
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(12);
      pdf.text(title + ':', 14, y); y += 6;
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10);
      const linhas = pdf.splitTextToSize(val, 175);
      if (y + linhas.length * 5 > 280) { pdf.addPage(); y = 20; }
      pdf.text(linhas, 14, y); y += linhas.length * 5 + 4;
    });
    pdf.save(`Exercicio_${ex.titulo}.pdf`);
  }

  function exportarWord(ex) {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;
    const children = [
      new Paragraph({ text: ex.titulo, heading: HeadingLevel.TITLE }),
      new Paragraph({ children: [new TextRun({ text: 'Grupo: ', bold: true }), new TextRun(GRUPOS_LABEL[ex.categoria_grupo] || ex.categoria_grupo)] }),
      new Paragraph({ children: [new TextRun({ text: 'Bloco: ', bold: true }), new TextRun(BLOCOS_TREINO.find(b => b.id === ex.bloco_tipo)?.nome || ex.bloco_tipo)] }),
      new Paragraph({ children: [new TextRun({ text: 'Duração sugerida: ', bold: true }), new TextRun(`${ex.duracao_sugerida} min`)] }),
    ];
    if (ex.descricao) { children.push(new Paragraph({ children: [new TextRun({ text: 'Descrição', bold: true })], spacing: { before: 200 } })); children.push(new Paragraph({ text: ex.descricao })); }
    if (ex.objetivos?.length) { children.push(new Paragraph({ children: [new TextRun({ text: 'Objetivos', bold: true })], spacing: { before: 200 } })); ex.objetivos.forEach(o => children.push(new Paragraph({ text: `• ${o}` }))); }
    if (ex.materiais) { children.push(new Paragraph({ children: [new TextRun({ text: 'Materiais', bold: true })], spacing: { before: 200 } })); children.push(new Paragraph({ text: ex.materiais })); }
    if (ex.organizacao) { children.push(new Paragraph({ children: [new TextRun({ text: 'Organização', bold: true })], spacing: { before: 200 } })); children.push(new Paragraph({ text: ex.organizacao })); }
    if (ex.progressao) { children.push(new Paragraph({ children: [new TextRun({ text: 'Progressão', bold: true })], spacing: { before: 200 } })); children.push(new Paragraph({ text: ex.progressao })); }
    const docFile = new Document({ sections: [{ children }] });
    Packer.toBlob(docFile).then(blob => saveAs(blob, `Exercicio_${ex.titulo}.docx`));
  }

  const filtered = lista.filter(ex => {
    if (filtroFav && !ex.favorito) return false;
    if (filtroGrupo && ex.categoria_grupo !== filtroGrupo) return false;
    if (filtroBloco && ex.bloco_tipo !== filtroBloco) return false;
    if (busca) {
      const q = busca.toLowerCase();
      return [ex.titulo, ex.descricao, ...(ex.tags || [])].join(' ').toLowerCase().includes(q);
    }
    return true;
  });

  const card = { background: s('#fff', '#1f2937'), borderRadius: 14, padding: 18, border: `1px solid ${s('#e5e7eb', '#374151')}` };
  const inputS = { padding: '10px 14px', borderRadius: 8, fontSize: 14, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none' };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      {modal && <ExercicioModal exercicio={modal === 'novo' ? null : modal} isDark={isDark} onClose={() => setModal(null)} onSave={salvarExercicio} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>Banco de Exercícios</h1>
          <p style={{ fontSize: 14, color: s('#6b7280', '#9ca3af') }}>Seus exercícios personalizados — {lista.length} cadastrado{lista.length !== 1 ? 's' : ''}.</p>
        </div>
        <button type="button" onClick={() => setModal('novo')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
          <Plus size={18} /> Novo Exercício
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: s('#9ca3af', '#6b7280') }} />
          <input style={{ ...inputS, width: '100%', paddingLeft: 36, boxSizing: 'border-box' }} value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por título, descrição ou tag..." />
        </div>
        <select style={inputS} value={filtroGrupo} onChange={e => setFiltroGrupo(e.target.value)}>
          <option value="">Todos os grupos</option>
          {GRUPOS.map(g => <option key={g} value={g}>{GRUPOS_LABEL[g]}</option>)}
        </select>
        <select style={inputS} value={filtroBloco} onChange={e => setFiltroBloco(e.target.value)}>
          <option value="">Todos os blocos</option>
          {BLOCOS_TREINO.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
        </select>
        <button
        type="button"
          onClick={() => setFiltroFav(f => !f)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 8, background: filtroFav ? '#ca8a04' : s('#f3f4f6', '#374151'), color: filtroFav ? '#fff' : s('#374151', '#d1d5db'), border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
        >
          <Star size={15} fill={filtroFav ? '#fff' : 'none'} /> Favoritos
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: 48 }}>
          <Search size={40} color={s('#d1d5db', '#4b5563')} style={{ margin: '0 auto 12px' }} />
          <p style={{ color: s('#6b7280', '#9ca3af') }}>{lista.length === 0 ? 'Nenhum exercício cadastrado. Clique em "Novo Exercício" para começar.' : 'Nenhum exercício encontrado com esses filtros.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(ex => {
            const bloco = BLOCOS_TREINO.find(b => b.id === ex.bloco_tipo);
            return (
              <div key={ex.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>{ex.titulo}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {bloco && <span style={{ fontSize: 11, background: bloco.corHex + '22', color: bloco.corHex, borderRadius: 12, padding: '2px 8px', fontWeight: 600 }}>{bloco.nome}</span>}
                      {ex.duracao_sugerida && <span style={{ fontSize: 11, background: s('#f3f4f6', '#374151'), color: s('#6b7280', '#9ca3af'), borderRadius: 12, padding: '2px 8px' }}>{ex.duracao_sugerida}min</span>}
                    </div>
                  </div>
                  <button type="button" onClick={() => toggleFav(ex)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <Star size={18} color="#ca8a04" fill={ex.favorito ? '#ca8a04' : 'none'} />
                  </button>
                </div>

                {ex.descricao && (
                  <p style={{ fontSize: 13, color: s('#4b5563', '#d1d5db'), marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {ex.descricao}
                  </p>
                )}

                {(ex.tags || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {ex.tags.map((t, i) => <span key={i} style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', borderRadius: 12, padding: '2px 8px', fontWeight: 600 }}>{t}</span>)}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setModal(ex)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 7, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}><Edit3 size={13} /> Editar</button>
                  <button type="button" onClick={() => exportarPDF(ex)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 7, background: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}><FileText size={13} /> PDF</button>
                  <button type="button" onClick={() => exportarWord(ex)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 7, background: '#1d4ed8', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}><FileText size={13} /> Word</button>
                  <button type="button" onClick={() => excluir(ex.id)} style={{ padding: '6px 10px', borderRadius: 7, background: s('#fee2e2', '#7f1d1d'), color: '#dc2626', border: 'none', cursor: 'pointer' }}><Trash2 size={13} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
