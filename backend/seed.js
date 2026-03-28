const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Circle = require('./models/Circle');
const CheckIn = require('./models/CheckIn');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/circle');
    console.log('MongoDB Connected for Seeding');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const personas = [
  {
    name: 'Alex Johnson',
    email: 'alex@student.edu',
    password: 'password123',
    role: 'student',
    universityOrCompany: 'State University',
    careerGoal: 'Software Engineering Internship',
    currentStage: 'interview prep',
    struggleTypes: ['burnout', 'interview stress', 'anxiety'],
    supportPreferences: ['small circle', '1:1 chat'],
    latestMoodScore: 4,
  },
  {
    name: 'Maria Garcia',
    email: 'maria@student.edu',
    password: 'password123',
    role: 'student',
    universityOrCompany: 'Tech Institute',
    careerGoal: 'Software Engineering Internship',
    currentStage: 'interview prep',
    struggleTypes: ['impostor syndrome', 'interview stress'],
    supportPreferences: ['small circle', 'accountability partner'],
    latestMoodScore: 6,
  },
  {
    name: 'James Smith',
    email: 'james@graduate.edu',
    password: 'password123',
    role: 'graduate',
    universityOrCompany: 'Design Academy',
    careerGoal: 'UX Designer Full-time',
    currentStage: 'applying',
    struggleTypes: ['loneliness', 'lack of clarity', 'procrastination'],
    supportPreferences: ['1:1 chat'],
    latestMoodScore: 3,
  },
  {
    name: 'Sarah Lee',
    email: 'sarah@professional.com',
    password: 'password123',
    role: 'professional',
    universityOrCompany: 'TechCorp',
    careerGoal: 'Switching to Product Management',
    currentStage: 'switching career',
    struggleTypes: ['impostor syndrome', 'burnout'],
    supportPreferences: ['group discussion'],
    latestMoodScore: 5,
  }
];

const seedData = async () => {
  try {
    await User.deleteMany();
    await Circle.deleteMany();
    await CheckIn.deleteMany();

    // Hash passwords and create users
    const salt = await bcrypt.genSalt(10);
    const usersData = personas.map(p => ({
      ...p,
      password: bcrypt.hashSync(p.password, salt)
    }));
    
    // Bypass the pre-save hook for seeding by using insertMany or create 
    // Wait, insertMany skips pre-save hooks so we must pre-hash.
    const createdUsers = await User.insertMany(usersData);
    console.log(`Seeded ${createdUsers.length} Users.`);

    // Create Circles
    const circle1 = await Circle.create({
      name: 'SWE Interns 2026',
      description: 'A circle for students stressed about Leetcode and behavioral rounds.',
      theme: 'career_goal',
      creator: createdUsers[0]._id,
      members: [createdUsers[0]._id, createdUsers[1]._id],
      tags: ['SWE', 'Interviews', 'Anxiety']
    });

    const circle2 = await Circle.create({
      name: 'Burnout Recovery',
      description: 'Support group for professionals and students dealing with intense burnout.',
      theme: 'challenge_type',
      creator: createdUsers[3]._id,
      members: [createdUsers[3]._id, createdUsers[0]._id],
      tags: ['Mental Health', 'Burnout']
    });

    console.log('Seeded 2 Circles.');

    // Seed some checkins
    await CheckIn.create({
      user: createdUsers[0]._id,
      mood: 4,
      stressLevel: 8,
      motivationLevel: 5,
      confidenceLevel: 3,
      struggleToday: 'Failing mock interviews repeatedly.',
      supportNeededToday: 'Need someone to review my code approach.',
    });

    console.log('Seeded Check-Ins.');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seedData);
