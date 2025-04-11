import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const ReadingLevels = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();

  const subjectMap: Record<string, string> = {
    english: "English",
    hindi: "Hindi",
    math: "Math",
  };

  const lowerSubject = subject?.toLowerCase() || "";
  const subjectName = subjectMap[lowerSubject];

  if (!subjectName) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-xl text-red-500">
        Invalid subject: "{subject}"
      </div>
    );
  }

  const folderPrefix = `reading${subjectName}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">
          Reading Levels - {subjectName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level 1 */}
          <div
            className="p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/${folderPrefix}/level1`)}
          >
            <h3 className="text-xl font-semibold text-purple-500 mb-2">Level 1: Letters</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Practice recognizing and reading individual letters.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Progress: 70%</p>
          </div>

          {/* Level 2 */}
          <div
            className="p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/${folderPrefix}/level2`)}
          >
            <h3 className="text-xl font-semibold text-purple-500 mb-2">Level 2: Words & Sentences</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Move on to reading short words and understanding sentence flow.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Progress: 45%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingLevels;
