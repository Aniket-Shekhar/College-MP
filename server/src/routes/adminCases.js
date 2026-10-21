const express = require('express');
const router = express.Router();
const {
  createCase,
  getCaseById,
  updateCase,
  deleteCase,
} = require('../controllers/caseController');
const { requireAuth, requireRole } = require('../middleware/auth');

/**
 * Admin case endpoints (protected)
 */
router.post('/', requireAuth, requireRole(['ADMIN']), createCase);
router.get('/:id', requireAuth, requireRole(['ADMIN']), getCaseById);
router.put('/:id', requireAuth, requireRole(['ADMIN']), updateCase);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), deleteCase);

module.exports = router;
