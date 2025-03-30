import React, { useEffect, useState } from "react";
import { useNotes } from "../services/contextApi/NotesContext";
import UploadNoteForm from "./FormModal";
import toast from "react-hot-toast";
import ViewNote from "./ViewNote";
import { useSelector, useDispatch } from "react-redux";
import { IoMdDownload, IoMdEye, IoMdBookmark } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Filter from "./Filter";
import Card from "./Card";
import { toggleBookmark } from "../utility/bookmarkSlice";

const BrowseNotes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookmarkedNotes } = useSelector((state) => state.bookmark);

  const stringUser = localStorage.getItem("user");
  const user = stringUser ? JSON.parse(stringUser) : null;
  const { id } = user;

  const { createNote, notes, fetchAllNotes, error } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewFile, setViewFile] = useState(null);

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

  // Convert notes to array if it's not already
  const notesArray = Array.isArray(notes) ? notes : notes?.notes || [];

  const filteredNotes = notesArray.filter((note) => {
    const collegeMatch =
      selectedCollege === "All" || note.college === selectedCollege;
    const subjectMatch = 
      selectedSubject === "All" || note.subject === selectedSubject;
    const departmentMatch = 
      selectedDepartment === "All" || note.department === selectedDepartment;

    return collegeMatch && subjectMatch && departmentMatch;
  });

  // Update the colleges, subjects, and departments setters
  useEffect(() => {
    const uniqueColleges = [
      "All",
      ...new Set(notesArray.map((note) => note.college || "Unknown")),
    ];
    const uniqueSubjects = ["All", ...new Set(notesArray.map((note) => note.subject))];
    const uniqueDepartments = ["All", ...new Set(notesArray.map((note) => note.department))];

    setColleges(uniqueColleges);
    setSubjects(uniqueSubjects);
    setDepartments(uniqueDepartments);
  }, [notes]);

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

  const handleToggleBookmark = (note) => {
    const isBookmarked = bookmarkedNotes.some((bookmark) => bookmark._id === note._id);
    dispatch(toggleBookmark(note, isBookmarked));
  };

  return (
    <div className="bg-white-800 text-gray-800 w-full min-h-screen p-16 border-collapse">
      <h1 className="text-3xl font-bold mb-2">
        Previous Year Question Papers
      </h1>
      <p className="text-gray-700 mb-8">Browse PYQs shared by students</p>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by title, subject, university..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Render filtered notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No notes available. Please check back later.</p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No notes found for the selected filters.</p>
        ) : (
          filteredNotes.map((note) => (
            <Card
              key={note._id}
              _id={note._id}
              title={note.title}
              subject={note.subject}
              institution={note.college || "Unknown"}
              type={note.type}
              examType={note.pyqType}
              year={note.paperYear}
              semester={note.semester}
              rating={4.5}
              uploadedBy={{
                name: note.uploadedBy ? `${note.uploadedBy.firstName} ${note.uploadedBy.lastName}` : "Unknown",
                avatar: note.uploadedBy?.profileImage
              }}
              isBookmarked={bookmarkedNotes.some((bookmark) => bookmark._id === note._id)}
              onToggleBookmark={() => handleToggleBookmark(note)}
              actions={[
                {
                  label: "View",
                  onClick: () => setViewFile(note.file),
                  buttonClass: "bg-blue-500 hover:bg-blue-600 text-white",
                  icon: <IoMdEye />,
                },
                {
                  label: "",
                  onClick: () => handleDownload(note.file, note._id),
                  buttonClass: "bg-blue-500 hover:bg-blue-600 text-white",
                  icon: <IoMdDownload />,
                },
              ]}
            />
          ))
        )}
      </div>

      {/* Keep existing modals */}
      <UploadNoteForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpload}
      />
      {viewFile && <ViewNote fileUrl={viewFile} onClose={() => setViewFile(null)} />}
    </div>
  );
};

export default BrowseNotes;
