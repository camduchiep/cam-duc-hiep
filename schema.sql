-- Cloudflare D1 Database Schema for cam-duc-hiep

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'published', -- 'draft' | 'published'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample post if empty
INSERT OR IGNORE INTO posts (id, title, slug, excerpt, content, cover_image, status)
VALUES (
  1,
  'Chào mừng đến với website Cẩm Đức Hiệp',
  'chao-mung-den-voi-website-cam-duc-hiep',
  'Đây là bài viết đầu tiên được xuất bản từ hệ thống quản trị nội dung của website.',
  '<h2>Xin chào!</h2><p>Đây là bài viết mẫu được lưu trữ an toàn trong <strong>Cloudflare D1 Database</strong> và phục vụ thông qua <strong>Astro Server-Side Rendering</strong> trên mạng lưới Cloudflare Edge toàn cầu.</p><p>Người quản trị có thể truy cập <code>/admin</code> bất kỳ lúc nào để chỉnh sửa hoặc viết thêm bài mới bằng trình soạn thảo trực quan.</p>',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  'published'
);
