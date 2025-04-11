import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        alert("Signed in successfully!");
        navigate("/main");
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700 dark:text-white">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <a href="/signup" className="text-purple-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
