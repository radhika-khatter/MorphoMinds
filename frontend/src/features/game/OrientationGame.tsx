import { useState } from "react";
import { useParams } from "react-router-dom";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import "@/components/common/board-content.css";

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

// Simple question set (can expand later)
const QUESTIONS = [
  {
    target: "b",
    options: ["b", "d", "p", "q"],
    correct: "b",
  },
  {
    target: "d",
    options: ["b", "d", "p", "q"],
    correct: "d",
  },
];

const OrientationGame = () => {
  const { subject } = useParams<{ subject: string }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentQuestion = QUESTIONS[currentIndex];

  const handleSelect = (option: string) => {
    setSelected(option);

    if (option === currentQuestion.correct) {
      setScore((prev) => prev + 10);

      setTimeout(() => {
        setSelected(null);
        setCurrentIndex((prev) => (prev + 1) % QUESTIONS.length);
      }, 800);
    }
  };

  const getOptionClass = (option: string) => {
    if (!selected) return "board-card";

    if (option === currentQuestion.correct) {
      return "board-card border-2 border-green-500 bg-green-50";
    }

    if (option === selected) {
      return "board-card border-2 border-red-500 bg-red-50";
    }

    return "board-card opacity-50";
  };

  return (
    <SceneBackground>
      <SignBoard maxWidth="700px">
        <div className="board-section">

          {/* Title */}
          <h1 className="board-title">
            Orientation Practice
          </h1>

          <p className="board-subtitle">
            Choose the correct letter. Focus on shape and direction.
          </p>

          {/* Score */}
          <div className="mb-4 text-center text-sm text-gray-600">
            Score: <strong>{score}</strong>
          </div>

          {/* Target Letter */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold">
              {currentQuestion.target}
            </div>
            <p className="text-gray-500 mt-2">
              Find the same letter below
            </p>
          </div>

          {/* Options */}
          <div className="board-grid">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt}
                className={getOptionClass(opt)}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
              >
                <div className="text-4xl font-bold">{opt}</div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {selected && (
            <div className="mt-6 text-center">
              {selected === currentQuestion.correct ? (
                <p className="text-green-600 font-semibold">
                  ✔ Correct! Great observation.
                </p>
              ) : (
                <p className="text-red-600 font-semibold">
                  ✖ This one was mirrored. Try again.
                </p>
              )}
            </div>
          )}

        </div>
      </SignBoard>
    </SceneBackground>
  );
};

export default OrientationGame;