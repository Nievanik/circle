const mongoose = require('mongoose');

const WeeklySummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStartDate: { type: Date, required: true },
  weekEndDate: { type: Date, required: true },
  
  goalsCompleted: { type: Number, default: 0 },
  goalsPartial: { type: Number, default: 0 },
  goalsIncomplete: { type: Number, default: 0 },
  
  overallFeeling: {
    type: String,
    enum: ['proud', 'okay', 'stressed', 'overwhelmed', 'disappointed', 'hopeful', 'exhausted'],
    required: true
  },
  supportNeededNextWeek: { type: Boolean, default: false },
  summaryNote: { type: String, default: '' }
}, { timestamps: true });

// One layout wrap-up per user per week
WeeklySummarySchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

module.exports = mongoose.model('WeeklySummary', WeeklySummarySchema);
