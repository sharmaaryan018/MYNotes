import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useNotes } from "../services/contextApi/NotesContext";

const CreateNotePage = () => {
  const navigate = useNavigate();
  const { createNote } = useNotes();
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
    type: "",
    subject: "",
    college: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteData({ ...noteData, [name]: value });
  };

  const handleFileChange = (e) => {
    setNoteData({ ...noteData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteData.title || !noteData.type || !noteData.file) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", noteData.title);
    formData.append("description", noteData.description);
    formData.append("type", noteData.type);
    formData.append("subject", noteData.subject);
    formData.append("college", noteData.college);
    formData.append("file", noteData.file);

    try {
      await createNote(formData);
      toast.success("Note created successfully");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      toast.error("Error creating note");
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-black text-white w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Create a New Note</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={noteData.title}
            onChange={handleChange}
            placeholder="Note Title"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-800 text-white"
          />
          <textarea
            name="description"
            value={noteData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-800 text-white"
          />
          <input
            type="text"
            name="subject"
            value={noteData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-800 text-white"
          />
          <input
            type="text"
            name="college"
            value={noteData.college}
            onChange={handleChange}
            placeholder="College"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-800 text-white"
          />
          <select
            name="type"
            value={noteData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-800 text-white"
          >
            <option value="">Select Note Type</option>
            <option value="Note">Note</option>
            <option value="PYQ">PYQ</option>
          </select>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Create Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNotePage;
