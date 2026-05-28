import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import Metodologia from './pages/Metodologia';
import MacroPlano from './pages/MacroPlano';
import MesoPlano from './pages/MesoPlano';
import MicroPlano from './pages/MicroPlano';
import LousaTatica from './pages/LousaTatica';
import BancoExercicios from './pages/BancoExercicios';
import MeusPlanos from './pages/MeusPlanos';
import Calendario from './pages/Calendario';
import Elenco from './pages/Elenco';
import ChatIA from './pages/ChatIA';
import Modelos from './pages/Modelos';
import Partidas from './pages/Partidas';
import {
  Home, BookOpen, Calendar, BarChart2, ClipboardList, Target, BookMarked,
  FolderOpen, LogOut, Moon, Sun, Menu, X, Users, Sparkles, CalendarDays, Library, Trophy,
} from 'lucide-react';

const MODULES = [
  { id: 'dashboard',   label: 'Dashboard',          icon: Home,          group: 'Início' },
  { id: 'metodologia', label: 'Metodologia',         icon: BookOpen,      group: 'Planejamento' },
  { id: 'macro',       label: 'Macro',                icon: Calendar,      group: 'Planejamento' },
  { id: 'meso',        label: 'Meso',                 icon: BarChart2,     group: 'Planejamento' },
  { id: 'micro',       label: 'Micro (Treino)',       icon: ClipboardList, group: 'Planejamento' },
  { id: 'modelos',     label: 'Modelos de Treino',    icon: Library,       group: 'Planejamento' },
  { id: 'calendario',  label: 'Calendário',           icon: CalendarDays,  group: 'Operação' },
  { id: 'elenco',      label: 'Elenco',               icon: Users,         group: 'Operação' },
  { id: 'partidas',    label: 'Partidas',             icon: Trophy,        group: 'Operação' },
  { id: 'lousa',       label: 'Lousa Tática',         icon: Target,        group: 'Ferramentas' },
  { id: 'exercicios',  label: 'Banco de Exercícios',  icon: BookMarked,    group: 'Ferramentas' },
  { id: 'chat',        label: 'Assistente IA',        icon: Sparkles,      group: 'Ferramentas' },
  { id: 'planos',      label: 'Meus Planos',          icon: FolderOpen,    group: 'Ferramentas' },
];

export default function FootballApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metodologiaData, setMetodologiaData] = useState(null);
  const [modeloEscolhido, setModeloEscolhido] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    supabase.from('metodologia').select('*').eq('user_id', session.user.id).single()
      .then(({ data }) => { if (data) setMetodologiaData(data); });
  }, [session]);

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚽</div>
          <p style={{ color: '#16a34a', fontWeight: 700, fontSize: 18 }}>FootballPlan</p>
        </div>
      </div>
    );
  }

  if (!session) return <Login />;

  const s = (l, d) => isDark ? d : l;
  const bg = isDark ? '#111827' : '#f0fdf4';
  const sidebar = isDark ? '#0f172a' : '#fff';
  const sidebarBorder = isDark ? '#1e293b' : '#e5e7eb';
  const textPrimary = isDark ? '#f3f4f6' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';

  const groups = ['Início', 'Planejamento', 'Operação', 'Ferramentas'];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <aside style={{
        width: sidebarOpen ? 240 : 0, flexShrink: 0, background: sidebar, borderRight: `1px solid ${sidebarBorder}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.2s', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        {sidebarOpen && (
          <>
            <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${sidebarBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚽</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: textPrimary }}>FootballPlan</div>
                  <div style={{ fontSize: 11, color: textMuted }}>Pro Edition</div>
                </div>
              </div>
            </div>

            <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
              {groups.map(group => (
                <div key={group} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 10px', marginBottom: 4 }}>{group}</div>
                  {MODULES.filter(m => m.group === group).map(mod => {
                    const Icon = mod.icon;
                    const active = currentModule === mod.id;
                    return (
                      <button
        type="button"
                        key={mod.id}
                        onClick={() => setCurrentModule(mod.id)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9,
                          border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: 2, fontWeight: active ? 700 : 500,
                          background: active ? '#16a34a' : 'transparent',
                          color: active ? '#fff' : textMuted, fontSize: 14,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = s('#f3f4f6', '#1e293b'); }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Icon size={17} />
                        {mod.label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div style={{ padding: '12px 10px', borderTop: `1px solid ${sidebarBorder}` }}>
              <div style={{ padding: '6px 10px', marginBottom: 4, fontSize: 12, color: textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.user.email}
              </div>
              <button
        type="button"
                onClick={() => setIsDark(d => !d)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', background: 'transparent', color: textMuted, fontSize: 14, fontWeight: 500, marginBottom: 2 }}
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
                {isDark ? 'Modo Claro' : 'Modo Escuro'}
              </button>
              <button
        type="button"
                onClick={logout}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', background: 'transparent', color: '#dc2626', fontSize: 14, fontWeight: 600 }}
              >
                <LogOut size={17} /> Sair
              </button>
            </div>
          </>
        )}
      </aside>

      <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 0, transition: 'margin-left 0.2s', minHeight: '100vh' }}>
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: s('#ffffffcc', '#111827cc'), backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${sidebarBorder}`, padding: '0 20px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="button" onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: textMuted }}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span style={{ fontWeight: 700, fontSize: 16, color: textPrimary }}>
              {MODULES.find(m => m.id === currentModule)?.label}
            </span>
          </div>
          {metodologiaData?.nome_escola && (
            <span style={{ fontSize: 13, color: textMuted, fontWeight: 500 }}>
              🏫 {metodologiaData.nome_escola}
            </span>
          )}
        </header>

        <main style={{ minHeight: 'calc(100vh - 56px)' }}>
          {currentModule === 'dashboard' && (
            <Dashboard session={session} isDark={isDark} onNavigate={setCurrentModule} metodologia={metodologiaData} />
          )}
          {currentModule === 'metodologia' && (
            <Metodologia session={session} isDark={isDark} onSaved={data => setMetodologiaData(data)} />
          )}
          {currentModule === 'macro' && (
            <MacroPlano session={session} isDark={isDark} metodologia={metodologiaData} />
          )}
          {currentModule === 'meso' && (
            <MesoPlano session={session} isDark={isDark} metodologia={metodologiaData} />
          )}
          {currentModule === 'micro' && (
            <MicroPlano session={session} isDark={isDark} metodologia={metodologiaData} preset={modeloEscolhido} onPresetUsed={() => setModeloEscolhido(null)} />
          )}
          {currentModule === 'modelos' && (
            <Modelos session={session} isDark={isDark} onUsar={preset => { setModeloEscolhido(preset); setCurrentModule('micro'); }} />
          )}
          {currentModule === 'calendario' && (
            <Calendario session={session} isDark={isDark} onAbrirMicro={() => setCurrentModule('micro')} />
          )}
          {currentModule === 'elenco' && (
            <Elenco session={session} isDark={isDark} />
          )}
          {currentModule === 'partidas' && (
            <Partidas session={session} isDark={isDark} />
          )}
          {currentModule === 'lousa' && (
            <LousaTatica session={session} isDark={isDark} />
          )}
          {currentModule === 'exercicios' && (
            <BancoExercicios session={session} isDark={isDark} />
          )}
          {currentModule === 'chat' && (
            <ChatIA session={session} isDark={isDark} metodologia={metodologiaData} />
          )}
          {currentModule === 'planos' && (
            <MeusPlanos
              session={session}
              isDark={isDark}
              onAbrirMicro={() => setCurrentModule('micro')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
