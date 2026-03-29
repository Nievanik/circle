const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Models
const User = require('./models/User');
const Goal = require('./models/Goal');
const DailyCheckIn = require('./models/DailyCheckIn');
const WeeklySummary = require('./models/WeeklySummary');
const Circle = require('./models/Circle');
const ConnectionRequest = require('./models/ConnectionRequest');

dotenv.config();

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/circle');
    console.log('MongoDB Connected for Clearing');

    console.log('Clearing database...');
    await User.deleteMany();
    await Goal.deleteMany();
    await DailyCheckIn.deleteMany();
    await WeeklySummary.deleteMany();
    await Circle.deleteMany();
    await ConnectionRequest.deleteMany();
    
    console.log('Database successfully cleared!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

clearDB();
