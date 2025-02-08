import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService"; // Import login API function
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../utility/authSlice";

const Login = ({ setIsLoggedIn }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  // Submit handler
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(formData, dispatch,navigate); // Call login API
      dispatch(setToken(response.token));
      dispatch(setUserData(response.user));

      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.user._id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          role: response.user.role,
          college: response.user.college,
        })
      );
      toast.success("Logged In Successfully!");

      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
      console.error("Error in submitHandler:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-300 opacity-30 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6 relative z-10">
        <div className="text-center">
          {/* Animated Icon */}
          <div className="w-16 h-16 bg-indigo-500 text-white rounded-full mx-auto flex items-center justify-center animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01m-6.93 3.22a9 9 0 1113.86 0M15 19h5m-5 0H9m0 0H4"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">Welcome Back</h2>
          <p className="text-gray-600 text-sm mt-1">
            Login to access your dashboard.
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6 mt-6">
          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Image Section */}

      </div>
      
    </div>
    
    
  );
};

export default Login;
