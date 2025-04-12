// src/components/writingEnglish/level1/Instructions.tsx

import { useState } from "react";

const Instructions = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Level 1: Tracing Instructions</h2>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
        <li>Select a letter from A to Z.</li>
        <li>Trace the dotted letter shown on the canvas.</li>
        <li>If your stroke deviates, it turns red. If it's correct, it stays green.</li>
        <li>Complete all letters to finish the level.</li>
      </ul>
      <button
        onClick={onStart}
        className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Start Tracing
      </button>
    </div>
  );
};

export default Instructions;


