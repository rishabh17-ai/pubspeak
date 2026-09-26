import React, { useState } from 'react';
import { ArrowLeft, Play, Volume2, CheckCircle2, Target, User, ShieldAlert, Award } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { Badge } from '../common/Badge';

export const ScenarioBriefing = () => {
  const { selectedScenario, startSimulation, resetToSelection } = useSimulator();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Audio Playback of Situation Setup (Web Speech API synthesis fallback)
  const handleListenSituation = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(selectedScenario.situation);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in this browser.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '960px' }}>
      
      {/* Top Back Navigation */}
      <button
        className="btn btn-secondary"
        onClick={resetToSelection}
        style={{ marginBottom: '1.5rem', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to All Scenarios</span>
      </button>

      {/* Main Briefing Panel */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        
        {/* Scenario Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Badge variant={selectedScenario.category}>{selectedScenario.category}</Badge>
              <Badge variant={selectedScenario.difficulty}>{selectedScenario.difficulty}</Badge>
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              {selectedScenario.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Estimated Duration: <strong>{selectedScenario.duration}</strong>
            </p>
          </div>

          {/* Persona Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              background: 'var(--bg-secondary)',
              padding: '0.85rem 1.25rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: selectedScenario.persona.avatarBg,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {selectedScenario.persona.avatarInitials}
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{selectedScenario.persona.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedScenario.persona.title}</div>
              <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600 }}>Role: {selectedScenario.persona.role}</span>
            </div>
          </div>
        </div>

        {/* Situation & Audio Audio Hook */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} style={{ color: 'var(--primary)' }} />
              Situation Overview
            </h3>

            <button
              className="btn btn-outline"
              onClick={handleListenSituation}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              <Volume2 size={16} />
              <span>{isPlayingAudio ? 'Stop Situation Audio' : 'Hear Situation Prompt'}</span>
            </button>
          </div>

          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid var(--primary)',
              borderRadius: '12px',
              padding: '1.25rem',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--text-main)'
            }}
          >
            {selectedScenario.situation}
          </div>
        </div>

        {/* Objectives & Criteria Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Key Objectives */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)' }}>
              <CheckCircle2 size={18} />
              Key Session Objectives
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedScenario.objectives.map((obj, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent-emerald)', marginTop: '0.1rem' }}>✓</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Evaluated Target Metrics */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
              <Target size={18} />
              Target Feedback Metrics
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedScenario.targetMetrics.map((metric, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    color: '#22d3ee',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Start Simulation Trigger */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
            Make sure your microphone is enabled when you proceed.
          </div>

          <button
            className="btn btn-primary"
            onClick={startSimulation}
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            <Play size={20} />
            <span>Begin Simulation Session</span>
          </button>
        </div>

      </div>
    </div>
  );
};
