const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Post title
  content: { type: String, required: true }, // Post content
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to alumni
  tags: [{ type: String }], // Optional tags
  image: { type: String }, // Optional image URL
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model('Post', postSchema);
