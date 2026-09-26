import React from 'react';
import { ArrowLeft, Briefcase, Presentation, Swords, BookOpen, Zap, MessageSquare, Clock, ArrowRight, Users, Sparkles, Flame } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { SCENARIOS } from '../../data/scenarios';
import { Badge } from '../common/Badge';

export const ScenarioSelectionView = () => {
  const { selectScenarioAndSetup, goToAudienceSetup, startPressureSession, goToDashboard } = useSimulator();

  const getIcon = (name) => {
    switch (name) {
      case 'Briefcase': return <Briefcase size={22} />;
      case 'Presentation': return <Presentation size={22} />;
      case 'Swords': return <Swords size={22} />;
      case 'BookOpen': return <BookOpen size={22} />;
      case 'Zap': return <Zap size={22} />;
      default: return <MessageSquare size={22} />;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Back Navigation */}
      <button
        className="btn btn-secondary"
        onClick={goToDashboard}
        style={{ alignSelf: 'flex-start', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      {/* Special Challenge Modes Grid: Pressure Mode & AI Audience Mode */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Pressure Mode Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.18) 0%, rgba(245, 158, 11, 0.15) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'rgba(244, 63, 94, 0.25)', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#fb7185', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              <Flame size={14} />
              <span>HIGH PRESSURE CHALLENGE</span>
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Pressure Mode (5 Levels)
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Progressively shrinking time limits (60s → 45s → 30s → 25s → 20s!). Face unexpected twists, challenges, and rapid-fire questions.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={startPressureSession}
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem', borderRadius: '12px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}
          >
            <Flame size={18} />
            <span>Launch Pressure Challenge</span>
          </button>
        </div>

        {/* AI Audience Mode Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.25)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Users size={14} />
              <span>AUDIENCE PRESENTATION</span>
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              AI Audience Mode
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Deliver a 2-minute presentation on assigned topics to 5 selectable audience personalities (Supportive, Neutral, Curious, Critical, Panel).
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={goToAudienceSetup}
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem', borderRadius: '12px' }}
          >
            <Sparkles size={18} />
            <span>Launch AI Audience Mode</span>
          </button>
        </div>

      </div>

      {/* Header Title */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
          Core Practice Scenarios
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Or select from our 6 core roleplay environments:
        </p>
      </div>

      {/* 6 Scenario Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {SCENARIOS.map((scenario) => (
          <div
            key={scenario.id}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}
                >
                  {getIcon(scenario.iconName)}
                </div>
                <Badge variant={scenario.difficulty}>{scenario.difficulty}</Badge>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{scenario.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {scenario.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} />
                  <span>Est. Duration: <strong style={{ color: 'var(--text-main)' }}>{scenario.estimatedDuration}</strong></span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => selectScenarioAndSetup(scenario)}
                style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
              >
                <span>Start Practice</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
