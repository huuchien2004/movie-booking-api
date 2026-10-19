# 🎬 Movie Booking API (Clone Cybersoft Cinema System)

> **Backend RESTful API** cho hệ thống đặt vé xem phim trực tuyến, xây dựng theo kiến trúc **Clean Architecture** sử dụng **Node.js, Express.js, Prisma ORM và MySQL**.

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)

---

## Giới thiệu dự án
Dự án được phát triển theo đặc tả hệ thống đặt vé xem phim của **Cybersoft**. Hệ thống cung cấp đầy đủ các API phục vụ cho cả người dùng cuối (đặt vé, xem lịch chiếu) và ban quản trị (quản lý rạp, phim, phân quyền tài khoản).

### Tính năng chính:
- **Xác thực & Phân quyền (Auth & RBAC)**:
  - Đăng ký, Đăng nhập với mật khẩu mã hóa một chiều qua `bcryptjs`.
  - Phân quyền người dùng theo Role (`KhachHang`, `QuanTri`) bằng **JWT (JSON Web Token)** và Middleware bảo vệ.
- **Quản lý Phim & Banner (Movies Management)**:
  - Lấy danh sách phim, chi tiết phim, banner trang chủ.
  - Tìm kiếm, lọc phim theo ngày, phân trang linh hoạt (`Pagination`).
  - Thêm, sửa, xóa phim kết hợp upload poster phim qua `Multer`.
- **Hệ thống Rạp & Cụm Rạp (Cinema System)**:
  - Cấu trúc đa tầng: Hệ thống rạp (BHD, CGV...) ➔ Cụm rạp ➔ Rạp chiếu ➔ Danh sách 160 ghế (Ghế Thường & Ghế VIP).
- **Lịch chiếu & Đặt vé (Showtime & Booking)**:
  - Tạo lịch chiếu phim theo phòng và khung giờ.
  - Lấy sơ đồ phòng vé thời gian thực (hiển thị trạng thái ghế đã đặt / còn trống).
  - Nghiệp vụ đặt vé đảm bảo tính toàn vẹn dữ liệu (Database Transaction).
- **Tài liệu hóa API & Clean Code**:
  - Tích hợp tài liệu tương tác trực tiếp qua **Swagger UI**.
  - Xử lý lỗi tập trung (`Global Exception Handler`) và chuẩn hóa định dạng Response JSON nhất quán.

---

## Kiến trúc thư mục (Clean Architecture)
```text
movie-booking-api/
├── src/
│   ├── configs/            # Cấu hình môi trường & kết nối Prisma Client
│   ├── constants/          # Định nghĩa mã lỗi, Role, Status Code
│   ├── helpers/            # Chuẩn hóa cấu trúc Response trả về
│   ├── middlewares/        # Xác thực Token, kiểm tra quyền Admin, bắt lỗi
│   ├── controllers/        # Tiếp nhận request và điều phối dữ liệu
│   ├── services/           # Chứa 100% logic nghiệp vụ & truy vấn Database
│   ├── routers/            # Định nghĩa các Endpoint RESTful
│   └── app.js              # Cấu hình Express App
├── prisma/                 # Schema ORM & Database Migration
├── database_movie.sql      # Script khởi tạo Database & Dữ liệu mẫu
└── server.js               # Khởi chạy máy chủ
