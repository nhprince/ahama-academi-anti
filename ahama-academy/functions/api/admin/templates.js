export async function onRequestGet(context) {
  const { env, json, getUser } = context;
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return json({ error: "Unauthorized" }, 403);
  }

  const db = env.DB;
  if (!db) {
    return json({ templates: [] });
  }

  const templates = await db.prepare("SELECT * FROM templates ORDER BY created_at DESC").all();
  return json({ templates: templates.results || [] });
}

export async function onRequestPost(context) {
  const { request, env, json, getUser } = context;
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return json({ error: "Unauthorized" }, 403);
  }

  const body = await request.json();
  const {
    id,
    title,
    slug,
    description,
    category,
    price,
    is_free,
    live_preview_url,
    download_url,
    tags
  } = body;

  if (!title || !slug || !download_url) {
    return json({ error: "Title, slug, and download URL are required" }, 400);
  }

  const db = env.DB;
  if (!db) {
    return json({ success: true, message: "Template saved (Mock mode)" });
  }

  const templateId = id || ("tpl_" + Date.now().toString(36));

  await db.prepare(`
    INSERT OR REPLACE INTO templates (id, slug, title, description, category, price, is_free, live_preview_url, download_url, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    templateId,
    slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
    title,
    description || "",
    category || "Web Themes",
    parseInt(price) || 0,
    is_free ? 1 : 0,
    live_preview_url || "",
    download_url,
    tags || ""
  ).run();

  return json({ success: true, template_id: templateId, message: "Digital template saved successfully!" });
}
