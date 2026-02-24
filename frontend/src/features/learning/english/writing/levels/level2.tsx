import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomLetter = (exclude: string) => {
  let newLetter;
  do {
    newLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
  } while (newLetter === exclude);
  return newLetter;
};

const WritingEnglishLevel3: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentLetter, setCurrentLetter] = useState("A");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] =
    useState<{ prediction: string; correct: boolean } | null>(null);

  /* ---------------- Canvas resize ---------------- */
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = containerRef.current;
      const size = Math.min((container?.clientWidth || 400) * 0.9, 420);

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = size / 18;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#2a1a0a";
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------------- Drawing helpers ---------------- */
  const getPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e ? e.touches[0]?.clientX : e.clientX;
    const y =
      "touches" in e ? e.touches[0]?.clientY : e.clientY;

    if (x == null || y == null) return null;
    return { x: x - rect.left, y: y - rect.top };
  };

  const startDrawing = (e: any) => {
    e.preventDefault();
    const p = getPoint(e);
    if (!p) return;
    setIsDrawing(true);
    setLastPoint(p);
  };

  const draw = (e: any) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint || !canvasRef.current) return;

    const p = getPoint(e);
    if (!p) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    setLastPoint(p);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setResult(null);
  };

  /* ---------------- ML submit ---------------- */
  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const small = document.createElement("canvas");
    small.width = 28;
    small.height = 28;
    const sctx = small.getContext("2d");
    if (!sctx) return;

    sctx.fillStyle = "white";
    sctx.fillRect(0, 0, 28, 28);

    const ctx = canvas.getContext("2d")!;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (img.data[(y * canvas.width + x) * 4 + 3] > 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    const w = maxX - minX || 1;
    const h = maxY - minY || 1;

    sctx.drawImage(canvas, minX, minY, w, h, 0, 0, 28, 28);

    const data = sctx.getImageData(0, 0, 28, 28);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = 255 - data.data[i];
      data.data[i + 1] = 255 - data.data[i + 1];
      data.data[i + 2] = 255 - data.data[i + 2];
    }
    sctx.putImageData(data, 0, 0);

    setIsLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        "http://localhost:5002/english/writing/predict",
        { image: small.toDataURL("image/png") }
      );

      const prediction = res.data.prediction;
      setResult({ prediction, correct: prediction === currentLetter });
    } catch {
      alert("ML server not reachable.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextLetter = () => {
    setCurrentLetter(getRandomLetter(currentLetter));
    clearCanvas();
  };

  /* ---------------- UI ---------------- */
  return (
    <SceneBackground>
      
        <div className="level-container">
          <div className="level-card fade-in-up">

            <span className="level-nail level-nail-tl" />
            <span className="level-nail level-nail-tr" />
            <span className="level-nail level-nail-bl" />
            <span className="level-nail level-nail-br" />

            <h1 className="level-title">✍️ stroke order practice - Level 2</h1>
            <p className="level-desc">
              Perform Stroke order step by step.
            </p>

            <div className="level-desc" style={{ fontSize: "2.5rem", fontWeight: 800 }}>
              {currentLetter}
            </div>

            <div ref={containerRef} className="level-canvas-wrap">
              <canvas
                ref={canvasRef}
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
                  Clear
                </button>
                <button className="board-btn" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Checking..." : "Submit"}
                </button>
                <button className="board-btn" onClick={nextLetter}>
                  Next Letter
                </button>
              </div>
            </div>

            {result && (
              <div className={`level-result ${result.correct ? "correct" : "incorrect"}`}>
                {result.correct
                  ? `✅ Correct! You wrote "${result.prediction}".`
                  : `❌ You wrote "${result.prediction}". Expected "${currentLetter}".`}
              </div>
            )}
          </div>
        </div>
     
    </SceneBackground>
  );
};

export default WritingEnglishLevel3;