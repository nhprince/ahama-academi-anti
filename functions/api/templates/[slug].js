export async function onRequestGet(context) {
  const { params, env, json, getUser } = context;
  const slug = params.slug;
  const user = await getUser();

  const db = env.ahama_db_anti || env.DB;
  if (!db) {
    return json({
      template: {
        id: "tpl_nova_lms",
        slug,
        title: "Nova LMS - Ultra-Fast Course Platform Theme",
        subtitle: "Pure HTML5/CSS3 Academy Platform",
        description: "A lightweight, zero-dependency educational website theme. Features dark mode, responsive video player shell, curriculum accordions, and 100/100 Lighthouse performance.",
        category: "Web Themes",
        price: 799,
        is_free: 0,
        current_version: "v1.2.0",
        live_preview_url: "https://ahama-academy.pages.dev",
        tags: "HTML5, CSS3, Vanilla JS, Dark Mode",
        sales_count: 142
      },
      versions: [
        { version: "v1.2.0", changelog: "Added Bengali translation support, improved dark mode contrast, fixed mobile navigation drawer.", released_at: "2026-10-01" },
        { version: "v1.0.0", changelog: "Initial production release with course catalog and curriculum layouts.", released_at: "2026-09-15" }
      ],
      hasPurchased: user?.email === "student@ahama.academy",
      downloadUrl: user?.email === "student@ahama.academy" ? "https://github.com/sahariyar/templates/archive/refs/heads/main.zip" : null,
      licenseKey: user?.email === "student@ahama.academy" ? "AA-LIC-NOVA-8947-XK" : null
    });
  }

  const template = await db.prepare("SELECT * FROM templates WHERE slug = ? OR id = ?").bind(slug, slug).first();
  if (!template) {
    return json({ error: "Template not found" }, 404);
  }

  const versions = await db.prepare(
    "SELECT version, changelog, download_url, released_at FROM template_versions WHERE template_id = ? ORDER BY released_at DESC"
  ).bind(template.id).all();

  let hasPurchased = template.is_free === 1;
  let licenseKey = null;

  if (user) {
    if (user.role === "admin") {
      hasPurchased = true;
      licenseKey = "ADMIN-UNLIMITED-ACCESS";
    } else {
      const access = await db.prepare("SELECT license_key FROM template_access WHERE user_id = ? AND template_id = ?")
        .bind(user.id, template.id).first();
      if (access) {
        hasPurchased = true;
        licenseKey = access.license_key;
      }
    }
  }

  return json({
    template,
    versions: versions.results || [],
    hasPurchased,
    licenseKey,
    downloadUrl: hasPurchased ? template.download_url : null
  });
}
