const ticketService = require('../services/ticket.service');
const { sendResponse } = require('../helpers/response.helper');

class TicketController {
    async taoLichChieu(req, res, next) {
        try {
            const result = await ticketService.taoLichChieu(req.body);
            return sendResponse(res, 200, 'Tạo lịch chiếu thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async layDanhSachPhongVe(req, res, next) {
        try {
            const { MaLichChieu, maLichChieu } = req.query;
            const id = MaLichChieu || maLichChieu;
            const result = await ticketService.layDanhSachPhongVe(id);
            return sendResponse(res, 200, 'Lấy danh sách phòng vé thành công!', result);
        } catch (error) {
            next(error);
        }
    }

    async datVe(req, res, next) {
        try {
            // req.user được middleware verifyAuth truyền vào
            const result = await ticketService.datVe(req.body, req.user);
            return sendResponse(res, 200, result, null);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TicketController();
