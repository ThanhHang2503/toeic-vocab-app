# 🚀 TOEIC Vocabulary Mastery App (Fullstack)

Ứng dụng học từ vựng TOEIC hiện đại, được xây dựng với kiến trúc Fullstack mạnh mẽ, giao diện cao cấp và trải nghiệm người dùng tối ưu.

## 📁 Cấu trúc dự án
- **`frontend/`**: React 19 + Vite 8 + Tailwind CSS 4.
- **`backend/`**: Spring Boot 3.3 (Java 21) + Hibernate/JPA.
- **`database/`**: MySQL 8.0 Script.
- **`docker-compose.yml`**: Trình điều phối toàn bộ hệ thống.

---

## 🛠 Yêu cầu hệ thống (Prerequisites)
Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:
- **Docker & Docker Compose** (Khuyên dùng)
- Hoặc nếu chạy thủ công:
  - **Node.js 20+** & **npm**
  - **Java 21 (JDK)**
  - **Maven 3.9+**
  - **MySQL 8.0**

---

## 🐳 Khởi chạy bằng Docker (Khuyên dùng)

Đây là cách nhanh nhất và ổn định nhất để chạy dự án.

### 1. Chuẩn bị file môi trường
Sao chép file cấu hình mẫu cho Frontend:
```bash
cp frontend/.env.example frontend/.env
```

### 2. Khởi động hệ thống
Dùng lệnh duy nhất để build và chạy tất cả các dịch vụ:
```bash
docker-compose up -d --build
```

### 3. Truy cập ứng dụng
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **API Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) (nếu có)

---

## 💻 Khởi chạy cục bộ (Manual Setup)

Nếu bạn muốn phát triển hoặc không sử dụng Docker:

### 1. Cấu hình Database
- Tạo database tên `toeic_db` trong MySQL.
- Chạy script tại `database/schema.sql` để tạo bảng.

### 2. Chạy Backend
```bash
cd backend
# Cấu hình DB trong src/main/resources/application.yml nếu cần
./mvnw spring-boot:run
```

### 3. Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
*Lưu ý: Đảm bảo `.env` trỏ đúng về API URL (mặc định http://localhost:8080/api).*

---

## ⚠️ Giải quyết sự cố (Troubleshooting)

### Lỗi Vite/Node_modules (khi chạy Docker trên Windows)
Nếu gặp lỗi `ERR_MODULE_NOT_FOUND` hoặc hot-reload không hoạt động:
```powershell
# Windows PowerShell
docker compose down
rm -Recurse -Force frontend/node_modules
docker compose build --no-cache
docker compose up -d
```

### Reset toàn bộ dữ liệu
Để xóa sạch database và khởi động lại:
```bash
docker compose down -v
docker compose up -d
```

### Lỗi kết nối Database
- Đảm bảo không có service MySQL nào khác đang chạy trên cổng 3306 ở máy thật nếu bạn dùng cổng này.
- Kiểm tra logs: `docker compose logs -f db`

---

## 📜 Quy ước phát triển
- **Giao diện**: Ưu tiên tính thẩm mỹ (HSL colors, Glassmorphism).
- **Backend**: Kiến trúc 3 lớp (Controller -> Service -> Repository).
- **Database**: Cập nhật `database/schema.sql` khi có thay đổi cấu trúc.

---
*Phát triển với ❤️ bởi đội ngũ TOEIC Mastery.* 💡
