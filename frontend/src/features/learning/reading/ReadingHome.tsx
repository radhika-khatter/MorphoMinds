import { Link, useParams } from "react-router-dom";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import "@/components/common/board-content.css";

import englishLevels from "@/features/learning/english/reading/levels.config";
import mathLevels from "../math/reading/levels.congif";
import hindiLevels from "../hindi/reading/levels.config";

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const subjectLevelsMap: Record<string, any[]> = {
  english: englishLevels,
  hindi: hindiLevels,
  math: mathLevels,
};

const ReadingHome = () => {
  const { subject } = useParams();
  const levels = subject
    ? subjectLevelsMap[subject.toLowerCase()]
    : null;

  if (!levels) {
    return <div className="p-10">No reading data for {subject}</div>;
  }

  return (
    <SceneBackground>
      <SignBoard maxWidth="900px">
        <div className="board-section">

          {/* Title */}
          <h1 className="board-title">
            {capitalize(subject)} Reading
          </h1>

          {/* Subtitle */}
          <p className="board-subtitle">
            Choose a level and begin your reading practice.
          </p>

          {/* Levels Grid */}
          <div className="board-grid">
            {levels.map((lvl) => (
              <Link
                key={lvl.level}
                to={`/reading/${subject}/level${lvl.level}`}
                className="board-card"
              >
                <div className="board-card-title">
                  Level {lvl.level}: {lvl.title}
                </div>

                <div className="board-card-text">
                  {lvl.description}
                </div>

                {lvl.duration && (
                  <div className="board-card-meta">
                    ⏱ {lvl.duration}
                  </div>
                )}
              </Link>
            ))}
          </div>

        </div>
      </SignBoard>
    </SceneBackground>
  );
};

export default ReadingHome;