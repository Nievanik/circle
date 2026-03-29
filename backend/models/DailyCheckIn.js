const mongoose = require('mongoose');

const DailyCheckInSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateString: { type: String, required: true }, // Format: YYYY-MM-DD
  weekStartDate: { type: Date, required: true }, // Kept for fast cohort aggregation
  weekEndDate: { type: Date, required: true },
  
  stressLevel: { type: Number, min: 1, max: 10, required: true },
  motivationLevel: { type: Number, min: 1, max: 10, required: true },
  confidenceLevel: { type: Number, min: 1, max: 10, required: true },
  
  progressState: {
    type: String,
    enum: ['no_progress', 'a_little', 'moderate', 'strong_progress'],
    required: true
  },
  goalRealism: {
    type: String,
    enum: ['realistic', 'maybe', 'needs_reduction'],
    required: true
  },
  blockers: [{
    type: String,
    enum: [
      'low energy', 'burnout', 'procrastination', 'lack of clarity', 
      'loneliness', 'anxiety', 'interview stress', 'academic pressure', 
      'motivation issues', 'impostor syndrome', 'other'
    ]
  }],
  reflection: { type: String, default: '' }
}, { timestamps: true });

// Strict unique boundary: One check-in per user per day.
DailyCheckInSchema.index({ userId: 1, dateString: 1 }, { unique: true });

module.exports = mongoose.model('DailyCheckIn', DailyCheckInSchema);
