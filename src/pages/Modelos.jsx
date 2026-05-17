import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Copy, BookMarked, Star, X } from 'lucide-react';
import { BLOCOS_TREINO, CATEGORIAS, calcularDuracoes } from '../data/footballData';

// Modelos pré-definidos do sistema
const MODELOS_SISTEMA = [
  {
    id: 'sis_passe_curto',
    nome: 'Treino Foco em Passe Curto',
    categoria: 'Sub-13',
    duracao: 90,
    tema: 'Passe Curto e Movimentação',
    objetivo: 'Aprimorar passe curto, recepção e movimentação para receber',
    blocos: ['Rondo 3x1 aquecimento', 'Corrida com bola', 'Passe em duplas e trios', 'Posse 5x5+2', 'Jogo com mínimo 3 passes', 'Jogo 7x7', 'Alongamento'],
    sistema: true,
  },
  {
    id: 'sis_finalizacao',
    nome: 'Treino de Finalização',
    categoria: 'Sub-15',
    duracao: 100,
    tema: 'Finalização Variada',
    objetivo: 'Trabalhar finalização de diferentes posições e situações',
    blocos: ['Ativação com bola', 'Tiros e sprints', 'Finalização por zona', 'Combinações 2x1', 'Mini-jogo com gols de cabeça valendo dobro', 'Jogo livre', 'Volta à calma'],
    sistema: true,
  },
  {
    id: 'sis_iniciacao',
    nome: 'Iniciação Lúdica',
    categoria: 'Sub-7',
    duracao: 60,
    tema: 'Familiarização com a Bola',
    objetivo: 'Crianças se divertirem enquanto desenvolvem coordenação com a bola',
    blocos: ['Pega-pega com bola', 'Circuito coordenativo', 'Domínio livre', 'Tática básica em 3x3', 'Futebol divertido', 'Jogo livre 4x4', 'Conversa em roda'],
    sistema: true,
  },
  {
    id: 'sis_tatica_pressao',
    nome: 'Pressão Alta e Bloco Defensivo',
    categoria: 'Sub-17',
    duracao: 110,
    tema: 'Pressão Coletiva',
    objetivo: 'Treinar a pressão alta coordenada e o retorno ao bloco baixo',
    blocos: ['Rondo intenso', 'HIIT físico', 'Posicionamento defensivo', 'Pressão alta organizada', 'Posse com gatilhos de pressão', 'Jogo 9x9 com regras de pressão', 'Análise tática'],
    sistema: true,
  },
  {
    id: 'sis_pre_jogo',
    nome: 'Treino Pré-Jogo',
    categoria: 'Adulto/Amador',
    duracao: 75,
    tema: 'Ativação e Mentalidade',
    objetivo: 'Preparar fisicamente, taticamente e mentalmente para o jogo',
    blocos: ['Ativação dinâmica', 'Tiros curtos', 'Passe e movimentação', 'Bola parada', 'Posse leve', 'Mini-jogo curto', 'Reflexão de equipe'],
    sistema: true,
  },
  {
    id: 'sis_recuperacao',
    nome: 'Treino de Recuperação Pós-Jogo',
    categoria: 'Sub-20',
    duracao: 60,
    tema: 'Regeneração',
    objetivo: 'Recuperar fisicamente e analisar o jogo anterior',
    blocos: ['Trote regenerativo', 'Mobilidade ativa', 'Toques leves de bola', 'Análise tática individual', 'Posse sem pressão', 'Jogo recreativo', 'Foam roller'],
    sistema: true,
  },
];

export default function Modelos({ session, isDark, onUsar }) {
  const [meus, setMeus] = useState([]);
  const [filtro, setFiltro] = useState('');

  const s = (l, d) => isDark ? d : l;

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const { data } = await supabase.from('modelos_treino').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    setMeus(data || []);
  }

  async function excluir(id) {
    if (!confirm('Excluir modelo?')) return;
    await supabase.from('modelos_treino').delete().eq('id', id);
    carregar();
  }

  function usarModelo(m) {
    onUsar?.({
      categoria: m.categoria,
      duracao_total: m.duracao,
      tema: m.tema,
      objetivo: m.objetivo,
    });
  }

  const todos = [...MODELOS_SISTEMA, ...meus];
  const filtrados = todos.filter(m => {
    if (filtro && !m.nome.toLowerCase().includes(filtro.toLowerCase()) && !m.tema?.toLowerCase().includes(filtro.toLowerCase())) return false;
    return true;
  });

  const card = { background: s('#fff', '#1f2937'), borderRadius: 14, padding: 18, border: `1px solid ${s('#e5e7eb', '#374151')}` };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>Modelos de Treino</h1>
          <p style={{ fontSize: 14, color: s('#6b7280', '#9ca3af') }}>{MODELOS_SISTEMA.length} modelos do sistema + {meus.length} seu{meus.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <input
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          placeholder="Buscar modelo..."
          style={{ width: '100%', maxWidth: 400, padding: '10px 14px', borderRadius: 8, fontSize: 14, background: s('#fff', '#1f2937'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {filtrados.map(m => (
          <div key={m.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookMarked size={18} color="#16a34a" />
                <span style={{ fontSize: 11, background: m.sistema ? '#dcfce7' : '#dbeafe', color: m.sistema ? '#15803d' : '#1d4ed8', borderRadius: 10, padding: '2px 8px', fontWeight: 700 }}>
                  {m.sistema ? 'SISTEMA' : 'MEU'}
                </span>
              </div>
              {!m.sistema && (
                <button onClick={() => excluir(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Trash2 size={14} color="#dc2626" /></button>
              )}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>{m.nome}</div>
            <div style={{ fontSize: 12, color: s('#6b7280', '#9ca3af'), marginBottom: 8 }}>{m.categoria} · {m.duracao}min</div>
            <div style={{ fontSize: 13, color: s('#374151', '#d1d5db'), marginBottom: 12, lineHeight: 1.4 }}>{m.tema}</div>
            <button onClick={() => usarModelo(m)} style={{ width: '100%', padding: '8px 0', borderRadius: 8, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Copy size={14} /> Usar Modelo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
