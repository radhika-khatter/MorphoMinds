import { useRef } from "react";
import Header from "@/components/Header";

const WritingHindiLevel2 = () => {
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
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

    ctx!.beginPath();
    ctx!.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx!.lineTo(x, y);
    ctx!.strokeStyle = "black";
    ctx!.lineWidth = 4;
    ctx!.lineCap = "round";
    ctx!.stroke();

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="p-6 flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-purple-600">Hindi Writing Level 2</h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-xl text-center">
          Try writing full Hindi words without dotted guides. Focus on proper spacing and letter formation.
        </p>

        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border border-gray-400 rounded-lg bg-white dark:bg-gray-800"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        <button
          onClick={clearCanvas}
          className="mt-4 px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default WritingHindiLevel2;
