import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [browserSupport, setBrowserSupport] = useState(true);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const shouldRestartRef = useRef(false); // Tracks intentional continuous-listening state

  // Check browser support on initial mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupport(false);
    }
  }, []);

  // Build a fresh SpeechRecognition instance with all handlers
  const buildRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.warn('Speech Recognition error:', event.error);
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          setError('Microphone access denied. Please allow microphone access in your browser settings.');
          shouldRestartRef.current = false;
          setIsListening(false);
          break;
        case 'no-speech':
          // Non-fatal — recognition will end and restart via onend
          break;
        case 'audio-capture':
          setError('No microphone found. Please connect a microphone and try again.');
          shouldRestartRef.current = false;
          setIsListening(false);
          break;
        case 'network':
          setError('Network error during speech recognition. Check your connection.');
          shouldRestartRef.current = false;
          setIsListening(false);
          break;
        case 'aborted':
          // User stopped intentionally — not an error
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
          shouldRestartRef.current = false;
          setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Auto-restart keeps continuous listening alive (Chrome stops on silence/timeout)
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Transient error — ignore, next user action will re-init
        }
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  }, []);

  // Start listening — proactively request mic permission first
  const startListening = useCallback(async () => {
    setError(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupport(false);
      setError('Web Speech API is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    // Request explicit mic permission via getUserMedia to trigger the browser prompt
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release immediately — SpeechRecognition manages its own stream
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Click the 🔒 lock icon in your browser address bar and allow the microphone, then refresh.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found on this device.');
      } else {
        setError(`Microphone error: ${err.message}`);
      }
      return;
    }

    // Stop any existing instance before starting fresh
    if (recognitionRef.current) {
      shouldRestartRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
    }

    const recognition = buildRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    shouldRestartRef.current = true;

    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Could not access microphone. Please try again.');
      shouldRestartRef.current = false;
      setIsListening(false);
    }
  }, [buildRecognition]);

  // Stop listening function
  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition:', e);
      }
    }
    setIsListening(false);
  }, []);

  // Reset transcript function
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupport,
    error
  };
};
