const express = require('express');
const { createGoal, getCurrentGoals, updateGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createGoal);
router.get('/current-week', protect, getCurrentGoals);
router.put('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);

module.exports = router;
