import React, { useEffect, useState } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ReadingLevel2 = () => {
  const [word, setWord] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');

  const fetchWord = async () => {
    try {
      const res = await axios.get('http://localhost:5000/get-word?level=2');
      setWord(res.data.word);
      setResult('');
    } catch (err) {
      console.error('Error fetching word:', err);
    }
  };

  const handleSpeech = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
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

    recognition.onresult = async (event: any) => {
      clearTimeout(timeoutId);
      const spoken = event.results[0][0].transcript.toLowerCase();
      console.log('User said:', spoken);

      try {
        const res = await axios.post('http://localhost:5000/check-word', {
          expected_word: word,
          spoken_word: spoken,
        });
        setResult(res.data.result);
      } catch (err) {
        console.error('Error checking word:', err);
        setResult('❌ Error processing speech.');
      }

      setIsListening(false);
    };

    recognition.onerror = (e: any) => {
      clearTimeout(timeoutId);
      console.error('Speech error:', e);
      setResult('❌ Speech recognition failed.');
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        setResult('⚠️ No speech detected. Try again.');
        setIsListening(false);
      }
    };
  };

  const handleTextToSpeech = async () => {
    try {
      const res = await axios.post(
        'https://api.magicapi.dev/api/v1/sarvam/ai-models/text-to-speech',
        {
          
          inputs: [word],
          target_language_code: 'hi-IN',
          speaker: 'meera',
          pitch: 0,
          pace: 1,
          loudness: 1,
          speech_sample_rate: 16000,
          enable_preprocessing: true,
          model: 'bulbul:v1',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-magicapi-key': 'cm9dcve2v0009l2047m9kothl', // 🔑 Replace this with your actual key
            accept: 'application/json',
          },
          responseType: 'blob', // to get audio file
        }
      );

      const audioBlob = new Blob([res.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error('Error with Text-to-Speech:', err);
      setResult('❌ Error generating speech.');
    }
  };

  useEffect(() => {
    fetchWord();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-white p-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-6">Reading Practice - Level 2</h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <p className="text-lg text-gray-700 mb-4">🔠 Read the word aloud:</p>
        <div className="text-5xl font-extrabold text-yellow-700 mb-6 tracking-wider">
          {word || '...'}
        </div>

        <button
          onClick={handleSpeech}
          disabled={isListening}
          className={`px-6 py-2 rounded-full text-white font-semibold transition-all duration-200 ${
            isListening ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
        >
          🎤 {isListening ? 'Listening...' : 'Start Speaking'}
        </button>

        {result && (
          <p
            className={`mt-4 text-lg font-medium ${
              result.includes('✅')
                ? 'text-green-600'
                : result.includes('❌')
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {result}
          </p>
        )}

        <button
          onClick={fetchWord}
          className="mt-4 bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-full transition-all"
        >
          🔁 New Word
        </button>

        <button
          onClick={handleTextToSpeech}
          className="mt-4 bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-full transition-all"
        >
          🔊 Listen to Word
        </button>
      </div>
    </div>
  );
};

export default ReadingLevel2;
