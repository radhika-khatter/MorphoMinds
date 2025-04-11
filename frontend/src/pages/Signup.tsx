import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        alert("Signed up successfully!");
        navigate("/signin");
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Something went wrong");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700 dark:text-white">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/signin" className="text-purple-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
