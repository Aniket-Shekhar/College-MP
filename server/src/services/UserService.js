const Investigation = require('../models/Investigation');
const User = require('../models/User');

/**
 * Get user's complete statistics
 */
const getUserStats = async (userId) => {
  const investigations = await Investigation.find({ userId });

  const totalAttempts = investigations.length;
  const completedAttempts = investigations.filter(
    (inv) => inv.status === 'COMPLETED'
  ).length;
  const abandonedAttempts = investigations.filter(
    (inv) => inv.status === 'ABANDONED'
  ).length;

  // Calculate scores
  const completedInvestigations = investigations.filter(
    (inv) => inv.status === 'COMPLETED'
  );
  const scores = completedInvestigations.map((inv) => inv.score.total);

  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

  // Get best score per case
  const bestScoresByCase = {};
  completedInvestigations.forEach((inv) => {
    const caseId = inv.caseId.toString();
    if (
      !bestScoresByCase[caseId] ||
      inv.score.total > bestScoresByCase[caseId]
    ) {
      bestScoresByCase[caseId] = inv.score.total;
    }
  });

  return {
    totalAttempts,
    completedAttempts,
    abandonedAttempts,
    totalScore: Math.round(totalScore),
    averageScore: Math.round(averageScore),
    highestScore,
    bestScoresByCase,
  };
};

/**
 * Get user's investigation history
 */
const getUserHistory = async (userId, limit = 20, skip = 0) => {
  const investigations = await Investigation.find({ userId })
    .populate('caseId', 'slug title shortDescription difficulty category')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Investigation.countDocuments({ userId });

  return {
    investigations,
    total,
    limit,
    skip,
  };
};

/**
 * Get user's achievements
 */
const getUserAchievements = async (userId) => {
  const investigations = await Investigation.find({ userId });
  const completed = investigations.filter((inv) => inv.status === 'COMPLETED');

  const achievements = [];

  // First Blood: Complete first investigation
  if (completed.length >= 1) {
    achievements.push({
      id: 'first_blood',
      name: 'First Blood',
      description: 'Complete your first investigation',
      icon: '🎯',
      unlockedAt: completed[0].completedAt,
    });
  }

  // Detective: Complete 5 investigations
  if (completed.length >= 5) {
    achievements.push({
      id: 'detective',
      name: 'Detective',
      description: 'Complete 5 investigations',
      icon: '🔍',
      unlockedAt: completed[4].completedAt,
    });
  }

  // Master Detective: Complete 10 investigations
  if (completed.length >= 10) {
    achievements.push({
      id: 'master_detective',
      name: 'Master Detective',
      description: 'Complete 10 investigations',
      icon: '🏆',
      unlockedAt: completed[9].completedAt,
    });
  }

  // Perfect Score: Get 100 on any investigation
  const perfectScores = completed.filter((inv) => inv.score.total === 100);
  if (perfectScores.length > 0) {
    achievements.push({
      id: 'perfect_score',
      name: 'Perfect Score',
      description: 'Get a perfect score on an investigation',
      icon: '💯',
      unlockedAt: perfectScores[0].completedAt,
    });
  }

  // High Scorer: Get 90+ on any investigation
  const highScores = completed.filter((inv) => inv.score.total >= 90);
  if (highScores.length > 0) {
    achievements.push({
      id: 'high_scorer',
      name: 'High Scorer',
      description: 'Score 90 or higher on an investigation',
      icon: '⭐',
      unlockedAt: highScores[0].completedAt,
    });
  }

  // Persistent: Complete 3 investigations without abandoning
  let currentStreak = 0;
  let maxStreak = 0;
  for (const inv of investigations) {
    if (inv.status === 'COMPLETED') {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (inv.status === 'ABANDONED') {
      currentStreak = 0;
    }
  }

  if (maxStreak >= 3) {
    achievements.push({
      id: 'persistent',
      name: 'Persistent',
      description: 'Complete 3 investigations in a row',
      icon: '💪',
      unlockedAt: null, // Would need tracking logic
    });
  }

  return achievements;
};

/**
 * Get leaderboard
 */
const getLeaderboard = async (limit = 10, skip = 0) => {
  // Get all users with leaderboardVisible = true
  const users = await User.find({ leaderboardVisible: true })
    .select('_id username avatarUrl stats')
    .sort({ 'stats.highestScore': -1 })
    .limit(limit)
    .skip(skip);

  const total = await User.countDocuments({ leaderboardVisible: true });

  // Add rank
  const leaderboard = users.map((user, index) => ({
    rank: skip + index + 1,
    userId: user._id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    highestScore: user.stats.highestScore || 0,
    totalScore: user.stats.totalScore || 0,
    casesCompleted: user.stats.casesCompleted || 0,
  }));

  return {
    leaderboard,
    total,
    limit,
    skip,
  };
};

/**
 * Update user stats after investigation completion
 */
const updateUserStats = async (userId) => {
  const stats = await getUserStats(userId);

  await User.findByIdAndUpdate(userId, {
    $set: {
      'stats.casesStarted': stats.totalAttempts,
      'stats.casesCompleted': stats.completedAttempts,
      'stats.totalScore': stats.totalScore,
      'stats.averageScore': stats.averageScore,
      'stats.highestScore': stats.highestScore,
    },
  });

  return stats;
};

module.exports = {
  getUserStats,
  getUserHistory,
  getUserAchievements,
  getLeaderboard,
  updateUserStats,
};
