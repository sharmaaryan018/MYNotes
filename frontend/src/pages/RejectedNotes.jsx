import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { IoMdCheckmarkCircle, IoMdEye, IoMdSearch, IoMdCreate } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { setStats } from "../utility/notesSlice";
import EditForm from "./EditForm"; // Import EditForm component
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const RejectedNotes = () => {
  const [rejectedNotes, setRejectedNotes] = useState([]); // Local state for rejected notes
  const [filters, setFilters] = useState({ subject: "" }); // Filters (only subject now)
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [editReason, setEditReason] = useState(""); // Edit rejection reason
  const [selectedNote, setSelectedNote] = useState(null); // Selected note for editing
  const [showEditModal, setShowEditModal] = useState(false); // Edit modal visibility
  const [showPreviewModal, setShowPreviewModal] = useState(false); // Preview modal visibility
  const [previewNote, setPreviewNote] = useState(null); // Note to preview
  const [showEditForm, setShowEditForm] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch rejected notes
  useEffect(() => {
    const fetchRejectedNotes = async () => {
      try {
        const response = await axiosInstance.get("/admin/rejectedNotes");
        setRejectedNotes(response.data.notes); // Set rejected notes in local state
      } catch (error) {
        toast.error("Failed to load rejected notes.");
      }
    };
    fetchRejectedNotes();
  }, []);

  useEffect(() => {
    // Redirect non-admin users
    if (!user || user.role !== 'admin') {
      navigate('/');
      toast.error('Unauthorized access');
    }
  }, [user, navigate]);

  // Handle preview
  const handlePreview = (note) => {
    setPreviewNote(note);
    setShowPreviewModal(true);
  };

  // Handle edit rejection reason
  const handleEditReason = (note) => {
    setSelectedNote(note);
    setEditReason(note.rejectionReason);
    setShowEditModal(true);
  };

  // Handle edit note
  const handleEditNote = (note) => {
    if (user.role !== 'admin') {
      toast.error('Only administrators can edit notes');
      return;
    }

    navigate(`/dashboard/edit/${note._id}`, { 
      state: { 
        userDetails: note,
        isAdminEdit: true  // Add this flag
      } 
    });
  };

  // Add fetchStats function
  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/note/stats");
      dispatch(setStats(response.data));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Handle edit completion
  const handleEditComplete = async (updatedNote) => {
    setRejectedNotes(prevNotes =>
      prevNotes.map(note => 
        note._id === updatedNote._id ? updatedNote : note
      )
    );
    setShowEditForm(false);
    setNoteToEdit(null);
    await fetchStats(); // Fetch updated stats after edit
    toast.success("Note updated successfully!");
  };

  const handleReApprove = async (noteId) => {
    if (!window.confirm("Are you sure you want to approve this note?")) return;

    try {
      const response = await axiosInstance.patch(`/admin/approveNote/${noteId}`);
      if (response.data.success) {
        setRejectedNotes(rejectedNotes.filter(note => note._id !== noteId));
        await fetchStats(); // Fetch updated stats after approval
        toast.success("Note approved successfully!");
      }
    } catch (error) {
      console.error('Error approving note:', error);
      toast.error(error.response?.data?.message || "Failed to approve the note");
    }
  };

  // Filter notes based on subject and search query
  const filteredNotes = rejectedNotes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filters.subject
      ? note.subject.toLowerCase().includes(filters.subject.toLowerCase())
      : true;

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">Rejected Notes</h2>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by title or subject..."
            className="w-full p-2 pl-10 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoMdSearch className="absolute left-3 top-3 text-gray-500" />
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Filter by subject..."
            className="p-2 border rounded"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          />
        </div>
      </div>

      {/* Notes Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">📌 Title</th>
            <th className="p-2 text-left">📚 Subject</th>
            <th className="p-2 text-left">👤 Uploaded By</th>
            <th className="p-2 text-left">📅 Rejected On</th>
            <th className="p-2 text-left">📝 Rejection Reason</th>
            <th className="p-2 text-left">👀 Preview</th>
            <th className="p-2 text-left">✅ Re-approve</th>
            {user?.role === "admin" && <th className="p-2 text-left">✏️ Edit</th>}
          </tr>
        </thead>
        <tbody>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <tr key={note._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{note.title}</td>
                <td className="p-2">{note.subject}</td>
                <td className="p-2">
                  {note.uploadedBy?.name ? `${note.uploadedBy?.name} ${note.uploadedBy?.college}` : 'deleted user'}
                </td>
                <td className="p-2">
                  {new Date(note.rejectedAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <span>{note.rejectionReason}</span>
                    <IoMdCreate
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => handleEditNote(note)}
                    />
                  </div>
                </td>
                <td className="p-2">
                  <IoMdEye
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                    onClick={() => handlePreview(note)}
                  />
                </td>
                <td className="p-2">
                  <IoMdCheckmarkCircle
                    className="text-green-600 cursor-pointer hover:text-green-800"
                    onClick={() => handleReApprove(note._id)}
                  />
                </td>
                {user?.role === "admin" && (
                  <td className="p-2">
                    <IoMdCreate
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => handleEditNote(note)}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No rejected notes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Note</h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <EditForm
              userDetails={noteToEdit}
              onEditComplete={handleEditComplete}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl">
            <h3 className="text-lg font-bold mb-4">Note Preview</h3>
            <iframe
              src={previewNote.file}
              title={previewNote.title}
              className="w-full h-96 border"
            />
            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setShowPreviewModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RejectedNotes;