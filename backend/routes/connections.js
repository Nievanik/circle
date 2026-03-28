const express = require('express');
const { sendRequest, getIncomingRequests, getOutgoingRequests, updateRequestStatus, getConnections } = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, sendRequest);
router.get('/incoming', protect, getIncomingRequests);
router.get('/outgoing', protect, getOutgoingRequests);
router.put('/:id', protect, updateRequestStatus);
router.get('/', protect, getConnections); // Accepted connections

module.exports = router;
