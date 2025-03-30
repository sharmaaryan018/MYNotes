import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import NoteCard from '../common/NoteCard';
import Filter from '../common/Filter';
import { setApprovedNotes } from '../utility/notesSlice';
import 'react-toastify/dist/ReactToastify.css';

function Hero() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // States for filter and approved notes
  const [filters, setFilters] = useState({ subject: '', department: '' });
  const approvedNotes = useSelector((state) => state.notes.approvedNotes);
  
  // Fetch approved notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get('/note/approvedNotes');
        dispatch(setApprovedNotes(response.data.notes));
      } catch (error) {
        toast.error('Failed to load notes.');
        console.error(error);
      }
    };

    fetchNotes();
  }, [dispatch]);

  // Filter approved notes
  const handleFilterChange = ({ subject, department }) => {
    setFilters({ subject, department });
  };

  // Limit the number of notes shown to non-logged in users
  const MAX_PREVIEW_NOTES = 3;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const getDisplayNotes = () => {
    const filtered = approvedNotes.filter((note) => {
      return (
        (filters.subject ? note.subject.toLowerCase().includes(filters.subject.toLowerCase()) : true) &&
        (filters.department ? note.department.toLowerCase().includes(filters.department.toLowerCase()) : true)
      );
    });

    if (!isLoggedIn) {
      return filtered.slice(0, MAX_PREVIEW_NOTES);
    }
    return filtered;
  };

  const displayNotes = getDisplayNotes();
  const hiddenNotesCount = approvedNotes.length - MAX_PREVIEW_NOTES;

  return (
    <>
      <style>
        {`
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-gradient {
            background-size: 400% 400%;
            animation: gradient-move 15s ease infinite;
          }
        `}

        {`
          @keyframes rocket-move {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .animate-rocket {
            display: inline-block;
            animation: rocket-move 2s infinite ease-in-out;
          }
        `}
      </style>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-blue-50">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 animate-gradient">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-purple-200 to-pink-300 opacity-25 blur-2xl"></div>
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-300 opacity-30 rounded-full blur-[100px]"></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-blue-600 mb-6">
            Empower Your Learning Journey{" "}
            <span className="inline-block animate-rocket">🚀</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-700 mb-8">
            Access a treasure trove of last year’s question papers, share notes 
            that make a difference, and connect with alumni who’ve walked the path before you. 
            Your ultimate study companion starts here!
            <span className="font-bold text-blue-900 rounded-lg inline-block hover-glow">
              Find your University PYQs/Notes
            </span>
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate(`/dashboard`)}
              className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-medium hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Explore Resources
            </button>
            <button
              onClick={() => navigate(`/join-community`)}
              className="bg-gray-200 text-purple-600 py-3 px-8 rounded-full text-lg font-medium hover:bg-gray-300 shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-purple-300"
            >
              Join the Community
            </button>
          </div>
        </div>

        {/* Grid Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg
            className="w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 600"
          >
            <defs>
              <pattern
                id="grid"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-300"
                ></path>
              </pattern>
            </defs>
            <rect width="1200" height="600" fill="url(#grid)"></rect>
          </svg>
        </div>

        {/* Filter Section */}
        <div className="p-6">
          <ToastContainer position="top-right" autoClose={3000} />
          <h2 className="text-xl font-bold mb-4">Featured Notes</h2>

          {/* Filter Component */}
          <Filter onFilterChange={handleFilterChange} />

          {/* Display Filtered Notes */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayNotes.length > 0 ? (
                <>
                  {displayNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onApprove={() => {}}
                      onReject={() => {}}
                      onDownload={() => {}}
                    />
                  ))}
                  
                  {/* Show login prompt if user is not logged in */}
                  {!isLoggedIn && hiddenNotesCount > 0 && (
                    <div className="col-span-full mt-8">
                      <div className="bg-blue-50 p-8 rounded-lg text-center shadow-lg border border-blue-100">
                        <h3 className="text-2xl font-bold text-blue-800 mb-4">
                          🎓 Unlock {hiddenNotesCount}+ More Notes!
                        </h3>
                        <p className="text-gray-700 mb-6">
                          Sign up now to access our full library of notes, including:
                          <ul className="mt-4 space-y-2 text-left max-w-md mx-auto">
                            <li className="flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              Complete access to all study materials
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              Previous year question papers
                            </li>
                            <li className="flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              Ability to upload and share your own notes
                            </li>
                          </ul>
                        </p>
                        <div className="flex justify-center gap-4">
                          <Link
                            to="/signup"
                            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-transform transform hover:scale-105"
                          >
                            Sign Up Now
                          </Link>
                          <Link
                            to="/login"
                            className="bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-gray-50 border border-blue-200 transition-transform transform hover:scale-105"
                          >
                            Login
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="col-span-full text-center text-gray-600">
                  No approved notes available based on the selected filters.
                </p>
              )}
            </div>

            {/* Blur overlay for non-logged in users */}
            {!isLoggedIn && approvedNotes.length > MAX_PREVIEW_NOTES && (
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none">
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <footer className="bg-gray-800 text-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-lg">
              © {new Date().getFullYear()} Your Company. All Rights Reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Hero;
