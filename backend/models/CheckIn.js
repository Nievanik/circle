const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: { type: Number, min: 1, max: 10, required: true },
  stressLevel: { type: Number, min: 1, max: 10, required: true },
  motivationLevel: { type: Number, min: 1, max: 10, required: true },
  confidenceLevel: { type: Number, min: 1, max: 10, required: true },
  struggleToday: { type: String },
  supportNeededToday: { type: String },
  goalsForWeek: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CheckIn', CheckInSchema);
