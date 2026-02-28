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

/* ✅ Community Button Component */
const CommunityButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="navbar-slab-btn navbar-community-btn"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="12" r="3" />
      <circle cx="12" cy="6" r="3" />
      <path d="M9 14c1 2 5 2 6 0" />
    </svg>
    <span>Community</span>
  </button>
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
<<<<<<< HEAD
   Font Toggle Icons
   ================================================================== */

const FontDefaultIcon = () => (
  <svg width="32" height="32" viewBox="0 0 100 100">
    <text x="50%" y="68%" textAnchor="middle" fontSize="64" fontWeight="900">
      A
    </text>
  </svg>
);

const FontDyslexicIcon = () => (
  <svg width="32" height="32" viewBox="0 0 100 100">
    <text
      x="50%"
      y="68%"
      textAnchor="middle"
      fontSize="64"
      fontWeight="900"
      style={{ fontFamily: "'OpenDyslexic', sans-serif" }}
    >
      A
    </text>
  </svg>
);

/* ==================================================================
=======
>>>>>>> df123e92931fdbe3042b6afcec904b228ce81288
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

<<<<<<< HEAD
  /* Apply font globally */
  useEffect(() => {
    const root = document.documentElement;
    isDyslexicFont
      ? root.classList.add("TEST_DYSLEXIC")
      : root.classList.remove("TEST_DYSLEXIC");
  }, [isDyslexicFont]);

  /* History tracking */
=======
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
>>>>>>> df123e92931fdbe3042b6afcec904b228ce81288
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
<<<<<<< HEAD
      {/* Desktop Title */}
      <span className="navbar-title navbar-desktop-only">
        MorphoMinds
      </span>

      {/* Desktop Controls */}
=======

      {/* Desktop Title */}
      <span className="navbar-title navbar-desktop-only">
        MorphoMinds
      </span>

      {/* Desktop Navigation Slab */}
>>>>>>> df123e92931fdbe3042b6afcec904b228ce81288
      {!hideControls && (
        <div className="navbar-slab navbar-desktop-only">
          <button
            className="navbar-slab-btn"
            onClick={() => navigate(-1)}
            disabled={!canGoBack}
          >
            <BackIcon />
          </button>

<<<<<<< HEAD
          <button className="navbar-slab-btn" onClick={() => navigate(1)} disabled={!canGoForward}>
=======
          <button
            className="navbar-slab-btn"
            onClick={() => navigate(1)}
            disabled={!canGoForward}
          >
>>>>>>> df123e92931fdbe3042b6afcec904b228ce81288
            <ForwardIcon />
          </button>

          <div className="navbar-slab-divider" />

<<<<<<< HEAD
          <button className="navbar-slab-btn" onClick={onProfileOpen}>
=======
          <button
            className="navbar-slab-btn"
            onClick={onProfileOpen}
          >
>>>>>>> df123e92931fdbe3042b6afcec904b228ce81288
            <ProfileIcon />
          </button>

          <CommunityButton onClick={() => navigate("/community")} />
        </div>
      )}

      {/* Right Controls */}
      <div className="navbar-desktop-only navbar-right-controls">
<<<<<<< HEAD
        <button
          className="navbar-theme-btn navbar-font-toggle"
          onClick={() => setIsDyslexicFont((p) => !p)}
        >
          {isDyslexicFont ? <FontDyslexicIcon /> : <FontDefaultIcon />}
        </button>
=======

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
>>>>>>> df123e92931fdbe3042b6afcec904b228ce81288

        <button
          className="navbar-theme-btn"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <MoonSVG /> : <SunSVG />}
        </button>

      </div>

<<<<<<< HEAD
      {/* Mobile Back */}
=======
      {/* Mobile Back Button */}
>>>>>>> df123e92931fdbe3042b6afcec904b228ce81288
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

<<<<<<< HEAD
      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="navbar-dropdown">
          <button
            className="navbar-dropdown-item"
            onClick={() => navigate("/community")}
          >
            Community
          </button>

          <button
            className="navbar-dropdown-item"
            onClick={() => {
              setTheme(isDark ? "light" : "dark");
              setMenuOpen(false);
            }}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            className="navbar-dropdown-item"
            onClick={() => {
              setIsDyslexicFont((p) => !p);
              setMenuOpen(false);
            }}
          >
            Font
          </button>

          <button
            className="navbar-dropdown-item"
            onClick={() => {
              onProfileOpen?.();
              setMenuOpen(false);
            }}
          >
            Profile
          </button>
        </div>
      )}
=======
>>>>>>> df123e92931fdbe3042b6afcec904b228ce81288
    </nav>
  );
};

export default NavBar;