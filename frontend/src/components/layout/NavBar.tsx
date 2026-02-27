import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { SunSVG, MoonSVG } from "@/components/scene/HomeSVGs";
import "./NavBar.css";

/* ==================================================================
   Hand-drawn SVG icons
   ================================================================== */

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 19c-1-1.5-5-5.5-7-7 2-1.5 6-5.5 7-7" />
    <path d="M8 12h12" />
  </svg>
);

const ForwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5c1 1.5 5 5.5 7 7-2 1.5-6 5.5-7 7" />
    <path d="M4 12h12" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4.5" />
    <path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </svg>
);

/* ==================================================================
   Font Toggle Icons (A ↔ 𝒜)
   ================================================================== */

const FontDefaultIcon = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <text
      x="50%"
      y="68%"
      textAnchor="middle"
      fontSize="64"
      fontWeight="900"
      fill="currentColor"
      style={{ fontFamily: "inherit" }}
    >
      A
    </text>
  </svg>
);

const FontDyslexicIcon = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <text
      x="50%"
      y="68%"
      textAnchor="middle"
      fontSize="64"
      fontWeight="900"
      fill="currentColor"
      style={{ fontFamily: "'OpenDyslexic', sans-serif" }}
    >
      A
    </text>
  </svg>
);

/* ==================================================================
   NavBar
   ================================================================== */

interface NavBarProps {
  onProfileOpen?: () => void;
  hideControls?: boolean;
}

const NavBar = ({ onProfileOpen, hideControls }: NavBarProps) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const [menuOpen, setMenuOpen] = useState(false);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);

  /* ---------- Apply font globally ---------- */
  useEffect(() => {
  console.log("isDyslexicFont =", isDyslexicFont);
}, [isDyslexicFont]);
/* ---------- Apply font globally (FIXED) ---------- */
useEffect(() => {
  const root = document.documentElement;

  if (isDyslexicFont) {
    root.classList.add("TEST_DYSLEXIC");
  } else {
    root.classList.remove("TEST_DYSLEXIC");
  }

  console.log("HTML classes:", root.className);
}, [isDyslexicFont]);

  /* ---------- History tracking ---------- */
  const historyIdx = (window.history.state?.idx ?? 0);
  const maxIdx = useRef(historyIdx);

  useEffect(() => {
    if (historyIdx > maxIdx.current) maxIdx.current = historyIdx;
  }, [historyIdx]);

  const canGoBack = historyIdx > 0;
  const canGoForward = historyIdx < maxIdx.current;

  return (
    <nav className="navbar">
      {/* ---------- DESKTOP ---------- */}
      <span className="navbar-title navbar-desktop-only">MorphoMinds</span>

      {!hideControls && (
        <div className="navbar-slab navbar-desktop-only">
          <button className="navbar-slab-btn" onClick={() => navigate(-1)} disabled={!canGoBack}>
            <BackIcon />
          </button>
          <button className="navbar-slab-btn" onClick={() => navigate(1)} disabled={!canGoForward}>
            <ForwardIcon />
          </button>
          <div className="navbar-slab-divider" />
          <button className="navbar-slab-btn" onClick={onProfileOpen}>
            <ProfileIcon />
          </button>
        </div>
      )}

      {/* ---------- RIGHT CONTROLS (DESKTOP) ---------- */}
      <div className="navbar-desktop-only navbar-right-controls">
        {/* Font Toggle (A ↔ 𝒜) */}
        <button
  className="navbar-theme-btn navbar-font-toggle"
  onClick={() => {
    console.log("FONT TOGGLE CLICKED");
    setIsDyslexicFont((prev) => !prev);
  }}
>
  {isDyslexicFont ? <FontDyslexicIcon /> : <FontDefaultIcon />}
</button>

        {/* Theme Toggle */}
        <button
          className="navbar-theme-btn"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {isDark ? <MoonSVG /> : <SunSVG />}
        </button>
      </div>

      {/* ---------- MOBILE ---------- */}
      {!hideControls && (
        <button className="navbar-hamburger navbar-mobile-only" onClick={() => navigate(-1)} disabled={!canGoBack}>
          <BackIcon />
        </button>
      )}

      <span className="navbar-title navbar-mobile-only">MorphoMinds</span>

      <button className="navbar-hamburger navbar-mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* ---------- MOBILE DROPDOWN ---------- */}
      {menuOpen && (
        <div className="navbar-dropdown">
          <button
            className="navbar-dropdown-item"
            onClick={() => {
              setTheme(isDark ? "light" : "dark");
              setMenuOpen(false);
            }}
          >
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button
            className="navbar-dropdown-item"
            onClick={() => {
              setIsDyslexicFont((prev) => !prev);
              setMenuOpen(false);
            }}
          >
            <span style={{ fontWeight: 900 }}>A</span>
            <span>Font</span>
          </button>

          <button
            className="navbar-dropdown-item"
            onClick={() => {
              onProfileOpen?.();
              setMenuOpen(false);
            }}
          >
            <ProfileIcon />
            <span>Profile</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;