const express = require('express');
const rootRouter = express.Router();

const userRouter = require('./user.router');
const movieRouter = require('./movie.router');
const cinemaRouter = require('./cinema.router');

rootRouter.get('/', (req, res) => {
    res.json({
        message: '🎬 Welcome to Cybersoft Movie Booking API Clone!',
        status: 'Online',
        version: '1.0.0'
    });
});

rootRouter.use('/QuanLyNguoiDung', userRouter);
rootRouter.use('/QuanLyPhim', movieRouter);
rootRouter.use('/QuanLyRap', cinemaRouter);

module.exports = rootRouter;
