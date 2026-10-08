export async function onRequestGet(context) {
  const { request, env, json } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const query = url.searchParams.get("q") || "";

  const db = env.DB;
  if (!db) {
    return json({
      templates: [
        {
          id: "tpl_nova_lms",
          slug: "nova-lms-template",
          title: "Nova LMS - Modern Course Academy Theme",
          description: "A lightweight, ultra-responsive HTML5 & Vanilla CSS course platform template. Zero external framework dependencies, 100/100 Lighthouse score.",
          category: "Web Themes",
          price: 799,
          is_free: 0,
          live_preview_url: "https://ahama-academy.pages.dev",
          tags: "HTML5, CSS3, Vanilla JS, Dark Mode",
          sales_count: 142
        },
        {
          id: "tpl_finpay_app",
          slug: "finpay-android-kit",
          title: "FinPay - Fintech & Wallet App UI Kit",
          description: "Production-ready Android native XML + Java templates for modern e-wallets, bKash-style payments, and transaction history screens.",
          category: "Android Apps",
          price: 1199,
          is_free: 0,
          live_preview_url: "#demo-finpay",
          tags: "Android Java, XML, Material Design",
          sales_count: 89
        },
        {
          id: "tpl_dev_portfolio",
          slug: "portfolio-pro-minimal",
          title: "PortfolioPro - Minimalist Developer Portfolio",
          description: "Sleek dark-mode portfolio theme for software engineers and creators. Includes project showcases, skills cards, and resume export.",
          category: "Web Themes",
          price: 0,
          is_free: 1,
          live_preview_url: "#demo-portfolio",
          tags: "HTML, CSS, Free, Mobile-First",
          sales_count: 310
        },
        {
          id: "tpl_aura_store",
          slug: "aura-ecommerce-edge",
          title: "Aura - Serverless Cloudflare Storefront",
          description: "Fast e-commerce theme pre-configured for Cloudflare Pages & D1 database. Product catalog, cart modal, and checkout flows.",
          category: "Full-Stack",
          price: 1499,
          is_free: 0,
          live_preview_url: "#demo-aura",
          tags: "Cloudflare Pages, D1, Vanilla JS",
          sales_count: 67
        }
      ]
    });
  }

  let sql = `SELECT id, slug, title, description, category, price, is_free, live_preview_url, tags, sales_count, created_at FROM templates WHERE 1=1`;
  const params = [];

  if (category && category !== "all") {
    sql += ` AND category = ?`;
    params.push(category);
  }
  if (query) {
    sql += ` AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)`;
    params.push(`%${query}%`, `%${query}%`, `%${query}%`);
  }

  sql += ` ORDER BY sales_count DESC`;

  const results = await db.prepare(sql).bind(...params).all();
  return json({ templates: results.results || [] });
}
