import { Link, useParams } from "react-router-dom";
import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";
import "@/components/common/board-content.css";

import englishWritingLevels from "@/features/learning/english/writing/levels.config";
import hindiWritingLevels from "@/features/learning/hindi/writing/levels.config";
import mathWritingLevels from "@/features/learning/math/writing/levels.config";

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const subjectWritingMap: Record<string, any[]> = {
  english: englishWritingLevels,
  hindi: hindiWritingLevels,
  math: mathWritingLevels,
};

const WritingHome = () => {
  const { subject } = useParams();

  const levels = subject
    ? subjectWritingMap[subject.toLowerCase()]
    : null;

  if (!levels) {
    return <div className="p-10">No writing data for {subject}</div>;
  }

  return (
    <SceneBackground>
      <SignBoard maxWidth="900px">
        <div className="board-section">

          {/* Title */}
          <h1 className="board-title">
            {capitalize(subject)} Writing
          </h1>

          {/* Subtitle */}
          <p className="board-subtitle">
            Practice writing step by step to build strong handwriting skills.
          </p>

          {/* Levels Grid */}
          <div className="board-grid">
            {levels.map((lvl) => (
              <Link
                key={lvl.level}
                to={`/writing/${subject}/level${lvl.level}`}
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
                    ✍️ {lvl.duration}
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

export default WritingHome;