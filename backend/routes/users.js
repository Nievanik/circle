const express = require('express');
const { updateProfile, getMatches, getUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/matches', protect, getMatches);
router.get('/:id', protect, getUserById); // Must be after explicit routes
router.get('/', protect, getUsers);

module.exports = router;
