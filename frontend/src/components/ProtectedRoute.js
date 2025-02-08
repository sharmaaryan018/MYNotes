import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";


const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("token"); // Fetch the logged-in user

  if (!user) {
    // If no user is logged in, redirect to login page
    toast.error("You must be logged in to access this page.");
    return <Navigate to="/login" />;
  }

  // If the user is logged in, render the child component (protected page)
  return children;
};

export default ProtectedRoute;
