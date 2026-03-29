const express = require('express');
const { upsertSummary, getCurrentSummary } = require('../controllers/weeklySummaryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, upsertSummary);
router.get('/latest', protect, getCurrentSummary);

module.exports = router;
