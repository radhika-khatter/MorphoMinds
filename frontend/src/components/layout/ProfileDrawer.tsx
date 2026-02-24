import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileDrawer.css";

/* Hand-drawn SVG icons */
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M6 6l12 12" /><path d="M18 6L6 18" />
  </svg>
);

const FaqIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a3 3 0 015 1c0 2-3 2-3 4" />
    <circle cx="12" cy="18" r="0.5" fill="currentColor" />
  </svg>
);

const SupportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ==================================================================
   Helpers
   ================================================================== */
function getInitials(name: string): string {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatMemberSince(dateStr: string | null): string {
  if (!dateStr) return "—";
  const created = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  return `${years}y ${remMonths}m ago`;
}

/* ==================================================================
   ProfileDrawer — centered popup with dark overlay
   ================================================================== */
type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface UserProfile {
  name: string;
  email: string;
  age: number | null;
  createdAt: string | null;
}

const ProfileDrawer = ({ isOpen, onClose }: ProfileDrawerProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    fetch("http://localhost:3000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (r.ok) return r.json(); throw new Error("Failed"); })
      .then((data: UserProfile) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  const displayName = profile?.name || profile?.email || "User";
  const initials = getInitials(profile?.name || profile?.email || "U");
  const ageStr = profile?.age ? `${profile.age} years` : "—";
  const memberSince = formatMemberSince(profile?.createdAt || null);

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
        {/* Nails */}
        <span className="profile-nail profile-nail-tl" />
        <span className="profile-nail profile-nail-tr" />
        <span className="profile-nail profile-nail-bl" />
        <span className="profile-nail profile-nail-br" />

        {/* Close button */}
        <button className="profile-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        {loading ? (
          <div className="profile-loading">Loading…</div>
        ) : (
          <>
            {/* Avatar + Name */}
            <div className="profile-avatar-section">
              <div className="profile-avatar">{initials}</div>
              <h2 className="profile-name">{displayName}</h2>
              {profile?.email && profile?.name && (
                <span className="profile-email">{profile.email}</span>
              )}
            </div>

            {/* Info rows */}
            <div className="profile-info">
              <div className="profile-info-row">
                <span className="profile-info-label">Age</span>
                <span className="profile-info-value">{ageStr}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Member Since</span>
                <span className="profile-info-value">{memberSince}</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="profile-nav">
              <button className="profile-nav-item" onClick={() => handleNavigation("/faqs")}>
                <FaqIcon /><span>FAQs</span>
              </button>
              <button className="profile-nav-item" onClick={() => handleNavigation("/support")}>
                <SupportIcon /><span>Customer Support</span>
              </button>
              <button className="profile-nav-item" onClick={() => handleNavigation("/settings")}>
                <SettingsIcon /><span>Settings</span>
              </button>
            </div>

            {/* Logout */}
            <button className="profile-logout" onClick={handleLogout}>
              <LogoutIcon /><span>Log Out</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDrawer;
