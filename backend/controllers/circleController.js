const Circle = require('../models/Circle');

exports.createCircle = async (req, res) => {
  try {
    const { name, description, theme, tags } = req.body;

    const circle = await Circle.create({
      name,
      description,
      theme,
      tags,
      creator: req.user.id,
      members: [req.user.id] // Creator is member initially
    });

    res.status(201).json({ success: true, data: circle });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCircles = async (req, res) => {
  try {
    const circles = await Circle.find().populate('creator', 'name role').populate('members', 'name role');
    res.status(200).json({ success: true, count: circles.length, data: circles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getJoinedCircles = async (req, res) => {
  try {
    const circles = await Circle.find({ members: req.user.id })
      .populate('creator', 'name role')
      .populate('members', 'name role');
    res.status(200).json({ success: true, count: circles.length, data: circles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getDiscoverableCircles = async (req, res) => {
  try {
    const circles = await Circle.find({ members: { $ne: req.user.id } })
      .populate('creator', 'name role')
      .populate('members', 'name role');
    res.status(200).json({ success: true, count: circles.length, data: circles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.joinCircle = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.id);
    if (!circle) {
      return res.status(404).json({ success: false, error: 'Circle not found' });
    }

    if (circle.members.includes(req.user.id)) {
      return res.status(400).json({ success: false, error: 'User already in this circle' });
    }

    circle.members.push(req.user.id);
    await circle.save();

    res.status(200).json({ success: true, data: circle });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCircleDetails = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.id)
      .populate('creator', 'name role')
      .populate('members', 'name role careerGoal');

    if (!circle) {
      return res.status(404).json({ success: false, error: 'Circle not found' });
    }

    res.status(200).json({ success: true, data: circle });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
