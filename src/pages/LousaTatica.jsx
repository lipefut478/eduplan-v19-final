import React, { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Save, Download, RotateCcw, Minus, Circle, Triangle, Flag, Target, Trash2, Plus } from 'lucide-react';
import { EQUIPAMENTOS_TATICOS, FORMACOES } from '../data/footballData';

const CAMPO_TIPOS = {
  futebol:  { label: 'Futebol (11×11)', vw: 100, vh: 65, jogadores: 11 },
  society:  { label: 'Society (7×7)',   vw: 100, vh: 65, jogadores: 7 },
  futsal:   { label: 'Futsal (5×5)',    vw: 100, vh: 65, jogadores: 5 },
};

const FORMACAO_OPTIONS = {
  futebol: ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2'],
  society: ['2-2'],
  futsal:  ['1-2-1 (futsal)'],
};

function gerarJogadores(n, time, offsetX = 0) {
  return Array.from({ length: n }, (_, i) => ({
    id: `${time}_${i}_${Date.now()}`,
    time,
    numero: i + 1,
    pos: i === 0 ? 'GOL' : `J${i}`,
    x: 10 + offsetX + (i % 5) * 15,
    y: time === 'A' ? 80 - (Math.floor(i / 5) * 20) : 20 + (Math.floor(i / 5) * 20),
  }));
}

function FieldSVG({ tipoCampo }) {
  const c = tipoCampo;
  const isF = c === 'futebol';
  const isS = c === 'society';
  const isFt = c === 'futsal';

  const lineProps = { stroke: '#fff', strokeWidth: 0.5, fill: 'none', strokeOpacity: 0.9 };

  return (
    <g>
      {/* Base do campo */}
      <rect x="2" y="2" width="96" height="61" rx="1" fill={isF ? '#16a34a' : isFt ? '#1d4ed8' : '#15803d'} />
      {/* Linhas laterais e de fundo */}
      <rect x="3" y="3" width="94" height="59" {...lineProps} />
      {/* Linha do meio */}
      <line x1="50" y1="3" x2="50" y2="62" {...lineProps} />
      {/* Círculo central */}
      <circle cx="50" cy="32.5" r="8" {...lineProps} />
      <circle cx="50" cy="32.5" r="0.5" fill="#fff" />

      {/* Área do gol esquerda (topo) */}
      <rect x="33" y="3" width="34" height={isF ? 16 : isFt ? 14 : 15} {...lineProps} />
      <rect x="40" y="3" width="20" height={isF ? 7 : 6} {...lineProps} />
      <circle cx="50" cy={isF ? 22 : 18} r="0.5" fill="#fff" />

      {/* Área do gol direita (fundo) */}
      <rect x="33" y={isF ? 46 : 48} width="34" height={isF ? 16 : isFt ? 14 : 15} {...lineProps} />
      <rect x="40" y={isF ? 55 : 57} width="20" height={isF ? 7 : 6} {...lineProps} />
      <circle cx="50" cy={isF ? 43 : 47} r="0.5" fill="#fff" />

      {/* Gols */}
      <rect x="44" y="1.2" width="12" height="2" fill="none" stroke="#fff" strokeWidth="0.8" />
      <rect x="44" y="61.8" width="12" height="2" fill="none" stroke="#fff" strokeWidth="0.8" />

      {/* Faixas do campo */}
      {isF && [12, 24, 36, 48, 60, 72, 84].map(x => (
        <rect key={x} x={x} y="3" width="12" height="59" fill="#fff" fillOpacity="0.04" />
      ))}
    </g>
  );
}

function EquipamentoShape({ tipo, cor }) {
  switch (tipo) {
    case 'cone': return <polygon points="0,-8 6,6 -6,6" fill={cor || '#f97316'} />;
    case 'bola': return <circle cx="0" cy="0" r="5" fill={cor || '#92400e'} stroke="#fff" strokeWidth="0.5" />;
    case 'prato': return <ellipse cx="0" cy="0" rx="7" ry="3" fill={cor || '#ca8a04'} />;
    case 'manequim': return <g><circle cx="0" cy="-5" r="3" fill={cor || '#dc2626'} /><rect x="-3" y="-2" width="6" height="8" rx="1" fill={cor || '#dc2626'} /></g>;
    case 'mini_gol': return <g><rect x="-7" y="-4" width="14" height="5" fill="none" stroke={cor || '#1d4ed8'} strokeWidth="1.5" /><line x1="-7" y1="1" x2="-7" y2="4" stroke={cor || '#1d4ed8'} strokeWidth="1.5" /><line x1="7" y1="1" x2="7" y2="4" stroke={cor || '#1d4ed8'} strokeWidth="1.5" /></g>;
    case 'barreira': return <rect x="-8" y="-3" width="16" height="6" rx="1" fill={cor || '#6b7280'} />;
    case 'bandeirinha': return <g><line x1="0" y1="0" x2="0" y2="-12" stroke={cor || '#dc2626'} strokeWidth="1" /><polygon points="0,-12 8,-8 0,-4" fill={cor || '#dc2626'} /></g>;
    case 'estaca': return <g><line x1="0" y1="-8" x2="0" y2="8" stroke={cor || '#15803d'} strokeWidth="2" /><circle cx="0" cy="-8" r="2" fill={cor || '#15803d'} /></g>;
    default: return <circle cx="0" cy="0" r="4" fill="#6b7280" />;
  }
}

export default function LousaTatica({ session, isDark }) {
  const svgRef = useRef(null);
  const [tipoCampo, setTipoCampo] = useState('futebol');
  const [formA, setFormA] = useState('4-3-3');
  const [formB, setFormB] = useState('4-4-2');
  const [players, setPlayers] = useState(() => [
    ...gerarJogadores(11, 'A'),
    ...gerarJogadores(11, 'B', 5),
  ]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [drawings, setDrawings] = useState([]);
  const [ferramenta, setFerramenta] = useState('selecionar');
  const [corAtiva, setCorAtiva] = useState('#ffffff');
  const [dragging, setDragging] = useState(null);
  const [drawPath, setDrawPath] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [titulo, setTitulo] = useState('Lousa Tática');
  const [saving, setSaving] = useState(false);
  const [dragEquip, setDragEquip] = useState(null);

  const s = (l, d) => isDark ? d : l;

  function salvarHistorico() {
    setHistorico(h => [...h.slice(-19), { players: [...players], equipamentos: [...equipamentos], drawings: [...drawings] }]);
  }

  function desfazer() {
    if (historico.length === 0) return;
    const prev = historico[historico.length - 1];
    setPlayers(prev.players); setEquipamentos(prev.equipamentos); setDrawings(prev.drawings);
    setHistorico(h => h.slice(0, -1));
  }

  function getSVGCoords(e) {
    const svg = svgRef.current;
    if (!svg) return { x: 50, y: 50 };
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 65,
    };
  }

  function aplicarFormacao(time, formKey) {
    const coords = FORMACOES[formKey];
    if (!coords) return;
    salvarHistorico();
    const n = CAMPO_TIPOS[tipoCampo].jogadores;
    setPlayers(prev => {
      const outros = prev.filter(p => p.time !== time);
      const meuTime = coords.slice(0, n).map((c, i) => ({
        id: `${time}_${i}_${Date.now()}`,
        time,
        numero: i + 1,
        pos: c.pos,
        x: time === 'B' ? 100 - c.x : c.x,
        y: time === 'B' ? 65 - c.y : c.y,
      }));
      return [...outros, ...meuTime];
    });
  }

  function handlePointerDown(e) {
    const coords = getSVGCoords(e);
    if (ferramenta === 'selecionar') {
      const p = players.find(p => Math.hypot(p.x - coords.x, p.y - coords.y) < 3);
      const eq = equipamentos.find(eq => Math.hypot(eq.x - coords.x, eq.y - coords.y) < 3);
      if (p) { salvarHistorico(); setDragging({ type: 'player', id: p.id }); }
      else if (eq) { salvarHistorico(); setDragging({ type: 'equip', id: eq.id }); }
    } else if (ferramenta === 'apagar') {
      salvarHistorico();
      const p = players.find(p => Math.hypot(p.x - coords.x, p.y - coords.y) < 3);
      if (p) { setPlayers(prev => prev.filter(pl => pl.id !== p.id)); return; }
      const eq = equipamentos.find(eq => Math.hypot(eq.x - coords.x, eq.y - coords.y) < 3);
      if (eq) { setEquipamentos(prev => prev.filter(e => e.id !== eq.id)); return; }
      const d = drawings.find(d => d.pontos.some(pt => Math.hypot(pt.x - coords.x, pt.y - coords.y) < 4));
      if (d) { setDrawings(prev => prev.filter(dr => dr.id !== d.id)); }
    } else if (ferramenta === 'seta' || ferramenta === 'linha') {
      salvarHistorico();
      setDrawPath({ tipo: ferramenta, pontos: [coords], cor: corAtiva, id: Date.now().toString() });
    }
    e.preventDefault();
  }

  function handlePointerMove(e) {
    const coords = getSVGCoords(e);
    if (dragging) {
      if (dragging.type === 'player') setPlayers(prev => prev.map(p => p.id === dragging.id ? { ...p, x: coords.x, y: coords.y } : p));
      if (dragging.type === 'equip') setEquipamentos(prev => prev.map(eq => eq.id === dragging.id ? { ...eq, x: coords.x, y: coords.y } : eq));
    }
    if (drawPath) setDrawPath(dp => ({ ...dp, pontos: [...dp.pontos, coords] }));
    e.preventDefault();
  }

  function handlePointerUp() {
    if (drawPath) {
      setDrawings(prev => [...prev, drawPath]);
      setDrawPath(null);
    }
    setDragging(null);
  }

  function handleDropEquip(e) {
    if (!dragEquip) return;
    const coords = getSVGCoords(e);
    salvarHistorico();
    setEquipamentos(prev => [...prev, { id: `eq_${Date.now()}`, tipo: dragEquip, x: coords.x, y: coords.y }]);
    setDragEquip(null);
    e.preventDefault();
  }

  function pathToD(pontos) {
    if (!pontos || pontos.length < 2) return '';
    const p = pontos;
    let d = `M ${p[0].x} ${p[0].y}`;
    for (let i = 1; i < p.length; i++) d += ` L ${p[i].x} ${p[i].y}`;
    return d;
  }

  function exportarPNG() {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 1400; canvas.height = 900;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 0, 0, 1400, 900); const url = canvas.toDataURL('image/png'); const a = document.createElement('a'); a.href = url; a.download = `${titulo}.png`; a.click(); };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
  }

  async function salvarNuvem() {
    setSaving(true);
    const estado = { players, equipamentos, drawings, tipoCampo, formA, formB };
    await supabase.from('lousa_tatica').insert([{ user_id: session.user.id, titulo, tipo_campo: tipoCampo, estado }]);
    setSaving(false);
    alert('✅ Lousa salva na nuvem!');
  }

  const CORES = ['#ffffff', '#ffff00', '#ff4444', '#000000', '#4488ff', '#00ff88'];
  const ferramentas = [
    { id: 'selecionar', label: 'Mover', icon: '✥' },
    { id: 'seta', label: 'Seta', icon: '→' },
    { id: 'linha', label: 'Linha', icon: '—' },
    { id: 'apagar', label: 'Apagar', icon: '✕' },
  ];

  const toolbarStyle = {
    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
    background: s('#fff', '#1f2937'), borderRadius: 12, marginBottom: 12,
    border: `1px solid ${s('#e5e7eb', '#374151')}`, flexWrap: 'wrap',
  };
  const btnTool = (active, color) => ({
    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
    background: active ? (color || '#16a34a') : s('#f3f4f6', '#374151'),
    color: active ? '#fff' : s('#374151', '#d1d5db'),
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 2 }}>Lousa Tática</h1>
          <input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            style={{ fontSize: 13, padding: '4px 10px', borderRadius: 6, background: s('#f9fafb', '#111827'), color: s('#374151', '#d1d5db'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none' }}
            placeholder="Nome da lousa..."
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={exportarPNG} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: '#1d4ed8', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            <Download size={16} /> PNG
          </button>
          <button type="button" onClick={salvarNuvem} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            <Save size={16} /> {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={toolbarStyle}>
        {/* Tipo de campo */}
        <div style={{ display: 'flex', gap: 4 }}>
          {Object.entries(CAMPO_TIPOS).map(([k, v]) => (
            <button type="button" key={k} onClick={() => { setTipoCampo(k); setFormA(FORMACAO_OPTIONS[k][0]); setFormB(FORMACAO_OPTIONS[k][0]); }} style={btnTool(tipoCampo === k, '#15803d')}>
              {v.label.split(' ')[0]}
            </button>
          ))}
        </div>
        <span style={{ color: s('#d1d5db', '#4b5563') }}>|</span>

        {/* Formações */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>A:</span>
          <select value={formA} onChange={e => { setFormA(e.target.value); aplicarFormacao('A', e.target.value); }}
            style={{ padding: '4px 8px', borderRadius: 6, fontSize: 12, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}` }}>
            {(FORMACAO_OPTIONS[tipoCampo] || []).map(f => <option key={f}>{f}</option>)}
          </select>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8' }}>B:</span>
          <select value={formB} onChange={e => { setFormB(e.target.value); aplicarFormacao('B', e.target.value); }}
            style={{ padding: '4px 8px', borderRadius: 6, fontSize: 12, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}` }}>
            {(FORMACAO_OPTIONS[tipoCampo] || []).map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <span style={{ color: s('#d1d5db', '#4b5563') }}>|</span>

        {/* Ferramentas de desenho */}
        <div style={{ display: 'flex', gap: 4 }}>
          {ferramentas.map(f => (
            <button type="button" key={f.id} onClick={() => setFerramenta(f.id)} style={btnTool(ferramenta === f.id, f.id === 'apagar' ? '#dc2626' : '#16a34a')} title={f.label}>
              {f.icon}
            </button>
          ))}
        </div>
        <span style={{ color: s('#d1d5db', '#4b5563') }}>|</span>

        {/* Cor */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {CORES.map(c => (
            <button type="button" key={c} onClick={() => setCorAtiva(c)} style={{
              width: 22, height: 22, borderRadius: '50%', background: c, border: `2px solid ${corAtiva === c ? '#16a34a' : s('#d1d5db', '#374151')}`, cursor: 'pointer',
            }} />
          ))}
        </div>
        <span style={{ color: s('#d1d5db', '#4b5563') }}>|</span>

        <button type="button" onClick={desfazer} style={{ ...btnTool(false), padding: '6px 10px' }} title="Desfazer">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Paleta de equipamentos */}
      <div style={{ ...toolbarStyle, marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: s('#374151', '#d1d5db'), marginRight: 4 }}>Equipamentos:</span>
        {EQUIPAMENTOS_TATICOS.map(eq => (
          <div
            key={eq.id}
            draggable
            onDragStart={() => setDragEquip(eq.id)}
            title={eq.label}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab',
              padding: '6px 10px', borderRadius: 8, background: s('#f3f4f6', '#374151'),
              userSelect: 'none',
            }}
          >
            <svg width="24" height="24" viewBox="-12 -12 24 24">
              <EquipamentoShape tipo={eq.id} cor={eq.cor} />
            </svg>
            <span style={{ fontSize: 10, color: s('#6b7280', '#9ca3af'), marginTop: 2 }}>{eq.label}</span>
          </div>
        ))}
      </div>

      {/* SVG do campo */}
      <div style={{ borderRadius: 16, overflow: 'hidden', border: `2px solid ${s('#e5e7eb', '#374151')}`, touchAction: 'none' }}
        onDragOver={e => e.preventDefault()} onDrop={handleDropEquip}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 65"
          style={{ display: 'block', width: '100%', cursor: ferramenta === 'apagar' ? 'crosshair' : ferramenta === 'selecionar' ? 'default' : 'crosshair' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 Z" fill={corAtiva} />
            </marker>
          </defs>

          <FieldSVG tipoCampo={tipoCampo} />

          {/* Equipamentos */}
          {equipamentos.map(eq => {
            const info = EQUIPAMENTOS_TATICOS.find(e => e.id === eq.tipo);
            return (
              <g key={eq.id} transform={`translate(${eq.x} ${eq.y})`}>
                <EquipamentoShape tipo={eq.tipo} cor={info?.cor} />
              </g>
            );
          })}

          {/* Desenhos salvos */}
          {drawings.map(d => (
            <path key={d.id} d={pathToD(d.pontos)} stroke={d.cor} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"
              markerEnd={d.tipo === 'seta' ? 'url(#arrowhead)' : undefined} />
          ))}

          {/* Desenho em andamento */}
          {drawPath && (
            <path d={pathToD(drawPath.pontos)} stroke={drawPath.cor} strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="2,1"
              markerEnd={drawPath.tipo === 'seta' ? 'url(#arrowhead)' : undefined} />
          )}

          {/* Jogadores */}
          {players.map(p => (
            <g key={p.id} transform={`translate(${p.x} ${p.y})`} style={{ cursor: ferramenta === 'selecionar' ? 'grab' : 'default' }}>
              <circle cx="0" cy="0" r="3.2" fill={p.time === 'A' ? '#16a34a' : '#1d4ed8'} stroke="#fff" strokeWidth="0.5" />
              <text x="0" y="1.1" textAnchor="middle" fontSize="2.8" fontWeight="bold" fill="#fff">{p.numero}</text>
              <text x="0" y="5.8" textAnchor="middle" fontSize="2" fill={p.time === 'A' ? '#16a34a' : '#1d4ed8'} fontWeight="600">{p.pos}</text>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: s('#374151', '#d1d5db') }}>
          <span style={{ width: 12, height: 12, background: '#16a34a', borderRadius: '50%', display: 'inline-block' }} /> Time A (Verde)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: s('#374151', '#d1d5db') }}>
          <span style={{ width: 12, height: 12, background: '#1d4ed8', borderRadius: '50%', display: 'inline-block' }} /> Time B (Azul)
        </span>
        <span style={{ fontSize: 12, color: s('#9ca3af', '#6b7280') }}>Arraste jogadores e equipamentos. Use as ferramentas para desenhar.</span>
      </div>
    </div>
  );
}
