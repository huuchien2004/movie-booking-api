const { PrismaClient } = require('@prisma/client');

// Khởi tạo instance Prisma Client duy nhất cho toàn dự án
const prisma = new PrismaClient();

module.exports = prisma;
