import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { SunSVG, MoonSVG } from "@/components/scene/HomeSVGs";
import "./NavBar.css";

/* ==================================================================
   Icons
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

  /* ==================================================================
     🔥 BULLETPROOF GLOBAL FONT SWITCH
     ================================================================== */
  useEffect(() => {
    const styleId = "dynamic-font-style";
    let styleTag = document.getElementById(styleId);

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    if (isDyslexicFont) {
      styleTag.innerHTML = `
        * {
          font-family: 'OpenDyslexic', sans-serif !important;
        }
      `;
    } else {
      styleTag.innerHTML = `
        * {
          font-family: 'Inter', system-ui, sans-serif !important;
        }
      `;
    }
  }, [isDyslexicFont]);

  /* ==================================================================
     History tracking
     ================================================================== */
  const historyIdx = window.history.state?.idx ?? 0;
  const maxIdx = useRef(historyIdx);

  useEffect(() => {
    if (historyIdx > maxIdx.current) {
      maxIdx.current = historyIdx;
    }
  }, [historyIdx]);

  const canGoBack = historyIdx > 0;
  const canGoForward = historyIdx < maxIdx.current;

  return (
    <nav className="navbar">

      {/* Desktop Title */}
      <span className="navbar-title navbar-desktop-only">
        MorphoMinds
      </span>

      {/* Desktop Navigation Slab */}
      {!hideControls && (
        <div className="navbar-slab navbar-desktop-only">
          <button
            className="navbar-slab-btn"
            onClick={() => navigate(-1)}
            disabled={!canGoBack}
          >
            <BackIcon />
          </button>

          <button
            className="navbar-slab-btn"
            onClick={() => navigate(1)}
            disabled={!canGoForward}
          >
            <ForwardIcon />
          </button>

          <div className="navbar-slab-divider" />

          <button
            className="navbar-slab-btn"
            onClick={onProfileOpen}
          >
            <ProfileIcon />
          </button>
        </div>
      )}

      {/* Right Controls */}
      <div className="navbar-desktop-only navbar-right-controls">

        {/* Dyslexia Toggle */}
        <div className="navbar-dyslexia-toggle">

          <div className="slider-wrapper">
            <button
              className={`toggle-switch ${isDyslexicFont ? "active" : ""}`}
              onClick={() => setIsDyslexicFont(prev => !prev)}
              aria-label="Toggle Dyslexia Mode"
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          <div className="label-wrapper">
            <span className="toggle-label">
              Dyslexia Mode
            </span>
          </div>

        </div>

        {/* Theme Toggle */}
        <button
          className="navbar-theme-btn"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {isDark ? <MoonSVG /> : <SunSVG />}
        </button>

      </div>

      {/* Mobile Back Button */}
      {!hideControls && (
        <button
          className="navbar-hamburger navbar-mobile-only"
          onClick={() => navigate(-1)}
          disabled={!canGoBack}
        >
          <BackIcon />
        </button>
      )}

      <span className="navbar-title navbar-mobile-only">
        MorphoMinds
      </span>

      <button
        className="navbar-hamburger navbar-mobile-only"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

    </nav>
  );
};

export default NavBar;