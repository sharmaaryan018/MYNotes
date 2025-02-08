import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"), // Set based on token presence
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
      state.isLoggedIn = !!action.payload; // Update isLoggedIn based on token
      localStorage.setItem("token", action.payload); // Save token in localStorage
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.userData = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUserData, setLoading, setToken, setError, logout } = authSlice.actions;
export default authSlice.reducer;
