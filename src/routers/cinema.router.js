const express = require('express');
const cinemaRouter = express.Router();
const cinemaController = require('../controllers/cinema.controller');

cinemaRouter.get('/LayThongTinHeThongRap', cinemaController.layThongTinHeThongRap);
cinemaRouter.get('/LayThongTinCumRapTheoHeThong', cinemaController.layThongTinCumRapTheoHeThong);
cinemaRouter.get('/LayThongTinLichChieuHeThongRap', cinemaController.layThongTinLichChieuHeThongRap);
cinemaRouter.get('/LayThongTinLichChieuPhim', cinemaController.layThongTinLichChieuPhim);

module.exports = cinemaRouter;
