import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../services/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import { IoMdCloseCircle, IoMdEye } from "react-icons/io";
import Filter from '../common/Filter';
import { setApprovedNotes } from '../utility/notesSlice';
import { setStats } from '../utility/notesSlice';
import 'react-toastify/dist/ReactToastify.css';

const ApprovedNotesPage = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ subject: '', department: '' });
  const [rejectReason, setRejectReason] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const approvedNotes = useSelector((state) => state.notes.approvedNotes);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get('/note/approvedNotes');
        dispatch(setApprovedNotes(response.data.notes));
      } catch (error) {
        toast.error('Failed to load notes.');
      }
    };
    fetchNotes();
  }, [dispatch]);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/note/stats");
      dispatch(setStats(response.data));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warn("Please enter a reason for rejection.");
      return;
    }

    try {
      await axiosInstance.patch(`/admin/rejectNote/${selectedNote._id}`, { 
        rejectionReason: rejectReason 
      });
      
      dispatch(setApprovedNotes(approvedNotes.filter(note => note._id !== selectedNote._id)));
      await fetchStats();
      setShowModal(false);
      setRejectReason("");
      toast.success("Note rejected successfully!");
    } catch (error) {
      toast.error("Failed to reject the note.");
    }
  };

  const filteredNotes = approvedNotes.filter((note) => (
    (filters.subject ? note.subject.toLowerCase().includes(filters.subject.toLowerCase()) : true) &&
    (filters.department ? note.department.toLowerCase().includes(filters.department.toLowerCase()) : true)
  ));

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-bold mb-4">Approved Notes</h2>

      <Filter onFilterChange={setFilters} />

      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th>Title</th>
            <th>Subject</th>
            <th>Uploaded By</th>
            <th>Date</th>
            <th>View</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <tr key={note._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{note.title}</td>
                <td className="p-2">{note.subject}</td>
                <td className="p-2">
                  {note.uploadedBy?.firstName || 'Unknown'} {note.uploadedBy?.lastName}
                </td>
                <td className="p-2">
                  {new Date(note.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <a href={note.file} target="_blank" rel="noopener noreferrer">
                    <IoMdEye className="text-blue-600 cursor-pointer" />
                  </a>
                </td>
                {isAdmin && (
                  <td className="p-2">
                    <IoMdCloseCircle
                      className="text-red-600 cursor-pointer"
                      onClick={() => {
                        setSelectedNote(note);
                        setShowModal(true);
                      }}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} className="text-center p-4">
                No notes found matching the filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default ApprovedNotesPage;