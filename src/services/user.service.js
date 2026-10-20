const prisma = require('../configs/prisma.config');
const bcrypt = require('bcryptjs');
const { createAccessToken } = require('../helpers/token.helper');

class UserService {
    /**
     * 1.ĐĂNG KÝ
     * Luồng: Kiểm tra trùng tài khoản/email -> Băm mật khẩu (bcrypt) -> Lưu vào MySQL
     */
    async dangKy(data) {
        const { taiKhoan, matKhau, email, soDt, hoTen } = data;

        // Bước 1.1: Kiểm tra xem tài khoản đã tồn tại chưa
        const checkUser = await prisma.nguoiDung.findUnique({
            where: { taiKhoan }
        });
        if (checkUser) {
            const error = new Error('Tài khoản đã tồn tại!');
            error.statusCode = 400;
            throw error;
        }

        // Bước 1.2: Kiểm tra xem email đã có ai dùng chưa
        const checkEmail = await prisma.nguoiDung.findUnique({
            where: { email }
        });
        if (checkEmail) {
            const error = new Error('Email đã được sử dụng!');
            error.statusCode = 400;
            throw error;
        }

        // Bước 1.3: Mã hóa mật khẩu một chiều bằng bcrypt (độ phức tạp 10)
        const hashPassword = await bcrypt.hash(matKhau, 10);

        // Bước 1.4: Tạo người dùng mới trong Database
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

        // Ẩn mật khẩu trước khi trả về cho client
        const { matKhau: _, ...userWithoutPass } = newUser;
        return userWithoutPass;
    }

    /**
     * 2. ĐĂNG NHẬP
     */
    async dangNhap(data) {
        const { taiKhoan, matKhau } = data;

        // Bước 2.1: Tìm người dùng theo tài khoản
        const user = await prisma.nguoiDung.findUnique({
            where: { taiKhoan }
        });
        if (!user) {
            const error = new Error('Tài khoản hoặc mật khẩu không đúng!');
            error.statusCode = 400;
            throw error;
        }

        // Bước 2.2: So sánh mật khẩu người dùng gõ vào với mật khẩu đã băm trong DB
        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if (!isMatch) {
            const error = new Error('Tài khoản hoặc mật khẩu không đúng!');
            error.statusCode = 400;
            throw error;
        }

        // Bước 2.3: Tạo Access Token JWT chứa thông tin cần thiết
        const accessToken = createAccessToken({
            taiKhoan: user.taiKhoan,
            maLoaiNguoiDung: user.maLoaiNguoiDung
        });

        // Trả về đúng format mà Swagger Cybersoft yêu cầu
        return {
            taiKhoan: user.taiKhoan,
            hoTen: user.hoTen,
            email: user.email,
            soDt: user.soDt,
            maLoaiNguoiDung: user.maLoaiNguoiDung,
            accessToken
        };
    }

    /**
     * 3. LẤY THÔNG TIN TÀI KHOẢN (PROFILE) KÈM LỊCH SỬ ĐẶT VÉ
     */
    async thongTinTaiKhoan(taiKhoan) {
        const user = await prisma.nguoiDung.findUnique({
            where: { taiKhoan },
            include: {
                DatVe: {
                    include: {
                        LichChieu: {
                            include: {
                                Phim: true
                            }
                        },
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

    /**
     * 4. LẤY DANH SÁCH NGƯỜI DÙNG (CÓ HỖ TRỢ TÌM KIẾM TỪ KHÓA)
     */
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
}

module.exports = new UserService();
