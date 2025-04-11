import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 dark:from-gray-900 dark:to-gray-800 p-6">
      <h1 className="text-4xl font-bold text-purple-700 dark:text-white mb-8">Welcome to MorphoMinds</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/signin">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition duration-200">
            Sign In
          </button>
        </Link>

        <Link to="/signup">
          <button className="px-6 py-3 bg-white text-purple-600 border border-purple-600 rounded-lg shadow hover:bg-purple-100 transition duration-200">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
