import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import { SketchyDialog, type DialogState } from "@/components/ui/SketchyDialog";

import "./LandingPage.css";

/* ==================================================================
   Home Component
   ================================================================== */
const LandingPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Custom dialog state
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const showDialog = useCallback((message: string, type: "success" | "error", onClose?: () => void) => {
    setDialog({ message, type, onClose });
  }, []);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch("http://localhost:3000/signin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: signinData.email, password: signinData.password }),
      });
      if (r.ok) {
        const d = await r.json();
        localStorage.setItem("token", d.token);
        showDialog("Signed in successfully!", "success", () => navigate("/dashboard"));
      } else {
        const msg = await r.text();
        showDialog(msg || "Invalid email or password", "error");
      }
    } catch (err) {
      console.error("Login failed:", err);
      showDialog("Could not connect to the server. Please try again later.", "error");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name.trim()) { showDialog("Please enter your name", "error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) { showDialog("Please enter a valid email address", "error"); return; }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(signupData.password)) {
      showDialog("Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)", "error"); return;
    }
    if (signupData.password !== signupData.confirmPassword) { showDialog("Passwords do not match", "error"); return; }
    try {
      const r = await fetch("http://localhost:3000/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: signupData.email, password: signupData.password, name: signupData.name }),
      });
      if (r.ok) {
        showDialog("Account created! You can now sign in.", "success", () => {
          setActiveTab("signin");
          setSignupData({ name: "", email: "", password: "", confirmPassword: "" });
        });
      } else {
        const msg = await r.text();
        showDialog(msg || "Something went wrong during sign up", "error");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      showDialog("Could not connect to the server. Please try again later.", "error");
    }
  };

  return (
    <SceneBackground>
      <SignBoard>
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to<br />MorphoMinds</h1>
          <p className="welcome-subtitle">
            Unlock your child's potential with fun, interactive reading and
            writing exercises designed to make learning a joyful adventure.
          </p>
        </div>

        <div className="board-divider" />

        <div className="auth-section">
          <div className="auth-tabs">
            <button className={`auth-tab ${activeTab === "signin" ? "active" : ""}`} onClick={() => setActiveTab("signin")}>Sign In</button>
            <button className={`auth-tab ${activeTab === "signup" ? "active" : ""}`} onClick={() => setActiveTab("signup")}>Sign Up</button>
          </div>

          {activeTab === "signin" && (
            <form onSubmit={handleSignin} className="auth-form">
              <div className="sketch-wrap">
                <input type="email" className="auth-input" placeholder="Email Address"
                  value={signinData.email} onChange={(e) => setSigninData({ ...signinData, email: e.target.value })} required />
              </div>
              <div className="sketch-wrap" style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} className="auth-input" placeholder="Password"
                  value={signinData.password} onChange={(e) => setSigninData({ ...signinData, password: e.target.value })} required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit" className="auth-submit">Sign In</button>
            </form>
          )}

          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="auth-form">
              <div className="sketch-wrap">
                <input type="text" className="auth-input" placeholder="Full Name"
                  value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} required />
              </div>
              <div className="sketch-wrap">
                <input type="email" className="auth-input" placeholder="Email Address"
                  value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} required />
              </div>
              <div className="sketch-wrap" style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} className="auth-input" placeholder="Password"
                  value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="sketch-wrap" style={{ position: "relative" }}>
                <input type={showConfirmPassword ? "text" : "password"} className="auth-input" placeholder="Confirm Password"
                  value={signupData.confirmPassword} onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })} required />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((p) => !p)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit" className="auth-submit">Sign Up</button>
            </form>
          )}
        </div>
      </SignBoard>

      {/* Custom Hand-drawn Dialog */}
      {dialog && (
        <SketchyDialog dialog={dialog} onDismiss={() => setDialog(null)} />
      )}
    </SceneBackground>
  );
};

export default LandingPage;
