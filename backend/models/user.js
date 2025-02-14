const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // First Name
  lastName: { type: String, required: true },  // Last Name
  email: { type: String, required: true, unique: true }, // Unique Email
  password: { type: String, required: true }, // Password
  role: { type: String, enum: ['Student', 'Alumni', 'Admin']}, // Role-based Access
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false }, // Gender
  dob: { type: Date }, // Date of Birth
  contact: { type: String }, // Contact Number
  year: { type: Number,  function() { return this.role === 'Student'; } }, // Year (for Students only)
  department: { type: String, function() { return this.role === 'Student'; } }, // Department (for Students only)
  about: { type: String, maxlength: 500 }, // Short Bio/About
  token: { type: String }, // JWT Token for Authentication
  profileImage: { type: String }, // URL for Profile Picture
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },// College Reference

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
   // References to alumni posts
  note: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  
  createdAt: { type: Date, default: Date.now }, // Creation Time
});

module.exports = mongoose.model('User', userSchema);
