const express = require('express');
const router = express.Router();
const {
  getProfile,
  getHistory,
  getAchievements,
  getLeaderboard,
  updateProfile,
} = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

/**
 * User endpoints (protected)
 */
router.get('/profile', requireAuth, getProfile);
router.get('/history', requireAuth, getHistory);
router.get('/achievements', requireAuth, getAchievements);
router.get('/leaderboard', getLeaderboard);
router.put('/profile', requireAuth, updateProfile);

module.exports = router;
