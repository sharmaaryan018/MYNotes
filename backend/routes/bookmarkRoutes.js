const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookMarkController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Add a note to bookmarks
router.post('/add',authMiddleware, bookmarkController.addBookmark);

// Remove a note from bookmarks
router.delete('/remove/:id',authMiddleware, bookmarkController.removeBookmark);

// Get all bookmarked notes
router.get('/all',authMiddleware, bookmarkController.getBookmarks);

// Check if a note is bookmarked
router.get('/check/:noteId',authMiddleware, bookmarkController.isBookmarked);

module.exports = router;