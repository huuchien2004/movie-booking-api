const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const { verifyAuth, requireAdmin } = require('../middlewares/auth.middleware');

// 1. Các route xem & tìm kiếm công khai
userRouter.get('/LayDanhSachLoaiNguoiDung', userController.layDanhSachLoaiNguoiDung);
userRouter.post('/DangNhap', userController.dangNhap);
userRouter.post('/DangKy', userController.dangKy);
userRouter.get('/LayDanhSachNguoiDung', userController.layDanhSachNguoiDung);
userRouter.get('/LayDanhSachNguoiDungPhanTrang', userController.layDanhSachNguoiDungPhanTrang);
userRouter.get('/TimKiemNguoiDung', userController.timKiemNguoiDung);
userRouter.get('/TimKiemNguoiDungPhanTrang', userController.timKiemNguoiDungPhanTrang);

// 2. Các route người dùng đăng nhập
userRouter.post('/ThongTinTaiKhoan', verifyAuth, userController.thongTinTaiKhoan);
userRouter.post('/LayThongTinNguoiDung', verifyAuth, userController.layThongTinNguoiDung);
userRouter.put('/CapNhatThongTinNguoiDung', verifyAuth, userController.capNhatThongTinNguoiDung);
userRouter.post('/CapNhatThongTinNguoiDung', verifyAuth, userController.capNhatThongTinNguoiDung);

// 3. Các route Quản trị viên
userRouter.post('/ThemNguoiDung', verifyAuth, requireAdmin, userController.themNguoiDung);
userRouter.delete('/XoaNguoiDung', verifyAuth, requireAdmin, userController.xoaNguoiDung);

module.exports = userRouter;
