const express = require('express');
const router = express.Router();
const {
  createInvestigationHandler,
  getInvestigationByIdHandler,
  getInvestigationsForCaseHandler,
  getUserInvestigationsHandler,
  updateInvestigationHandler,
  discoverEvidenceHandler,
  abandonInvestigationHandler,
} = require('../controllers/investigationController');
const { requireAuth } = require('../middleware/auth');
const boardRouter = require('./board');
const scoringRouter = require('./scoring');

/**
 * Investigation endpoints (protected)
 */
router.post('/', requireAuth, createInvestigationHandler);
router.get('/', requireAuth, getUserInvestigationsHandler);
router.get('/case/:caseId', requireAuth, getInvestigationsForCaseHandler);
router.get('/:id', requireAuth, getInvestigationByIdHandler);
router.put('/:id', requireAuth, updateInvestigationHandler);
router.post('/:id/discover', requireAuth, discoverEvidenceHandler);
router.post('/:id/abandon', requireAuth, abandonInvestigationHandler);

// Board routes (nested under investigations)
router.use('/:id', boardRouter);

// Scoring routes (nested under investigations)
router.use('/:id', scoringRouter);

module.exports = router;
