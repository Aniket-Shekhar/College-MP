const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return sendError(res, 'EMAIL_EXISTS', 'Email already registered', 409);
      }
      if (existingUser.username === username) {
        return sendError(res, 'USERNAME_EXISTS', 'Username already taken', 409);
      }
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      username,
      email,
      passwordHash: password, // Will be hashed by the pre-save hook
    });

    await user.save();

    // Set session data
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.role = user.role;

    // Return safe user object
    const safeUser = user.toSafeObject();

    return sendSuccess(res, safeUser, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email (include passwordHash for comparison)
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return sendError(
        res,
        'INVALID_CREDENTIALS',
        'Invalid email or password',
        401
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return sendError(
        res,
        'INVALID_CREDENTIALS',
        'Invalid email or password',
        401
      );
    }

    // Regenerate session ID
    req.session.regenerate((err) => {
      if (err) {
        return next(err);
      }

      // Set session data
      req.session.userId = user._id;
      req.session.username = user.username;
      req.session.email = user.email;
      req.session.role = user.role;

      // Return safe user object
      const safeUser = user.toSafeObject();

      return sendSuccess(res, safeUser);
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie('casefile.sid');

    return sendSuccess(res, { message: 'Logged out successfully' });
  });
};

/**
 * Get current authenticated user
 */
const getMe = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      // Clear invalid session
      req.session.destroy(() => {});
      return sendError(res, 'USER_NOT_FOUND', 'User not found', 404);
    }

    const safeUser = user.toSafeObject();

    return sendSuccess(res, safeUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
