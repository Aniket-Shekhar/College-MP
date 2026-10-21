const { sendSuccess, sendError } = require('../utils/response');
const {
  getPublicCase,
  getPublishedCases,
  getFullCase,
} = require('../services/CaseService');
const Case = require('../models/Case');

/**
 * Get all published cases
 */
const getCases = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    const cases = await getPublishedCases({ category, difficulty, search });

    return sendSuccess(res, cases);
  } catch (error) {
    next(error);
  }
};

/**
 * Get public case by slug
 */
const getCaseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const caseData = await getPublicCase(slug);

    if (!caseData) {
      return sendError(res, 'CASE_NOT_FOUND', 'Case not found', 404);
    }

    return sendSuccess(res, caseData);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new case (admin only)
 */
const createCase = async (req, res, next) => {
  try {
    const caseData = req.body;

    const newCase = new Case(caseData);
    await newCase.save();

    return sendSuccess(res, newCase, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get full case by ID (admin only)
 */
const getCaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const caseData = await getFullCase(id);

    if (!caseData) {
      return sendError(res, 'CASE_NOT_FOUND', 'Case not found', 404);
    }

    return sendSuccess(res, caseData);
  } catch (error) {
    next(error);
  }
};

/**
 * Update case (admin only)
 */
const updateCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCase = await Case.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCase) {
      return sendError(res, 'CASE_NOT_FOUND', 'Case not found', 404);
    }

    return sendSuccess(res, updatedCase);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete case (admin only)
 */
const deleteCase = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCase = await Case.findByIdAndDelete(id);

    if (!deletedCase) {
      return sendError(res, 'CASE_NOT_FOUND', 'Case not found', 404);
    }

    return sendSuccess(res, { message: 'Case deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCases,
  getCaseBySlug,
  createCase,
  getCaseById,
  updateCase,
  deleteCase,
};
