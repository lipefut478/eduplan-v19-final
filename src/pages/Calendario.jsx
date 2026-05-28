import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ChevronLeft, ChevronRight, Calendar, ClipboardList, Plus, X } from 'lucide-react';

const DIAS_SEMANA_LBL = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function Calendario({ session, isDark, onAbrirMicro }) {
  const [data, setData] = useState(new Date());
  const [treinos, setTreinos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [novoEvento, setNovoEvento] = useState(null);

  const s = (l, d) => isDark ? d : l;

  useEffect(() => { carregar(); }, [data]);

  async function carregar() {
    const uid = session.user.id;
    const [t, e] = await Promise.all([
      supabase.from('planos_treino').select('id, escola, categoria, tema, data_treino, duracao_total, gerado_por_ia').eq('user_id', uid),
      supabase.from('eventos_calendario').select('*').eq('user_id', uid),
    ]);
    setTreinos(t.data || []);
    setEventos(e.data || []);
  }

  async function adicionarEvento(novo) {
    const { error } = await supabase.from('eventos_calendario').insert([{ ...novo, user_id: session.user.id }]);
    if (!error) { setNovoEvento(null); carregar(); }
  }

  async function excluirEvento(id) {
    await supabase.from('eventos_calendario').delete().eq('id', id);
    carregar();
  }

  const mes = data.getMonth();
  const ano = data.getFullYear();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const grid = [];
  for (let i = 0; i < primeiroDia; i++) grid.push(null);
  for (let i = 1; i <= diasNoMes; i++) grid.push(i);

  function dataStr(dia) {
    const m = String(mes + 1).padStart(2, '0');
    const d = String(dia).padStart(2, '0');
    return `${ano}-${m}-${d}`;
  }

  function itensDoDia(dia) {
    const ds = dataStr(dia);
    const ts = treinos.filter(t => t.data_treino === ds);
    const ev = eventos.filter(e => e.data === ds);
    return [...ts.map(t => ({ ...t, _tipo: 'treino' })), ...ev.map(e => ({ ...e, _tipo: 'evento' }))];
  }

  const card = { background: s('#fff', '#1f2937'), borderRadius: 16, padding: 20, border: `1px solid ${s('#e5e7eb', '#374151')}` };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 4 }}>Calendário</h1>
          <p style={{ fontSize: 14, color: s('#6b7280', '#9ca3af') }}>Visualize treinos planejados e crie eventos.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={() => setData(new Date(ano, mes - 1, 1))} style={{ padding: 8, background: s('#fff', '#1f2937'), border: `1px solid ${s('#e5e7eb', '#374151')}`, borderRadius: 8, cursor: 'pointer' }}>
            <ChevronLeft size={18} color={s('#374151', '#d1d5db')} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: s('#111827', '#f3f4f6'), minWidth: 180, textAlign: 'center' }}>{MESES[mes]} {ano}</span>
          <button type="button" onClick={() => setData(new Date(ano, mes + 1, 1))} style={{ padding: 8, background: s('#fff', '#1f2937'), border: `1px solid ${s('#e5e7eb', '#374151')}`, borderRadius: 8, cursor: 'pointer' }}>
            <ChevronRight size={18} color={s('#374151', '#d1d5db')} />
          </button>
        </div>
      </div>

      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
          {DIAS_SEMANA_LBL.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: s('#6b7280', '#9ca3af'), padding: 8 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {grid.map((dia, i) => {
            if (!dia) return <div key={i} />;
            const itens = itensDoDia(dia);
            const isHoje = new Date().toDateString() === new Date(ano, mes, dia).toDateString();
            return (
              <div
                key={i}
                onClick={() => setDiaSelecionado(dia)}
                style={{
                  minHeight: 80, padding: 6, borderRadius: 8, cursor: 'pointer',
                  border: `1px solid ${isHoje ? '#16a34a' : s('#e5e7eb', '#374151')}`,
                  background: itens.length > 0 ? s('#f0fdf4', '#052e16') : s('#f9fafb', '#111827'),
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: isHoje ? 800 : 600, color: isHoje ? '#16a34a' : s('#374151', '#d1d5db'), marginBottom: 4 }}>{dia}</div>
                {itens.slice(0, 2).map((it, j) => (
                  <div key={j} style={{
                    fontSize: 10, padding: '2px 4px', borderRadius: 4,
                    background: it._tipo === 'treino' ? '#16a34a' : '#1d4ed8',
                    color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {it._tipo === 'treino' ? `🏃 ${it.tema || it.categoria}` : `📌 ${it.titulo}`}
                  </div>
                ))}
                {itens.length > 2 && <div style={{ fontSize: 10, color: s('#6b7280', '#9ca3af') }}>+{itens.length - 2} mais</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dia selecionado */}
      {diaSelecionado && (
        <div style={{ ...card, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: s('#111827', '#f3f4f6') }}>
              {diaSelecionado} de {MESES[mes]} de {ano}
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setNovoEvento({ data: dataStr(diaSelecionado), titulo: '', descricao: '', tipo: 'reuniao' })} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: '#1d4ed8', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                <Plus size={14} /> Evento
              </button>
              <button type="button" onClick={() => setDiaSelecionado(null)} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} color={s('#6b7280', '#9ca3af')} />
              </button>
            </div>
          </div>
          {itensDoDia(diaSelecionado).length === 0 ? (
            <p style={{ fontSize: 13, color: s('#9ca3af', '#6b7280') }}>Nenhum treino ou evento neste dia.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {itensDoDia(diaSelecionado).map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, background: s('#f9fafb', '#111827'), borderLeft: `4px solid ${it._tipo === 'treino' ? '#16a34a' : '#1d4ed8'}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s('#111827', '#f3f4f6') }}>
                      {it._tipo === 'treino' ? `🏃 ${it.tema || it.categoria}` : `📌 ${it.titulo}`}
                    </div>
                    <div style={{ fontSize: 12, color: s('#6b7280', '#9ca3af') }}>
                      {it._tipo === 'treino' ? `${it.escola} · ${it.duracao_total}min` : it.descricao}
                    </div>
                  </div>
                  {it._tipo === 'treino' ? (
                    <button type="button" onClick={() => onAbrirMicro?.()} style={{ padding: '6px 12px', borderRadius: 7, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Ir</button>
                  ) : (
                    <button type="button" onClick={() => excluirEvento(it.id)} style={{ padding: '6px 12px', borderRadius: 7, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Excluir</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {novoEvento && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: s('#fff', '#1f2937'), borderRadius: 16, padding: 28, width: '100%', maxWidth: 500 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 16 }}>Novo Evento</h2>
            <input
              placeholder="Título do evento..."
              value={novoEvento.titulo}
              onChange={e => setNovoEvento({ ...novoEvento, titulo: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, marginBottom: 10, fontSize: 14, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, boxSizing: 'border-box', outline: 'none' }}
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={novoEvento.descricao}
              onChange={e => setNovoEvento({ ...novoEvento, descricao: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, marginBottom: 10, fontSize: 14, minHeight: 70, resize: 'vertical', background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, boxSizing: 'border-box', outline: 'none' }}
            />
            <select
              value={novoEvento.tipo}
              onChange={e => setNovoEvento({ ...novoEvento, tipo: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14, background: s('#f9fafb', '#111827'), color: s('#111827', '#f3f4f6'), border: `1px solid ${s('#d1d5db', '#374151')}`, boxSizing: 'border-box' }}
            >
              <option value="reuniao">Reunião</option>
              <option value="jogo">Jogo</option>
              <option value="avaliacao">Avaliação</option>
              <option value="folga">Folga</option>
              <option value="outro">Outro</option>
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => adicionarEvento(novoEvento)} style={{ flex: 1, padding: '10px 20px', borderRadius: 8, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Salvar</button>
              <button type="button" onClick={() => setNovoEvento(null)} style={{ padding: '10px 20px', borderRadius: 8, background: s('#f3f4f6', '#374151'), color: s('#374151', '#d1d5db'), border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
