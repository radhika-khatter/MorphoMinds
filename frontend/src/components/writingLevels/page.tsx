import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const WritingLevels = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();

  const subjectMap: Record<string, string> = {
    english: "English",
    hindi: "Hindi",
    math: "Math",
  };

  const lowerSubject = subject?.toLowerCase() || "";
  const subjectName = subjectMap[lowerSubject];

  // If invalid subject, show error
  if (!subjectName) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-xl text-red-500">
        Invalid subject: "{subject}"
      </div>
    );
  }

  const folderPrefix = `writing${subjectName}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">
          Writing Levels - {subjectName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level 1 */}
          <div
            className="p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/${folderPrefix}/level1`)}
          >
            <h3 className="text-xl font-semibold text-purple-500 mb-2">Level 1: Tracing</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Practice tracing letters with guided lines and real-time feedback.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Progress: 60%</p>
          </div>

          {/* Level 2 */}
          <div
            className="p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/${folderPrefix}/level2`)}
          >
            <h3 className="text-xl font-semibold text-purple-500 mb-2">Level 2: Writing Words</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Move on to forming words independently, focusing on spacing and accuracy.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Progress: 40%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingLevels;
