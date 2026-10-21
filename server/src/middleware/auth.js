const session = require('express-session');

/**
 * Configure session middleware
 * Uses in-memory store for development
 * Production should use a persistent store (Redis, MongoDB, etc.)
 */
const sessionConfig = session({
  secret: process.env.AUTH_SECRET || 'change-this-secret-in-production',
  name: 'casefile.sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours
  },
  rolling: false, // Don't reset session maxAge on every request
});

/**
 * Middleware to check if user is authenticated
 */
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }
  next();
};

/**
 * Middleware to check if user has required role
 * @param {Array<String>} roles - Array of allowed roles
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    if (!req.session.role || !roles.includes(req.session.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
    }

    next();
  };
};

/**
 * Middleware to regenerate session ID after login
 * Called after successful authentication
 */
const regenerateSession = (req, res, next) => {
  req.session.regenerate((err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

/**
 * Middleware to destroy session on logout
 */
const destroySession = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('casefile.sid');
    next();
  });
};

module.exports = {
  sessionConfig,
  requireAuth,
  requireRole,
  regenerateSession,
  destroySession,
};
