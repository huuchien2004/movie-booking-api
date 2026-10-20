const express = require('express');
const movieRouter = express.Router();
const movieController = require('../controllers/movie.controller');
const { verifyAuth, requireAdmin } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// 1. Các route xem thông tin (Công khai cho mọi người)
movieRouter.get('/LayDanhSachBanner', movieController.layDanhSachBanner);
movieRouter.get('/LayDanhSachPhim', movieController.layDanhSachPhim);
movieRouter.get('/LayDanhSachPhimPhanTrang', movieController.layDanhSachPhimPhanTrang);
movieRouter.get('/LayThongTinPhim', movieController.layThongTinPhim);

// 2. Các route quản trị (Bắt buộc Token Admin + Có Middleware upload file 'hinhAnh')
movieRouter.post(
    '/ThemPhimUploadHinh',
    verifyAuth,
    requireAdmin,
    upload.single('hinhAnh'), // Nhận 1 file từ trường 'hinhAnh'
    movieController.themPhimUploadHinh
);

movieRouter.post(
    '/CapNhatPhimUpload',
    verifyAuth,
    requireAdmin,
    upload.single('hinhAnh'),
    movieController.capNhatPhimUpload
);

movieRouter.delete('/XoaPhim', verifyAuth, requireAdmin, movieController.xoaPhim);

module.exports = movieRouter;
