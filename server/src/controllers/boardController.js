const Investigation = require('../models/Investigation');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Save board state
 */
const saveBoard = async (req, res, next) => {
  try {
    const { board } = req.body;
    const userId = req.session.userId;
    const investigation = req.investigation; // Set by validateBoard middleware

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    // Update investigation with new board state
    investigation.board = board;
    await investigation.save();

    return sendSuccess(res, investigation);
  } catch (error) {
    next(error);
  }
};

/**
 * Get board state
 */
const getBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

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

    return sendSuccess(res, investigation.board);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveBoard,
  getBoard,
};
