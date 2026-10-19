const { sendResponse } = require('../helpers/response.helper');

/**
 * Global Error Handling Middleware
 * Bắt tất cả lỗi phát sinh trong hệ thống, không để server bị crash
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ [Error Occurred]:', err.stack || err.message || err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Lỗi hệ thống nội bộ (Internal Server Error)';

    return sendResponse(res, statusCode, message, null);
};

module.exports = {
    errorHandler
};
