import { useState } from "react";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import "@/components/common/board-content.css";

type Puzzle = {
  word: string;
  letters: string[];
};

const PUZZLES: Puzzle[] = [
  { word: "bat", letters: ["b", "a", "t"] },
  { word: "dog", letters: ["d", "o", "g"] },
  { word: "pen", letters: ["p", "e", "n"] },
];

const SequenceBuilderGame = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const puzzle = PUZZLES[index];

  const handleSelect = (letter: string) => {
    if (selected.includes(letter)) return;
    setSelected([...selected, letter]);
  };

  const isCorrectSoFar = puzzle.word.startsWith(selected.join(""));
  const isComplete = selected.join("") === puzzle.word;

  const handleNext = () => {
    setSelected([]);
    setIndex((prev) => (prev + 1) % PUZZLES.length);
  };

  return (
    <SceneBackground>
      <SignBoard maxWidth="750px">
        <div className="board-section">

          {/* Title */}
          <h1 className="board-title">
            Sequence Builder
          </h1>

          {/* Subtitle */}
          <p className="board-subtitle">
            Tap the letters in the correct order to form the word.
          </p>

          {/* Score */}
          <div className="mb-4 text-center text-sm text-gray-600">
            Score: <strong>{score}</strong>
          </div>

          {/* Selected Letters */}
          <div className="flex justify-center gap-3 mb-6">
            {selected.map((l, i) => (
              <div
                key={i}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-100 text-xl font-bold"
              >
                {l}
              </div>
            ))}
          </div>

          {/* Letter Options */}
          <div className="board-grid">
            {puzzle.letters.map((letter) => (
              <button
                key={letter}
                onClick={() => handleSelect(letter)}
                className={`board-card ${
                  selected.includes(letter)
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="text-4xl font-bold">{letter}</div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          <div className="mt-6 text-center">
            {!isCorrectSoFar && selected.length > 0 && (
              <p className="text-red-600 font-semibold">
                ✖ That order doesn’t look right. Try again.
              </p>
            )}

            {isComplete && (
              <>
                <p className="text-green-600 font-semibold mb-4">
                  ✔ Well done! You formed the word correctly.
                </p>
                <button
                  onClick={() => {
                    setScore(score + 10);
                    handleNext();
                  }}
                  className="px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                >
                  Next Word →
                </button>
              </>
            )}
          </div>

        </div>
      </SignBoard>
    </SceneBackground>
  );
};

export default SequenceBuilderGame;