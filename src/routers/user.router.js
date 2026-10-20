const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');

userRouter.post('/DangKy', userController.dangKy);
userRouter.post('/DangNhap', userController.dangNhap);
userRouter.get('/LayDanhSachNguoiDung', userController.layDanhSachNguoiDung);

userRouter.post('/ThongTinTaiKhoan', verifyAuth, userController.thongTinTaiKhoan);

module.exports = userRouter;
