import React, { useRef, useEffect, useState } from "react";

import SceneBackground from "@/components/layout/SceneBackground";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const WritingNumbersLevel1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState("1");
  const [numberImageData, setNumberImageData] =
    useState<Uint8ClampedArray | null>(null);

  /* ================= DRAW NUMBER ================= */
  useEffect(() => {
    drawNumber();
  }, [selectedNumber]);

  const drawNumber = () => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  canvas.width = 400;
  canvas.height = 350;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 🔥 Dynamic font size (70% of canvas height)
  const fontSize = canvas.height * 0.7;
  ctx.font = `bold ${fontSize}px 'OpenDyslexic', sans-serif`;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.fillStyle = "white";
  ctx.fillText(selectedNumber, centerX, centerY);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 7;
  ctx.setLineDash([]);
  ctx.strokeText(selectedNumber, centerX, centerY);

  setNumberImageData(
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
    if (!isDrawing || !lastPos || !numberImageData) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const idx = (y * canvas.width + x) * 4;
    const isInside =
      numberImageData[idx] === 255 &&
      numberImageData[idx + 1] === 255 &&
      numberImageData[idx + 2] === 255 &&
      numberImageData[idx + 3] === 255;

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
    drawNumber();
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
          <h1 className="level-title">✏️ Number Tracing</h1>
          <p className="level-desc">
            Choose a number and trace it carefully
          </p>

          {/* Picker + Canvas */}
          <div className="level-row">

            {/* Number Picker */}
            <div className="level-picker">
              {numbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedNumber(num)}
                  className={`level-picker-btn ${
                    selectedNumber === num ? "active" : ""
                  }`}
                >
                  {num}
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

export default WritingNumbersLevel1;