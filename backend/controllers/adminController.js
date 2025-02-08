const Note = require('../models/note');

// Create a new note
exports.welcome = async (req, res) => {
    const {email, id, role} = req.user;
res.json({
    message: 'Welcome to the Admin page',
    user: {
        email,
        id,
        role
    }
})
};

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
    .populate('college', 'name'); // Populate college name

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all pending notes
exports.getPendingNotes = async (req, res) => {
    try {
      const pendingNotes = await Note.find({ status: 'Pending' }).populate('uploadedBy', 'name email').populate('college', 'name');
      res.status(200).json({
        success: true,
        notes: pendingNotes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pending notes',
        error: error.message,
      });
    }
  };
  
  // Approve a note
  exports.approveNote = async (req, res) => {
    try {
      const { noteId } = req.params;
  
      const note = await Note.findById(noteId);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found',
        });
      }
  
      note.status = 'Approved';
      await note.save();
  
      res.status(200).json({
        success: true,
        message: 'Note approved successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to approve note',
        error: error.message,
      });
    }
  };
  
  // Reject a note
  exports.rejectNote = async (req, res) => {
    try {
      const { noteId } = req.params;
      const { rejectionReason } = req.body;
  
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required',
        });
      }
  
      const note = await Note.findById(noteId);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found',
        });
      }
  
      note.status = 'Rejected';
      note.rejectionReason = rejectionReason; // Add a new field in your schema for rejection reason if needed
      await note.save();
  
      res.status(200).json({
        success: true,
        message: 'Note rejected successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to reject note',
        error: error.message,
      });
    }
  };
  
  // Get all notes (Approved or Rejected) for admin review
  exports.getAllReviewedNotes = async (req, res) => {
    try {
      const notes = await Note.find({ status: { $in: ['Approved', 'Rejected'] } })
        .populate('uploadedBy', 'name email')
        .populate('college', 'name');
      res.status(200).json({
        success: true,
        notes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reviewed notes',
        error: error.message,
      });
    }
  };

