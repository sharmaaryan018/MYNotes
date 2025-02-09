import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar Section */}
      <div className="w-1/4 bg-gray-800 text-white p-4 min-h-screen">
        <Sidebar />
      </div>

      {/* Main Content Section */}
      <div className="w-3/4 p-4">
        <Outlet /> {/* This will render BrowseNotes or other child routes */}
      </div>
    </div>
  );
};

export default Dashboard;
