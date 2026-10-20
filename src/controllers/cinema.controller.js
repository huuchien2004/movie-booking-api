const cinemaService = require('../services/cinema.service');
const { sendResponse } = require('../helpers/response.helper');

class CinemaController {
    async layThongTinHeThongRap(req, res, next) {
        try {
            const { maHeThongRap } = req.query;
            const result = await cinemaService.layThongTinHeThongRap(maHeThongRap);
            return sendResponse(res, 200, 'Lấy thông tin hệ thống rạp thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async layThongTinCumRapTheoHeThong(req, res, next) {
        try {
            const { maHeThongRap } = req.query;
            const result = await cinemaService.layThongTinCumRapTheoHeThong(maHeThongRap);
            return sendResponse(res, 200, 'Lấy thông tin cụm rạp thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async layThongTinLichChieuHeThongRap(req, res, next) {
        try {
            const { maHeThongRap } = req.query;
            const result = await cinemaService.layThongTinLichChieuHeThongRap(maHeThongRap);
            return sendResponse(res, 200, 'Lấy thông tin lịch chiếu hệ thống rạp thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async layThongTinLichChieuPhim(req, res, next) {
        try {
            const { MaPhim, maPhim } = req.query;
            const id = MaPhim || maPhim;
            const result = await cinemaService.layThongTinLichChieuPhim(id);
            return sendResponse(res, 200, 'Lấy thông tin lịch chiếu phim thành công!', result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CinemaController();
