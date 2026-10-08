export async function onRequestGet(context) {
  const { env, json, getUser } = context;
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return json({ error: "Unauthorized. Admin role required." }, 403);
  }

  const db = env.DB;
  if (!db) {
    return json({
      metrics: {
        total_students: 1248,
        total_courses: 4,
        total_templates: 4,
        total_orders: 386,
        total_revenue: 482500,
        pending_orders: 1
      },
      recent_orders: [
        { id: "ord_10484", order_code: "AA-10484", user_email: "arif@example.com", item_title: "Android Project Lab", amount: 1999, payment_method: "bkash", trx_id: "BK34A9901M", status: "pending", created_at: "2026-10-08" },
        { id: "ord_10482", order_code: "AA-10482", user_email: "student@ahama.academy", item_title: "App Development with Java", amount: 1499, payment_method: "bkash", trx_id: "BK99X8741A", status: "approved", created_at: "2026-10-07" },
        { id: "ord_10483", order_code: "AA-10483", user_email: "student@ahama.academy", item_title: "Nova LMS Theme", amount: 799, payment_method: "nagad", trx_id: "NG55L2984K", status: "approved", created_at: "2026-10-06" }
      ]
    });
  }

  const studentsCount = (await db.prepare("SELECT COUNT(id) as count FROM users WHERE role = 'student'").first())?.count || 0;
  const coursesCount = (await db.prepare("SELECT COUNT(id) as count FROM courses").first())?.count || 0;
  const templatesCount = (await db.prepare("SELECT COUNT(id) as count FROM templates").first())?.count || 0;
  const ordersCount = (await db.prepare("SELECT COUNT(id) as count FROM orders").first())?.count || 0;
  const revenueTotal = (await db.prepare("SELECT SUM(amount) as total FROM orders WHERE status = 'approved'").first())?.total || 0;
  const pendingOrders = (await db.prepare("SELECT COUNT(id) as count FROM orders WHERE status = 'pending'").first())?.count || 0;

  const recentOrders = await db.prepare(`
    SELECT id, order_code, user_email, item_type, item_title, amount, payment_method, trx_id, sender_phone, status, created_at
    FROM orders
    ORDER BY created_at DESC
    LIMIT 20
  `).all();

  return json({
    metrics: {
      total_students: studentsCount,
      total_courses: coursesCount,
      total_templates: templatesCount,
      total_orders: ordersCount,
      total_revenue: revenueTotal,
      pending_orders: pendingOrders
    },
    recent_orders: recentOrders.results || []
  });
}
