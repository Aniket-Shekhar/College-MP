const {
  createInvestigation,
  getInvestigationById,
  getUserInvestigationsForCase,
  getUserInvestigations,
  updateInvestigation,
  discoverEvidence,
  abandonInvestigation,
} = require('../services/InvestigationService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Create new investigation
 */
const createInvestigationHandler = async (req, res, next) => {
  try {
    const { caseId } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const result = await createInvestigation(userId, caseId);

    if (!result.success) {
      if (result.error === 'INVESTIGATION_EXISTS') {
        return sendSuccess(res, result.investigation);
      }
      return sendError(res, result.error, result.error, 400);
    }

    return sendSuccess(res, result.investigation, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get investigation by ID
 */
const getInvestigationByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const result = await getInvestigationById(id, userId);

    if (!result.success) {
      const statusCode = result.error === 'INVESTIGATION_NOT_FOUND' ? 404 : 403;
      return sendError(res, result.error, result.error, statusCode);
    }

    return sendSuccess(res, result.investigation);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's investigations for a case
 */
const getInvestigationsForCaseHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const result = await getUserInvestigationsForCase(userId, caseId);

    if (!result.success) {
      return sendError(res, result.error, result.error, 500);
    }

    return sendSuccess(res, result.investigations);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all user investigations
 */
const getUserInvestigationsHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const result = await getUserInvestigations(userId);

    if (!result.success) {
      return sendError(res, result.error, result.error, 500);
    }

    return sendSuccess(res, result.investigations);
  } catch (error) {
    next(error);
  }
};

/**
 * Update investigation (autosave)
 */
const updateInvestigationHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const result = await updateInvestigation(id, userId, updates);

    if (!result.success) {
      const statusCode = result.error === 'INVESTIGATION_COMPLETED' ? 409 : 400;
      return sendError(res, result.error, result.error, statusCode);
    }

    return sendSuccess(res, result.investigation);
  } catch (error) {
    next(error);
  }
};

/**
 * Discover evidence
 */
const discoverEvidenceHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { evidenceId } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const result = await discoverEvidence(id, userId, evidenceId);

    if (!result.success) {
      const statusCode = result.error === 'EVIDENCE_HIDDEN' ? 403 : 400;
      return sendError(res, result.error, result.error, statusCode);
    }

    return sendSuccess(res, result.investigation);
  } catch (error) {
    next(error);
  }
};

/**
 * Abandon investigation
 */
const abandonInvestigationHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const result = await abandonInvestigation(id, userId);

    if (!result.success) {
      return sendError(res, result.error, result.error, 400);
    }

    return sendSuccess(res, result.investigation);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvestigationHandler,
  getInvestigationByIdHandler,
  getInvestigationsForCaseHandler,
  getUserInvestigationsHandler,
  updateInvestigationHandler,
  discoverEvidenceHandler,
  abandonInvestigationHandler,
};
