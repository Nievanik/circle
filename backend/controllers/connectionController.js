const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');

exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({ success: false, error: 'Cannot send request to yourself.' });
    }

    // Check if already requested or connected
    const existing = await ConnectionRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existing) {
      if (existing.status === 'rejected') {
        // Reuse the old rejected request, swap sender/receiver to the new initiator, and reset to pending
        existing.status = 'pending';
        existing.sender = senderId;
        existing.receiver = receiverId;
        await existing.save();

        const socketIo = require('../socket');
        const receiverSocketRaw = socketIo.getUserSocket(receiverId);
        if (receiverSocketRaw) {
          const populatedReq = await ConnectionRequest.findById(existing._id).populate('sender', 'name role currentStage latestMoodScore');
          socketIo.getIO().to(receiverSocketRaw).emit('NEW_CONNECTION_REQUEST', populatedReq);
        }

        return res.status(201).json({ success: true, data: existing });
      }
      return res.status(400).json({ success: false, error: 'Connection already exists or is pending.' });
    }

    const request = await ConnectionRequest.create({ sender: senderId, receiver: receiverId });
    
    // Look for WebSocket ID of receiver
    const socketIo = require('../socket');
    const receiverSocketRaw = socketIo.getUserSocket(receiverId);
    if (receiverSocketRaw) {
      // Need populated request data to dispatch
      const populatedReq = await ConnectionRequest.findById(request._id).populate('sender', 'name role currentStage latestMoodScore');
      socketIo.getIO().to(receiverSocketRaw).emit('NEW_CONNECTION_REQUEST', populatedReq);
    }

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    console.error('sendRequest Error:', err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ receiver: req.user.id, status: 'pending' }).populate('sender', 'name role currentStage latestMoodScore');
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOutgoingRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ sender: req.user.id, status: 'pending' }).populate('receiver', 'name role');
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const request = await ConnectionRequest.findOneAndUpdate(
      { _id: req.params.id, receiver: req.user.id, status: 'pending' },
      { status },
      { returnDocument: 'after' }
    ).populate('receiver', 'name role');

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found or not pending' });
    }

    // Look for WebSocket ID of sender to notify them of acceptance/rejection
    const socketIo = require('../socket');
    const senderSocketRaw = socketIo.getUserSocket(request.sender);
    if (senderSocketRaw) {
       socketIo.getIO().to(senderSocketRaw).emit('CONNECTION_RESPONSE', request);
    }

    res.status(200).json({ success: true, data: request });
  } catch (err) {
    console.error('updateRequestStatus Error:', err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getConnections = async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
      status: 'accepted'
    }).populate('sender', 'name role').populate('receiver', 'name role');
    res.status(200).json({ success: true, count: connections.length, data: connections });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
