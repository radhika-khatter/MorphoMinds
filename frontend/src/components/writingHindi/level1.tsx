
import React, { useRef, useEffect, useState } from "react";

const consonants = [
  "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "अं", "अः",
  "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", "ण",
  "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल",
  "व", "श", "ष", "स", "ह"
];

const WritingHindiConsonants = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedLetter, setSelectedLetter] = useState("क");
  const [letterImageData, setLetterImageData] = useState<Uint8ClampedArray | null>(null);

  useEffect(() => {
    drawLetter();
  }, [selectedLetter]);

  

  const drawLetter = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
  
    const canvasWidth = 400;
    const canvasHeight = 300;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    ctx.font = "bold 150px 'Noto Sans Devanagari', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
  
    ctx.fillStyle = "white";
    ctx.fillText(selectedLetter, centerX, centerY);
  
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.strokeText(selectedLetter, centerX, centerY);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setLetterImageData(imageData.data);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos || !letterImageData) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const index = (y * canvas.width + x) * 4;
    const r = letterImageData[index];
    const g = letterImageData[index + 1];
    const b = letterImageData[index + 2];
    const a = letterImageData[index + 3];

    const isInsideLetter = r === 255 && g === 255 && b === 255 && a === 255;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = isInsideLetter ? "green" : "red";
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
    drawLetter();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Hindi Letter Tracing</h2>

      <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-4xl mx-auto">
        {consonants.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`px-3 py-2 rounded-lg text-lg font-semibold border ${
              selectedLetter === letter
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4">
        <canvas
          ref={canvasRef}
          style={{
            border: "2px solid black",
            backgroundColor: "#fff",
            touchAction: "none",
            cursor: "pointer" // 👈 this line sets the hand cursor
          }}
          className="border-4 border-gray-500 rounded-lg bg-white cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        <button
          onClick={clearCanvas}
          className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default WritingHindiConsonants;
