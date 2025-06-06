import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  profileImage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.profileImage = action.payload.profileImage || null;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Save user data
    },
    setToken(state, action) {
      state.token = action.payload;
      state.isLoggedIn = !!action.payload;
      localStorage.setItem("token", action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
      state.profileImage = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateProfileImage(state, action) {
      state.profileImage = action.payload;
      if (state.user) {
        state.user.profileImage = action.payload;
      }
    },
  },
});

export const { setUserData, setToken, setLoading, setError, logout, updateProfileImage } = authSlice.actions;
export default authSlice.reducer;
