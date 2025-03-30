import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    pendingNotes:[],
    approvedNotes: [],
    userNotes: [],
    allNotes: [],
    stats: { totalNotes: 0, approvedNotes: 0, rejectedNotes: 0, pendingNotes: 0 }, // ✅ New stats state
    loading: false,
    error: null,
  },
  reducers: {
    setUserNotes: (state, action) => {
      state.userNotes = action.payload;
    },
    setPendingNotes: (state, action) => {
      state.pendingNotes = action.payload;
    },
    setAllNotes: (state, action) => {
      state.allNotes = action.payload;
    },
    setApprovedNotes: (state, action) => {
      state.approvedNotes = action.payload;
    },
    setRejectedNotes: (state, action) => {
      state.rejectedNotes = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload; // ✅ Update stats object
    },
    addNote: (state, action) => {
      state.allNotes.push(action.payload);
      state.userNotes.push(action.payload);
      state.stats.totalNotes += 1; // ✅ Increment totalNotes count
      state.stats.pendingNotes += 1; // ✅ Assume new note is pending
    },
    updateNote: (state, action) => {
      const { id, updatedData } = action.payload;
      state.allNotes = state.allNotes.map((note) => (note._id === id ? { ...note, ...updatedData } : note));
      state.userNotes = state.userNotes.map((note) => (note._id === id ? { ...note, ...updatedData } : note));

      // ✅ Update stats if status changes
      if (updatedData.status) {
        if (updatedData.status === "approved") {
          state.stats.approvedNotes += 1;
          state.stats.pendingNotes -= 1;
        } else if (updatedData.status === "rejected") {
          state.stats.rejectedNotes += 1;
          state.stats.pendingNotes -= 1;
        }
      }
    },
    deleteNote: (state, action) => {
      const noteToDelete = state.allNotes.find((note) => note._id === action.payload);
      state.allNotes = state.allNotes.filter((note) => note._id !== action.payload);
      state.userNotes = state.userNotes.filter((note) => note._id !== action.payload);

      // ✅ Adjust stats when deleting a note
      if (noteToDelete) {
        state.stats.totalNotes -= 1;
        if (noteToDelete.status === "approved") state.stats.approvedNotes -= 1;
        if (noteToDelete.status === "rejected") state.stats.rejectedNotes -= 1;
        if (noteToDelete.status === "pending") state.stats.pendingNotes -= 1;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setUserNotes, setAllNotes, setApprovedNotes, setStats,setPendingNotes,setRejectedNotes,
  addNote, updateNote, deleteNote, setLoading, setError 
} = notesSlice.actions;

export default notesSlice.reducer;
