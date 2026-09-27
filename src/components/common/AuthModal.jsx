/**
 * AuthModal — Login / Signup / Guest Mode UI
 * Shows a premium glassmorphism modal for authentication.
 * Supports Email/Password, Google Sign-In, and Guest (continue without login).
 */
import React, { useState } from 'react';
import { Mic, Mail, Lock, User, Chrome, X, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = ({ onClose }) => {
  const { signIn, signUp, signInWithGoogle, isFirebaseConfigured, authError, clearAuthError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const error = localError || authError;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError('');
    clearAuthError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!form.email || !form.password) {
      setLocalError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup' && !form.name.trim()) {
      setLocalError('Please enter your name.');
      return;
    }
    setLoading(true);
    const result =
      mode === 'login'
        ? await signIn(form.email, form.password)
        : await signUp(form.email, form.password, form.name.trim());
    setLoading(false);
    if (result.success) onClose();
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    if (result.success) onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(11, 15, 25, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%', maxWidth: '420px',
          padding: '2.5rem 2rem',
          position: 'relative',
          border: '1px solid rgba(99,102,241,0.35)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 80px rgba(99,102,241,0.08)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-muted)',
            cursor: 'pointer', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          }}>
            <Mic size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {mode === 'login'
              ? 'Sign in to track your progress across devices'
              : 'Start your public speaking journey today'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(244,63,94,0.12)',
            border: '1px solid rgba(244,63,94,0.35)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontSize: '0.85rem',
            color: '#f87171',
            marginBottom: '1.25rem',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        {isFirebaseConfigured ? (
          <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mode === 'signup' && (
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                  <input
                    id="auth-name"
                    className="input-field"
                    style={{ paddingLeft: '2.75rem' }}
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  id="auth-email"
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  id="auth-password"
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)',
                    display: 'flex', alignItems: 'center',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                id="auth-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '0.25rem', padding: '0.85rem' }}
              >
                {loading ? (
                  <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                ) : mode === 'login' ? (
                  <><LogIn size={16} /> Sign In</>
                ) : (
                  <><UserPlus size={16} /> Create Account</>
                )}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} />
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>or</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} />
            </div>

            <button
              id="auth-google-btn"
              className="btn btn-secondary"
              onClick={handleGoogle}
              disabled={loading}
              style={{ width: '100%', gap: '0.65rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(245,158,11,0.1)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.3)' }}>
            <p style={{ color: '#fbbf24', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Firebase is not configured yet.<br />
              Add <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1em 0.4em', borderRadius: '4px' }}>VITE_FIREBASE_*</code> keys to your <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1em 0.4em', borderRadius: '4px' }}>.env</code> file to enable login.
            </p>
          </div>
        )}

        {/* Toggle mode */}
        {isFirebaseConfigured && (
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, padding: 0 }}
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setLocalError(''); clearAuthError(); }}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        )}

        {/* Guest mode */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            id="auth-guest-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', fontSize: '0.82rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            onClick={onClose}
          >
            Continue as Guest (progress saved locally only)
          </button>
        </div>
      </div>
    </div>
  );
};
