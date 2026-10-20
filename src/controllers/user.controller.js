const userService = require('../services/user.service');
const { sendResponse } = require('../helpers/response.helper');

class UserController {
    async dangKy(req, res, next) {
        try {
            const result = await userService.dangKy(req.body);
            return sendResponse(res, 200, 'Đăng ký tài khoản thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async dangNhap(req, res, next) {
        try {
            const result = await userService.dangNhap(req.body);
            return sendResponse(res, 200, 'Đăng nhập thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async thongTinTaiKhoan(req, res, next) {
        try {
            const taiKhoan = req.user.taiKhoan;
            const result = await userService.thongTinTaiKhoan(taiKhoan);
            return sendResponse(res, 200, 'Lấy thông tin tài khoản thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async layDanhSachNguoiDung(req, res, next) {
        try {
            const { tuKhoa } = req.query;
            const result = await userService.layDanhSachNguoiDung(tuKhoa);
            return sendResponse(res, 200, 'Lấy danh sách người dùng thành công!', result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
