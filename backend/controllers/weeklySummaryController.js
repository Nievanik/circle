const WeeklySummary = require('../models/WeeklySummary');
const { getCurrentWeekBoundaries } = require('../utils/weeklyHelpers');

exports.upsertSummary = async (req, res) => {
  try {
    const { weekStartDate, weekEndDate } = getCurrentWeekBoundaries(req.simulatedDate);
    
    let summary = await WeeklySummary.findOne({ userId: req.user.id, weekStartDate });
    
    if (summary) {
      Object.assign(summary, req.body);
      await summary.save();
    } else {
      summary = await WeeklySummary.create({ 
         ...req.body, 
         userId: req.user.id,
         weekStartDate,
         weekEndDate
      });
    }

    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCurrentSummary = async (req, res) => {
  try {
    const { weekStartDate } = getCurrentWeekBoundaries(req.simulatedDate);
    const summary = await WeeklySummary.findOne({ userId: req.user.id, weekStartDate });
    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
