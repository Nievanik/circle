const DailyCheckIn = require('../models/DailyCheckIn');
const { getCurrentWeekBoundaries, getCurrentDayBoundaries } = require('../utils/weeklyHelpers');

exports.upsertCheckIn = async (req, res) => {
  try {
    const { weekStartDate, weekEndDate } = getCurrentWeekBoundaries(req.simulatedDate);
    const { dayStartDate } = getCurrentDayBoundaries(req.simulatedDate);
    
    // Format YYYY-MM-DD
    const dateString = dayStartDate.toISOString().split('T')[0];
    
    let checkin = await DailyCheckIn.findOne({ userId: req.user.id, dateString });
    
    if (checkin) {
      Object.assign(checkin, req.body);
      await checkin.save();
    } else {
      checkin = await DailyCheckIn.create({ 
         ...req.body, 
         userId: req.user.id,
         dateString,
         weekStartDate,
         weekEndDate
      });
    }

    res.status(200).json({ success: true, data: checkin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCurrentCheckIn = async (req, res) => {
  try {
    const { dayStartDate } = getCurrentDayBoundaries(req.simulatedDate);
    const dateString = dayStartDate.toISOString().split('T')[0];
    
    const checkin = await DailyCheckIn.findOne({ userId: req.user.id, dateString });
    res.status(200).json({ success: true, data: checkin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
