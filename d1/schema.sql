-- ==========================================================
-- AHAMA ACADEMY - ENTERPRISE CLOUDFLARE D1 DATABASE SCHEMA
-- Fully relational, 100% free tier compliant, multi-instructor ready
-- ==========================================================

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'student', -- 'student' | 'admin' | 'instructor'
  avatar TEXT DEFAULT '',
  headline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  email_verified INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS instructors;
CREATE TABLE instructors (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  title TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  bio TEXT NOT NULL,
  social_links TEXT DEFAULT '{}', -- JSON: github, twitter, linkedin, website
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  instructor_id TEXT DEFAULT 'ins_founder',
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'Beginner', -- 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  price INTEGER DEFAULT 0, -- In BDT (৳)
  price_usd INTEGER DEFAULT 0, -- In USD ($)
  is_free INTEGER DEFAULT 0,
  thumbnail TEXT DEFAULT '',
  badge TEXT DEFAULT '', -- 'Bestseller' | 'Hot & New' | 'Highest Rated' | 'Free Starter'
  duration_hours REAL DEFAULT 0,
  language TEXT DEFAULT 'Bangla & English',
  requirements TEXT DEFAULT '[]', -- JSON array of strings
  outcomes TEXT DEFAULT '[]', -- JSON array of learning objectives
  is_published INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

DROP TABLE IF EXISTS curriculum;
CREATE TABLE curriculum (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  module_title TEXT NOT NULL,
  lesson_title TEXT NOT NULL,
  description TEXT DEFAULT '',
  video_provider TEXT DEFAULT 'youtube', -- 'youtube' | 'direct' | 'supabase' | 'cloudinary'
  video_url TEXT NOT NULL,
  duration TEXT DEFAULT '15m',
  is_preview INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 1,
  resources_json TEXT DEFAULT '[]', -- JSON: [{ name, url, size }]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS quizzes;
CREATE TABLE quizzes (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  curriculum_id TEXT, -- Optional link to specific lesson
  title TEXT NOT NULL,
  passing_score INTEGER DEFAULT 80, -- Percentage required
  questions_json TEXT NOT NULL, -- JSON array: [{ id, question, options: [], correct_idx, explanation }]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS quiz_submissions;
CREATE TABLE quiz_submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  passed INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS templates;
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Web Themes' | 'Android Apps' | 'UI Kits' | 'Full-Stack'
  price INTEGER DEFAULT 0,
  is_free INTEGER DEFAULT 0,
  current_version TEXT DEFAULT 'v1.0.0',
  live_preview_url TEXT DEFAULT '',
  download_url TEXT NOT NULL,
  thumbnail TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  tech_stack TEXT DEFAULT '[]', -- JSON array: ['HTML5', 'Vanilla CSS', 'Cloudflare D1']
  features TEXT DEFAULT '[]', -- JSON array of key highlights
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS template_versions;
CREATE TABLE template_versions (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  version TEXT NOT NULL, -- e.g. 'v1.2.0'
  changelog TEXT NOT NULL,
  download_url TEXT NOT NULL,
  released_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
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
  payment_method TEXT NOT NULL, -- 'bkash' | 'nagad' | 'rocket' | 'card' | 'free'
  trx_id TEXT DEFAULT '',
  sender_phone TEXT DEFAULT '',
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS enrollments;
CREATE TABLE enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  progress_percent INTEGER DEFAULT 0,
  completed_lessons TEXT DEFAULT '[]', -- JSON array of curriculum IDs
  certificate_id TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS template_access;
CREATE TABLE template_access (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  license_key TEXT UNIQUE NOT NULL,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, template_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'course' | 'template'
  target_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS discussions;
CREATE TABLE discussions (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  curriculum_id TEXT,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT DEFAULT '',
  question TEXT NOT NULL,
  reply_text TEXT DEFAULT '',
  replied_by TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS student_notes;
CREATE TABLE student_notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  curriculum_id TEXT NOT NULL,
  timestamp_seconds INTEGER DEFAULT 0,
  note_content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
  type TEXT NOT NULL, -- 'youtube' | 'supabase' | 'cloudinary' | 'github_release' | 'b2' | 'r2' | 'direct'
  config_json TEXT DEFAULT '{}',
  is_active INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 10
);

-- Fast query indices
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_curriculum_course ON curriculum(course_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_discussions_course ON discussions(course_id);
