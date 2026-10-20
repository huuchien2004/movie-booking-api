const prisma = require('../configs/prisma.config');

class CinemaService {
    // 1. Lấy thông tin hệ thống rạp
    async layThongTinHeThongRap(maHeThongRap) {
        const whereCondition = maHeThongRap ? { maHeThongRap } : {};
        return await prisma.heThongRap.findMany({
            where: whereCondition
        });
    }

    // 2. Lấy thông tin cụm rạp theo hệ thống
    async layThongTinCumRapTheoHeThong(maHeThongRap) {
        if (!maHeThongRap) {
            const error = new Error('Vui lòng cung cấp mã hệ thống rạp (ví dụ: BHDStar, CGV)!');
            error.statusCode = 400;
            throw error;
        }

        return await prisma.cumRap.findMany({
            where: { maHeThongRap },
            include: {
                Rap: {
                    select: {
                        maRap: true,
                        tenRap: true
                    }
                }
            }
        });
    }

    // 3. Lấy thông tin lịch chiếu theo hệ thống rạp
    async layThongTinLichChieuHeThongRap(maHeThongRap) {
        const whereCondition = maHeThongRap ? { maHeThongRap } : {};

        return await prisma.heThongRap.findMany({
            where: whereCondition,
            include: {
                CumRap: {
                    include: {
                        Rap: {
                            include: {
                                LichChieu: {
                                    include: {
                                        Phim: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    // 4. Lấy thông tin lịch chiếu của một bộ phim
    async layThongTinLichChieuPhim(maPhim) {
        if (!maPhim) {
            const error = new Error('Vui lòng cung cấp mã phim!');
            error.statusCode = 400;
            throw error;
        }

        const phim = await prisma.phim.findUnique({
            where: { maPhim: parseInt(maPhim) },
            include: {
                LichChieu: {
                    include: {
                        Rap: {
                            include: {
                                CumRap: {
                                    include: {
                                        HeThongRap: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!phim) {
            const error = new Error('Không tìm thấy phim yêu cầu!');
            error.statusCode = 404;
            throw error;
        }

        return phim;
    }
}

module.exports = new CinemaService();
