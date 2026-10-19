const express = require('express');
const rootRouter = express.Router();

// Health check endpoint
rootRouter.get('/', (req, res) => {
    res.json({
        message: '🎬 Welcome to Cybersoft Movie Booking API Clone!',
        status: 'Online',
        version: '1.0.0'
    });
});

// Các phân hệ chính (sẽ gắn lần lượt theo tiến độ)
// rootRouter.use('/QuanLyNguoiDung', authRouter);
// rootRouter.use('/QuanLyPhim', movieRouter);
// rootRouter.use('/QuanLyRap', cinemaRouter);
// rootRouter.use('/QuanLyDatVe', ticketRouter);

module.exports = rootRouter;
