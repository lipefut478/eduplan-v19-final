import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Upload, Save, BookOpen, Target, Star, Users, FileText, CheckCircle, X, Plus } from 'lucide-react';
import { CATEGORIAS } from '../data/footballData';

export default function Metodologia({ session, isDark, onSaved }) {
  const [form, setForm] = useState({
    nome_escola: '',
    estilo_jogo: '',
    pilares: [],
    objetivos_por_categoria: {},
    valores: '',
    arquivo_nome: '',
    arquivo_texto: '',
  });
  const [novoPilar, setNovoPilar] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const s = (light, dark) => isDark ? dark : light;

  useEffect(() => {
    carregarMetodologia();
  }, []);

  async function carregarMetodologia() {
    const { data } = await supabase
      .from('metodologia')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    if (data) {
      setForm({
        nome_escola: data.nome_escola || '',
        estilo_jogo: data.estilo_jogo || '',
        pilares: data.pilares || [],
        objetivos_por_categoria: data.objetivos_por_categoria || {},
        valores: data.valores || '',
        arquivo_nome: data.arquivo_nome || '',
        arquivo_texto: data.arquivo_texto || '',
      });
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const text = await file.text();
      setForm(f => ({ ...f, arquivo_nome: file.name, arquivo_texto: text }));
    } catch {
      alert('Não foi possível ler o arquivo. Use arquivos .txt ou .md.');
    }
    setUploading(false);
  }

  function addPilar() {
    if (!novoPilar.trim()) return;
    setForm(f => ({ ...f, pilares: [...f.pilares, novoPilar.trim()] }));
    setNovoPilar('');
  }

  function removePilar(i) {
    setForm(f => ({ ...f, pilares: f.pilares.filter((_, idx) => idx !== i) }));
  }

  function setObjetivoCat(cat, val) {
    setForm(f => ({ ...f, objetivos_por_categoria: { ...f.objetivos_por_categoria, [cat]: val } }));
  }

  async function salvar() {
    setSaving(true);
    const payload = { user_id: session.user.id, ...form, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('metodologia').upsert(payload, { onConflict: 'user_id' });
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onSaved?.(form);
    } else {
      alert('Erro ao salvar. Verifique se a tabela metodologia existe no Supabase.');
    }
  }

  const card = {
    background: s('#fff', '#1f2937'),
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    border: `1px solid ${s('#e5e7eb', '#374151')}`,
  };

  const label = { fontWeight: 600, fontSize: 13, color: s('#374151', '#d1d5db'), marginBottom: 6, display: 'block' };
  const input = {
    width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14,
    background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'),
    border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none', boxSizing: 'border-box',
  };
  const textarea = { ...input, resize: 'vertical', minHeight: 80 };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 6 }}>
          Metodologia da Escola
        </h1>
        <p style={{ color: s('#6b7280', '#9ca3af'), fontSize: 14 }}>
          Defina a identidade e os pilares pedagógicos da sua escola. Essa metodologia guia a IA na criação dos planos.
        </p>
      </div>

      {/* Upload */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Upload size={20} color="#16a34a" />
          <span style={{ fontWeight: 700, color: s('#111827', '#f3f4f6') }}>Upload de Documento</span>
        </div>
        <p style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 12 }}>
          Faça upload do documento de metodologia da sua escola (PDF, Word, TXT). O texto será extraído e usado como referência.
        </p>
        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          padding: '10px 20px', borderRadius: 8, background: '#16a34a', color: '#fff',
          fontWeight: 600, fontSize: 14,
        }}>
          <Upload size={16} /> {uploading ? 'Carregando...' : 'Selecionar Arquivo'}
          <input type="file" accept=".txt,.md,.pdf,.docx" style={{ display: 'none' }} onChange={handleUpload} />
        </label>
        {form.arquivo_nome && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={16} color="#16a34a" />
            <span style={{ fontSize: 13, color: s('#374151', '#d1d5db') }}>{form.arquivo_nome}</span>
          </div>
        )}
        {form.arquivo_texto && (
          <div style={{ marginTop: 12 }}>
            <label style={label}>Texto extraído (editável)</label>
            <textarea
              style={{ ...textarea, minHeight: 120 }}
              value={form.arquivo_texto}
              onChange={e => setForm(f => ({ ...f, arquivo_texto: e.target.value }))}
            />
          </div>
        )}
      </div>

      {/* Formulário guiado */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BookOpen size={20} color="#16a34a" />
          <span style={{ fontWeight: 700, color: s('#111827', '#f3f4f6') }}>Formulário Guiado</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={label}>Nome da Escola / Academia</label>
            <input style={input} value={form.nome_escola} onChange={e => setForm(f => ({ ...f, nome_escola: e.target.value }))} placeholder="Ex: Academia Futebol Clube" />
          </div>
          <div>
            <label style={label}>Estilo de Jogo (Modelo de Jogo)</label>
            <input style={input} value={form.estilo_jogo} onChange={e => setForm(f => ({ ...f, estilo_jogo: e.target.value }))} placeholder="Ex: Posse de bola com pressão alta" />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ ...label, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Target size={14} /> Pilares da Metodologia
          </label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {form.pilares.map((p, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 600,
              }}>
                {p}
                <button type="button" onClick={() => removePilar(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <X size={12} color="#15803d" />
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={{ ...input, flex: 1 }}
              value={novoPilar}
              onChange={e => setNovoPilar(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPilar()}
              placeholder="Ex: Pressing alto, Posse de bola, Identidade ofensiva..."
            />
            <button type="button" onClick={addPilar} style={{
              padding: '10px 16px', borderRadius: 8, background: '#16a34a', color: '#fff',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600,
            }}>
              <Plus size={16} /> Adicionar
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={label}>Valores do Clube</label>
          <textarea style={textarea} value={form.valores} onChange={e => setForm(f => ({ ...f, valores: e.target.value }))}
            placeholder="Ex: Respeito, disciplina, trabalho em equipe, desenvolvimento humano..." />
        </div>
      </div>

      {/* Objetivos por categoria */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Users size={20} color="#16a34a" />
          <span style={{ fontWeight: 700, color: s('#111827', '#f3f4f6') }}>Objetivos por Categoria</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {CATEGORIAS.map(cat => (
            <div key={cat}>
              <label style={label}>{cat}</label>
              <textarea
                style={{ ...textarea, minHeight: 60 }}
                value={form.objetivos_por_categoria[cat] || ''}
                onChange={e => setObjetivoCat(cat, e.target.value)}
                placeholder={`Objetivos para ${cat}...`}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={salvar}
        disabled={saving}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '14px 28px', borderRadius: 10, fontSize: 16, fontWeight: 700,
          background: saved ? '#15803d' : '#16a34a', color: '#fff', border: 'none',
          cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'background 0.2s',
        }}
      >
        {saved ? <CheckCircle size={18} /> : <Save size={18} />}
        {saving ? 'Salvando...' : saved ? 'Salvo com sucesso!' : 'Salvar Metodologia'}
      </button>
    </div>
  );
}
