-- ==========================================================
-- AHAMA ACADEMY - CLOUDFLARE D1 DATABASE SCHEMA
-- Ultra-lightweight SQLite at the edge, 100% free tier compliant
-- ==========================================================

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'student', -- 'student' | 'admin'
  avatar TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'Beginner',
  price INTEGER DEFAULT 0,
  is_free INTEGER DEFAULT 0,
  thumbnail TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  instructor TEXT DEFAULT 'Ahama Academy',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS curriculum;
CREATE TABLE curriculum (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  module_title TEXT NOT NULL,
  lesson_title TEXT NOT NULL,
  video_provider TEXT DEFAULT 'youtube', -- 'youtube' | 'direct' | 'vimeo' | 'hybrid'
  video_url TEXT NOT NULL,
  duration TEXT DEFAULT '15m',
  is_preview INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 1,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS templates;
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Web Themes' | 'Android Apps' | 'UI Kits' | 'Full-Stack'
  price INTEGER DEFAULT 0,
  is_free INTEGER DEFAULT 0,
  live_preview_url TEXT DEFAULT '',
  download_url TEXT NOT NULL,
  thumbnail TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_code TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'course' | 'template'
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL, -- 'bkash' | 'nagad' | 'card' | 'free'
  trx_id TEXT DEFAULT '',
  sender_phone TEXT DEFAULT '',
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS enrollments;
CREATE TABLE enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  progress_percent INTEGER DEFAULT 0,
  completed_lessons TEXT DEFAULT '[]', -- JSON array of lesson IDs
  completed_at TIMESTAMP,
  certificate_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

DROP TABLE IF EXISTS template_access;
CREATE TABLE template_access (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  license_key TEXT UNIQUE NOT NULL,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, template_id)
);

DROP TABLE IF EXISTS coupons;
CREATE TABLE coupons (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL, -- 'percent' | 'fixed'
  discount_value INTEGER NOT NULL,
  min_spend INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1
);

DROP TABLE IF EXISTS cms_settings;
CREATE TABLE cms_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS storage_providers;
CREATE TABLE storage_providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'youtube' | 'supabase' | 'cloudinary' | 'github_release' | 'gdrive' | 'direct'
  config_json TEXT DEFAULT '{}',
  is_active INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 10
);

-- Indices for rapid indexing
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_curriculum_course ON curriculum(course_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
