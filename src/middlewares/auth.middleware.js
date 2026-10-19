const { verifyAccessToken } = require('../helpers/token.helper');
const { sendResponse } = require('../helpers/response.helper');

/**
 * Middleware kiểm tra đăng nhập (Bảo vệ Route)
 */
const verifyAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendResponse(res, 401, 'Bạn chưa đăng nhập hoặc Token không hợp lệ!', null);
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        // Lưu thông tin người dùng đã giải mã vào req.user để các controller phía sau dùng
        req.user = decoded;
        next();
    } catch (error) {
        return sendResponse(res, 403, 'Token đã hết hạn hoặc không có quyền truy cập!', null);
    }
};

/**
 * Middleware kiểm tra quyền Quản trị (Admin)
 */
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.maLoaiNguoiDung === 'QuanTri') {
        return next();
    }
    return sendResponse(res, 403, 'Yêu cầu quyền Quản trị viên (QuanTri) để thực hiện chức năng này!', null);
};

module.exports = {
    verifyAuth,
    requireAdmin
};
