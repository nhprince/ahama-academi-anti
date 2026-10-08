# Ahama Academy — Modern Edge LMS & Digital Marketplace

A production-ready, full-fledged course platform and digital store built for **100% Free Tier Cloudflare Pages + Functions + D1**.

## 🚀 Key Features

- **Course Platform (Udemy-like):**
  - Project-based masterclasses with full video curriculum.
  - Video streaming player with theater mode, lecture notes, Q&A, and auto-completion tracking.
  - Official completion certificates dynamically drawn on HTML5 Canvas with verification IDs.
- **Digital Store & Marketplace:**
  - Sell and distribute website themes (HTML5, Vanilla JS, React) and Android app UI kits (XML + Java).
  - Live demo previews and secure ZIP downloads with license key generation.
- **Payment & Order CRM:**
  - Automated & Semi-Automated bKash, Nagad, and Rocket Transaction ID (TrxID) verification with 1-click clipboard copy.
  - 1-Click admin approval that instantly activates student course enrollments and template licenses.
  - Automated transactional email receipts via Resend (`RESEND_API_KEY`).
  - Dynamic coupon engine (`WELCOME20`, `BANGLA50`, `FREEPASS`).
- **Learning Experience:**
  - In-lecture interactive Quizzes with instant grading and pass/fail thresholds.
  - Interactive Q&A discussion board per course.
  - Timestamped lecture notes synced to student account.
  - Verified HTML5 Canvas certificate generation.
- **Digital Store & Versioning:**
  - Version releases (`v1.2.0`), interactive changelog modal, live previews, and license keys (`AA-LIC-...`).
- **Bilingual Interface (i18n):**
  - Instant English / Bengali (`বাংলা`) toggle with 0 external dependencies.
- **Advanced Admin Control Center & CMS:**
  - Live KPI metrics (Total Revenue in ৳ BDT, Students, Orders, Courses).
  - Visual sales bar charts and order feeds.
  - Course and template creation modals.
  - **Live CMS Customizer:** Edit announcement bar, hero headline, brand theme colors (`--primary`, `--accent`), bKash / Nagad / Rocket recipient numbers, and support email from the browser!
- **Zero-Card Hybrid Storage Router:**
  - **YouTube Unlisted Embeds:** Unlimited free video streaming bandwidth with zero buffering.
  - **GitHub Releases CDN:** Unlimited 2GB downloads for large template ZIP archives.
  - **Supabase Free Tier (1GB):** Lesson cheat sheets and PDF attachments.
  - **Cloudinary (25GB):** High-speed CDN for posters and thumbnails.
  - **Cloudflare D1 Fallback:** Edge SQLite database fallback.

---

## ⚡ Deployment to Cloudflare Pages (Free)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Ahama Academy Release"
   git remote add origin https://github.com/nhprince/ahama-academi-anti.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to **Workers & Pages** → **Create Application** → **Pages** → **Connect to Git**
   - Framework preset: `None`
   - Build command: *(leave blank)*
   - Build output directory: `/`
   - Click **Save and Deploy**.

3. **Initialize Free Cloudflare D1 Database:**
   ```bash
   # Run schema migration
   npx wrangler d1 execute ahama_db_anti --file=./d1/schema.sql

   # Seed initial courses, templates, and admin user
   npx wrangler d1 execute ahama_db_anti --file=./d1/seed.sql
   ```

4. **Bind D1 in Cloudflare Pages:**
   - In Pages project settings: **Settings** → **Functions** → **D1 database bindings**
   - Variable name: `ahama_db_anti` (or `DB`)
   - Database: select your created D1 database.
   - *(Optional)* In **Environment variables**, set `RESEND_API_KEY` for real email receipts.

---

## 🔑 Default Demo Accounts

- **Administrator:** `admin@ahama.academy` | Password: `admin123`
- **Student:** `student@ahama.academy` | Password: `student123`

*(Supports 1-click quick demo login buttons directly from the `/login/` screen)*
