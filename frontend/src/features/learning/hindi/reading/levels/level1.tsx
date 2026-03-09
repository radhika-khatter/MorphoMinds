import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import SceneBackground from "@/components/layout/SceneBackground";


import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

interface Vowel {
  vowel: string;
  roman: string;
  image: string;
}

const vowelImages: Record<string, string> = {
  "अ": "/src/images/readingHindi/level1/a.png",
  "आ": "/src/images/readingHindi/level1/aa.png",
  "इ": "/src/images/readingHindi/level1/i.png",
  "ई": "/src/images/readingHindi/level1/ee.png",
  "उ": "/src/images/readingHindi/level1/u.png",
  "ऊ": "/src/images/readingHindi/level1/oo.png",
  "ऋ": "/src/images/readingHindi/level1/ri.png",
  "ए": "/src/images/readingHindi/level1/e.png",
  "ऐ": "/src/images/readingHindi/level1/ai.png",
  "ओ": "/src/images/readingHindi/level1/o.png",
  "औ": "/src/images/readingHindi/level1/au.png",
  "अं": "/src/images/readingHindi/level1/am.png",
  "अः": "/src/images/readingHindi/level1/ah.png",
};

const ReadingHindiLevel1: React.FC = () => {
  const [vowels, setVowels] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVowel, setSelectedVowel] = useState<Vowel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD VOWELS ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5002/hindi/reading/level1/list")
      .then((res) => setVowels(res.data.vowels))
      .catch(() => setError("Vowels list could not be loaded."));
  }, []);

  /* ================= PRONOUNCE ================= */
  const pronounceVowel = async (vowel: string) => {
    setError("");
    setSelectedVowel({
      vowel,
      roman: "",
      image: vowelImages[vowel] || "",
    });

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5002/hindi/reading/level1/pronounce",
        { vowel }
      );
      if (res.data.success) {
        setSelectedVowel((p) =>
          p ? { ...p, roman: res.data.roman } : p
        );
      } else {
        setError("Failed to pronounce.");
      }
    } catch {
      setError("Error calling pronunciation API.");
    }
    setLoading(false);
  };

  /* ================= NAVIGATION ================= */
  const handleNext = () => {
    if (currentIndex < vowels.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      pronounceVowel(vowels[next]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      pronounceVowel(vowels[prev]);
    }
  };

  const handleRepeat = () => {
    if (vowels.length > 0) pronounceVowel(vowels[currentIndex]);
  };

  /* ================= AUTOPLAY FIRST ================= */
  useEffect(() => {
    if (vowels.length > 0) pronounceVowel(vowels[0]);
  }, [vowels]);

  /* ================= UI ================= */
  return (
     <SceneBackground>
      <div className="level-container">
        <div className="level-card fade-in-up">
          <span className="level-nail level-nail-tl" /><span className="level-nail level-nail-tr" />
          <span className="level-nail level-nail-bl" /><span className="level-nail level-nail-br" />

          <h1 className="level-title">✨ हिंदी स्वर अभ्यास — Level 1</h1>
          <p className="level-desc">सुनें और पहचानें:</p>

          <motion.div key={selectedVowel?.vowel} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="level-flashcard">
            <div className="level-flashcard-left">
              <motion.div className="level-letter">{selectedVowel?.vowel}</motion.div>
            </div>
            <div className="level-flashcard-right">
              {selectedVowel?.image && (
                <motion.img src={selectedVowel.image} alt={selectedVowel.roman} className="level-image"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} />
              )}
              {selectedVowel && <p className="level-word">Roman: {selectedVowel.roman}</p>}
            </div>
          </motion.div>

          <div className="level-actions" style={{ marginTop: "16px" }}>
            <button className="board-btn" onClick={handlePrevious} disabled={currentIndex === 0}>⬅️ Previous</button>
            <button className="board-btn" onClick={handleRepeat}>🔁 Repeat</button>
            <button className="board-btn" onClick={handleNext} disabled={currentIndex === vowels.length - 1}>Next ➡️</button>
          </div>

          {loading && <p className="level-desc" style={{ marginTop: "8px" }}>🔊 ध्वनि चल रही है...</p>}
          {error && <div className="level-result incorrect">{error}</div>}
        </div>
      </div>
    </SceneBackground>
  );
};

export default ReadingHindiLevel1;