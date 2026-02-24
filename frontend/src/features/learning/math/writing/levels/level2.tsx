import { useRef } from "react";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const WritingMathLevel2 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

    isDrawing.current = true;
    lastPoint.current = { x, y };
  };

  const draw = (e: any) => {
    if (!isDrawing.current || !canvasRef.current || !lastPoint.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#2a1a0a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();

    lastPoint.current = { x, y };
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <SceneBackground>
    
        <div className="level-container">
          <div className="level-card wide fade-in-up">

            {/* Nails */}
            <span className="level-nail level-nail-tl" />
            <span className="level-nail level-nail-tr" />
            <span className="level-nail level-nail-bl" />
            <span className="level-nail level-nail-br" />

            <h1 className="level-title">✏️ Math Writing — Level 2</h1>
            <p className="level-desc">
              Freely practice writing numbers, symbols, or full math expressions
              like <strong>12 + 45 = 57</strong>.
            </p>

            {/* Canvas */}
            <div className="level-canvas-wrap">
              <canvas
                ref={canvasRef}
                width={700}
                height={400}
                className="level-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
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

export default WritingMathLevel2;