import React from 'react';
import { RotateCcw, LayoutGrid, Award, CheckCircle2, TrendingUp, Zap, Sparkles, Volume2 } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { GaugeScore } from '../common/GaugeScore';
import { MetricCard } from './MetricCard';
import { TranscriptReview } from './TranscriptReview';

export const FeedbackReport = () => {
  const { selectedScenario, resetToBriefing, resetToSelection, sessionTime, transcript } = useSimulator();

  // Calculate format session duration
  const mins = Math.floor(sessionTime / 60);
  const secs = sessionTime % 60;
  const timeFormatted = `${mins}m ${secs}s`;

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1000px' }}>
      
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Award size={14} />
            <span>SESSION COMPLETED</span>
          </div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Speech Analysis & Feedback Report
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Scenario: <strong style={{ color: 'var(--text-main)' }}>{selectedScenario.title}</strong> &bull; Practice Duration: <strong style={{ color: 'var(--text-main)' }}>{timeFormatted}</strong>
          </p>
        </div>

        {/* Top Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={resetToBriefing}>
            <RotateCcw size={16} />
            <span>Retry Scenario</span>
          </button>
          <button className="btn btn-primary" onClick={resetToSelection}>
            <LayoutGrid size={16} />
            <span>Choose New Scenario</span>
          </button>
        </div>
      </div>

      {/* Main Score & Metrics Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Left: Score Circle & Overall Rating */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <GaugeScore score={88} size={170} strokeWidth={14} />

          <div style={{ marginTop: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              Strong Performance
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.85rem', lineHeight: 1.5 }}>
              You articulated your points clearly with good poise and minimal pauses.
            </p>
          </div>
        </div>

        {/* Right: Detailed Sub-metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          
          <MetricCard
            title="Fluency & Pacing"
            score={85}
            description="Optimal speaking speed (approx 145 wpm). Smooth transitions between thoughts."
            icon={Zap}
            color="#06b6d4"
          />

          <MetricCard
            title="Logical Structure"
            score={90}
            description="Clear opening, well-reasoned arguments, and a definitive concluding summary."
            icon={TrendingUp}
            color="#6366f1"
          />

          <MetricCard
            title="Tone & Pitch"
            score={88}
            description="Professional, assertive, and engaging vocal variation without sounding monotonous."
            icon={Volume2}
            color="#8b5cf6"
          />

          <MetricCard
            title="Filler Words"
            score={82}
            description="Low count of filler words (um, uh, like). Excellent pause control."
            icon={Sparkles}
            color="#10b981"
          />

        </div>

      </div>

      {/* Strengths & Areas for Improvement */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Key Strengths */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={18} />
            Key Speaking Strengths
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
            <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span>
              <span>Quick structured response using clear problem statement framework.</span>
            </li>
            <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span>
              <span>Confident, professional tone tailored to the persona's role.</span>
            </li>
            <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>✓</span>
              <span>Excellent listening comprehension when answering the follow-up prompt.</span>
            </li>
          </ul>
        </div>

        {/* Growth Recommendations */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)' }}>
            <TrendingUp size={18} />
            Actionable Growth Recommendations
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
            <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-amber)' }}>→</span>
              <span>Consider adding specific quantitative metrics (e.g. percentages or time saved) to boost impact.</span>
            </li>
            <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-amber)' }}>→</span>
              <span>Pause intentionally for 1-2 seconds after key points for dramatic emphasis.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Detailed Transcript Breakdown */}
      <TranscriptReview />

      {/* Bottom Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0' }}>
        <button className="btn btn-secondary" onClick={resetToBriefing} style={{ padding: '0.75rem 1.75rem' }}>
          <RotateCcw size={18} />
          <span>Retry This Scenario</span>
        </button>

        <button className="btn btn-primary" onClick={resetToSelection} style={{ padding: '0.75rem 2rem' }}>
          <LayoutGrid size={18} />
          <span>Practice Another Scenario</span>
        </button>
      </div>

    </div>
  );
};
