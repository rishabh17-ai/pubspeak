import React from 'react';
import * as Icons from 'lucide-react';
import { Badge } from '../common/Badge';
import { useSimulator } from '../../context/SimulatorContext';

export const ScenarioCard = ({ scenario }) => {
  const { chooseScenario } = useSimulator();

  // Dynamic Icon Resolver
  const IconComponent = Icons[scenario.iconName] || Icons.MessageCircle;

  return (
    <div
      className="glass-panel glass-panel-hover"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => chooseScenario(scenario)}
    >
      {/* Top Accent Gradient Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: scenario.persona.avatarBg
        }}
      />

      <div>
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}
          >
            <IconComponent size={24} />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Badge variant={scenario.category}>{scenario.category}</Badge>
            <Badge variant={scenario.difficulty}>{scenario.difficulty}</Badge>
          </div>
        </div>

        {/* Title & Summary */}
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          {scenario.title}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          {scenario.summary}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Icons.User size={14} />
            <span>AI Role: <strong style={{ color: 'var(--text-main)' }}>{scenario.persona.role}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Icons.Clock size={13} />
            <span>{scenario.duration}</span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'space-between', padding: '0.65rem 1.25rem' }}
        >
          <span>Select Scenario</span>
          <Icons.ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
