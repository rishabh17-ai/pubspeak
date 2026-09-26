import React from 'react';
import { Bot, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const TranscriptReview = () => {
  const { transcript, selectedScenario } = useSimulator();

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bot size={20} style={{ color: 'var(--primary)' }} />
        Session Transcript & Annotation Review
      </h3>

      {transcript.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No transcript recordings captured for this session.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {transcript.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id || index}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                  <span style={{ fontWeight: 700, color: isUser ? '#818cf8' : 'var(--text-main)' }}>
                    {isUser ? 'Your Response' : selectedScenario.persona.name}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                  "{msg.text}"
                </p>

                {/* Sample feedback annotation tag for user turns */}
                {isUser && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>
                    <CheckCircle2 size={14} />
                    <span>Good structural flow! Strong opening sentence.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
