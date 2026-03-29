const Goal = require('../models/Goal');
const { getCurrentWeekBoundaries } = require('../utils/weeklyHelpers');

exports.createGoal = async (req, res) => {
  try {
    const { weekStartDate, weekEndDate } = getCurrentWeekBoundaries(req.simulatedDate);
    
    // Check goal limit
    const existingGoals = await Goal.countDocuments({
      userId: req.user.id,
      weekStartDate
    });
    
    if (existingGoals >= 3) {
      return res.status(400).json({ success: false, error: 'Smaller goals often improve consistency. You already have 3 goals this week.' });
    }

    const goal = await Goal.create({
      ...req.body,
      userId: req.user.id,
      weekStartDate,
      weekEndDate
    });

    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCurrentGoals = async (req, res) => {
  try {
    const { weekStartDate } = getCurrentWeekBoundaries(req.simulatedDate);
    const goals = await Goal.find({ userId: req.user.id, weekStartDate }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: goals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal || goal.userId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    // Only allow updates to title, description, category, progress, status, isAdjusted
    const allowedUpdates = ['title', 'description', 'category', 'progressPercent', 'status', 'isAdjusted'];
    allowedUpdates.forEach(field => {
       if (req.body[field] !== undefined) goal[field] = req.body[field];
    });

    if (goal.progressPercent === 100) goal.status = 'completed';

    await goal.save();
    res.status(200).json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal || goal.userId.toString() !== req.user.id) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
