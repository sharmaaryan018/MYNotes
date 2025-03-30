import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { IoMdCheckmarkCircle, IoMdCloseCircle, IoMdEye, IoMdSearch } from "react-icons/io";
import { setPendingNotes } from "../utility/notesSlice";
import { setStats } from "../utility/notesSlice";
import "react-toastify/dist/ReactToastify.css";

const PendingNotes = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ subject: "", department: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewNote, setPreviewNote] = useState(null);

  const pendingNotes = useSelector((state) => state.notes.pendingNotes);

  // Fetch pending notes
  useEffect(() => {
    const fetchPendingNotes = async () => {
      try {
        const response = await axiosInstance.get("/admin/getPendingNotes");
        dispatch(setPendingNotes(response.data.notes));
      } catch (error) {
        toast.error("Failed to load pending notes.");
      }
    };
    fetchPendingNotes();
  }, [dispatch]);

  // Add function to fetch stats
  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/note/stats");
      dispatch(setStats(response.data));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Handle note approval
  const handleApprove = async (noteId) => {
    if (!window.confirm("Are you sure you want to approve this note?")) return;

    try {
      console.log('Approving note with ID:', noteId);
      const response = await axiosInstance.patch(`/admin/approveNote/${noteId}`);
      
      if (response.data.success) {
        dispatch(setPendingNotes(pendingNotes.filter((note) => note._id !== noteId)));
        await fetchStats(); // Fetch updated stats after approval
        toast.success("Note approved successfully!");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error approving note:', error);
      toast.error(error.response?.data?.message || "Failed to approve the note.");
    }
  };

  // Handle note rejection
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warn("Please enter a reason for rejection.");
      return;
    }

    try {
      await axiosInstance.patch(`/admin/rejectNote/${selectedNote._id}`, {
        rejectionReason: rejectReason,
      });
      dispatch(setPendingNotes(pendingNotes.filter((note) => note._id !== selectedNote._id)));
      await fetchStats(); // Fetch updated stats after rejection
      setShowModal(false);
      setRejectReason("");
      toast.success("Note rejected successfully!");
    } catch (error) {
      toast.error("Failed to reject the note.");
    }
  };

  // Handle preview
  const handlePreview = (note) => {
    setPreviewNote(note);
    setShowPreviewModal(true);
  };

  // Filter notes based on subject, department, and search query
  const filteredNotes = pendingNotes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filters.subject
      ? note.subject.toLowerCase().includes(filters.subject.toLowerCase())
      : true;
    const matchesDepartment = filters.department
      ? note.department.toLowerCase().includes(filters.department.toLowerCase())
      : true;

    return matchesSearch && matchesSubject && matchesDepartment;
  });

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">Pending Notes</h2>

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
          <input
            type="text"
            placeholder="Filter by department..."
            className="p-2 border rounded"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
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
            <th className="p-2 text-left">📅 Upload Date</th>
            <th className="p-2 text-left">👀 Preview</th>
            <th className="p-2 text-left">✅ Approve</th>
            <th className="p-2 text-left">❌ Reject</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <tr key={note._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{note.title}</td>
                <td className="p-2">{note.subject}</td>
                <td className="p-2">
                  {note.uploadedBy?.firstName} {note.uploadedBy?.lastName}
                </td>
                <td className="p-2">
                  {new Date(note.createdAt).toLocaleDateString()}
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
                    onClick={() => handleApprove(note._id)}
                  />
                </td>
                <td className="p-2">
                  <IoMdCloseCircle
                    className="text-red-600 cursor-pointer hover:text-red-800"
                    onClick={() => {
                      setSelectedNote(note);
                      setShowModal(true);
                    }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No pending notes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Rejection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Reject Note</h3>
            <textarea
              className="w-full border p-2 mb-4 rounded"
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleReject}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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

export default PendingNotes;