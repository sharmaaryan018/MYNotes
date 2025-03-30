import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const EditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state?.userDetails;
  const returnPath = location.state?.returnPath || '/';

  if (!userDetails) {
    return <p>No user details found to edit.</p>;
  }

  const [formData, setFormData] = useState({
    title: userDetails?.title || "",
    description: userDetails?.description || "",
    file: userDetails?.file || "", // Existing file URL
    subject: userDetails?.subject || "",
    department: userDetails?.Department || "", // Ensure correct key
    type: userDetails?.type  || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData = new FormData();
    updatedData.append("title", formData.title);
    updatedData.append("description", formData.description);
    updatedData.append("subject", formData.subject);
    updatedData.append("department", formData.department);
    updatedData.append("type", formData.type);

    // Only append the file if a new file is selected
    if (formData.file && formData.file instanceof File) {
      updatedData.append("file", formData.file);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/note/editNote/${userDetails._id}`,
        updatedData, // Corrected
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Updated note response:", response.data);

      alert("Note updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Failed to update the note:", err);
      alert("Failed to update the note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessfulEdit = () => {
    navigate(returnPath);
  };

  return (
    <div className="bg-zinc-900 text-white w-full h-full pt-20">
      <h1 className="text-center text-2xl font-bold mb-4">Edit Note</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label>File:</label>
          {formData.file && !(formData.file instanceof File) ? (
            <div>
              <p className="text-gray-400">
                Current file:{" "}
                <a
                  href={formData.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  View File
                </a>
              </p>
            </div>
          ) : null}
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label>Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 rounded text-white ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditForm;
