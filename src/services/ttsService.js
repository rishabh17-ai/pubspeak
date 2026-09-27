/**
 * Text-to-Speech Service — Dual Engine
 *
 * ENGINE 1 (Primary, if configured): ElevenLabs API via backend proxy
 *   → High-quality, natural-sounding AI voice
 *   → Requires ELEVENLABS_API_KEY in server .env
 *
 * ENGINE 2 (Free fallback): Web Speech API (built into every modern browser)
 *   → Zero cost, zero API key, works offline
 *   → Uses the best available system voice automatically
 *
 * The service auto-detects which engine to use based on server health check.
 */

let currentAudio = null;        // ElevenLabs audio element
let currentUtterance = null;    // Web Speech utterance
let isTTSEnabled = true;
let useElevenLabs = null;       // null = not yet checked, true/false after check

// ── Web Speech API setup ───────────────────────────────────────────────────────

const getWebSpeechVoice = () => {
  const voices = window.speechSynthesis?.getVoices() || [];

  // Priority list of high-quality English voices
  const preferred = [
    'Google UK English Female',
    'Google US English',
    'Microsoft Zira - English (United States)',
    'Microsoft Jenny Online (Natural) - English (United States)',
    'Samantha',
    'Karen',
  ];

  for (const name of preferred) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }

  // Fall back to any English voice
  return voices.find((v) => v.lang?.startsWith('en')) || voices[0] || null;
};

const speakWithWebSpeech = (text) => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      console.warn('[TTS] Web Speech API not supported in this browser.');
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    // Apply voice settings
    const voice = getWebSpeechVoice();
    if (voice) utterance.voice = voice;

    utterance.rate = 0.95;   // Slightly slower = clearer
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };
    utterance.onerror = (e) => {
      console.warn('[TTS] Web Speech error:', e.error);
      currentUtterance = null;
      resolve();
    };

    // Chrome bug: voices may not be loaded yet on first call
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const v = getWebSpeechVoice();
        if (v) utterance.voice = v;
        window.speechSynthesis.speak(utterance);
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  });
};

// ── ElevenLabs engine ─────────────────────────────────────────────────────────

const checkElevenLabsAvailable = async () => {
  if (useElevenLabs !== null) return useElevenLabs;
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(2000) });
    const data = await res.json();
    useElevenLabs = !!data.tts;
    console.log(`[TTS] Engine: ${useElevenLabs ? 'ElevenLabs (premium)' : 'Web Speech API (free)'}`);
  } catch {
    useElevenLabs = false;
  }
  return useElevenLabs;
};

const speakWithElevenLabs = async (text) => {
  try {
    const response = await fetch('/api/tts/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.warn('[TTS] ElevenLabs error:', response.status, '→ switching to Web Speech');
      useElevenLabs = false;
      return speakWithWebSpeech(text);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    currentAudio = new Audio(audioUrl);

    return new Promise((resolve) => {
      currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        resolve();
      };
      currentAudio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        resolve();
      };
      currentAudio.play().catch(() => {
        currentAudio = null;
        resolve();
      });
    });
  } catch (err) {
    console.warn('[TTS] ElevenLabs fetch failed:', err.message, '→ falling back to Web Speech');
    useElevenLabs = false;
    return speakWithWebSpeech(text);
  }
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Speak a text string using the best available TTS engine.
 * @param {string} text - The text to speak
 * @param {Object} options
 * @param {boolean} options.interrupt - Stop any currently playing audio first (default: true)
 */
export const speakText = async (text, { interrupt = true } = {}) => {
  if (!isTTSEnabled || !text) return;

  // Strip stage directions like [Nods] or (pauses) from spoken text
  const cleanText = text
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .trim();

  if (!cleanText) return;

  // Stop any currently playing audio
  if (interrupt) stopSpeaking();

  const elevenAvailable = await checkElevenLabsAvailable();

  if (elevenAvailable) {
    await speakWithElevenLabs(cleanText);
  } else {
    await speakWithWebSpeech(cleanText);
  }
};

/**
 * Stop any currently playing TTS audio (both engines).
 */
export const stopSpeaking = () => {
  // Stop ElevenLabs audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  // Stop Web Speech
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

/**
 * Toggle TTS on/off globally.
 * @param {boolean} enabled
 */
export const setTTSEnabled = (enabled) => {
  isTTSEnabled = enabled;
  if (!enabled) stopSpeaking();
};

/**
 * Returns whether TTS is currently enabled.
 */
export const getTTSEnabled = () => isTTSEnabled;

/**
 * Returns the currently active TTS engine name.
 */
export const getTTSEngine = () => {
  if (useElevenLabs === null) return 'checking...';
  return useElevenLabs ? 'ElevenLabs (Premium)' : 'Web Speech API (Free)';
};
