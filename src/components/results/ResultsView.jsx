import React from 'react';
import { RotateCcw, LayoutGrid, Home, Award, CheckCircle2, AlertCircle, Bot, BookOpen, Sparkles, Loader2, TrendingUp, Zap, Flame } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { GaugeScore } from '../common/GaugeScore';

export const ResultsView = () => {
  const {
    selectedScenario,
    selectedDifficulty,
    isPressureMode,
    isAudienceMode,
    selectedAudiencePersonality,
    presentationTopic,
    handleTryAgain,
    goToScenarioSelection,
    goToDashboard,
    sessionTime,
    isEvaluating,
    evaluationResult,
    noSpeechDetected,
    attemptCount,
    sessionAttempts
  } = useSimulator();

  // Format session time
  const mins = Math.floor(sessionTime / 60);
  const secs = sessionTime % 60;
  const formattedDuration = `${mins}m ${secs}s`;

  // No speech detected — user never spoke
  if (!isEvaluating && !evaluationResult && noSpeechDetected) {
    return (
      <div className="container" style={{ maxWidth: '600px', padding: '4rem 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', border: '2px solid rgba(244, 63, 94, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={36} style={{ color: '#fb7185' }} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: '#fb7185' }}>No Speech Detected</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              The session ended without any recorded speech or typed response.
              <br /><br />
              <strong style={{ color: 'var(--text-main)' }}>To get a real evaluation:</strong>
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem 1.5rem', textAlign: 'left', width: '100%' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#818cf8' }}>1.</span> Click <strong style={{ color: 'var(--text-main)' }}>"Start Speaking"</strong> and speak into your microphone</li>
              <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#818cf8' }}>2.</span> OR type your response in the text box and click <strong style={{ color: 'var(--text-main)' }}>"Submit Response"</strong></li>
              <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#818cf8' }}>3.</span> Your browser must allow microphone access for speech recognition</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleTryAgain} style={{ padding: '0.75rem 2rem' }}>
              <RotateCcw size={16} />
              <span>Try Again</span>
            </button>
            <button className="btn btn-secondary" onClick={goToScenarioSelection} style={{ padding: '0.75rem 1.5rem' }}>
              <LayoutGrid size={16} />
              <span>New Scenario</span>
            </button>
            <button className="btn btn-secondary" onClick={goToDashboard} style={{ padding: '0.75rem 1.5rem' }}>
              <Home size={16} />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading / Evaluating state
  if (isEvaluating || !evaluationResult) {
    return (
      <div className="container" style={{ maxWidth: '600px', padding: '4rem 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={48} style={{ color: 'var(--primary)', marginBottom: '1.25rem' }} className="animate-spin" />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Evaluating {isPressureMode ? 'Pressure Challenge' : `Attempt #${attemptCount}`}...</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Evaluating structure, relevance, conciseness, handling unexpected questions, and speaking consistency.
          </p>
        </div>
      </div>
    );
  }

  const evalData = evaluationResult;
  const previousAttempt = sessionAttempts.length > 0 ? sessionAttempts[sessionAttempts.length - 1] : null;
  const scoreDiff = previousAttempt ? evalData.overallScore - previousAttempt.score : 0;

  // Resolve metrics list based on mode
  let metricsList = [];

  if (isPressureMode) {
    metricsList = [
      { name: 'Response Structure', score: evalData.structure, desc: 'Logical organization under time constraints' },
      { name: 'Relevance', score: evalData.relevance, desc: 'Direct alignment without dodging questions' },
      { name: 'Conciseness', score: evalData.conciseness, desc: 'Efficient, direct wording without rambling' },
      { name: 'Handling Unexpected', score: evalData.handlingUnexpected || evalData.fillerWords || 82, desc: 'Poise and composure when faced with twists' },
      { name: 'Speaking Consistency', score: evalData.speakingConsistency || evalData.pace || 85, desc: 'Maintaining quality as timer shrank to 20s' }
    ];
  } else if (isAudienceMode) {
    metricsList = [
      { name: 'Clarity', score: evalData.clarity, desc: 'Understandability and directness' },
      { name: 'Structure', score: evalData.structure, desc: 'Logical presentation flow' },
      { name: 'Engagement', score: evalData.engagement, desc: 'Holding audience attention' },
      { name: 'Relevance', score: evalData.relevance, desc: 'Alignment with presentation topic' },
      { name: 'Conciseness', score: evalData.conciseness, desc: 'Efficient, focused presentation' },
      { name: 'Handling Questions', score: evalData.handlingQuestions, desc: 'Poise during audience Q&A' }
    ];
  } else {
    metricsList = [
      { name: 'Clarity', score: evalData.clarity },
      { name: 'Structure', score: evalData.structure },
      { name: 'Relevance', score: evalData.relevance },
      { name: 'Vocabulary', score: evalData.vocabulary },
      { name: 'Pace', score: evalData.pace },
      { name: 'Filler Words', score: evalData.fillerWords },
      { name: 'Confidence', score: evalData.confidence }
    ];
  }

  return (
    <div className="container" style={{ maxWidth: '980px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: isPressureMode
            ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.18) 0%, rgba(245, 158, 11, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.1) 100%)'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: isPressureMode ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.2)', border: isPressureMode ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)', color: isPressureMode ? '#fb7185' : '#34d399', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            {isPressureMode ? <Flame size={14} /> : <Award size={14} />}
            <span>{isPressureMode ? 'PRESSURE MODE REPORT' : `EVALUATION REPORT • ATTEMPT #${attemptCount}`}</span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            {isPressureMode ? 'Pressure Performance Score' : 'Session Performance Results'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            {isPressureMode ? 'Progressive Levels 1 → 5 Completed' : isAudienceMode ? `Topic: "${presentationTopic}" (${selectedAudiencePersonality?.name || 'AI Audience'})` : `Scenario: ${selectedScenario?.name || ''}`} &bull; Duration: <strong style={{ color: 'var(--text-main)' }}>{formattedDuration}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleTryAgain} style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
          <button className="btn btn-secondary" onClick={goToScenarioSelection} style={{ padding: '0.65rem 1.1rem', fontSize: '0.9rem' }}>
            <LayoutGrid size={16} />
            <span>New Scenario</span>
          </button>
          <button className="btn btn-secondary" onClick={goToDashboard} style={{ padding: '0.65rem 1.1rem', fontSize: '0.9rem' }}>
            <Home size={16} />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Attempt Improvement Comparison Banner (After Attempt #2) */}
      {previousAttempt && !isPressureMode && (
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem 2rem',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem', color: '#34d399' }}>
                Attempt Improvement Comparison
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Improvement measured between your current practice attempts in this session.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>Previous Score</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-muted)' }}>{previousAttempt.score}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>New Score</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{evalData.overallScore}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>Improvement</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: scoreDiff >= 0 ? '#34d399' : '#fb7185' }}>
                {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Score Section: YOUR SCORE / Pressure Performance Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        
        {/* Score Card */}
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
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            {isPressureMode ? 'PRESSURE PERFORMANCE SCORE' : 'YOUR SCORE'}
          </span>

          <GaugeScore score={evalData.overallScore} size={160} strokeWidth={14} />

          <div style={{ marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isPressureMode ? '#fb7185' : 'var(--accent-emerald)', background: isPressureMode ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: isPressureMode ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)' }}>
              {isPressureMode ? 'Pressure Challenge Score' : evalData.overallScore >= 85 ? 'Exemplary Performance' : 'Strong Performance'}
            </span>
          </div>
        </div>

        {/* Metrics Breakdown Grid */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            {isPressureMode ? 'Pressure Metrics Breakdown' : 'Communication Breakdown (0 - 100)'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            {(metricsList || []).map((m) => (
              <div
                key={m.name}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '0.75rem 0.9rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{m.name}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>{m.score}/100</span>
                </div>
                <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', marginBottom: '0.3rem', overflow: 'hidden' }}>
                  <div style={{ width: `${m.score}%`, height: '100%', background: isPressureMode ? 'linear-gradient(135deg, #f43f5e, #f59e0b)' : 'var(--gradient-brand)', borderRadius: '3px' }} />
                </div>
                {m.desc && <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{m.desc}</span>}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Strengths & Improvements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* WHAT YOU DID WELL */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={18} />
            WHAT YOU DID WELL
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {evalData.strengths && evalData.strengths.map((str, i) => (
              <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-emerald)' }}>✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WHAT TO IMPROVE */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)' }}>
            <AlertCircle size={18} />
            WHAT TO IMPROVE
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {evalData.improvements && evalData.improvements.map((imp, i) => (
              <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-amber)' }}>→</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* AI'S NEXT CHALLENGE */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)' }}>
          <Zap size={18} />
          AI'S NEXT CHALLENGE FEEDBACK
        </h3>
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderLeft: '4px solid var(--accent-purple)',
            padding: '1.25rem',
            borderRadius: '12px',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-main)'
          }}
        >
          {evalData.summary}
        </div>
      </div>

      {/* Suggested Practice */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} style={{ color: 'var(--accent-cyan)' }} />
          Suggested Next Practice
        </h3>
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--primary)' }} />
          <span>{evalData.nextPractice}</span>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn btn-primary" onClick={handleTryAgain} style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
          <RotateCcw size={18} />
          <span>Try Again</span>
        </button>

        <button className="btn btn-secondary" onClick={goToScenarioSelection} style={{ padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
          <LayoutGrid size={18} />
          <span>New Scenario</span>
        </button>

        <button className="btn btn-secondary" onClick={goToDashboard} style={{ padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
          <Home size={18} />
          <span>Dashboard</span>
        </button>
      </div>

    </div>
  );
};
