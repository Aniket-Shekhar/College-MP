const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
} = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
  handleValidationErrors,
} = require('../validators/authValidator');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/auth');
const { provideCsrfToken } = require('../middleware/csrf');

// Provide CSRF token for GET requests
router.use(provideCsrfToken);

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post(
  '/register',
  registerLimiter,
  ...registerValidation,
  handleValidationErrors,
  register
);

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post(
  '/login',
  authLimiter,
  ...loginValidation,
  handleValidationErrors,
  login
);

/**
 * POST /api/v1/auth/logout
 * Logout user (requires authentication)
 */
router.post('/logout', requireAuth, logout);

/**
 * GET /api/v1/auth/me
 * Get current authenticated user (requires authentication)
 */
router.get('/me', requireAuth, getMe);

module.exports = router;
