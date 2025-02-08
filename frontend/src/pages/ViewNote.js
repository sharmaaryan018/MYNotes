import React from "react";

const ViewNote = ({ fileUrl, onClose }) => {
  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-3/4 h-3/4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 font-bold text-lg"
        >
          X
        </button>

        {/* File Preview */}
        {fileUrl ? (
          <iframe
            src={fileUrl}
            title="File Preview"
            className="w-full h-full"
          ></iframe>
        ) : (
          <p className="text-center">No file to display.</p>
        )}
      </div>
    </div>
  );
};

export default ViewNote;
