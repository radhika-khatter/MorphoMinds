import React, { useEffect, useState } from "react";
import axios from "axios";

import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ReadingEnglishLevel4 = () => {
  const [word, setWord] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState("");

  /* ================= FETCH LONG WORD ================= */
  const fetchWord = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5002/english/reading/get-word?level=4"
      );
      setWord(res.data.word);
      setResult("");
    } catch (err) {
      console.error(err);
      setResult("❌ Failed to fetch word. Please try again.");
    }
  };

  /* ================= SPEECH RECOGNITION ================= */
  const handleSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setResult("❌ Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    setIsListening(true);
    setResult("🎤 Listening...");

    recognition.start();

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript
        .toLowerCase()
        .trim();

      if (spoken === word.toLowerCase()) {
        setResult("✅ Correct! Excellent pronunciation.");
      } else {
        setResult(`❌ You said "${spoken}". Try again.`);
      }

      recognition.stop();
      setIsListening(false);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
      setResult((prev) =>
        prev.includes("Listening")
          ? "❌ No speech detected. Please try again."
          : prev
      );
    };

    recognition.onerror = () => {
      setResult("❌ Speech recognition failed. Try again.");
      setIsListening(false);
    };
  };

  /* ================= TEXT TO SPEECH ================= */
  const handleTextToSpeech = () => {
    if (!word) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    fetchWord();
  }, []);

  /* ================= UI ================= */
  return (
    <SceneBackground>
      
        <div className="level-container">
          <div className="level-card fade-in-up">

            {/* Nails */}
            <span className="level-nail level-nail-tl" />
            <span className="level-nail level-nail-tr" />
            <span className="level-nail level-nail-bl" />
            <span className="level-nail level-nail-br" />

            <h1 className="level-title">
              📖 Reading Practice — Level 4
            </h1>
            <p className="level-desc">
              Read the long word aloud clearly and carefully.
            </p>

            {/* Word */}
            <div
              style={{
                textAlign: "center",
                fontSize: "3rem",
                fontWeight: 800,
                margin: "22px 0",
                wordBreak: "break-word",
              }}
            >
              {word || "..."}
            </div>

            {/* Actions */}
            <div className="level-actions">
              <button
                className="board-btn"
                onClick={handleSpeech}
                disabled={isListening}
              >
                🎤 {isListening ? "Listening..." : "Speak"}
              </button>

              <button
                className="board-btn"
                onClick={handleTextToSpeech}
                disabled={!word}
              >
                🔊 Listen
              </button>

              <button
                className="board-btn"
                onClick={fetchWord}
              >
                🔁 New Word
              </button>
            </div>

            {/* Result */}
            {result && (
              <div
                className={`level-result ${
                  result.includes("✅") ? "correct" : "incorrect"
                }`}
              >
                {result}
              </div>
            )}
          </div>
        </div>
     
    </SceneBackground>
  );
};

export default ReadingEnglishLevel4;