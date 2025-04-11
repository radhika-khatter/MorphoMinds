import { useState } from "react";
import Header from "@/components/Header";
import Instructions from "@/components/writingEnglish/instructions1";
import TracingCanvas from "@/components/writingEnglish/tracingCanvas";

const WritingEnglishLevel1 = () => {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Header />
      <div className="px-4 py-6 flex flex-col items-center justify-center w-full">
        {showInstructions ? (
          <Instructions onStart={() => setShowInstructions(false)} />
        ) : (
          <TracingCanvas />
        )}
      </div>
    </div>
  );
};

export default WritingEnglishLevel1;
