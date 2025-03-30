import axiosInstance from "../axiosInstance";
import React, { createContext, useState, useContext } from "react";

// Create context
const NotesContext = createContext();

// Create a provider component
const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch all notes
    const fetchAllNotes = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/note/approvedNotes");
            setNotes(response.data.notes || []); // Ensure we're setting an array
            console.log("fetching notes", response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch Notes");
        } finally {
            setLoading(false);
        }
    };

    // Create a new note
    const createNote = async (formData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/note/createNote", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            // Ensure we're working with arrays
            setNotes(prevNotes => {
                const currentNotes = Array.isArray(prevNotes) ? prevNotes : [];
                return [...currentNotes, response.data.note];
            });
            
            setLoading(false);
            return response.data; // Return the response data for further handling
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create note");
            setLoading(false);
            throw err; // Rethrow the error for handling in the component
        }
    };

    // Get note by ID
    const getNoteById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`/note/${id}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch note");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // const fetchUserDetails = async () => {
    //   try {
    //     const response = await fetch(`note/getUserById/${id}`, {
    //       method: 'GET',
    //       // headers: {
    //       //   Authorization: `Bearer ${token}`, // Pass user authentication token
    //       // },
    //     });
    //     return response;
    //     // Ensure `response.data` contains the user details

    //      // Store user-specific notes
    //   } catch (error) {
    //     setError('Failed to fetch notes');
    //   }
    // };
    

    return (
        <NotesContext.Provider
            value={{
                notes,
                loading,
                error,
                fetchAllNotes,
                getNoteById,
                createNote,
                // fetchUserDetails,
            }}
        >
            {children}
        </NotesContext.Provider>
    );
};

// Custom hook to use notes context
export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};

export default NotesProvider;



