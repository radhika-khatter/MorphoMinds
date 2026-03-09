import { useEffect, useRef, useState } from "react";
import SceneBackground from "@/components/layout/SceneBackground";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const LETTERS = ["b", "d", "p", "q"];

export default function WritingEnglishLevel2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<any>(null);

  const [letterIndex, setLetterIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [strokes, setStrokes] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const currentLetter = LETTERS[letterIndex];

  /* ===============================
     PERFECT CANVAS SETUP
     =============================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 320;

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";
    ctx.imageSmoothingEnabled = true;
  }, []);

  /* ===============================
     POSITION HELPER
     =============================== */
  const getPos = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  /* ===============================
     DRAWING
     =============================== */
  const startDraw = (e: any) => {
    if (isChecking) return;

    drawingRef.current = true;

    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);

    const stroke = { points: [pos] };
    currentStrokeRef.current = stroke;
    setStrokes((prev) => [...prev, stroke]);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: any) => {
    if (!drawingRef.current || isChecking) return;

    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    currentStrokeRef.current.points.push(pos);
  };

  const stopDraw = () => {
    drawingRef.current = false;
    currentStrokeRef.current = null;
  };

  /* ===============================
     CLEAR CANVAS
     =============================== */
  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
  };

  /* ===============================
     EXPORT FOR ML
     =============================== */
  const export28x28 = () => {
    const small = document.createElement("canvas");
    small.width = 28;
    small.height = 28;

    const sctx = small.getContext("2d")!;
    sctx.fillStyle = "white";
    sctx.fillRect(0, 0, 28, 28);
    sctx.drawImage(canvasRef.current!, 0, 0, 28, 28);

    return small.toDataURL("image/png");
  };

  /* ===============================
     SUBMIT
     =============================== */
  const submitDrawing = async () => {
    if (isChecking) return;

    try {
      setIsChecking(true);

      const payload = {
        image: export28x28(),
        strokes,
        letter_hint: currentLetter,
      };

      const res = await fetch("http://localhost:8001/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setFeedback(result.message);

      if (result.status === "correct") {
        // 👇 show success clearly before switching
        setTimeout(() => {
          setFeedback("");
          setLetterIndex((i) => (i + 1) % LETTERS.length);
          clearCanvas();
          setIsChecking(false);
        }, 2000); // 2 seconds visibility
      } else {
        setIsChecking(false);
      }
    } catch (err) {
      console.error(err);
      setFeedback("❌ Server error — check backend");
      setIsChecking(false);
    }
  };

  /* ===============================
     UI
     =============================== */
  return (
    <SceneBackground>
      <div className="level-container">
        <div className="level-card fade-in-up">

          <span className="level-nail level-nail-tl" />
          <span className="level-nail level-nail-tr" />
          <span className="level-nail level-nail-bl" />
          <span className="level-nail level-nail-br" />

          <h1 className="level-title">
            ✍️ Mirror Letter Practice — Level 3
          </h1>

          <p className="level-desc">
            Carefully write the letter shown below. Avoid mirror confusion!
          </p>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div className="level-letter">{currentLetter}</div>
          </div>

          <div className="level-canvas-wrap">
            <canvas
              ref={canvasRef}
              className="level-canvas"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={(e) => {
                e.preventDefault();
                startDraw(e);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                draw(e);
              }}
              onTouchEnd={stopDraw}
            />

            <div className="level-actions">
              <button
                className="board-btn"
                onClick={clearCanvas}
                disabled={isChecking}
              >
                Clear
              </button>
              <button
                className="board-btn"
                onClick={submitDrawing}
                disabled={isChecking}
              >
                {isChecking ? "Checking..." : "Check"}
              </button>
            </div>
          </div>

          {feedback && (
            <div
              className={`level-result ${
                feedback.toLowerCase().includes("correct")
                  ? "correct"
                  : "incorrect"
              }`}
            >
              {feedback}
            </div>
          )}
        </div>
      </div>
    </SceneBackground>
  );
}