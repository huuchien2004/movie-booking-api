const prisma = require('../configs/prisma.config');
const bcrypt = require('bcryptjs');
const { createAccessToken } = require('../helpers/token.helper');

class UserService {
    // 1. Đăng ký
    async dangKy(data) {
        const { taiKhoan, matKhau, email, soDt, hoTen } = data;

        const checkUser = await prisma.nguoiDung.findUnique({ where: { taiKhoan } });
        if (checkUser) {
            const error = new Error('Tài khoản đã tồn tại!');
            error.statusCode = 400;
            throw error;
        }

        const checkEmail = await prisma.nguoiDung.findUnique({ where: { email } });
        if (checkEmail) {
            const error = new Error('Email đã được sử dụng!');
            error.statusCode = 400;
            throw error;
        }

        const hashPassword = await bcrypt.hash(matKhau, 10);
        const newUser = await prisma.nguoiDung.create({
            data: {
                taiKhoan,
                matKhau: hashPassword,
                email,
                soDt,
                hoTen,
                maLoaiNguoiDung: 'KhachHang'
            }
        });

        const { matKhau: _, ...userWithoutPass } = newUser;
        return userWithoutPass;
    }

    // 2. Đăng nhập
    async dangNhap(data) {
        const { taiKhoan, matKhau } = data;

        const user = await prisma.nguoiDung.findUnique({ where: { taiKhoan } });
        if (!user) {
            const error = new Error('Tài khoản hoặc mật khẩu không đúng!');
            error.statusCode = 400;
            throw error;
        }

        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if (!isMatch) {
            const error = new Error('Tài khoản hoặc mật khẩu không đúng!');
            error.statusCode = 400;
            throw error;
        }

        const accessToken = createAccessToken({
            taiKhoan: user.taiKhoan,
            maLoaiNguoiDung: user.maLoaiNguoiDung
        });

        return {
            taiKhoan: user.taiKhoan,
            hoTen: user.hoTen,
            email: user.email,
            soDt: user.soDt,
            maLoaiNguoiDung: user.maLoaiNguoiDung,
            accessToken
        };
    }

    // 3. Thông tin tài khoản (Profile)
    async thongTinTaiKhoan(taiKhoan) {
        const user = await prisma.nguoiDung.findUnique({
            where: { taiKhoan },
            include: {
                DatVe: {
                    include: {
                        LichChieu: { include: { Phim: true } },
                        Ghe: true
                    }
                }
            }
        });

        if (!user) {
            const error = new Error('Không tìm thấy tài khoản!');
            error.statusCode = 404;
            throw error;
        }

        const { matKhau: _, ...userInfo } = user;
        return userInfo;
    }

    // 4. Lấy danh sách người dùng
    async layDanhSachNguoiDung(tuKhoa) {
        const whereCondition = tuKhoa ? {
            OR: [
                { taiKhoan: { contains: tuKhoa } },
                { hoTen: { contains: tuKhoa } }
            ]
        } : {};

        return await prisma.nguoiDung.findMany({
            where: whereCondition,
            select: {
                taiKhoan: true,
                hoTen: true,
                email: true,
                soDt: true,
                maLoaiNguoiDung: true
            }
        });
    }

    // 5. Lấy danh sách loại người dùng (KhachHang, QuanTri)
    async layDanhSachLoaiNguoiDung() {
        return await prisma.loaiNguoiDung.findMany();
    }

    // 6. Lấy danh sách người dùng phân trang
    async layDanhSachNguoiDungPhanTrang(params) {
        const soTrang = parseInt(params.soTrang) || 1;
        const soPhanTuTrenTrang = parseInt(params.soPhanTuTrenTrang) || 10;
        const tuKhoa = params.tuKhoa || '';

        const whereCondition = tuKhoa ? {
            OR: [
                { taiKhoan: { contains: tuKhoa } },
                { hoTen: { contains: tuKhoa } }
            ]
        } : {};

        // Tính toán skip (bỏ qua bao nhiêu phần tử)
        const skip = (soTrang - 1) * soPhanTuTrenTrang;

        // Đếm tổng số bản ghi và lấy dữ liệu của trang hiện tại
        const [totalCount, items] = await Promise.all([
            prisma.nguoiDung.count({ where: whereCondition }),
            prisma.nguoiDung.findMany({
                where: whereCondition,
                skip,
                take: soPhanTuTrenTrang,
                select: {
                    taiKhoan: true,
                    hoTen: true,
                    email: true,
                    soDt: true,
                    maLoaiNguoiDung: true
                }
            })
        ]);

        const totalPages = Math.ceil(totalCount / soPhanTuTrenTrang);

        return {
            currentPage: soTrang,
            count: items.length,
            totalPages,
            totalCount,
            items
        };
    }

    // 7. Thêm người dùng (Dành cho Quản trị viên)
    async themNguoiDung(data) {
        const { taiKhoan, matKhau, email, soDt, hoTen, maLoaiNguoiDung } = data;

        const checkUser = await prisma.nguoiDung.findUnique({ where: { taiKhoan } });
        if (checkUser) {
            const error = new Error('Tài khoản đã tồn tại!');
            error.statusCode = 400;
            throw error;
        }

        const checkEmail = await prisma.nguoiDung.findUnique({ where: { email } });
        if (checkEmail) {
            const error = new Error('Email đã được sử dụng!');
            error.statusCode = 400;
            throw error;
        }

        const hashPassword = await bcrypt.hash(matKhau, 10);
        const newUser = await prisma.nguoiDung.create({
            data: {
                taiKhoan,
                matKhau: hashPassword,
                email,
                soDt,
                hoTen,
                maLoaiNguoiDung: maLoaiNguoiDung || 'KhachHang'
            }
        });

        const { matKhau: _, ...result } = newUser;
        return result;
    }

    // 8. Cập nhật thông tin người dùng
    async capNhatThongTinNguoiDung(data, currentUser) {
        const { taiKhoan, matKhau, email, soDt, hoTen, maLoaiNguoiDung } = data;

        // Nếu không phải Admin thì chỉ được sửa thông tin của chính mình
        if (currentUser.maLoaiNguoiDung !== 'QuanTri' && currentUser.taiKhoan !== taiKhoan) {
            const error = new Error('Bạn không có quyền chỉnh sửa tài khoản của người khác!');
            error.statusCode = 403;
            throw error;
        }

        const user = await prisma.nguoiDung.findUnique({ where: { taiKhoan } });
        if (!user) {
            const error = new Error('Không tìm thấy tài khoản cần cập nhật!');
            error.statusCode = 404;
            throw error;
        }

        // Chuẩn bị dữ liệu cập nhật
        const updateData = {
            email: email || user.email,
            soDt: soDt || user.soDt,
            hoTen: hoTen || user.hoTen
        };

        // Nếu có truyền mật khẩu mới thì băm lại
        if (matKhau) {
            updateData.matKhau = await bcrypt.hash(matKhau, 10);
        }

        // Chỉ Admin mới được quyền đổi quyền hạn (maLoaiNguoiDung)
        if (currentUser.maLoaiNguoiDung === 'QuanTri' && maLoaiNguoiDung) {
            updateData.maLoaiNguoiDung = maLoaiNguoiDung;
        }

        const updatedUser = await prisma.nguoiDung.update({
            where: { taiKhoan },
            data: updateData
        });

        const { matKhau: _, ...result } = updatedUser;
        return result;
    }

    // 9. Xóa người dùng (Chỉ Quản trị viên)
    async xoaNguoiDung(taiKhoan) {
        const user = await prisma.nguoiDung.findUnique({ where: { taiKhoan } });
        if (!user) {
            const error = new Error('Không tìm thấy tài khoản cần xóa!');
            error.statusCode = 404;
            throw error;
        }

        await prisma.nguoiDung.delete({ where: { taiKhoan } });
        return 'Xóa người dùng thành công!';
    }

        // 10. Lấy thông tin một người dùng cụ thể theo tài khoản (LayThongTinNguoiDung)
    async layThongTinNguoiDung(taiKhoan) {
        if (!taiKhoan) {
            const error = new Error('Vui lòng cung cấp tài khoản!');
            error.statusCode = 400;
            throw error;
        }

        const user = await prisma.nguoiDung.findUnique({
            where: { taiKhoan },
            select: {
                taiKhoan: true,
                hoTen: true,
                email: true,
                soDt: true,
                maLoaiNguoiDung: true
            }
        });

        if (!user) {
            const error = new Error('Không tìm thấy tài khoản yêu cầu!');
            error.statusCode = 404;
            throw error;
        }

        return user;
    }

}

module.exports = new UserService();
