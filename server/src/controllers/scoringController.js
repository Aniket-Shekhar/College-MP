const { calculateScore } = require('../services/ScoringService');
const { updateUserStats } = require('../services/UserService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Submit conclusion and calculate score
 */
const submitConclusion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answerId, explanation, selectedEvidenceIds } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    // Validate required fields
    if (!answerId) {
      return sendError(res, 'INVALID_INPUT', 'answerId is required', 400);
    }

    if (!explanation || explanation.trim().length === 0) {
      return sendError(res, 'INVALID_INPUT', 'explanation is required', 400);
    }

    const conclusionData = {
      answerId,
      explanation: explanation.trim(),
      selectedEvidenceIds: selectedEvidenceIds || [],
    };

    const result = await calculateScore(id, conclusionData);

    if (!result.success) {
      const statusCode = result.error === 'INVESTIGATION_COMPLETED' ? 409 : 400;
      return sendError(res, result.error, result.error, statusCode);
    }

    // Update user stats after completion
    await updateUserStats(userId);

    return sendSuccess(res, result.investigation);
  } catch (error) {
    next(error);
  }
};

/**
 * Get investigation score (read-only)
 */
const getScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const Investigation = require('../models/Investigation');
    const investigation = await Investigation.findById(id);

    if (!investigation) {
      return sendError(
        res,
        'INVESTIGATION_NOT_FOUND',
        'Investigation not found',
        404
      );
    }

    // Verify ownership
    if (investigation.userId.toString() !== userId.toString()) {
      return sendError(
        res,
        'FORBIDDEN',
        'You do not own this investigation',
        403
      );
    }

    // Return score if investigation is completed
    if (investigation.status !== 'COMPLETED') {
      return sendError(
        res,
        'INVESTIGATION_NOT_COMPLETED',
        'Investigation not completed yet',
        400
      );
    }

    return sendSuccess(res, investigation.score);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitConclusion,
  getScore,
};
