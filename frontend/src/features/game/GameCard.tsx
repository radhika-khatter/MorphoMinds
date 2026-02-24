import React, { useState } from "react";
import { useParams } from "react-router-dom";

import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const GameCard: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();

  // Default examples
  const targetLetter = subject === "english" ? "b" : "ब";
  const options = subject === "english" ? ["b", "d"] : ["ब", "व"];

  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);

  const handleSelect = (letter: string) => {
    if (letter === targetLetter) {
      setPoints((prev) => prev + 10);
      setMessage("🎉 Correct! +10 points");
    } else {
      setMessage(`❌ This is "${letter}". Try again.`);
    }
  };

  return (
    <SceneBackground>
      
        <div className="level-container">
          <div className="level-card fade-in-up">

            {/* Nails */}
            <span className="level-nail level-nail-tl" />
            <span className="level-nail level-nail-tr" />
            <span className="level-nail level-nail-bl" />
            <span className="level-nail level-nail-br" />

            <h1 className="level-title">🎮 Practice Game</h1>
            <p className="level-desc">
              Choose the correct letter
            </p>

            {/* Target Letter */}
            <div style={{ textAlign: "center", margin: "24px 0" }}>
              <div className="level-letter">{targetLetter}</div>
            </div>

            {/* Options */}
            <div className="board-grid">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="board-btn"
                  style={{ fontSize: "2.5rem", padding: "18px 0" }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {message && (
              <div
                className={`level-result ${
                  message.includes("Correct") ? "correct" : "incorrect"
                }`}
              >
                {message}
              </div>
            )}

            {/* Points */}
            <p
              className="board-subtitle"
              style={{ marginTop: "12px", fontWeight: 700 }}
            >
              ⭐ Points: {points}
            </p>

          </div>
        </div>
      
    </SceneBackground>
  );
};

export default GameCard;