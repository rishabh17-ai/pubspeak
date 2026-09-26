import React from 'react';
import { Play, TrendingUp, Flame, Award, Clock, ArrowRight, CheckCircle, Sparkles, Briefcase, Presentation, Swords, BookOpen, Zap, MessageSquare } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { SCENARIOS } from '../../data/scenarios';
import { Badge } from '../common/Badge';

export const DashboardView = () => {
  const { userStats, goToScenarioSelection, selectScenarioAndSetup } = useSimulator();

  // Dynamic Icon Resolver
  const getIcon = (name) => {
    switch (name) {
      case 'Briefcase': return <Briefcase size={20} />;
      case 'Presentation': return <Presentation size={20} />;
      case 'Swords': return <Swords size={20} />;
      case 'BookOpen': return <BookOpen size={20} />;
      case 'Zap': return <Zap size={20} />;
      default: return <MessageSquare size={20} />;
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Header Banner: Title, Short Explanation & CTA */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(6, 182, 212, 0.1) 100%)'
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>LMS Interactive Simulator</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>
            Public Speaking Simulator
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Practice real-world speaking scenarios in a risk-free AI environment. Build interview readiness, workplace communication, and spontaneous verbal fluency.
          </p>
        </div>

        {/* Start Practice CTA */}
        <button
          className="btn btn-primary"
          onClick={goToScenarioSelection}
          style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', borderRadius: '14px', flexShrink: 0 }}
        >
          <Play size={20} />
          <span>Start Practice Session</span>
        </button>
      </div>

      {/* 2. Key Metrics Row: Overall Score, Improvement %, Current Streak */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* Overall Speaking Score */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Speaking Score</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
              {userStats?.overallScore || 84}<span style={{ fontSize: '1rem', color: 'var(--text-subtle)' }}>/100</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Top 15% in LMS Class</span>
          </div>
        </div>

        {/* Improvement Percentage */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Improvement Rate</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
              +{userStats?.improvementPct || 14}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>vs last 30 days</span>
          </div>
        </div>

        {/* Current Streak */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Current Practice Streak</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
              {userStats?.streakDays || 5} Days
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Keep it going!</span>
          </div>
        </div>

      </div>

      {/* 3. Available Scenarios Preview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Available Practice Scenarios</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Select a realistic scenario to start practicing</p>
          </div>
          <button className="btn btn-secondary" onClick={goToScenarioSelection} style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
            <span>View All (6)</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {SCENARIOS.slice(0, 3).map((scenario) => (
            <div
              key={scenario.id}
              className="glass-panel glass-panel-hover"
              style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => selectScenarioAndSetup(scenario)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    {getIcon(scenario.iconName)}
                  </div>
                  <Badge variant={scenario.difficulty}>{scenario.difficulty}</Badge>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{scenario.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1rem' }}>
                  {scenario.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                <span>Duration: <strong>{scenario.estimatedDuration}</strong></span>
                <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  Setup <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recent Sessions List */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} style={{ color: 'var(--primary)' }} />
          Recent Practice Sessions
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Scenario</th>
                <th style={{ padding: '0.75rem 1rem' }}>Date & Time</th>
                <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
                <th style={{ padding: '0.75rem 1rem' }}>Speaking Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(userStats?.recentSessions || []).map((sess) => (
                <tr key={sess.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{sess.scenarioName}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{sess.date}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{sess.duration}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: 800, color: sess.score >= 85 ? '#10b981' : '#6366f1' }}>
                      {sess.score}/100
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                      <CheckCircle size={12} />
                      {sess.status}
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
