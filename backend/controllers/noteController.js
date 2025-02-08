const Note = require('../models/note');
const User = require('../models/User');
const  {uploadImage,deleteImagefromCloudinary} = require('../utils/cloudinaryHelper');
const fs = require('fs/promises');
const path = require('path');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload a file.",
      });
    }

    const file = req.file;
    console.log("File received:", file.path);

    // Upload file to Cloudinary
    let secure_url, public_id;
    try {
      const uploadResult = await uploadImage(file.path);
      secure_url = uploadResult.secure_url;
      public_id = uploadResult.public_id;
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed.",
        error: uploadError.message,
      });
    }

    const { title, description, type, subject, semester, year } = req.body;
    let college = req.body.college;

    if (!college) {
      const user = await User.findById(req.user.id);
      if (!user || !user.college) {
        return res.status(400).json({
          success: false,
          message: "College name is required or could not be determined.",
        });
      }
      college = user.college;
    }

    // Validate `type`
    const allowedTypes = ["Note", "PYQ"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid note type. Allowed types are: ${allowedTypes.join(", ")}`,
      });
    }

    // Check for existing note with same file
    const existingNote = await Note.findOne({ noteId: public_id });
    if (existingNote) {
      return res.status(409).json({
        success: false,
        message: "This file has already been uploaded as a note.",
      });
    }

    const newNote = new Note({
      title,
      description,
      file: secure_url,
      noteId: public_id,
      uploadedBy: req.user.id,
      type,
      subject,
      semester,
      year,
      college,
    });

    try {
      await Promise.all([
        newNote.save(),
        User.findByIdAndUpdate(req.user.id, { $push: { note: newNote._id } }, { new: true }),
        fs.unlink(file.path),
      ]);
      console.log(`File deleted from local uploads: ${file.path}`);
    } catch (err) {
      await deleteImagefromCloudinary(public_id); // Rollback Cloudinary upload
      throw err;
    }

    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (err) {
    console.error("Error creating note:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
    .populate('college', 'name'); // Populate college name

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a note's status
exports.updateNoteStatus = async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      // Check if the status in the body is valid
      const validStatuses = ['Pending', 'Approved', 'Rejected'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
  
      // Update the status
      note.status = req.body.status || note.status;
      await note.save();
      res.status(200).json(note);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const creator = req.user.id;
    console.log("user", creator)

    const noteid = req.params.id
    console.log("note id", noteid)
    const note = await Note.findById(noteid)
    await deleteImagefromCloudinary(note.noteId);
    console.log("public note id",note.noteId)

    await Note.findByIdAndDelete(noteid);

    await User.findByIdAndUpdate(creator, { $pull: { note: noteid } });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({      success: true,
      message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.editNote = async (req, res) => {
  try {
    console.log("editing................................");
    const noteId = req.params.id;
    console.log("pid",noteId )
    const userId = req.user.id; // Assuming the user ID is available in `req.user`
    console.log("uid",userId )

    // Find the note by ID
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }

    // Ensure the user has permission to edit the note
    if (note.uploadedBy.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to edit this note' 
      });
    }

    const {
      title,
      description,
      type,
      subject,
      semester,
      year,
    } = req.body;

    // Update note fields if provided in the request body
    if (title) note.title = title;
    if (description) note.description = description;
    if (type) note.type = type;
    if (subject) note.subject = subject;
    if (semester) note.semester = semester;
    if (year) note.year = year;

    // Handle optional file update
    if (req.file) {
      const file = req.file;

      // Delete the previous file from Cloudinary
      try {
        await deleteImagefromCloudinary(note.noteId);
      } catch (deleteError) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete the old file from Cloudinary',
          error: deleteError.message,
        });
      }

      // Upload the new file to Cloudinary
      try {
        const uploadResult = await uploadImage(file.path);
        note.file = uploadResult.secure_url;
        note.noteId = uploadResult.public_id;

        // Delete the local file after successful upload
        await fs.unlink(file.path);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload the new file to Cloudinary',
          error: uploadError.message,
        });
      }
    }

    // Save the updated note
    await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// exports.getUserById = async (req, res) => {
//   try {
//     const { id } = req.params; // Extract user ID from request parameters

//     // Find the user by ID and populate referenced fields
//     const user = await User.findById(id)
//       .populate('college', 'name location') // Populate 'college' field with selected attributes
//       .populate('posts') // Populate 'posts' field
//       .populate('note', 'title description'); // Populate 'note' field with selected attributes

//     // If user not found
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Return user details
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     // Handle any errors
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//   }
// };

exports.getUserById = async (req, res) => {
  try {
      const userId = req.params.id;

      // Find the user by ID and populate the 'note' field
      const user = await User.findById(userId).populate("note");

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      console.log("User Found:", user); // Debugging log to verify user data
      console.log("Populated Notes Field:", user.note); // Debugging log for populated notes

      // Ensure user.note is not empty or undefined
      if (!user.note || user.note.length === 0) {
          return res.status(200).json({
              success: true,
              notes: [],
              message: "No notes found for this user.",
          });
      }

      // Fetch the notes for the user using the referenced Note IDs
      const notes = await Note.find({ _id: { $in: user.note } }).populate(
        "college",
        "name" // Include only the necessary fields from the College model
      );
  
      console.log("Populated Notes with College Details:", notes);
      res.status(200).json({
          success: true,
          notes: notes,
      });
  } catch (error) {
      console.error("Error fetching notes:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};
