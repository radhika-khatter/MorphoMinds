import React, { useRef, useEffect, useState } from "react";

import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const consonants = [
  "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "अं", "अः",
  "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", "ण",
  "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल",
  "व", "श", "ष", "स", "ह",
];

const WritingHindiConsonants = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedLetter, setSelectedLetter] = useState("क");
  const [letterImageData, setLetterImageData] =
    useState<Uint8ClampedArray | null>(null);

  useEffect(() => {
    drawLetter();
  }, [selectedLetter]);

  /* ================= DRAW LETTER ================= */
  const drawLetter = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = 300;
    canvas.height = 250;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 130px 'Noto Sans Devanagari', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "white";
    ctx.fillText(selectedLetter, 150, 125);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.strokeText(selectedLetter, 150, 125);

    setLetterImageData(
      ctx.getImageData(0, 0, canvas.width, canvas.height).data
    );
  };

  /* ================= DRAWING ================= */
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setLastPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos || !letterImageData) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const idx = (y * canvas.width + x) * 4;
    const isInside =
      letterImageData[idx] === 255 &&
      letterImageData[idx + 1] === 255 &&
      letterImageData[idx + 2] === 255 &&
      letterImageData[idx + 3] === 255;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = isInside ? "green" : "red";
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.stroke();

    setLastPos({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const clearCanvas = () => {
    drawLetter();
  };

  /* ================= UI ================= */
  return (
    <SceneBackground>
      
        <div className="level-container">
          <div className="level-card wide fade-in-up">

            {/* Nails */}
            <span className="level-nail level-nail-tl" />
            <span className="level-nail level-nail-tr" />
            <span className="level-nail level-nail-bl" />
            <span className="level-nail level-nail-br" />

            {/* Title */}
            <h1 className="level-title">✏️ हिंदी अक्षर ट्रेसिंग</h1>
            <p className="level-desc">
              अक्षर चुनें और सही रास्ते पर लिखने का अभ्यास करें
            </p>

            {/* Picker + Canvas */}
            <div className="level-row">
              {/* Letter Picker */}
              <div className="level-picker">
                {consonants.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLetter(l)}
                    className={`level-picker-btn ${
                      selectedLetter === l ? "active" : ""
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Canvas */}
              <div className="level-canvas-wrap">
                <canvas
                  ref={canvasRef}
                  className="level-canvas"
                  width={300}
                  height={250}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />

                <div className="level-actions">
                  <button className="board-btn" onClick={clearCanvas}>
                    Clear Canvas
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      
    </SceneBackground>
  );
};

export default WritingHindiConsonants;