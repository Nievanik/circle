const mongoose = require('mongoose');

const CircleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  theme: { 
    type: String, 
    enum: ['Internship', 'New Jobs', 'Scholarship', 'Exam Prep', 'Career Switch', 'Freelancing', 'Startup'],
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Circle', CircleSchema);
