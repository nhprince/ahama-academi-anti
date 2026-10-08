export async function onRequestGet(context) {
  const { params, env, json, getUser } = context;
  const slug = params.slug;
  const user = await getUser();

  const db = env.DB;
  if (!db) {
    return json({
      template: {
        id: "tpl_nova_lms",
        slug,
        title: "Nova LMS - Modern Course Academy Theme",
        description: "A lightweight, ultra-responsive HTML5 & Vanilla CSS course platform template. Zero external framework dependencies, 100/100 Lighthouse score.",
        category: "Web Themes",
        price: 799,
        is_free: 0,
        live_preview_url: "https://ahama-academy.pages.dev",
        tags: "HTML5, CSS3, Vanilla JS, Dark Mode",
        sales_count: 142
      },
      hasPurchased: user?.email === "student@ahama.academy",
      downloadUrl: user?.email === "student@ahama.academy" ? "https://github.com/sahariyar/templates/archive/refs/heads/main.zip" : null,
      licenseKey: user?.email === "student@ahama.academy" ? "AA-LIC-NOVA-8947-XK" : null
    });
  }

  const template = await db.prepare("SELECT * FROM templates WHERE slug = ?").bind(slug).first();
  if (!template) {
    return json({ error: "Template not found" }, 404);
  }

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
    template: {
      id: template.id,
      slug: template.slug,
      title: template.title,
      description: template.description,
      category: template.category,
      price: template.price,
      is_free: template.is_free,
      live_preview_url: template.live_preview_url,
      tags: template.tags,
      sales_count: template.sales_count
    },
    hasPurchased,
    licenseKey,
    downloadUrl: hasPurchased ? template.download_url : null
  });
}
