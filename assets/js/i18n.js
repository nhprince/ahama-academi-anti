// ==========================================================
// Ahama Academy - High Performance English & Bengali (বাংলা) i18n Engine
// Instant bilingual UI switching with zero external dependencies
// ==========================================================

(function() {
  const LANG_KEY = 'ahama_lang';

  const DICTIONARY = {
    en: {
      nav_home: 'Home',
      nav_courses: 'Courses',
      nav_templates: 'Templates & Themes',
      nav_docs: 'Docs',
      nav_about: 'About',
      nav_signin: 'Sign In',
      nav_explore: 'Explore',
      nav_dashboard: 'My Dashboard',
      nav_admin: 'Admin Center',
      
      hero_badge: 'DIGITAL EDUCATION & TEMPLATES',
      hero_title_1: 'Master Code.',
      hero_title_2: 'Build Real Things.',
      hero_subtext: 'Project-based native Android, Java, and modern Full-Stack courses designed to turn you into an industry-ready engineer. Download production-ready templates & themes.',
      hero_btn_courses: 'Browse Courses',
      hero_btn_templates: 'Shop Templates',
      trust_1: '✓ Project-based Curriculum',
      trust_2: '✓ bKash & Nagad Accepted',
      trust_3: '✓ Verifiable Certificates',
      
      courses_heading: 'Featured Masterclasses',
      courses_subheading: 'Practical, zero-fluff courses designed to build your engineering portfolio.',
      courses_view_all: 'View All Courses →',
      
      templates_heading: 'Website Themes & App UI Kits',
      templates_subheading: 'Production-ready source codes, clean architecture, and instant downloads.',
      templates_view_all: 'View All Templates →',
      
      btn_enroll: 'Enroll Now',
      btn_enroll_free: 'Enroll Free',
      btn_download: 'Download',
      btn_preview: 'Live Preview',
      btn_view_details: 'View Details →',
      
      footer_desc: 'Practical courses and premium digital templates for developers and creators.',
      footer_copyright: '© 2026 Ahama Academy. Powered by Cloudflare Edge Architecture.'
    },
    bn: {
      nav_home: 'হোম',
      nav_courses: 'কোর্সসমূহ',
      nav_templates: 'থিম ও টেমপ্লেট',
      nav_docs: 'ডকুমেন্টেশন',
      nav_about: 'সম্পর্কে',
      nav_signin: 'লগইন করুন',
      nav_explore: 'শুরু করুন',
      nav_dashboard: 'আমার ড্যাশবোর্ড',
      nav_admin: 'অ্যাডমিন প্যানেল',
      
      hero_badge: 'ব্যবহারিক শিক্ষা ও ডিজিটাল টেমপ্লেট',
      hero_title_1: 'কোড শিখুন।',
      hero_title_2: 'বাস্তব সফটওয়্যার তৈরি করুন।',
      hero_subtext: 'প্রজেক্ট-ভিত্তিক নেটিভ অ্যান্ড্রয়েড, জাভা এবং আধুনিক ফুল-স্ট্যাক কোর্স যা আপনাকে একজন দক্ষ সফটওয়্যার ইঞ্জিনিয়ার হিসেবে প্রস্তুত করে। ডাউনলোড করুন প্রোডাকশন-রেডি টেমপ্লেট ও কোড।',
      hero_btn_courses: 'কোর্সগুলো দেখুন',
      hero_btn_templates: 'টেমপ্লেট স্টোর',
      trust_1: '✓ প্রজেক্ট-ভিত্তিক কারিকুলাম',
      trust_2: '✓ বিকাশ ও নগদ পেমেন্ট গ্রহণযোগ্য',
      trust_3: '✓ ভেরিফাইড সার্টিফিকেট',
      
      courses_heading: 'জনপ্রিয় মাস্টারক্লাস',
      courses_subheading: 'বাস্তবধর্মী, গভীর এবং প্রজেক্ট-কেন্দ্রিক কোর্স যা আপনার ক্যারিয়ারকে এগিয়ে নেবে।',
      courses_view_all: 'সকল কোর্স দেখুন →',
      
      templates_heading: 'ওয়েবসাইট থিম ও অ্যাপ UI কিট',
      templates_subheading: 'প্রোডাকশন-রেডি সোর্স কোড, ক্লিন আর্কিটেকচার এবং ইন্সট্যান্ট ডাউনলোড সুবিধা।',
      templates_view_all: 'সকল টেমপ্লেট দেখুন →',
      
      btn_enroll: 'ভর্তি হন',
      btn_enroll_free: 'ফ্রি কোর্স শুরু করুন',
      btn_download: 'ডাউনলোড',
      btn_preview: 'লাইভ ডেমো',
      btn_view_details: 'বিস্তারিত দেখুন →',
      
      footer_desc: 'ডেভেলপার ও নির্মাতাদের জন্য ব্যবহারিক অনলাইন কোর্স এবং প্রিমিয়াম ডিজিটাল টেমপ্লেট।',
      footer_copyright: '© ২০২৬ আহামা একাডেমি। ক্লাউডফ্লেয়ার এজ আর্কিটেকচারে পরিচালিত।'
    }
  };

  let currentLang = localStorage.getItem(LANG_KEY) || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;

    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
      langBtn.textContent = lang === 'bn' ? '🌐 বাং' : '🌐 EN';
      langBtn.title = lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন';
    }

    const dict = DICTIONARY[lang] || DICTIONARY.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.innerHTML = dict[key];
        }
      }
    });
  }

  window.toggleLanguage = function() {
    const next = currentLang === 'en' ? 'bn' : 'en';
    applyLanguage(next);
  };

  window.getTranslation = function(key) {
    const dict = DICTIONARY[currentLang] || DICTIONARY.en;
    return dict[key] || key;
  };

  window.getCurrentLang = function() {
    return currentLang;
  };

  document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
  });
})();
