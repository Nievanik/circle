const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedInitialData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/circle');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing users from local environment safely
    await User.deleteMany({});
    console.log('Cleared existing local users...');

    console.log('Generating 8 mock Hackathon judges...');
    
    const usersToInsert = [];
    for (let i = 1; i <= 8; i++) {
       // Spread variation logic purely for visual demo telemetry
       const roles = ['student', 'recent graduate', 'professional'];
       const goals = ['Internship', 'New Jobs', 'Career Switch'];
       const struggles = ['burnout', 'procrastination', 'interview stress'];
       
       usersToInsert.push({
         name: `TestUser${i}`,
         email: `user${i}@test.com`,
         password: `user${i}`,
         role: roles[i % 3],
         careerGoal: goals[i % 3],
         currentStage: 'Getting Started',
         struggleTypes: [struggles[i % 3]]
       });
    }

    // Insert iteratively to force Mongoose 'pre-save' hooks for Password Bcrypt Hashing
    for (const u of usersToInsert) {
       const user = new User(u);
       await user.save();
    }

    console.log('Seeding Complete! You can log in using: email: user1@test.com / password: user1');
    process.exit(0);
  } catch (err) {
    console.error(`Seeding Failed: ${err.message}`);
    process.exit(1);
  }
};

seedInitialData();
