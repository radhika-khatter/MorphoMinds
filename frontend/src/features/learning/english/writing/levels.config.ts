export type WritingLevel = {
  level: number;
  title: string;
  description: string;
};

const englishWritingLevels: WritingLevel[] = [
  {
    level: 1,
    title: "Letter Tracing",
    description: "Trace A–Z letters using dotted guides and stroke feedback."
  },
  {
    level: 2,
     title: "Stroke Order Practice",
    description: "Perform stroke formation step by step"
  },
  {
    level: 3,
    title: "Write Mirror letters",
    description: "Mirror letter practice."
  
  },
   {
    level: 4,
     title: "Write Letters",
    description: "Write letters without guides with real-time accuracy feedback."
   
  },
  
];

export default englishWritingLevels;
