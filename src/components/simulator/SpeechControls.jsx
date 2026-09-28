import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Send, Clock, CheckSquare, AlertCircle, ShieldAlert, RefreshCw } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const SpeechControls = () => {
  const {
    isMicActive,
    setIsMicActive,
    sendUserResponse,
    sessionTime,
    finishSession,
    isAiSpeaking
  } = useSimulator();

  const [textInput, setTextInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micPermission, setMicPermission] = useState('unknown'); // 'unknown' | 'granted' | 'denied' | 'prompt'
  const [micError, setMicError] = useState(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const recognitionRef = useRef(null);
  const shouldRestartRef = useRef(false);

  // Format Timer MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check existing mic permission state on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    // Query existing permission state without triggering a prompt
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then((result) => {
        setMicPermission(result.state); // 'granted' | 'denied' | 'prompt'
        result.onchange = () => {
          setMicPermission(result.state);
          if (result.state === 'denied') {
            setMicError('Microphone access was denied. Please allow microphone access in your browser settings.');
            setIsMicActive(false);
            shouldRestartRef.current = false;
          } else if (result.state === 'granted') {
            setMicError(null);
          }
        };
      }).catch(() => {
        // Permissions API not available — we'll handle this when user clicks mic
        setMicPermission('unknown');
      });
    }
  }, [setIsMicActive]);

  // Build and bind the SpeechRecognition instance
  const buildRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsMicActive(true);
      setMicError(null);
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTextInput(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.warn('SpeechRecognition error:', event.error);
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          setMicPermission('denied');
          setMicError('Microphone access denied. Click the 🔒 lock icon in your browser address bar and allow the microphone.');
          shouldRestartRef.current = false;
          setIsMicActive(false);
          break;
        case 'no-speech':
          // Harmless — keep going, recognition.onend will restart if needed
          break;
        case 'audio-capture':
          setMicError('No microphone found. Please connect a microphone and try again.');
          shouldRestartRef.current = false;
          setIsMicActive(false);
          break;
        case 'network':
          setMicError('Network error during speech recognition. Check your internet connection.');
          shouldRestartRef.current = false;
          setIsMicActive(false);
          break;
        case 'aborted':
          // User stopped manually — not an error
          break;
        default:
          setMicError(`Speech recognition error: ${event.error}. Try again.`);
          shouldRestartRef.current = false;
          setIsMicActive(false);
      }
    };

    recognition.onend = () => {
      // Auto-restart to keep continuous listening alive (Chrome stops after ~60s silence)
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Already started or other transient error — ignore
        }
      } else {
        setIsMicActive(false);
      }
    };

    return recognition;
  }, [setIsMicActive]);

  // Toggle Microphone
  const toggleMic = async () => {
    if (!speechSupported) {
      setMicError('Web Speech API is not supported in this browser. Please use Chrome or Edge and type your response below.');
      return;
    }

    if (isMicActive) {
      // Stop recording
      shouldRestartRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // Already stopped
      }
      setIsMicActive(false);
      return;
    }

    // Start recording — request mic permission proactively first
    setMicError(null);
    setIsRequestingPermission(true);

    try {
      // This triggers the browser permission prompt if not yet decided
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately release the stream — SpeechRecognition manages its own
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission('granted');
    } catch (err) {
      setIsRequestingPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermission('denied');
        setMicError('Microphone access denied. Click the 🔒 lock icon in your browser address bar → Site settings → Allow Microphone, then refresh.');
      } else if (err.name === 'NotFoundError') {
        setMicError('No microphone found on this device. Please connect a microphone and try again.');
      } else {
        setMicError(`Could not access microphone: ${err.message}`);
      }
      return;
    }

    setIsRequestingPermission(false);

    // Build fresh recognition instance and start
    const recognition = buildRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    shouldRestartRef.current = true;
    setTextInput('');

    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setMicError('Could not start microphone. Please try again.');
      shouldRestartRef.current = false;
      setIsMicActive(false);
    }
  };

  // Submit user speech to the session
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!textInput.trim() || isAiSpeaking) return;

    // Stop listening first
    if (isMicActive) {
      shouldRestartRef.current = false;
      try { recognitionRef.current?.stop(); } catch (e) { /* ignore */ }
      setIsMicActive(false);
    }

    sendUserResponse(textInput.trim());
    setTextInput('');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      try { recognitionRef.current?.stop(); } catch (e) { /* ignore */ }
    };
  }, []);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        background: 'rgba(15, 23, 42, 0.95)'
      }}
    >
      {/* Top Status & Controls Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>

        {/* Session Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.4rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 600 }}>
          <Clock size={15} style={{ color: 'var(--primary)' }} />
          <span>Session Time: <strong style={{ color: 'var(--text-main)' }}>{formatTime(sessionTime)}</strong></span>
        </div>

        {/* Speech Mode Status */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isMicActive ? (
            <span style={{ color: 'var(--accent-rose)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-rose)', display: 'inline-block' }} className="animate-pulse" />
              Recording your speech... Click Mic or Send when finished.
            </span>
          ) : isRequestingPermission ? (
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Requesting microphone access...</span>
          ) : (
            <span>Click Mic to speak or type your response below.</span>
          )}
        </div>

        {/* End Session Trigger */}
        <button
          className="btn btn-secondary"
          onClick={finishSession}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185' }}
        >
          <CheckSquare size={16} />
          <span>Finish &amp; View Report</span>
        </button>
      </div>

      {/* Mic Error / Permission Banner */}
      {micError && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          fontSize: '0.84rem',
          color: '#fb7185'
        }}>
          <ShieldAlert size={17} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ flex: 1 }}>
            <strong>Microphone Error: </strong>{micError}
            {micPermission === 'denied' && (
              <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: '#fca5a5' }}>
                💡 <strong>How to fix:</strong> Click the 🔒 lock icon in the address bar → Site settings → Microphone → Allow → Refresh the page.
              </div>
            )}
          </div>
          <button
            onClick={() => setMicError(null)}
            style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '0', flexShrink: 0 }}
            title="Dismiss"
          >✕</button>
        </div>
      )}

      {/* Browser Not Supported Banner */}
      {!speechSupported && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '0.65rem 1rem', fontSize: '0.84rem', color: '#fbbf24' }}>
          <AlertCircle size={15} />
          <span>Speech recognition not supported in this browser. Please use Chrome or Edge — or type your response in the text box below.</span>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>

        {/* Big Mic Button */}
        <button
          type="button"
          onClick={toggleMic}
          disabled={isRequestingPermission || isAiSpeaking || micPermission === 'denied'}
          className={`btn ${isMicActive ? 'btn-danger mic-active-pulse' : 'btn-primary'}`}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            flexShrink: 0,
            padding: 0,
            opacity: (isAiSpeaking || micPermission === 'denied') ? 0.45 : 1,
            cursor: micPermission === 'denied' ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          title={
            micPermission === 'denied'
              ? 'Microphone access denied — allow in browser settings'
              : isMicActive
              ? 'Stop Recording'
              : isRequestingPermission
              ? 'Requesting permission...'
              : 'Start Speech Recording'
          }
        >
          {isMicActive ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        {/* Transcribed / Manual Input Text Box */}
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            className="input-field"
            placeholder={
              isAiSpeaking
                ? 'AI is speaking — wait for your turn...'
                : isMicActive
                ? 'Transcribing your speech in real-time...'
                : 'Type or speak your response here...'
            }
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isAiSpeaking}
            style={{
              paddingRight: '3rem',
              height: '50px',
              fontSize: '0.95rem',
              borderColor: isMicActive ? 'var(--accent-rose)' : 'var(--border-color)',
              transition: 'border-color 0.2s ease'
            }}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!textInput.trim() || isAiSpeaking}
          style={{ height: '52px', padding: '0 1.5rem', opacity: (!textInput.trim() || isAiSpeaking) ? 0.45 : 1 }}
        >
          <Send size={18} />
          <span style={{ display: 'none' }}>Send</span>
        </button>
      </form>
    </div>
  );
};
