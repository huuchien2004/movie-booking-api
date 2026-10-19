-- ==============================================================
-- DATABASE: db_movie_cybersoft
-- DỰ ÁN CUỐI KHÓA NODEJS - ĐẶT VÉ XEM PHIM (CYBERSOFT CLONE)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS db_movie_cybersoft CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_movie_cybersoft;

-- 1. BẢNG LOẠI NGƯỜI DÙNG (KhachHang / QuanTri)
CREATE TABLE IF NOT EXISTS LoaiNguoiDung (
    maLoaiNguoiDung VARCHAR(50) PRIMARY KEY,
    tenLoai VARCHAR(100) NOT NULL
);

INSERT INTO LoaiNguoiDung (maLoaiNguoiDung, tenLoai) VALUES
('KhachHang', 'Khách hàng'),
('QuanTri', 'Quản trị viên')
ON DUPLICATE KEY UPDATE tenLoai = VALUES(tenLoai);

-- 2. BẢNG NGƯỜI DÙNG
CREATE TABLE IF NOT EXISTS NguoiDung (
    taiKhoan VARCHAR(50) PRIMARY KEY,
    matKhau VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    soDt VARCHAR(20),
    hoTen VARCHAR(100) NOT NULL,
    maLoaiNguoiDung VARCHAR(50) NOT NULL DEFAULT 'KhachHang',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (maLoaiNguoiDung) REFERENCES LoaiNguoiDung(maLoaiNguoiDung) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Mật khẩu mặc định: 123456 (đã hash bằng bcrypt)
-- $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa
INSERT INTO NguoiDung (taiKhoan, matKhau, email, soDt, hoTen, maLoaiNguoiDung) VALUES
('admin', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'admin@cybersoft.vn', '0909123456', 'Administrator', 'QuanTri'),
('user1', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'user1@gmail.com', '0909654321', 'Nguyen Van A', 'KhachHang')
ON DUPLICATE KEY UPDATE hoTen = VALUES(hoTen);

-- 3. BẢNG PHIM
CREATE TABLE IF NOT EXISTS Phim (
    maPhim INT AUTO_INCREMENT PRIMARY KEY,
    tenPhim VARCHAR(255) NOT NULL,
    biDanh VARCHAR(255),
    trailer VARCHAR(255),
    hinhAnh VARCHAR(255),
    moTa TEXT,
    maNhom VARCHAR(20) DEFAULT 'GP01',
    ngayKhoiChieu DATETIME,
    danhGia INT DEFAULT 5,
    hot BOOLEAN DEFAULT FALSE,
    dangChieu BOOLEAN DEFAULT TRUE,
    sapChieu BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Phim (maPhim, tenPhim, biDanh, trailer, hinhAnh, moTa, maNhom, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu) VALUES
(1, 'Avengers: Endgame', 'avengers-endgame', 'https://www.youtube.com/watch?v=TcMBFSGVi1c', 'https://movienew.cybersoft.edu.vn/hinhanh/avengers.jpg', 'Hồi kết của vũ trụ điện ảnh Marvel', 'GP01', '2024-05-01 00:00:00', 10, TRUE, TRUE, FALSE),
(2, 'Spider-Man: No Way Home', 'spider-man-no-way-home', 'https://www.youtube.com/watch?v=JfVOs4VSpmA', 'https://movienew.cybersoft.edu.vn/hinhanh/spiderman.jpg', 'Người Nhện không còn đường về nhà', 'GP01', '2024-06-15 00:00:00', 9, TRUE, TRUE, FALSE),
(3, 'Dune: Hành Tinh Cát 2', 'dune-hanh-tinh-cat-2', 'https://www.youtube.com/watch?v=Way9Dexny3w', 'https://movienew.cybersoft.edu.vn/hinhanh/dune.jpg', 'Hành trình trả thù và bảo vệ tương lai', 'GP01', '2024-07-20 00:00:00', 8, FALSE, FALSE, TRUE)
ON DUPLICATE KEY UPDATE tenPhim = VALUES(tenPhim);

-- 4. BẢNG BANNER
CREATE TABLE IF NOT EXISTS Banner (
    maBanner INT AUTO_INCREMENT PRIMARY KEY,
    maPhim INT NOT NULL,
    hinhAnh VARCHAR(255) NOT NULL,
    FOREIGN KEY (maPhim) REFERENCES Phim(maPhim) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO Banner (maBanner, maPhim, hinhAnh) VALUES
(1, 1, 'https://movienew.cybersoft.edu.vn/hinhanh/banner-avengers.jpg'),
(2, 2, 'https://movienew.cybersoft.edu.vn/hinhanh/banner-spiderman.jpg')
ON DUPLICATE KEY UPDATE hinhAnh = VALUES(hinhAnh);

-- 5. BẢNG HỆ THỐNG RẠP (BHD, CGV, Galaxy, CineStar, Lotte, MegaGS)
CREATE TABLE IF NOT EXISTS HeThongRap (
    maHeThongRap VARCHAR(50) PRIMARY KEY,
    tenHeThongRap VARCHAR(100) NOT NULL,
    biDanh VARCHAR(100),
    logo VARCHAR(255)
);

INSERT INTO HeThongRap (maHeThongRap, tenHeThongRap, biDanh, logo) VALUES
('BHDStar', 'BHD Star Cineplex', 'bhd-star-cineplex', 'https://movienew.cybersoft.edu.vn/hinhanh/bhd-star-cineplex.png'),
('CGV', 'CGV Cinemas', 'cgv-cinemas', 'https://movienew.cybersoft.edu.vn/hinhanh/cgv.png'),
('Galaxy', 'Galaxy Cinema', 'galaxy-cinema', 'https://movienew.cybersoft.edu.vn/hinhanh/galaxy.png')
ON DUPLICATE KEY UPDATE tenHeThongRap = VALUES(tenHeThongRap);

-- 6. BẢNG CỤM RẠP
CREATE TABLE IF NOT EXISTS CumRap (
    maCumRap VARCHAR(100) PRIMARY KEY,
    tenCumRap VARCHAR(150) NOT NULL,
    diaChi VARCHAR(255) NOT NULL,
    maHeThongRap VARCHAR(50) NOT NULL,
    FOREIGN KEY (maHeThongRap) REFERENCES HeThongRap(maHeThongRap) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO CumRap (maCumRap, tenCumRap, diaChi, maHeThongRap) VALUES
('bhd-star-3-2', 'BHD Star - 3/2', 'Lầu 5, Siêu Thị Vincom 3/2, Q.10, TPHCM', 'BHDStar'),
('bhd-star-bitexco', 'BHD Star - Bitexco', 'Lầu 3 & 4, Bitexco Icon 68, Q.1, TPHCM', 'BHDStar'),
('cgv-su-van-hanh', 'CGV - Vạn Hạnh Mall', 'Tầng 6, Vạn Hạnh Mall, Q.10, TPHCM', 'CGV')
ON DUPLICATE KEY UPDATE tenCumRap = VALUES(tenCumRap);

-- 7. BẢNG RẠP CHIẾU (Mỗi cụm rạp có nhiều rạp nhỏ)
CREATE TABLE IF NOT EXISTS Rap (
    maRap INT AUTO_INCREMENT PRIMARY KEY,
    tenRap VARCHAR(100) NOT NULL,
    maCumRap VARCHAR(100) NOT NULL,
    FOREIGN KEY (maCumRap) REFERENCES CumRap(maCumRap) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO Rap (maRap, tenRap, maCumRap) VALUES
(101, 'Rạp 1', 'bhd-star-3-2'),
(102, 'Rạp 2', 'bhd-star-3-2'),
(103, 'Rạp 1', 'cgv-su-van-hanh')
ON DUPLICATE KEY UPDATE tenRap = VALUES(tenRap);

-- 8. BẢNG GHẾ (Mỗi rạp có 160 ghế: Ghế thường và Ghế VIP)
CREATE TABLE IF NOT EXISTS Ghe (
    maGhe INT AUTO_INCREMENT PRIMARY KEY,
    tenGhe VARCHAR(20) NOT NULL,
    maRap INT NOT NULL,
    loaiGhe VARCHAR(20) DEFAULT 'Thuong', -- 'Thuong' hoặc 'Vip'
    stt INT NOT NULL,
    giaVe INT DEFAULT 75000,
    FOREIGN KEY (maRap) REFERENCES Rap(maRap) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tạo mẫu 16 ghế demo cho Rạp 101 (Ghế 1-8 Thường, 9-16 VIP)
INSERT INTO Ghe (maGhe, tenGhe, maRap, loaiGhe, stt, giaVe) VALUES
(1, '01', 101, 'Thuong', 1, 75000),
(2, '02', 101, 'Thuong', 2, 75000),
(3, '03', 101, 'Thuong', 3, 75000),
(4, '04', 101, 'Thuong', 4, 75000),
(5, '05', 101, 'Thuong', 5, 75000),
(6, '06', 101, 'Thuong', 6, 75000),
(7, '07', 101, 'Thuong', 7, 75000),
(8, '08', 101, 'Thuong', 8, 75000),
(9, '09', 101, 'Vip', 9, 90000),
(10, '10', 101, 'Vip', 10, 90000),
(11, '11', 101, 'Vip', 11, 90000),
(12, '12', 101, 'Vip', 12, 90000),
(13, '13', 101, 'Vip', 13, 90000),
(14, '14', 101, 'Vip', 14, 90000),
(15, '15', 101, 'Vip', 15, 90000),
(16, '16', 101, 'Vip', 16, 90000)
ON DUPLICATE KEY UPDATE tenGhe = VALUES(tenGhe);

-- 9. BẢNG LỊCH CHIẾU
CREATE TABLE IF NOT EXISTS LichChieu (
    maLichChieu INT AUTO_INCREMENT PRIMARY KEY,
    maRap INT NOT NULL,
    maPhim INT NOT NULL,
    ngayChieuGioChieu DATETIME NOT NULL,
    giaVe INT NOT NULL DEFAULT 75000,
    FOREIGN KEY (maRap) REFERENCES Rap(maRap) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (maPhim) REFERENCES Phim(maPhim) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO LichChieu (maLichChieu, maRap, maPhim, ngayChieuGioChieu, giaVe) VALUES
(1001, 101, 1, '2026-10-25 19:30:00', 75000),
(1002, 101, 2, '2026-10-25 21:30:00', 75000)
ON DUPLICATE KEY UPDATE giaVe = VALUES(giaVe);

-- 10. BẢNG ĐẶT VÉ (LƯU VÉ ĐÃ ĐẶT)
CREATE TABLE IF NOT EXISTS DatVe (
    maVe INT AUTO_INCREMENT PRIMARY KEY,
    taiKhoan VARCHAR(50) NOT NULL,
    maLichChieu INT NOT NULL,
    maGhe INT NOT NULL,
    ngayDat DATETIME DEFAULT CURRENT_TIMESTAMP,
    giaVe INT NOT NULL,
    FOREIGN KEY (taiKhoan) REFERENCES NguoiDung(taiKhoan) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (maLichChieu) REFERENCES LichChieu(maLichChieu) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (maGhe) REFERENCES Ghe(maGhe) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uq_lich_ghe (maLichChieu, maGhe) -- Mỗi ghế trong một lịch chiếu chỉ được đặt 1 lần
);

-- Mẫu: user1 đã đặt ghế 1 và ghế 2 cho lịch chiếu 1001
INSERT INTO DatVe (maVe, taiKhoan, maLichChieu, maGhe, giaVe) VALUES
(1, 'user1', 1001, 1, 75000),
(2, 'user1', 1001, 2, 75000)
ON DUPLICATE KEY UPDATE giaVe = VALUES(giaVe);
