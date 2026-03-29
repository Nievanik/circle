const express = require('express');
const { postCircleMessage, getCircleMessages, postDirectMessage, getDirectMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true }); // Allowing circleId param from parent

router.post('/', protect, postCircleMessage);
router.get('/', protect, getCircleMessages);

// Direct Messages
router.post('/direct/:receiverId', protect, postDirectMessage);
router.get('/direct/:receiverId', protect, getDirectMessages);

module.exports = router;
