import React, { useState, useEffect, useCallback } from "react";

import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const alphabet: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ReadingEnglishLevel2: React.FC = () => {
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);

  /* ================= SPEECH ================= */
  const speakLetter = (letter: string) => {
    if ("speechSynthesis" in window && letter) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  /* ================= QUIZ ================= */
  const generateNewQuestion = useCallback(() => {
    const correct = alphabet[Math.floor(Math.random() * alphabet.length)];
    setCorrectAnswer(correct);
    setResult("");
    setIsAnswered(false);

    const distractors: string[] = [];
    while (distractors.length < 3) {
      const r = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (r !== correct && !distractors.includes(r)) distractors.push(r);
    }

    setOptions([...distractors, correct].sort(() => Math.random() - 0.5));
    setTimeout(() => speakLetter(correct), 150);
  }, []);

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  const handleAnswer = (selected: string) => {
    if (isAnswered) return;

    setIsAnswered(true);

    if (selected === correctAnswer) {
      setResult("✅ Correct! Moving to the next letter...");
      setTimeout(() => generateNewQuestion(), 1500);
    } else {
      setResult(`❌ Incorrect. The correct answer was "${correctAnswer}".`);
    }
  };

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

            <h1 className="level-title">🔊 Letter Quiz — Level 2</h1>
            <p className="level-desc">
              Listen carefully and choose the correct letter.
            </p>

            {/* Speaker */}
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <button
                className="board-btn"
                onClick={() => speakLetter(correctAnswer!)}
                disabled={isAnswered || !correctAnswer}
                style={{
                  fontSize: "3rem",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  padding: 0,
                }}
              >
                🔊
              </button>
            </div>

            {/* Options */}
            <div className="board-grid">
              {options.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleAnswer(letter)}
                  disabled={isAnswered}
                  className="board-btn"
                  style={{ fontSize: "2rem", padding: "18px 0" }}
                >
                  {letter}
                </button>
              ))}
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

export default ReadingEnglishLevel2;