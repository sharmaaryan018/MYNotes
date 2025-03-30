import React from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from "../services/axiosInstance";

import axios from 'axios';
import { updateNote, setError, setLoading } from '../utility/notesSlice';
import { toast } from 'react-hot-toast';

const NoteActions = ({ noteId }) => {
  const dispatch = useDispatch();

  const handleApprove = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.patch(`/admin/approveNote/${noteId}`);
      
      dispatch(updateNote({
        id: noteId,
        updatedData: { status: 'approved' }
      }));
      
      toast.success('Note approved successfully');
    } catch (error) {
      console.error('Error approving note:', error);
      dispatch(setError(error.message));
      toast.error(error.response?.data?.message || 'Failed to approve note');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleReject = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.patch(`/admin/rejectNote/${noteId}`);
      
      dispatch(updateNote({
        id: noteId,
        updatedData: { status: 'rejected' }
      }));
      
      toast.success('Note rejected successfully');
    } catch (error) {
      console.error('Error rejecting note:', error);
      dispatch(setError(error.message));
      toast.error(error.response?.data?.message || 'Failed to reject note');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleView = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(`/notes/getNoteById/${noteId}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error viewing note:', error);
      dispatch(setError(error.message));
      toast.error(error.response?.data?.message || 'Failed to view note');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDownload = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(`/notes/getNoteById/${noteId}`);
      
      const blob = new Blob([response.data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `note-${noteId}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Note downloaded successfully');
    } catch (error) {
      console.error('Error downloading note:', error);
      dispatch(setError(error.message));
      toast.error(error.response?.data?.message || 'Failed to download note');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Approve
      </button>
      <button
        onClick={handleReject}
        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Reject
      </button>
      <button
        onClick={handleView}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        View
      </button>
      <button
        onClick={handleDownload}
        className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Download
      </button>
    </div>
  );
};

export default NoteActions;
