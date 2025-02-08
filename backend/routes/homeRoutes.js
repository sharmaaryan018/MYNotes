const express = require('express');
const { welcome} = require('../controllers/homeController');
const {authMiddleware} = require('../middleware/authMiddleware')
const router = express.Router();

// Signup route
router.get('/welcome',authMiddleware, welcome);

module.exports = router;
