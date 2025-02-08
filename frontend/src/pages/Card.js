// src/components/Card.js
import React from "react";

const Card = ({ title, description, additionalInfo, actions }) => {
  return (
    <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
      <h3 className="text-xl font-bold text-blue-400">{title}</h3>
      <p className="text-sm text-gray-400 mt-2">{description}</p>

      {additionalInfo &&
        additionalInfo.map((info, index) => (
          <p key={index} className="text-sm mt-1">
            {info.label}: <span className="text-gray-300">{info.value}</span>
          </p>
        ))}

      <div className="flex justify-between mt-4">
        {actions &&
          actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex items-center space-x-2 ${action.buttonClass} py-2 px-4 rounded-lg shadow-md`}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Card;
