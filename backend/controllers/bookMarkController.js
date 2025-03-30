const User = require('../models/User');
const Note = require('../models/note');

const bookmarkController = {
  // Add a note to bookmarks
  addBookmark: async (req, res) => {
    try {
      const { noteId,userId } = req.body;
     // const userId = req.user.id;
      console.log("Useridddddddddddddddddd",userId);

      // Check if note exists
      const note = await Note.findById(noteId);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      // Add note to user's bookmarks if not already bookmarked
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { bookmarkedNotes: noteId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ 
        success: true, 
        message: "Note bookmarked successfully" 
      });

    } catch (error) {
      console.error("Error in addBookmark:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error adding bookmark" 
      });
    }
  },

  // Remove a note from bookmarks
  removeBookmark: async (req, res) => {
    try {
      const noteId = req.params.id;
      const userId = req.user.id;

      console.log("Removing bookmark:", { noteId, userId });

      // Remove note from user's bookmarks
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { bookmarkedNotes: noteId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      // Also remove the user from note's bookmarkedBy array if it exists
      await Note.findByIdAndUpdate(
        noteId,
        { $pull: { bookmarkedBy: userId } }
      );

      res.status(200).json({ 
        success: true, 
        message: "Bookmark removed successfully" 
      });

    } catch (error) {
      console.error("Error in removeBookmark:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error removing bookmark" 
      });
    }
  },

  // Get all bookmarked notes for a user
  getBookmarks: async (req, res) => {
    try {
      const userId = req.user.id;

      // Find user and populate bookmarked notes with necessary information
      const user = await User.findById(userId)
        .populate({
          path: 'bookmarkedNotes',
          populate: {
            path: 'uploadedBy',
            select: 'firstName lastName profileImage'
          }
        });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ 
        success: true, 
        bookmarks: user.bookmarkedNotes 
      });

    } catch (error) {
      console.error("Error in getBookmarks:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching bookmarks" 
      });
    }
  },

  // Check if a note is bookmarked by the user
  isBookmarked: async (req, res) => {
    try {
      const { noteId } = req.params;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isBookmarked = user.bookmarkedNotes.includes(noteId);

      res.status(200).json({ 
        success: true, 
        isBookmarked 
      });

    } catch (error) {
      console.error("Error in isBookmarked:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error checking bookmark status" 
      });
    }
  }
};

module.exports = bookmarkController;


