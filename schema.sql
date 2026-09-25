-- Cloudflare D1 Database Schema for cam-duc-hiep

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS films (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  format TEXT,
  content_html TEXT,
  credits_json TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
