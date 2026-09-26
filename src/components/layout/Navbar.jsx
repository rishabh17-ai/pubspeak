import React from 'react';
import { Mic, ChevronRight, Home, LayoutGrid, UserCheck } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const Navbar = () => {
  const { currentStep, goToDashboard, goToScenarioSelection, goToProfile } = useSimulator();

  const getStepNumber = (step) => {
    switch (step) {
      case 'DASHBOARD': return 1;
      case 'SCENARIO_SELECTION': return 2;
      case 'PRACTICE_SETUP': return 3;
      case 'PRACTICE_ROOM': return 4;
      case 'RESULTS_SCREEN': return 5;
      case 'PROFILE': return 6;
      default: return 1;
    }
  };

  const activeNum = getStepNumber(currentStep);

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.85rem 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={goToDashboard}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
              color: '#fff'
            }}
          >
            <Mic size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                Vox<span className="gradient-text">Sim</span>
              </h1>
              <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                LMS MODULE
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              Public Speaking Simulator
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
          <span style={{ color: activeNum === 1 ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: activeNum === 1 ? 700 : 500 }}>Dashboard</span>
          <ChevronRight size={12} style={{ color: 'var(--text-subtle)' }} />
          <span style={{ color: activeNum === 2 ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: activeNum === 2 ? 700 : 500 }}>Scenarios</span>
          <ChevronRight size={12} style={{ color: 'var(--text-subtle)' }} />
          <span style={{ color: activeNum === 3 ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: activeNum === 3 ? 700 : 500 }}>Setup</span>
          <ChevronRight size={12} style={{ color: 'var(--text-subtle)' }} />
          <span style={{ color: activeNum === 4 ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: activeNum === 4 ? 700 : 500 }}>Practice</span>
          <ChevronRight size={12} style={{ color: 'var(--text-subtle)' }} />
          <span style={{ color: activeNum === 5 ? 'var(--accent-emerald)' : 'var(--text-subtle)', fontWeight: activeNum === 5 ? 700 : 500 }}>Results</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentStep !== 'DASHBOARD' && (
            <button className="btn btn-secondary" onClick={goToDashboard} style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
              <Home size={14} />
              <span>Dashboard</span>
            </button>
          )}

          {currentStep !== 'SCENARIO_SELECTION' && (
            <button className="btn btn-secondary" onClick={goToScenarioSelection} style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
              <LayoutGrid size={14} />
              <span>Scenarios</span>
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={goToProfile}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            <UserCheck size={14} />
            <span>Progress Profile</span>
          </button>
        </div>

      </div>
    </header>
  );
};
