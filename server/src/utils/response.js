/**
 * Standard API response formatter
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {String} code - Error code
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 */
const sendError = (res, code, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
