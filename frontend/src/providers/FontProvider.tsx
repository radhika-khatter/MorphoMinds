import { createContext, useContext, useEffect, useState } from "react";

type FontType = "sans" | "dyslexic";

interface FontContextType {
  font: FontType;
  toggleFont: () => void;
}

const FontContext = createContext<FontContextType | null>(null);

export const FontProvider = ({ children }: { children: React.ReactNode }) => {
  const [font, setFont] = useState<FontType>("sans");

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dyslexic");

    if (font === "dyslexic") {
      root.classList.add("dyslexic");
    }
  }, [font]);

  const toggleFont = () => {
    setFont((prev) => (prev === "sans" ? "dyslexic" : "sans"));
  };

  return (
    <FontContext.Provider value={{ font, toggleFont }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error("useFont must be used inside FontProvider");
  return ctx;
};