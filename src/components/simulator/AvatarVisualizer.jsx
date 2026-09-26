import React from 'react';
import { Volume2, Mic, Bot, Sparkles } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const AvatarVisualizer = () => {
  const { selectedScenario, isAiSpeaking } = useSimulator();
  const { persona } = selectedScenario;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(18, 26, 44, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
      }}
    >
      {/* Persona Avatar Ring with Dynamic Wave Animation */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        
        {/* Animated Glow Rings when AI is Speaking */}
        {isAiSpeaking && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '-12px',
                right: '-12px',
                bottom: '-12px',
                borderRadius: '50%',
                border: '2px solid rgba(99, 102, 241, 0.5)',
                animation: 'pulseGlow 1.5s infinite ease-in-out'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                left: '-24px',
                right: '-24px',
                bottom: '-24px',
                borderRadius: '50%',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                animation: 'pulseGlow 2.5s infinite ease-in-out'
              }}
            />
          </>
        )}

        {/* Avatar Circle */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: persona.avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#fff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            border: isAiSpeaking ? '3px solid #6366f1' : '3px solid var(--border-color)',
            transition: 'all 0.3s ease'
          }}
        >
          {persona.avatarInitials}
        </div>
      </div>

      {/* Persona Info */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{persona.name}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{persona.title}</p>
      
      {/* Role Pill */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.25rem' }}>
        <Bot size={13} />
        <span>Simulated Role: {persona.role}</span>
      </div>

      {/* Audio Reactive Waveform Bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '36px', padding: '0 1rem', width: '100%', justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
          <div
            key={bar}
            style={{
              width: '4px',
              borderRadius: '4px',
              background: isAiSpeaking ? 'var(--gradient-brand)' : 'var(--border-color)',
              height: isAiSpeaking ? `${Math.floor(Math.random() * 26) + 8}px` : '6px',
              transition: 'height 0.2s ease',
              animation: isAiSpeaking ? `waveformBar 0.8s infinite ease-in-out ${bar * 0.1}s` : 'none'
            }}
          />
        ))}
      </div>

      {/* Status Indicator Pill */}
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: isAiSpeaking ? '#818cf8' : 'var(--text-subtle)' }}>
        {isAiSpeaking ? (
          <>
            <Volume2 size={15} className="animate-pulse" />
            <span>AI Speaking...</span>
          </>
        ) : (
          <>
            <Mic size={15} />
            <span>Listening to you...</span>
          </>
        )}
      </div>

    </div>
  );
};
