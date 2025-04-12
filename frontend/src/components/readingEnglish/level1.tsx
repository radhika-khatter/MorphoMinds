import React, { useEffect, useState } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ReadingLevel1 = () => {
  const [word, setWord] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');

  const fetchWord = async () => {
    try {
      const res = await axios.get('http://localhost:5000/get-word?level=1');
      setWord(res.data.word);
      setResult('');
    } catch (err) {
      console.error('Error fetching word:', err);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setResult('🎤 Listening...');

    recognition.start();

    const timeoutId = setTimeout(() => {
      recognition.stop();
      setResult('⚠️ Timeout. Please try again.');
      setIsListening(false);
    }, 7000);

    recognition.onresult = async (event) => {
      clearTimeout(timeoutId);
      const spoken = event.results[0][0].transcript.toLowerCase().trim();
      const correct = spoken === word.toLowerCase().trim();
      setResult(correct ? '✅ Correct!' : `❌ Incorrect. You said: "${spoken}"`);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      clearTimeout(timeoutId);
      console.error('Speech recognition error', event.error);
      setResult('❌ Error during recognition');
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        setResult('⚠️ No speech detected. Try again.');
        setIsListening(false);
      }
    };
  };

  useEffect(() => {
    fetchWord();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 font-dyslexic">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 font-dyslexic">Reading Practice - Level 1</h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center space-y-4 font-dyslexic">
        <p className="text-lg text-gray-700 font-dyslexic ">🔊 Read the letter aloud:</p>

        <div className="text-6xl font-extrabold text-blue-600 tracking-wider font-dyslexic">
          {word || '...'}
        </div>

        <button
          onClick={startListening}
          disabled={isListening}
          className={`w-full px-6 py-2 rounded-full font-semibold text-white transition-all duration-200 font-dyslexic ${
            isListening ? 'bg-yellow-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          🎤 {isListening ? 'Listening...' : 'Start Speaking'}
        </button>

        {result && (
          <p
            className={`text-lg font-medium rounded-xl p-3 w-full ${
              result.includes('✅') ? 'text-green-600 bg-green-50' :
              result.includes('❌') ? 'text-red-600 bg-red-50' :
              'text-yellow-700 bg-yellow-100'
            }`}
          >
            {result}
          </p>
        )}

        <button
          onClick={fetchWord}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-all"
        >
          🔁 Get New Letter
        </button>
      </div>
    </div>
  );
};

export default ReadingLevel1;
