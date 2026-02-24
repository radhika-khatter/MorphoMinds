import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  title: string;
  progressPercentage: number;
  activeColor?: string;
  onClick?: () => void; // 🔁 Optional click handler for navigation
}

const ProgressCard = ({
  title,
  progressPercentage,
  activeColor = "purple",
  onClick,
}: ProgressCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Always return purple for consistent branding
  const getProgressBarColor = () => {
    return "bg-purple-500";
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm animate-scale-in transition-all duration-300 hover:shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-xl font-bold mb-6 dark:text-white">{title}</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium dark:text-gray-200">Progress</span>
          <span className="text-sm font-medium dark:text-gray-200">
            {progressPercentage}%
          </span>
        </div>
        <Progress
          value={progressPercentage}
          className={`h-2 bg-blue-100 dark:bg-gray-700 ${
            isHovered ? "animate-pulse" : ""
          }`}
          indicatorClassName={getProgressBarColor()}
        />
      </div>
    </div>
  );
};

export default ProgressCard;
