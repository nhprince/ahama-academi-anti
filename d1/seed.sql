-- ==========================================================
-- AHAMA ACADEMY - COMPREHENSIVE PRODUCTION SEED DATA
-- ==========================================================

-- 1. Users & Instructors
-- Passwords (SHA-256):
-- admin123   -> a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
-- student123 -> 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
INSERT OR REPLACE INTO users (id, name, email, password_hash, role, avatar, headline, bio) VALUES
('usr_admin', 'Sahariyar Ahamad', 'admin@ahama.academy', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'admin', 'SA', 'Founder & Lead Software Engineer', 'Passionate Android & Edge systems developer with over 7 years of building production apps.'),
('usr_student', 'Tanvir Hasan', 'student@ahama.academy', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'student', 'TH', 'Aspiring Mobile App Developer', 'Computer Science undergraduate learning Native Android and Modern Web.');

INSERT OR REPLACE INTO instructors (id, user_id, display_name, title, avatar, bio, social_links) VALUES
('ins_founder', 'usr_admin', 'Sahariyar Ahamad', 'Lead Android & Full-Stack Architect', 'SA', 'Senior software engineer specializing in clean Android architecture (MVVM, Room, Kotlin, Java) and serverless Cloudflare Workers architectures.', '{"github":"https://github.com/sahariyar","website":"https://ahama.academy"}');

-- 2. Masterclass Courses
INSERT OR REPLACE INTO courses (id, slug, instructor_id, title, subtitle, description, category, level, price, price_usd, is_free, thumbnail, badge, duration_hours, language, requirements, outcomes) VALUES
('crs_java_app', 'app-development-with-java', 'ins_founder', 'App Development with Java (Native Android)', 'Build 5 Real-World Android Apps from Scratch', 'Master native Android development using Java & XML. Go from absolute beginner to building production apps with SQLite, Room, REST APIs, and Material Design UI.', 'Mobile Development', 'Beginner → Intermediate', 1499, 15, 0, 'assets/img/android-mastery.jpg', 'Bestseller', 18.5, 'Bangla & English', '["Basic computer literacy","No prior programming experience required","PC or Mac with at least 8GB RAM"]', '["Build and deploy 5 real-world native Android apps","Master Java OOP principles in mobile development","Design modern responsive layouts using XML ConstraintLayout","Store offline data with Room Database & SQLite","Integrate REST APIs using Retrofit and Volley"]'),
('crs_java_found', 'java-foundation', 'ins_founder', 'Java Foundation & OOP Mastery', 'Complete Guide to Object-Oriented Programming', 'Build a rock-solid core Java programming foundation before stepping into Android, Spring Boot, or enterprise development. Features 40+ coding exercises.', 'Programming', 'Beginner', 0, 0, 1, 'assets/img/java-foundation.jpg', 'Free Starter', 8.0, 'Bangla & English', '["A working computer with JDK 17+ installed"]', '["Write clean, efficient Java code","Master classes, objects, inheritance, polymorphism, and abstraction","Handle exceptions and debugging like a professional","Understand memory management and the JVM"]'),
('crs_android_lab', 'android-project-lab', 'ins_founder', 'Android Project Lab: MVVM & Production Architecture', 'Advanced Enterprise Android Development', 'Take your Android skills to the senior level. Build an enterprise e-commerce app with MVVM, Clean Architecture, Repository Pattern, Dependency Injection, and Jetpack.', 'Mobile Development', 'Intermediate', 1999, 20, 0, 'assets/img/android-lab.jpg', 'Hot & New', 22.0, 'Bangla & English', '["Basic understanding of Java or Kotlin and Android Studio"]', '["Architect large Android apps with Clean Architecture & MVVM","Implement dependency injection and repository patterns","Build offline-first synchronization engines","Publish optimized release APKs and App Bundles to Google Play"]'),
('crs_fullstack_edge', 'fullstack-web-edge', 'ins_founder', 'Full-Stack Edge Web Development', 'High-Performance Web Apps on Cloudflare Pages & D1', 'Create blazing fast web applications on Cloudflare Pages, Edge Functions, and D1 database using pure Vanilla JS. Zero framework bloat, 100/100 Lighthouse performance.', 'Web Development', 'All Levels', 1299, 13, 0, 'assets/img/fullstack-edge.jpg', 'Trending', 14.0, 'Bangla & English', '["Basic HTML & CSS knowledge"]', '["Deploy serverless full-stack web applications on Cloudflare Pages","Use Cloudflare D1 for ultra-fast edge SQLite storage","Build authenticated REST APIs with WebCrypto & JWT","Write lightning-fast Vanilla JS without bulky npm dependencies"]');

-- 3. Detailed Curriculum
INSERT OR REPLACE INTO curriculum (id, course_id, module_title, lesson_title, description, video_provider, video_url, duration, is_preview, sort_order) VALUES
('cur_01', 'crs_java_app', 'Module 1: Android Studio & Environment Setup', '1.1 Installing Android Studio, JDK & SDK Setup', 'Complete guide to setting up Android Studio on Windows and Mac without errors.', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '14m', 1, 1),
('cur_02', 'crs_java_app', 'Module 1: Android Studio & Environment Setup', '1.2 Understanding Project Structure, Gradle & Manifest', 'Learn how Gradle scripts, AndroidManifest.xml, and resources work together.', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '18m', 1, 2),
('cur_03', 'crs_java_app', 'Module 2: UI Design with XML & ConstraintLayout', '2.1 ConstraintLayout Deep Dive & Responsive Rules', 'Designing responsive mobile screens that adapt to phones, foldables, and tablets.', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '25m', 0, 3),
('cur_04', 'crs_java_app', 'Module 2: UI Design with XML & ConstraintLayout', '2.2 Material Design Components: Buttons, Cards, & Pickers', 'Implementing modern Material 3 styling, color palettes, and elevated cards.', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '22m', 0, 4),
('cur_05', 'crs_java_app', 'Module 3: Java Logic & Activity Navigation', '3.1 Activity Lifecycle, Intent & Screen Navigation', 'Master how Android manages memory and how activities communicate with data bundles.', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '30m', 0, 5),
('cur_06', 'crs_java_app', 'Module 3: Java Logic & Activity Navigation', '3.2 RecyclerView, Custom Adapters & ViewHolders', 'Build high-performance scrollable lists displaying dynamic data with click listeners.', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '35m', 0, 6),
('cur_07', 'crs_java_app', 'Module 4: Real-World Capstone Project', '4.1 Building a Complete Task & Habit Tracker App', 'Full walkthrough building, testing, and generating a signed APK for your portfolio.', 'youtube', 'https://www.youtube.com/embed/fis26HvvDII', '45m', 0, 7),

('cur_08', 'crs_java_found', 'Module 1: Java Basics & Syntax', '1.1 Variables, Primitive Data Types & Conditionals', 'Understanding Java primitive types, if-else logic, and switch expressions.', 'youtube', 'https://www.youtube.com/embed/eIrMbAQSU34', '15m', 1, 1),
('cur_09', 'crs_java_found', 'Module 1: Java Basics & Syntax', '1.2 Loops, Arrays & String Manipulations', 'For-loops, while-loops, array indexing, and memory allocation in Java.', 'youtube', 'https://www.youtube.com/embed/eIrMbAQSU34', '20m', 1, 2),
('cur_10', 'crs_java_found', 'Module 2: Object-Oriented Principles', '2.1 Classes, Objects, Inheritance & Encapsulation', 'The foundational building blocks of all modern Android and enterprise software.', 'youtube', 'https://www.youtube.com/embed/eIrMbAQSU34', '28m', 1, 3);

-- 4. Interactive Quizzes
INSERT OR REPLACE INTO quizzes (id, course_id, title, passing_score, questions_json) VALUES
('quiz_java_app_01', 'crs_java_app', 'Android Fundamentals & Activity Lifecycle Quiz', 75, '[
  {"id":"q1","question":"Which file declares all activities and application permissions in an Android project?","options":["build.gradle","AndroidManifest.xml","strings.xml","MainActivity.java"],"correct_idx":1,"explanation":"AndroidManifest.xml is the central manifest declaring components and permissions."},
  {"id":"q2","question":"Which lifecycle method is called right before an activity becomes visible to the user?","options":["onCreate()","onStart()","onResume()","onPause()"],"correct_idx":1,"explanation":"onStart() makes the activity visible, followed immediately by onResume() which brings it to the foreground."},
  {"id":"q3","question":"Why is RecyclerView preferred over ListView in modern Android?","options":["RecyclerView is older","RecyclerView recycles ViewHolders to preserve RAM","ListView does not support scrolling","RecyclerView requires no adapter"],"correct_idx":1,"explanation":"RecyclerView reuses view items as they scroll off-screen, preventing memory lag."}
]');

-- 5. Digital Products & Themes (with Versioning)
INSERT OR REPLACE INTO templates (id, slug, title, subtitle, description, category, price, is_free, current_version, live_preview_url, download_url, tags, tech_stack, sales_count) VALUES
('tpl_nova_lms', 'nova-lms-template', 'Nova LMS - Ultra-Fast Course Platform Theme', 'Pure HTML5/CSS3 Academy Platform', 'A lightweight, zero-dependency educational website theme. Features dark mode, responsive video player shell, curriculum accordions, and 100/100 Lighthouse performance.', 'Web Themes', 799, 0, 'v1.2.0', 'https://ahama-academy.pages.dev', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip', 'HTML5, CSS3, Vanilla JS, Dark Mode', '["HTML5", "Vanilla CSS", "Zero External Libraries", "Cloudflare Ready"]', 142),
('tpl_finpay_app', 'finpay-android-kit', 'FinPay - Fintech & Mobile Wallet App UI Kit', 'Production Android XML + Java Template', 'Production-ready Android native XML + Java templates for modern e-wallets, bKash-style transfers, biometric lock, transaction histories, and card management.', 'Android Apps', 1199, 0, 'v2.1.0', '#demo-finpay', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip', 'Android Java, XML, Material Design 3', '["Android Studio Ladybug", "Java 17", "XML ConstraintLayout", "Material 3"]', 89),
('tpl_dev_portfolio', 'portfolio-pro-minimal', 'PortfolioPro - Minimalist Engineer Portfolio', 'Clean Developer Portfolio with Project Grids', 'Sleek dark-mode portfolio theme for software engineers, mobile developers, and creators. Includes project showcases, skills cards, and interactive resume viewer.', 'Web Themes', 0, 1, 'v1.0.0', '#demo-portfolio', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip', 'HTML, CSS, Free, Mobile-First', '["HTML5", "CSS Grid", "Responsive"]', 310),
('tpl_aura_store', 'aura-ecommerce-edge', 'Aura - Serverless Cloudflare Storefront', 'Full-Stack E-Commerce Template on Cloudflare D1', 'High-performance e-commerce theme pre-configured for Cloudflare Pages & D1 database. Product catalog, cart modal, instant checkout, and admin dashboard.', 'Full-Stack', 1499, 0, 'v1.5.0', '#demo-aura', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip', 'Cloudflare Pages, D1, Vanilla JS', '["Cloudflare Pages", "D1 SQLite", "Pages Functions", "Vanilla JS"]', 67);

-- Template Versions & Changelogs
INSERT OR REPLACE INTO template_versions (id, template_id, version, changelog, download_url) VALUES
('tv_01', 'tpl_nova_lms', 'v1.2.0', 'Added Bengali translation support, improved dark mode contrast, fixed mobile navigation drawer.', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip'),
('tv_02', 'tpl_nova_lms', 'v1.0.0', 'Initial production release with course catalog and curriculum layouts.', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip'),
('tv_03', 'tpl_finpay_app', 'v2.1.0', 'Upgraded to Material 3 themes, added custom QR scan layout and pin code inputs.', 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip');

-- 6. Student Reviews
INSERT OR REPLACE INTO reviews (id, user_id, target_type, target_id, rating, review_text) VALUES
('rev_01', 'usr_student', 'course', 'crs_java_app', 5, 'Best practical Android course in Bangla. The explanation of ConstraintLayout and RecyclerView helped me finally land my junior Android internship!'),
('rev_02', 'usr_student', 'course', 'crs_java_found', 5, 'Clear, concise, and straight to the point. No 2-hour boring theoretical lectures.'),
('rev_03', 'usr_student', 'template', 'tpl_nova_lms', 5, 'Incredible code quality. Clean Vanilla CSS with zero build step needed. Deployed on Cloudflare Pages in 2 minutes.');

-- 7. Lesson Discussions (Q&A)
INSERT OR REPLACE INTO discussions (id, course_id, curriculum_id, user_id, author_name, author_avatar, question, reply_text, replied_by) VALUES
('disc_01', 'crs_java_app', 'cur_01', 'usr_student', 'Tanvir Hasan', 'TH', 'I got a Gradle sync issue on Windows with JDK 21. How do I point Android Studio to JDK 17?', 'Go to Settings -> Build, Execution, Deployment -> Build Tools -> Gradle -> Gradle JDK, and select Embedded JDK 17. That will resolve the compatibility mismatch.', 'Sahariyar Ahamad');

-- 8. Orders & Enrollments
INSERT OR REPLACE INTO orders (id, order_code, user_id, user_email, item_type, item_id, item_title, amount, payment_method, trx_id, sender_phone, status, notes) VALUES
('ord_10482', 'AA-10482', 'usr_student', 'student@ahama.academy', 'course', 'crs_java_app', 'App Development with Java (Native Android)', 1499, 'bkash', 'BK99X8741A', '01712345678', 'approved', 'Verified merchant payment via bKash'),
('ord_10483', 'AA-10483', 'usr_student', 'student@ahama.academy', 'template', 'tpl_nova_lms', 'Nova LMS - Ultra-Fast Course Platform Theme', 799, 'nagad', 'NG55L2984K', '01812345678', 'approved', 'Production license granted'),
('ord_10484', 'AA-10484', 'usr_admin', 'student@example.com', 'course', 'crs_android_lab', 'Android Project Lab: MVVM & Production Architecture', 1999, 'rocket', 'RK44A9901M', '01912345678', 'pending', 'Awaiting manual verification by admin');

INSERT OR REPLACE INTO enrollments (id, user_id, course_id, progress_percent, completed_lessons, certificate_id) VALUES
('enr_01', 'usr_student', 'crs_java_app', 42, '["cur_01","cur_02","cur_03"]', 'AA-CERT-2026-9041'),
('enr_02', 'usr_student', 'crs_java_found', 100, '["cur_08","cur_09","cur_10"]', 'AA-CERT-2026-8812');

INSERT OR REPLACE INTO template_access (id, user_id, template_id, license_key, download_count) VALUES
('tpa_01', 'usr_student', 'tpl_nova_lms', 'AA-LIC-NOVA-8947-XK', 3);

-- 9. Active Coupons
INSERT OR REPLACE INTO coupons (code, discount_type, discount_value, min_spend, max_uses, used_count, is_active) VALUES
('WELCOME20', 'percent', 20, 500, 200, 48, 1),
('BANGLA50', 'percent', 50, 500, 100, 31, 1),
('FREEPASS', 'percent', 100, 0, 50, 12, 1);

-- 10. CMS Customizer Settings (Brand, Pricing, Localization, & Colors)
INSERT OR REPLACE INTO cms_settings (key, value) VALUES
('site_name', 'Ahama Academy'),
('site_tagline', 'Learn practical skills. Build real software.'),
('announcement_bar', '🎉 50% Off on all Android & Web Masterclasses! Use coupon <b>BANGLA50</b> at checkout.'),
('announcement_active', '1'),
('hero_headline', 'Master Code.<br><span>Build Real Things.</span>'),
('hero_subtext', 'Project-based native Android, Java, and modern Full-Stack courses designed to turn you into an industry-ready engineer. Download production-ready templates & themes.'),
('bkash_number', '01712-345678 (Personal / Send Money)'),
('nagad_number', '01812-345678 (Merchant / Payment)'),
('rocket_number', '01912-345678-9 (Personal / Send Money)'),
('support_email', 'support@ahama.academy'),
('currency_symbol', '৳'),
('theme_primary_color', '#e11d48'),
('theme_accent_color', '#6366f1'),
('default_lang', 'en');

-- 11. Storage Providers Catalog
INSERT OR REPLACE INTO storage_providers (id, name, type, config_json, is_active, priority) VALUES
('sp_youtube', 'YouTube Protected Embeds', 'youtube', '{"type":"unlisted","note":"Unlimited zero-cost video streaming bandwidth"}', 1, 1),
('sp_github', 'GitHub Releases CDN', 'github_release', '{"repo":"sahariyar/templates","note":"Free 2GB direct zip asset distribution"}', 1, 2),
('sp_supabase', 'Supabase Free Tier (1GB Storage)', 'supabase', '{"bucket":"course-assets","publicUrl":"https://your-project.supabase.co/storage/v1/object/public/"}', 1, 3),
('sp_cloudinary', 'Cloudinary Free Tier (25GB Bandwidth)', 'cloudinary', '{"cloudName":"ahama-academy","resourceType":"auto"}', 1, 4);
