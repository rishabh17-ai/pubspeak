import React from 'react';

export const MetricCard = ({ title, score, description, icon: Icon, color = '#6366f1' }) => {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {Icon && (
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
              <Icon size={18} />
            </div>
          )}
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</span>
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>
          {score}/100
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            background: color,
            borderRadius: '4px',
            transition: 'width 0.8s ease-in-out'
          }}
        />
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
        {description}
      </p>
    </div>
  );
};
