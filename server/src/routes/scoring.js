const express = require('express');
const router = express.Router();
const {
  submitConclusion,
  getScore,
} = require('../controllers/scoringController');
const { requireAuth } = require('../middleware/auth');

/**
 * Scoring endpoints (protected)
 */
router.post('/:id/conclusion', requireAuth, submitConclusion);
router.get('/:id/score', requireAuth, getScore);

module.exports = router;
