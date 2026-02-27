import { useState } from "react";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import "@/components/common/board-content.css";

type Question = {
  sound: string;        // what is spoken
  options: string[];   // choices shown
  correct: string;     // correct answer
};

// Simple starter dataset (extend later)
const QUESTIONS: Question[] = [
  {
    sound: "b",
    options: ["b", "d", "p", "g"],
    correct: "b",
  },
  {
    sound: "d",
    options: ["b", "d", "p", "q"],
    correct: "d",
  },
];

const SoundMatchGame = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const current = QUESTIONS[index];

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(current.sound);
    utterance.rate = 0.7; // slower for dyslexic pacing
    speechSynthesis.speak(utterance);
  };

  const handleSelect = (option: string) => {
    setSelected(option);

    if (option === current.correct) {
      setScore((prev) => prev + 10);

      setTimeout(() => {
        setSelected(null);
        setIndex((prev) => (prev + 1) % QUESTIONS.length);
      }, 900);
    }
  };

  const getCardClass = (option: string) => {
    if (!selected) return "board-card";

    if (option === current.correct) {
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
            Sound Match
          </h1>

          {/* Subtitle */}
          <p className="board-subtitle">
            Listen carefully and choose the matching letter.
          </p>

          {/* Score */}
          <div className="mb-4 text-center text-sm text-gray-600">
            Score: <strong>{score}</strong>
          </div>

          {/* Sound Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={playSound}
              className="px-6 py-3 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
            >
              🔊 Play Sound
            </button>
          </div>

          {/* Options */}
          <div className="board-grid">
            {current.options.map((opt) => (
              <button
                key={opt}
                className={getCardClass(opt)}
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
              {selected === current.correct ? (
                <p className="text-green-600 font-semibold">
                  ✔ Correct! You matched the sound.
                </p>
              ) : (
                <p className="text-red-600 font-semibold">
                  ✖ Try again. Listen carefully to the sound.
                </p>
              )}
            </div>
          )}

        </div>
      </SignBoard>
    </SceneBackground>
  );
};

export default SoundMatchGame;