import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import Filter from "./Filter"; // Import the reusable Filter component
import ViewNote from "./ViewNote";
import Card from "./Card";


const UserDetails = () => {

  const navigate = useNavigate();

  const stringUser = localStorage.getItem("user");
  const user = stringUser ? JSON.parse(stringUser) : null;
  const { id } = user;
  

  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [viewFile, setViewFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [statuses] = useState(["All", "Pending", "Approved", "Rejected"]);
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch user details by ID
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/note/getUserById/${id}`
        );
        setUserDetails(response.data);

        const uniqueSubjects = [
          "All",
          ...new Set(response.data.notes.map((note) => note.subject)),
        ];
        setSubjects(uniqueSubjects);

        const uniqueColleges = [
          "All",
          ...new Set(response.data.notes.map((note) => note.college)),
        ];
        setColleges(uniqueColleges);
      } catch (err) {
        setError("Failed to fetch user details.");
      }
    };
    fetchUserById();
  }, []);

  const handleDownload = (fileUrl, noteId) => {
    const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `note-${noteId}`;
    link.click();
  };

  const filteredNotes = userDetails?.notes.filter((note) => {
    const subjectMatch =
      selectedSubject === "All" || note.subject === selectedSubject;
    const collegeMatch =
      selectedCollege === "All" || note.college === selectedCollege;
    const statusMatch =
      selectedStatus === "All" || note.status === selectedStatus;

    return subjectMatch && collegeMatch && statusMatch;
  });

  return (
    <div className="bg-zinc-900 text-white w-full h-full pt-20">
      <h1 className="text-center text-2xl font-bold mb-4">User Details</h1>

      {error && <p className="text-red-500">{error}</p>}
      {userDetails ? (
        <>
          {/* Filter by Subject */}
          <Filter
            label="Filter by Subject"
            options={subjects}
            selectedOption={selectedSubject}
            onChange={setSelectedSubject}
          />

          {/* Filter by College */}
          <Filter
            label="Filter by College"
            options={colleges}
            selectedOption={selectedCollege}
            onChange={setSelectedCollege}
          />

          {/* Filter by Status */}
          <Filter
            label="Filter by Status"
            options={statuses}
            selectedOption={selectedStatus}
            onChange={setSelectedStatus}
          />

          {/* Render filtered notes using Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <Card
                key={index}
                title={note.title}
                description={note.description}
                additionalInfo={[
                  { label: "Subject", value: note.subject },
                  { label: "Type", value: note.type },
                  { label: "Status", value: note.status },
                  { label: "College", value: note.college },
                  { label: "Registered On", value: new Date(note.createdAt).toDateString() },
                ]}
                actions={[
                  {
                    label: "Edit",
                    icon: <FaEdit />,
                    buttonClass: "bg-yellow-500 text-white",
                    onClick: () => navigate(`/edit/${note._id}`, { state: { userDetails: note } }),
                  },
                  {
                    label: "View",
                    icon: <IoMdEye />,
                    buttonClass: "bg-blue-500 text-white",
                    onClick: () => setViewFile(note.file),
                  },
                  {
                    label: "Download",
                    icon: <IoMdDownload />,
                    buttonClass: "bg-green-500 text-white",
                    onClick: () => handleDownload(note.file, note._id),
                  },
                ]}
              />
            ))
          ) : (
            <div className="text-center text-lg text-gray-400">
              No {selectedStatus === "All" ? "note" : `${selectedStatus.toLowerCase()} notes`} found right now.
            </div>
          )}
        </div>

          {viewFile && (
            <ViewNote fileUrl={viewFile} onClose={() => setViewFile(null)} />
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDetails;
