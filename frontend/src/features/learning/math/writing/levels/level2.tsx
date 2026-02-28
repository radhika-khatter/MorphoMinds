import { useRef, useState } from "react";
import SceneBackground from "@/components/layout/SceneBackground";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const WritingMathLevel2 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef<number[][][]>([]);

  // 🎯 Sequential Target (0 → 9)
  const [target, setTarget] = useState<number>(0);

  const [resultMessages, setResultMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Drawing Logic
  // -------------------------
  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;

    isDrawing.current = true;
    lastPoint.current = { x, y };

    strokes.current.push([[x, y]]);
  };

  const draw = (e: any) => {
    if (!isDrawing.current || !canvasRef.current || !lastPoint.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;

    strokes.current[strokes.current.length - 1].push([x, y]);

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

  // -------------------------
  // Clear Canvas
  // -------------------------
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current = [];
    setResultMessages([]);
  };

  // -------------------------
  // Next Digit (0 → 9 only)
  // -------------------------
  const nextDigit = () => {
    if (target < 9) {
      setTarget(target + 1);
      clearCanvas();
    } else {
      setResultMessages(["You have completed all digits! 🎉"]);
    }
  };

  // -------------------------
  // Check With Backend
  // -------------------------
  const handleCheck = async () => {
    if (strokes.current.length === 0) {
      setResultMessages(["Please draw something first."]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5010/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: target.toString(),
          strokes: strokes.current,
          canvas_size: 700,
        }),
      });

      const data = await response.json();
      if (data.message) {
  setResultMessages([
    `${data.message} (Confidence: ${data.confidence})`
  ]);
} else {
  setResultMessages(["No response"]);
}
    } catch (error) {
      console.error("Backend error:", error);
      setResultMessages(["Error connecting to backend."]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <SceneBackground>
      <div className="level-container">
        <div className="level-card wide fade-in-up">

          <span className="level-nail level-nail-tl" />
          <span className="level-nail level-nail-tr" />
          <span className="level-nail level-nail-bl" />
          <span className="level-nail level-nail-br" />

          <h1 className="level-title">✏️ Math Writing — Level 2</h1>

          {/* 🎯 Target Display */}
          <div style={{ fontSize: "28px", marginBottom: "20px" }}>
            Write this digit:
            <span style={{ marginLeft: "12px", fontWeight: "bold", fontSize: "42px" }}>
              {target}
            </span>
          </div>

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

              <button
                className="board-btn"
                onClick={handleCheck}
                disabled={loading}
              >
                {loading ? "Checking..." : "Check"}
              </button>

              <button
                className="board-btn"
                onClick={nextDigit}
                disabled={target === 9}
              >
                Next Digit
              </button>
            </div>

            {/* Result Display */}
            {resultMessages.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                {resultMessages.map((msg, index) => (
                  <p key={index}>{msg}</p>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </SceneBackground>
  );
};

export default WritingMathLevel2;