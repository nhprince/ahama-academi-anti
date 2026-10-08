export async function onRequestGet(context) {
  const { request, env, json } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const query = url.searchParams.get("q") || "";

  const db = env.ahama_db_anti || env.DB;
  if (!db) {
    return json({
      templates: [
        {
          id: "tpl_nova_lms",
          slug: "nova-lms-template",
          title: "Nova LMS - Ultra-Fast Course Platform Theme",
          subtitle: "Pure HTML5/CSS3 Academy Platform",
          description: "A lightweight, zero-dependency educational website theme. Features dark mode, responsive video player shell, curriculum accordions, and 100/100 Lighthouse performance.",
          category: "Web Themes",
          price: 799,
          is_free: 0,
          current_version: "v1.2.0",
          live_preview_url: "https://ahama-academy.pages.dev",
          tags: "HTML5, CSS3, Vanilla JS, Dark Mode",
          sales_count: 142,
          rating: 5.0,
          reviews_count: 18
        },
        {
          id: "tpl_finpay_app",
          slug: "finpay-android-kit",
          title: "FinPay - Fintech & Mobile Wallet App UI Kit",
          subtitle: "Production Android XML + Java Template",
          description: "Production-ready Android native XML + Java templates for modern e-wallets, bKash-style transfers, biometric lock, transaction histories, and card management.",
          category: "Android Apps",
          price: 1199,
          is_free: 0,
          current_version: "v2.1.0",
          live_preview_url: "#demo-finpay",
          tags: "Android Java, XML, Material Design 3",
          sales_count: 89,
          rating: 4.9,
          reviews_count: 14
        },
        {
          id: "tpl_dev_portfolio",
          slug: "portfolio-pro-minimal",
          title: "PortfolioPro - Minimalist Engineer Portfolio",
          subtitle: "Clean Developer Portfolio with Project Grids",
          description: "Sleek dark-mode portfolio theme for software engineers, mobile developers, and creators. Includes project showcases, skills cards, and interactive resume viewer.",
          category: "Web Themes",
          price: 0,
          is_free: 1,
          current_version: "v1.0.0",
          live_preview_url: "#demo-portfolio",
          tags: "HTML, CSS, Free, Mobile-First",
          sales_count: 310,
          rating: 4.8,
          reviews_count: 42
        },
        {
          id: "tpl_aura_store",
          slug: "aura-ecommerce-edge",
          title: "Aura - Serverless Cloudflare Storefront",
          subtitle: "Full-Stack E-Commerce Template on Cloudflare D1",
          description: "High-performance e-commerce theme pre-configured for Cloudflare Pages & D1 database. Product catalog, cart modal, instant checkout, and admin dashboard.",
          category: "Full-Stack",
          price: 1499,
          is_free: 0,
          current_version: "v1.5.0",
          live_preview_url: "#demo-aura",
          tags: "Cloudflare Pages, D1, Vanilla JS",
          sales_count: 67,
          rating: 5.0,
          reviews_count: 9
        }
      ]
    });
  }

  let sql = `
    SELECT t.*,
           (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE target_type = 'template' AND target_id = t.id) AS rating,
           (SELECT COUNT(id) FROM reviews WHERE target_type = 'template' AND target_id = t.id) AS reviews_count
    FROM templates t
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== "all") {
    sql += ` AND t.category = ?`;
    params.push(category);
  }
  if (query) {
    sql += ` AND (t.title LIKE ? OR t.description LIKE ? OR t.tags LIKE ?)`;
    params.push(`%${query}%`, `%${query}%`, `%${query}%`);
  }

  sql += ` ORDER BY t.sales_count DESC`;

  const results = await db.prepare(sql).bind(...params).all();
  return json({ templates: results.results || [] });
}
