// ==========================================================
// Ahama Academy - Universal API Client & Storage Engine
// Seamlessly connects to Cloudflare Pages Functions (/api/...)
// Auto-fails over to LocalStorage Mock Edge if running standalone
// ==========================================================

(function() {
  const API_BASE = '/api';
  const TOKEN_KEY = 'ahama_auth_token';
  const USER_KEY = 'ahama_auth_user';
  const STORE_KEY = 'ahama_local_d1_store';

  // Seed default dataset for offline/standalone operation
  function getLocalStore() {
    let data = localStorage.getItem(STORE_KEY);
    if (!data) {
      data = {
        users: [
          { id: 'usr_admin', name: 'Ahama Administrator', email: 'admin@ahama.academy', role: 'admin', avatar: 'AA' },
          { id: 'usr_student', name: 'Sahariyar Ahamad', email: 'student@ahama.academy', role: 'student', avatar: 'SA' }
        ],
        courses: [
          {
            id: 'crs_java_app',
            slug: 'app-development-with-java',
            title: 'App Development with Java (Native Android)',
            description: 'Master Android app development using Java & XML. Build 5 production-ready mobile apps from scratch.',
            category: 'Mobile Development',
            level: 'Beginner → Intermediate',
            price: 1499,
            is_free: 0,
            badge: 'Bestseller',
            instructor: 'Sahariyar Ahamad',
            lessons_count: 7
          },
          {
            id: 'crs_java_found',
            slug: 'java-foundation',
            title: 'Java Foundation & OOP Mastery',
            description: 'Build a rock-solid core Java programming foundation before stepping into Android and enterprise frameworks.',
            category: 'Programming',
            level: 'Beginner',
            price: 0,
            is_free: 1,
            badge: 'Free Starter',
            instructor: 'Ahama Academy',
            lessons_count: 3
          },
          {
            id: 'crs_android_lab',
            slug: 'android-project-lab',
            title: 'Android Project Lab & Advanced Architecture',
            description: 'Build scalable Android applications with MVVM, Retrofit, Room Database, and clean code principles.',
            category: 'Mobile Development',
            level: 'Intermediate',
            price: 1999,
            is_free: 0,
            badge: 'Hot & New',
            instructor: 'Sahariyar Ahamad',
            lessons_count: 6
          },
          {
            id: 'crs_fullstack_edge',
            slug: 'fullstack-web-edge',
            title: 'Full-Stack Edge Web Development',
            description: 'Create blazing fast web apps on Cloudflare Pages, Workers, and D1 with pure Vanilla JS and zero frameworks.',
            category: 'Web Development',
            level: 'All Levels',
            price: 1299,
            is_free: 0,
            badge: 'Trending',
            instructor: 'Ahama Web Team',
            lessons_count: 5
          }
        ],
        curriculum: {
          'crs_java_app': [
            { id: 'cur_01', module_title: 'Module 1: Android Studio & Setup', lesson_title: '1.1 Installing Android Studio & SDK Configuration', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '14m', is_preview: 1 },
            { id: 'cur_02', module_title: 'Module 1: Android Studio & Setup', lesson_title: '1.2 Understanding Project Structure, Gradle & Manifest', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '18m', is_preview: 1 },
            { id: 'cur_03', module_title: 'Module 2: Layouts & UI Design', lesson_title: '2.1 ConstraintLayout, LinearLayout & XML Attributes', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '25m', is_preview: 0 },
            { id: 'cur_04', module_title: 'Module 2: Layouts & UI Design', lesson_title: '2.2 Responsive UI for Multi-Screen Android Devices', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '22m', is_preview: 0 },
            { id: 'cur_05', module_title: 'Module 3: Java Logic & Activities', lesson_title: '3.1 Activity Lifecycle, Intent & Screen Navigation', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '30m', is_preview: 0 },
            { id: 'cur_06', module_title: 'Module 3: Java Logic & Activities', lesson_title: '3.2 RecyclerView, Custom Adapters & ViewHolders', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '35m', is_preview: 0 },
            { id: 'cur_07', module_title: 'Module 4: Real World Project', lesson_title: '4.1 Building a Complete Task Manager App', video_url: 'https://www.youtube.com/embed/fis26HvvDII', duration: '42m', is_preview: 0 }
          ],
          'crs_java_found': [
            { id: 'cur_08', module_title: 'Module 1: Java Basics', lesson_title: '1.1 Variables, Data Types & Conditionals', video_url: 'https://www.youtube.com/embed/eIrMbAQSU34', duration: '15m', is_preview: 1 },
            { id: 'cur_09', module_title: 'Module 1: Java Basics', lesson_title: '1.2 Loops, Arrays & String Manipulations', video_url: 'https://www.youtube.com/embed/eIrMbAQSU34', duration: '20m', is_preview: 1 },
            { id: 'cur_10', module_title: 'Module 2: Object-Oriented Programming', lesson_title: '2.1 Classes, Objects, Inheritance & Polymorphism', video_url: 'https://www.youtube.com/embed/eIrMbAQSU34', duration: '28m', is_preview: 1 }
          ]
        },
        templates: [
          {
            id: 'tpl_nova_lms',
            slug: 'nova-lms-template',
            title: 'Nova LMS - Modern Course Academy Theme',
            description: 'A lightweight, ultra-responsive HTML5 & Vanilla CSS course platform template. Zero external framework dependencies, 100/100 Lighthouse score.',
            category: 'Web Themes',
            price: 799,
            is_free: 0,
            live_preview_url: 'https://ahama-academy.pages.dev',
            download_url: 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip',
            tags: 'HTML5, CSS3, Vanilla JS, Dark Mode',
            sales_count: 142
          },
          {
            id: 'tpl_finpay_app',
            slug: 'finpay-android-kit',
            title: 'FinPay - Fintech & Wallet App UI Kit',
            description: 'Production-ready Android native XML + Java templates for modern e-wallets, bKash-style payments, and transaction history screens.',
            category: 'Android Apps',
            price: 1199,
            is_free: 0,
            live_preview_url: '#demo-finpay',
            download_url: 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip',
            tags: 'Android Java, XML, Material Design',
            sales_count: 89
          },
          {
            id: 'tpl_dev_portfolio',
            slug: 'portfolio-pro-minimal',
            title: 'PortfolioPro - Minimalist Developer Portfolio',
            description: 'Sleek dark-mode portfolio theme for software engineers and creators. Includes project showcases, skills cards, and resume export.',
            category: 'Web Themes',
            price: 0,
            is_free: 1,
            live_preview_url: '#demo-portfolio',
            download_url: 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip',
            tags: 'HTML, CSS, Free, Mobile-First',
            sales_count: 310
          },
          {
            id: 'tpl_aura_store',
            slug: 'aura-ecommerce-edge',
            title: 'Aura - Serverless Cloudflare Storefront',
            description: 'Fast e-commerce theme pre-configured for Cloudflare Pages & D1 database. Product catalog, cart modal, and checkout flows.',
            category: 'Full-Stack',
            price: 1499,
            is_free: 0,
            live_preview_url: '#demo-aura',
            download_url: 'https://github.com/sahariyar/templates/archive/refs/heads/main.zip',
            tags: 'Cloudflare Pages, D1, Vanilla JS',
            sales_count: 67
          }
        ],
        orders: [
          { id: 'ord_10482', order_code: 'AA-10482', user_id: 'usr_student', user_email: 'student@ahama.academy', item_type: 'course', item_id: 'crs_java_app', item_title: 'App Development with Java', amount: 1499, payment_method: 'bkash', trx_id: 'BK99X8741A', status: 'approved', created_at: '2026-10-07' },
          { id: 'ord_10483', order_code: 'AA-10483', user_id: 'usr_student', user_email: 'student@ahama.academy', item_type: 'template', item_id: 'tpl_nova_lms', item_title: 'Nova LMS - Modern Course Academy Theme', amount: 799, payment_method: 'nagad', trx_id: 'NG55L2984K', status: 'approved', created_at: '2026-10-06' },
          { id: 'ord_10484', order_code: 'AA-10484', user_id: 'usr_guest', user_email: 'arif@example.com', item_type: 'course', item_id: 'crs_android_lab', item_title: 'Android Project Lab', amount: 1999, payment_method: 'bkash', trx_id: 'BK34A9901M', status: 'pending', created_at: '2026-10-08' }
        ],
        enrollments: [
          { user_id: 'usr_student', course_id: 'crs_java_app', progress_percent: 42, completed_lessons: ['cur_01', 'cur_02', 'cur_03'], certificate_id: 'AA-CERT-2026-9041' },
          { user_id: 'usr_student', course_id: 'crs_java_found', progress_percent: 100, completed_lessons: ['cur_08', 'cur_09', 'cur_10'], certificate_id: 'AA-CERT-2026-8812' }
        ],
        template_access: [
          { user_id: 'usr_student', template_id: 'tpl_nova_lms', license_key: 'AA-LIC-NOVA-8947-XK', download_count: 3 }
        ],
        cms_settings: {
          site_name: 'Ahama Academy',
          site_tagline: 'Learn practical skills & build real software.',
          announcement_bar: '🎉 50% Off on all Android & Web Masterclasses! Use coupon BANGLA50 at checkout.',
          announcement_active: '1',
          hero_headline: 'Master Code.<br><span>Build Real Things.</span>',
          hero_subtext: 'Project-based native Android, Java, and modern Full-Stack courses designed to turn you into an industry-ready engineer.',
          bkash_number: '01712-345678 (Personal / Send Money)',
          nagad_number: '01812-345678 (Merchant / Payment)',
          support_email: 'support@ahama.academy',
          currency_symbol: '৳'
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

  // Network request wrapper with fallback
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
      // If endpoint doesn't exist on server (404), fall through to local fallback
      if (res.status !== 404) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with status ${res.status}`);
      }
    } catch (e) {
      // If fetch fails (offline, local file://, or Functions not running)
    }

    // Execute fallback mock logic
    return executeLocalFallback(endpoint, options);
  }

  // Local fallback logic
  function executeLocalFallback(endpoint, options) {
    const store = getLocalStore();
    const method = (options.method || 'GET').toUpperCase();
    const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');

    // Auth Login
    if (endpoint === '/auth/login' && method === 'POST') {
      const { email, password } = JSON.parse(options.body || '{}');
      const cleanEmail = (email || '').toLowerCase().trim();
      let user = store.users.find(u => u.email === cleanEmail);
      if (!user) {
        if (cleanEmail === 'admin@ahama.academy') {
          user = { id: 'usr_admin', name: 'Ahama Administrator', email: cleanEmail, role: 'admin', avatar: 'AA' };
        } else {
          user = { id: 'usr_student', name: 'Sahariyar Ahamad', email: cleanEmail, role: 'student', avatar: 'SA' };
        }
      }
      const token = 'mock_jwt_' + btoa(JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { success: true, token, user };
    }

    // Auth Register
    if (endpoint === '/auth/register' && method === 'POST') {
      const { name, email, password } = JSON.parse(options.body || '{}');
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
      const isEnrolled = currentUser ? (currentUser.role === 'admin' || store.enrollments.some(e => e.user_id === currentUser.id && e.course_id === course.id)) : false;
      return { course, curriculum: cur, isEnrolled };
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
        hasPurchased,
        licenseKey: hasPurchased ? 'AA-LIC-NOVA-8947-XK' : null,
        downloadUrl: hasPurchased ? template.download_url : null
      };
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
          title: c.title || 'App Development with Java',
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
          title: t.title || 'Nova LMS Theme',
          category: t.category || 'Web Themes',
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

    // Storage Router
    if (endpoint.startsWith('/storage/router')) {
      return {
        providers: [
          { id: 'youtube', name: 'YouTube Protected Embeds', free_tier: 'Unlimited Storage & Streaming', status: 'active' },
          { id: 'github_releases', name: 'GitHub Releases CDN', free_tier: '2GB per release, Fast CDN', status: 'active' },
          { id: 'supabase', name: 'Supabase Free Tier', free_tier: '1GB Storage, 2GB Bandwidth', status: 'active' },
          { id: 'cloudinary', name: 'Cloudinary Free Media Tier', free_tier: '25GB Monthly Bandwidth', status: 'active' }
        ]
      };
    }

    return { success: true };
  }

  // Public Ahama API Interface
  window.AhamaAPI = {
    // Auth
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
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

    // Public catalog
    getCourses: (params = '') => request(`/courses${params ? '?' + params : ''}`),
    getCourse: (slug) => request(`/courses/${slug}`),
    getTemplates: (params = '') => request(`/templates${params ? '?' + params : ''}`),
    getTemplate: (slug) => request(`/templates/${slug}`),

    // Checkout
    checkout: (orderData) => request('/orders/checkout', { method: 'POST', body: JSON.stringify(orderData) }),

    // Student
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

    // Admin
    getAdminOverview: () => request('/admin/overview'),
    getAdminOrders: () => request('/admin/orders'),
    updateOrder: (order_id, action) => request('/admin/orders', { method: 'POST', body: JSON.stringify({ order_id, action }) }),
    saveCourse: (data) => request('/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
    saveTemplate: (data) => request('/admin/templates', { method: 'POST', body: JSON.stringify(data) }),
    getCmsSettings: () => request('/admin/cms'),
    saveCmsSettings: (settings) => request('/admin/cms', { method: 'POST', body: JSON.stringify(settings) }),
    getStorageProviders: () => request('/storage/router')
  };
})();
