import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import ProfileDrawer from "@/components/layout/ProfileDrawer";
import "./Dashboard.css";

const subjects = ["hindi", "english", "math"] as const;
type Subject = (typeof subjects)[number];

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<Subject>("hindi");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleCardClick = (type: "reading" | "writing") => {
    navigate(`/${type}/${selectedSubject}`);
  };

  return (
    <SceneBackground onProfileOpen={() => setIsProfileOpen(true)}>
      <SignBoard maxWidth="800px">
        <div className="dashboard-content">

          {/* Greeting */}
          <div className="dashboard-greeting">
            <h1>Choose a Subject</h1>
            <p>
              Pick a subject and start learning with reading and writing exercises.
            </p>
          </div>

          {/* Subject Tabs */}
          <div className="subject-tabs">
            {subjects.map((sub) => (
              <button
                key={sub}
                className={`subject-tab ${
                  selectedSubject === sub ? "active" : ""
                }`}
                onClick={() => setSelectedSubject(sub)}
              >
                {capitalize(sub)}
              </button>
            ))}
          </div>

          {/* Progress Cards */}
          <div className="progress-cards">
            <button
              className="progress-card"
              onClick={() => handleCardClick("reading")}
            >
              <div className="progress-card-icon">📖</div>
              <div className="progress-card-title">
                {capitalize(selectedSubject)} Reading
              </div>

              <div className="progress-bar-label">
                <span>Progress</span>
                <span>70%</span>
              </div>

              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: "70%" }}
                />
              </div>
            </button>

            <button
              className="progress-card"
              onClick={() => handleCardClick("writing")}
            >
              <div className="progress-card-icon">✏️</div>
              <div className="progress-card-title">
                {capitalize(selectedSubject)} Writing
              </div>

              <div className="progress-bar-label">
                <span>Progress</span>
                <span>50%</span>
              </div>

              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: "50%" }}
                />
              </div>
            </button>
          </div>
          {/* Practice Game */}
<div className="practice-game">
  <button
    className="practice-card"
    onClick={() => navigate(`/reading/${selectedSubject}/game`)}
  >
    <div className="practice-icon">🎮</div>
    <div className="practice-title">Practice Game</div>
    <div className="practice-desc">
      Improve recognition of similar letters (e.g. ब / व, b / d)
    </div>
  </button>
</div>
        </div>
        
      </SignBoard>
        <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

    </SceneBackground>
  );
};

export default Dashboard;