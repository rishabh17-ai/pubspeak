import React, { useRef, useEffect } from 'react';
import { Volume2, User, Bot, Sparkles } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const TranscriptStream = () => {
  const { transcript, selectedScenario, isAiSpeaking } = useSimulator();
  const bottomRef = useRef(null);

  // Auto scroll to latest speech message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isAiSpeaking]);

  // Read message out loud using browser Speech Synthesis
  const playAudioUtterance = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '420px',
        maxHeight: '580px',
        overflow: 'hidden'
      }}
    >
      {/* Stream Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
          <Sparkles size={16} style={{ color: 'var(--primary)' }} />
          <span>Real-time Dialogue Stream</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          Scenario: {selectedScenario.title}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {transcript.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className="animate-fade-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                alignSelf: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              {/* Sender Name & Timestamp */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.3rem' }}>
                {!isUser && <Bot size={13} style={{ color: 'var(--primary)' }} />}
                <span>{isUser ? 'You (User)' : selectedScenario.persona.name}</span>
                <span>&bull;</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Bubble Box */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isUser ? 'var(--gradient-brand)' : 'var(--bg-secondary)',
                  color: isUser ? '#ffffff' : 'var(--text-main)',
                  border: isUser ? 'none' : '1px solid var(--border-color)',
                  boxShadow: isUser ? '0 4px 14px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  position: 'relative',
                  group: 'true'
                }}
              >
                {msg.text}

                {/* Read aloud button for AI messages */}
                {!isUser && (
                  <button
                    onClick={() => playAudioUtterance(msg.text)}
                    title="Play Audio"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Volume2 size={13} />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* AI Thinking Visualizer Bubble */}
        {isAiSpeaking && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', alignSelf: 'flex-start', background: 'var(--bg-secondary)', padding: '0.75rem 1.25rem', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
            <Bot size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedScenario.persona.name} is responding...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
