const express = require('express');
const { upsertCheckIn, getCurrentCheckIn } = require('../controllers/dailyCheckInController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, upsertCheckIn);
router.get('/current-day', protect, getCurrentCheckIn);

module.exports = router;
