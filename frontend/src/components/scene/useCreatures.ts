import { useState, useEffect, useRef, useCallback } from "react";

/* ==================================================================
   Creature Movement — heading-angle steering for natural curved paths
   ================================================================== */
export interface Creature {
    x: number;
    y: number;
    heading: number;  // current direction angle in radians
    speed: number;    // movement speed (% per frame)
    phase: number;    // unique noise offset
    color: string;
}

const FLEE_RANGE = 14; // % of container
const STEER_RATE = 0.04; // how fast heading changes per frame (radians)
const FLEE_STEER = 0.05; // how strongly flee biases the heading

export function useCreatures(count: number, colors: string[]) {
    const creaturesRef = useRef<Creature[]>([]);
    const [renderCreatures, setRenderCreatures] = useState<Creature[]>([]);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);
    const timeRef = useRef(0);
    const initRef = useRef(false);

    // Initialize — positions biased toward ground
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;
        creaturesRef.current = Array.from({ length: count }, (_, i) => ({
            x: 5 + Math.random() * 90,
            y: 65 + Math.random() * 25,
            heading: Math.random() * Math.PI * 2,
            speed: 0.12 + Math.random() * 0.14,
            phase: Math.random() * Math.PI * 2,
            color: colors[i % colors.length],
        }));
        setRenderCreatures([...creaturesRef.current]);
    }, [count, colors]);

    // Animation loop
    useEffect(() => {
        let lastRender = 0;
        const animate = (timestamp: number) => {
            timeRef.current += 0.016;
            const t = timeRef.current;
            const all = creaturesRef.current;
            const container = containerRef.current;

            for (let i = 0; i < all.length; i++) {
                const c = all[i];
                const p = c.phase;

                // --- 1. Natural heading wander (layered noise → curved paths) ---
                const steerNoise =
                    Math.sin(t * 0.5 + p) * 0.6 +
                    Math.sin(t * 1.3 + p * 2.7) * 0.35 +
                    Math.cos(t * 0.2 + p * 0.4) * 0.45 +
                    Math.sin(t * 2.1 + p * 4.1) * 0.15;
                c.heading += steerNoise * STEER_RATE;

                // --- 2. Mouse flee — gently redirect heading away ---
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const mx = ((mouseRef.current.x - rect.left) / rect.width) * 100;
                    const my = ((mouseRef.current.y - rect.top) / rect.height) * 100;
                    const dx = c.x - mx;
                    const dy = c.y - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < FLEE_RANGE && dist > 0.5) {
                        const awayAngle = Math.atan2(dy, dx);
                        let diff = awayAngle - c.heading;
                        while (diff > Math.PI) diff -= Math.PI * 2;
                        while (diff < -Math.PI) diff += Math.PI * 2;
                        const urgency = 1 - dist / FLEE_RANGE;
                        c.heading += diff * FLEE_STEER * (1 + urgency * 3);
                    }
                }

                // --- 3. Soft vertical steering (stay near ground, y 55–92%) ---
                if (c.y < 55) c.heading += (Math.PI * 0.4) * 0.03;
                if (c.y > 90) c.heading -= (Math.PI * 0.4) * 0.02;

                // --- 4. Move along heading ---
                c.x += Math.cos(c.heading) * c.speed;
                c.y += Math.sin(c.heading) * c.speed;

                // Wrap edges (infinite canvas)
                if (c.x < -3) c.x += 106;
                if (c.x > 103) c.x -= 106;
                if (c.y < 3) c.y += 89;
                if (c.y > 92) c.y -= 89;
            }

            // Throttle renders to ~30fps
            if (timestamp - lastRender > 33) {
                setRenderCreatures(all.map(c => ({ ...c })));
                lastRender = timestamp;
            }

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    return { creatures: renderCreatures, containerRef, handleMouseMove };
}
