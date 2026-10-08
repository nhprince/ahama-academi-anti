export async function onRequestGet(context) {
  const { env, json, getUser } = context;
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return json({ error: "Unauthorized" }, 403);
  }

  const db = env.ahama_db_anti || env.DB;
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
    subtitle,
    description,
    category,
    price,
    version,
    live_preview_url,
    download_url,
    tags
  } = body;

  if (!title || !slug || !download_url) {
    return json({ error: "Title, slug, and download URL are required" }, 400);
  }

  const db = env.ahama_db_anti || env.DB;
  if (!db) {
    return json({ success: true, message: "Template saved (Mock mode)" });
  }

  const templateId = id || ("tpl_" + Date.now().toString(36));
  const currentVersion = version || "v1.0.0";

  await db.prepare(`
    INSERT OR REPLACE INTO templates (id, slug, title, subtitle, description, category, price, is_free, current_version, live_preview_url, download_url, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    templateId,
    slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
    title,
    subtitle || "",
    description || "",
    category || "Web Themes",
    parseInt(price) || 0,
    parseInt(price) === 0 ? 1 : 0,
    currentVersion,
    live_preview_url || "",
    download_url,
    tags || ""
  ).run();

  // Log version
  const vid = "ver_" + Date.now().toString(36);
  await db.prepare(`
    INSERT OR REPLACE INTO template_versions (id, template_id, version, changelog, download_url)
    VALUES (?, ?, ?, 'Latest update published by administrator', ?)
  `).bind(vid, templateId, currentVersion, download_url).run();

  return json({ success: true, template_id: templateId, message: "Digital template saved successfully!" });
}
