import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bookmark, FileText, Filter } from 'lucide-react';
import { toggleBookmark } from '../utility/bookmarkSlice'; // Ensure this import is correct
import Card from './Card';
import { Link } from 'react-router-dom';
import { IoMdEye, IoMdDownload } from 'react-icons/io';

const Bookmarks = () => {
  const dispatch = useDispatch();
  const { bookmarkedNotes, loading } = useSelector((state) => state.bookmark);
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter counts
  const notesCount = bookmarkedNotes.filter(note => note.type === 'Note').length;
  const pyqsCount = bookmarkedNotes.filter(note => note.type === 'PYQ').length;
  const allCount = bookmarkedNotes.length;

  // Filter notes based on selected filter
  const filteredNotes = bookmarkedNotes.filter(note => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Notes') return note.type === 'Note';
    if (activeFilter === 'PYQs') return note.type === 'PYQ';
    return true;
  });

  const FilterButton = ({ label, count, isActive }) => (
    <button
      onClick={() => setActiveFilter(label)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-blue-500 text-white' 
          : 'bg-white text-gray-600 hover:bg-gray-50'}`}
    >
      <span>{label}</span>
      <span className={`px-2 py-0.5 rounded-full text-xs 
        ${isActive ? 'bg-blue-400' : 'bg-gray-100'}`}>
        {count}
      </span>
    </button>
  );

  const handleDownload = (fileUrl, noteId) => {
    const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `note-${noteId}`;
    link.click();
  };

  const handleToggleBookmark = (note) => {
    dispatch(toggleBookmark(note, true));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Bookmark className="h-6 w-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Your Bookmarks</h1>
        </div>
        <p className="text-gray-500">Content you've saved for later</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Filter by:</span>
        </div>
        <div className="flex space-x-3">
          <FilterButton 
            label="All" 
            count={allCount} 
            isActive={activeFilter === 'All'} 
          />
          <FilterButton 
            label="Notes" 
            count={notesCount} 
            isActive={activeFilter === 'Notes'} 
          />
          <FilterButton 
            label="PYQs" 
            count={pyqsCount} 
            isActive={activeFilter === 'PYQs'} 
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : bookmarkedNotes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            You haven't bookmarked any content yet
          </h3>
          <div className="flex justify-center space-x-4 mt-4">
            <Link
              to="/browse-notes"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
            >
              Browse Notes
            </Link>
            <Link
              to="/browse-pyqs"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Browse PYQs
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card
              key={note._id}
              _id={note._id}
              title={note.title}
              subject={note.subject}
              institution={note.institution || note.college || "Unknown"}
              type={note.type}
              examType={note.pyqType}
              year={note.paperYear}
              semester={note.semester}
              rating={4.5}
              uploadedBy={{
                name: note.uploadedBy?.firstName 
                  ? `${note.uploadedBy.firstName} ${note.uploadedBy.lastName || ''}`
                  : "Unknown",
                avatar: note.uploadedBy?.profileImage || null
              }}
              isBookmarked={true}
              onToggleBookmark={() => handleToggleBookmark(note)}
              actions={[
                {
                  label: "View",
                  onClick: () => window.open(note.file, '_blank'),
                  buttonClass: "bg-blue-500 hover:bg-blue-600 text-white",
                  icon: <IoMdEye />,
                },
                {
                  label: "",
                  onClick: () => handleDownload(note.file, note._id),
                  buttonClass: "bg-blue-500 hover:bg-blue-600 text-white",
                  icon: <IoMdDownload />,
                },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;