import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, FolderOpen, Calendar, BarChart2, ClipboardList, Target, BookOpen } from 'lucide-react';
import { toast } from '../lib/toast';
import { MESSAGES, messageFromSupabaseError } from '../lib/messages';

const TABS = [
  { id: 'macro',    label: 'Macro',       icon: Calendar },
  { id: 'meso',     label: 'Meso',        icon: BarChart2 },
  { id: 'micro',    label: 'Micro',       icon: ClipboardList },
  { id: 'lousa',    label: 'Lousa',       icon: Target },
  { id: 'exercicios', label: 'Exercícios', icon: BookOpen },
];

export default function MeusPlanos({ session, isDark, onAbrirMicro }) {
  const [tab, setTab] = useState('micro');
  const [macro, setMacro] = useState([]);
  const [meso, setMeso] = useState([]);
  const [micro, setMicro] = useState([]);
  const [lousa, setLousa] = useState([]);
  const [exercicios, setExercicios] = useState([]);

  const s = (l, d) => isDark ? d : l;


  async function carregar() {
    const uid = session.user.id;
    try {
      if (tab === 'macro') {
        const { data, error } = await supabase.from('planos_macro').select('*').eq('user_id', uid).order('created_at', { ascending: false });
        if (error) throw error;
        setMacro(data || []);
      } else if (tab === 'meso') {
        const { data, error } = await supabase.from('planos_meso').select('*').eq('user_id', uid).order('created_at', { ascending: false });
        if (error) throw error;
        setMeso(data || []);
      } else if (tab === 'micro') {
        const { data, error } = await supabase.from('planos_treino').select('*').eq('user_id', uid).order('created_at', { ascending: false });
        if (error) throw error;
        setMicro(data || []);
      } else if (tab === 'lousa') {
        const { data, error } = await supabase.from('lousa_tatica').select('*').eq('user_id', uid).order('created_at', { ascending: false });
        if (error) throw error;
        setLousa(data || []);
      } else if (tab === 'exercicios') {
        const { data, error } = await supabase.from('exercicios').select('*').eq('user_id', uid).order('created_at', { ascending: false });
        if (error) throw error;
        setExercicios(data || []);
      }
    } catch (e) {
      toast.error(messageFromSupabaseError(e instanceof Error ? { message: e.message } : e));
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { carregar(); }, [tab]);

  async function excluir(tabela, id) {
    if (!confirm('Excluir permanentemente?')) return;
    try {
      const { error } = await supabase.from(tabela).delete().eq('id', id);
      if (error) throw error;
      toast.success(MESSAGES.success.deleted);
      carregar();
    } catch (e) {
      toast.error(messageFromSupabaseError(e instanceof Error ? { message: e.message } : e));
    }
  }

  const card = { background: s('#fff', '#1f2937'), borderRadius: 14, padding: 18, border: `1px solid ${s('#e5e7eb', '#374151')}` };
  const badge = (color) => ({ fontSize: 11, background: color + '22', color, borderRadius: 12, padding: '2px 8px', fontWeight: 600 });
  const btnDanger = { padding: '7px 10px', borderRadius: 7, background: s('#fee2e2', '#7f1d1d'), color: '#dc2626', border: 'none', cursor: 'pointer' };
  const btnSuccess = { display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', borderRadius: 7, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 };

  function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR');
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 6 }}>Meus Planos</h1>
      <p style={{ color: s('#6b7280', '#9ca3af'), fontSize: 14, marginBottom: 24 }}>Todos os seus planejamentos salvos na nuvem.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: s('#f3f4f6', '#111827'), borderRadius: 12, padding: 4 }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button type="button" key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              background: tab === t.id ? '#16a34a' : 'transparent',
              color: tab === t.id ? '#fff' : s('#6b7280', '#9ca3af'),
            }}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Macro */}
      {tab === 'macro' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {macro.length === 0 && <EmptyState msg="Nenhum plano macro salvo." />}
          {macro.map(p => (
            <div key={p.id} style={card}>
              <div style={{ fontWeight: 700, fontSize: 15, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>{p.titulo}</div>
              <div style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 8 }}>{p.categoria} · {p.temporada}</div>
              <div style={{ fontSize: 12, color: s('#9ca3af', '#6b7280'), marginBottom: 12 }}>Criado em {formatDate(p.created_at)}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => excluir('planos_macro', p.id)} style={btnDanger}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Meso */}
      {tab === 'meso' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {meso.length === 0 && <EmptyState msg="Nenhum plano meso salvo." />}
          {meso.map(p => (
            <div key={p.id} style={card}>
              <div style={{ fontWeight: 700, fontSize: 15, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>{p.titulo}</div>
              <div style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 4 }}>{p.categoria} · {p.mes_ref}</div>
              <div style={{ fontSize: 12, color: s('#9ca3af', '#6b7280'), marginBottom: 12 }}>{(p.semanas || []).length} semanas · Criado em {formatDate(p.created_at)}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => excluir('planos_meso', p.id)} style={btnDanger}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Micro */}
      {tab === 'micro' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {micro.length === 0 && <EmptyState msg="Nenhum plano de treino salvo." />}
          {micro.map(p => (
            <div key={p.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: s('#111827', '#f3f4f6') }}>{p.tema || 'Sem tema'}</div>
                {p.gerado_por_ia && <span style={{ ...badge('#1d4ed8'), display: 'inline-block' }}>IA</span>}
              </div>
              <div style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 4 }}>{p.escola} · {p.categoria}</div>
              <div style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 4 }}>Treinador: {p.treinador}</div>
              <div style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 8 }}>{p.data_treino} · {p.duracao_total}min</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={badge('#16a34a')}>{(p.blocos || []).filter(b => !b.pulado).length} blocos ativos</span>
                <span style={badge('#6b7280')}>{formatDate(p.created_at)}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => onAbrirMicro?.(p)} style={btnSuccess}><FolderOpen size={13} /> Abrir</button>
                <button type="button" onClick={() => excluir('planos_treino', p.id)} style={btnDanger}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lousa */}
      {tab === 'lousa' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {lousa.length === 0 && <EmptyState msg="Nenhuma lousa tática salva." />}
          {lousa.map(p => (
            <div key={p.id} style={card}>
              <div style={{ fontWeight: 700, fontSize: 15, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>{p.titulo}</div>
              <div style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 4 }}>Tipo: {p.tipo_campo}</div>
              <div style={{ fontSize: 12, color: s('#9ca3af', '#6b7280'), marginBottom: 12 }}>Criado em {formatDate(p.created_at)}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => excluir('lousa_tatica', p.id)} style={btnDanger}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercícios */}
      {tab === 'exercicios' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {exercicios.length === 0 && <EmptyState msg="Nenhum exercício cadastrado." />}
          {exercicios.map(ex => (
            <div key={ex.id} style={card}>
              <div style={{ fontWeight: 700, fontSize: 15, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>{ex.titulo}</div>
              <div style={{ fontSize: 13, color: s('#6b7280', '#9ca3af'), marginBottom: 4 }}>{ex.duracao_sugerida}min</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                {(ex.tags || []).map((t, i) => <span key={i} style={badge('#16a34a')}>{t}</span>)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => excluir('exercicios', ex.id)} style={btnDanger}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ msg }) {
  return (
    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: '#9ca3af' }}>
      <FolderOpen size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
      <p>{msg}</p>
    </div>
  );
}
