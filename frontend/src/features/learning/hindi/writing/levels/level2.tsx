import { useEffect, useRef, useState } from "react";
import SceneBackground from "@/components/layout/SceneBackground";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

export default function HindiStrokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<any>(null);

  const [strokes, setStrokes] = useState<any[]>([]);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [targetLetter, setTargetLetter] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  /* ===============================
     CANVAS SETUP
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
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";

    fetchLetterByIndex(0);
  }, []);

  /* ===============================
     FETCH LETTER
     =============================== */
  const fetchLetterByIndex = async (index: number) => {
    const res = await fetch(
      `http://127.0.0.1:8002/next-letter?index=${index}`
    );
    const data = await res.json();

    setTargetLetter(data.target_letter);
    setCurrentIndex(data.next_index);
    clearCanvas();
    setEvaluation(null);
  };

  /* ===============================
     DRAWING
     =============================== */
  const getPos = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  };

  const startDraw = (e: any) => {
    if (isChecking) return;
    drawingRef.current = true;

    const pos = getPos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    const stroke = [{ ...pos, t: Date.now() }];

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
    currentStrokeRef.current.push({ ...pos, t: Date.now() });
  };

  const stopDraw = () => {
    drawingRef.current = false;
    currentStrokeRef.current = null;
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.strokeStyle = "#000";
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setStrokes([]);
  };

  /* ===============================
     CHECK LETTER
     =============================== */
  const checkLetter = async () => {
    if (!targetLetter || isChecking) return;

    setIsChecking(true);
    const image = canvasRef.current!.toDataURL("image/png");

    const res = await fetch("http://127.0.0.1:8002/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ letter: targetLetter, strokes, image }),
    });

    const data = await res.json();
    setEvaluation(data);
    redrawWithFeedback(data.errors);
    setIsChecking(false);
  };

  const redrawWithFeedback = (errors: any) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

    strokes.forEach((stroke, i) => {
      const wrong =
        errors?.type_errors?.includes(i) ||
        errors?.direction_errors?.includes(i) ||
        (errors?.shirorekha_error && i === strokes.length - 1);

      ctx.beginPath();
      ctx.strokeStyle = wrong ? "red" : "green";
      ctx.lineWidth = 14;

      for (let j = 1; j < stroke.length; j++) {
        ctx.moveTo(stroke[j - 1].x, stroke[j - 1].y);
        ctx.lineTo(stroke[j].x, stroke[j].y);
      }
      ctx.stroke();
    });
  };

  /* ===============================
     UI
     =============================== */
  return (
    <SceneBackground>
      <div className="level-container" style={{ paddingBottom: "80px" }}>
        <div className="level-card fade-in-up">

          <h1 className="level-title">
            ✏️ हिंदी स्ट्रोक लेखन — Level 2
          </h1>
          <p className="level-desc">
            दिए गए अक्षर को सही स्ट्रोक क्रम में लिखें।
          </p>

          {/* MAIN LAYOUT */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT: CANVAS */}
            <div style={{ flex: "0 0 auto", textAlign: "center" }}>
              <div className="level-letter" style={{ marginBottom: "12px" }}>
                {targetLetter}
              </div>

              <canvas
                ref={canvasRef}
                className="level-canvas"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={(e) => { e.preventDefault(); startDraw(e); }}
                onTouchMove={(e) => { e.preventDefault(); draw(e); }}
                onTouchEnd={stopDraw}
              />

              <div className="level-actions" style={{ marginTop: "12px" }}>
                <button className="board-btn" onClick={clearCanvas}>
                  Clear
                </button>
                <button
                  className="board-btn"
                  onClick={checkLetter}
                  disabled={isChecking}
                >
                  {isChecking ? "Checking..." : "Check"}
                </button>
                <button
                  className="board-btn"
                  onClick={() => fetchLetterByIndex(currentIndex)}
                >
                  Next
                </button>
              </div>
            </div>

            {/* RIGHT: RESULT PANEL */}
            <div
              style={{
                flex: "1",
                maxWidth: "520px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* TOP STATIC INFO */}
              <div
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.35)",
                  color: "white",
                }}
              >
                <h3 style={{ marginBottom: "6px" }}>📊 परिणाम पैनल</h3>
                <p style={{ opacity: 0.8, margin: 0 }}>
                  नीचे पूरा मूल्यांकन दिखेगा।
                </p>
              </div>

              {/* RESULT CONTENT */}
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.45)",
                  color: "white",
                }}
              >
                {!evaluation && (
                  <p style={{ opacity: 0.8 }}>
                     जाँच के बाद परिणाम यहाँ दिखाई देगा
                  </p>
                )}

                {evaluation && (
                  <>
                    <h3>कुल स्कोर: {evaluation.rule_score}%</h3>

                    <h4>📝 फीडबैक</h4>
                    <ul>
                      {evaluation.feedback?.map((f: string, i: number) => (
                        <li key={i} style={{ marginBottom: "6px" }}>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <h4 style={{ marginTop: "12px" }}>⚠️ त्रुटियाँ</h4>
                    <ul>
                      {evaluation.errors?.stroke_order_error && (
                        <li>❌ स्ट्रोक क्रम गलत</li>
                      )}
                      {evaluation.errors?.direction_errors?.length > 0 && (
                        <li>❌ दिशा में त्रुटि</li>
                      )}
                      {evaluation.errors?.shirorekha_error && (
                        <li>❌ शिरोरेखा गलत</li>
                      )}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SceneBackground>
  );
}