const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const { verifyAuth, requireAdmin } = require('../middlewares/auth.middleware');

userRouter.post('/DangKy', userController.dangKy);
userRouter.post('/DangNhap', userController.dangNhap);
userRouter.get('/LayDanhSachNguoiDung', userController.layDanhSachNguoiDung);
userRouter.get('/LayDanhSachLoaiNguoiDung', userController.layDanhSachLoaiNguoiDung);
userRouter.get('/LayDanhSachNguoiDungPhanTrang', userController.layDanhSachNguoiDungPhanTrang);

userRouter.post('/ThongTinTaiKhoan', verifyAuth, userController.thongTinTaiKhoan);
userRouter.put('/CapNhatThongTinNguoiDung', verifyAuth, userController.capNhatThongTinNguoiDung);
userRouter.post('/CapNhatThongTinNguoiDung', verifyAuth, userController.capNhatThongTinNguoiDung);

userRouter.post('/ThemNguoiDung', verifyAuth, requireAdmin, userController.themNguoiDung);
userRouter.delete('/XoaNguoiDung', verifyAuth, requireAdmin, userController.xoaNguoiDung);

module.exports = userRouter;
