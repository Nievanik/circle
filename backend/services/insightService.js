const User = require('../models/User');
const Goal = require('../models/Goal');
const DailyCheckIn = require('../models/DailyCheckIn');
const { getCurrentWeekBoundaries } = require('../utils/weeklyHelpers');
const msg = require('../utils/insightMessages');

exports.generateWeeklyInsights = async (userId, simulatedDate = null) => {
  const user = await User.findById(userId);
  if (!user || !user.careerGoal || !user.currentStage) {
    return { fallback: true, insights: [{ type: 'reassurance', message: msg.getFallbackMessage() }] };
  }

  const { weekStartDate, weekEndDate } = getCurrentWeekBoundaries(simulatedDate);

  // Define Cohort (excluding cur user)
  const cohortUsers = await User.find({
    careerGoal: user.careerGoal,
    currentStage: user.currentStage,
    _id: { $ne: userId }
  }).select('_id struggles struggleTypes');

  const cohortSize = cohortUsers.length;
  // Threshold
  if (cohortSize < 8) {
    return {
      cohort: { size: cohortSize, careerGoal: user.careerGoal, progressStage: user.currentStage },
      metrics: null,
      userComparison: null,
      fallback: true,
      insights: [
         { type: 'reassurance', message: msg.getFallbackMessage() },
         { type: 'reassurance', message: `Only ${cohortSize} others share this exact target path right now. Don't worry if things feel isolated, that means you're forging a new road.` }
      ]
    };
  }

  const cohortUserIds = cohortUsers.map(u => u._id);

  // 1. Cohort Goals for this week
  const cohortGoals = await Goal.find({
    userId: { $in: cohortUserIds },
    weekStartDate
  });

  const completedGoals = cohortGoals.filter(g => g.status === 'completed' || g.progressPercent === 100);
  const avgCompletedGoals = cohortGoals.length > 0 ? (completedGoals.length / cohortSize).toFixed(1) : 0;

  // 2. Cohort Check-Ins for this week (pulls all daily checkins bound to this week's ID)
  const cohortCheckIns = await DailyCheckIn.find({
    userId: { $in: cohortUserIds },
    weekStartDate
  });

  let totalStress = 0;
  let highStressCount = 0;
  cohortCheckIns.forEach(c => {
    totalStress += c.stressLevel;
    if (c.stressLevel >= 7) highStressCount++;
  });

  const avgStressLevel = cohortCheckIns.length > 0 ? Math.round(totalStress / cohortCheckIns.length) : null;
  const highStressRate = cohortCheckIns.length > 0 ? Math.round((highStressCount / cohortCheckIns.length) * 100) : 0;
  const checkInRate = Math.round((cohortCheckIns.length / cohortSize) * 100);

  // 3. Struggle Normalization (Shared Struggles)
  // Let's find the most common struggle in the cohort that the CURRENT user also has
  let topSharedStruggle = null;
  let topStrugglePercent = 0;

  if (user.struggleTypes && user.struggleTypes.length > 0) {
    user.struggleTypes.forEach(struggle => {
      const matchCount = cohortUsers.filter(u => u.struggleTypes && u.struggleTypes.includes(struggle)).length;
      const pct = Math.round((matchCount / cohortSize) * 100);
      if (pct > topStrugglePercent) {
        topStrugglePercent = pct;
        topSharedStruggle = struggle;
      }
    });
  }

  // 4. Current User Data
  const userGoals = await Goal.find({ userId, weekStartDate });
  const userCompleted = userGoals.filter(g => g.status === 'completed' || g.progressPercent === 100).length;
  
  // Logic
  let pace = 'within_range';
  if (userCompleted < avgCompletedGoals - 1) pace = 'below_range';
  if (userCompleted > avgCompletedGoals + 1) pace = 'above_range';

  // Build Output Templates
  const insights = [];
  
  // Metric A: Shared Struggle
  if (topSharedStruggle && topStrugglePercent >= 20) {
     insights.push({
       type: 'shared_struggle',
       message: msg.getSharedStruggleMessage(topStrugglePercent, topSharedStruggle)
     });
  }

  // Metric B: Pace
  insights.push({
     type: 'pace',
     message: msg.getPaceReassuranceMessage(pace, avgCompletedGoals)
  });

  // Metric C: Stress
  if (avgStressLevel !== null) {
      insights.push({
        type: 'stress',
        message: msg.getStressReassuranceMessage(avgStressLevel, highStressRate)
      });
  } else {
     insights.push({
        type: 'reassurance',
        message: "Your peers haven't checked in this week yet. Make sure to complete your Quick Check-In so we can aggregate cohort stress patterns."
     });
  }

  return {
    cohort: {
      careerGoal: user.careerGoal,
      progressStage: user.currentStage,
      size: cohortSize
    },
    metrics: {
      sharedStrugglePercent: topStrugglePercent,
      averageWeeklyGoalsCompleted: parseFloat(avgCompletedGoals),
      averageStressLevel: avgStressLevel,
      highStressRate,
      checkInRate
    },
    userComparison: {
      goalCompletionVsPeers: pace
    },
    fallback: false,
    insights
  };
};
