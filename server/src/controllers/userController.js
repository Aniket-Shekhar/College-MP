const {
  getUserStats,
  getUserHistory,
  getUserAchievements,
  getLeaderboard: getLeaderboardData,
} = require('../services/UserService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Get current user's profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const User = require('../models/User');
    const user = await User.findById(userId).select('-passwordHash');

    if (!user) {
      return sendError(res, 'USER_NOT_FOUND', 'User not found', 404);
    }

    const stats = await getUserStats(userId);

    return sendSuccess(res, {
      user,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's investigation history
 */
const getHistory = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const result = await getUserHistory(userId, limit, skip);

    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's achievements
 */
const getAchievements = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const achievements = await getUserAchievements(userId);

    return sendSuccess(res, { achievements });
  } catch (error) {
    next(error);
  }
};

/**
 * Get leaderboard
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const result = await getLeaderboardData(limit, skip);

    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const { avatarUrl, leaderboardVisible } = req.body;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const User = require('../models/User');
    const user = await User.findById(userId);

    if (!user) {
      return sendError(res, 'USER_NOT_FOUND', 'User not found', 404);
    }

    // Update allowed fields
    if (avatarUrl !== undefined) {
      user.avatarUrl = avatarUrl;
    }
    if (leaderboardVisible !== undefined) {
      user.leaderboardVisible = leaderboardVisible;
    }

    await user.save();

    return sendSuccess(res, {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        leaderboardVisible: user.leaderboardVisible,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getHistory,
  getAchievements,
  getLeaderboard,
  updateProfile,
};
