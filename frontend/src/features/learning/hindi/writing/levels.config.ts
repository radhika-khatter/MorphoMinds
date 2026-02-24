export type WritingLevel = {
  level: number;
  title: string;
  description: string;
};

const hindiWritingLevels: WritingLevel[] = [
  {
    level: 1,
    title: "स्वर और व्यंजन ट्रेसिंग",
    description: "दिए गए डॉटेड गाइड पर हिंदी स्वर और व्यंजन ट्रेस करें।"
  },
  {
    level: 2,
    title: "अक्षर लेखन",
    description: "बिना गाइड के हिंदी अक्षर सही स्ट्रोक क्रम से लिखें।"
  }
];

export default hindiWritingLevels;
