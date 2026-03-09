import React, { useRef, useState, useEffect } from "react";

export default function HindiStrokeCanvas() {

  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [targetLetter, setTargetLetter] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    initializeCanvas();
    fetchLetterByIndex(0);
  }, []);

  // ============================================
  // Fetch Letter By Index (Sequential)
  // ============================================

  const fetchLetterByIndex = async (index) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8002/next-letter?index=${index}`
      );
      const data = await response.json();
      setTargetLetter(data.target_letter);
      setCurrentIndex(data.next_index);
      clearCanvas();
      setEvaluation(null);
    } catch (error) {
      console.error("Error fetching letter:", error);
    }
  };

  // ============================================
  // CANVAS SETUP
  // ============================================

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineWidth = 14;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

const clearCanvas = () => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 14;

  setStrokes([]);
  setEvaluation(null);
};

  // ============================================
  // DRAWING LOGIC
  // ============================================

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      t: Date.now(),
    };
  };

  const startDrawing = (event) => {
    const point = getCoordinates(event);
    setIsDrawing(true);
    setCurrentStroke([point]);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const point = getCoordinates(event);

    setCurrentStroke((prev) => {
      const updated = [...prev, point];

      ctx.beginPath();
      ctx.moveTo(prev[prev.length - 1].x, prev[prev.length - 1].y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      return updated;
    });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStrokes((prev) => [...prev, currentStroke]);
    setCurrentStroke([]);
  };

  // ============================================
  // CHECK BUTTON (Evaluate Only)
  // ============================================

const checkLetter = async () => {

  if (!targetLetter) return;

  const canvas = canvasRef.current;
  const imageData = canvas.toDataURL("image/png");

  const payload = {
    letter: targetLetter,
    strokes: strokes,
    image: imageData
  };

  try {
    const response = await fetch("http://127.0.0.1:8002/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    setEvaluation(data);

    // 🔥 Redraw strokes with color feedback
    redrawWithFeedback(data.errors);

  } catch (error) {
    console.error("Error:", error);
  }
};

  const redrawWithFeedback = (errors) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  strokes.forEach((stroke, index) => {

    const isWrong =
      errors.type_errors.includes(index) ||
      errors.direction_errors.includes(index) ||
      (errors.shirorekha_error && index === strokes.length - 1);

    ctx.beginPath();
    ctx.strokeStyle = isWrong ? "red" : "green";
    ctx.lineWidth = 8;

    for (let i = 1; i < stroke.length; i++) {
      ctx.moveTo(stroke[i - 1].x, stroke[i - 1].y);
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }

    ctx.stroke();
  });
};

  // ============================================
  // NEXT BUTTON (Manual Sequential Progression)
  // ============================================

  const nextLetter = () => {
    fetchLetterByIndex(currentIndex);
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>

      <h2>Hindi Stroke Writing Canvas</h2>

      {/* TARGET LETTER */}
      <div style={{
        background: "#f8f9fa",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px"
      }}>
        <h1 style={{ fontSize: "80px", margin: 0 }}>
          {targetLetter}
        </h1>
        <p>Draw this letter using correct stroke order.</p>
      </div>

      {/* CANVAS */}
      <div style={{
        border: "2px solid black",
        display: "inline-block"
      }}>
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          style={{ backgroundColor: "white" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* BUTTONS */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={clearCanvas} style={{ marginRight: "10px" }}>
          Clear
        </button>

        <button onClick={checkLetter} style={{ marginRight: "10px" }}>
          Check
        </button>

        <button onClick={nextLetter}>
          Next
        </button>
      </div>

      {/* EVALUATION RESULT */}
      {evaluation && (
        <div style={{
          marginTop: "30px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          <h3>Score: {evaluation.rule_score}%</h3>

          <div style={{
            width: "100%",
            background: "#eee",
            height: "20px",
            borderRadius: "10px",
            marginBottom: "20px"
          }}>
            <div style={{
              width: `${evaluation.rule_score}%`,
              height: "100%",
              background:
                evaluation.rule_score > 80 ? "green" :
                evaluation.rule_score > 50 ? "orange" :
                "red",
              borderRadius: "10px"
            }} />
          </div>

          <ul style={{ textAlign: "left" }}>
            {evaluation.feedback.map((msg, index) => (
              <li key={index} style={{
                marginBottom: "8px",
                color:
                  msg.toLowerCase().includes("should") ||
                  msg.toLowerCase().includes("needs") ||
                  msg.toLowerCase().includes("but you")
                    ? "red"
                    : "green"
              }}>
                {msg}
              </li>
            ))}
          </ul>

        </div>
      )}

    </div>
  );
}