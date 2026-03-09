import { useRef, useState } from "react";
import SceneBackground from "@/components/layout/SceneBackground";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

/* =========================
   ALL LOWERCASE LETTERS
   ========================= */
const ALL_LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(97 + i)
);

const WritingEnglishStroke = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef<number[][][]>([]);

  const [letter, setLetter] = useState<string>("a");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     VIDEO MAP (only available letters)
     ========================= */
  const videoMap: Record<string, string> = {
    a: "/videos/a.mp4",
    b: "/videos/b.mp4",
    c: "/videos/c.mp4",
  };

  /* =========================
     DRAWING LOGIC
     ========================= */
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
    if (!isDrawing.current || !canvasRef.current || !lastPoint.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current = [];
    setResult(null);
  };

  /* =========================
     BACKEND CHECK
     ========================= */
  const handleCheck = async () => {
    if (strokes.current.length === 0) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8003/api/check_all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_mode: "lower",
          letter,
          strokes: strokes.current,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Backend not reachable" });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    <SceneBackground>
      <div className="level-container">
        <div
          className="level-card fade-in-up"
          style={{ maxWidth: "1400px", width: "100%" }}
        >
          <h1 className="level-title">✍️ English Stroke Order Practice</h1>

          {/* LETTER SELECTOR */}
          <div style={{ marginBottom: "16px", flexWrap: "wrap" }}>
            {ALL_LETTERS.map((l) => (
              <button
                key={l}
                className="board-btn"
                onClick={() => {
                  setLetter(l);
                  clearCanvas();
                }}
                style={{ marginRight: "8px", marginBottom: "8px" }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* MAIN LAYOUT */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            {/* LEFT — VIDEO */}
            <div style={{ width: "260px", textAlign: "center" }}>
              <p style={{ color: "#fff", marginBottom: "8px" }}>
                Stroke order for <strong>{letter}</strong>
              </p>

              {videoMap[letter] ? (
                <video
                  src={videoMap[letter]}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    border: "2px solid #c9b08a",
                    background: "#fff",
                  }}
                />
              ) : (
                <p style={{ opacity: 0.7 }}>No stroke video available</p>
              )}
            </div>

            {/* CENTER — CANVAS */}
            <div style={{ textAlign: "center" }}>
              <div
                className="level-letter"
                style={{ fontSize: "3rem", marginBottom: "12px" }}
              >
                {letter}
              </div>

              <canvas
                ref={canvasRef}
                width={420}
                height={420}
                className="level-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />

              <div className="level-actions" style={{ marginTop: "12px" }}>
                <button className="board-btn" onClick={clearCanvas}>
                  Clear
                </button>
                <button
                  className="board-btn"
                  onClick={handleCheck}
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Check"}
                </button>
              </div>
            </div>

            {/* RIGHT — RESULT */}
            <div
              style={{
                width: "360px",
                padding: "14px",
                borderRadius: "12px",
                background: "rgba(0,0,0,0.45)",
                color: "white",
              }}
            >
              <h3>📊 Result</h3>

              {!result && <p style={{ opacity: 0.7 }}>Check to see result</p>}

              {result?.error && <p>{result.error}</p>}

              {result && !result.error && (
                <>
                  {result.template_messages?.map(
                    (m: string, i: number) => (
                      <p key={i}>{m}</p>
                    )
                  )}

                  

                  {result.template_samples != null && (
                    <p>Template samples: {result.template_samples}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SceneBackground>
  );
};

export default WritingEnglishStroke;