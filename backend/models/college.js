const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String },
    establishedYear: { type: Number },
    website: { type: String },
    totalStudents: { type: Number, default: 0 },
  });
  
  module.exports = mongoose.model('College', collegeSchema);
  