const Message = require('../models/Message');
const Circle = require('../models/Circle');

exports.postCircleMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const circleId = req.params.circleId;
    
    // Validate circle membership first
    const circle = await Circle.findById(circleId);
    if (!circle) return res.status(404).json({ success: false, error: 'Circle not found' });
    
    if (!circle.members.includes(req.user.id)) {
      return res.status(403).json({ success: false, error: 'You are not a member of this circle' });
    }

    const message = await Message.create({
      sender: req.user.id,
      circle: circleId,
      content
    });

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCircleMessages = async (req, res) => {
  try {
    const circleId = req.params.circleId;
    
    // Determine membership
    const circle = await Circle.findById(circleId);
    if (!circle) return res.status(404).json({ success: false, error: 'Circle not found' });
    
    if (!circle.members.includes(req.user.id)) {
      return res.status(403).json({ success: false, error: 'You must join to see messages' });
    }

    const messages = await Message.find({ circle: circleId })
      .sort('createdAt')
      .populate('sender', 'name role');

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.postDirectMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const receiverId = req.params.receiverId;
    const senderId = req.user.id;

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content
    });

    const populatedMessage = await message.populate('sender', 'name role');

    // Emit via socket if user is online
    const socketIo = require('../socket').getIO();
    const userSocket = require('../socket').getUserSocket(receiverId);
    
    if (userSocket) {
      socketIo.to(userSocket).emit('new_direct_message', populatedMessage);
    }

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getDirectMessages = async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const senderId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort('createdAt').populate('sender', 'name role');

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
