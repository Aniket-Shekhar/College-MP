const express = require('express');
const router = express.Router();
const { getCases, getCaseBySlug } = require('../controllers/caseController');

/**
 * Public case endpoints
 */
router.get('/', getCases);
router.get('/:slug', getCaseBySlug);

module.exports = router;
