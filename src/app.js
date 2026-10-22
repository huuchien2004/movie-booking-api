const express = require("express");
const cors = require("cors");
const rootRouter = require("./routers/root.router");
const { errorHandler } = require("./middlewares/error.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

const app = express();

// 1. Cấu hình Middlewares cơ bản
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Phục vụ thư mục static uploads nếu có upload hình ảnh
app.use("/uploads", express.static("uploads"));

// 3. Đường dẫn Swagger UI để xem API Documentation
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss:  `
        .copy-to-clipboard { display: none !important; }
        .opblock-summary-control:focus, 
        .opblock-summary:focus, 
        button:focus,
        *:focus { 
            outline: none !important; 
            box-shadow: none !important; 
        }
    `
}));

// 4. Gắn Router chính với tiền tố /api
app.use("/api", rootRouter);

// 5. Middleware bắt lỗi tập trung (phải đặt ở cuối cùng)
app.use(errorHandler);

module.exports = app;
