import React, { useRef, useEffect, useState } from "react";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const WritingNumbersLevel1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNumber, setSelectedNumber] = useState("0");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    drawNumber();
  }, [selectedNumber]);

  const drawNumber = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 160px 'OpenDyslexic', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillStyle = "white";
    ctx.fillText(selectedNumber, centerX, centerY);

    ctx.strokeStyle = "#3b2a1a";
    ctx.lineWidth = 3;
    ctx.strokeText(selectedNumber, centerX, centerY);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const isInsideWhite =
      pixel[0] === 255 &&
      pixel[1] === 255 &&
      pixel[2] === 255 &&
      pixel[3] === 255;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = isInsideWhite ? "green" : "red";
    ctx.lineWidth = 4;
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

  return (
    <SceneBackground>
 
        <div className="level-container">
          <div className="level-card wide fade-in-up">

            <span className="level-nail level-nail-tl" />
            <span className="level-nail level-nail-tr" />
            <span className="level-nail level-nail-bl" />
            <span className="level-nail level-nail-br" />

            <h1 className="level-title">✏️ Number Writing — Level 1</h1>
            <p className="level-desc">
              Trace the number carefully. Green means correct, red means outside the guide.
            </p>

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
      
    </SceneBackground>
  );
};

export default WritingNumbersLevel1;