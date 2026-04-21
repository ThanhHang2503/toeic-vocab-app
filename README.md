# 🚀 TOEIC Vocabulary Mastery App (Fullstack)

Ứng dụng học từ vựng TOEIC hiện đại, được xây dựng với kiến trúc Fullstack mạnh mẽ, giao diện cao cấp và trải nghiệm người dùng tối ưu.

## 📁 Cấu trúc dự án
Dự án được quản lý tập trung và vận hành mượt mà thông qua Docker:
- **`frontend/`**: Ứng dụng React 19 + Vite 8 + Tailwind CSS 4.
- **`backend/`**: Ứng dụng Spring Boot 3.3 (Java 21) + Hibernate/JPA.
- **`database/`**: MySQL 8.0 Script.
- **`docker-compose.yml`**: Trái tim điều phối toàn bộ hệ thống.

## 🏛 Công nghệ lõi (Premium Stack)
- **Frontend**: 
  - **Framework**: React 19 (Latest)
  - **Build Tool**: Vite 8 ⚡
  - **Styling**: Tailwind CSS 4 (Engine mới nhất)
  - **Icons**: Lucide React
  - **State Management**: Zustand
- **Backend**:
  - **Core**: Spring Boot 3.3.x
  - **Java Version**: 21 (LTS)
  - **Database**: MySQL 8.0
- **Infrastructure**: Docker & Docker Compose

## 🐳 Hướng dẫn khởi chạy nhanh (Docker)

Chỉ cần một lệnh duy nhất để thiết lập toàn bộ môi trường:

1. **Chuẩn bị file môi trường**:
   ```bash
   cd frontend
   cp .env.example .env
   cd ..
   ```

2. **Khởi động hệ thống**:
   ```bash
   # Build và start toàn bộ container
   docker-compose up -d --build
   ```

3. **Truy cập**:
   - **Giao diện người dùng**: [http://localhost:5173](http://localhost:5173)
   - **Tài liệu API (Dev)**: [http://localhost:8080/api](http://localhost:8080/api)

## 🛠 Tính năng nổi bật
- **Dashboard thông minh**: Tổng quan tiến độ học tập.
- **Flashcard 3D**: Chế độ thẻ lật mượt mà với hiệu ứng xoay 3D cao cấp.
- **Knowledge Test**: 
  - Hệ thống tự động tạo câu hỏi Fill-in-the-blank từ ví dụ.
  - Chế độ dịch nghĩa Anh-Việt.
- **Persistence Mistakes**: Tự động lưu lại những từ bạn làm sai để ôn tập lại sau.
- **No-Auth Public App**: Được thiết kế để truy cập công cộng, không yêu cầu đăng nhập phức tạp.

## ⚠️ Giải quyết sự cố thường gặp (Troubleshooting)

Nếu bạn gặp phải lỗi `500 Internal Server Error` hoặc lỗi `ERR_MODULE_NOT_FOUND` khi chạy bằng Docker:

1. **Lỗi Vite Cache**: Do sự khác biệt giữa môi trường Windows và Docker volume.
   ```powershell
   # Giải pháp: Xóa cache Vite và rebuild lại sạch
   docker compose down
   rm -Recurse -Force frontend/node_modules/.vite
   docker compose build --no-cache frontend
   docker compose up -d
   ```

2. **Lỗi Tailwind Unknown Utility (`btn`)**: 
   - Đảm bảo không sử dụng `@apply btn` nếu không có DaisyUI.
   - Luôn sử dụng các utility chuẩn của Tailwind 4 trong `index.css`.

3. **Reset Database**:
   - Để làm sạch hoàn toàn dữ liệu và chạy lại từ đầu:
   ```bash
   docker compose down -v
   docker compose up -d
   ```

## 📜 Quy ước phát triển
- **Giao diện**: Luôn ưu tiên tính thẩm mỹ (Premium UI/UX). Sử dụng HSL colors và Glassmorphism.
- **Backend**: Sử dụng kiến trúc 3 lớp (Controller -> Service -> Repository).
- **Database**: Mọi thay đổi schema phải được cập nhật vào `database/schema.sql`.

---
*Phát triển bởi đội ngũ đam mê công nghệ học thuật.* 💡
