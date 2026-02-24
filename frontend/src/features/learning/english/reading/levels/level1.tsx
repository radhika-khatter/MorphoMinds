// src/features/learning/english/reading/ReadingLevel1.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const letterMap: Record<string, { image: string; word: string }> = {
  A: { image: "/src/images/readingEnglish/level1/apple.png", word: "Apple" },
  B: { image: "/src/images/readingEnglish/level1/ball.png", word: "Ball" },
  C: { image: "/src/images/readingEnglish/level1/cat.png", word: "Cat" },
  D: { image: "/src/images/readingEnglish/level1/dog.png", word: "Dog" },
  E: { image: "/src/images/readingEnglish/level1/elephant.png", word: "Elephant" },
  F: { image: "/src/images/readingEnglish/level1/fish.png", word: "Fish" },
  G: { image: "/src/images/readingEnglish/level1/giraffe.png", word: "Giraffe" },
  H: { image: "/src/images/readingEnglish/level1/hen.png", word: "Hen" },
  I: { image: "/src/images/readingEnglish/level1/icecream.png", word: "Ice Cream" },
  J: { image: "/src/images/readingEnglish/level1/jug.png", word: "Jug" },
  K: { image: "/src/images/readingEnglish/level1/kite.png", word: "Kite" },
  L: { image: "/src/images/readingEnglish/level1/lion.png", word: "Lion" },
  M: { image: "/src/images/readingEnglish/level1/monkey.png", word: "Monkey" },
  N: { image: "/src/images/readingEnglish/level1/nest.png", word: "Nest" },
  O: { image: "/src/images/readingEnglish/level1/orange.png", word: "Orange" },
  P: { image: "/src/images/readingEnglish/level1/parrot.png", word: "Parrot" },
  Q: { image: "/src/images/readingEnglish/level1/queen.png", word: "Queen" },
  R: { image: "/src/images/readingEnglish/level1/rabbit.png", word: "Rabbit" },
  S: { image: "/src/images/readingEnglish/level1/sun.png", word: "Sun" },
  T: { image: "/src/images/readingEnglish/level1/tiger.png", word: "Tiger" },
  U: { image: "/src/images/readingEnglish/level1/umbrella.png", word: "Umbrella" },
  V: { image: "/src/images/readingEnglish/level1/violin.png", word: "Violin" },
  W: { image: "/src/images/readingEnglish/level1/watch.png", word: "Watch" },
  X: { image: "/src/images/readingEnglish/level1/xylophone.png", word: "Xylophone" },
  Y: { image: "/src/images/readingEnglish/level1/yak.png", word: "Yak" },
  Z: { image: "/src/images/readingEnglish/level1/zebra.png", word: "Zebra" },
};

const ReadingEnglishLevel1: React.FC = () => {
  const alphabet = Object.keys(letterMap);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ================= SPEECH ================= */
  const speakLetter = (letter: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => speakLetter(alphabet[currentIndex]), 300);
    return () => clearTimeout(t);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < alphabet.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleRepeat = () => speakLetter(alphabet[currentIndex]);

  const currentLetter = alphabet[currentIndex];
  const { image, word } = letterMap[currentLetter];

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

            <h1 className="level-title">✨ Learning Letters — Level 1</h1>
            <p className="level-desc">Listen and identify the letter</p>

            <motion.div
              key={currentLetter}
              className="level-flashcard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* LEFT */}
              <div className="level-flashcard-left">
                <motion.div
                  className="level-letter"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {currentLetter}
                </motion.div>
              </div>

              {/* RIGHT */}
              <div className="level-flashcard-right">
                <motion.img
                  src={image}
                  alt={word}
                  className="level-image"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                />
                <p className="level-word">{word}</p>
              </div>
            </motion.div>

            {/* ACTIONS */}
            <div className="level-actions">
              <button
                className="board-btn"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ⬅️ Previous
              </button>

              <button className="board-btn" onClick={handleRepeat}>
                🔁 Repeat
              </button>

              <button
                className="board-btn"
                onClick={handleNext}
                disabled={currentIndex === alphabet.length - 1}
              >
                Next ➡️
              </button>
            </div>

          </div>
        </div>
      
    </SceneBackground>
  );
};

export default ReadingEnglishLevel1;