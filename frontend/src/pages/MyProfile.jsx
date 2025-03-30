import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, updateProfileImage } from "../utility/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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

  const getAvatarUrl = (firstName, lastName) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=2563eb&color=fff&size=256&bold=true&font-size=0.5`;
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        contact: user.contact || "",
        year: user.year || "",
        department: user.department || "",
        about: user.about || "",
        college: user.college?.name || "",
      });
      setProfileImage(user.profileImage || getAvatarUrl(user.firstName, user.lastName));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axios.post(
        `http://localhost:5000/api/users/upload-profile-image/${user._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        const imageUrl = response.data.profileImage;
        setProfileImage(imageUrl);
        dispatch(updateProfileImage(imageUrl));
        toast.success('Profile image updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update profile image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">My Profile</h2>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <img
            src={profileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full border-2 border-gray-300 shadow-sm object-cover"
            onError={(e) => {
              e.target.src = getAvatarUrl(formData.firstName, formData.lastName);
            }}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300">
            <label
              htmlFor="profile-upload"
              className="cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Change Photo
            </label>
          </div>
        </div>

        <input
          type="file"
          id="profile-upload"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          onChange={handleImageUpload}
        />
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
        <button 
          className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        <button className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
