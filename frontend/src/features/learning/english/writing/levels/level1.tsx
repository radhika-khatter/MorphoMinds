import { useState } from "react";

import SceneBackground from "@/components/layout/SceneBackground";
import SignBoard from "@/components/ui/SignBoard";

import Header from "@/components/layout/Header";
import Instructions from "../components/instructions";
import TracingCanvas from "../components/tracingCanvas";

import "@/components/common/level-page.css";
import "@/components/common/board-content.css";

const WritingEnglishLevel1 = () => {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <SceneBackground>
    

     
        <div className="level-container">
          <div className="level-card fade-in-up">

            {/* Nails */}
            <span className="level-nail level-nail-tl" />
            <span className="level-nail level-nail-tr" />
            <span className="level-nail level-nail-bl" />
            <span className="level-nail level-nail-br" />

            {showInstructions ? (
              <>
                <h1 className="level-title">
                  ✏️ Writing Practice — Level 1
                </h1>
                <p className="level-desc">
                  Trace the letters carefully by following the dotted guides.
                </p>

                <Instructions onStart={() => setShowInstructions(false)} />
              </>
            ) : (
              <>
                <h1 className="level-title">
                  ✍️ Trace the Letter
                </h1>
                <p className="level-desc">
                 Practice tracing letters with guided lines and real-time feedback.


                </p>

                <TracingCanvas />
              </>
            )}
          </div>
        </div>
    
    </SceneBackground>
  );
};

export default WritingEnglishLevel1;