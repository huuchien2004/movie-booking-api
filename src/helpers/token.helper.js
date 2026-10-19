const jwt = require('jsonwebtoken');

// Hàm tạo Access Token khi đăng nhập thành công
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Hàm giải mã và xác thực Token
const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

module.exports = {
    createAccessToken,
    verifyAccessToken
};
