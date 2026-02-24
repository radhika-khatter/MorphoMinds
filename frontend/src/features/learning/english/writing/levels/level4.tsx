import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SceneBackground from "@/components/layout/SceneBackground";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

/* ===============================
   LETTER SET (UPPER + LOWER)
   =============================== */
const LETTERS = [
  ...("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")),
  ...("abcdefghijklmnopqrstuvwxyz".split("")),
];

const getRandomLetter = (exclude: string) => {
  let next;
  do {
    next = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  } while (next === exclude);
  return next;
};

export default function WritingEnglishLevel4() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<any[]>([]);

  const [currentLetter, setCurrentLetter] = useState("A");
  const [strokes, setStrokes] = useState<any[][]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  /* ===============================
     PERFECT CANVAS SETUP (LIKE L2)
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
     POSITION → NORMALIZED POINT
     =============================== */
  const getPoint = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (x - rect.left) / rect.width,
      y: (y - rect.top) / rect.height,
      t: Date.now(),
    };
  };

  /* ===============================
     DRAWING
     =============================== */
  const startDraw = (e: any) => {
    if (isChecking) return;

    drawingRef.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = getPoint(e);

    currentStrokeRef.current = [p];
    setStrokes((prev) => [...prev, [p]]);

    ctx.beginPath();
    ctx.moveTo(p.x * 320, p.y * 320);
  };

  const draw = (e: any) => {
    if (!drawingRef.current || isChecking) return;

    const ctx = canvasRef.current!.getContext("2d")!;
    const p = getPoint(e);

    ctx.lineTo(p.x * 320, p.y * 320);
    ctx.stroke();

    currentStrokeRef.current.push(p);
    setStrokes((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = [...currentStrokeRef.current];
      return updated;
    });
  };

  const stopDraw = () => {
    drawingRef.current = false;
    currentStrokeRef.current = [];
  };

  /* ===============================
     CLEAR
     =============================== */
  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setResult(null);
  };

  const nextLetter = () => {
    setCurrentLetter(getRandomLetter(currentLetter));
    clearCanvas();
  };

  /* ===============================
     SUBMIT TO LEVEL 4 BACKEND
     =============================== */
  const submitDrawing = async () => {
    if (isChecking || strokes.length === 0) return;

    try {
      setIsChecking(true);
      setResult(null);

      const res = await axios.post(
        "http://127.0.0.1:8000/level4/evaluate",
        {
          target_letter: currentLetter,
          canvas_size: { width: 320, height: 320 },
          strokes,
        }
      );

      setResult(res.data);
      setIsChecking(false);
    } catch (err) {
      console.error(err);
      setResult({ hybrid: { status: "server_error" } });
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

          {/* Nails */}
          <span className="level-nail level-nail-tl" />
          <span className="level-nail level-nail-tr" />
          <span className="level-nail level-nail-bl" />
          <span className="level-nail level-nail-br" />

          <h1 className="level-title">
            ✍️ Write Letters— Level 4
          </h1>

          <p className="level-desc">
            Write the letter carefully using correct stroke formation.
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

              <button
                className="board-btn"
                onClick={nextLetter}
                disabled={isChecking}
              >
                Next
              </button>
            </div>
          </div>

          {result && result.hybrid && (
            <div
              className={`level-result ${
                result.hybrid.status === "correct"
                  ? "correct"
                  : "incorrect"
              }`}
            >
              <b>Status:</b> {result.hybrid.status}
              <br />
              <b>Final Score:</b> {result.hybrid.final_score ?? "--"}
            </div>
          )}
        </div>
      </div>
    </SceneBackground>
  );
}