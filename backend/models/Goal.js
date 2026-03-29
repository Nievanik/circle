const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: [
      'applications', 'learning', 'interview_prep', 'networking',
      'exam_study', 'scholarship_prep', 'portfolio_resume',
      'freelancing_work', 'startup_work', 'personal_wellbeing'
    ],
    required: true
  },
  weekStartDate: { type: Date, required: true },
  weekEndDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'partial', 'incomplete'],
    default: 'not_started'
  },
  progressPercent: { type: Number, min: 0, max: 100, default: 0 },
  isAdjusted: { type: Boolean, default: false }
}, { timestamps: true });

// Ensure we don't accidentally fetch goals from the wrong week or user
GoalSchema.index({ userId: 1, weekStartDate: 1 });

module.exports = mongoose.model('Goal', GoalSchema);
