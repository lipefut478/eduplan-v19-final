import React from 'react';
import { ArrowRight, CheckCircle, Shield, Zap, BookOpen } from 'lucide-react';

export default function LandingPage({ onLoginClick }) {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#334155', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* HEADER / NAV */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', background: '#fff', borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
          }}>
            <BookOpen size={24} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>EduPlan Gold</span>
        </div>
        <button 
          onClick={onLoginClick}
          style={{
            padding: '10px 24px', background: '#0f172a', color: '#fff', borderRadius: '8px',
            border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
          Área do Professor <ArrowRight size={18} />
        </button>
      </nav>

      {/* HERO SECTION */}
      <header style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ 
          display: 'inline-block', padding: '6px 16px', background: '#dbeafe', color: '#1d4ed8', 
          borderRadius: '20px', fontWeight: '600', fontSize: '0.9rem', marginBottom: '20px' 
        }}>
          ✨ Versão 19 Gold - Novo Motor Pedagógico
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.1', marginBottom: '24px' }}>
          Planejamento Escolar <br />
          <span style={{ background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Alinhado à BNCC
          </span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '40px', lineHeight: '1.6' }}>
          Crie planos de aula semanais em minutos, não horas. 
          Sem repetição de atividades, com exportação para Word e PDF. 
          Feito para professores exigentes.
        </p>
        <button 
          onClick={onLoginClick}
          style={{
            padding: '16px 48px', fontSize: '1.2rem', background: '#2563eb', color: '#fff',
            border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)', transition: 'transform 0.2s'
          }}>
          Começar Agora Gratuitamente
        </button>
      </header>

      {/* FEATURES */}
      <section style={{ padding: '60px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {[
            { icon: Zap, title: "Zero Repetição", text: "Nosso algoritmo garante que você nunca repita a mesma atividade na semana." },
            { icon: CheckCircle, title: "100% BNCC", text: "Todos os códigos e objetivos de aprendizagem já integrados e validados." },
            { icon: Shield, title: "Exportação Word", text: "Baixe e edite no seu computador com formatação profissional." }
          ].map((feature, idx) => (
            <div key={idx} style={{ padding: '30px', borderRadius: '16px', border: '1px solid #f1f5f9', background: '#f8fafc' }}>
              <feature.icon size={40} color="#2563eb" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.9rem' }}>
        © 2024 EduPlan Gold - Desenvolvido por HM Gestão
      </footer>
    </div>
  );
}