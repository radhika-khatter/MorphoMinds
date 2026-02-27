import { useEffect, useState } from "react";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import "@/components/common/board-content.css";

type Question = {
  sequence: string[];
};

const QUESTIONS: Question[] = [
  { sequence: ["b", "d", "p"] },
  { sequence: ["q", "p", "b"] },
  { sequence: ["d", "b", "q"] },
];

const DISPLAY_TIME = 2000; // 2 seconds

const SequenceRecallGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSequence, setShowSequence] = useState(true);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentQuestion = QUESTIONS[currentIndex];

  /* =========================
     Utility: Shuffle safely
     ========================= */
  const shuffleArray = (arr: string[]) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  /* =========================
     Start New Round
     ========================= */
  useEffect(() => {
    setShowSequence(true);
    setUserAnswer([]);
    setFeedback(null);

    // Shuffle only once per round
    setShuffledOptions(shuffleArray(currentQuestion.sequence));

    const timer = setTimeout(() => {
      setShowSequence(false);
    }, DISPLAY_TIME);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  /* =========================
     Compare Arrays Safely
     ========================= */
  const isSameSequence = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  /* =========================
     Handle Letter Click
     ========================= */
  const handleSelect = (letter: string) => {
    if (showSequence || feedback) return;

    const updatedAnswer = [...userAnswer, letter];
    setUserAnswer(updatedAnswer);

    if (updatedAnswer.length === currentQuestion.sequence.length) {
      const correct = isSameSequence(
        updatedAnswer,
        currentQuestion.sequence
      );

      if (correct) {
        setScore((prev) => prev + 15);
        setFeedback("correct");
      } else {
        setFeedback("wrong");
      }

      // Move to next question after delay
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % QUESTIONS.length);
      }, 1200);
    }
  };

  return (
    <SceneBackground>
      <SignBoard maxWidth="700px">
        <div className="board-section">

          {/* Title */}
          <h1 className="board-title">
            Sequence Recall
          </h1>

          <p className="board-subtitle">
            Remember the order. Recreate it correctly after it disappears.
          </p>

          {/* Score */}
          <div className="mb-4 text-center text-sm text-gray-600">
            Score: <strong>{score}</strong>
          </div>

          {/* Display Sequence */}
          <div className="text-center mb-6">
            {showSequence ? (
              <div className="text-5xl font-bold tracking-widest">
                {currentQuestion.sequence.join(" → ")}
              </div>
            ) : (
              <div className="text-gray-500 text-lg">
                Recreate the sequence below
              </div>
            )}
          </div>

          {/* Options */}
          {!showSequence && (
            <div className="board-grid">
              {shuffledOptions.map((letter, idx) => (
                <button
                  key={idx}
                  className="board-card"
                  onClick={() => handleSelect(letter)}
                  disabled={!!feedback}
                >
                  <div className="text-4xl font-bold">
                    {letter}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* User Answer */}
          {!showSequence && (
            <div className="mt-6 text-center text-lg">
              Your Answer:{" "}
              <strong>
                {userAnswer.join(" → ")}
              </strong>
            </div>
          )}

          {/* Feedback */}
          {feedback === "correct" && (
            <div className="mt-6 text-center text-green-600 font-semibold">
              ✔ Correct sequence! Excellent memory.
            </div>
          )}

          {feedback === "wrong" && (
            <div className="mt-6 text-center text-red-600 font-semibold">
              ✖ That order was incorrect. Stay focused!
            </div>
          )}

        </div>
      </SignBoard>
    </SceneBackground>
  );
};

export default SequenceRecallGame;