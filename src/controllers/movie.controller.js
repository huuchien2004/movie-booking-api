const movieService = require('../services/movie.service');
const { sendResponse } = require('../helpers/response.helper');

class MovieController {
    async layDanhSachBanner(req, res, next) {
        try {
            const result = await movieService.layDanhSachBanner();
            return sendResponse(res, 200, 'Lấy danh sách banner thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async layDanhSachPhim(req, res, next) {
        try {
            const result = await movieService.layDanhSachPhim(req.query);
            return sendResponse(res, 200, 'Lấy danh sách phim thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async layDanhSachPhimPhanTrang(req, res, next) {
        try {
            const result = await movieService.layDanhSachPhimPhanTrang(req.query);
            return sendResponse(res, 200, 'Lấy danh sách phim phân trang thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async layThongTinPhim(req, res, next) {
        try {
            const { MaPhim, maPhim } = req.query;
            const id = MaPhim || maPhim;
            if (!id) {
                const error = new Error('Vui lòng cung cấp mã phim!');
                error.statusCode = 400;
                throw error;
            }
            const result = await movieService.layThongTinPhim(id);
            return sendResponse(res, 200, 'Lấy thông tin phim thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async themPhimUploadHinh(req, res, next) {
        try {
            const result = await movieService.themPhimUploadHinh(req.body, req.file);
            return sendResponse(res, 200, 'Thêm phim thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async capNhatPhimUpload(req, res, next) {
        try {
            const result = await movieService.capNhatPhimUpload(req.body, req.file);
            return sendResponse(res, 200, 'Cập nhật phim thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async xoaPhim(req, res, next) {
        try {
            const { MaPhim, maPhim } = req.query;
            const id = MaPhim || maPhim || req.body.maPhim;
            if (!id) {
                const error = new Error('Vui lòng cung cấp mã phim cần xóa!');
                error.statusCode = 400;
                throw error;
            }
            const result = await movieService.xoaPhim(id);
            return sendResponse(res, 200, result, null);
        } catch (error) {
            next(error);
        }
    }

        async layDanhSachPhimTheoNgay(req, res, next) {
        try {
            const result = await movieService.layDanhSachPhimTheoNgay(req.query);
            return sendResponse(res, 200, 'Lấy danh sách phim theo ngày thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async uploadHinhAnh(req, res, next) {
        try {
            if (!req.file) {
                const error = new Error('Vui lòng chọn file hình ảnh!');
                error.statusCode = 400;
                throw error;
            }
            const fileUrl = `http://localhost:${process.env.PORT || 3069}/uploads/${req.file.filename}`;
            return sendResponse(res, 200, 'Upload hình ảnh thành công!', fileUrl);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new MovieController();
