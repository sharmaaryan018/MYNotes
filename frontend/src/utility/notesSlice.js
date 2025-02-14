import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    approvedNotes:[],
    userNotes: [],
    allNotes: [],
    loading: false,
    error: null,
  },
  reducers: {
    setUserNotes: (state, action) => {
      state.userNotes = action.payload;
    },
    setAllNotes: (state, action) => {
      state.allNotes = action.payload;
    },
    setApprovedNotes: (state, action) => {
        state.approvedNotes = action.payload;
    },
    addNote: (state, action) => {
        state.allNotes.push(action.payload);
        state.userNotes.push(action.payload); // If user creates a note, add it to their list too
    },
    updateNote: (state, action) => {
        const { id, updatedData } = action.payload;
        state.allNotes = state.allNotes.map((note) => (note._id === id ? { ...note, ...updatedData } : note));
        state.userNotes = state.userNotes.map((note) => (note._id === id ? { ...note, ...updatedData } : note));
    },
    deleteNote: (state, action) => {
        state.allNotes = state.allNotes.filter((note) => note._id !== action.payload);
        state.userNotes = state.userNotes.filter((note) => note._id !== action.payload);
    }, 
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUserNotes, setAllNotes, setApprovedNotes,  addNote, 
    updateNote, 
    deleteNote,setLoading, setError } = notesSlice.actions;
export default notesSlice.reducer;
