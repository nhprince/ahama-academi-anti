// ==========================================================
// Ahama Academy - Global Site Controller & UI Engine (V2)
// Handles bilingual switching, themes, auth state & bKash/Nagad checkout
// ==========================================================

(function() {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const menuBtn = document.getElementById('menuBtn');
  const langBtn = document.getElementById('langToggleBtn');

  // Theme Manager
  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '🌙 Dark' : theme === 'light' ? '☀️ Light' : '💻 System';
    }
  }

  const savedTheme = localStorage.getItem('ahama-theme') || 'system';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.dataset.theme;
      const next = current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
      localStorage.setItem('ahama-theme', next);
      applyTheme(next);
    });
  }

  // Mobile Menu
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
    });
  }

  // Global Toast
  window.showToast = function(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  };

  // Sync Header User Profile
  function syncHeaderAuth() {
    const user = window.AhamaAPI ? window.AhamaAPI.getUser() : null;
    const authContainer = document.getElementById('headerAuth');
    if (!authContainer) return;

    const isSubdir = window.location.pathname.includes('/courses/') || 
                     window.location.pathname.includes('/student/') || 
                     window.location.pathname.includes('/admin/') || 
                     window.location.pathname.includes('/templates/') || 
                     window.location.pathname.includes('/classroom/') || 
                     window.location.pathname.includes('/about/') || 
                     window.location.pathname.includes('/docs/') ||
                     window.location.pathname.includes('/login/');
    const basePrefix = isSubdir ? '../' : './';

    if (user) {
      const dest = user.role === 'admin' ? `${basePrefix}admin/` : `${basePrefix}student/`;
      authContainer.innerHTML = `
        <a class="btn btn-secondary btn-sm" href="${dest}">
          <span class="avatar" style="width:24px;height:24px;font-size:10px;">${user.avatar || 'ME'}</span>
          <span>${user.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
        </a>
        <button class="btn btn-secondary btn-sm" onclick="window.AhamaAPI.logout()" title="Logout" style="padding:6px 10px;">✕</button>
      `;
    } else {
      authContainer.innerHTML = `
        <a class="btn btn-secondary btn-sm" href="${basePrefix}login/">Sign In</a>
        <a class="btn btn-primary btn-sm" href="${basePrefix}courses/">Explore</a>
      `;
    }
  }

  // Load CMS Dynamic Settings
  async function loadCmsSettings() {
    if (!window.AhamaAPI) return;
    try {
      const res = await window.AhamaAPI.getCmsSettings();
      const settings = res.settings;
      if (settings) {
        // Theme Colors
        if (settings.theme_primary_color) {
          root.style.setProperty('--primary', settings.theme_primary_color);
        }
        if (settings.theme_accent_color) {
          root.style.setProperty('--accent', settings.theme_accent_color);
        }

        // Announcement Marquee
        const bar = document.getElementById('announcementBar');
        if (bar && settings.announcement_active === '1') {
          bar.style.display = 'flex';
          const textEl = bar.querySelector('.announcement-text');
          if (textEl) textEl.innerHTML = settings.announcement_bar;
        }

        // Dynamic Hero
        const heroTitle = document.getElementById('heroHeadline');
        if (heroTitle && settings.hero_headline) {
          heroTitle.innerHTML = settings.hero_headline;
        }
        const heroSub = document.getElementById('heroSubtext');
        if (heroSub && settings.hero_subtext) {
          heroSub.textContent = settings.hero_subtext;
        }
      }
    } catch (e) {}
  }

  // Checkout Modal
  window.openCheckoutModal = function(item) {
    const user = window.AhamaAPI ? window.AhamaAPI.getUser() : null;
    const isSubdir = window.location.pathname.includes('/courses/') || 
                     window.location.pathname.includes('/templates/') || 
                     window.location.pathname.includes('/student/') || 
                     window.location.pathname.includes('/admin/');
    const basePrefix = isSubdir ? '../' : './';

    if (!user) {
      window.showToast('Please sign in to enroll or purchase.', 'info');
      setTimeout(() => {
        window.location.href = `${basePrefix}login/?redirect=${encodeURIComponent(window.location.href)}`;
      }, 900);
      return;
    }

    let modal = document.getElementById('checkoutModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'checkoutModal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-dialog">
          <button class="modal-close" onclick="closeCheckoutModal()">✕</button>
          <div class="eyebrow" id="modalItemType">CHECKOUT</div>
          <h2 id="modalItemTitle" style="margin-bottom:6px; font-size:22px;"></h2>
          <div style="font-size:26px; font-weight:800; font-family:'Outfit',sans-serif; margin-bottom:16px;" id="modalItemPrice"></div>
          
          <div id="paymentOptions">
            <p style="font-size:13px; color:var(--text-muted); margin-bottom:8px;">Select Payment Method:</p>
            <div class="payment-selector">
              <div class="payment-btn bkash active" onclick="selectPayMethod('bkash')">bKash</div>
              <div class="payment-btn nagad" onclick="selectPayMethod('nagad')">Nagad</div>
              <div class="payment-btn rocket" onclick="selectPayMethod('rocket')">Rocket</div>
            </div>

            <div id="trxInstructions" style="background:var(--soft); border-radius:var(--radius-sm); padding:14px; font-size:13px; margin-bottom:16px; border:1px solid var(--border);">
              <p style="margin:0 0 6px;"><b>Step 1:</b> Send <b><span id="instructionAmount"></span></b> via <span id="instructionMethodName">bKash</span> to:</p>
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--surface); padding:8px 12px; border-radius:6px; border:1px solid var(--border); margin-bottom:8px;">
                <code style="font-size:13px; font-weight:bold;" id="instructionNumber">01712-345678</code>
                <button class="btn btn-secondary btn-sm" style="padding:3px 8px; font-size:11px;" onclick="copyPayNumber()">Copy</button>
              </div>
              <p style="margin:0; font-size:12px; color:var(--text-muted);"><b>Step 2:</b> Enter the Transaction ID (TrxID) below to submit for instant activation.</p>
            </div>

            <div class="form-group">
              <label class="form-label">Payment Transaction ID (TrxID) *</label>
              <input type="text" id="orderTrxId" class="form-input" placeholder="e.g. BK98X7102A">
            </div>

            <div class="form-group">
              <label class="form-label">Your Sender Phone Number</label>
              <input type="tel" id="orderSenderPhone" class="form-input" placeholder="017XXXXXXXX">
            </div>

            <div class="form-group">
              <label class="form-label">Coupon Code (Optional)</label>
              <div style="display:flex; gap:8px;">
                <input type="text" id="orderCoupon" class="form-input" placeholder="e.g. WELCOME20, BANGLA50, FREEPASS">
                <button class="btn btn-secondary btn-sm" onclick="applyCheckoutCoupon()">Apply</button>
              </div>
              <small id="couponFeedback" style="display:block; margin-top:4px; font-size:12px;"></small>
            </div>
          </div>

          <div id="freeEnrollBox" style="display:none; background:rgba(16,185,129,0.1); padding:14px; border-radius:var(--radius-sm); margin-bottom:16px;">
            <p style="margin:0; color:var(--success); font-weight:600; font-size:14px;">✓ Free Item / 100% Promo Pass Applied! Instant access will be granted.</p>
          </div>

          <button id="submitOrderBtn" class="btn btn-primary btn-full" onclick="submitOrder()">Submit Order</button>
        </div>
      `;
      document.body.appendChild(modal);
    }

    window.currentCheckoutItem = item;
    window.selectedPaymentMethod = 'bkash';
    window.checkoutDiscount = 0;

    document.getElementById('modalItemType').textContent = (item.type || 'course').toUpperCase();
    document.getElementById('modalItemTitle').textContent = item.title;
    
    updateModalPriceView();
    modal.classList.add('open');
  };

  window.closeCheckoutModal = function() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('open');
  };

  window.selectPayMethod = function(method) {
    window.selectedPaymentMethod = method;
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    const clicked = document.querySelector(`.payment-btn.${method}`);
    if (clicked) clicked.classList.add('active');

    const numEl = document.getElementById('instructionNumber');
    const methodEl = document.getElementById('instructionMethodName');
    if (methodEl) methodEl.textContent = method.toUpperCase();

    if (numEl) {
      numEl.textContent = method === 'bkash' ? '01712-345678' : method === 'nagad' ? '01812-345678' : '01912-345678-9';
    }
  };

  window.copyPayNumber = function() {
    const num = document.getElementById('instructionNumber')?.textContent;
    if (num) {
      navigator.clipboard.writeText(num);
      window.showToast('Number copied to clipboard! 📋', 'success');
    }
  };

  function updateModalPriceView() {
    const item = window.currentCheckoutItem;
    const base = item.is_free ? 0 : item.price;
    const discounted = Math.max(0, Math.round(base * (1 - window.checkoutDiscount)));
    
    const priceEl = document.getElementById('modalItemPrice');
    const instAmt = document.getElementById('instructionAmount');
    const payOptions = document.getElementById('paymentOptions');
    const freeBox = document.getElementById('freeEnrollBox');
    const btn = document.getElementById('submitOrderBtn');

    if (discounted === 0 || item.is_free) {
      priceEl.innerHTML = `<span style="color:var(--success);">FREE</span>`;
      if (payOptions) payOptions.style.display = 'none';
      if (freeBox) freeBox.style.display = 'block';
      if (btn) btn.textContent = 'Claim Instant Free Access';
    } else {
      priceEl.innerHTML = `৳ ${discounted.toLocaleString()}`;
      if (instAmt) instAmt.textContent = `৳ ${discounted.toLocaleString()}`;
      if (payOptions) payOptions.style.display = 'block';
      if (freeBox) freeBox.style.display = 'none';
      if (btn) btn.textContent = 'Submit Order for Verification';
    }
  }

  window.applyCheckoutCoupon = function() {
    const code = (document.getElementById('orderCoupon')?.value || '').trim().toUpperCase();
    const fb = document.getElementById('couponFeedback');
    if (!code) return;

    if (code === 'FREEPASS' || code === 'AHAMA100') {
      window.checkoutDiscount = 1.0;
      if (fb) { fb.style.color = 'var(--success)'; fb.textContent = '100% Free Pass Applied!'; }
    } else if (code === 'WELCOME20') {
      window.checkoutDiscount = 0.2;
      if (fb) { fb.style.color = 'var(--success)'; fb.textContent = '20% Discount Applied!'; }
    } else if (code === 'BANGLA50') {
      window.checkoutDiscount = 0.5;
      if (fb) { fb.style.color = 'var(--success)'; fb.textContent = '50% Discount Applied!'; }
    } else {
      window.checkoutDiscount = 0;
      if (fb) { fb.style.color = 'var(--danger)'; fb.textContent = 'Invalid or expired coupon code.'; }
    }
    updateModalPriceView();
  };

  window.submitOrder = async function() {
    const item = window.currentCheckoutItem;
    const trxId = document.getElementById('orderTrxId')?.value.trim();
    const phone = document.getElementById('orderSenderPhone')?.value.trim();
    const coupon = document.getElementById('orderCoupon')?.value.trim();
    const isFree = item.is_free || window.checkoutDiscount === 1.0;

    if (!isFree && !trxId) {
      window.showToast('Please enter your payment Transaction ID (TrxID)', 'error');
      return;
    }

    try {
      const btn = document.getElementById('submitOrderBtn');
      if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

      const res = await window.AhamaAPI.checkout({
        item_type: item.type,
        item_id: item.id,
        item_title: item.title,
        amount: isFree ? 0 : item.price,
        payment_method: isFree ? 'free' : window.selectedPaymentMethod,
        trx_id: trxId,
        sender_phone: phone,
        coupon_code: coupon
      });

      closeCheckoutModal();
      window.showToast(res.message || 'Order submitted successfully!', 'success');

      const isSubdir = window.location.pathname.includes('/courses/') || 
                       window.location.pathname.includes('/templates/');
      const basePrefix = isSubdir ? '../' : './';
      setTimeout(() => {
        if (item.type === 'course' && isFree) {
          window.location.href = `${basePrefix}classroom/?course=${item.slug || item.id}`;
        } else {
          window.location.href = `${basePrefix}student/`;
        }
      }, 1200);
    } catch (err) {
      window.showToast(err.message || 'Checkout failed', 'error');
      const btn = document.getElementById('submitOrderBtn');
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Order'; }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    syncHeaderAuth();
    loadCmsSettings();
  });
})();
