import React, { useState } from 'react';
import { Search, Filter, Sparkles, MessageCircle } from 'lucide-react';
import { SCENARIOS, CATEGORIES, DIFFICULTY_LEVELS } from '../../data/scenarios';
import { ScenarioCard } from './ScenarioCard';

export const ScenarioGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Filter logic
  const filteredScenarios = SCENARIOS.filter((scenario) => {
    const matchesSearch =
      scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.persona.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || scenario.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || scenario.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="container animate-fade-in">
      {/* Hero Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(6, 182, 212, 0.1) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '700px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>Interactive LMS Simulation Lab</span>
          </div>

          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Master Public Speaking & Verbal Fluency
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Practice real-life conversations in a realistic, non-judgmental environment.
            Choose a scenario below to start practicing with our AI simulator persona.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search scenarios by role, domain, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          {/* Difficulty Dropdown Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Difficulty:</span>
            <select
              className="input-field"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ padding: '0.6rem 1rem', width: 'auto' }}
            >
              {DIFFICULTY_LEVELS.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginRight: '0.5rem', fontWeight: 600 }}>Category:</span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--primary-light)' : 'var(--bg-secondary)',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Scenario Cards */}
      {filteredScenarios.length > 0 ? (
        <div className="grid-scenarios">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <MessageCircle size={48} style={{ color: 'var(--text-subtle)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No scenarios match your search</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try resetting your category or search terms.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
