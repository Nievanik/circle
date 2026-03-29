const Goal = require('../models/Goal');
const DailyCheckIn = require('../models/DailyCheckIn');
const WeeklySummary = require('../models/WeeklySummary');
const { getCurrentWeekBoundaries, getCurrentDayBoundaries } = require('../utils/weeklyHelpers');
const insightService = require('../services/insightService');

exports.getWeeklyOverview = async (req, res) => {
  try {
    const { weekStartDate, weekEndDate } = getCurrentWeekBoundaries(req.simulatedDate);
    const { dayStartDate } = getCurrentDayBoundaries(req.simulatedDate);
    const dateString = dayStartDate.toISOString().split('T')[0];
    
    const userId = req.user.id;

    // Fetch all three domains in parallel securely 
    const [goals, checkIn, summary] = await Promise.all([
      Goal.find({ userId, weekStartDate }).sort({ createdAt: -1 }),
      DailyCheckIn.findOne({ userId, dateString }),
      WeeklySummary.findOne({ userId, weekStartDate })
    ]);

    const completedGoals = goals.filter(g => g.status === 'completed' || g.progressPercent === 100);
    const partialGoals = goals.filter(g => g.status === 'partial' || (g.progressPercent > 0 && g.progressPercent < 100));

    res.status(200).json({
      success: true,
      data: {
        weekRange: { start: weekStartDate, end: weekEndDate },
        simulatedDate: req.simulatedDate,
        dayOfWeek: req.simulatedDate.getDay(), // 0 = Sunday, 1 = Monday
        goals: {
          items: goals,
          counts: {
            total: goals.length,
            completed: completedGoals.length,
            partial: partialGoals.length
          }
        },
        hasCheckIn: !!checkIn,
        checkIn: checkIn || null,
        hasSummary: !!summary,
        summary: summary || null
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getInsights = async (req, res) => {
  try {
    const payload = await insightService.generateWeeklyInsights(req.user.id, req.simulatedDate);
    res.status(200).json({ success: true, data: payload });
  } catch (err) {
    console.error('Insights Error:', err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    // For recharts, we want chronological progression
    const dailyCheckIns = await DailyCheckIn.find({ userId }).sort({ dateString: 1 });
    
    res.status(200).json({ success: true, data: dailyCheckIns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
