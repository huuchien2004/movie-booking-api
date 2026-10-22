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

    async layDanhSachLoaiNguoiDung(req, res, next) {
        try {
            const result = await userService.layDanhSachLoaiNguoiDung();
            return sendResponse(res, 200, 'Lấy danh sách loại người dùng thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async layDanhSachNguoiDungPhanTrang(req, res, next) {
        try {
            const result = await userService.layDanhSachNguoiDungPhanTrang(req.query);
            return sendResponse(res, 200, 'Lấy danh sách người dùng phân trang thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async themNguoiDung(req, res, next) {
        try {
            const result = await userService.themNguoiDung(req.body);
            return sendResponse(res, 200, 'Thêm người dùng thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async capNhatThongTinNguoiDung(req, res, next) {
        try {
            // req.user được middleware verifyAuth truyền vào
            const result = await userService.capNhatThongTinNguoiDung(req.body, req.user);
            return sendResponse(res, 200, 'Cập nhật thông tin thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async xoaNguoiDung(req, res, next) {
        try {
            // Có thể lấy TaiKhoan từ query params hoặc body
            const taiKhoan = req.query.TaiKhoan || req.body.taiKhoan;
            if (!taiKhoan) {
                const error = new Error('Vui lòng cung cấp tài khoản cần xóa!');
                error.statusCode = 400;
                throw error;
            }
            const result = await userService.xoaNguoiDung(taiKhoan);
            return sendResponse(res, 200, result, null);
        } catch (error) {
            next(error);
        }
    }

        // Tìm kiếm người dùng
    async timKiemNguoiDung(req, res, next) {
        try {
            const { tuKhoa } = req.query;
            const result = await userService.layDanhSachNguoiDung(tuKhoa);
            return sendResponse(res, 200, 'Tìm kiếm người dùng thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    // Tìm kiếm người dùng phân trang
    async timKiemNguoiDungPhanTrang(req, res, next) {
        try {
            const result = await userService.layDanhSachNguoiDungPhanTrang(req.query);
            return sendResponse(res, 200, 'Tìm kiếm người dùng phân trang thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin người dùng theo tài khoản
    async layThongTinNguoiDung(req, res, next) {
        try {
            const taiKhoan = req.query.taiKhoan || req.body.taiKhoan;
            const result = await userService.layThongTinNguoiDung(taiKhoan);
            return sendResponse(res, 200, 'Lấy thông tin người dùng thành công!', result);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new UserController();
