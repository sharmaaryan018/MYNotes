const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({

  title: { type: String, required: true },

  description: { type: String },

  file: { type: String}, // Link to the uploaded file
  noteId:{type:String},
  uploadedBy:{type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },

  type: { type: String, enum: ['Note', 'PYQ'] },
  department: { type: String}, // Department (for Students only)

  subject: { type: String},
  semester: { type: Number }, // Semester number
  year: { type: Number}, // Year (e.g., 1st, 2nd, 3rd, 4th)
  college: { type:String},
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rejectionReason: { type: String },
  averageRating: { type: Number, default: 0 }, // Average rating of the note
  reviewCount: { type: Number, default: 0 }, // Number of reviews for the note
  createdAt: { type: Date, default: Date.now },
},{timestamps:true});

module.exports = mongoose.model('Note', notesSchema);
