import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const ReadingMathLevel1 = () => {
  return (
    <SceneBackground>
     
        <div className="level-container">
          <div className="level-card fade-in-up">

            <span className="level-nail level-nail-tl" />
            <span className="level-nail level-nail-tr" />
            <span className="level-nail level-nail-bl" />
            <span className="level-nail level-nail-br" />

            <h1 className="level-title">🔢 Math Reading — Level 1</h1>
            <p className="level-desc">
              This level is under development. Fun number activities are coming soon!
            </p>

            <div
              style={{
                textAlign: "center",
                padding: "36px 0",
              }}
            >
              <div className="level-letter" style={{ fontSize: "4rem" }}>
                🚀
              </div>
              <p className="level-word" style={{ marginTop: "12px" }}>
                Stay tuned!
              </p>
            </div>

          </div>
        </div>
     
    </SceneBackground>
  );
};

export default ReadingMathLevel1;