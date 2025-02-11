const express = require('express');
const {authMiddleware,isAdmin} = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController'); // Import adminController

const router = express.Router();

// Signup route
router.get('/welcome', authMiddleware, adminController.welcome);

// Route to get all pending notes
router.get('/getpendingNotes', adminController.getPendingNotes);

// Route to approve a note
router.patch('/approveNote/:noteId',authMiddleware, adminController.approveNote);

// Route to reject a note
router.patch('/rejectNote/:noteId',authMiddleware, adminController.rejectNote);

// Route to get all reviewed notes (approved/rejected)
router.get('/getAllReviewedNotes',authMiddleware, adminController.getAllReviewedNotes);

module.exports = router;
