const express = require('express');
const { postCircleMessage, getCircleMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true }); // Allowing circleId param from parent

router.post('/', protect, postCircleMessage);
router.get('/', protect, getCircleMessages);

module.exports = router;
