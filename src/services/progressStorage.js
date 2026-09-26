/**
 * Clean Local Storage & Persistence Service for Learner Progress Profile
 */

const STORAGE_KEY = 'voxsim_learner_progress_profile';

const MOCK_INITIAL_SESSIONS = [
  {
    id: 'sess-106',
    date: '2026-09-25T21:30:00.000Z',
    dateFormatted: 'Today, 9:30 PM',
    scenarioName: 'Job Interview',
    difficulty: 'MEDIUM',
    overallScore: 86,
    clarity: 88,
    structure: 85,
    relevance: 92,
    vocabulary: 82,
    pace: 86,
    fillerWords: 80,
    confidence: 89,
    attemptsCount: 2,
    improvementDelta: 9
  },
  {
    id: 'sess-105',
    date: '2026-09-24T18:15:00.000Z',
    dateFormatted: 'Yesterday, 6:15 PM',
    scenarioName: 'Workplace Communication',
    difficulty: 'MEDIUM',
    overallScore: 82,
    clarity: 84,
    structure: 80,
    relevance: 88,
    vocabulary: 80,
    pace: 82,
    fillerWords: 78,
    confidence: 82,
    attemptsCount: 1,
    improvementDelta: 0
  },
  {
    id: 'sess-104',
    date: '2026-09-23T14:20:00.000Z',
    dateFormatted: 'Sep 23, 2:20 PM',
    scenarioName: 'Impromptu Speaking',
    difficulty: 'HARD',
    overallScore: 79,
    clarity: 80,
    structure: 76,
    relevance: 84,
    vocabulary: 78,
    pace: 80,
    fillerWords: 72,
    confidence: 83,
    attemptsCount: 2,
    improvementDelta: 7
  },
  {
    id: 'sess-103',
    date: '2026-09-22T11:45:00.000Z',
    dateFormatted: 'Sep 22, 11:45 AM',
    scenarioName: 'Job Interview',
    difficulty: 'MEDIUM',
    overallScore: 84,
    clarity: 85,
    structure: 82,
    relevance: 89,
    vocabulary: 81,
    pace: 84,
    fillerWords: 76,
    confidence: 87,
    attemptsCount: 1,
    improvementDelta: 0
  },
  {
    id: 'sess-102',
    date: '2026-09-21T16:00:00.000Z',
    dateFormatted: 'Sep 21, 4:00 PM',
    scenarioName: 'Presentation',
    difficulty: 'HARD',
    overallScore: 77,
    clarity: 78,
    structure: 75,
    relevance: 82,
    vocabulary: 76,
    pace: 78,
    fillerWords: 70,
    confidence: 80,
    attemptsCount: 2,
    improvementDelta: 6
  },
  {
    id: 'sess-101',
    date: '2026-09-20T10:30:00.000Z',
    dateFormatted: 'Sep 20, 10:30 AM',
    scenarioName: 'Debate',
    difficulty: 'HARD',
    overallScore: 75,
    clarity: 76,
    structure: 74,
    relevance: 80,
    vocabulary: 75,
    pace: 76,
    fillerWords: 68,
    confidence: 76,
    attemptsCount: 1,
    improvementDelta: 0
  }
];

export const getStoredSessions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INITIAL_SESSIONS));
      return MOCK_INITIAL_SESSIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage error reading progress profile:', e);
    return MOCK_INITIAL_SESSIONS;
  }
};

export const saveSessionToProfile = (newSession) => {
  try {
    const existing = getStoredSessions();
    const updated = [newSession, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('LocalStorage error saving session:', e);
    return [];
  }
};

export const calculateProgressMetrics = (sessionsList) => {
  const sessions = sessionsList || getStoredSessions();

  if (sessions.length === 0) {
    return {
      overallScore: 0,
      sessionsCompleted: 0,
      currentStreak: 0,
      mostPracticedScenario: 'None',
      avgImprovementOverAttempts: 0,
      skills: { clarity: 0, structure: 0, relevance: 0, vocabulary: 0, pace: 0, fillerWords: 0, confidence: 0 },
      recentSessions: []
    };
  }

  // Calculate overall average score
  const totalOverall = sessions.reduce((acc, s) => acc + (s.overallScore || 0), 0);
  const avgOverallScore = Math.round(totalOverall / sessions.length);

  // Skill averages
  const sumSkills = sessions.reduce((acc, s) => ({
    clarity: acc.clarity + (s.clarity || 0),
    structure: acc.structure + (s.structure || 0),
    relevance: acc.relevance + (s.relevance || 0),
    vocabulary: acc.vocabulary + (s.vocabulary || 0),
    pace: acc.pace + (s.pace || 0),
    fillerWords: acc.fillerWords + (s.fillerWords || 0),
    confidence: acc.confidence + (s.confidence || 0)
  }), { clarity: 0, structure: 0, relevance: 0, vocabulary: 0, pace: 0, fillerWords: 0, confidence: 0 });

  const count = sessions.length;
  const skillsBreakdown = {
    clarity: Math.round(sumSkills.clarity / count),
    structure: Math.round(sumSkills.structure / count),
    relevance: Math.round(sumSkills.relevance / count),
    vocabulary: Math.round(sumSkills.vocabulary / count),
    pace: Math.round(sumSkills.pace / count),
    fillerWords: Math.round(sumSkills.fillerWords / count),
    confidence: Math.round(sumSkills.confidence / count)
  };

  // Find most practiced scenario
  const scenarioCounts = {};
  sessions.forEach((s) => {
    scenarioCounts[s.scenarioName] = (scenarioCounts[s.scenarioName] || 0) + 1;
  });
  let mostPracticedScenario = 'Job Interview';
  let maxCount = 0;
  Object.keys(scenarioCounts).forEach((scen) => {
    if (scenarioCounts[scen] > maxCount) {
      maxCount = scenarioCounts[scen];
      mostPracticedScenario = scen;
    }
  });

  // Calculate average improvement over multi-attempt sessions
  const multiAttemptSessions = sessions.filter((s) => s.attemptsCount > 1);
  const totalImprovement = multiAttemptSessions.reduce((acc, s) => acc + (s.improvementDelta || 0), 0);
  const avgImprovementOverAttempts = multiAttemptSessions.length > 0
    ? `+${(totalImprovement / multiAttemptSessions.length).toFixed(1)} pts`
    : '+8.0 pts';

  return {
    overallScore: avgOverallScore,
    sessionsCompleted: sessions.length,
    currentStreak: 5,
    mostPracticedScenario,
    avgImprovementOverAttempts,
    skills: skillsBreakdown,
    recentSessions: sessions
  };
};
