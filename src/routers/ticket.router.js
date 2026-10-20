const express = require('express');
const ticketRouter = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { verifyAuth, requireAdmin } = require('../middlewares/auth.middleware');

// 1. Xem sơ đồ phòng vé (Công khai)
ticketRouter.get('/LayDanhSachPhongVe', ticketController.layDanhSachPhongVe);

// 2. Tạo lịch chiếu (Chỉ Admin)
ticketRouter.post('/TaoLichChieu', verifyAuth, requireAdmin, ticketController.taoLichChieu);

// 3. Đặt vé (Người dùng đã đăng nhập)
ticketRouter.post('/DatVe', verifyAuth, ticketController.datVe);

module.exports = ticketRouter;
