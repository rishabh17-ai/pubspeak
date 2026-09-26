import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Clock, CheckSquare, RefreshCw, MessageSquare } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const SpeechControls = () => {
  const {
    isMicActive,
    setIsMicActive,
    sendUserSpeech,
    sessionTime,
    finishSimulation,
    isAiSpeaking
  } = useSimulator();

  const [textInput, setTextInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Format Timer SS:MM
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize Speech Recognition Native Web API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTextInput(currentTranscript);
      };

      recognition.onend = () => {
        setIsMicActive(false);
      };

      recognition.onerror = (err) => {
        console.warn('Speech Recognition error:', err);
        setIsMicActive(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  // Toggle Microphone Recording
  const toggleMic = () => {
    if (!speechSupported) {
      alert('Web Speech API is not supported in this browser version. You can use the text input below to practice speaking!');
      return;
    }

    if (isMicActive) {
      recognitionRef.current?.stop();
      setIsMicActive(false);
    } else {
      setTextInput('');
      try {
        recognitionRef.current?.start();
        setIsMicActive(true);
      } catch (e) {
        console.error('Error starting mic:', e);
      }
    }
  };

  // Submit User Speech
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!textInput.trim() || isAiSpeaking) return;

    if (isMicActive) {
      recognitionRef.current?.stop();
      setIsMicActive(false);
    }

    sendUserSpeech(textInput);
    setTextInput('');
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
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
          ) : (
            <span>Click Mic to speak or type your response below.</span>
          )}
        </div>

        {/* End Session Trigger */}
        <button
          className="btn btn-secondary"
          onClick={finishSimulation}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185' }}
        >
          <CheckSquare size={16} />
          <span>Finish & View Report</span>
        </button>

      </div>

      {/* Main Input Form Controls */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        
        {/* Big Mic Button with Active Pulse Animation */}
        <button
          type="button"
          onClick={toggleMic}
          className={`btn ${isMicActive ? 'btn-danger mic-active-pulse' : 'btn-primary'}`}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            flexShrink: 0,
            padding: 0
          }}
          title={isMicActive ? 'Stop Recording' : 'Start Speech Recording'}
        >
          {isMicActive ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {/* Transcribed / Manual Input Text Box */}
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            className="input-field"
            placeholder={isMicActive ? 'Transcribing your speech in real-time...' : 'Type or speak your response here...'}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isAiSpeaking}
            style={{
              paddingRight: '3rem',
              height: '50px',
              fontSize: '0.95rem',
              borderColor: isMicActive ? 'var(--accent-rose)' : 'var(--border-color)'
            }}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!textInput.trim() || isAiSpeaking}
          style={{ height: '52px', padding: '0 1.5rem', opacity: (!textInput.trim() || isAiSpeaking) ? 0.5 : 1 }}
        >
          <Send size={18} />
          <span style={{ display: 'none' }}>Send</span>
        </button>

      </form>
    </div>
  );
};
