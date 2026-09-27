import React, { useState } from 'react';
import { Mic, ChevronRight, Home, LayoutGrid, UserCheck, LogOut, Volume2, VolumeX, LogIn } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../common/AuthModal';
import { setTTSEnabled, getTTSEnabled } from '../../services/ttsService';

export const Navbar = () => {
  const { currentStep, goToDashboard, goToScenarioSelection, goToProfile } = useSimulator();
  const { user, logOut, isGuest } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [ttsOn, setTtsOn] = useState(getTTSEnabled());

  const getStepNumber = (step) => {
    switch (step) {
      case 'DASHBOARD': return 1;
      case 'SCENARIO_SELECTION': return 2;
      case 'PRACTICE_SETUP': return 3;
      case 'PRACTICE_ROOM': return 4;
      case 'RESULTS_SCREEN': return 5;
      case 'PROFILE': return 6;
      default: return 1;
    }
  };

  const activeNum = getStepNumber(currentStep);

  const toggleTTS = () => {
    const next = !ttsOn;
    setTtsOn(next);
    setTTSEnabled(next);
  };

  const handleLogout = async () => {
    await logOut();
  };

  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'G';

  return (
    <>
      <header
        style={{
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0.85rem 0'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={goToDashboard}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                color: '#fff'
              }}
            >
              <Mic size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                  Vox<span className="gradient-text">Sim</span>
                </h1>
                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  LMS MODULE
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                Public Speaking Simulator
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
            <span style={{ color: activeNum === 1 ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: activeNum === 1 ? 700 : 500 }}>Dashboard</span>
            <ChevronRight size={12} style={{ color: 'var(--text-subtle)' }} />
            <span style={{ color: activeNum === 2 ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: activeNum === 2 ? 700 : 500 }}>Scenarios</span>
            <ChevronRight size={12} style={{ color: 'var(--text-subtle)' }} />
            <span style={{ color: activeNum === 3 ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: activeNum === 3 ? 700 : 500 }}>Setup</span>
            <ChevronRight size={12} style={{ color: 'var(--text-subtle)' }} />
            <span style={{ color: activeNum === 4 ? 'var(--primary)' : 'var(--text-subtle)', fontWeight: activeNum === 4 ? 700 : 500 }}>Practice</span>
            <ChevronRight size={12} style={{ color: 'var(--text-subtle)' }} />
            <span style={{ color: activeNum === 5 ? 'var(--accent-emerald)' : 'var(--text-subtle)', fontWeight: activeNum === 5 ? 700 : 500 }}>Results</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* TTS Toggle */}
            <button
              id="navbar-tts-toggle"
              className="btn btn-secondary"
              onClick={toggleTTS}
              title={ttsOn ? 'AI Voice ON — click to mute' : 'AI Voice OFF — click to enable'}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', gap: '0.4rem' }}
            >
              {ttsOn ? <Volume2 size={14} style={{ color: 'var(--accent-emerald)' }} /> : <VolumeX size={14} style={{ color: 'var(--text-subtle)' }} />}
              <span style={{ fontSize: '0.75rem', color: ttsOn ? 'var(--accent-emerald)' : 'var(--text-subtle)' }}>
                {ttsOn ? 'Voice ON' : 'Voice OFF'}
              </span>
            </button>

            {currentStep !== 'DASHBOARD' && (
              <button className="btn btn-secondary" onClick={goToDashboard} style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                <Home size={14} />
                <span>Dashboard</span>
              </button>
            )}

            {currentStep !== 'SCENARIO_SELECTION' && (
              <button className="btn btn-secondary" onClick={goToScenarioSelection} style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                <LayoutGrid size={14} />
                <span>Scenarios</span>
              </button>
            )}

            <button
              className="btn btn-primary"
              onClick={goToProfile}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
            >
              <UserCheck size={14} />
              <span>Progress</span>
            </button>

            {/* Auth: User avatar or Sign In */}
            {user && !isGuest ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'var(--gradient-brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', fontWeight: 700, color: '#fff',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                  flexShrink: 0,
                  cursor: 'default',
                  title: user.displayName || user.email,
                }}>
                  {user.photoURL
                    ? <img src={user.photoURL} alt="avatar" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                    : userInitial}
                </div>
                <button
                  id="navbar-logout-btn"
                  className="btn btn-secondary"
                  onClick={handleLogout}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                  title="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                id="navbar-signin-btn"
                className="btn btn-secondary"
                onClick={() => setShowAuthModal(true)}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};
