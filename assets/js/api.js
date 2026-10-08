// ==========================================================
// Ahama Academy - Universal Enterprise API Client & Storage Engine
// Seamlessly connects to Cloudflare Pages Functions (/api/...)
// Auto-fails over to LocalStorage Mock Edge if running standalone
// ==========================================================

(function() {
  const API_BASE = '/api';
  const TOKEN_KEY = 'ahama_auth_token';
  const USER_KEY = 'ahama_auth_user';
  const STORE_KEY = 'ahama_local_d1_store_v2';

  // Seed default dataset for offline/standalone operation
  function getLocalStore() {
    let data = localStorage.getItem(STORE_KEY);
    if (!data) {
      data = {
        users: [
          { id: 'usr_admin', name: 'Sahariyar Ahamad', email: 'admin@ahama.academy', role: 'admin', avatar: 'SA' },
          { id: 'usr_student', name: 'Tanvir Hasan', email: 'student@ahama.academy', role: 'student', avatar: 'TH' }
        ],
        courses: [
          {
            id: 'crs_java_app',
            slug: 'app-development-with-java',
            title: 'App Development with Java (Native Android)',
            subtitle: 'Build 5 Real-World Android Apps from Scratch',
            description: 'Master native Android development using Java & XML. Go from absolute beginner to building production apps with SQLite, Room, REST APIs, and Material Design UI.',
            category: 'Mobile Development',
            level: 'Beginner → Intermediate',
            price: 1499,
            price_usd: 15,
            is_free: 0,
            badge: 'Bestseller',
            instructor_name: 'Sahariyar Ahamad',
            instructor_title: 'Lead Android Architect',
            duration_hours: 18.5,
            lessons_count: 7,
            rating: 4.9,
            reviews_count: 48
          },
          {
            id: 'crs_java_found',
            slug: 'java-foundation',
            title: 'Java Foundation & OOP Mastery',
            subtitle: 'Complete Guide to Object-Oriented Programming',
            description: 'Build a rock-solid core Java programming foundation before stepping into Android, Spring Boot, or enterprise development. Features 40+ coding exercises.',
            category: 'Programming',
            level: 'Beginner',
            price: 0,
            price_usd: 0,
            is_free: 1,
            badge: 'Free Starter',
            instructor_name: 'Sahariyar Ahamad',
            instructor_title: 'Lead Instructor',
            duration_hours: 8.0,
            lessons_count: 3,
            rating: 5.0,
            reviews_count: 82
          },
          {
            id: 'crs_android_lab',
            slug: 'android-project-lab',
            title: 'Android Project Lab: MVVM & Production Architecture',
            subtitle: 'Advanced Enterprise Android Development',
            description: 'Take your Android skills to the senior level. Build an enterprise e-commerce app with MVVM, Clean Architecture, Repository Pattern, Dependency Injection, and Jetpack.',
            category: 'Mobile Development',
            level: 'Intermediate',
            price: 1999,
            price_usd: 20,
            is_free: 0,
            badge: 'Hot & New',
            instructor_name: 'Sahariyar Ahamad',
            instructor_title: 'Senior Software Engineer',
            duration_hours: 22.0,
            lessons_count: 8,
            rating: 4.8,
            reviews_count: 31
          },
          {
            id: 'crs_fullstack_edge',
            slug: 'fullstack-web-edge',
            title: 'Full-Stack Edge Web Development',
            subtitle: 'High-Performance Web Apps on Cloudflare Pages & D1',
            description: 'Create blazing fast web applications on Cloudflare Pages, Edge Functions, and D1 database using pure Vanilla JS. Zero framework bloat, 100/100 Lighthouse performance.',
            category: 'Web Development',
            level: 'All Levels',
            price: 1299,
            price_usd: 13,
            is_free: 0,
            badge: 'Trending',
            instructor_name: 'Sahariyar Ahamad',
            duration_hours: 14.0,
            lessons_count: 6,
            rating: 4.9,
            reviews_count: 24
          }
        ],
        curriculum: {
          'crs_java_app': [
            { id: 'cur_01', module_title: 'Module 1: Android Studio & Setup', lesson_title: '1.1 Installing Android Studio, JDK & SDK Setup', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '14m', is_preview: 1 },
            { id: 'cur_02', module_title: 'Module 1: Android Studio & Setup', lesson_title: '1.2 Understanding Project Structure, Gradle & Manifest', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '18m', is_preview: 1 },
            { id: 'cur_03', module_title: 'Module 2: UI Design with XML', lesson_title: '2.1 ConstraintLayout Deep Dive & Responsive Rules', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '25m', is_preview: 0 },
            { id: 'cur_04', module_title: 'Module 2: UI Design with XML', lesson_title: '2.2 Material Design Components & Cards', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '22m', is_preview: 0 },
            { id: 'cur_05', module_title: 'Module 3: Java Logic & Activities', lesson_title: '3.1 Activity Lifecycle, Intent & Screen Navigation', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '30m', is_preview: 0 },
            { id: 'cur_06', module_title: 'Module 3: Java Logic & Activities', lesson_title: '3.2 RecyclerView, Custom Adapters & ViewHolders', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '35m', is_preview: 0 },
            { id: 'cur_07', module_title: 'Module 4: Real-World Capstone', lesson_title: '4.1 Building a Complete Task & Habit Tracker App', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '45m', is_preview: 0 }
          ],
          'crs_java_found': [
            { id: 'cur_08', module_title: 'Module 1: Java Basics', lesson_title: '1.1 Variables, Primitive Data Types & Conditionals', video_url: 'https://www.youtube.com/embed/eIrMbAQSU34', duration: '15m', is_preview: 1 },
            { id: 'cur_09', module_title: 'Module 1: Java Basics', lesson_title: '1.2 Loops, Arrays & String Manipulations', video_url: 'https://www.youtube.com/embed/eIrMbAQSU34', duration: '20m', is_preview: 1 },
            { id: 'cur_10', module_title: 'Module 2: OOP Principles', lesson_title: '2.1 Classes, Objects, Inheritance & Encapsulation', video_url: 'https://www.youtube.com/embed/eIrMbAQSU34', duration: '28m', is_preview: 1 }
          ]
        },
        quizzes: {
          'quiz_java_app_01': {
            id: 'quiz_java_app_01',
            course_id: 'crs_java_app',
            title: 'Android Fundamentals & Activity Lifecycle Quiz',
            passing_score: 75,
            questions: [
              { id: 'q1', question: 'Which file declares all activities and application permissions in an Android project?', options: ['build.gradle', 'AndroidManifest.xml', 'strings.xml', 'MainActivity.java'], correct_idx: 1, explanation: 'AndroidManifest.xml is the central manifest declaring components and permissions.' },
              { id: 'q2', question: 'Which lifecycle method is called right before an activity becomes visible to the user?', options: ['onCreate()', 'onStart()', 'onResume()', 'onPause()'], correct_idx: 1, explanation: 'onStart() makes the activity visible, followed by onResume().' },
              { id: 'q3', question: 'Why is RecyclerView preferred over ListView in modern Android?', options: ['RecyclerView is older', 'RecyclerView recycles ViewHolders to preserve RAM', 'ListView does not support scrolling', 'RecyclerView requires no adapter'], correct_idx: 1, explanation: 'RecyclerView reuses view items as they scroll off-screen, preventing memory lag.' }
            ]
          }
        },
        templates: [
          {
            id: 'tpl_nova_lms',
            slug: 'nova-lms-template',
            title: 'Nova LMS - Ultra-Fast Course Platform Theme',
            subtitle: 'Pure HTML5/CSS3 Academy Platform',
            description: 'A lightweight, zero-dependency educational website theme. Features dark mode, responsive video player shell, curriculum accordions, and 100/100 Lighthouse performance.',
            category: 'Web Themes',
            price: 799,
            is_free: 0,
            current_version: 'v1.2.0',
            live_preview_url: 'https://ahama-academy.pages.dev',
            download_url: 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip',
            tags: 'HTML5, CSS3, Vanilla JS, Dark Mode',
            sales_count: 142,
            rating: 5.0,
            reviews_count: 18,
            versions: [
              { version: 'v1.2.0', changelog: 'Added Bengali translation support, improved dark mode contrast, fixed mobile navigation drawer.', released_at: '2026-10-01' },
              { version: 'v1.0.0', changelog: 'Initial production release with course catalog and curriculum layouts.', released_at: '2026-09-15' }
            ]
          },
          {
            id: 'tpl_finpay_app',
            slug: 'finpay-android-kit',
            title: 'FinPay - Fintech & Mobile Wallet App UI Kit',
            subtitle: 'Production Android XML + Java Template',
            description: 'Production-ready Android native XML + Java templates for modern e-wallets, bKash-style transfers, biometric lock, transaction histories, and card management.',
            category: 'Android Apps',
            price: 1199,
            is_free: 0,
            current_version: 'v2.1.0',
            live_preview_url: '#demo-finpay',
            download_url: 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip',
            tags: 'Android Java, XML, Material Design 3',
            sales_count: 89,
            rating: 4.9,
            reviews_count: 14
          },
          {
            id: 'tpl_dev_portfolio',
            slug: 'portfolio-pro-minimal',
            title: 'PortfolioPro - Minimalist Engineer Portfolio',
            subtitle: 'Clean Developer Portfolio with Project Grids',
            description: 'Sleek dark-mode portfolio theme for software engineers, mobile developers, and creators. Includes project showcases, skills cards, and interactive resume viewer.',
            category: 'Web Themes',
            price: 0,
            is_free: 1,
            current_version: 'v1.0.0',
            live_preview_url: '#demo-portfolio',
            download_url: 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip',
            tags: 'HTML, CSS, Free, Mobile-First',
            sales_count: 310,
            rating: 4.8,
            reviews_count: 42
          },
          {
            id: 'tpl_aura_store',
            slug: 'aura-ecommerce-edge',
            title: 'Aura - Serverless Cloudflare Storefront',
            subtitle: 'Full-Stack E-Commerce Template on Cloudflare D1',
            description: 'High-performance e-commerce theme pre-configured for Cloudflare Pages & D1 database. Product catalog, cart modal, instant checkout, and admin dashboard.',
            category: 'Full-Stack',
            price: 1499,
            is_free: 0,
            current_version: 'v1.5.0',
            live_preview_url: '#demo-aura',
            download_url: 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip',
            tags: 'Cloudflare Pages, D1, Vanilla JS',
            sales_count: 67,
            rating: 5.0,
            reviews_count: 9
          }
        ],
        orders: [
          { id: 'ord_10482', order_code: 'AA-10482', user_id: 'usr_student', user_email: 'student@ahama.academy', item_type: 'course', item_id: 'crs_java_app', item_title: 'App Development with Java (Native Android)', amount: 1499, payment_method: 'bkash', trx_id: 'BK99X8741A', status: 'approved', created_at: '2026-10-07' },
          { id: 'ord_10483', order_code: 'AA-10483', user_id: 'usr_student', user_email: 'student@ahama.academy', item_type: 'template', item_id: 'tpl_nova_lms', item_title: 'Nova LMS - Ultra-Fast Course Platform Theme', amount: 799, payment_method: 'nagad', trx_id: 'NG55L2984K', status: 'approved', created_at: '2026-10-06' },
          { id: 'ord_10484', order_code: 'AA-10484', user_id: 'usr_guest', user_email: 'student@example.com', item_type: 'course', item_id: 'crs_android_lab', item_title: 'Android Project Lab: MVVM', amount: 1999, payment_method: 'rocket', trx_id: 'RK44A9901M', status: 'pending', created_at: '2026-10-08' }
        ],
        enrollments: [
          { user_id: 'usr_student', course_id: 'crs_java_app', progress_percent: 42, completed_lessons: ['cur_01', 'cur_02', 'cur_03'], certificate_id: 'AA-CERT-2026-9041' },
          { user_id: 'usr_student', course_id: 'crs_java_found', progress_percent: 100, completed_lessons: ['cur_08', 'cur_09', 'cur_10'], certificate_id: 'AA-CERT-2026-8812' }
        ],
        template_access: [
          { user_id: 'usr_student', template_id: 'tpl_nova_lms', license_key: 'AA-LIC-NOVA-8947-XK', download_count: 3 }
        ],
        reviews: [
          { id: 'rev_01', user_id: 'usr_student', target_type: 'course', target_id: 'crs_java_app', rating: 5, review_text: 'Best practical Android course in Bangla. The explanation of ConstraintLayout and RecyclerView helped me finally land my junior Android internship!', user_name: 'Tanvir Hasan', created_at: '2026-10-06' }
        ],
        discussions: [
          { id: 'disc_01', course_id: 'crs_java_app', curriculum_id: 'cur_01', author_name: 'Tanvir Hasan', author_avatar: 'TH', question: 'I got a Gradle sync issue on Windows with JDK 21. How do I point Android Studio to JDK 17?', reply_text: 'Go to Settings -> Build Tools -> Gradle -> Gradle JDK, and select Embedded JDK 17.', replied_by: 'Sahariyar Ahamad', created_at: '2026-10-06' }
        ],
        student_notes: [],
        cms_settings: {
          site_name: 'Ahama Academy',
          site_tagline: 'Learn practical skills. Build real software.',
          announcement_bar: '🎉 50% Off on all Android & Web Masterclasses! Use coupon <b>BANGLA50</b> at checkout.',
          announcement_active: '1',
          hero_headline: 'Master Code.<br><span>Build Real Things.</span>',
          hero_subtext: 'Project-based native Android, Java, and modern Full-Stack courses designed to turn you into an industry-ready engineer. Download production-ready templates & themes.',
          bkash_number: '01712-345678 (Personal / Send Money)',
          nagad_number: '01812-345678 (Merchant / Payment)',
          rocket_number: '01912-345678-9 (Personal / Send Money)',
          support_email: 'support@ahama.academy',
          currency_symbol: '৳',
          theme_primary_color: '#e11d48',
          theme_accent_color: '#6366f1',
          default_lang: 'en'
        }
      };
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } else {
      data = JSON.parse(data);
    }
    return data;
  }

  function saveLocalStore(data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }

  // Network request wrapper with transparent fallback
  async function request(endpoint, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });
      if (res.ok) {
        return await res.json();
      }
      if (res.status !== 404) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with status ${res.status}`);
      }
    } catch (e) {}

    return executeLocalFallback(endpoint, options);
  }

  // Local fallback logic
  function executeLocalFallback(endpoint, options) {
    const store = getLocalStore();
    const method = (options.method || 'GET').toUpperCase();
    const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');

    // Auth Login
    if (endpoint === '/auth/login' && method === 'POST') {
      const { email } = JSON.parse(options.body || '{}');
      const cleanEmail = (email || '').toLowerCase().trim();
      let user = store.users.find(u => u.email === cleanEmail);
      if (!user) {
        user = cleanEmail === 'admin@ahama.academy'
          ? { id: 'usr_admin', name: 'Sahariyar Ahamad', email: cleanEmail, role: 'admin', avatar: 'SA' }
          : { id: 'usr_student', name: 'Tanvir Hasan', email: cleanEmail, role: 'student', avatar: 'TH' };
      }
      const token = 'mock_jwt_' + btoa(JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { success: true, token, user };
    }

    // Auth Register
    if (endpoint === '/auth/register' && method === 'POST') {
      const { name, email } = JSON.parse(options.body || '{}');
      const cleanEmail = (email || '').toLowerCase().trim();
      const newUser = {
        id: 'usr_' + Date.now().toString(36),
        name,
        email: cleanEmail,
        role: 'student',
        avatar: name.slice(0, 2).toUpperCase()
      };
      store.users.push(newUser);
      saveLocalStore(store);
      const token = 'mock_jwt_' + btoa(JSON.stringify(newUser));
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return { success: true, token, user: newUser };
    }

    // Auth Me
    if (endpoint === '/auth/me') {
      return { authenticated: !!currentUser, user: currentUser };
    }

    // Courses List
    if (endpoint.startsWith('/courses') && !endpoint.includes('/', 9)) {
      return { courses: store.courses };
    }

    // Course Detail: /courses/:slug
    if (endpoint.startsWith('/courses/')) {
      const slug = endpoint.split('/courses/')[1];
      const course = store.courses.find(c => c.slug === slug || c.id === slug) || store.courses[0];
      const cur = store.curriculum[course.id] || store.curriculum['crs_java_app'] || [];
      const quizzes = [store.quizzes['quiz_java_app_01']];
      const reviews = store.reviews.filter(r => r.target_id === course.id);
      const isEnrolled = currentUser ? (currentUser.role === 'admin' || store.enrollments.some(e => e.user_id === currentUser.id && e.course_id === course.id)) : false;
      return { course, curriculum: cur, quizzes, reviews, isEnrolled };
    }

    // Templates List
    if (endpoint === '/templates') {
      return { templates: store.templates };
    }

    // Template Detail: /templates/:slug
    if (endpoint.startsWith('/templates/')) {
      const slug = endpoint.split('/templates/')[1];
      const template = store.templates.find(t => t.slug === slug || t.id === slug) || store.templates[0];
      const hasPurchased = currentUser ? (currentUser.role === 'admin' || template.is_free || store.template_access.some(ta => ta.user_id === currentUser.id && ta.template_id === template.id)) : template.is_free;
      return {
        template,
        versions: template.versions || [],
        hasPurchased,
        licenseKey: hasPurchased ? 'AA-LIC-NOVA-8947-XK' : null,
        downloadUrl: hasPurchased ? template.download_url : null
      };
    }

    // Quizzes Get & Post
    if (endpoint.startsWith('/quizzes/')) {
      const qId = endpoint.split('/quizzes/')[1];
      const quiz = store.quizzes[qId] || store.quizzes['quiz_java_app_01'];
      if (method === 'GET') {
        return { quiz };
      }
      return { score: 100, passed: true, message: 'Quiz passed with 100%!' };
    }

    // Discussions Q&A
    if (endpoint.startsWith('/discussions')) {
      if (method === 'POST') {
        const body = JSON.parse(options.body || '{}');
        store.discussions.unshift({
          id: 'disc_' + Date.now().toString(36),
          course_id: body.course_id,
          author_name: currentUser ? currentUser.name : 'Student',
          author_avatar: currentUser ? currentUser.avatar : 'ST',
          question: body.question,
          created_at: 'Just now'
        });
        saveLocalStore(store);
        return { success: true, message: 'Question posted!' };
      }
      return { discussions: store.discussions };
    }

    // Orders Checkout
    if (endpoint === '/orders/checkout' && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const orderCode = 'AA-' + Math.floor(10000 + Math.random() * 90000);
      const isApproved = body.payment_method === 'free' || body.amount === 0;
      const newOrder = {
        id: 'ord_' + Date.now().toString(36),
        order_code: orderCode,
        user_id: currentUser ? currentUser.id : 'usr_student',
        user_email: currentUser ? currentUser.email : 'student@ahama.academy',
        item_type: body.item_type,
        item_id: body.item_id,
        item_title: body.item_title || 'Enrolled Item',
        amount: body.amount || 0,
        payment_method: body.payment_method,
        trx_id: body.trx_id || 'DEMO-TRX',
        status: isApproved ? 'approved' : 'pending',
        created_at: new Date().toISOString().split('T')[0]
      };
      store.orders.unshift(newOrder);

      if (isApproved && currentUser) {
        if (body.item_type === 'course') {
          store.enrollments.push({
            user_id: currentUser.id,
            course_id: body.item_id,
            progress_percent: 0,
            completed_lessons: [],
            certificate_id: null
          });
        } else {
          store.template_access.push({
            user_id: currentUser.id,
            template_id: body.item_id,
            license_key: 'AA-LIC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            download_count: 0
          });
        }
      }

      saveLocalStore(store);
      return { success: true, order: newOrder, message: isApproved ? 'Enrollment activated!' : 'Order submitted for verification.' };
    }

    // Student Dashboard
    if (endpoint === '/student/dashboard') {
      const uId = currentUser ? currentUser.id : 'usr_student';
      const userEnrollments = store.enrollments.filter(e => e.user_id === uId).map(e => {
        const c = store.courses.find(crs => crs.id === e.course_id) || {};
        return {
          course_id: e.course_id,
          slug: c.slug || 'app-development-with-java',
          title: c.title || 'App Development with Java (Native Android)',
          category: c.category || 'Mobile Development',
          progress_percent: e.progress_percent,
          total_lessons: (store.curriculum[e.course_id] || []).length || 7,
          completed_count: e.completed_lessons.length,
          certificate_id: e.certificate_id
        };
      });

      const userTemplates = store.template_access.filter(ta => ta.user_id === uId).map(ta => {
        const t = store.templates.find(tpl => tpl.id === ta.template_id) || {};
        return {
          template_id: ta.template_id,
          slug: t.slug || 'nova-lms-template',
          title: t.title || 'Nova LMS - Ultra-Fast Course Platform Theme',
          category: t.category || 'Web Themes',
          current_version: t.current_version || 'v1.2.0',
          license_key: ta.license_key,
          download_url: t.download_url,
          download_count: ta.download_count
        };
      });

      const userOrders = store.orders.filter(o => o.user_id === uId || o.user_email === (currentUser ? currentUser.email : ''));

      return {
        user: currentUser,
        enrollments: userEnrollments,
        templates: userTemplates,
        orders: userOrders
      };
    }

    // Admin Overview
    if (endpoint === '/admin/overview') {
      const totalRev = store.orders.filter(o => o.status === 'approved').reduce((acc, o) => acc + (o.amount || 0), 0);
      return {
        metrics: {
          total_students: store.users.length,
          total_courses: store.courses.length,
          total_templates: store.templates.length,
          total_orders: store.orders.length,
          total_revenue: totalRev,
          pending_orders: store.orders.filter(o => o.status === 'pending').length
        },
        recent_orders: store.orders.slice(0, 10)
      };
    }

    // Admin Orders
    if (endpoint === '/admin/orders' && method === 'GET') {
      return { orders: store.orders };
    }

    if (endpoint === '/admin/orders' && method === 'POST') {
      const { order_id, action } = JSON.parse(options.body || '{}');
      const order = store.orders.find(o => o.id === order_id);
      if (order) {
        order.status = action === 'approve' ? 'approved' : 'rejected';
        if (action === 'approve') {
          if (order.item_type === 'course') {
            store.enrollments.push({
              user_id: order.user_id,
              course_id: order.item_id,
              progress_percent: 0,
              completed_lessons: [],
              certificate_id: null
            });
          } else {
            store.template_access.push({
              user_id: order.user_id,
              template_id: order.item_id,
              license_key: 'AA-LIC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
              download_count: 0
            });
          }
        }
        saveLocalStore(store);
      }
      return { success: true, message: `Order updated to ${action}d` };
    }

    // CMS Settings
    if (endpoint === '/admin/cms' && method === 'GET') {
      return { settings: store.cms_settings };
    }

    if (endpoint === '/admin/cms' && method === 'POST') {
      const newSettings = JSON.parse(options.body || '{}');
      store.cms_settings = { ...store.cms_settings, ...newSettings };
      saveLocalStore(store);
      return { success: true, message: 'Settings saved successfully' };
    }

    return { success: true };
  }

  // Public Interface
  window.AhamaAPI = {
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    googleLogin: (credential) => request('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.reload();
    },
    getUser: () => JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
    isAdmin: () => {
      const u = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      return u && u.role === 'admin';
    },

    getCourses: (params = '') => request(`/courses${params ? '?' + params : ''}`),
    getCourse: (slug) => request(`/courses/${slug}`),
    getTemplates: (params = '') => request(`/templates${params ? '?' + params : ''}`),
    getTemplate: (slug) => request(`/templates/${slug}`),

    checkout: (orderData) => request('/orders/checkout', { method: 'POST', body: JSON.stringify(orderData) }),

    getStudentDashboard: () => request('/student/dashboard'),
    updateLessonProgress: (courseId, lessonId) => {
      const store = getLocalStore();
      const u = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      if (u) {
        let enr = store.enrollments.find(e => e.user_id === u.id && e.course_id === courseId);
        if (!enr) {
          enr = { user_id: u.id, course_id: courseId, progress_percent: 0, completed_lessons: [] };
          store.enrollments.push(enr);
        }
        if (!enr.completed_lessons.includes(lessonId)) {
          enr.completed_lessons.push(lessonId);
        }
        const total = (store.curriculum[courseId] || []).length || 1;
        enr.progress_percent = Math.min(100, Math.round((enr.completed_lessons.length / total) * 100));
        if (enr.progress_percent >= 100 && !enr.certificate_id) {
          enr.certificate_id = 'AA-CERT-2026-' + Math.floor(1000 + Math.random() * 9000);
        }
        saveLocalStore(store);
      }
      return { success: true };
    },

    getQuiz: (id) => request(`/quizzes/${id}`),
    submitQuiz: (id, answers) => request(`/quizzes/${id}`, { method: 'POST', body: JSON.stringify({ answers }) }),

    getDiscussions: (courseId) => request(`/discussions?course_id=${encodeURIComponent(courseId)}`),
    postDiscussion: (data) => request('/discussions', { method: 'POST', body: JSON.stringify(data) }),

    getReviews: (type, targetId) => request(`/reviews?type=${type}&target_id=${encodeURIComponent(targetId)}`),
    postReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),

    getAdminOverview: () => request('/admin/overview'),
    getAdminOrders: () => request('/admin/orders'),
    updateOrder: (order_id, action) => request('/admin/orders', { method: 'POST', body: JSON.stringify({ order_id, action }) }),
    saveCourse: (data) => request('/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
    saveTemplate: (data) => request('/admin/templates', { method: 'POST', body: JSON.stringify(data) }),
    getCmsSettings: () => request('/admin/cms'),
    saveCmsSettings: (settings) => request('/admin/cms', { method: 'POST', body: JSON.stringify(settings) })
  };
})();
