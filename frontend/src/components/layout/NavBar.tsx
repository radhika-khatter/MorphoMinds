import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
        <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M6 6l12 12" /><path d="M18 6L6 18" />
    </svg>
);

const SunSmallIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
);

const MoonSmallIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
);

/* ==================================================================
   NavBar
   Desktop:  [Title]  ----  [slab: ← → | 👤]  ----  [☀/🌙]
   Mobile:   [slab: ←]  [Title]  [☰ → dropdown]
   ================================================================== */
interface NavBarProps {
    onProfileOpen?: () => void;
    hideControls?: boolean;
}

const NavBar = ({ onProfileOpen, hideControls }: NavBarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const [menuOpen, setMenuOpen] = useState(false);

    // Track history position for back/forward buttons
    const historyIdx = (window.history.state?.idx as number) ?? 0;
    const maxIdx = useRef(historyIdx);
    useEffect(() => {
        if (historyIdx > maxIdx.current) maxIdx.current = historyIdx;
    }, [historyIdx]);

    const canGoBack = historyIdx > 0;
    const canGoForward = historyIdx < maxIdx.current;

    return (
        <nav className="navbar">
            {/* ---- DESKTOP ---- */}
            <span className="navbar-title navbar-desktop-only">MorphoMinds</span>

            {!hideControls && (
                <div className="navbar-slab navbar-desktop-only">
                    <button className="navbar-slab-btn" onClick={() => navigate(-1)} disabled={!canGoBack} aria-label="Go back">
                        <BackIcon />
                    </button>
                    <button className="navbar-slab-btn" onClick={() => navigate(1)} disabled={!canGoForward} aria-label="Go forward">
                        <ForwardIcon />
                    </button>
                    <div className="navbar-slab-divider" />
                    <button className="navbar-slab-btn" onClick={onProfileOpen} aria-label="Profile">
                        <ProfileIcon />
                    </button>
                </div>
            )}

            <button className="navbar-theme-btn navbar-desktop-only" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle theme">
                {isDark ? <MoonSVG /> : <SunSVG />}
            </button>

            {/* ---- MOBILE ---- */}
            {!hideControls && (
                <button className="navbar-hamburger navbar-mobile-only" onClick={() => navigate(-1)} disabled={!canGoBack} aria-label="Go back">
                    <BackIcon />
                </button>
            )}

            <span className="navbar-title navbar-mobile-only">MorphoMinds</span>

            <button className="navbar-hamburger navbar-mobile-only" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="navbar-dropdown">
                    <button className="navbar-dropdown-item" onClick={() => { setTheme(isDark ? "light" : "dark"); setMenuOpen(false); }}>
                        {isDark ? <SunSmallIcon /> : <MoonSmallIcon />}
                        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                    <button className="navbar-dropdown-item" onClick={() => { onProfileOpen?.(); setMenuOpen(false); }}>
                        <ProfileIcon />
                        <span>Profile</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
