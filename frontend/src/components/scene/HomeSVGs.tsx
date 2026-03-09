/* ==================================================================
   SVG Components — all hand-drawn SVGs used on the Home page
   ================================================================== */

// ---------- Crayon-style Sun (≈120×120 centred in 130×130 box) ----------
export const SunSVG = () => (
    <svg width="120" height="120" viewBox="0 0 140 140" fill="none">
        {/* thick crayon rays */}
        <path d="M70,8 Q72,14 69,22" stroke="#F5A623" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M100,18 Q96,26 92,32" stroke="#F5A623" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M130,68 Q122,70 116,69" stroke="#F5A623" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M108,112 Q102,106 98,100" stroke="#F5A623" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M70,132 Q68,124 71,118" stroke="#F5A623" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M32,112 Q38,106 42,100" stroke="#F5A623" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M10,70 Q18,68 24,71" stroke="#F5A623" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M30,20 Q36,28 40,34" stroke="#F5A623" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* in-between rays */}
        <path d="M86,12 Q84,18 83,24" stroke="#F5A623" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M54,12 Q56,19 57,24" stroke="#F5A623" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M126,50 Q118,52 114,52" stroke="#F5A623" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M126,90 Q118,88 114,88" stroke="#F5A623" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M86,128 Q84,120 83,116" stroke="#F5A623" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M54,128 Q56,121 57,116" stroke="#F5A623" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M14,50 Q22,52 26,52" stroke="#F5A623" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M14,90 Q22,88 26,88" stroke="#F5A623" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* body */}
        <path
            d="M70,32 Q88,30 98,42 Q108,56 104,70 Q102,86 90,96 Q78,104 65,102 Q50,100 40,90 Q30,78 32,64 Q34,48 46,38 Q56,30 70,32 Z"
            fill="#F5A623" stroke="#E08D14" strokeWidth="4"
        />
        {/* spiral */}
        <path
            d="M70,62 Q74,58 76,62 Q78,68 72,70 Q66,72 64,66 Q62,58 70,56 Q80,54 82,64 Q84,76 72,78 Q60,80 58,68 Q56,54 68,52"
            fill="none" stroke="#E08D14" strokeWidth="3.5" strokeLinecap="round"
        />
    </svg>
);

// ---------- Hand-drawn Moon (≈120×120 centred in 130×130 box) ----------
export const MoonSVG = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <path
            d="M72,12 Q98,18 106,42 Q114,66 98,88 Q84,106 58,108 Q34,108 20,92 Q36,100 50,90 Q68,78 68,56 Q68,34 52,22 Q62,12 72,12 Z"
            fill="#e8e4d4" stroke="#8a8460" strokeWidth="3"
        />
        {/* craters */}
        <path d="M62,46 Q69,43 72,50 Q69,58 62,55 Q58,50 62,46 Z" fill="#d4cfb8" stroke="#8a8460" strokeWidth="1.5" />
        <path d="M80,68 Q85,65 87,70 Q84,75 80,72 Q78,70 80,68 Z" fill="#d4cfb8" stroke="#8a8460" strokeWidth="1.5" />
        <path d="M68,80 Q72,78 73,82 Q71,85 68,83 Z" fill="#d4cfb8" stroke="#8a8460" strokeWidth="1" />
        {/* tiny stars */}
        <path d="M34,20 l2,5 5,2 -5,2 -2,5 -2,-5 -5,-2 5,-2 z" fill="#e8e4d4" stroke="#8a8460" strokeWidth="0.5" />
        <path d="M22,48 l1.5,3.5 3.5,1.5 -3.5,1.5 -1.5,3.5 -1.5,-3.5 -3.5,-1.5 3.5,-1.5 z" fill="#e8e4d4" stroke="#8a8460" strokeWidth="0.5" />
        <path d="M38,84 l1,2.5 2.5,1 -2.5,1 -1,2.5 -1,-2.5 -2.5,-1 2.5,-1 z" fill="#e8e4d4" stroke="#8a8460" strokeWidth="0.5" />
    </svg>
);

// ---------- Hand-drawn Cloud SVG ----------
export const CloudSVG = ({ width = 180 }: { width?: number }) => (
    <svg width={width} height={width * 0.45} viewBox="0 0 200 90" fill="none">
        <path
            d="M30,68 Q8,70 10,50 Q2,40 14,32 Q10,16 30,20 Q36,4 56,10 Q68,-2 86,8 Q98,2 112,12 Q128,2 144,14 Q158,6 168,20 Q190,16 192,36 Q202,44 194,56 Q198,70 178,68 Z"
            fill="#fff" stroke="#90aab8" strokeWidth="2.5" strokeLinejoin="round"
        />
        <path
            d="M40,60 Q20,58 24,46 Q18,38 28,34 Q26,24 40,28 Q46,16 60,20 Q68,12 80,16"
            fill="none" stroke="#c8dae4" strokeWidth="1.5" strokeLinecap="round"
        />
    </svg>
);

// ---------- Flower SVGs ----------
export const Flower = ({ color, size = 34 }: { color: string; size?: number }) => (
    <div className="flower">
        <svg width={size} height={size * 1.8} viewBox="0 0 40 72" fill="none">
            <path d="M20,30 Q18,46 19,72" stroke="#3a7d44" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M19,46 Q10,40 7,44 Q10,50 19,46" fill="#4caf50" stroke="#2e6b3a" strokeWidth="1.2" />
            <path d="M20,55 Q29,48 33,52 Q30,58 20,55" fill="#66bb6a" stroke="#2e6b3a" strokeWidth="1.2" />
            <ellipse cx="20" cy="10" rx="5.5" ry="8" fill={color} stroke="#555" strokeWidth="1.2" />
            <ellipse cx="12" cy="16" rx="5.5" ry="8" fill={color} stroke="#555" strokeWidth="1.2" transform="rotate(-30 12 16)" />
            <ellipse cx="28" cy="16" rx="5.5" ry="8" fill={color} stroke="#555" strokeWidth="1.2" transform="rotate(30 28 16)" />
            <ellipse cx="13" cy="26" rx="5" ry="7" fill={color} stroke="#555" strokeWidth="1.2" transform="rotate(-65 13 26)" />
            <ellipse cx="27" cy="26" rx="5" ry="7" fill={color} stroke="#555" strokeWidth="1.2" transform="rotate(65 27 26)" />
            <circle cx="20" cy="18" r="5" fill="#FFD54F" stroke="#d4952a" strokeWidth="1.5" />
        </svg>
    </div>
);

export const SmallFlower = ({ color, size = 20 }: { color: string; size?: number }) => (
    <div className="flower">
        <svg width={size} height={size * 1.5} viewBox="0 0 26 40" fill="none">
            <path d="M13,18 Q12,28 13,40" stroke="#3a7d44" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="13" cy="10" r="4" fill={color} stroke="#555" strokeWidth="1" />
            <circle cx="8" cy="13" r="3.5" fill={color} stroke="#555" strokeWidth="1" />
            <circle cx="18" cy="13" r="3.5" fill={color} stroke="#555" strokeWidth="1" />
            <circle cx="9" cy="7" r="3.5" fill={color} stroke="#555" strokeWidth="1" />
            <circle cx="17" cy="7" r="3.5" fill={color} stroke="#555" strokeWidth="1" />
            <circle cx="13" cy="10" r="2.5" fill="#FFD54F" stroke="#d4952a" strokeWidth="1" />
        </svg>
    </div>
);

// ---------- Butterfly SVG ----------
export const ButterflySVG = ({ color }: { color: string }) => {
    const inner = color + "99";
    return (
        <svg width="36" height="30" viewBox="0 0 44 36" fill="none">
            {/* antennae — curly with ball tips */}
            <path d="M22,10 Q18,4 14,2 Q12,0 11,2" stroke="#6b5040" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M22,10 Q26,4 30,2 Q32,0 33,2" stroke="#6b5040" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="11" cy="2" r="1.3" fill="#6b5040" />
            <circle cx="33" cy="2" r="1.3" fill="#6b5040" />

            {/* upper left wing */}
            <path d="M22,14 C14,6 2,4 2,14 C2,20 10,22 22,18" fill={color} stroke="#6b5040" strokeWidth="1.4" strokeLinejoin="round" />
            {/* upper right wing */}
            <path d="M22,14 C30,6 42,4 42,14 C42,20 34,22 22,18" fill={color} stroke="#6b5040" strokeWidth="1.4" strokeLinejoin="round" />
            {/* lower left wing */}
            <path d="M22,20 C14,20 6,24 6,30 C8,34 16,32 22,26" fill={color} stroke="#6b5040" strokeWidth="1.3" strokeLinejoin="round" opacity="0.9" />
            {/* lower right wing */}
            <path d="M22,20 C30,20 38,24 38,30 C36,34 28,32 22,26" fill={color} stroke="#6b5040" strokeWidth="1.3" strokeLinejoin="round" opacity="0.9" />

            {/* inner wing patterns */}
            <path d="M22,15 C16,10 8,10 7,14 C6,17 12,19 22,17" fill={inner} stroke="none" />
            <path d="M22,15 C28,10 36,10 37,14 C38,17 32,19 22,17" fill={inner} stroke="none" />

            {/* wing spots */}
            <circle cx="10" cy="14" r="2.2" fill="#fff" opacity="0.45" />
            <circle cx="34" cy="14" r="2.2" fill="#fff" opacity="0.45" />
            <circle cx="11" cy="28" r="1.5" fill="#fff" opacity="0.35" />
            <circle cx="33" cy="28" r="1.5" fill="#fff" opacity="0.35" />

            {/* body — tapered */}
            <path d="M22,10 Q22.5,18 22,28" stroke="#6b5040" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
    );
};

// ---------- Stars (night) ----------
export const Stars = () => {
    const positions = [
        { top: "5%", left: "10%" }, { top: "8%", left: "25%" },
        { top: "3%", left: "45%" }, { top: "12%", left: "60%" },
        { top: "6%", left: "75%" }, { top: "15%", left: "85%" },
        { top: "10%", left: "92%" }, { top: "20%", left: "15%" },
        { top: "18%", left: "35%" }, { top: "22%", left: "55%" },
        { top: "25%", left: "70%" }, { top: "28%", left: "88%" },
        { top: "14%", left: "5%" }, { top: "30%", left: "20%" },
        { top: "9%", left: "50%" }, { top: "32%", left: "40%" },
        { top: "16%", left: "65%" }, { top: "35%", left: "80%" },
        { top: "4%", left: "33%" }, { top: "26%", left: "48%" },
        { top: "7%", left: "58%" }, { top: "19%", left: "78%" },
        { top: "11%", left: "42%" }, { top: "33%", left: "12%" },
    ];
    return (
        <div className="stars-container">
            {positions.map((pos, i) => (
                <div key={i} className="star" style={pos} />
            ))}
        </div>
    );
};

// ---------- Grass (no base green rect) ----------
export const GrassStrip = ({ isDark }: { isDark: boolean }) => {
    const colors = isDark
        ? ["#1a5a2e", "#1e6b36", "#145223"]
        : ["#4caf50", "#66bb6a", "#43a047"];
    return (
        <svg className="grass-svg" viewBox="0 0 1440 55" preserveAspectRatio="none" fill="none">
            {Array.from({ length: 140 }).map((_, i) => {
                const x = i * 10.3 + (i % 3) * 2;
                const h = 22 + (i % 7) * 6;
                const lean = ((i % 5) - 2) * 3;
                const color = colors[i % 3];
                return (
                    <path
                        key={i}
                        d={`M${x},55 Q${x + lean},${55 - h * 0.5} ${x + lean * 1.5},${55 - h}`}
                        stroke={color}
                        strokeWidth={2 + (i % 3)}
                        fill="none"
                        strokeLinecap="round"
                    />
                );
            })}
        </svg>
    );
};

// ---------- SVG Filter Definitions (used across the page) ----------
export const SketchyFilters = () => (
    <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
            <filter id="sketchy">
                <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" result="noise" seed="2" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="sketchy-heavy">
                <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="5" result="noise" seed="3" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="sketchy-light">
                <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" result="noise" seed="5" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </defs>
    </svg>
);
