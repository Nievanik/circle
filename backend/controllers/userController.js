const User = require('../models/User');
const matchingService = require('../services/matchingService');

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    // Optionally compute sync match score against current user
    const currentUser = await User.findById(req.user.id);
    const score = matchingService.calculateMatchScore(currentUser, user);

    res.status(200).json({ success: true, data: { user, score } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const allUsers = await User.find({ _id: { $ne: req.user.id } });

    const matches = allUsers.map(user => {
      const score = matchingService.calculateMatchScore(currentUser, user);
      return { user, score };
    })
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Top 10 matches

    res.status(200).json({ success: true, count: matches.length, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
