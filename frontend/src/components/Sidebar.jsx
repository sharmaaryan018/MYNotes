import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sidebarLinks } from "../common/sidebarLinks";
import * as VscIcons from "react-icons/vsc";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const iconSize = 24; // Icon size
  const collapsedWidth = iconSize + 12; // Sidebar width when collapsed

  return (
    <div
      className={`fixed top-0 left-0 h-screen transition-all duration-300 shadow-lg
                  ${isExpanded ? "w-1/5 bg-gray-800 px-4 py-6" : `w-[${collapsedWidth}px] bg-gray-900 px-2 py-4`}
                  ${isExpanded ? "rounded-none" : "rounded-full border-2 border-yellow-500 overflow-hidden"}`}
    >
      <ul className="space-y-4 flex flex-col items-center mt-10 text-white">
        {sidebarLinks.map((link) => {
          const IconComponent = VscIcons[link.icon];

          return (
            <li key={link.id} className="flex justify-center w-full">
              <Link
                to={link.path}
                className={`flex items-center p-2 rounded transition-all duration-300 w-full
                            ${selectedId === link.id ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"}`}
                onClick={() => {
                  setIsExpanded(true);
                  setSelectedId(link.id);
                }}
              >
                {IconComponent && <IconComponent size={iconSize} />}
                <span
                  className={`ml-2 transition-opacity duration-300 ${
                    isExpanded ? "opacity-100" : "opacity-0 w-0"
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Close Button */}
      {isExpanded && (
        <button
          className="mt-4 w-full text-center p-2 bg-red-600 rounded hover:bg-red-500"
          onClick={() => setIsExpanded(false)}
        >
          Close
        </button>
      )}
    </div>
  );
};

export default Sidebar;
