const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Goal = require('./models/Goal');
const DailyCheckIn = require('./models/DailyCheckIn');
const WeeklySummary = require('./models/WeeklySummary');
const { getCurrentWeekBoundaries, getCurrentDayBoundaries } = require('./utils/weeklyHelpers');

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

const seedData = async () => {
  try {
    await User.deleteMany();
    await Goal.deleteMany();
    await DailyCheckIn.deleteMany();
    await WeeklySummary.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const { weekStartDate, weekEndDate } = getCurrentWeekBoundaries();
    const { dayStartDate } = getCurrentDayBoundaries();
    const dateString = dayStartDate.toISOString().split('T')[0];

    // 1. Generate Target Cohort: "Internship" & "Applying" (Needs minimum 8 for math threshold)
    const cohortSize = 12;
    const internApplyingCohort = [];
    
    for (let i = 0; i < cohortSize; i++) {
       internApplyingCohort.push({
         name: `Test Cohort User ${i+1}`,
         email: `intern${i}@test.com`,
         password: bcrypt.hashSync('password123', salt),
         role: 'student',
         careerGoal: 'Internship',
         currentStage: 'Applying',
         struggleTypes: ['interview stress', 'burnout', 'impostor syndrome'].filter(() => Math.random() > 0.3), // Randomly assign struggles
         supportPreferences: ['1:1 chat']
       });
    }

    // 2. Generate a different small cohort: "Career Switch" & "Getting Started"
    const switcherCohort = [
       { name: 'Switcher 1', email: 's1@t.com', password: bcrypt.hashSync('p', salt), careerGoal: 'Career Switch', currentStage: 'Getting Started', struggleTypes: ['lack of clarity'] },
       { name: 'Switcher 2', email: 's2@t.com', password: bcrypt.hashSync('p', salt), careerGoal: 'Career Switch', currentStage: 'Getting Started', struggleTypes: ['lack of clarity'] }
    ];

    const allUsers = await User.insertMany([...internApplyingCohort, ...switcherCohort]);
    console.log(`Seeded ${allUsers.length} total Users.`);

    // 3. Seed Weekly Data for the Internship Cohort to power the Insights Engine
    const internUsers = allUsers.filter(u => u.careerGoal === 'Internship');
    
    const goalsToInsert = [];
    const checkInsToInsert = [];

    internUsers.forEach((user, idx) => {
       // Seed Goals (1 to 3 each)
       const numGoals = Math.floor(Math.random() * 3) + 1;
       for (let g = 0; g < numGoals; g++) {
          const isCompleted = Math.random() > 0.4;
          goalsToInsert.push({
             userId: user._id,
             title: `Apply to Company ${g+1}`,
             category: 'applications',
             weekStartDate, weekEndDate,
             status: isCompleted ? 'completed' : 'in_progress',
             progressPercent: isCompleted ? 100 : 50
          });
       }

       // Seed CheckIns (high stress naturally)
       // Let's seed 3 mock days for each user this week so the graph has data if they time-travel back
       for (let mapDay = 1; mapDay <= 3; mapDay++) {
         const pastDate = new Date(dayStartDate);
         pastDate.setDate(pastDate.getDate() - mapDay);
         // only push if still in the week
         if (pastDate >= weekStartDate) {
           checkInsToInsert.push({
             userId: user._id,
             dateString: pastDate.toISOString().split('T')[0],
             weekStartDate, weekEndDate,
             stressLevel: Math.floor(Math.random() * 4) + 5, // 5 to 8 stress
             motivationLevel: Math.floor(Math.random() * 5) + 3,
             confidenceLevel: 4,
             progressState: 'moderate',
             goalRealism: 'realistic'
           });
         }
       }
       
       // And seed today's checkin
       checkInsToInsert.push({
         userId: user._id,
         dateString,
         weekStartDate, weekEndDate,
         stressLevel: Math.floor(Math.random() * 4) + 6, // 6 to 9 stress
         motivationLevel: Math.floor(Math.random() * 5) + 3,
         confidenceLevel: 4,
         progressState: 'moderate',
         goalRealism: 'realistic'
       });
    });

    await Goal.insertMany(goalsToInsert);
    console.log(`Seeded ${goalsToInsert.length} Mock Goals.`);

    await DailyCheckIn.insertMany(checkInsToInsert);
    console.log(`Seeded ${checkInsToInsert.length} Mock Daily Check-ins.`);

    console.log('Mathematical Cohort Seeding Complete! Demo is ready.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seedData);
