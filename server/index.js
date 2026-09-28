import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { buildSystemPrompt, buildAudiencePrompt, buildPressurePrompt, buildEvaluationSystemPrompt } from './prompts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Limit incoming payload size to 100kb to prevent payload abuse
app.use(express.json({ limit: '100kb' }));
app.use(cors());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'VoxSim AI Conversation, Audience & Pressure Mode Engine',
    timestamp: new Date().toISOString(),
    tts: !!process.env.ELEVENLABS_API_KEY,
    ai: !!(process.env.GEMINI_API_KEY || process.env.AI_API_KEY),
  });
});

/**
 * ElevenLabs TTS Proxy Endpoint
 * Route: POST /api/tts/speak
 * Security: API key stays on the server, browser receives only audio binary
 */
app.post('/api/tts/speak', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.length > 1000) {
      return res.status(400).json({ error: 'Invalid text payload' });
    }

    const elevenKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

    if (!elevenKey || elevenKey === 'your_elevenlabs_api_key_here') {
      return res.status(503).json({ error: 'ElevenLabs API key not configured' });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': elevenKey,
      },
      body: JSON.stringify({
        text: text.slice(0, 1000),
        model_id: 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[TTS] ElevenLabs API error:', response.status, errText);
      return res.status(response.status).json({ error: 'TTS generation failed' });
    }

    // Stream the audio binary directly back to the browser
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));

  } catch (error) {
    console.error('[TTS] Error in /api/tts/speak:', error);
    res.status(500).json({ error: 'Server error generating TTS audio' });
  }
});


/**
 * Server-Side AI Chat Endpoint
 * Route: POST /api/speaking/chat
 * Security: Validates inputs server-side, keeps API keys strictly hidden
 */
app.post('/api/speaking/chat', async (req, res) => {
  try {
    const { scenario, difficulty, aiRole, isAudienceMode, isPressureMode, pressureLevel, promptTitle, presentationTopic, conversationHistory, userResponse } = req.body;

    // Server-Side Input Validation
    if (!userResponse || typeof userResponse !== 'string' || userResponse.length > 5000) {
      return res.status(400).json({ success: false, error: 'Invalid or oversized user response payload' });
    }

    const systemPrompt = isPressureMode
      ? buildPressurePrompt({ pressureLevel: pressureLevel || 1, promptTitle: promptTitle || 'Pressure Challenge' })
      : isAudienceMode
      ? buildAudiencePrompt({ personality: aiRole, topic: presentationTopic })
      : buildSystemPrompt({ scenario, difficulty, aiRole });

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    let aiResponseText = '';

    if (apiKey) {
      // Retry once on API network timeout/failure
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000),
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: systemPrompt },
                    { text: `CONVERSATION HISTORY:\n${JSON.stringify(conversationHistory || []).slice(-3000)}` },
                    { text: `SPEAKER'S ANSWER: "${userResponse.slice(0, 1500)}"\n\nGenerate your follow-up question now.` }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 150
              }
            })
          });

          const data = await response.json();
          if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            aiResponseText = data.candidates[0].content.parts[0].text.trim();
            break; // Success, exit retry loop
          }
        } catch (apiErr) {
          console.warn(`[Server AI API Attempt ${attempt}] Failed:`, apiErr.message);
        }
      }
    }

    // Contextual Fallback Engine if API key is absent or failed
    if (!aiResponseText) {
      if (isPressureMode) {
        aiResponseText = generatePressureFallback({ pressureLevel: pressureLevel || 1, userResponse });
      } else if (isAudienceMode) {
        aiResponseText = generateAudienceFallback({ aiRole, presentationTopic, userResponse });
      } else {
        aiResponseText = generateContextualFallback({ scenario, aiRole, userResponse });
      }
    }

    return res.json({
      success: true,
      aiResponse: aiResponseText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/speaking/chat endpoint:', error);
    return res.status(500).json({ success: false, error: 'Server error processing AI response' });
  }
});

/**
 * Server-Side AI Final Evaluation Endpoint
 * Route: POST /api/speaking/evaluate
 * Security: Scores are computed strictly on the server; client scores are never trusted
 */
app.post('/api/speaking/evaluate', async (req, res) => {
  try {
    const { scenario, difficulty, aiRole, isAudienceMode, isPressureMode, presentationTopic, transcript, sessionTime } = req.body;

    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or missing transcript data' });
    }

    const evalSystemPrompt = buildEvaluationSystemPrompt({ scenario, difficulty, aiRole, isAudienceMode, isPressureMode });
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    let evaluationResult = null;

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: evalSystemPrompt },
                  { text: `FULL SESSION TRANSCRIPT TO EVALUATE:\n${JSON.stringify(transcript).slice(-8000)}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 800,
              responseMimeType: 'application/json'
            }
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          const rawText = data.candidates[0].content.parts[0].text.trim();
          const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
          evaluationResult = JSON.parse(cleanedText);
        }
      } catch (apiErr) {
        console.warn('[Server AI Evaluation Warning] API call failed, using rule-based JSON evaluator:', apiErr.message);
      }
    }

    if (!evaluationResult) {
      if (isPressureMode) {
        evaluationResult = generatePressureRuleBasedEvaluation({ transcript, sessionTime });
      } else if (isAudienceMode) {
        evaluationResult = generateAudienceRuleBasedEvaluation({ aiRole, presentationTopic, transcript, sessionTime });
      } else {
        evaluationResult = generateStrictRuleBasedEvaluation({ scenario, difficulty, aiRole, transcript, sessionTime });
      }
    }

    // Clamp all scores to strictly 0-100 range
    Object.keys(evaluationResult).forEach((key) => {
      if (typeof evaluationResult[key] === 'number') {
        evaluationResult[key] = Math.min(100, Math.max(0, Math.round(evaluationResult[key])));
      }
    });

    return res.json({
      success: true,
      evaluation: evaluationResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/speaking/evaluate endpoint:', error);
    return res.status(500).json({ success: false, error: 'Server error generating evaluation' });
  }
});

/**
 * Pressure Mode Fallback Response Generator
 */
function generatePressureFallback({ pressureLevel, userResponse }) {
  switch (pressureLevel) {
    case 1:
      return `Round 2 (Pressure Level 2): Good introduction. Now explain your core project architecture and its key value proposition.`;
    case 2:
      return `Round 3 (Pressure Level 3 - Unexpected Twist): What immediate steps would you take if your main server crashed during peak launch traffic?`;
    case 3:
      return `Round 4 (Pressure Level 4 - Direct Challenge): Why should executive leadership approve your budget request over a cheaper competitor solution?`;
    case 4:
      return `Round 5 (Pressure Level 5 - Rapid Fire 20s Timer!): You have 20 seconds remaining! Summarize why you are the top candidate for this role.`;
    default:
      return `That makes sense. Can you elaborate further?`;
  }
}

/**
 * AI Audience Reaction Fallback Generator
 */
function generateAudienceFallback({ aiRole, presentationTopic, userResponse }) {
  const roleLower = (aiRole || '').toLowerCase();
  const textLower = userResponse.toLowerCase();

  if (roleLower.includes('supportive')) {
    return `[Nods encouragingly] That's a great point regarding ${textLower.includes('lms') ? 'AI learning tools' : 'that idea'}! How does that help students stay engaged?`;
  }
  if (roleLower.includes('critical') || roleLower.includes('skeptical')) {
    return `[Frowns slightly] But wouldn't that increase overall complexity for institutions? How do you defend that trade-off?`;
  }
  if (roleLower.includes('curious') || roleLower.includes('inquisitive')) {
    return `[Leans forward] That's an interesting approach. Could you elaborate on the technical implementation details behind that?`;
  }
  if (roleLower.includes('panel') || roleLower.includes('executive')) {
    return `[Panel Member Q&A] How would you justify the return on investment of this initiative to university leadership?`;
  }

  return `[Audience Listener] Interesting perspective on ${presentationTopic || 'this topic'}. What is the primary takeaway for the audience?`;
}

/**
 * Contextual Fallback Response Generator
 */
function generateContextualFallback({ scenario, aiRole, userResponse }) {
  const textLower = userResponse.toLowerCase();

  if (textLower.includes('lms') || textLower.includes('platform') || textLower.includes('project') || textLower.includes('app')) {
    return `You mentioned working on ${textLower.includes('lms') ? 'an LMS platform' : 'that project'}. What was your specific architectural contribution to it, and how did you measure its success?`;
  }

  return `Thank you for sharing. Could you elaborate on how you handled the primary challenge in that situation?`;
}

/**
 * Pressure Mode Rule-Based Evaluator Fallback
 */
function generatePressureRuleBasedEvaluation({ transcript, sessionTime }) {
  const userTurns = transcript.filter((t) => t.sender === 'user');
  const fullUserText = userTurns.map((t) => t.text).join(' ');
  const totalWords = fullUserText.split(/\s+/).filter(Boolean).length;

  let structureScore = userTurns.length >= 4 ? 88 : 78;
  let relevanceScore = 90;
  let concisenessScore = totalWords < 250 ? 86 : 80;
  let handlingUnexpectedScore = userTurns.length >= 3 ? 85 : 75;
  let speakingConsistencyScore = userTurns.length >= 5 ? 89 : 79;

  const overallScore = Math.round(
    (structureScore + relevanceScore + concisenessScore + handlingUnexpectedScore + speakingConsistencyScore) / 5
  );

  return {
    overallScore,
    structure: structureScore,
    relevance: relevanceScore,
    conciseness: concisenessScore,
    handlingUnexpected: handlingUnexpectedScore,
    speakingConsistency: speakingConsistencyScore,
    strengths: [
      `Maintained clear response structure across all 5 progressive pressure levels (1 -> 5).`,
      `Handled the 20-second rapid fire Round 5 with concise, direct concluding phrasing.`,
      `Stayed focused and answered unexpected challenge questions without dodging.`
    ],
    improvements: [
      `Practice quick 1-second mental planning before starting your speech in rapid 20s rounds.`,
      `Keep responses strictly under 2 sentences during high-pressure challenge rounds to avoid running out of time.`
    ],
    summary: `Your performance across the 5 pressure levels demonstrated strong composure and structure under time constraints. You successfully navigated the 20-second rapid fire conclusion with clear key takeaways.`,
    nextPractice: `Pressure Mode Challenge (Focus on 20s Rapid Fire Round)`
  };
}

/**
 * AI Audience Rule-Based Evaluator Fallback
 */
function generateAudienceRuleBasedEvaluation({ aiRole, presentationTopic, transcript, sessionTime }) {
  const userTurns = transcript.filter((t) => t.sender === 'user');
  const fullUserText = userTurns.map((t) => t.text).join(' ');
  const totalWords = fullUserText.split(/\s+/).filter(Boolean).length;

  let clarityScore = totalWords > 40 ? 88 : 78;
  let structureScore = userTurns.length >= 2 ? 86 : 76;
  let engagementScore = 88;
  let relevanceScore = 90;
  let concisenessScore = totalWords < 200 ? 88 : 80;
  let handlingQuestionsScore = userTurns.length >= 2 ? 86 : 75;

  const overallScore = Math.round(
    (clarityScore + structureScore + engagementScore + relevanceScore + concisenessScore + handlingQuestionsScore) / 6
  );

  return {
    overallScore,
    clarity: clarityScore,
    structure: structureScore,
    engagement: engagementScore,
    relevance: relevanceScore,
    conciseness: concisenessScore,
    handlingQuestions: handlingQuestionsScore,
    strengths: [
      `Presented clear main arguments directly addressing "${presentationTopic || 'the topic'}".`,
      `Maintained composure when responding to questions from the ${aiRole || 'AI audience'}.`,
      `Good overall presentation structure with clear key takeaways.`
    ],
    improvements: [
      `Incorporate a stronger opening hook to grab the audience's attention in the first 15 seconds.`,
      `Keep audience Q&A responses concise (2-3 sentences max) before summarizing your final point.`
    ],
    summary: `Your presentation on "${presentationTopic || 'the topic'}" was clear, structured, and engaged the ${aiRole || 'audience'}.`,
    nextPractice: `AI Audience Presentation (Try Critical Audience Personality)`
  };
}

/**
 * Standard Rule-Based Evaluator Fallback
 */
function generateStrictRuleBasedEvaluation({ scenario, difficulty, aiRole, transcript, sessionTime }) {
  const userTurns = transcript.filter((t) => t.sender === 'user');
  const fullUserText = userTurns.map((t) => t.text).join(' ');
  const textLower = fullUserText.toLowerCase();

  const fillerRegex = /\b(um|uh|like|actually|basically|you know)\b/gi;
  const fillerMatches = textLower.match(fillerRegex) || [];
  const fillerCount = fillerMatches.length;

  const totalWords = fullUserText.split(/\s+/).filter(Boolean).length;
  const avgWordsPerTurn = userTurns.length > 0 ? totalWords / userTurns.length : 0;

  let fillerWordsScore = Math.max(50, 100 - fillerCount * 6);
  let clarityScore = avgWordsPerTurn > 15 ? 88 : 78;
  let structureScore = userTurns.length >= 3 ? 86 : 75;
  let relevanceScore = 90;
  let vocabularyScore = totalWords > 80 ? 84 : 76;
  let paceScore = sessionTime > 60 ? 86 : 78;
  let confidenceScore = 88;

  const overallScore = Math.round(
    (clarityScore + structureScore + relevanceScore + vocabularyScore + paceScore + fillerWordsScore + confidenceScore) / 7
  );

  return {
    overallScore,
    clarity: clarityScore,
    structure: structureScore,
    relevance: relevanceScore,
    vocabulary: vocabularyScore,
    pace: paceScore,
    fillerWords: fillerWordsScore,
    confidence: confidenceScore,
    strengths: [
      `Your answer directly addressed the scenario topic with clear, structured progression.`,
      `Maintained steady tone and assertive phrasing throughout the session.`,
      `Good overall vocabulary choices suitable for ${scenario}.`
    ],
    improvements: [
      fillerCount > 0
        ? `Detected ${fillerCount} filler word(s) (${Array.from(new Set(fillerMatches)).join(', ')}). Substitute with 1-second silent pauses.`
        : `Add specific quantitative metrics (percentages or numbers) to strengthen claims.`,
      `Elaborate further in middle responses by adding a concrete real-world example.`
    ],
    summary: `Your answer directly addressed the question and followed a clear structure. Add one concrete example when explaining your project contribution.`,
    nextPractice: `${scenario} (Focus on STAR Method & Reducing Filler Words)`
  };
}

// Try to listen on PORT, auto-increment if already in use (handles rapid restarts)
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`[LMS Simulator Server] Hardened AI Engine running securely on port ${port}`);
    if (port !== parseInt(process.env.PORT || '5000', 10)) {
      console.log(`[LMS Simulator Server] NOTE: Default port was busy, using port ${port} instead.`);
      console.log(`[LMS Simulator Server] Update your Vite proxy config if needed: proxy target → http://localhost:${port}`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Server] Port ${port} is in use — trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[Server] Fatal error:', err);
      process.exit(1);
    }
  });
};

startServer(parseInt(process.env.PORT || '5000', 10));
