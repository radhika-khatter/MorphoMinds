import React, { useRef, useEffect, useState } from "react";

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

    const canvasWidth = 400;
    const canvasHeight = 300;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 160px 'Noto Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    ctx.fillStyle = "white";
    ctx.fillText(selectedNumber, centerX, centerY);

    ctx.strokeStyle = "black";
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
    const isInsideWhite = pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255 && pixel[3] === 255;

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
    <div className="px-6 py-4 font-sans">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Number Writing Practice (0 - 9)
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => setSelectedNumber(num)}
            className={`w-12 h-12 text-lg font-semibold rounded-2xl shadow-md border transition ${
              selectedNumber === num
                ? "bg-blue-600 text-white"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          style={{
            border: "2px solid black",
            backgroundColor: "#fff",
            touchAction: "none",
            cursor: "pointer" // 👈 this line sets the hand cursor
          }}
          className="border-4 border-gray-400 rounded-2xl shadow-lg bg-white cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      <div className="flex justify-center mt-4">
  <button
    onClick={clearCanvas}
    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
  >
    Clear Canvas
  </button>
</div>

    </div>
  );
};

export default WritingNumbersLevel1;
