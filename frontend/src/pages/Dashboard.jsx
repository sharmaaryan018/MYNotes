import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useDispatch } from 'react-redux';
import { fetchBookmarks } from '../utility/bookmarkSlice';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch bookmarks when Dashboard mounts
    dispatch(fetchBookmarks());
  }, [dispatch]);

  return (
    <div className="flex bg-red-50 min-h-screen">
      {/* Sidebar */}
      <Navbar/>
      <Sidebar onExpandChange={setIsSidebarExpanded} />
      

      {/* Main Content Container */}
      <div className={`flex-1 transition-all duration-300  bg-red-50
        ${isSidebarExpanded ? 'ml-64' : 'ml-[48px]'}
        `}>
          <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
