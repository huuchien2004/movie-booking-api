/**
 * Chuẩn hóa định dạng Response trả về theo chuẩn Swagger Cybersoft
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Thông báo phản hồi
 * @param {any} content - Dữ liệu trả về (object, array, v.v.)
 */
const sendResponse = (res, statusCode = 200, message = 'Xử lý thành công', content = null) => {
    return res.status(statusCode).json({
        statusCode,
        message,
        content,
        dateTime: new Date().toISOString()
    });
};

module.exports = {
    sendResponse
};
