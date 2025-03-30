import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';
import { useNotes } from "../services/contextApi/NotesContext";
import departments from "../constants/departments";

const CreateNotePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createNote, updateNote } = useNotes();
  
  // Add console logs for debugging
  console.log("Location State:", location.state);
  console.log("Existing Note Data:", location.state?.userDetails);
  
  const isEditing = location.state?.userDetails;
  const existingNote = location.state?.userDetails;

  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
    type: "",
    pyqType: "",
    paperYear: "",
    subject: "",
    semester: "",
    year: "",
    department: "",
    college: "",
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Log when component mounts
  useEffect(() => {
    console.log("Component Mounted");
    console.log("Is Editing:", isEditing);
    console.log("Existing Note:", existingNote);
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (isEditing && existingNote) {
      console.log("Populating form with existing data:", existingNote);
      
      const populatedData = {
        title: existingNote.title || "",
        description: existingNote.description || "",
        type: existingNote.type || "",
        pyqType: existingNote.pyqType || "",
        paperYear: existingNote.paperYear || "",
        subject: existingNote.subject || "",
        semester: existingNote.semester || "",
        year: existingNote.year || "",
        department: existingNote.department || "",
        college: existingNote.college || "",
        file: null,
      };
      
      console.log("Populated Form Data:", populatedData);
      setNoteData(populatedData);
    }
  }, [isEditing, existingNote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Form Field Change:", { field: name, value });
    setNoteData({ ...noteData, [name]: value });
  };

  const handleFileChange = (e) => {
    console.log("File Selected:", e.target.files[0]);
    setNoteData({ ...noteData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submission - Current Note Data:", noteData);
    console.log("Is Editing Mode:", isEditing);

    // Validation for new notes only
    if (!isEditing && !noteData.file) {
      toast.error("Please upload a file");
      return;
    }

    if (!noteData.title || !noteData.type || !noteData.semester || 
        !noteData.year || !noteData.department) {
      toast.error("Please fill all required fields");
      return;
    }

    if (noteData.type === 'PYQ') {
      if (!noteData.pyqType) {
        toast.error("Please select PYQ type (mid-sem or end-sem)");
        return;
      }
      if (!noteData.paperYear) {
        toast.error("Please enter the paper year");
        return;
      }
    }

    const formData = new FormData();
    
    // Append all form fields
    Object.keys(noteData).forEach(key => {
      if (noteData[key] !== null && noteData[key] !== "" && key !== 'currentFile') {
        formData.append(key, noteData[key]);
      }
    });

    try {
      setIsSubmitting(true);
      
      if (isEditing) {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        console.log("Sending edit request for note ID:", existingNote._id);
        console.log("Form data entries:", Array.from(formData.entries()));

        const response = await axios.put(
          `http://localhost:5000/api/note/editNote/${existingNote._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log("Edit response:", response.data);
        toast.success("Note updated successfully and sent for review");
      } else {
        await createNote(formData);
        toast.success("Note created successfully");
      }
      
      navigate("/dashboard/my-uploads/:id");
    } catch (err) {
      console.error("Error in form submission:", err);
      toast.error(err.response?.data?.message || `Error ${isEditing ? 'updating' : 'creating'} note`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the submit button text based on editing state
  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return isEditing ? "Updating..." : "Creating...";
    }
    return isEditing ? "Update Note" : "Create Note";
  };

  return (
    <div className="bg-red-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Upload Content</h1>
        <p className="text-gray-600 mb-8">Share your study materials with other students</p>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-12">
          <div className="md:col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Details</h2>
              <p className="text-gray-600 text-sm mb-6">Provide information about your content</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setNoteData({ ...noteData, type: "Note" })}
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      noteData.type === "Note"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className="far fa-file-alt"></i>
                    Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteData({ ...noteData, type: "PYQ" })}
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      noteData.type === "PYQ"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className="far fa-file-alt"></i>
                    PYQ
                  </button>
                </div>

                <div class>
                  <label className="block bg-gray-50text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={noteData.title}
                    onChange={handleChange}
                    placeholder="E.g., Operating Systems Complete Notes"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 bg-zinc-50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject*</label>
                    <input
                      type="text"
                      name="subject"
                      value={noteData.subject}
                      onChange={handleChange}
                      placeholder="E.g., Computer Science"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 bg-zinc-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">University/College</label>
                    <input
                      type="text"
                      name="college"
                      value={noteData.college}
                      onChange={handleChange}
                      placeholder="E.g., MIT WPU, Pune"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 bg-zinc-50"
                    />
                  </div>
                </div>

                {noteData.type === 'PYQ' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PYQ Type*</label>
                      <select
                        name="pyqType"
                        value={noteData.pyqType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 bg-zinc-50"
                        required
                      >
                        <option value="">Select PYQ type</option>
                        <option value="mid-sem">Mid Semester</option>
                        <option value="end-sem">End Semester</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paper Year*</label>
                      <input
                        type="number"
                        name="paperYear"
                        value={noteData.paperYear}
                        onChange={handleChange}
                        placeholder="E.g., 2023"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 bg-zinc-50"
                        required
                      />
                    </div>
                  </div>
                )}

                <textarea
                  name="description"
                  value={noteData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-zinc-50"
                />
                <select
                  name="department"
                  value={noteData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-zinc-50"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="semester"
                    value={noteData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-zinc-50"
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                  <select
                    name="year"
                    value={noteData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-zinc-50"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-zinc-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 ${
                    isSubmitting 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white rounded-lg`}
                >
                  {getSubmitButtonText()}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6 md:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Guidelines</h2>
              <ul className="space-y-3 text-sm font-medium text-gray-800">
                <li>• All content uploads are subject to approval by moderators</li>
                <li>• Ensure you have permission to share the content</li>
                <li>• Do not upload copyrighted materials</li>
                <li>• PDFs are preferred as they maintain formatting</li>
                <li>• Provide accurate information for better searchability</li>
                <li>• Each file can be up to 10MB in size</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h2>
              <ol className="space-y-3 text-sm font-medium text-gray-800">
                <li>1. Your content will be submitted for review</li>
                <li>2. Moderators will check the content for quality and relevance</li>
                <li>3. Once approved, your content will be available to all users</li>
                <li>4. You'll receive notifications about the content status</li>
                <li>5. You can track your uploads in your profile dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNotePage;
