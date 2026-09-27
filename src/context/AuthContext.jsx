/**
 * Authentication Context
 * Manages user login state with Firebase Auth.
 * Supports Email/Password and Google sign-in.
 * Falls back gracefully to a "guest" mode when Firebase is not configured.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';
import { upsertUserProfile } from '../services/firestoreService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Firebase not configured — run as guest
      setUser({ uid: 'guest', displayName: 'Guest Speaker', email: null, isGuest: true });
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await upsertUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const signUp = async (email, password, displayName) => {
    if (!isFirebaseConfigured) return { success: false, error: 'Firebase not configured' };
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      await upsertUserProfile({ ...cred.user, displayName });
      return { success: true };
    } catch (err) {
      const msg = getFriendlyAuthError(err.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ── Sign In ────────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    if (!isFirebaseConfigured) return { success: false, error: 'Firebase not configured' };
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      const msg = getFriendlyAuthError(err.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ── Google Sign In ─────────────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) return { success: false, error: 'Firebase not configured' };
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await upsertUserProfile(result.user);
      return { success: true };
    } catch (err) {
      const msg = getFriendlyAuthError(err.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ── Sign Out ───────────────────────────────────────────────────────────────
  const logOut = async () => {
    if (!isFirebaseConfigured || !auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
    }
  };

  // ── Password Reset ─────────────────────────────────────────────────────────
  const resetPassword = async (email) => {
    if (!isFirebaseConfigured) return { success: false, error: 'Firebase not configured' };
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      return { success: false, error: getFriendlyAuthError(err.code) };
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        authError,
        isFirebaseConfigured,
        isGuest: user?.isGuest || false,
        signUp,
        signIn,
        signInWithGoogle,
        logOut,
        resetPassword,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

// ─── Helper: Human-readable Firebase error messages ───────────────────────────
const getFriendlyAuthError = (code) => {
  const messages = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid email or password.',
  };
  return messages[code] || 'An authentication error occurred. Please try again.';
};
