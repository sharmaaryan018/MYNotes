import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "../common/sidebarLinks";
import * as VscIcons from "react-icons/vsc";

const Sidebar = ({ onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const location = useLocation();
  const iconSize = 24;
  const collapsedWidth = iconSize + 16;

  const handleExpand = (expanded) => {
    setIsExpanded(expanded);
    onExpandChange?.(expanded);
  };

  const isActive = (path) => {
    return location.pathname === path;
  }; 

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-30 transition-all duration-300 shadow-lg
                  ${isExpanded ? "w-64" : `w-[${collapsedWidth}px]`} 
                  bg-white border-r border-gray-200`}
    >
      <div className="h-full flex flex-col justify-between">
        <ul className="space-y-1 flex flex-col items-center p-3">
          {sidebarLinks.map((link) => {
            const IconComponent = VscIcons[link.icon];
            const active = isActive(link.path);

            return (
              <li key={link.id} className="w-full">
                <Link
                  to={link.path}
                  className={`flex items-center p-2 rounded-lg transition-all duration-300 w-full
                            ${active 
                              ? "bg-blue-50 text-blue-600" 
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                  onClick={() => {
                    handleExpand(true);
                    setSelectedId(link.id);
                  }}
                >
                  {IconComponent && (
                    <IconComponent 
                      size={iconSize} 
                      className={active ? "text-blue-600" : "text-gray-600"}
                    />
                  )}
                  <span
                    className={`ml-3 font-medium transition-opacity duration-300 ${
                      isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
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
          <div className="p-4">
            <button
              className="w-full py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
              onClick={() => handleExpand(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
