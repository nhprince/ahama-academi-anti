// ==========================================================
// Ahama Academy - Global Site Controller & UI Engine
// ==========================================================

(function() {
  // Theme Manager
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const menuBtn = document.getElementById('menuBtn');

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

  // Mobile menu toggle
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
    });
  }

  // Global Toast Function
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

  // Sync Header User Profile & Nav Links
  function syncHeaderAuth() {
    const user = window.AhamaAPI ? window.AhamaAPI.getUser() : null;
    const authContainer = document.getElementById('headerAuth');
    if (!authContainer) return;

    // Detect base depth for relative links
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
          <span>${user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}</span>
        </a>
        <button class="btn btn-secondary btn-sm" onclick="window.AhamaAPI.logout()" title="Logout">✕</button>
      `;
    } else {
      authContainer.innerHTML = `
        <a class="btn btn-secondary btn-sm" href="${basePrefix}login/">Sign In</a>
        <a class="btn btn-primary btn-sm" href="${basePrefix}courses/">Explore</a>
      `;
    }
  }

  // Load Announcement Bar & CMS settings
  async function loadCmsSettings() {
    if (!window.AhamaAPI) return;
    try {
      const res = await window.AhamaAPI.getCmsSettings();
      const settings = res.settings;
      if (settings) {
        const bar = document.getElementById('announcementBar');
        if (bar && settings.announcement_active === '1') {
          bar.style.display = 'flex';
          const textEl = bar.querySelector('.announcement-text');
          if (textEl) textEl.innerHTML = settings.announcement_bar;
        }

        // Apply dynamic hero headline/subtext if on homepage
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

  // Global Checkout Modal Controller
  window.openCheckoutModal = function(item) {
    // item: { type: 'course'|'template', id, title, price, is_free }
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
      }, 1000);
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
          <h2 id="modalItemTitle" style="margin-bottom:8px;"></h2>
          <div style="font-size:24px;font-weight:800;margin-bottom:16px;" id="modalItemPrice"></div>
          
          <div id="paymentOptions">
            <p style="font-size:13px;color:var(--muted);margin-bottom:8px;">Select Payment Method:</p>
            <div class="payment-selector">
              <div class="payment-btn bkash active" onclick="selectPayMethod('bkash')">bKash</div>
              <div class="payment-btn nagad" onclick="selectPayMethod('nagad')">Nagad</div>
              <div class="payment-btn" onclick="selectPayMethod('card')">Card / Other</div>
            </div>

            <div id="trxInstructions" style="background:var(--soft);border-radius:var(--radius-md);padding:14px;font-size:13px;margin-bottom:16px;">
              <p style="margin:0 0 6px;"><b>Step 1:</b> Send <b><span id="instructionAmount"></span></b> via bKash to:</p>
              <div style="font-family:monospace;background:var(--surface);padding:6px 10px;border-radius:6px;border:1px solid var(--border);font-weight:bold;margin-bottom:8px;" id="instructionNumber">
                01712-345678 (Personal)
              </div>
              <p style="margin:0;"><b>Step 2:</b> Enter the Transaction ID (TrxID) below to activate your purchase.</p>
            </div>

            <div class="form-group">
              <label class="form-label">bKash / Nagad Transaction ID (TrxID)</label>
              <input type="text" id="orderTrxId" class="form-input" placeholder="e.g. BK98X7102A">
            </div>

            <div class="form-group">
              <label class="form-label">Your Sender Phone Number</label>
              <input type="tel" id="orderSenderPhone" class="form-input" placeholder="017XXXXXXXX">
            </div>

            <div class="form-group">
              <label class="form-label">Coupon Code (Optional)</label>
              <div style="display:flex;gap:8px;">
                <input type="text" id="orderCoupon" class="form-input" placeholder="e.g. WELCOME20, FREEPASS">
                <button class="btn btn-secondary btn-sm" onclick="applyCheckoutCoupon()">Apply</button>
              </div>
              <small id="couponFeedback" style="display:block;margin-top:4px;font-size:12px;"></small>
            </div>
          </div>

          <div id="freeEnrollBox" style="display:none;background:rgba(16,185,129,0.1);padding:14px;border-radius:var(--radius-md);margin-bottom:16px;">
            <p style="margin:0;color:var(--success);font-weight:600;font-size:14px;">✓ Free Item / 100% Promo Pass Applied! Instant access will be granted.</p>
          </div>

          <button id="submitOrderBtn" class="btn btn-primary btn-full" onclick="submitOrder()">Complete Enrollment</button>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Set checkout modal state
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
    const clicked = document.querySelector(`.payment-btn.${method}`) || document.querySelector('.payment-btn:last-child');
    if (clicked) clicked.classList.add('active');

    const numEl = document.getElementById('instructionNumber');
    if (numEl) {
      numEl.textContent = method === 'bkash' ? '01712-345678 (Personal / Send Money)' : method === 'nagad' ? '01812-345678 (Merchant / Payment)' : 'Online Banking / Visa / Master';
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
      window.showToast('Please enter your bKash/Nagad Transaction ID (TrxID)', 'error');
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
      window.showToast(res.message || 'Order placed successfully!', 'success');

      // Navigate to student dashboard or classroom
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

  // Run on page load
  document.addEventListener('DOMContentLoaded', () => {
    syncHeaderAuth();
    loadCmsSettings();
  });
})();
