import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProgressCard from "@/components/ProgressCard";
import MovingBubbles from "@/components/MovingBubbles";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState("hindi");
  const [activeColor, setActiveColor] = useState("purple");
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-mount");
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("animate-fade-in");
      }, index * 150);
    });
  }, []);

  const handleTabChange = (value: string) => {
    setSelectedSubject(value);
    setActiveColor("purple"); // All same color for now
  };

  const getColorClasses = () => {
    return "bg-purple-500 text-white";
  };

  const handleCardClick = (type: string) => {
    if (type === "writing") {
      navigate(`/writing/${selectedSubject}`);
    } else if (type === "reading") {
      navigate(`/reading/${selectedSubject}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MovingBubbles />
      <Header />

      <main className="container mx-auto px-6 py-8 relative overflow-hidden z-10">
        <h1 className="text-4xl font-bold mb-6 animate-on-mount opacity-0 dark:text-white">
          Welcome to <span className="text-purple-500">MorphoMinds</span>
        </h1>

        <div className="mb-8 flex justify-center">
          <Tabs defaultValue="hindi" value={selectedSubject} onValueChange={handleTabChange}>
            <TabsList className="bg-transparent">
              {["hindi", "english", "math"].map((subject) => (
                <TabsTrigger
                  key={subject}
                  value={subject}
                  className={cn(
                    "text-base px-6 py-2 rounded-full transition-all duration-300",
                    selectedSubject === subject
                      ? getColorClasses()
                      : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {capitalize(subject)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProgressCard
            title={`${capitalize(selectedSubject)} Reading Progress`}
            progressPercentage={70}
            activeColor={activeColor}
            onClick={() => handleCardClick("reading")}
          />
          <ProgressCard
            title={`${capitalize(selectedSubject)} Writing Progress`}
            progressPercentage={50}
            activeColor={activeColor}
            onClick={() => handleCardClick("writing")}
          />
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-gray-500 text-sm dark:text-gray-400">
        © 2025 MorphoMinds. All rights reserved.
      </footer>
    </div>
  );
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default Index;
