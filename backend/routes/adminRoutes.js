const express = require('express');
const {authMiddleware,isAdmin} = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController'); // Import adminController

const router = express.Router();

// Signup route
router.get('/welcome', authMiddleware, isAdmin, adminController.welcome);

// Route to get all pending notes
router.get('/getpendingNotes',authMiddleware,isAdmin, adminController.getPendingNotes);

// Route to approve a note
router.patch('/approveNote/:noteId',authMiddleware,isAdmin, adminController.approveNote);

// Route to reject a note
router.patch('/rejectNote/:noteId',authMiddleware,isAdmin, adminController.rejectNote);

// Route to get all reviewed notes (approved/rejected)
router.get('/getAllReviewedNotes',authMiddleware,isAdmin, adminController.getAllReviewedNotes);

module.exports = router;
