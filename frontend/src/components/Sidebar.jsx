import React from "react";
import { Link } from "react-router-dom";
import { sidebarLinks } from "../common/sidebarLinks";
import * as VscIcons from "react-icons/vsc"; // Import all VSC icons

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        {sidebarLinks.map((link) => {
          const IconComponent = VscIcons[link.icon]; // Dynamically get the icon
          return (
            <li key={link.id}>
              <Link to={link.path} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                {IconComponent && <IconComponent size={20} />} {/* Render icon */}
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
