
import axiosInstance from "../axiosInstance";
import React, { createContext, useState, useContext } from "react";

//create context
const NotesContext = createContext();

//create a provider component
const NotesProvider = ({ children })=> {
    const[notes, setNotes] =useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);



    //fetch all notes
    const fetchAllNotes = async() => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/note/getAllNotes");
            setNotes(response.data);
            console.log("fetching notes",response.data);
        }catch(err) {
            setError(err.response?.data?.message || "Failed to fetch Notes");
            setLoading(false);
        }
    }

      // Create a new note
  const createNote = async (formData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/note/createNote", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNotes((prevNotes) => [...prevNotes, response.data.note]);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create note");
      setLoading(false);
    }
  };


    const getNoteById = async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/note/${id}`);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch note");
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
}

export const useNotes =()=> {
    return useContext(NotesContext);
};
export default NotesProvider;



