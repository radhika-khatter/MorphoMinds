import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import FAQsPage from "@/pages/FAQs";
import SupportPage from "@/pages/Support";
import SettingsPage from "@/pages/Settings";

import GameCard from "@/features/game/GameCard";
import OrientationGame from "@/features/game/OrientationGame";
import SoundMatchGame from "@/features/game/SoundMatchGame";
import SequenceBuilderGame from "@/features/game/SequenceBuilderGame";

import ReadingHome from "@/features/learning/reading/ReadingHome";
import WritingHome from "@/features/learning/writing/WritingHome";

import EngReadLevel1 from "@/features/learning/english/reading/levels/level1";
import EngReadLevel2 from "@/features/learning/english/reading/levels/level2";
import EngReadLevel3 from "@/features/learning/english/reading/levels/level3";
import EngReadLevel4 from "@/features/learning/english/reading/levels/level4";
import EngReadLevel5 from "@/features/learning/english/reading/levels/level5";

import EngWriteLevel1 from "@/features/learning/english/writing/levels/level1";
import EngWriteLevel2 from "@/features/learning/english/writing/levels/level2";
import EngWriteLevel3 from "@/features/learning/english/writing/levels/level3";
import EngWriteLevel4 from "@/features/learning/english/writing/levels/level4";

import HindiReadLevel1 from "@/features/learning/hindi/reading/levels/level1";
import HindiReadLevel2 from "@/features/learning/hindi/reading/levels/level2";

import HindiWriteLevel1 from "@/features/learning/hindi/writing/levels/level1";
import HindiWriteLevel2 from "@/features/learning/hindi/writing/levels/level2";

import MathReadLevel1 from "@/features/learning/math/reading/levels/level1";

import MathWriteLevel1 from "@/features/learning/math/writing/levels/level1";
import MathWriteLevel2 from "@/features/learning/math/writing/levels/level2";
import SequenceRecallGame from "@/features/game/SequenceRecall";

import Community from "@/pages/Community";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/settings" element={<SettingsPage />} />


        <Route path="/reading/:subject" element={<ReadingHome />} />
        <Route path="/writing/:subject" element={<WritingHome />} />

        <Route path="/reading/english/level1" element={<EngReadLevel1 />} />
        <Route path="/reading/english/level2" element={<EngReadLevel2 />} />
        <Route path="/reading/english/level3" element={<EngReadLevel3 />} />
        <Route path="/reading/english/level4" element={<EngReadLevel4 />} />
        <Route path="/reading/english/level5" element={<EngReadLevel5 />} />

        <Route path="/writing/english/level1" element={<EngWriteLevel1 />} />
        <Route path="/writing/english/level2" element={<EngWriteLevel2 />} />
        <Route path="/writing/english/level3" element={<EngWriteLevel3 />} />
        <Route path="/writing/english/level4" element={<EngWriteLevel4 />} />

        <Route path="/reading/hindi/level1" element={<HindiReadLevel1 />} />
        <Route path="/reading/hindi/level2" element={<HindiReadLevel2 />} />

        <Route path="/writing/hindi/level1" element={<HindiWriteLevel1 />} />
        <Route path="/writing/hindi/level2" element={<HindiWriteLevel2 />} />

        <Route path="/reading/math/level1" element={<MathReadLevel1 />} />
        
        <Route path="/games" element={<GameCard />} />
        <Route path="/games/orientation" element={<OrientationGame />}/>
        <Route path="/games/soundmatch" element={<SoundMatchGame />} />
        <Route path="/games/sequence" element={<SequenceBuilderGame />} />

        <Route path="/community"  element={<Community/>}/>


        <Route path="/writing/math/level1" element={<MathWriteLevel1 />} />
        <Route path="/writing/math/level2" element={<MathWriteLevel2 />} />
        <Route path="/games/sequence-recall" element={<SequenceRecallGame />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
