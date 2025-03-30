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
      const pendingNotes = await Note.find({ status: 'Pending' }).populate('uploadedBy', 'firstName lastName ').populate('college', 'name')
      .sort({ createdAt: -1 }); // Add this line to sort by newest first
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
      const note = await Note.findById(req.params.id);
      console.log('Attempting to approve note with ID:', req.params.id); // Add logging

      
      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found"
        });
      }
  
      // If it's a PYQ note, verify required fields
      if (note.type === 'PYQ' && (!note.pyqType || !note.paperYear)) {
        return res.status(400).json({
          success: false,
          message: "PYQ notes require both pyqType and paperYear fields"
        });
      }
  
      note.status = 'Approved';
      await note.save();
  
      res.status(200).json({
        success: true,
        message: "Note approved successfully"
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to approve note",
        error: err.message
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
  
      // Find the note but don't run validation on update
      const note = await Note.findById(noteId);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found',
        });
      }
  
      // Update note status and rejection reason using findByIdAndUpdate to skip validation
      await Note.findByIdAndUpdate(
        noteId,
        {
          status: 'Rejected',
          rejectionReason: rejectionReason,
        },
        {
          runValidators: false, // Skip validation
          new: true
        }
      );
  
      res.status(200).json({
        success: true,
        message: 'Note rejected successfully',
      });
    } catch (error) {
      console.error('Error rejecting note:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject note',
        error: error.message,
      });
    }
  };
  
  // Get all notes (Approved or Rejected) for admin review
// Get all rejected notes for admin review
exports.getRejectedNotes = async (req, res) => {
  try {
    // Fetch only rejected notes
    const notes = await Note.find({ status: 'Rejected' })
      .populate({
        path: 'uploadedBy',
        select: 'firstName lastName email college',
        populate: {
          path: 'college',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 }); // Sort by most recent

    res.status(200).json({
      success: true,
      notes: notes.map((note) => ({
        _id: note._id,
        title: note.title,
        subject: note.subject,
        type: note.type,
        file: note.file,
        rejectionReason: note.rejectionReason,
        rejectedAt: note.rejectedAt, // Add rejectedAt field
        createdAt: note.createdAt,
        uploadedBy: {
          _id: note.uploadedBy?._id,
          name: note.uploadedBy
            ? `${note.uploadedBy.firstName} ${note.uploadedBy.lastName}`
            : 'Deleted User',
          college: note.uploadedBy?.college?.name || 'Not specified',
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching rejected notes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

