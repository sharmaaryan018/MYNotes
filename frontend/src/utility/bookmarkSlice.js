import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../services/axiosInstance";

const initialState = {
  bookmarkedNotes: [],
  loading: false,
  error: null,
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setBookmarkedNotes: (state, action) => {
      state.bookmarkedNotes = action.payload;
    },
    addBookmark: (state, action) => {
      state.bookmarkedNotes.push(action.payload);
      toast.success("Added to bookmarks");
    },
    removeBookmark: (state, action) => {
      state.bookmarkedNotes = state.bookmarkedNotes.filter(
        (note) => note._id !== action.payload
      );
      toast.success("Removed from bookmarks");
    },
    clearBookmarks: (state) => {
      state.bookmarkedNotes = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setBookmarkedNotes,
  addBookmark,
  removeBookmark,
  clearBookmarks,
} = bookmarkSlice.actions;

// Action creators
export const fetchBookmarks = () => async (dispatch) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return; // Don't fetch if no user

  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get("/bookmarks/all");
    if (response.data.success) {
      dispatch(setBookmarkedNotes(response.data.bookmarks));
    }
  } catch (error) {
    console.error("Fetch bookmarks error:", error);
    dispatch(setError(error.message));
    toast.error("Failed to fetch bookmarks");
  } finally {
    dispatch(setLoading(false));
  }
};

export const toggleBookmark = (note, isBookmarked) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    if (isBookmarked) {
      console.log("Removing bookmark for note:", note._id);
      const response = await axiosInstance.delete(`/bookmarks/remove/${note._id}`);
      if (response.data.success) {
        dispatch(removeBookmark(note._id));
      } else {
        throw new Error(response.data.message);
      }
    } else {
      const response = await axiosInstance.post("/bookmarks/add", { 
        noteId: note._id,
        userId: JSON.parse(localStorage.getItem('user')).id
      });
      if (response.data.success) {
        dispatch(addBookmark(note));
      } else {
        throw new Error(response.data.message);
      }
    }
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    dispatch(setError(error.message));
    toast.error(isBookmarked ? "Failed to remove bookmark" : "Failed to add bookmark");
  } finally {
    dispatch(setLoading(false));
  }
};

export default bookmarkSlice.reducer;