const prisma = require('../configs/prisma.config');

class MovieService {
    // 1. Lấy danh sách Banner trang chủ
    async layDanhSachBanner() {
        return await prisma.banner.findMany({
            include: {
                Phim: {
                    select: {
                        tenPhim: true,
                        trailer: true
                    }
                }
            }
        });
    }

    // 2. Lấy danh sách phim (có tìm kiếm theo tên và lọc theo mã nhóm)
    async layDanhSachPhim(query) {
        const { tenPhim, maNhom = 'GP01' } = query;

        const whereCondition = {
            maNhom: maNhom || 'GP01'
        };

        if (tenPhim) {
            whereCondition.tenPhim = {
                contains: tenPhim
            };
        }

        return await prisma.phim.findMany({
            where: whereCondition,
            orderBy: {
                ngayKhoiChieu: 'desc'
            }
        });
    }

    // 3. Lấy danh sách phim phân trang
    async layDanhSachPhimPhanTrang(query) {
        const soTrang = parseInt(query.soTrang) || 1;
        const soPhanTuTrenTrang = parseInt(query.soPhanTuTrenTrang) || 10;
        const { tenPhim, maNhom = 'GP01' } = query;

        const whereCondition = {
            maNhom: maNhom || 'GP01'
        };

        if (tenPhim) {
            whereCondition.tenPhim = {
                contains: tenPhim
            };
        }

        const skip = (soTrang - 1) * soPhanTuTrenTrang;

        const [totalCount, items] = await Promise.all([
            prisma.phim.count({ where: whereCondition }),
            prisma.phim.findMany({
                where: whereCondition,
                skip,
                take: soPhanTuTrenTrang,
                orderBy: { ngayKhoiChieu: 'desc' }
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

    // 4. Lấy thông tin chi tiết một bộ phim (kèm lịch chiếu)
    async layThongTinPhim(maPhim) {
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

    // 5. Thêm phim mới kèm Upload hình ảnh
    async themPhimUploadHinh(data, file) {
        const { tenPhim, trailer, moTa, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu, maNhom } = data;

        if (!tenPhim) {
            const error = new Error('Tên phim không được để trống!');
            error.statusCode = 400;
            throw error;
        }

        // Tạo đường dẫn ảnh từ file upload (ví dụ: http://localhost:3069/uploads/hinhAnh-12345.jpg)
        let hinhAnh = null;
        if (file) {
            hinhAnh = `http://localhost:${process.env.PORT || 3069}/uploads/${file.filename}`;
        }

        return await prisma.phim.create({
            data: {
                tenPhim,
                biDanh: tenPhim.toLowerCase().replace(/ /g, '-'),
                trailer: trailer || '',
                hinhAnh: hinhAnh || 'https://movienew.cybersoft.edu.vn/hinhanh/default.jpg',
                moTa: moTa || '',
                maNhom: maNhom || 'GP01',
                ngayKhoiChieu: ngayKhoiChieu ? new Date(ngayKhoiChieu) : new Date(),
                danhGia: parseInt(danhGia) || 5,
                hot: hot === 'true' || hot === true,
                dangChieu: dangChieu === 'true' || dangChieu === true,
                sapChieu: sapChieu === 'true' || sapChieu === true
            }
        });
    }

    // 6. Cập nhật thông tin phim
    async capNhatPhimUpload(data, file) {
        const { maPhim, tenPhim, trailer, moTa, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu, maNhom } = data;

        const checkPhim = await prisma.phim.findUnique({
            where: { maPhim: parseInt(maPhim) }
        });

        if (!checkPhim) {
            const error = new Error('Không tìm thấy phim cần cập nhật!');
            error.statusCode = 404;
            throw error;
        }

        const updateData = {};
        if (tenPhim) {
            updateData.tenPhim = tenPhim;
            updateData.biDanh = tenPhim.toLowerCase().replace(/ /g, '-');
        }
        if (trailer !== undefined) updateData.trailer = trailer;
        if (moTa !== undefined) updateData.moTa = moTa;
        if (maNhom !== undefined) updateData.maNhom = maNhom;
        if (ngayKhoiChieu) updateData.ngayKhoiChieu = new Date(ngayKhoiChieu);
        if (danhGia !== undefined) updateData.danhGia = parseInt(danhGia);
        if (hot !== undefined) updateData.hot = hot === 'true' || hot === true;
        if (dangChieu !== undefined) updateData.dangChieu = dangChieu === 'true' || dangChieu === true;
        if (sapChieu !== undefined) updateData.sapChieu = sapChieu === 'true' || sapChieu === true;

        // Nếu có upload ảnh mới thì cập nhật đường dẫn ảnh
        if (file) {
            updateData.hinhAnh = `http://localhost:${process.env.PORT || 3069}/uploads/${file.filename}`;
        }

        return await prisma.phim.update({
            where: { maPhim: parseInt(maPhim) },
            data: updateData
        });
    }

    // 7. Xóa phim
    async xoaPhim(maPhim) {
        const checkPhim = await prisma.phim.findUnique({
            where: { maPhim: parseInt(maPhim) }
        });

        if (!checkPhim) {
            const error = new Error('Không tìm thấy phim cần xóa!');
            error.statusCode = 404;
            throw error;
        }

        await prisma.phim.delete({
            where: { maPhim: parseInt(maPhim) }
        });

        return 'Xóa phim thành công!';
    }

        // 8. Lấy danh sách phim theo khoảng ngày khởi chiếu
    async layDanhSachPhimTheoNgay(query) {
        const { tuNgay, denNgay, tenPhim, maNhom = 'GP01' } = query;
        const soTrang = parseInt(query.soTrang) || 1;
        const soPhanTuTrenTrang = parseInt(query.soPhanTuTrenTrang) || 10;

        const whereCondition = {
            maNhom: maNhom || 'GP01'
        };

        if (tenPhim) {
            whereCondition.tenPhim = { contains: tenPhim };
        }

        if (tuNgay && denNgay) {
            whereCondition.ngayKhoiChieu = {
                gte: new Date(tuNgay),
                lte: new Date(denNgay)
            };
        }

        const skip = (soTrang - 1) * soPhanTuTrenTrang;

        const [totalCount, items] = await Promise.all([
            prisma.phim.count({ where: whereCondition }),
            prisma.phim.findMany({
                where: whereCondition,
                skip,
                take: soPhanTuTrenTrang,
                orderBy: { ngayKhoiChieu: 'desc' }
            })
        ]);

        return {
            currentPage: soTrang,
            count: items.length,
            totalPages: Math.ceil(totalCount / soPhanTuTrenTrang),
            totalCount,
            items
        };
    }

}

module.exports = new MovieService();
