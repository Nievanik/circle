const CheckIn = require('../models/CheckIn');
const User = require('../models/User');

exports.createOrUpdateCheckIn = async (req, res) => {
  try {
    const { mood, stressLevel, motivationLevel, confidenceLevel, struggleToday, supportNeededToday, goalsForWeek } = req.body;

    // Get today's start and end bounds
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // See if checkin already exists for today
    let checkIn = await CheckIn.findOne({
      user: req.user.id,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (checkIn) {
      // Update existing checkin
      checkIn.mood = mood;
      checkIn.stressLevel = stressLevel;
      checkIn.motivationLevel = motivationLevel;
      checkIn.confidenceLevel = confidenceLevel;
      checkIn.struggleToday = struggleToday;
      checkIn.supportNeededToday = supportNeededToday;
      checkIn.goalsForWeek = goalsForWeek;
      await checkIn.save();
    } else {
      // Create new one
      checkIn = await CheckIn.create({
        user: req.user.id,
        mood,
        stressLevel,
        motivationLevel,
        confidenceLevel,
        struggleToday,
        supportNeededToday,
        goalsForWeek
      });
    }

    // Always update user's latest mood score
    await User.findByIdAndUpdate(req.user.id, { latestMoodScore: mood });

    res.status(200).json({ success: true, isUpdate: !!checkIn._id, data: checkIn });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTodayCheckIn = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const checkIn = await CheckIn.findOne({
      user: req.user.id,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    res.status(200).json({ success: true, data: checkIn });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: checkIns.length, data: checkIns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
