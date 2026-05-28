import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import {
  Flame, Target, Map, Trophy, Wind, Shuffle, Dumbbell, Gamepad2,
  Save, Download, ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle, SkipForward, Bot, Loader, Plus, X, FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import * as docx from 'docx';
import { saveAs } from 'file-saver';
import {
  CATEGORIAS, BLOCOS_TREINO, OBJETIVOS_POR_BLOCO,
  GRUPOS_CATEGORIA, sugerirAtividades, calcularDuracoes,
  detectarRepeticao, buildMethodologyPrompt, buildMicroPlanPrompt
} from '../data/footballData';
import { toast } from '../lib/toast';
import { MESSAGES, messageFromSupabaseError } from '../lib/messages';

const ICONS = { Flame, Target, Map, Trophy, Wind, Shuffle, Dumbbell, Gamepad2 };

function initBlocos(duracoes) {
  return BLOCOS_TREINO.map(b => ({
    id: b.id, nome: b.nome, duracao: duracoes?.[b.id] ?? Math.round(90 * b.percentual),
    objetivos: [], atividadesSugeridas: [], atividadesSelecionadas: [], observacoes: '', pulado: false,
  }));
}

export default function MicroPlano({ session, isDark, metodologia, preset, onPresetUsed }) {
  const [step, setStep] = useState(0);
  const [blocoAtual, setBlocoAtual] = useState(0);
  const [saving, setSaving] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [planoAtualId, setPlanoAtualId] = useState(null);
  const [mesosList, setMesosList] = useState([]);
  const [expandido, setExpandido] = useState({});

  const [config, setConfig] = useState({
    escola: '', treinador: '', categoria: 'Sub-11', grupo: '', data_treino: new Date().toISOString().split('T')[0],
    duracao_total: 90, objetivo: '', tema: '', meso_id: '', justificativa_metodologica: '',
  });

  const [blocos, setBlocos] = useState(() => initBlocos(calcularDuracoes(90)));

  const s = (l, d) => isDark ? d : l;
  const grupo = GRUPOS_CATEGORIA[config.categoria] || 'desenvolvimento';
  const repeticoes = useMemo(() => detectarRepeticao(blocos), [blocos]);

  useEffect(() => {
    supabase.from('planos_meso').select('id, titulo, categoria, mes_ref').eq('user_id', session.user.id)
      .then(({ data }) => setMesosList(data || []));
  }, []);

  useEffect(() => {
    if (preset) {
      setConfig(c => ({ ...c, ...preset }));
      onPresetUsed?.();
    }
  }, [preset]);

  useEffect(() => {
    const duracoes = calcularDuracoes(config.duracao_total);
    setBlocos(prev => prev.map(b => ({ ...b, duracao: duracoes[b.id] ?? b.duracao })));
  }, [config.duracao_total]);

  useEffect(() => {
    if (step !== 1) return;
    const principios = metodologia?.pilares || [];
    setBlocos(prev => prev.map(b => ({
      ...b,
      atividadesSugeridas: sugerirAtividades(grupo, b.id, 4, principios),
    })));
  }, [step, config.categoria, grupo]);

  async function gerarComIA() {
    setGerando(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);
    try {
      const { data, error } = await supabase.functions.invoke('ai-proxy', {
        body: {
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          system: [{ type: 'text', text: buildMethodologyPrompt(metodologia), cache_control: { type: 'ephemeral' } }],
          messages: [{ role: 'user', content: buildMicroPlanPrompt(null, null, config) }],
        },
      });
      clearTimeout(timeout);
      if (error) throw new Error(error.message || 'Erro no servidor');
      const text = data?.content?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('IA não retornou JSON válido');
      const parsed = JSON.parse(jsonMatch[0]);
      const novosBlocos = parsed.blocos || [];
      setBlocos(prev => prev.map(b => {
        const ia = novosBlocos.find(nb => nb.id === b.id);
        if (!ia) return b;
        const ativsIA = ia.atividadesSelecionadas ?? ia.atividadesSugeridas ?? [];
        return { ...b, duracao: ia.duracao ?? b.duracao, objetivos: ia.objetivos ?? ia.objetivosSugeridos ?? [], atividadesSelecionadas: ativsIA, observacoes: ia.observacoes ?? '' };
      }));

      // Salvar automaticamente cada atividade gerada pela IA no banco de exercícios
      const grupoAtual = GRUPOS_CATEGORIA[config.categoria];
      const novosExs = [];
      novosBlocos.forEach(b => {
        const ativs = b.atividadesSelecionadas ?? b.atividadesSugeridas ?? [];
        ativs.forEach(a => {
          novosExs.push({
            user_id: session.user.id,
            titulo: a.titulo,
            descricao: a.descricao || '',
            objetivos: a.objetivos || [],
            materiais: a.materiais || '',
            organizacao: a.organizacao || '',
            progressao: a.progressao || '',
            duracao_sugerida: a.duracao_sugerida || 15,
            tags: [...(a.tags || []), 'gerado-ia'],
            categoria_grupo: grupoAtual,
            bloco_tipo: b.id,
            favorito: false,
          });
        });
      });
      if (novosExs.length > 0) {
        await supabase.from('exercicios').insert(novosExs);
      }
      setStep(1);
    } catch (e) {
      clearTimeout(timeout);
      const msg = controller.signal.aborted
        ? 'Tempo limite atingido (60s). Tente novamente.'
        : (e.message || 'Erro desconhecido');
      toast.error('Erro ao gerar com IA: ' + msg);
    }
    setGerando(false);
  }

  function toggleObjetivo(blocoIdx, obj) {
    setBlocos(prev => prev.map((b, i) => {
      if (i !== blocoIdx) return b;
      const has = b.objetivos.includes(obj);
      return { ...b, objetivos: has ? b.objetivos.filter(o => o !== obj) : [...b.objetivos, obj] };
    }));
  }

  function selecionarAtividade(blocoIdx, ativ) {
    setBlocos(prev => prev.map((b, i) => {
      if (i !== blocoIdx) return b;
      const has = b.atividadesSelecionadas.find(a => a.titulo === ativ.titulo);
      if (has) return { ...b, atividadesSelecionadas: b.atividadesSelecionadas.filter(a => a.titulo !== ativ.titulo) };
      if (b.atividadesSelecionadas.length >= 3) return b;
      return { ...b, atividadesSelecionadas: [...b.atividadesSelecionadas, ativ] };
    }));
  }

  function nextBloco() {
    let next = blocoAtual + 1;
    while (next < BLOCOS_TREINO.length && blocos[next]?.pulado) next++;
    if (next >= BLOCOS_TREINO.length) setStep(2);
    else setBlocoAtual(next);
  }

  function prevBloco() {
    let prev = blocoAtual - 1;
    while (prev >= 0 && blocos[prev]?.pulado) prev--;
    if (prev < 0) setStep(0);
    else setBlocoAtual(prev);
  }

  function togglePular(i) {
    setBlocos(prev => prev.map((b, idx) => idx === i ? { ...b, pulado: !b.pulado } : b));
  }

  async function salvar() {
    setSaving(true);
    try {
      const payload = {
        user_id: session.user.id, meso_id: config.meso_id || null,
        escola: config.escola, treinador: config.treinador, categoria: config.categoria,
        grupo: config.grupo, data_treino: config.data_treino, duracao_total: config.duracao_total,
        objetivo: config.objetivo, tema: config.tema,
        justificativa_metodologica: config.justificativa_metodologica,
        blocos, updated_at: new Date().toISOString(),
      };
      if (planoAtualId) {
        const { error } = await supabase.from('planos_treino').update(payload).eq('id', planoAtualId);
        if (error) throw error;
        toast.success(MESSAGES.success.updated);
      } else {
        const { data, error } = await supabase.from('planos_treino').insert([payload]).select('id').single();
        if (error) throw error;
        if (data) setPlanoAtualId(data.id);
        toast.success(MESSAGES.success.created);
      }
    } catch (e) {
      toast.error(messageFromSupabaseError(e instanceof Error ? { message: e.message } : e));
    } finally {
      setSaving(false);
    }
  }

  function gerarPDF() {
    const pdfDoc = new jsPDF();
    // Capa
    pdfDoc.setFillColor(22, 163, 74);
    pdfDoc.rect(0, 0, 210, 297, 'F');
    pdfDoc.setTextColor(255, 255, 255);
    pdfDoc.setFont('helvetica', 'bold');
    pdfDoc.setFontSize(22);
    pdfDoc.text((config.escola || 'Escola de Futebol').toUpperCase(), 105, 80, { align: 'center' });
    pdfDoc.setFontSize(16);
    pdfDoc.text('PLANO DE TREINO', 105, 100, { align: 'center' });
    pdfDoc.setFontSize(14);
    pdfDoc.text(`Categoria: ${config.categoria}`, 105, 118, { align: 'center' });
    pdfDoc.text(`Treinador: ${config.treinador}`, 105, 130, { align: 'center' });
    pdfDoc.text(`Data: ${config.data_treino} | Duração: ${config.duracao_total} min`, 105, 142, { align: 'center' });
    if (config.tema) { pdfDoc.setFontSize(13); pdfDoc.text(`Foco: ${config.tema}`, 105, 155, { align: 'center' }); }
    if (metodologia?.pilares?.length) {
      pdfDoc.setFontSize(11);
      pdfDoc.text('Metodologia: ' + metodologia.pilares.join(' | '), 105, 200, { align: 'center' });
    }

    // Conteúdo
    pdfDoc.addPage();
    pdfDoc.setTextColor(0);
    let y = 20;

    blocos.forEach(bloco => {
      if (bloco.pulado || bloco.atividadesSelecionadas.length === 0) return;
      if (y > 240) { pdfDoc.addPage(); y = 20; }
      pdfDoc.setFillColor(22, 163, 74);
      pdfDoc.rect(10, y - 5, 190, 10, 'F');
      pdfDoc.setTextColor(255);
      pdfDoc.setFont('helvetica', 'bold');
      pdfDoc.setFontSize(12);
      pdfDoc.text(`${bloco.nome.toUpperCase()} — ${bloco.duracao} min`, 15, y + 2);
      pdfDoc.setTextColor(0);
      y += 12;

      bloco.atividadesSelecionadas.forEach(ativ => {
        if (y > 260) { pdfDoc.addPage(); y = 20; }
        pdfDoc.setFont('helvetica', 'bold'); pdfDoc.setFontSize(11);
        pdfDoc.text(`• ${ativ.titulo}`, 14, y); y += 6;
        pdfDoc.setFont('helvetica', 'normal'); pdfDoc.setFontSize(10);
        const linhas = pdfDoc.splitTextToSize(ativ.descricao || '', 175);
        if (y + linhas.length * 4.5 > 280) { pdfDoc.addPage(); y = 20; }
        pdfDoc.text(linhas, 18, y); y += linhas.length * 4.5 + 2;
        if (ativ.materiais) {
          const ml = pdfDoc.splitTextToSize(`Materiais: ${ativ.materiais}`, 175);
          if (y + ml.length * 4.5 > 280) { pdfDoc.addPage(); y = 20; }
          pdfDoc.text(ml, 18, y); y += ml.length * 4.5 + 2;
        }
        y += 4;
      });

      if (bloco.observacoes) {
        pdfDoc.setFont('helvetica', 'italic'); pdfDoc.setFontSize(10);
        const obs = pdfDoc.splitTextToSize(`Obs: ${bloco.observacoes}`, 175);
        if (y + obs.length * 4.5 > 280) { pdfDoc.addPage(); y = 20; }
        pdfDoc.text(obs, 14, y); y += obs.length * 4.5 + 4;
      }
      y += 6;
    });

    if (config.justificativa_metodologica) {
      if (y > 240) { pdfDoc.addPage(); y = 20; }
      pdfDoc.setFont('helvetica', 'bold'); pdfDoc.setFontSize(12); pdfDoc.setTextColor(22, 163, 74);
      pdfDoc.text('JUSTIFICATIVA METODOLÓGICA', 14, y); y += 8;
      pdfDoc.setFont('helvetica', 'normal'); pdfDoc.setFontSize(10); pdfDoc.setTextColor(0);
      const just = pdfDoc.splitTextToSize(config.justificativa_metodologica, 175);
      pdfDoc.text(just, 14, y);
    }

    pdfDoc.save(`PlanoTreino_${config.categoria}_${config.data_treino}.pdf`);
  }

  function gerarWord() {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;
    const children = [];
    children.push(new Paragraph({ text: (config.escola || 'Escola de Futebol').toUpperCase(), heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }));
    children.push(new Paragraph({ children: [new TextRun({ text: `PLANO DE TREINO — ${config.categoria} — ${config.data_treino}`, bold: true, size: 28 })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'Treinador: ', bold: true }), new TextRun(config.treinador)] }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'Grupo: ', bold: true }), new TextRun(config.grupo)] }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'Duração: ', bold: true }), new TextRun(`${config.duracao_total} min`)] }));
    children.push(new Paragraph({ children: [new TextRun({ text: 'Objetivo: ', bold: true }), new TextRun(config.objetivo)] }));
    if (metodologia?.pilares?.length) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'Pilares Metodológicos: ', bold: true }), new TextRun(metodologia.pilares.join(' | '))], spacing: { before: 200 } }));
    }

    blocos.forEach(bloco => {
      if (bloco.pulado || bloco.atividadesSelecionadas.length === 0) return;
      children.push(new Paragraph({ children: [new TextRun({ text: `${bloco.nome.toUpperCase()} — ${bloco.duracao} min`, bold: true, size: 26, color: '16a34a' })], spacing: { before: 400, after: 100 }, thematicBreak: true }));
      bloco.atividadesSelecionadas.forEach(ativ => {
        children.push(new Paragraph({ children: [new TextRun({ text: ativ.titulo, bold: true })], spacing: { before: 200 } }));
        if (ativ.descricao) children.push(new Paragraph({ text: ativ.descricao }));
        if (ativ.materiais) children.push(new Paragraph({ children: [new TextRun({ text: 'Materiais: ', bold: true }), new TextRun(ativ.materiais)] }));
        if (ativ.organizacao) children.push(new Paragraph({ children: [new TextRun({ text: 'Organização: ', bold: true }), new TextRun(ativ.organizacao)] }));
        if (ativ.progressao) children.push(new Paragraph({ children: [new TextRun({ text: 'Progressão: ', bold: true }), new TextRun(ativ.progressao)] }));
      });
      if (bloco.observacoes) children.push(new Paragraph({ children: [new TextRun({ text: 'Observações: ', bold: true, italics: true }), new TextRun({ text: bloco.observacoes, italics: true })] }));
    });

    if (config.justificativa_metodologica) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'JUSTIFICATIVA METODOLÓGICA', bold: true, color: '16a34a' })], spacing: { before: 400 } }));
      children.push(new Paragraph({ text: config.justificativa_metodologica }));
    }

    const docFile = new Document({ sections: [{ children }] });
    Packer.toBlob(docFile).then(blob => saveAs(blob, `PlanoTreino_${config.categoria}_${config.data_treino}.docx`));
  }

  const cardStyle = { background: s('#fff', '#1f2937'), borderRadius: 16, padding: 24, marginBottom: 20, border: `1px solid ${s('#e5e7eb', '#374151')}` };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontWeight: 600, fontSize: 13, color: s('#374151', '#d1d5db'), marginBottom: 6, display: 'block' };
  const btnPrimary = { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 };
  const btnSecondary = { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: s('#f3f4f6', '#374151'), color: s('#374151', '#d1d5db'), border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 };

  // STEP 0
  if (step === 0) {
    const duracoes = calcularDuracoes(config.duracao_total);
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>Plano de Treino (Micro)</h1>
          <p style={{ color: s('#6b7280', '#9ca3af'), fontSize: 14 }}>Configure o treino e gere manualmente ou com IA.</p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Escola / Academia</label>
              <input style={inputStyle} value={config.escola} onChange={e => setConfig(c => ({ ...c, escola: e.target.value }))} placeholder="Nome da escola" />
            </div>
            <div>
              <label style={labelStyle}>Treinador</label>
              <input style={inputStyle} value={config.treinador} onChange={e => setConfig(c => ({ ...c, treinador: e.target.value }))} placeholder="Nome do treinador" />
            </div>
            <div>
              <label style={labelStyle}>Categoria</label>
              <select style={inputStyle} value={config.categoria} onChange={e => setConfig(c => ({ ...c, categoria: e.target.value }))}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Grupo / Turma</label>
              <input style={inputStyle} value={config.grupo} onChange={e => setConfig(c => ({ ...c, grupo: e.target.value }))} placeholder="Ex: Turma A" />
            </div>
            <div>
              <label style={labelStyle}>Data do Treino</label>
              <input type="date" style={inputStyle} value={config.data_treino} onChange={e => setConfig(c => ({ ...c, data_treino: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Duração Total (min)</label>
              <input type="number" style={inputStyle} value={config.duracao_total} onChange={e => setConfig(c => ({ ...c, duracao_total: Number(e.target.value) }))} min={30} max={180} step={5} />
            </div>
            <div>
              <label style={labelStyle}>Objetivo do Treino</label>
              <input style={inputStyle} value={config.objetivo} onChange={e => setConfig(c => ({ ...c, objetivo: e.target.value }))} placeholder="Ex: Melhorar o passe curto" />
            </div>
            <div>
              <label style={labelStyle}>Tema / Foco</label>
              <input style={inputStyle} value={config.tema} onChange={e => setConfig(c => ({ ...c, tema: e.target.value }))} placeholder="Ex: Passe e movimentação" />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Vincular a Plano Meso (opcional)</label>
              <select style={inputStyle} value={config.meso_id} onChange={e => setConfig(c => ({ ...c, meso_id: e.target.value }))}>
                <option value="">Nenhum</option>
                {mesosList.map(m => <option key={m.id} value={m.id}>{m.titulo} — {m.mes_ref} ({m.categoria})</option>)}
              </select>
            </div>
          </div>

          {/* Distribuição de duração */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: s('#374151', '#d1d5db'), marginBottom: 8 }}>Distribuição automática por bloco:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {BLOCOS_TREINO.map(b => (
                <span key={b.id} style={{ fontSize: 12, background: b.corHex + '22', color: b.corHex, borderRadius: 20, padding: '4px 10px', fontWeight: 600 }}>
                  {b.nome}: {duracoes[b.id]}min
                </span>
              ))}
            </div>
          </div>

          {metodologia?.pilares?.length > 0 && (
            <div style={{ background: s('#f0fdf4', '#052e16'), borderRadius: 10, padding: '12px 16px', marginBottom: 20, border: `1px solid ${s('#bbf7d0', '#166534')}` }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 6 }}>REFERÊNCIA METODOLÓGICA</p>
              <p style={{ fontSize: 13, color: s('#374151', '#d1d5db'), marginBottom: 6 }}>{metodologia.estilo_jogo}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {metodologia.pilares.map((p, i) => <span key={i} style={{ background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{p}</span>)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
        type="button"
              onClick={() => { if (!config.escola || !config.treinador) { toast.warning('Preencha escola e treinador.'); return; } setStep(1); }}
              style={btnPrimary}
            >
              Iniciar Planejamento Manual <ArrowRight size={18} />
            </button>
            <button
        type="button"
              onClick={() => { if (!config.escola || !config.treinador || !config.tema) { toast.warning('Preencha escola, treinador e tema.'); return; } gerarComIA(); }}
              disabled={gerando}
              style={{ ...btnPrimary, background: '#1d4ed8' }}
            >
              {gerando ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Gerando com IA...</> : <><Bot size={18} /> Gerar Treino com IA</>}
            </button>
          </div>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // STEP 1
  if (step === 1) {
    const bloco = blocos[blocoAtual];
    const BlocoIcon = ICONS[BLOCOS_TREINO[blocoAtual]?.icone] || Target;
    const blocoInfo = BLOCOS_TREINO[blocoAtual];

    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        {repeticoes.length > 0 && (
          <div style={{ background: '#fefce8', border: '1px solid #ca8a04', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10 }}>
            <AlertCircle size={18} color="#ca8a04" />
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>Atividades repetidas entre blocos:</p>
              {repeticoes.map((r, i) => <p key={i} style={{ fontSize: 12, color: '#92400e' }}>{r}</p>)}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 20 }}>
          {/* Sidebar */}
          <div style={{ width: 200, flexShrink: 0 }}>
            <div style={{ background: s('#fff', '#1f2937'), borderRadius: 14, padding: 12, border: `1px solid ${s('#e5e7eb', '#374151')}` }}>
              {BLOCOS_TREINO.map((b, i) => {
                const bData = blocos[i];
                const isActive = i === blocoAtual;
                const hasAtivs = bData?.atividadesSelecionadas?.length > 0;
                const Icon = ICONS[b.icone] || Target;
                return (
                  <button
        type="button"
                    key={b.id}
                    onClick={() => setBlocoAtual(i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, marginBottom: 4,
                      background: isActive ? b.corHex : 'transparent', color: isActive ? '#fff' : bData?.pulado ? s('#9ca3af', '#4b5563') : s('#374151', '#d1d5db'),
                      border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: isActive ? 700 : 500,
                      textDecoration: bData?.pulado ? 'line-through' : 'none', textAlign: 'left',
                    }}
                  >
                    <Icon size={14} />
                    <span style={{ flex: 1 }}>{b.nome}</span>
                    {hasAtivs && !bData.pulado && <CheckCircle size={12} color={isActive ? '#fff' : '#16a34a'} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main content */}
          <div style={{ flex: 1 }}>
            <div style={{ background: s('#fff', '#1f2937'), borderRadius: 16, padding: 24, border: `1px solid ${s('#e5e7eb', '#374151')}`, marginBottom: 16 }}>
              {/* Header do bloco */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: blocoInfo.corHex, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BlocoIcon size={22} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 2 }}>{bloco.nome}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="number"
                      value={bloco.duracao}
                      onChange={e => setBlocos(prev => prev.map((b, i) => i === blocoAtual ? { ...b, duracao: Number(e.target.value) } : b))}
                      style={{ width: 60, padding: '4px 8px', borderRadius: 6, fontSize: 13, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none' }}
                    />
                    <span style={{ fontSize: 13, color: s('#6b7280', '#9ca3af') }}>minutos</span>
                  </div>
                </div>
                <button
        type="button"
                  onClick={() => togglePular(blocoAtual)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: bloco.pulado ? '#fee2e2' : s('#f3f4f6', '#374151'), color: bloco.pulado ? '#dc2626' : s('#6b7280', '#9ca3af'), border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                >
                  <SkipForward size={15} /> {bloco.pulado ? 'Retomar' : 'Pular Bloco'}
                </button>
              </div>

              {!bloco.pulado && (
                <>
                  {/* Objetivos */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: s('#374151', '#d1d5db'), marginBottom: 10 }}>Objetivos do Bloco</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(OBJETIVOS_POR_BLOCO[bloco.id] || []).map((obj, i) => {
                        const sel = bloco.objetivos.includes(obj);
                        return (
                          <button
        type="button"
                            key={i}
                            onClick={() => toggleObjetivo(blocoAtual, obj)}
                            style={{
                              padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                              background: sel ? blocoInfo.corHex : s('#f3f4f6', '#374151'),
                              color: sel ? '#fff' : s('#374151', '#d1d5db'), border: 'none',
                            }}
                          >
                            {obj}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Atividades sugeridas */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: s('#374151', '#d1d5db'), marginBottom: 10 }}>
                      Atividades Sugeridas <span style={{ fontSize: 12, fontWeight: 400, color: s('#9ca3af', '#6b7280') }}>({GRUPOS_CATEGORIA[config.categoria]})</span>
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {bloco.atividadesSugeridas.map((ativ, i) => {
                        const sel = bloco.atividadesSelecionadas.find(a => a.titulo === ativ.titulo);
                        const isExpanded = expandido[`${blocoAtual}-${i}`];
                        return (
                          <div key={i} style={{ borderRadius: 10, border: `2px solid ${sel ? blocoInfo.corHex : s('#e5e7eb', '#374151')}`, overflow: 'hidden', background: sel ? blocoInfo.corHex + '11' : s('#f9fafb', '#111827') }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 13, color: s('#111827', '#f3f4f6') }}>{ativ.titulo}</div>
                                <div style={{ fontSize: 12, color: s('#6b7280', '#9ca3af') }}>{ativ.duracao_sugerida} min · {(ativ.tags || []).slice(0, 2).join(', ')}</div>
                              </div>
                              <button type="button" onClick={() => setExpandido(ex => ({ ...ex, [`${blocoAtual}-${i}`]: !isExpanded }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                                {isExpanded ? <ChevronUp size={16} color={s('#6b7280', '#9ca3af')} /> : <ChevronDown size={16} color={s('#6b7280', '#9ca3af')} />}
                              </button>
                              <button
        type="button"
                                onClick={() => selecionarAtividade(blocoAtual, ativ)}
                                style={{ padding: '6px 14px', borderRadius: 8, background: sel ? blocoInfo.corHex : s('#e5e7eb', '#374151'), color: sel ? '#fff' : s('#374151', '#d1d5db'), border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
                              >
                                {sel ? '✓' : '+ Adicionar'}
                              </button>
                            </div>
                            {isExpanded && (
                              <div style={{ padding: '0 14px 12px', fontSize: 12, color: s('#4b5563', '#d1d5db') }}>
                                <p style={{ marginBottom: 6 }}>{ativ.descricao}</p>
                                {ativ.objetivos?.length > 0 && <p><strong>Objetivos:</strong> {ativ.objetivos.join('; ')}</p>}
                                {ativ.materiais && <p><strong>Materiais:</strong> {ativ.materiais}</p>}
                                {ativ.organizacao && <p><strong>Organização:</strong> {ativ.organizacao}</p>}
                                {ativ.progressao && <p><strong>Progressão:</strong> {ativ.progressao}</p>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selecionadas */}
                  {bloco.atividadesSelecionadas.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: s('#374151', '#d1d5db'), marginBottom: 8 }}>Selecionadas ({bloco.atividadesSelecionadas.length}/3)</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {bloco.atividadesSelecionadas.map((a, i) => (
                          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: blocoInfo.corHex, color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>
                            {a.titulo}
                            <button type="button" onClick={() => selecionarAtividade(blocoAtual, a)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                              <X size={13} color="#fff" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  <div>
                    <label style={{ ...labelStyle, fontSize: 13 }}>Observações do Bloco</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
                      value={bloco.observacoes}
                      onChange={e => setBlocos(prev => prev.map((b, i) => i === blocoAtual ? { ...b, observacoes: e.target.value } : b))}
                      placeholder="Notas, ajustes ou observações específicas..."
                    />
                  </div>
                </>
              )}
            </div>

            {/* Navegação */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={prevBloco} style={btnSecondary}><ArrowLeft size={18} /> Anterior</button>
              <button type="button" onClick={nextBloco} style={btnPrimary}>
                {blocoAtual === BLOCOS_TREINO.length - 1 ? 'Finalizar' : 'Próximo'} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 20 }}>Revisão e Exportação</h1>

      {repeticoes.length > 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #ea580c', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
          <p style={{ fontWeight: 700, color: '#9a3412', fontSize: 13 }}>Atenção: atividades repetidas entre blocos</p>
          {repeticoes.map((r, i) => <p key={i} style={{ fontSize: 12, color: '#9a3412' }}>{r}</p>)}
        </div>
      )}

      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 14 }}>Resumo do Treino</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[['Escola', config.escola], ['Treinador', config.treinador], ['Categoria', config.categoria], ['Data', config.data_treino], ['Duração', `${config.duracao_total} min`], ['Tema', config.tema]].map(([k, v]) => (
            <div key={k}><span style={{ fontWeight: 600, fontSize: 13, color: s('#6b7280', '#9ca3af') }}>{k}: </span><span style={{ fontSize: 13, color: s('#111827', '#f3f4f6') }}>{v}</span></div>
          ))}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: s('#f3f4f6', '#374151') }}>
              {['Bloco', 'Duração', 'Atividades', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: s('#374151', '#d1d5db') }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blocos.map(b => (
              <tr key={b.id} style={{ borderTop: `1px solid ${s('#e5e7eb', '#374151')}`, opacity: b.pulado ? 0.4 : 1 }}>
                <td style={{ padding: '8px 12px', fontSize: 13, color: s('#374151', '#d1d5db'), fontWeight: 600 }}>{b.nome}</td>
                <td style={{ padding: '8px 12px', fontSize: 13, color: s('#374151', '#d1d5db') }}>{b.duracao}min</td>
                <td style={{ padding: '8px 12px', fontSize: 13, color: s('#374151', '#d1d5db') }}>{b.atividadesSelecionadas.length}</td>
                <td style={{ padding: '8px 12px', fontSize: 12 }}>
                  <span style={{ background: b.pulado ? s('#f3f4f6', '#374151') : '#dcfce7', color: b.pulado ? s('#9ca3af', '#6b7280') : '#15803d', borderRadius: 12, padding: '2px 8px', fontWeight: 600 }}>
                    {b.pulado ? 'Pulado' : `${b.atividadesSelecionadas.length} ativ.`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <label style={labelStyle}>Justificativa Metodológica</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          value={config.justificativa_metodologica}
          onChange={e => setConfig(c => ({ ...c, justificativa_metodologica: e.target.value }))}
          placeholder="Como este treino aplica a metodologia da escola?"
        />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <button type="button" onClick={gerarPDF} style={{ ...btnPrimary, background: '#dc2626' }}><FileText size={18} /> Exportar PDF</button>
        <button type="button" onClick={gerarWord} style={{ ...btnPrimary, background: '#1d4ed8' }}><FileText size={18} /> Exportar Word</button>
        <button type="button" onClick={salvar} disabled={saving} style={btnPrimary}><Save size={18} /> {saving ? 'Salvando...' : 'Salvar na Nuvem'}</button>
      </div>

      <button type="button" onClick={() => setStep(1)} style={btnSecondary}><ArrowLeft size={18} /> Voltar ao Planejamento</button>
    </div>
  );
}
