import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex bg-gradient-to-b from-gray-800 to-black min-h-screen">
      {/* Sidebar with fixed width */}
      <Sidebar className="w-64" />

      {/* Main Content Area */}
      <div className="flex-1 p-4 transition-all duration-300 ml-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
