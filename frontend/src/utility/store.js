import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import notesReducer from "./notesSlice"
import bookmarkReducer from "./bookmarkSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notes:notesReducer,
        bookmark: bookmarkReducer,
      },
})

export default store;
