import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Send, Clock, Square, Bot, User, Volume2, Sparkles, AlertCircle, Info, Flame, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import { useSimulator, PRESSURE_ROUNDS_CONFIG } from '../../context/SimulatorContext';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { SESSION_ROUNDS } from '../../data/scenarios';
import { Badge } from '../common/Badge';

export const PracticeRoomView = () => {
  const {
    selectedScenario,
    selectedDifficulty,
    isPressureMode,
    isAudienceMode,
    selectedAudiencePersonality,
    presentationTopic,
    currentRound,
    totalRounds,
    roundTimeRemaining,
    transcript: conversationHistory,
    currentTurn,
    sendUserResponse,
    retryLastAiCall,
    apiError,
    finishSession
  } = useSimulator();

  // Web Speech API hook
  const {
    transcript: speechTranscript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupport,
    error: speechError
  } = useSpeechRecognition();

  // Local text state for fallback & manual editing
  const [manualText, setManualText] = useState('');
  const scrollRef = useRef(null);

  // Sync live speech transcript to input box when recording
  useEffect(() => {
    if (isListening && speechTranscript) {
      setManualText(speechTranscript);
    }
  }, [speechTranscript, isListening]);

  // Auto-scroll conversation stream to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, currentTurn, isListening]);

  // Handle Start Speaking
  const handleStartSpeaking = () => {
    setManualText('');
    resetTranscript();
    startListening();
  };

  // Handle Stop Speaking
  const handleStopSpeaking = () => {
    stopListening();
  };

  // Handle Submit Response
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!manualText.trim() || currentTurn !== 'USER') return;

    if (isListening) {
      stopListening();
    }

    sendUserResponse(manualText);
    setManualText('');
    resetTranscript();
  };

  // Round info
  const roundInfo = SESSION_ROUNDS[currentRound - 1] || SESSION_ROUNDS[0];
  const pressureInfo = PRESSURE_ROUNDS_CONFIG[currentRound - 1] || PRESSURE_ROUNDS_CONFIG[0];

  return (
    <div className="container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. Header Bar: Scenario/Mode, Timer & Controls */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                {isPressureMode ? `Pressure Level ${currentRound} of 5` : isAudienceMode ? 'AI Audience Mode' : `Round ${currentRound} / ${totalRounds}`}
              </span>
              <Badge variant={isPressureMode ? 'Advanced' : isAudienceMode ? 'primary' : selectedDifficulty}>
                {isPressureMode ? 'PRESSURE MODE' : isAudienceMode ? 'AI AUDIENCE' : selectedDifficulty}
              </Badge>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isPressureMode
                ? `Current Challenge: ${pressureInfo.title}`
                : isAudienceMode
                ? `Topic: "${presentationTopic}" (${selectedAudiencePersonality.name})`
                : `Scenario: ${selectedScenario.name} (${roundInfo.title})`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Speaking Timer Countdown with aria-live for screen readers */}
            <div
              aria-live="polite"
              aria-label={`Time remaining: ${roundTimeRemaining} seconds`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: roundTimeRemaining <= 10 ? 'rgba(244, 63, 94, 0.25)' : 'var(--bg-secondary)',
                border: roundTimeRemaining <= 10 ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid var(--border-color)',
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: roundTimeRemaining <= 10 ? '#fb7185' : 'var(--text-main)'
              }}
            >
              <Clock size={16} style={{ color: roundTimeRemaining <= 10 ? '#fb7185' : 'var(--primary)' }} />
              <span>{roundTimeRemaining} seconds remaining</span>
            </div>

            {/* End Session Button */}
            <button
              className="btn btn-secondary"
              onClick={finishSession}
              aria-label="End session early"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185' }}
            >
              <Square size={14} />
              <span>End Session</span>
            </button>
          </div>

        </div>

        {/* PRESSURE LEVEL PROGRESS DISPLAY */}
        {isPressureMode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Flame size={14} /> PRESSURE LEVEL:
            </span>

            {[1, 2, 3, 4, 5].map((lvl, index) => {
              const isActive = currentRound === lvl;
              const isPast = currentRound > lvl;
              return (
                <React.Fragment key={lvl}>
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: isActive ? 'var(--accent-rose)' : isPast ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255,255,255,0.05)',
                      color: isActive || isPast ? '#ffffff' : 'var(--text-subtle)',
                      border: isActive ? '2px solid #ffffff' : '1px solid var(--border-color)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {lvl}
                  </div>
                  {index < 4 && <ChevronRight size={14} style={{ color: 'var(--text-subtle)' }} />}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          /* Standard Progress Bar */
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(currentRound / totalRounds) * 100}%`,
                background: 'var(--gradient-brand)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        )}

      </div>

      {/* 2. Turn Indicator Banner with aria-live */}
      <div
        aria-live="polite"
        style={{
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 700,
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
          background: currentTurn === 'USER' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
          border: currentTurn === 'USER' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
          color: currentTurn === 'USER' ? '#34d399' : '#818cf8'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {currentTurn === 'USER' ? <User size={18} /> : <Bot size={18} />}
          <span>
            {currentTurn === 'USER'
              ? isPressureMode
                ? `YOUR TURN - PRESSURE LEVEL ${currentRound} (${roundTimeRemaining}s)`
                : `YOUR TURN TO SPEAK`
              : 'AI IS FORMULATING PROMPT...'}
          </span>
        </div>

        <span style={{ fontSize: '0.78rem', fontWeight: 500, opacity: 0.9 }}>
          {currentTurn === 'USER'
            ? isListening
              ? 'Listening to microphone... Click "Stop Speaking" when finished.'
              : 'Click "Start Speaking" or type your response below.'
            : 'Please listen to the AI response...'}
        </span>
      </div>

      {/* Browser Support & API Error State Notice with Retry */}
      {!browserSupport && (
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={16} />
          <span>Web Speech API is not supported in this browser. You can type your response in the fallback text box below.</span>
        </div>
      )}

      {speechError && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{speechError}</span>
        </div>
      )}

      {apiError && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{apiError}</span>
          </div>
          <button className="btn btn-secondary" onClick={retryLastAiCall} style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>
            <RefreshCw size={13} />
            <span>Retry Request</span>
          </button>
        </div>
      )}

      {/* 3. Conversation & Transcript Stream Area */}
      <div
        className="glass-panel"
        style={{
          height: '380px',
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          background: 'rgba(11, 15, 25, 0.8)'
        }}
      >
        {(conversationHistory || []).map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                alignSelf: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.3rem' }}>
                {isUser ? <User size={13} style={{ color: '#34d399' }} /> : <Bot size={13} style={{ color: '#818cf8' }} />}
                <span style={{ fontWeight: 700, color: isUser ? '#34d399' : '#818cf8' }}>
                  {msg.speakerName}
                </span>
                <span>&bull;</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Box */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isUser ? 'var(--gradient-brand)' : 'var(--bg-secondary)',
                  color: isUser ? '#ffffff' : 'var(--text-main)',
                  border: isUser ? 'none' : '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* AI Replying Loading Spinner Indicator */}
        {currentTurn === 'AI' && conversationHistory.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', alignSelf: 'flex-start', background: 'var(--bg-secondary)', padding: '0.65rem 1rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI is formulating response...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* 4. Speech Input Controls & Textarea */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'rgba(15, 23, 42, 0.95)'
        }}
      >
        {/* Mic Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!isListening ? (
            <button
              className="btn btn-primary"
              onClick={handleStartSpeaking}
              disabled={currentTurn !== 'USER'}
              aria-label="Start speaking recording"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                borderRadius: '9999px',
                opacity: currentTurn !== 'USER' ? 0.5 : 1
              }}
            >
              <Mic size={20} />
              <span>Start Speaking</span>
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={handleStopSpeaking}
              aria-label="Stop speaking recording"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                borderRadius: '9999px'
              }}
            >
              <MicOff size={20} />
              <span>Stop Speaking</span>
            </button>
          )}

          {isListening && (
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-rose)', display: 'inline-block' }} />
              Live Recording ({roundTimeRemaining}s left)...
            </span>
          )}
        </div>

        {/* Live Speech Transcript / Textarea Fallback */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
              <span>
                {isListening ? 'Live Speech Recognition:' : 'Response / Fallback Text Input:'}
              </span>
              <span>{manualText.length} chars</span>
            </label>

            <textarea
              className="input-field"
              rows={3}
              placeholder={
                currentTurn !== 'USER'
                  ? "Waiting for AI turn..."
                  : isListening
                  ? "Transcribing your speech live... Speak now!"
                  : "Click 'Start Speaking' or type your response here..."
              }
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              disabled={currentTurn !== 'USER'}
              aria-label="Speech response text input"
              style={{
                resize: 'none',
                lineHeight: 1.5,
                fontSize: '0.92rem',
                borderColor: isListening ? 'var(--accent-rose)' : 'var(--border-color)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            {manualText.trim() && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setManualText(''); resetTranscript(); }}
                aria-label="Clear speech transcript text"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!manualText.trim() || currentTurn !== 'USER'}
              aria-label="Submit speech response"
              style={{ padding: '0.55rem 1.5rem', opacity: (!manualText.trim() || currentTurn !== 'USER') ? 0.5 : 1 }}
            >
              <Send size={16} />
              <span>Submit Response</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
