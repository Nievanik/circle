const express = require('express');
const { createCircle, getCircles, joinCircle, getCircleDetails, getJoinedCircles, getDiscoverableCircles } = require('../controllers/circleController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mount messages router
const messageRouter = require('./messages');
router.use('/:circleId/messages', messageRouter);

router.post('/', protect, createCircle);
router.get('/', protect, getCircles);
router.get('/joined', protect, getJoinedCircles);
router.get('/discover', protect, getDiscoverableCircles);
router.post('/:id/join', protect, joinCircle);
router.get('/:id', protect, getCircleDetails);

module.exports = router;
