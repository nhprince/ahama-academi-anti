-- ==========================================================
-- AHAMA ACADEMY - SEED DATA FOR D1
-- ==========================================================

-- Default Users (passwords hashed with SHA-256 for demo; in production WebCrypto PBKDF2 used)
-- admin123 -> a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
-- student123 -> 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
INSERT OR REPLACE INTO users (id, name, email, password_hash, role, avatar) VALUES
('usr_admin', 'Ahama Administrator', 'admin@ahama.academy', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'admin', 'AA'),
('usr_student', 'Sahariyar Ahamad', 'student@ahama.academy', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'student', 'SA');

-- Courses
INSERT OR REPLACE INTO courses (id, slug, title, description, category, level, price, is_free, thumbnail, badge, instructor) VALUES
('crs_java_app', 'app-development-with-java', 'App Development with Java (Native Android)', 'Master Android app development using Java & XML. Build 5 production-ready mobile apps from scratch.', 'Mobile Development', 'Beginner → Intermediate', 1499, 0, 'assets/img/course-android.jpg', 'Bestseller', 'Sahariyar Ahamad'),
('crs_java_found', 'java-foundation', 'Java Foundation & OOP Mastery', 'Build a rock-solid core Java programming foundation before stepping into Android and enterprise frameworks.', 'Programming', 'Beginner', 0, 1, 'assets/img/course-java.jpg', 'Free Starter', 'Ahama Academy'),
('crs_android_lab', 'android-project-lab', 'Android Project Lab & Advanced Architecture', 'Build scalable Android applications with MVVM, Retrofit, Room Database, and clean code principles.', 'Mobile Development', 'Intermediate', 1999, 0, 'assets/img/course-lab.jpg', 'Hot & New', 'Sahariyar Ahamad'),
('crs_fullstack_edge', 'fullstack-web-edge', 'Full-Stack Edge Web Development', 'Create blazing fast web apps on Cloudflare Pages, Workers, and D1 with pure Vanilla JS and zero frameworks.', 'Web Development', 'All Levels', 1299, 0, 'assets/img/course-web.jpg', 'Trending', 'Ahama Web Team');

-- Curriculum for App Development with Java
INSERT OR REPLACE INTO curriculum (id, course_id, module_title, lesson_title, video_provider, video_url, duration, is_preview, sort_order) VALUES
('cur_01', 'crs_java_app', 'Module 1: Android Studio & Setup', '1.1 Installing Android Studio & SDK Configuration', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '14m', 1, 1),
('cur_02', 'crs_java_app', 'Module 1: Android Studio & Setup', '1.2 Understanding Project Structure, Gradle & Manifest', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '18m', 1, 2),
('cur_03', 'crs_java_app', 'Module 2: Layouts & UI Design', '2.1 ConstraintLayout, LinearLayout & XML Attributes', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '25m', 0, 3),
('cur_04', 'crs_java_app', 'Module 2: Layouts & UI Design', '2.2 Responsive UI for Multi-Screen Android Devices', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '22m', 0, 4),
('cur_05', 'crs_java_app', 'Module 3: Java Logic & Activities', '3.1 Activity Lifecycle, Intent & Screen Navigation', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '30m', 0, 5),
('cur_06', 'crs_java_app', 'Module 3: Java Logic & Activities', '3.2 RecyclerView, Custom Adapters & ViewHolders', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '35m', 0, 6),
('cur_07', 'crs_java_app', 'Module 4: Real World Project', '4.1 Building a Complete Task Manager App', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '42m', 0, 7);

-- Curriculum for Java Foundation
INSERT OR REPLACE INTO curriculum (id, course_id, module_title, lesson_title, video_provider, video_url, duration, is_preview, sort_order) VALUES
('cur_08', 'crs_java_found', 'Module 1: Java Basics', '1.1 Variables, Data Types & Conditionals', 'youtube', 'https://www.youtube.com/embed/eIrMbAQSU34', '15m', 1, 1),
('cur_09', 'crs_java_found', 'Module 1: Java Basics', '1.2 Loops, Arrays & String Manipulations', 'youtube', 'https://www.youtube.com/embed/eIrMbAQSU34', '20m', 1, 2),
('cur_10', 'crs_java_found', 'Module 2: Object-Oriented Programming', '2.1 Classes, Objects, Inheritance & Polymorphism', 'youtube', 'https://www.youtube.com/embed/eIrMbAQSU34', '28m', 1, 3);

-- Digital Products / Templates
INSERT OR REPLACE INTO templates (id, slug, title, description, category, price, is_free, live_preview_url, download_url, thumbnail, tags, sales_count) VALUES
('tpl_nova_lms', 'nova-lms-template', 'Nova LMS - Modern Course Academy Theme', 'A lightweight, ultra-responsive HTML5 & Vanilla CSS course platform template. Zero external framework dependencies, 100/100 Lighthouse score.', 'Web Themes', 799, 0, 'https://ahama-academy.pages.dev', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip', 'assets/img/tpl-lms.jpg', 'HTML5, CSS3, Vanilla JS, Dark Mode', 142),
('tpl_finpay_app', 'finpay-android-kit', 'FinPay - Fintech & Wallet App UI Kit', 'Production-ready Android native XML + Java templates for modern e-wallets, bKash-style payments, and transaction history screens.', 'Android Apps', 1199, 0, '#demo-finpay', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip', 'assets/img/tpl-finpay.jpg', 'Android Java, XML, Material Design', 89),
('tpl_dev_portfolio', 'portfolio-pro-minimal', 'PortfolioPro - Minimalist Developer Portfolio', 'Sleek dark-mode portfolio theme for software engineers and creators. Includes project showcases, skills cards, and resume export.', 'Web Themes', 0, 1, '#demo-portfolio', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip', 'assets/img/tpl-portfolio.jpg', 'HTML, CSS, Free, Mobile-First', 310),
('tpl_aura_store', 'aura-ecommerce-edge', 'Aura - Serverless Cloudflare Storefront', 'Fast e-commerce theme pre-configured for Cloudflare Pages & D1 database. Product catalog, cart modal, and checkout flows.', 'Full-Stack', 1499, 0, '#demo-aura', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip', 'assets/img/tpl-store.jpg', 'Cloudflare Pages, D1, Vanilla JS', 67);

-- Initial Orders for Demo
INSERT OR REPLACE INTO orders (id, order_code, user_id, user_email, item_type, item_id, item_title, amount, payment_method, trx_id, sender_phone, status, notes) VALUES
('ord_10482', 'AA-10482', 'usr_student', 'student@ahama.academy', 'course', 'crs_java_app', 'App Development with Java', 1499, 'bkash', 'BK99X8741A', '01712345678', 'approved', 'Verified merchant payment'),
('ord_10483', 'AA-10483', 'usr_student', 'student@ahama.academy', 'template', 'tpl_nova_lms', 'Nova LMS - Modern Course Academy Theme', 799, 'nagad', 'NG55L2984K', '01812345678', 'approved', 'Template download license granted'),
('ord_10484', 'AA-10484', 'usr_guest', 'arif@example.com', 'course', 'crs_android_lab', 'Android Project Lab', 1999, 'bkash', 'BK34A9901M', '01912345678', 'pending', 'Awaiting admin verification');

-- Enrollments
INSERT OR REPLACE INTO enrollments (id, user_id, course_id, progress_percent, completed_lessons, certificate_id) VALUES
('enr_01', 'usr_student', 'crs_java_app', 42, '["cur_01","cur_02","cur_03"]', 'AA-CERT-2026-9041'),
('enr_02', 'usr_student', 'crs_java_found', 100, '["cur_08","cur_09","cur_10"]', 'AA-CERT-2026-8812');

-- Template Access
INSERT OR REPLACE INTO template_access (id, user_id, template_id, license_key, download_count) VALUES
('tpa_01', 'usr_student', 'tpl_nova_lms', 'AA-LIC-NOVA-8947-XK', 3);

-- Active Promotional Coupons
INSERT OR REPLACE INTO coupons (code, discount_type, discount_value, min_spend, max_uses, used_count, is_active) VALUES
('WELCOME20', 'percent', 20, 500, 200, 48, 1),
('AHAMA500', 'fixed', 500, 1000, 100, 31, 1),
('FREEPASS', 'percent', 100, 0, 50, 12, 1);

-- Hybrid Storage Providers
INSERT OR REPLACE INTO storage_providers (id, name, type, config_json, is_active, priority) VALUES
('sp_youtube', 'YouTube Protected Embeds', 'youtube', '{"type":"unlisted","note":"Unlimited zero-cost video streaming bandwidth"}', 1, 1),
('sp_supabase', 'Supabase Free Tier (1GB Storage)', 'supabase', '{"bucket":"course-assets","publicUrl":"https://your-project.supabase.co/storage/v1/object/public/"}', 1, 2),
('sp_cloudinary', 'Cloudinary Free Tier (25GB Bandwidth)', 'cloudinary', '{"cloudName":"ahama-academy","resourceType":"auto"}', 1, 3),
('sp_github', 'GitHub Releases / Direct Raw', 'github_release', '{"repo":"ahama-academy/digital-downloads","note":"Generous free download bandwidth for large zip files"}', 1, 4);

-- Dynamic CMS Platform Settings
INSERT OR REPLACE INTO cms_settings (key, value) VALUES
('site_name', 'Ahama Academy'),
('site_tagline', 'Learn practical skills & build real software.'),
('announcement_bar', '🎉 50% Off on all Android & Web Masterclasses! Use coupon BANGLA50 at checkout.'),
('announcement_active', '1'),
('hero_headline', 'Master Code.<br><span>Build Real Things.</span>'),
('hero_subtext', 'Project-based native Android, Java, and modern Full-Stack courses designed to turn you into an industry-ready engineer.'),
('bkash_number', '01712-345678 (Personal / Send Money)'),
('nagad_number', '01812-345678 (Merchant / Payment)'),
('support_email', 'support@ahama.academy'),
('currency_symbol', '৳');
