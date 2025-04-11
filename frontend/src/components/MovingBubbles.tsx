
import { useEffect, useRef } from "react";

const MovingBubbles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create bubbles
    const bubbles: Bubble[] = [];
    const colors = [
      "rgba(211, 188, 250, 0.5)", // Light purple
      "rgba(188, 212, 250, 0.4)", // Light blue
      "rgba(250, 188, 250, 0.3)", // Light pink
    ];

    interface Bubble {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
    }

    // Create initial bubbles
    for (let i = 0; i < 15; i++) {
      const radius = Math.random() * 60 + 20;
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      });
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update each bubble
      bubbles.forEach((bubble) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();

        // Update position
        bubble.x += bubble.speedX;
        bubble.y += bubble.speedY;

        // Bounce off walls
        if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > canvas.width) {
          bubble.speedX = -bubble.speedX;
        }
        if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > canvas.height) {
          bubble.speedY = -bubble.speedY;
        }
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default MovingBubbles;
