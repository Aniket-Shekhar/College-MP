const crypto = require('crypto');

/**
 * Simple CSRF protection middleware
 * Generates a CSRF token and stores it in the session
 * Expects the token in the request body or headers for state-changing requests
 */
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET requests (they don't modify state)
  if (
    req.method === 'GET' ||
    req.method === 'HEAD' ||
    req.method === 'OPTIONS'
  ) {
    return next();
  }

  // Skip CSRF if no session exists (will be caught by auth middleware)
  if (!req.session) {
    return next();
  }

  // Generate CSRF token if not exists
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  // Get token from request
  const token =
    req.body._csrf ||
    req.headers['x-csrf-token'] ||
    req.headers['x-xsrf-token'];

  if (!token) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_TOKEN_MISSING',
        message: 'CSRF token is required for this request',
      },
    });
  }

  // Validate token
  if (token !== req.session.csrfToken) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_TOKEN_INVALID',
        message: 'Invalid CSRF token',
      },
    });
  }

  next();
};

/**
 * Middleware to provide CSRF token to client
 * Adds CSRF token to response headers for GET requests
 */
const provideCsrfToken = (req, res, next) => {
  if (req.method === 'GET') {
    if (req.session && !req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    if (req.session && req.session.csrfToken) {
      res.setHeader('X-CSRF-Token', req.session.csrfToken);
    }
  }
  next();
};

module.exports = {
  csrfProtection,
  provideCsrfToken,
};
