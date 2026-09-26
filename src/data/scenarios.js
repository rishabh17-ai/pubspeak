export const DIFFICULTY_CONFIGS = {
  EASY: {
    level: 'EASY',
    prepTimeSeconds: 15,
    roundSpeakingTimeSeconds: 90,
    aiStyle: 'Supportive & Encouraging AI Partner',
    description: 'Simple questions, 15s prep time, generous speaking time, supportive AI.'
  },
  MEDIUM: {
    level: 'MEDIUM',
    prepTimeSeconds: 10,
    roundSpeakingTimeSeconds: 60,
    aiStyle: 'Demanding & Analytical AI Partner',
    description: 'Direct follow-up questions, 10s prep time, 60s timer, demanding AI.'
  },
  HARD: {
    level: 'HARD',
    prepTimeSeconds: 5,
    roundSpeakingTimeSeconds: 45,
    aiStyle: 'High-Pressure Challenge AI Partner',
    description: 'Unexpected questions & interruptions, 5s prep time, 45s timer, high pressure.'
  }
};

export const AI_AUDIENCE_PERSONALITIES = [
  {
    id: 'supportive',
    name: 'Supportive Audience',
    iconName: 'Smile',
    description: 'Encouraging, friendly listeners who nod, validate key points, and ask positive follow-ups.',
    aiRole: 'Supportive Audience'
  },
  {
    id: 'neutral',
    name: 'Neutral Audience',
    iconName: 'Meh',
    description: 'Objective, professional listeners who evaluate facts and logic without emotional bias.',
    aiRole: 'Objective Observers'
  },
  {
    id: 'curious',
    name: 'Curious Audience',
    iconName: 'HelpCircle',
    description: 'Inquisitive listeners who ask deep-dive technical and practical implementation questions.',
    aiRole: 'Inquisitive Audience'
  },
  {
    id: 'critical',
    name: 'Critical Audience',
    iconName: 'AlertOctagon',
    description: 'Skeptical, demanding listeners who challenge assumptions and push back on claims.',
    aiRole: 'Skeptical Evaluators'
  },
  {
    id: 'interview-panel',
    name: 'Interview Panel',
    iconName: 'Users',
    description: 'Multi-member hiring board testing strategic thinking, poise, and handling tough Q&A.',
    aiRole: 'Executive Panel'
  }
];

export const PRESENTATION_TOPICS = [
  "Explain why students should use an AI-powered LMS.",
  "How remote learning platforms can improve student employability.",
  "The future of interactive public speaking training in higher education.",
  "Why active learning beats passive video lectures in online courses.",
  "How AI-driven continuous feedback accelerates skill acquisition."
];

export const SESSION_ROUNDS = [
  { round: 1, title: 'Introduction & Warm-up', type: 'Intro' },
  { round: 2, title: 'Deep-Dive Follow-up Question', type: 'Follow-up' },
  { round: 3, title: 'Unexpected Scenario Twist', type: 'Twist' },
  { round: 4, title: 'High-Pressure Challenge Question', type: 'Challenge' },
  { round: 5, title: 'Final Summary & Conclusion', type: 'Closing' }
];

export const SCENARIOS = [
  {
    id: 'job-interview',
    name: 'Job Interview',
    description: 'Practice answering common behavioral and situational interview questions with an AI Tech Recruiter.',
    difficulty: 'MEDIUM',
    estimatedDuration: '5 mins',
    aiPersonality: 'Professional & Direct Tech Hiring Manager (Sarah)',
    aiRole: 'Interviewer',
    iconName: 'Briefcase',
    initialPrompt: "Hello! Welcome to your interview. Let's begin Round 1: Tell me about yourself and your background.",
    targetMetrics: ['Clarity', 'Structure', 'Relevance', 'Vocabulary', 'Pace', 'Filler Words', 'Confidence']
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Deliver a clear, structured project presentation to executive stakeholders and handle follow-up questions.',
    difficulty: 'HARD',
    estimatedDuration: '7 mins',
    aiPersonality: 'Data-driven Executive Stakeholder (Marcus)',
    aiRole: 'Executive Stakeholder',
    iconName: 'Presentation',
    initialPrompt: "Thanks for joining. We have limited time. Walk me through your project results and main recommendations.",
    targetMetrics: ['Clarity', 'Structure', 'Relevance', 'Vocabulary', 'Pace', 'Filler Words', 'Confidence']
  },
  {
    id: 'debate',
    name: 'Debate',
    description: 'Defend your perspective against counter-arguments in a structured, persuasive workplace debate.',
    difficulty: 'HARD',
    estimatedDuration: '6 mins',
    aiPersonality: 'Sharp & Analytical Debate Opponent (Dr. Pendelton)',
    aiRole: 'Debate Opponent',
    iconName: 'Swords',
    initialPrompt: "Remote work reduces long-term team collaboration and spontaneous innovation. How do you defend remote-first policies?",
    targetMetrics: ['Clarity', 'Structure', 'Relevance', 'Vocabulary', 'Pace', 'Filler Words', 'Confidence']
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    description: 'Hook an audience with a narrative arc, vivid details, and a clear takeaway lesson.',
    difficulty: 'EASY',
    estimatedDuration: '5 mins',
    aiPersonality: 'Engaged Conference Listener (Elena)',
    aiRole: 'Audience / Listener',
    iconName: 'BookOpen',
    initialPrompt: "The stage is yours! Tell us a story about a major obstacle you faced and what it taught you.",
    targetMetrics: ['Clarity', 'Structure', 'Relevance', 'Vocabulary', 'Pace', 'Filler Words', 'Confidence']
  },
  {
    id: 'impromptu-speaking',
    name: 'Impromptu Speaking',
    description: 'Formulate quick, structured thoughts on an unexpected topic without prior preparation.',
    difficulty: 'HARD',
    estimatedDuration: '3 mins',
    aiPersonality: 'Table Topics Toastmasters Host (David)',
    aiRole: 'Moderator',
    iconName: 'Zap',
    initialPrompt: "Your prompt is: 'Is technology making human communication better or worse?' Share your view!",
    targetMetrics: ['Clarity', 'Structure', 'Relevance', 'Vocabulary', 'Pace', 'Filler Words', 'Confidence']
  },
  {
    id: 'workplace-communication',
    name: 'Workplace Communication',
    description: 'Conduct a sensitive 1-on-1 meeting to address feedback, expectations, or project alignment.',
    difficulty: 'MEDIUM',
    estimatedDuration: '5 mins',
    aiPersonality: 'Collaborative Team Lead (Alex)',
    aiRole: 'Team Member',
    iconName: 'MessageSquare',
    initialPrompt: "Hey! Thanks for setting up this 1-on-1. What did you want to discuss regarding our recent project sprint?",
    targetMetrics: ['Clarity', 'Structure', 'Relevance', 'Vocabulary', 'Pace', 'Filler Words', 'Confidence']
  }
];

export const MOCK_RECENT_SESSIONS = [
  {
    id: 'sess-1',
    scenarioName: 'Job Interview',
    date: 'Today, 2:15 PM',
    score: 86,
    duration: '4m 30s',
    status: 'Completed'
  },
  {
    id: 'sess-2',
    scenarioName: 'Workplace Communication',
    date: 'Yesterday, 5:40 PM',
    score: 82,
    duration: '5m 10s',
    status: 'Completed'
  },
  {
    id: 'sess-3',
    scenarioName: 'Impromptu Speaking',
    date: 'Sep 23, 2026',
    score: 79,
    duration: '2m 55s',
    status: 'Completed'
  }
];
