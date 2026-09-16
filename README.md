# Website Cẩm Đức Hiệp (cam-duc-hiep.com)

Hệ thống website bài viết và tin tức hiện đại được xây dựng trên nền tảng **Astro** (Server-Side Rendering), cơ sở dữ liệu **Cloudflare D1** và triển khai tự động qua **GitHub** & **Cloudflare Pages**.

---

## 🌟 Điểm nổi bật của hệ thống

1. **Trang Quản trị `/admin` tiện dụng như WordPress**:
   - Truy cập: `/admin` (được bảo vệ bằng mật khẩu và HTTP-only session cookie).
   - Danh sách bài viết trực quan: Thống kê số lượng, trạng thái (Bản nháp / Đã xuất bản), Xem, Sửa, Xóa bài.
   - Trình soạn thảo văn bản WYSIWYG (Quill Editor) cho người không biết code: Bôi đen chọn Tiêu đề (H1, H2, H3), In đậm, In nghiêng, Gạch đầu dòng, Căn lề, Chèn link, Chèn ảnh.
2. **Cơ sở dữ liệu Cloudflare D1**:
   - Serverless SQLite phân tán tại các điểm Edge toàn cầu của Cloudflare.
   - Tốc độ phản hồi vài mili-giây, chi phí 0đ (nằm trong hạn mức miễn phí rất lớn của Cloudflare).
3. **Hiệu năng & Tối ưu SEO**:
   - Trang bài viết công khai siêu nhẹ, hỗ trợ thẻ OpenGraph để chia sẻ lên mạng xã hội (Facebook, Zalo...).

---

## 🔑 Tài khoản Quản trị mặc định

- **Đường dẫn**: `http://localhost:4321/admin` (hoặc `https://cam-duc-hiep.com/admin`)
- **Tên đăng nhập**: `admin` (hoặc `camduchiep`)
- **Mật khẩu**: `camduchiep@2026`
*(Bạn có thể đổi mật khẩu này bằng cách thêm biến môi trường `ADMIN_PASSWORD` trong file `.env` hoặc trên Cloudflare Dashboard).*

---

## 🚀 Hướng dẫn cài đặt & Chạy cục bộ (Local Development)

### 1. Cài đặt thư viện
Mở Terminal trong thư mục `cam-duc-hiep` và chạy:
```bash
npm install
```

### 2. Khởi tạo Database D1 cục bộ
Chạy lệnh sau để tạo bảng `posts` và `users` cùng bài viết mẫu trên máy của bạn:
```bash
npm run d1:init-local
```

### 3. Chạy môi trường phát triển
```bash
npm run dev
```
Truy cập:
- Trang chủ: [http://localhost:4321](http://localhost:4321)
- Trang quản trị: [http://localhost:4321/admin](http://localhost:4321/admin)

---

## ☁️ Hướng dẫn Triển khai lên Cloudflare & GitHub

### Bước 1: Đẩy mã nguồn lên GitHub
1. Khởi tạo Git repo (nếu chưa có):
   ```bash
   git init
   git add .
   git commit -m "Khởi tạo mã nguồn website cam-duc-hiep"
   ```
2. Tạo một Repository mới trên GitHub (ví dụ: `cam-duc-hiep`).
3. Đẩy code lên GitHub:
   ```bash
   git remote add origin https://github.com/<tai-khoan-cua-ban>/cam-duc-hiep.git
   git branch -M main
   git push -u origin main
   ```

### Bước 2: Tạo Cloudflare D1 Database trên Cloudflare
1. Đăng nhập vào Cloudflare CLI:
   ```bash
   npx wrangler login
   ```
2. Tạo database D1:
   ```bash
   npx wrangler d1 create cam-duc-hiep-db
   ```
   *Lưu ý: Lệnh trên sẽ trả về một `database_id` (dạng UUID, ví dụ: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`). Hãy dán ID này vào mục `database_id` trong file `wrangler.toml`.*
3. Khởi tạo cấu trúc bảng trên Cloudflare D1 thật:
   ```bash
   npm run d1:init-remote
   ```

### Bước 3: Kết nối Cloudflare Pages
1. Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Compute (Workers & Pages)** > **Create application** > Chọn tab **Pages** > **Connect to Git**.
2. Chọn repository `cam-duc-hiep` từ tài khoản GitHub của bạn.
3. Cấu hình Build Settings:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Kết nối D1 Database vào Cloudflare Pages:
   - Sau khi tạo Pages project, vào **Settings** > **Functions** > **D1 database bindings**.
   - Thêm binding:
     - **Variable name**: `DB`
     - **D1 database**: Chọn `cam-duc-hiep-db`
5. Thêm biến môi trường mật khẩu quản trị (Tùy chọn):
   - Vào **Settings** > **Environment variables** > Thêm `ADMIN_PASSWORD` với giá trị mật khẩu bạn muốn đặt.
6. Cấu hình tên miền riêng:
   - Vào **Custom domains** > Thêm `cam-duc-hiep.com`.
