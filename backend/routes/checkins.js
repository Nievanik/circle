const express = require('express');
const { createOrUpdateCheckIn, getUserCheckIns, getTodayCheckIn } = require('../controllers/checkInController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createOrUpdateCheckIn);
router.get('/', protect, getUserCheckIns);
router.get('/today', protect, getTodayCheckIn);

module.exports = router;
