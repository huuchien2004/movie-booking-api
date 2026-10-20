const prisma = require('../configs/prisma.config');

class TicketService {
    // 1. Tạo lịch chiếu mới (Chỉ dành cho Quản trị viên)
    async taoLichChieu(data) {
        const { maPhim, ngayChieuGioChieu, maRap, giaVe } = data;

        if (!maPhim || !ngayChieuGioChieu || !maRap) {
            const error = new Error('Vui lòng điền đầy đủ: maPhim, ngayChieuGioChieu, maRap!');
            error.statusCode = 400;
            throw error;
        }

        return await prisma.lichChieu.create({
            data: {
                maPhim: parseInt(maPhim),
                maRap: parseInt(maRap),
                ngayChieuGioChieu: new Date(ngayChieuGioChieu),
                giaVe: parseInt(giaVe) || 75000
            }
        });
    }

    // 2. Lấy danh sách phòng vé (Sơ đồ ghế + Trạng thái đã đặt/chưa đặt)
    async layDanhSachPhongVe(maLichChieu) {
        if (!maLichChieu) {
            const error = new Error('Vui lòng cung cấp mã lịch chiếu!');
            error.statusCode = 400;
            throw error;
        }

        // 2.1. Lấy thông tin lịch chiếu kèm Phim, Rạp, Cụm Rạp
        const lichChieu = await prisma.lichChieu.findUnique({
            where: { maLichChieu: parseInt(maLichChieu) },
            include: {
                Phim: true,
                Rap: {
                    include: {
                        CumRap: true
                    }
                }
            }
        });

        if (!lichChieu) {
            const error = new Error('Không tìm thấy lịch chiếu yêu cầu!');
            error.statusCode = 404;
            throw error;
        }

        // 2.2. Lấy toàn bộ danh sách ghế của phòng chiếu đó
        const danhSachGhe = await prisma.ghe.findMany({
            where: { maRap: lichChieu.maRap },
            orderBy: { stt: 'asc' }
        });

        // 2.3. Lấy danh sách các vé ĐÃ ĐƯỢC ĐẶT cho suất chiếu này
        const veDaDat = await prisma.datVe.findMany({
            where: { maLichChieu: parseInt(maLichChieu) }
        });

        // Tạo một Set chứa mã các ghế đã được đặt để tra cứu siêu nhanh
        const setGheDaDat = new Map();
        veDaDat.forEach(ve => {
            setGheDaDat.set(ve.maGhe, ve.taiKhoan);
        });

        // 2.4. Ghép trạng thái đã đặt (daDat) vào từng chiếc ghế
        const danhSachGheRender = danhSachGhe.map(ghe => {
            const daDat = setGheDaDat.has(ghe.maGhe);
            return {
                maGhe: ghe.maGhe,
                tenGhe: ghe.tenGhe,
                maRap: ghe.maRap,
                loaiGhe: ghe.loaiGhe,
                stt: ghe.stt,
                giaVe: ghe.giaVe || lichChieu.giaVe,
                daDat: daDat,
                taiKhoanNguoiDat: daDat ? setGheDaDat.get(ghe.maGhe) : null
            };
        });

        return {
            thongTinPhim: {
                maLichChieu: lichChieu.maLichChieu,
                tenCumRap: lichChieu.Rap.CumRap.tenCumRap,
                tenRap: lichChieu.Rap.tenRap,
                diaChi: lichChieu.Rap.CumRap.diaChi,
                tenPhim: lichChieu.Phim.tenPhim,
                hinhAnh: lichChieu.Phim.hinhAnh,
                ngayChieu: lichChieu.ngayChieuGioChieu.toISOString().split('T')[0],
                gioChieu: lichChieu.ngayChieuGioChieu.toISOString().split('T')[1].substring(0, 5)
            },
            danhSachGhe: danhSachGheRender
        };
    }

    // 3. Nghiệp vụ Đặt vé (Dùng Transaction để không bao giờ bị trùng ghế)
    async datVe(data, currentUser) {
        const { maLichChieu, danhSachVe } = data;
        const taiKhoan = currentUser.taiKhoan;

        if (!maLichChieu || !danhSachVe || danhSachVe.length === 0) {
            const error = new Error('Dữ liệu đặt vé không hợp lệ! Vui lòng chọn ít nhất 1 ghế.');
            error.statusCode = 400;
            throw error;
        }

        // Sử dụng Prisma Transaction để đảm bảo tính an toàn dữ liệu
        return await prisma.$transaction(async (tx) => {
            // Bước 3.1: Kiểm tra xem có ghế nào trong danh sách ĐÃ BỊ NGƯỜI KHÁC ĐẶT TRƯỚC KHÔNG
            const listMaGhe = danhSachVe.map(v => v.maGhe);
            const gheDaDatCheck = await tx.datVe.findMany({
                where: {
                    maLichChieu: parseInt(maLichChieu),
                    maGhe: { in: listMaGhe }
                }
            });

            if (gheDaDatCheck.length > 0) {
                const error = new Error('Một hoặc nhiều ghế bạn chọn vừa được người khác đặt. Vui lòng chọn ghế khác!');
                error.statusCode = 400;
                throw error;
            }

            // Bước 3.2: Lưu từng vé vào bảng DatVe
            const createPromises = danhSachVe.map(ve => {
                return tx.datVe.create({
                    data: {
                        taiKhoan,
                        maLichChieu: parseInt(maLichChieu),
                        maGhe: parseInt(ve.maGhe),
                        giaVe: parseInt(ve.giaVe)
                    }
                });
            });

            await Promise.all(createPromises);
            return 'Đặt vé thành công!';
        });
    }
}

module.exports = new TicketService();
