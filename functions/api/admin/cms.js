export async function onRequestGet(context) {
  const { env, json } = context;
  const db = env.DB;

  const defaultSettings = {
    site_name: "Ahama Academy",
    site_tagline: "Learn practical skills & build real software.",
    announcement_bar: "🎉 50% Off on all Android & Web Masterclasses! Use coupon BANGLA50 at checkout.",
    announcement_active: "1",
    hero_headline: "Master Code.<br><span>Build Real Things.</span>",
    hero_subtext: "Project-based native Android, Java, and modern Full-Stack courses designed to turn you into an industry-ready engineer.",
    bkash_number: "01712-345678 (Personal / Send Money)",
    nagad_number: "01812-345678 (Merchant / Payment)",
    support_email: "support@ahama.academy",
    currency_symbol: "৳"
  };

  if (!db) {
    return json({ settings: defaultSettings });
  }

  const rows = await db.prepare("SELECT key, value FROM cms_settings").all();
  const settings = { ...defaultSettings };
  (rows.results || []).forEach(r => {
    settings[r.key] = r.value;
  });

  return json({ settings });
}

export async function onRequestPost(context) {
  const { request, env, json, getUser } = context;
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return json({ error: "Unauthorized. Admin access required." }, 403);
  }

  const body = await request.json(); // key-value map
  const db = env.DB;

  if (!db) {
    return json({ success: true, message: "Settings saved (Mock mode)" });
  }

  const entries = Object.entries(body);
  for (const [key, value] of entries) {
    await db.prepare(`
      INSERT OR REPLACE INTO cms_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).bind(key, String(value)).run();
  }

  return json({ success: true, message: "CMS Platform settings updated successfully!" });
}
