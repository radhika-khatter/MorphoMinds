import { Link } from "react-router-dom";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import "@/components/common/board-content.css";

const GamesHome = () => {
  return (
    <SceneBackground>
      <SignBoard maxWidth="900px">
        <div className="board-section">

          {/* Title */}
          <h1 className="board-title">
            Games
          </h1>

          {/* Subtitle */}
          <p className="board-subtitle">
            Play short practice games to strengthen orientation, sound recognition, and sequencing.
          </p>

          {/* Games Grid */}
          <div className="board-grid">

            {/* Game 1 – Orientation Practice */}
            <Link
              to="/games/orientation"
              className="board-card"
            >
              <div className="board-card-title">
                🧠 Orientation Practice
              </div>
              <div className="board-card-text">
                Improve recognition of similar and mirror letters (b / d, प / व).
              </div>
            </Link>

            {/* Game 2 – Sound Match */}
            <Link
              to="/games/soundmatch"
              className="board-card"
            >
              <div className="board-card-title">
                🔊 Sound Match
              </div>
              <div className="board-card-text">
                Listen to a sound and select the correct letter or syllable.
              </div>
            </Link>

            {/* Game 3 – Sequence Builder */}
            <Link
              to="/games/sequence"
              className="board-card"
            >
              <div className="board-card-title">
                🧩 Sequence Builder
              </div>
              <div className="board-card-text">
                Arrange letters in the correct order to form words.
              </div>
            </Link>

            {/* Game 4 – Sequence Recall */}
            <Link
              to="/games/sequence-recall"
              className="board-card"
            >
              <div className="board-card-title">
                🔄 Sequence Recall
              </div>
              <div className="board-card-text">
                Memorize a short letter sequence and recreate it in the correct order.
              </div>
            </Link>

          </div>

        </div>
      </SignBoard>
    </SceneBackground>
  );
};

export default GamesHome;