import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../utility/authSlice";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    year: "",
    department: "",
    about: "",
    college: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        contact: user.contact || "",
        year: user.year || "",
        department: user.department || "",
        about: user.about || "",
        college: user.college.name|| "", 
      });
      setProfileImage(user.profileImage);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">My Profile</h2>

      <div className="flex flex-col items-center space-y-4">
        <img
          src={profileImage || "/default-avatar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-2 border-gray-300 shadow-sm object-cover"
        />
        <label
          htmlFor="upload-profile"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Change Photo
        </label>
        <input type="file" accept="image/*" className="hidden" id="upload-profile" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded-lg" />
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded-lg" />
        <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" className="border p-2 rounded-lg" />
        {user.role === "Student" && (
          <>
            <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="border p-2 rounded-lg" />
            <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="border p-2 rounded-lg" />
          </>
        )}
        <textarea name="about" value={formData.about} onChange={handleChange} placeholder="About You" className="border p-2 rounded-lg col-span-2"></textarea>
      </div>

      <div className="text-center mt-4">
        <p className="text-lg font-medium text-gray-700">College: <span className="font-semibold text-blue-600">{formData.college}</span></p>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600">
          {loading ? "Updating..." : "Update Profile"}
        </button>
        <button className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
