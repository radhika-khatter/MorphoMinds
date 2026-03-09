import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

import {
    SunSVG, MoonSVG, CloudSVG,
    Flower, SmallFlower, ButterflySVG,
    Stars, GrassStrip, SketchyFilters,
} from "@/components/scene/HomeSVGs";
import { useCreatures } from "@/components/scene/useCreatures";
import NavBar from "./NavBar";

import "./SceneBackground.css";

/* ==================================================================
   Constants
   ================================================================== */
const butterflyColors = ["#FF9AA2", "#FFB7B2", "#B5EAD7", "#C7CEEA", "#FFDAC1", "#E2B6CF"];
const fireflyPlaceholder = ["#ffe082", "#fff9c4", "#ffe082", "#fff59d", "#ffe082", "#fff9c4", "#ffe082", "#fff59d"];

const flowerData = [
    { color: "#FF6B8A", big: true }, { color: "#FF9F43", big: false },
    { color: "#FECA57", big: false }, { color: "#A55EEA", big: true },
    { color: "#FF6348", big: false }, { color: "#FF85A2", big: true },
    { color: "#FFB74D", big: false }, { color: "#C56CF0", big: false },
    { color: "#FF6B8A", big: true }, { color: "#FECA57", big: false },
    { color: "#FF9F43", big: true }, { color: "#A55EEA", big: false },
    { color: "#FF7979", big: false }, { color: "#FF6348", big: true },
    { color: "#FFE066", big: false }, { color: "#C56CF0", big: true },
    { color: "#FF85A2", big: false }, { color: "#FECA57", big: false },
    { color: "#FF6B8A", big: true }, { color: "#A55EEA", big: false },
    { color: "#FF9F43", big: true }, { color: "#FF6348", big: false },
    { color: "#FFB74D", big: true }, { color: "#FF7979", big: false },
];

/* ==================================================================
   SceneBackground
   Renders sky, clouds, creatures, earth, grass, flowers.
   Shows NavBar on all pages except Home ("/").
   On Home, shows the standalone sun/moon toggle instead.
   ================================================================== */
interface SceneBackgroundProps {
    children: ReactNode;
    onProfileOpen?: () => void;
}

const SceneBackground = ({ children, onProfileOpen }: SceneBackgroundProps) => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const toggleTheme = () => setTheme(isDark ? "light" : "dark");
    const location = useLocation();
    const isHome = location.pathname === "/";

    const bfly = useCreatures(12, butterflyColors);
    const ffly = useCreatures(14, fireflyPlaceholder);

    return (
        <div className="scene-sky" onMouseMove={(e) => { bfly.handleMouseMove(e); ffly.handleMouseMove(e); }}>
            <SketchyFilters />
            <Stars />

            {/* Clouds */}
            <div className="cloud-svg cloud-svg-1"><CloudSVG width={200} /></div>
            <div className="cloud-svg cloud-svg-2"><CloudSVG width={160} /></div>
            <div className="cloud-svg cloud-svg-3"><CloudSVG width={130} /></div>

            {/* NavBar on all pages except Home */}
            {/* NavBar — on Home, hide back/forward/profile */}
            <NavBar onProfileOpen={onProfileOpen} hideControls={isHome} />

            {/* Butterflies / Fireflies */}
            {!isDark && (
                <div className="creatures-layer" ref={bfly.containerRef}>
                    {bfly.creatures.map((c, i) => (
                        <div key={i} className="butterfly" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                            <ButterflySVG color={c.color} />
                        </div>
                    ))}
                </div>
            )}
            {isDark && (
                <div className="creatures-layer" ref={ffly.containerRef}>
                    {ffly.creatures.map((c, i) => (
                        <div key={i} className="firefly" style={{ left: `${c.x}%`, top: `${c.y}%` }} />
                    ))}
                </div>
            )}

            {/* Page content */}
            <div className="scene-content">
                {children}
            </div>

            {/* Curved Earth */}
            <div className="earth-container">
                <svg className="earth-svg" viewBox="0 0 1440 180" preserveAspectRatio="none" fill="none">
                    <path
                        d="M0,80 Q360,10 720,30 Q1080,10 1440,80 L1440,180 L0,180 Z"
                        fill={isDark ? "#145223" : "#4caf50"} stroke={isDark ? "#1a5a2e" : "#388e3c"} strokeWidth="2.5"
                    />
                    <path
                        d="M0,90 Q200,40 450,55 Q700,30 950,50 Q1200,35 1440,90"
                        fill="none" stroke={isDark ? "#1e6b36" : "#66bb6a"} strokeWidth="2" opacity="0.5"
                    />
                </svg>
            </div>

            {/* Grass + Flowers */}
            <div className="ground-decoration">
                <GrassStrip isDark={isDark} />
                <div className="flowers-row">
                    {flowerData.map((f, i) =>
                        f.big ? <Flower key={i} color={f.color} size={28 + (i % 4) * 4} />
                            : <SmallFlower key={i} color={f.color} size={16 + (i % 3) * 3} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SceneBackground;
