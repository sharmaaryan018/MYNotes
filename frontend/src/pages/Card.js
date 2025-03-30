// src/components/Card.js
import React from "react";
import { IoMdBookmark } from "react-icons/io";
import { FaStar } from "react-icons/fa";

const Card = ({ 
  _id,
  title, 
  subject, 
  institution, 
  type,
  status,
  rejectionReason,
  examType,
  year,
  semester,
  rating,
  uploadedBy = { name: "Unknown", avatar: null },
  actions,
  isBookmarked = false,
  onToggleBookmark
}) => {
  // Function to format exam details
  const getExamDetails = () => {
    if (type === 'PYQ' && examType && year) {
      return `${examType.charAt(0).toUpperCase() + examType.slice(1)} ${year}${semester ? ` • Sem ${semester}` : ''}`;
    }
    return '';
  };

  console.log("card",isBookmarked);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            {type === 'PYQ' && (
              <span className="text-sm text-gray-500">
                • {getExamDetails()}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">{subject}</p>
        </div>
        <div className="flex items-center ml-2">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
            status === 'Approved' ? 'bg-green-100 text-green-800' :
            status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {status}
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {type}
          </span>
        </div>
      </div>

            {/* Rejection Reason - Only show for rejected notes */}
            {status === 'Rejected' && rejectionReason && (
        <div className="mb-3 p-2 bg-red-50 rounded-md">
          <p className="text-sm text-red-700">
            <span className="font-medium">Rejection Reason: </span>
            {rejectionReason}
          </p>
        </div>
      )}

      {/* Institution */}
      <div className="flex items-center mb-3">
        <svg className="w-4 h-4 text-gray-500 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-sm text-gray-600">{institution}</span>
      </div>

      {/* Rating and Uploader */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FaStar className="text-yellow-400 w-4 h-4" />
          <span className="ml-1 text-sm text-gray-600">{rating || 'N/A'}</span>
        </div>
        {uploadedBy && (
          <div className="flex items-center">
            {uploadedBy.avatar ? (
              <img 
                src={uploadedBy.avatar} 
                alt={uploadedBy.name}
                className="w-6 h-6 rounded-full mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(uploadedBy.name)}&background=random`;
                }}
              />
            ) : (
              <div className="w-6 h-6 rounded-full mr-2 bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {uploadedBy.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">{uploadedBy.name}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-sm">{action.label}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={() => onToggleBookmark?.()}
          className={`text-2xl ${isBookmarked ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <IoMdBookmark className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Card;
