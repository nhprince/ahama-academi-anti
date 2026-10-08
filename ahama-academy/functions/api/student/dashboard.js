export async function onRequestGet(context) {
  const { env, json, getUser } = context;
  const user = await getUser();
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const db = env.DB;
  if (!db) {
    // Mock student data
    return json({
      user,
      enrollments: [
        {
          course_id: "crs_java_app",
          slug: "app-development-with-java",
          title: "App Development with Java (Native Android)",
          category: "Mobile Development",
          progress_percent: 42,
          completed_count: 3,
          total_lessons: 7,
          certificate_id: "AA-CERT-2026-9041"
        },
        {
          course_id: "crs_java_found",
          slug: "java-foundation",
          title: "Java Foundation & OOP Mastery",
          category: "Programming",
          progress_percent: 100,
          completed_count: 3,
          total_lessons: 3,
          certificate_id: "AA-CERT-2026-8812"
        }
      ],
      templates: [
        {
          template_id: "tpl_nova_lms",
          slug: "nova-lms-template",
          title: "Nova LMS - Modern Course Academy Theme",
          category: "Web Themes",
          license_key: "AA-LIC-NOVA-8947-XK",
          download_url: "https://github.com/sahariyar/templates/archive/refs/heads/main.zip",
          download_count: 3
        }
      ],
      orders: [
        {
          order_code: "AA-10482",
          item_title: "App Development with Java",
          amount: 1499,
          payment_method: "bkash",
          trx_id: "BK99X8741A",
          status: "approved",
          created_at: "2026-10-07"
        },
        {
          order_code: "AA-10483",
          item_title: "Nova LMS - Modern Course Academy Theme",
          amount: 799,
          payment_method: "nagad",
          trx_id: "NG55L2984K",
          status: "approved",
          created_at: "2026-10-06"
        }
      ]
    });
  }

  // Real D1 queries
  const enrollmentsQuery = await db.prepare(`
    SELECT e.course_id, e.progress_percent, e.completed_lessons, e.certificate_id,
           c.slug, c.title, c.category, c.thumbnail,
           (SELECT COUNT(id) FROM curriculum WHERE course_id = c.id) AS total_lessons
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = ?
    ORDER BY e.created_at DESC
  `).bind(user.id).all();

  const templatesQuery = await db.prepare(`
    SELECT ta.license_key, ta.download_count,
           t.id AS template_id, t.slug, t.title, t.category, t.download_url
    FROM template_access ta
    JOIN templates t ON ta.template_id = t.id
    WHERE ta.user_id = ?
  `).bind(user.id).all();

  const ordersQuery = await db.prepare(`
    SELECT order_code, item_title, item_type, amount, payment_method, trx_id, status, created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `).bind(user.id).all();

  return json({
    user,
    enrollments: enrollmentsQuery.results || [],
    templates: templatesQuery.results || [],
    orders: ordersQuery.results || []
  });
}
