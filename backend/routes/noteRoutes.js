const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const {authMiddleware,isStudent} = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const note = require('../models/note');



// Create a new note
router.post('/createNote',authMiddleware,isStudent,uploadMiddleware.single("file"),noteController.createNote);
// // Get all notes
router.get('/getAllNotes', noteController.getAllNotes);
// Get a specific note by ID
router.get('/getNoteById/:id', noteController.getNoteById);
// Update note status (Approved/Rejected)
router.put('/updateNoteStatus/:id/status',noteController.updateNoteStatus);
// Delete a note
router.delete('/deleteNote/:id',authMiddleware,noteController.deleteNote);
router.put('/editNote/:id',authMiddleware,uploadMiddleware.single("file"),noteController.editNote);

router.get('/getUserById/:id', noteController.getUserById);

router.get('/approvedNotes',authMiddleware,noteController.approvedNotes)

router.get("/stats",noteController.stats)

router.get('/getUserStats/:userId', noteController.getUserStats);

module.exports = router;
