const express = require('express');
const rootRouter = express.Router();

const userRouter = require('./user.router');

rootRouter.get('/', (req, res) => {
    res.json({
        message: '🎬 Welcome to Cybersoft Movie Booking API Clone!',
        status: 'Online',
        version: '1.0.0'
    });
});

rootRouter.use('/QuanLyNguoiDung', userRouter);

module.exports = rootRouter;
