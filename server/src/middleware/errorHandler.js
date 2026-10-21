const { sendError } = require('../utils/response');

/**
 * Global error handling middleware
 * Catches all errors and formats them consistently
 */
const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 'VALIDATION_ERROR', errors.join(', '), 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return sendError(res, 'DUPLICATE_ENTRY', `${field} already exists`, 409);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 'INVALID_ID', 'Invalid ID format', 400);
  }

  // JWT errors (will be used in Phase 2)
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'INVALID_TOKEN', 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'TOKEN_EXPIRED', 'Token expired', 401);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return sendError(res, err.code || 'INTERNAL_ERROR', message, statusCode);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  return sendError(res, 'NOT_FOUND', 'Resource not found', 404);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
