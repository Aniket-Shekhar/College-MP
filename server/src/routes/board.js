const express = require('express');
const router = express.Router();
const { saveBoard, getBoard } = require('../controllers/boardController');
const { requireAuth } = require('../middleware/auth');
const { validateBoard } = require('../middleware/boardValidator');

/**
 * Board endpoints (protected)
 * These are nested under /api/v1/investigations/:id
 */
router.put('/board', requireAuth, validateBoard, saveBoard);
router.get('/board', requireAuth, getBoard);

module.exports = router;
