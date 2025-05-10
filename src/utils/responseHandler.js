exports.sendError = (res, statusCode, message, error = null) => {
  console.error(`[ERROR] ${message}`, error || '');
  return res.status(statusCode).json({ success: false, message });
};

exports.sendSuccess = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({ success: true, message, ...data });
};
