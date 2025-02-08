import axiosInstance from "./axiosInstance";
import { setUserData, setToken } from "../utility/authSlice";

export const signup = async (data) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const loginUser = async (data, dispatch, navigate) => {
  try {
    console.log("Starting login process with data:", data);

    const response = await axiosInstance.post("/auth/login", data);
    console.log("Full response object:", response);
    console.log("Login response data:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch(setToken(token));
    dispatch(setUserData(user));

    // Navigate to the dashboard after login
    navigate("/dashboard");

    return response.data;
  } catch (error) {
    console.error("Error during login:", error.message);
    if (error.response) {
      console.error("Error details:", error.response.data);
    }
    throw error;
  }
};

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUserData(null));
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged Out");
    navigate("/");
  };
}
