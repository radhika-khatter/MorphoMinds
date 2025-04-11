import React, { useRef, useState, useEffect } from "react";

const WritingLevel2 = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [currentLetter, setCurrentLetter] = useState("A");

  // Handle canvas resize on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Get container width for responsive sizing
      const container = containerRef.current;
      const containerWidth = container ? container.clientWidth : window.innerWidth;
      
      // Set canvas size (max 400px or 90% of container width)
      const size = Math.min(containerWidth * 0.9, 400);
      canvas.width = size;
      canvas.height = size;
      
      // Redraw letter guide if needed
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getEventPoint = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
    
    if (clientX === null || clientY === null) return null;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    // Prevent scrolling when touching the canvas
    e.preventDefault();
    
    const point = getEventPoint(e);
    if (!point) return;
    
    setIsDrawing(true);
    setLastPoint(point);
  };

  const draw = (e) => {
    // Prevent scrolling when touching the canvas
    e.preventDefault();
    
    if (!isDrawing || !lastPoint || !canvasRef.current) return;
    
    const point = getEventPoint(e);
    if (!point) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    setLastPoint(point);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="bg-white dark:bg-gray-800 shadow-md p-4">
        <h1 className="text-xl font-bold text-center text-purple-600">Writing Practice</h1>
      </div>
      
      <div ref={containerRef} className="p-4 flex-grow flex flex-col items-center max-w-lg mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2 text-center">
          Level 2: Write Letters Freely
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
          Write the selected letter — without a guide.
        </p>

        <div className="letter-display mb-4 flex items-center justify-center">
          <div className="text-6xl font-bold text-purple-400 opacity-30">
            {currentLetter}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <button
              key={letter}
              onClick={() => {
                setCurrentLetter(letter);
                clearCanvas();
              }}
              className={`px-3 py-1 rounded-md border text-sm ${
                letter === currentLetter
                  ? "bg-purple-600 text-white"
                  : "bg-white text-purple-600 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="canvas-container w-full flex justify-center touch-none">
          <canvas
            ref={canvasRef}
            className="border-2 border-dashed border-purple-400 bg-white dark:bg-gray-800 rounded-xl touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={clearCanvas}
            className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritingLevel2;