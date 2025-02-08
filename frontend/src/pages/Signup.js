// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { signup } from "../services/authService"; // Import signup API function

// const Signup = ({ setIsLoggedIn }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     role: "Student", // Default role set to "Student"
//     college: "",
//   });
//   const [loading, setLoading] = useState(false);

//   // Handle input changes
//   const handleChange = (event) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [event.target.name]: event.target.value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       const response = await signup(formData);
//       toast.success("Signup successful!");
//       setIsLoggedIn(true);
//       localStorage.setItem("token", response.token); // Store token in localStorage
//       navigate("/login");
//     } catch (error) {
//       if (error.response && error.response.data) {
//         const errorMessage = error.response.data.message;
//         toast.error(errorMessage || "Something went wrong. Please try again.");
//       } else {
//         toast.error("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
//       <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
//         <h2 className="text-2xl font-bold text-center text-gray-800">Signup</h2>
//         <form onSubmit={handleSubmit} className="space-y-6 mt-4">
//           {/* First Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               First Name
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder="First Name"
//               required
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Last Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Last Name
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder="Last Name"
//               required
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email"
//               required
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               required
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Role Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Role
//             </label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             >
//               <option value="Student">Student</option>
//               <option value="Alumni">Alumni</option>
//             </select>
//           </div>

//           {/* College */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               College
//             </label>
//             <input
//               type="text"
//               name="college"
//               value={formData.college}
//               onChange={handleChange}
//               placeholder="College Name"
//               required
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//             }`}
//           >
//             {loading ? "Signing up..." : "Signup"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };








import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSignupData, setLoading, setError } from "../utility/authSlice";
import { signup } from "../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Student", // Default role
    college: "",
  });

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(setLoading(true));

    try {
      const response = await signup(formData);
      toast.success("Signup successful!");
      console.log("response", response);
      localStorage.setItem("token", JSON.stringify(response.user));
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-gray-800 via-gray-900 to-black text-gray-200">
      <div className="bg-gray-900 shadow-lg rounded-lg w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            >
              <option value="Student">Student</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-medium">College</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="College Name"
              required
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md shadow-md text-white ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            }`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Signup;
