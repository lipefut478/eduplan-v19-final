import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  Calendar, BarChart2, ClipboardList, Target, BookOpen, Bot,
  TrendingUp, Award, Clock, Users, Zap, Activity
} from 'lucide-react';
import { TOTAL_ATIVIDADES, BLOCOS_TREINO } from '../data/footballData';

export default function Dashboard({ session, isDark, onNavigate, metodologia }) {
  const [stats, setStats] = useState({
    macros: 0, mesos: 0, micros: 0, lousas: 0, exercicios: 0,
    iaGerados: 0, horasPlanejadas: 0, ultimoTreino: null, recentes: [],
  });

  const s = (l, d) => isDark ? d : l;

  async function carregar() {
    const uid = session.user.id;
    const [macros, mesos, micros, lousas, exercicios] = await Promise.all([
      supabase.from('planos_macro').select('id').eq('user_id', uid),
      supabase.from('planos_meso').select('id').eq('user_id', uid),
      supabase.from('planos_treino').select('id, escola, categoria, tema, data_treino, duracao_total, gerado_por_ia, created_at').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('lousa_tatica').select('id').eq('user_id', uid),
      supabase.from('exercicios').select('id, tags').eq('user_id', uid),
    ]);
    const microsData = micros.data || [];
    const totalMin = microsData.reduce((acc, p) => acc + (p.duracao_total || 0), 0);
    const iaGerados = (exercicios.data || []).filter(e => (e.tags || []).includes('gerado-ia')).length;
    setStats({
      macros: macros.data?.length || 0,
      mesos: mesos.data?.length || 0,
      micros: microsData.length,
      lousas: lousas.data?.length || 0,
      exercicios: exercicios.data?.length || 0,
      iaGerados,
      horasPlanejadas: Math.round(totalMin / 60),
      ultimoTreino: microsData[0] || null,
      recentes: microsData.slice(0, 5),
    });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { carregar(); }, []);

  const card = { background: s('#fff', '#1f2937'), borderRadius: 16, padding: 24, border: `1px solid ${s('#e5e7eb', '#374151')}` };
  const tileGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 };

  const tiles = [
    { icon: ClipboardList, label: 'Treinos Planejados', value: stats.micros, color: '#16a34a', mod: 'micro' },
    { icon: Calendar, label: 'Planos Macro', value: stats.macros, color: '#f97316', mod: 'macro' },
    { icon: BarChart2, label: 'Planos Meso', value: stats.mesos, color: '#8b5cf6', mod: 'meso' },
    { icon: Target, label: 'Lousas Salvas', value: stats.lousas, color: '#1d4ed8', mod: 'lousa' },
    { icon: BookOpen, label: 'Exercícios no Banco', value: stats.exercicios, color: '#ca8a04', mod: 'exercicios' },
    { icon: Bot, label: 'Gerados por IA', value: stats.iaGerados, color: '#dc2626' },
    { icon: Clock, label: 'Horas Planejadas', value: stats.horasPlanejadas, color: '#0891b2' },
    { icon: Activity, label: 'Banco Total (sistema)', value: TOTAL_ATIVIDADES, color: '#15803d' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 6 }}>
          Bem-vindo{metodologia?.nome_escola ? `, ${metodologia.nome_escola}` : ''}! ⚽
        </h1>
        <p style={{ fontSize: 14, color: s('#6b7280', '#9ca3af') }}>Visão geral do seu planejamento esportivo</p>
      </div>

      {/* Tiles */}
      <div style={tileGrid}>
        {tiles.map((t, i) => {
          const Icon = t.icon;
          return (
            <div
              key={i}
              onClick={() => t.mod && onNavigate?.(t.mod)}
              style={{ ...card, padding: 18, cursor: t.mod ? 'pointer' : 'default', transition: 'transform 0.15s', borderTop: `3px solid ${t.color}` }}
              onMouseEnter={e => { if (t.mod) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Icon size={20} color={t.color} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s('#111827', '#f3f4f6'), lineHeight: 1 }}>{t.value}</div>
              <div style={{ fontSize: 12, color: s('#6b7280', '#9ca3af'), marginTop: 4, fontWeight: 500 }}>{t.label}</div>
            </div>
          );
        })}
      </div>

      {/* Métricas e atalhos */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 14 }}>Últimos Treinos Planejados</h2>
          {stats.recentes.length === 0 ? (
            <p style={{ fontSize: 13, color: s('#9ca3af', '#6b7280') }}>Nenhum treino criado ainda. Comece pelo módulo Micro!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.recentes.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: s('#f9fafb', '#111827') }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#16a34a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ClipboardList size={18} color="#16a34a" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s('#111827', '#f3f4f6') }}>{p.tema || 'Sem tema'} · {p.categoria}</div>
                    <div style={{ fontSize: 12, color: s('#6b7280', '#9ca3af') }}>{p.escola} · {p.data_treino} · {p.duracao_total}min</div>
                  </div>
                  {p.gerado_por_ia && <span style={{ fontSize: 10, background: '#1d4ed8', color: '#fff', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>IA</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: s('#111827', '#f3f4f6'), marginBottom: 14 }}>Atalhos Rápidos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Criar Treino com IA', icon: Bot, mod: 'micro', color: '#1d4ed8' },
              { label: 'Abrir Lousa Tática', icon: Target, mod: 'lousa', color: '#16a34a' },
              { label: 'Banco de Exercícios', icon: BookOpen, mod: 'exercicios', color: '#ca8a04' },
              { label: 'Calendário', icon: Calendar, mod: 'calendario', color: '#f97316' },
              { label: 'Elenco', icon: Users, mod: 'elenco', color: '#8b5cf6' },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <button type="button" key={i} onClick={() => onNavigate?.(a.mod)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', background: s('#f9fafb', '#111827'), color: s('#374151', '#d1d5db'), cursor: 'pointer', fontWeight: 600, fontSize: 13, textAlign: 'left' }}>
                  <Icon size={16} color={a.color} /> {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
