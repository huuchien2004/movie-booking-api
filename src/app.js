const express = require('express');
const cors = require('cors');
const rootRouter = require('./routers/root.router');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// 1. Cấu hình Middlewares cơ bản
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Phục vụ thư mục static uploads nếu có upload hình ảnh
app.use('/uploads', express.static('uploads'));

// 3. Gắn Router chính với tiền tố /api
app.use('/api', rootRouter);

// 4. Middleware bắt lỗi tập trung (phải đặt ở cuối cùng)
app.use(errorHandler);

module.exports = app;
