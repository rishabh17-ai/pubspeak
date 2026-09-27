/**
 * Firestore Database Service
 * Handles all CRUD operations for user sessions and progress data.
 * Gracefully falls back to localStorage when Firebase is not configured.
 */
import {
  doc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { getStoredSessions, saveSessionToProfile } from './progressStorage';

// ─── User Profile ─────────────────────────────────────────────────────────────

/**
 * Creates or updates the user's profile document in Firestore.
 * Called once after login/signup.
 */
export const upsertUserProfile = async (user) => {
  if (!isFirebaseConfigured || !db || !user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Speaker',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        totalSessions: 0,
        bestScore: 0,
        currentStreak: 0,
      });
    }
  } catch (err) {
    console.error('[Firestore] upsertUserProfile error:', err);
  }
};

// ─── Sessions ─────────────────────────────────────────────────────────────────

/**
 * Saves a completed session to Firestore (and localStorage as backup).
 * @param {string} userId - Firebase Auth UID
 * @param {Object} sessionRecord - The session result object
 */
export const saveSessionToFirestore = async (userId, sessionRecord) => {
  // Always save to localStorage as backup
  saveSessionToProfile(sessionRecord);

  if (!isFirebaseConfigured || !db || !userId) return null;

  try {
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const docRef = await addDoc(sessionsRef, {
      ...sessionRecord,
      createdAt: serverTimestamp(),
    });

    // Update aggregate stats on the user document
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      await updateDoc(userRef, {
        totalSessions: (userData.totalSessions || 0) + 1,
        bestScore: Math.max(userData.bestScore || 0, sessionRecord.overallScore),
      });
    }

    return docRef.id;
  } catch (err) {
    console.error('[Firestore] saveSessionToFirestore error:', err);
    return null;
  }
};

/**
 * Fetches the most recent N sessions for a user from Firestore.
 * Falls back to localStorage if not configured.
 * @param {string} userId
 * @param {number} maxCount
 */
export const fetchUserSessions = async (userId, maxCount = 50) => {
  if (!isFirebaseConfigured || !db || !userId) {
    return getStoredSessions();
  }
  try {
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const q = query(sessionsRef, orderBy('createdAt', 'desc'), limit(maxCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[Firestore] fetchUserSessions error:', err);
    return getStoredSessions(); // graceful fallback
  }
};

/**
 * Fetches the user's aggregate profile stats.
 * @param {string} userId
 */
export const fetchUserProfile = async (userId) => {
  if (!isFirebaseConfigured || !db || !userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error('[Firestore] fetchUserProfile error:', err);
    return null;
  }
};

// ─── Analytics Helpers ────────────────────────────────────────────────────────

/**
 * Computes analytics from a list of sessions.
 * Works with both Firestore-fetched and localStorage sessions.
 * @param {Array} sessions
 */
export const computeAnalytics = (sessions = []) => {
  if (!sessions.length) return null;

  const scores = sessions.map((s) => s.overallScore).filter(Boolean);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const bestScore = Math.max(...scores);
  const recentScore = scores[0] || 0;
  const improvement = scores.length >= 2 ? recentScore - scores[scores.length - 1] : 0;

  // Scenario breakdown
  const scenarioMap = {};
  sessions.forEach((s) => {
    if (!scenarioMap[s.scenarioName]) scenarioMap[s.scenarioName] = [];
    scenarioMap[s.scenarioName].push(s.overallScore);
  });
  const scenarioBreakdown = Object.entries(scenarioMap).map(([name, sc]) => ({
    name,
    avgScore: Math.round(sc.reduce((a, b) => a + b, 0) / sc.length),
    count: sc.length,
  })).sort((a, b) => b.avgScore - a.avgScore);

  // Skill averages (across all sessions that have them)
  const skillKeys = ['clarity', 'structure', 'relevance', 'vocabulary', 'pace', 'fillerWords', 'confidence', 'engagement', 'conciseness'];
  const skillAverages = {};
  skillKeys.forEach((key) => {
    const vals = sessions.map((s) => s[key]).filter((v) => typeof v === 'number');
    if (vals.length) {
      skillAverages[key] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    }
  });

  // Streak calculation
  let streak = 0;
  const today = new Date();
  const sortedDates = sessions
    .map((s) => new Date(s.date || s.createdAt?.toDate?.() || Date.now()))
    .sort((a, b) => b - a);

  for (let i = 0; i < sortedDates.length; i++) {
    const diff = Math.floor((today - sortedDates[i]) / (1000 * 60 * 60 * 24));
    if (diff <= i + 1) streak++;
    else break;
  }

  return {
    totalSessions: sessions.length,
    avgScore,
    bestScore,
    recentScore,
    improvement,
    streak,
    scenarioBreakdown,
    skillAverages,
    recentSessions: sessions.slice(0, 10),
  };
};
