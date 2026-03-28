const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'recent graduate', 'professional', 'career switcher'],
    default: 'student'
  },
  universityOrCompany: { type: String },
  location: { type: String },
  bio: { type: String },
  fieldOfStudy: { type: String },

  // Matching Preferences
  careerGoal: { 
    type: String,
    enum: ['Internship', 'New Jobs', 'Scholarship', 'Exam Prep', 'Career Switch', 'Freelancing', 'Startup']
  },
  currentStage: {
    type: String,
    enum: ['Exploring', 'Getting Started', 'Building Skills', 'Preparing / Practicing', 'Applying', 'Interviewing', 'Transitioning', 'Paused / Recovering']
  },
  struggleTypes: [{
    type: String,
    enum: ['burnout', 'procrastination', 'loneliness', 'anxiety', 'lack of clarity', 'motivation issues', 'impostor syndrome', 'interview stress', 'academic pressure']
  }],
  supportPreferences: [{
    type: String,
    enum: ['1:1 chat', 'small circle', 'accountability partner', 'group discussion', 'anonymous support']
  }],
  
  availabilityTimezone: { type: String },
  preferredLanguage: { type: String, default: 'English' },

  // Emotional Check-in Quick Score
  latestMoodScore: { type: Number, min: 1, max: 10, default: 5 },

}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
