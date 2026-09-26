import React from 'react';
import { Award, Flame, CheckCircle, TrendingUp, Layers, Calendar, BarChart2, ArrowRight, RefreshCw, UserCheck } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { GaugeScore } from '../common/GaugeScore';
import { Badge } from '../common/Badge';

export const ProgressProfileView = () => {
  const { profileMetrics, goToScenarioSelection, goToDashboard } = useSimulator();

  const skillsList = [
    { name: 'Clarity', score: profileMetrics.skills.clarity, desc: 'Understandability and directness' },
    { name: 'Structure', score: profileMetrics.skills.structure, desc: 'Logical flow and intro/outro organization' },
    { name: 'Relevance', score: profileMetrics.skills.relevance, desc: 'Alignment with scenario prompts' },
    { name: 'Vocabulary', score: profileMetrics.skills.vocabulary, desc: 'Precision and variety of terminology' },
    { name: 'Pace', score: profileMetrics.skills.pace, desc: 'Speaking speed and natural cadence' },
    { name: 'Filler Words', score: profileMetrics.skills.fillerWords, desc: 'Control of filler words (um, uh, basically)' },
    { name: 'Confidence', score: profileMetrics.skills.confidence, desc: 'Certainty and vocal assertiveness' }
  ];

  return (
    <div className="container" style={{ maxWidth: '1050px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <UserCheck size={14} />
            <span>LEARNER PROFILE & ANALYTICS</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Public Speaking Progress Profile
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Comprehensive record of your verbal fluency performance across practice attempts and scenarios.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={goToScenarioSelection}
          style={{ padding: '0.8rem 1.75rem', borderRadius: '12px' }}
        >
          <span>Practice Next Challenge</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 2. Top Overview Grid: Overall Score + 4 Key Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        
        {/* Overall Speaking Score Gauge */}
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
            Overall Speaking Score
          </span>

          <GaugeScore score={profileMetrics.overallScore} size={160} strokeWidth={14} />

          <div style={{ marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              Top 15% LMS Learner
            </span>
          </div>
        </div>

        {/* 4 Stats Grid Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          {/* Sessions Completed */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sessions Completed</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>
              {profileMetrics.sessionsCompleted}
            </div>
          </div>

          {/* Current Streak */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Current Streak</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>
              {profileMetrics.currentStreak} Days
            </div>
          </div>

          {/* Most Practiced Scenario */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Most Practiced Scenario</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>
              {profileMetrics.mostPracticedScenario}
            </div>
          </div>

          {/* Improvement Over Attempts */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Improvement Over Attempts</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>
              {profileMetrics.avgImprovementOverAttempts}
            </div>
          </div>

        </div>

      </div>

      {/* 3. Skill Breakdown Grid */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={18} style={{ color: 'var(--primary)' }} />
          Aggregate Skill Breakdown (7 Metrics)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {skillsList.map((skill) => (
            <div
              key={skill.name}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{skill.name}</span>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>{skill.score}/100</span>
              </div>
              <div style={{ width: '100%', height: '7px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', marginBottom: '0.4rem', overflow: 'hidden' }}>
                <div style={{ width: `${skill.score}%`, height: '100%', background: 'var(--gradient-brand)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{skill.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tracked Session History Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} style={{ color: 'var(--accent-cyan)' }} />
          Session History & Tracked Results
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Scenario</th>
                <th style={{ padding: '0.75rem 1rem' }}>Difficulty</th>
                <th style={{ padding: '0.75rem 1rem' }}>Overall Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Key Metrics (Clarity / Fillers / Conf)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {profileMetrics.recentSessions.map((sess) => (
                <tr key={sess.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{sess.dateFormatted}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{sess.scenarioName}</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge variant={sess.difficulty}>{sess.difficulty}</Badge>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: sess.overallScore >= 85 ? '#10b981' : '#6366f1' }}>
                      {sess.overallScore}/100
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Clarity: <strong>{sess.clarity}</strong> &bull; Fillers: <strong>{sess.fillerWords}</strong> &bull; Conf: <strong>{sess.confidence}</strong>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: sess.attemptsCount > 1 ? '#34d399' : 'var(--text-subtle)' }}>
                      {sess.attemptsCount} Attempt{sess.attemptsCount > 1 ? 's' : ''} {sess.improvementDelta > 0 && `(+${sess.improvementDelta})`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
