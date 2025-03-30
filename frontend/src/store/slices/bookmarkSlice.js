import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  bookmarks: localStorage.getItem("bookmarks")
    ? JSON.parse(localStorage.getItem("bookmarks"))
    : [],
  totalBookmarks: localStorage.getItem("totalBookmarks")
    ? JSON.parse(localStorage.getItem("totalBookmarks"))
    : 0,
};

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    addToBookmarks: (state, action) => {
      const note = action.payload;
      const index = state.bookmarks.findIndex((item) => item._id === note._id);

      if (index >= 0) {
        // If the note is already bookmarked
        toast.error("Already bookmarked");
        return;
      }
      // If the note is not bookmarked, add it
      state.bookmarks.push(note);
      // Update the total count
      state.totalBookmarks++;
      // Update localStorage
      localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
      localStorage.setItem("totalBookmarks", JSON.stringify(state.totalBookmarks));
      // Show success toast
      toast.success("Added to bookmarks");
    },

    removeFromBookmarks: (state, action) => {
      const noteId = action.payload;
      const index = state.bookmarks.findIndex((item) => item._id === noteId);

      if (index >= 0) {
        // If the note is found in bookmarks, remove it
        state.totalBookmarks--;
        state.bookmarks.splice(index, 1);
        // Update localStorage
        localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
        localStorage.setItem("totalBookmarks", JSON.stringify(state.totalBookmarks));
        // Show success toast
        toast.success("Removed from bookmarks");
      }
    },

    setBookmarks: (state, action) => {
      // Used when fetching bookmarks from API
      state.bookmarks = action.payload;
      state.totalBookmarks = action.payload.length;
      // Update localStorage
      localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
      localStorage.setItem("totalBookmarks", JSON.stringify(state.totalBookmarks));
    },

    resetBookmarks: (state) => {
      // Reset all bookmark data
      state.bookmarks = [];
      state.totalBookmarks = 0;
      // Clear localStorage
      localStorage.removeItem("bookmarks");
      localStorage.removeItem("totalBookmarks");
    },
  },
});

export const { 
  addToBookmarks, 
  removeFromBookmarks, 
  setBookmarks, 
  resetBookmarks 
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer; 