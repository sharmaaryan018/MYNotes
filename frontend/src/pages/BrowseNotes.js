import React, { useEffect, useState } from "react";
import { useNotes } from "../services/contextApi/NotesContext";
import UploadNoteForm from "./FormModal";
import toast from "react-hot-toast";
import ViewNote from "./ViewNote";
import { useSelector } from "react-redux";

import { IoMdDownload, IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import Filter from "./Filter";
import Card from "./Card";

const BrowseNotes = () => {
  const navigate = useNavigate();

  const stringUser = localStorage.getItem("user");
  const user = stringUser ? JSON.parse(stringUser) : null;
  const { id } = user;

  const { createNote, notes, fetchAllNotes, error } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewFile, setViewFile] = useState(null);
  const { userData } = useSelector((state) => state.auth);

  // State variables for filters
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useEffect(() => {
    fetchAllNotes();
  }, []);

  useEffect(() => {
    const uniqueColleges = [
      "All",
      ...new Set(notes.map((note) => note.college|| "Unknown")),
    ];
    const uniqueSubjects = ["All", ...new Set(notes.map((note) => note.subject))];
    const uniqueDepartments = ["All", ...new Set(notes.map((note) => note.department))];

    setColleges(uniqueColleges);
    setSubjects(uniqueSubjects);
    setDepartments(uniqueDepartments);
  }, [notes]);

  const filteredNotes = notes.filter((note) => {
    const collegeMatch =
      selectedCollege === "All" || note.college.name === selectedCollege;
    const subjectMatch = selectedSubject === "All" || note.subject === selectedSubject;
    const departmentMatch = selectedDepartment === "All" || note.department === selectedDepartment;

    return collegeMatch && subjectMatch && departmentMatch;
  });

  const handleUpload = async (formData) => {
    await createNote(formData);
    toast.success(`${formData.type} created successfully`);
    setIsModalOpen(false);
  };

  const handleDownload = (fileUrl, noteId) => {
    const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `note-${noteId}`;
    link.click();
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-black text-white w-full h-full pt px-6  ml-10">
      <h1 className="text-center text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
        Dashboard
      </h1>
      <h1>Welcome, {userData?.firstName || "User"}</h1>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => navigate(`/user/${id}`)}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          View Details
        </button>
        <button
          onClick={() => navigate("/create-note")}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Upload</span>
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Filters */}
      <div className="flex flex-wrap justify-center space-x-6 mb-6 animate-fadeIn">
        <Filter
          label="Filter by College"
          options={colleges}
          selectedOption={selectedCollege}
          onChange={setSelectedCollege}
        />
        <Filter
          label="Filter by Subject"
          options={subjects}
          selectedOption={selectedSubject}
          onChange={setSelectedSubject}
        />
        <Filter
          label="Filter by Department"
          options={departments}
          selectedOption={selectedDepartment}
          onChange={setSelectedDepartment}
        />
      </div>

      {/* Render filtered notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">No notes available. Please check back later.</p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">No notes found for the selected filters.</p>
        ) : (
          filteredNotes.map((note) => (
            <Card
              key={note._id}
              title={note.title}
              description={note.description}
              additionalInfo={[
                { label: "Type", value: note.type },
                { label: "Subject", value: note.subject },
                { label: "Semester", value: note.semester },
                { label: "Year", value: note.year },
                { label: "College", value: note.college?.name || "Unknown" },
              ]}
              actions={[
                {
                  label: "View",
                  onClick: () => setViewFile(note.file),
                  buttonClass: "bg-blue-500 hover:bg-blue-600 text-white",
                  icon: <IoMdEye />,
                },
                {
                  label: "Download",
                  onClick: () => handleDownload(note.file, note._id),
                  buttonClass: "bg-green-500 hover:bg-green-600 text-white",
                  icon: <IoMdDownload />,
                },
              ]}
            />
          ))
        )}
      </div>

      {/* Modal for Upload Note */}
      <UploadNoteForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpload}
      />

      {/* View File Component */}
      {viewFile && <ViewNote fileUrl={viewFile} onClose={() => setViewFile(null)} />}
    </div>
  );
};

export default BrowseNotes;
