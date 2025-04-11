import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

// Web Speech API typings
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ReadingLevel1 = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [recognizedLetter, setRecognizedLetter] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition: ISpeechRecognition = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setIsProcessing(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim().toUpperCase();
      const firstChar = transcript.charAt(0);

      setRecognizedLetter(firstChar);
      setIsListening(false);
      setIsProcessing(false);

      if (firstChar === selectedLetter) {
        setFeedback("✅ Correct!");
      } else {
        setFeedback(`❌ You said "${firstChar}". Try again.`);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      setIsProcessing(false);
      setFeedback(`⚠️ Error: ${event.error}`);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!recognizedLetter && !feedback) {
        setFeedback("⚠️ No speech detected. Please try again.");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [selectedLetter]);

  const startListening = () => {
    if (!recognitionRef.current || !selectedLetter) return;

    setFeedback(null);
    setRecognizedLetter(null);
    setIsProcessing(true);

    try {
      recognitionRef.current.start();

      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          recognitionRef.current?.stop();
          setIsListening(false);
          setIsProcessing(false);
          setFeedback("⚠️ Took too long. Please try again.");
        }
      }, 5000);
    } catch (error) {
      setIsProcessing(false);
      setFeedback("⚠️ Error starting speech recognition. Please try again.");
    }
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    setRecognizedLetter(null);
    setFeedback(null);
    setIsListening(false);
    setIsProcessing(false);

    if (recognitionRef.current) recognitionRef.current.abort();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Reading Practice - Level 1 (Letters)
      </h1>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`px-4 py-2 rounded border shadow transition ${
              selectedLetter === letter
                ? "bg-blue-200 border-blue-500"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {selectedLetter && (
        <div className="text-center mt-8">
          <p className="text-2xl mb-4">Say this letter:</p>
          <div className="text-6xl font-bold mb-4 text-purple-600">
            {selectedLetter}
          </div>

          <button
            onClick={startListening}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mx-auto"
            disabled={isListening || isProcessing}
          >
            {isListening ? (
              <>
                <MicOff className="animate-pulse" />
                Listening...
              </>
            ) : isProcessing ? (
              <>
                <Loader2 className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Mic />
                Start Speaking
              </>
            )}
          </button>

          {feedback && (
            <div className="mt-6 text-xl font-semibold text-center text-gray-800 dark:text-white">
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingLevel1;

