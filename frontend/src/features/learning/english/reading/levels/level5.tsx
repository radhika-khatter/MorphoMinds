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

const ReadingEnglishLevel5: React.FC = () => {
  const [sentence, setSentence] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isListening, setIsListening] = useState(false);

  /* ================= FETCH SENTENCE ================= */
  const fetchSentence = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5002/english/reading/get-sentence"
      );
      setSentence(res.data.sentence);
      setFeedback("");
    } catch (err) {
      console.error(err);
      setFeedback("❌ Failed to fetch sentence. Please try again.");
    }
  };

  /* ================= SPEECH RECOGNITION ================= */
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFeedback("❌ Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);
    setFeedback("🎤 Listening...");

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript.trim();

      if (spokenText.toLowerCase() === sentence.trim().toLowerCase()) {
        setFeedback("✅ Correct! Well done.");
      } else {
        setFeedback(`❌ You said: "${spokenText}"`);
      }

      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = () => {
      setFeedback("⚠️ Speech recognition failed. Try again.");
      setIsListening(false);
    };
  };

  /* ================= TEXT TO SPEECH ================= */
  const listenSentence = () => {
    if (!sentence) return;
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    fetchSentence();
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
              🧠 Reading Practice — Level 5
            </h1>
            <p className="level-desc">
              Listen to the sentence or read it aloud yourself.
            </p>

            {/* Sentence */}
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.6,
                margin: "20px 0",
              }}
            >
              {sentence || "Loading..."}
            </div>

            {/* Actions */}
            <div className="level-actions">
              <button
                className="board-btn"
                onClick={listenSentence}
                disabled={!sentence}
              >
                🔊 Listen
              </button>

              <button
                className="board-btn"
                onClick={startListening}
                disabled={isListening}
              >
                🎤 {isListening ? "Listening..." : "Try Yourself"}
              </button>

              <button
                className="board-btn"
                onClick={fetchSentence}
              >
                ➡️ Next Sentence
              </button>
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`level-result ${
                  feedback.includes("✅") ? "correct" : "incorrect"
                }`}
              >
                {feedback}
              </div>
            )}
          </div>
        </div>
      
    </SceneBackground>
  );
};

export default ReadingEnglishLevel5;