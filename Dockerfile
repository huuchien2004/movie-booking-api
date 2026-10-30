# Sử dụng NodeJS bản LTS ổn định
FROM node:20-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install --production

# Copy toàn bộ mã nguồn
COPY . .

# Generate Prisma Client trong môi trường Docker
RUN npx prisma generate

# Mở cổng 3069
EXPOSE 3069

# Lệnh khởi chạy server
CMD ["node", "server.js"]
