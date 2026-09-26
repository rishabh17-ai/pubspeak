import React from 'react';
import { ArrowLeft, Play, Clock, Bot, Shield, CheckCircle, Zap, Sparkles } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { DIFFICULTY_CONFIGS, SESSION_ROUNDS } from '../../data/scenarios';
import { Badge } from '../common/Badge';

export const PracticeSetupView = () => {
  const { selectedScenario, selectedDifficulty, setSelectedDifficulty, startPracticeSession, goToScenarioSelection } = useSimulator();

  const currentDiff = DIFFICULTY_CONFIGS[selectedDifficulty] || DIFFICULTY_CONFIGS.MEDIUM;

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      
      {/* Back Navigation */}
      <button
        className="btn btn-secondary"
        onClick={goToScenarioSelection}
        style={{ marginBottom: '1.5rem', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} />
        <span>Change Scenario</span>
      </button>

      {/* Main Practice Setup Card */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Practice Challenge Setup
            </span>
            <h1 style={{ fontSize: '2rem', marginTop: '0.2rem', marginBottom: 0 }}>
              {selectedScenario.name}
            </h1>
          </div>
          <Badge variant={selectedDifficulty}>{selectedDifficulty} CHALLENGE</Badge>
        </div>

        {/* 1. Scenario Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-subtle)', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
            Scenario Context
          </h3>
          <p style={{ fontSize: '1.02rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0, background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            {selectedScenario.description}
          </p>
        </div>

        {/* 2. Select Difficulty Level (EASY / MEDIUM / HARD) */}
        <div style={{ marginBottom: '2.25rem' }}>
          <h3 style={{ color: 'var(--text-subtle)', marginBottom: '0.75rem', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
            Select Difficulty Challenge Level
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {Object.keys(DIFFICULTY_CONFIGS).map((levelKey) => {
              const cfg = DIFFICULTY_CONFIGS[levelKey];
              const isSelected = selectedDifficulty === levelKey;
              return (
                <div
                  key={levelKey}
                  onClick={() => setSelectedDifficulty(levelKey)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                      {cfg.level}
                    </span>
                    {isSelected && <CheckCircle size={18} style={{ color: 'var(--primary)' }} />}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {cfg.description}
                  </p>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                    Speaking Timer: <strong>{cfg.roundSpeakingTimeSeconds}s / round</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Session 5-Round Structure Overview */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ color: 'var(--text-subtle)', marginBottom: '0.75rem', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
            Session Structure (5 Challenge Rounds)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {SESSION_ROUNDS.map((r) => (
              <div
                key={r.round}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {r.round}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.title}</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', background: 'var(--bg-secondary)', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                  {r.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Challenge Button */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
            Timer starts automatically when Round 1 begins.
          </div>

          <button
            className="btn btn-primary"
            onClick={startPracticeSession}
            style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            <Play size={20} />
            <span>Launch {selectedDifficulty} Challenge</span>
          </button>
        </div>

      </div>

    </div>
  );
};
