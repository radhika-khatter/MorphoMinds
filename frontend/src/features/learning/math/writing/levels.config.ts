export type WritingLevel = {
  level: number;
  title: string;
  description: string;
};

const mathWritingLevels: WritingLevel[] = [
  {
    level: 1,
    title: "Trace Numbers",
    description: "Trace digits 0–9 using guided dotted paths."
  },
  {
    level: 2,
    title: "Write Numbers",
    description: "Write numbers independently with stroke feedback."
  },
];

export default mathWritingLevels;
