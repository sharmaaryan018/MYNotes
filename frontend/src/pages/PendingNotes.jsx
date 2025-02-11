import React, { useState, useEffect } from "react";
import { IoMdCheckmarkCircle, IoMdCloseCircle, IoMdEye } from "react-icons/io";
import axiosInstance from "../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingNotes = () => {
  const [pendingNotes, setPendingNotes] = useState([]);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPendingNotes = async () => {
      try {
        const response = await axiosInstance.get("/admin/getpendingNotes");
        setPendingNotes(response.data.notes);
      } catch (error) {
        console.error("Error fetching pending notes:", error);
        toast.error("Failed to load pending notes.");
      }
    };

    fetchPendingNotes();
  }, []);

  const handleApprove = async (noteId) => {
    if (!window.confirm("Are you sure you want to approve this note?")) return;

    try {
      await axiosInstance.patch(`/admin/approveNote/${noteId}`);
      setPendingNotes(pendingNotes.filter((note) => note._id !== noteId));
      toast.success("Note approved successfully!");
    } catch (error) {
      console.error("Error approving note:", error);
      toast.error("Failed to approve the note. Please try again.");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warn("Please enter a reason for rejection.");
      return;
    }

    try {
      await axiosInstance.patch(`/admin/rejectNote/${selectedNote._id}`, { rejectionReason: rejectReason });
      setPendingNotes(pendingNotes.filter((note) => note._id !== selectedNote._id));
      setShowModal(false);
      setRejectReason("");
      toast.success("Note rejected successfully!");
    } catch (error) {
      console.error("Error rejecting note:", error);
      toast.error("Failed to reject the note. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Toast Container for Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h2 className="text-xl font-bold">Pending Notes</h2>
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th>📌 Title</th>
            <th>📚 Subject</th>
            <th>👤 Uploaded By</th>
            <th>📅 Date</th>
            <th>👀 View</th>
            <th>✅ Approve</th>
            <th>❌ Reject</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pendingNotes) && pendingNotes.length > 0 ? (
            pendingNotes.map((note) => (
              <tr key={note._id} className="border-b text-white">
                <td>{note.title}</td>
                <td>{note.subject}</td>
                <td>{note.uploader || "Unknown"}</td>
                <td>{new Date(note.createdAt).toLocaleDateString()}</td>
                <td>
                  <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                    <IoMdEye className="text-blue-600 cursor-pointer" />
                  </a>
                </td>
                <td>
                  <IoMdCheckmarkCircle
                    className="text-green-600 cursor-pointer"
                    onClick={() => handleApprove(note._id)}
                  />
                </td>
                <td>
                  <IoMdCloseCircle
                    className="text-red-600 cursor-pointer"
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
              <td colSpan="7" className="text-center p-4 text-white">
                No pending notes available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold">Reject Note</h3>
            <p className="text-gray-900">Enter reason for rejection:</p>
            <textarea 
              className="w-full border p-2 mt-2 text-black"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleReject}>
                Reject
              </button>
              <button className="ml-2 bg-gray-300 px-4 py-2 rounded" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingNotes;
