import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Backend API base URL
  withCredentials: true, // To send cookies if necessary
});

// Intercept requests to add the JWT token to the headers if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
