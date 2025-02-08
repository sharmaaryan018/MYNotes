import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { logout } from "../utility/authSlice";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get `isLoggedIn` state from Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
    toast.success(`Dark mode ${!darkMode ? "enabled" : "disabled"}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out");
    navigate("/login");
  };

  return (
    <div
      className={`flex w-full justify-between items-center px-6 py-4 shadow-lg fixed z-50 ${
        darkMode
          ? "bg-gray-900 text-white border-b-gray-700"
          : "bg-zinc-900 text-white"
      }`}
    >
      <Link to="/">
        <div className="font-mono font-bold tracking-widest text-2xl hover:text-yellow-400 transition">
          NO-ATKT
        </div>
      </Link>
      <nav>
        <ul className="flex gap-6 text-lg">
          <li>
            <Link to="/" className="hover:text-yellow-400 transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-yellow-400 transition duration-300">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-yellow-400 transition duration-300">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center px-4 py-2 rounded-full transition duration-300 focus:outline-none hover:bg-gray-700"
      >
        {darkMode ? (
          <SunIcon className="w-6 h-6 text-yellow-400" />
        ) : (
          <MoonIcon className="w-6 h-6 text-gray-300" />
        )}
      </button>
      <div className="flex gap-6 items-center">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg border-2 border-transparent hover:border-blue-300 focus:outline-none transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg border-2 border-transparent hover:border-blue-300 focus:outline-none transition duration-300">
                Signup
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg border-2 border-transparent hover:border-green-300 focus:outline-none transition duration-300">
                Dashboard
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg border-2 border-transparent hover:border-red-300 focus:outline-none transition duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
