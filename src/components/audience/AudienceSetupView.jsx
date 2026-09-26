import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Users, Sparkles, RefreshCw, CheckCircle, Smile, Meh, HelpCircle, AlertOctagon } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { AI_AUDIENCE_PERSONALITIES, PRESENTATION_TOPICS } from '../../data/scenarios';
import { Badge } from '../common/Badge';

export const AudienceSetupView = () => {
  const { startAudienceSession, goToScenarioSelection } = useSimulator();

  const [selectedPersonality, setSelectedPersonality] = useState(AI_AUDIENCE_PERSONALITIES[0]);
  const [topicIndex, setTopicIndex] = useState(0);

  const topic = PRESENTATION_TOPICS[topicIndex];

  const handleNextTopic = () => {
    setTopicIndex((prev) => (prev + 1) % PRESENTATION_TOPICS.length);
  };

  const getIcon = (name) => {
    switch (name) {
      case 'Smile': return <Smile size={22} />;
      case 'Meh': return <Meh size={22} />;
      case 'HelpCircle': return <HelpCircle size={22} />;
      case 'AlertOctagon': return <AlertOctagon size={22} />;
      default: return <Users size={22} />;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      
      {/* Back Button */}
      <button
        className="btn btn-secondary"
        onClick={goToScenarioSelection}
        style={{ marginBottom: '1.5rem', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Scenarios</span>
      </button>

      {/* Main Setup Card */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Users size={14} />
              <span>AI AUDIENCE PRESENTATION MODE</span>
            </div>
            <h1 style={{ fontSize: '2rem', margin: 0, letterSpacing: '-0.02em' }}>
              Present to an AI Audience
            </h1>
          </div>
          <Badge variant="primary">2-MINUTE TIMER</Badge>
        </div>

        {/* 1. Presentation Topic Card */}
        <div style={{ marginBottom: '2.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ color: 'var(--text-subtle)', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em', margin: 0 }}>
              Assigned Presentation Topic
            </h3>
            <button
              className="btn btn-secondary"
              onClick={handleNextTopic}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            >
              <RefreshCw size={13} />
              <span>Change Topic</span>
            </button>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '14px',
              padding: '1.5rem',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem'
            }}
          >
            <Sparkles size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>"{topic}"</span>
          </div>
        </div>

        {/* 2. Select Audience Personality (5 Options) */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ color: 'var(--text-subtle)', marginBottom: '0.85rem', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
            Select AI Audience Personality (5 Types)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {AI_AUDIENCE_PERSONALITIES.map((pers) => {
              const isSelected = selectedPersonality.id === pers.id;
              return (
                <div
                  key={pers.id}
                  onClick={() => setSelectedPersonality(pers)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isSelected ? 'var(--primary-light)' : 'rgba(255,255,255,0.05)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getIcon(pers.iconName)}
                      </div>
                      {isSelected && <CheckCircle size={18} style={{ color: 'var(--primary)' }} />}
                    </div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>{pers.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                      {pers.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Audience Presentation Trigger */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
            Speaking Timer: <strong>2 Minutes (120s)</strong> &bull; Reactions output inline.
          </div>

          <button
            className="btn btn-primary"
            onClick={() => startAudienceSession(selectedPersonality, topic)}
            style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            <Play size={20} />
            <span>Begin 2-Minute Presentation</span>
          </button>
        </div>

      </div>

    </div>
  );
};
