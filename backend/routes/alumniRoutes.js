const express = require('express');
const router = express.Router();
const alumniPostController = require('../controllers/alumniPostController');
const {authMiddleware,isAlumni} = require('../middleware/authMiddleware');

// Routes for alumni posts
router.post('/createPost', authMiddleware,isAlumni, alumniPostController.createPost);
router.get('/getAllPosts', alumniPostController.getAllPosts);
router.get('/getPostById/:id', alumniPostController.getPostById);
router.put('/updatePost/:id', authMiddleware,isAlumni, alumniPostController.updatePost);
router.delete('/deletePost/:id', authMiddleware, isAlumni,alumniPostController.deletePost);

module.exports = router;
