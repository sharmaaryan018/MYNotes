import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { IoMdDownload, IoMdEye } from "react-icons/io";
import { FiUpload } from "react-icons/fi"; // Import for upload icon
import ViewNote from "./ViewNote";
import Card from "./Card";
import { useSelector } from "react-redux";

const UserDetails = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { id } = localUser;
  
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [viewFile, setViewFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch user details
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/note/getUserById/${id}`
        );
        setUserDetails(response.data);
        console.log("USERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", response.data)
      } catch (err) {
        setError("Failed to fetch user details.");
      }
    };
    fetchUserById();
  }, [id]);

  const handleDownload = (fileUrl, noteId) => {
    const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `note-${noteId}`;
    link.click();
  };

  // Filter notes based on search and status
  const filteredNotes = userDetails?.notes?.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All" || note.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-red-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
            <p className="text-gray-600">Manage your uploaded study notes</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/add-material')}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FiUpload className="w-5 h-5" />
            Upload New Note
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4 ml-4">
            {["All", "Approved", "Pending", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === status
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        {!userDetails?.notes?.length ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">You haven't uploaded any notes yet</p>
            <button
              onClick={() => navigate('/create-note')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upload Your First Note
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Card
                  key={note._id}
                  title={note.title}
                  subject={note.subject}
                  institution={note.college || "Unknown"}
                  type={note.type}
                  examType={note.pyqType}
                  year={note.paperYear}
                  semester={note.semester}
                  rating={note.rating || 0}
                  status={note.status}
                  rejectionReason={note.rejectionReason}
                  uploadedBy={{
                    name: `${note.uploadedBy?.firstName || ''} ${note.uploadedBy?.lastName || ''}`.trim() || 'Unknown',
                    avatar: note.uploadedBy?.profileImage || null
                  }}
                  actions={[
                    {
                      label: "Edit",
                      icon: <FaEdit />,
                      onClick: () => navigate(`/dashboard/edit/${note._id}`, { 
                        state: { 
                          userDetails: {
                            ...note,
                            department: note.department,
                            semester: note.semester,
                            year: note.year,
                            paperYear: note.paperYear,
                            pyqType: note.pyqType,
                            file: note.file
                          } 
                        } 
                      }),
                    },
                    {
                      label: "View",
                      icon: <IoMdEye />,
                      onClick: () => setViewFile(note.file),
                    },
                    {
                      label: "Download",
                      icon: <IoMdDownload />,
                      onClick: () => handleDownload(note.file, note._id),
                    },
                  ]}
                />
              ))}
            </div>
            <p className="text-gray-600 mt-4">
              Showing {filteredNotes.length} of {userDetails.notes.length} notes
            </p>
          </>
        )}
      </div>

      {viewFile && (
        <ViewNote fileUrl={viewFile} onClose={() => setViewFile(null)} />
      )}
    </div>
  );
};

export default UserDetails;
