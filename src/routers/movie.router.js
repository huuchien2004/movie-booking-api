const express = require('express');
const movieRouter = express.Router();
const movieController = require('../controllers/movie.controller');
const { verifyAuth, requireAdmin } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// 1. Xem thông tin phim
movieRouter.get('/LayDanhSachBanner', movieController.layDanhSachBanner);
movieRouter.get('/LayDanhSachPhim', movieController.layDanhSachPhim);
movieRouter.get('/LayDanhSachPhimPhanTrang', movieController.layDanhSachPhimPhanTrang);
movieRouter.get('/LayDanhSachPhimTheoNgay', movieController.layDanhSachPhimTheoNgay);
movieRouter.get('/LayThongTinPhim', movieController.layThongTinPhim);

// 2. Upload hình ảnh độc lập (POST /api/QuanLyPhim)
movieRouter.post('/', upload.single('file'), movieController.uploadHinhAnh);

// 3. Quản trị phim
movieRouter.post('/ThemPhimUploadHinh', verifyAuth, requireAdmin, upload.single('hinhAnh'), movieController.themPhimUploadHinh);
movieRouter.post('/CapNhatPhimUpload', verifyAuth, requireAdmin, upload.single('hinhAnh'), movieController.capNhatPhimUpload);
movieRouter.delete('/XoaPhim', verifyAuth, requireAdmin, movieController.xoaPhim);
movieRouter.delete('/XP', verifyAuth, requireAdmin, movieController.xoaPhim); // Alias XP giống Cybersoft

module.exports = movieRouter;
