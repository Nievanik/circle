const express = require('express');
const { getWeeklyOverview, getInsights, getHistory } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/weekly-overview', protect, getWeeklyOverview);
router.get('/insights', protect, getInsights);
router.get('/history', protect, getHistory);

module.exports = router;
