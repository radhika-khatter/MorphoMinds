import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import SceneBackground from "@/components/layout/SceneBackground";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

interface Consonant {
  consonant: string;
  roman: string;
  image: string;
}

const consonantImages: Record<string, string> = {
  "क": "/src/images/readingHindi/level2/ka.png",
  "ख": "/src/images/readingHindi/level2/kha.png",
  "ग": "/src/images/readingHindi/level2/ga.png",
  "घ": "/src/images/readingHindi/level2/gha.png",
  "ङ": "/src/images/readingHindi/level2/nga.png",
  "च": "/src/images/readingHindi/level2/cha.png",
  "छ": "/src/images/readingHindi/level2/chha.png",
  "ज": "/src/images/readingHindi/level2/ja.png",
  "झ": "/src/images/readingHindi/level2/jha.png",
  "ञ": "/src/images/readingHindi/level2/nya.png",
  "ट": "/src/images/readingHindi/level2/ta.png",
  "ठ": "/src/images/readingHindi/level2/tha.png",
  "ड": "/src/images/readingHindi/level2/da.png",
  "ढ": "/src/images/readingHindi/level2/dha.png",
  "ण": "/src/images/readingHindi/level2/na.png",
  "त": "/src/images/readingHindi/level2/ta2.png",
  "थ": "/src/images/readingHindi/level2/tha2.png",
  "द": "/src/images/readingHindi/level2/da2.png",
  "ध": "/src/images/readingHindi/level2/dha2.png",
  "न": "/src/images/readingHindi/level2/na2.png",
  "प": "/src/images/readingHindi/level2/pa.png",
  "फ": "/src/images/readingHindi/level2/pha.png",
  "ब": "/src/images/readingHindi/level2/ba.png",
  "भ": "/src/images/readingHindi/level2/bha.png",
  "म": "/src/images/readingHindi/level2/ma.png",
  "य": "/src/images/readingHindi/level2/ya.png",
  "र": "/src/images/readingHindi/level2/ra.png",
  "ल": "/src/images/readingHindi/level2/la.png",
  "व": "/src/images/readingHindi/level2/va.png",
  "श": "/src/images/readingHindi/level2/sha.png",
  "ष": "/src/images/readingHindi/level2/sha2.png",
  "स": "/src/images/readingHindi/level2/sa.png",
  "ह": "/src/images/readingHindi/level2/ha.png",
  "क्ष": "/src/images/readingHindi/level2/ksha.png",
  "त्र": "/src/images/readingHindi/level2/tra.png",
  "ज्ञ": "/src/images/readingHindi/level2/gya.png",
};

const API_BASE = "http://localhost:5002/hindi/reading/level2";

const ReadingHindiLevel2: React.FC = () => {
  const [consonants, setConsonants] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Consonant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD LIST ================= */
  useEffect(() => {
    axios
      .get(`${API_BASE}/consonant/list`)
      .then((res) => {
        const data = res.data.consonants ?? res.data;
        setConsonants(data);
      })
      .catch(() =>
        setError("Consonant list could not be loaded.")
      );
  }, []);

  /* ================= PRONOUNCE ================= */
  const pronounce = async (c: string) => {
    setError("");
    setSelected({
      consonant: c,
      roman: "",
      image: consonantImages[c] || "",
    });

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/consonant/pronounce`,
        { consonant: c }
      );

      if (res.data && res.data.roman) {
  setSelected({
    consonant: res.data.consonant ?? c,
    roman: res.data.roman,
    image: consonantImages[res.data.consonant ?? c] || "",
  });
} else {
  setError("Failed to pronounce.");
}
    } catch {
      setError("Error calling pronunciation API.");
    }
    setLoading(false);
  };

  /* ================= NAV ================= */
  const handleNext = () => {
    if (currentIndex < consonants.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      pronounce(consonants[next]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      pronounce(consonants[prev]);
    }
  };

  const handleRepeat = () => {
    if (consonants.length > 0)
      pronounce(consonants[currentIndex]);
  };

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (consonants.length > 0)
      pronounce(consonants[0]);
  }, [consonants]);

  /* ================= UI ================= */
  return (
    <SceneBackground>
      <div className="level-container">
        <div className="level-card fade-in-up">

          <span className="level-nail level-nail-tl" />
          <span className="level-nail level-nail-tr" />
          <span className="level-nail level-nail-bl" />
          <span className="level-nail level-nail-br" />

          <h1 className="level-title">
            ✨ हिंदी व्यंजन अभ्यास — Level 2
          </h1>
          <p className="level-desc">सुनें और पहचानें:</p>

          <motion.div
            key={selected?.consonant}
            className="level-flashcard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="level-flashcard-left">
              <div className="level-letter">
                {selected?.consonant}
              </div>
            </div>

            <div className="level-flashcard-right">
              {selected?.image && (
                <motion.img
                  src={selected.image}
                  alt={selected.roman}
                  className="level-image"
                />
              )}
              {selected && (
                <p className="level-word">
                  Roman: {selected.roman}
                </p>
              )}
            </div>
          </motion.div>

          <div className="level-actions">
            <button
              className="board-btn"
              onClick={handlePrev}
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
              disabled={currentIndex === consonants.length - 1}
            >
              Next ➡️
            </button>
          </div>

          {loading && <p className="level-desc">🔊 ध्वनि चल रही है...</p>}
          {error && <div className="level-result incorrect">{error}</div>}
        </div>
      </div>
    </SceneBackground>
  );
};

export default ReadingHindiLevel2;