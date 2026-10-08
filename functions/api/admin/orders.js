export async function onRequestGet(context) {
  const { env, json, getUser } = context;
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return json({ error: "Unauthorized" }, 403);
  }

  const db = env.DB;
  if (!db) {
    return json({ orders: [] });
  }

  const orders = await db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  return json({ orders: orders.results || [] });
}

export async function onRequestPost(context) {
  const { request, env, json, getUser } = context;
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return json({ error: "Unauthorized" }, 403);
  }

  const { order_id, action } = await request.json(); // action = 'approve' | 'reject'
  if (!order_id || !action) {
    return json({ error: "Missing order_id or action" }, 400);
  }

  const db = env.DB;
  if (!db) {
    return json({ success: true, message: `Order ${order_id} ${action}d (Mock mode)` });
  }

  const order = await db.prepare("SELECT * FROM orders WHERE id = ?").bind(order_id).first();
  if (!order) {
    return json({ error: "Order not found" }, 404);
  }

  const newStatus = action === "approve" ? "approved" : "rejected";
  await db.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(newStatus, order_id).run();

  // If approved, instantly grant access!
  if (action === "approve") {
    if (order.item_type === "course") {
      const enrId = "enr_" + Date.now().toString(36);
      await db.prepare(`
        INSERT OR IGNORE INTO enrollments (id, user_id, course_id, progress_percent, completed_lessons)
        VALUES (?, ?, ?, 0, '[]')
      `).bind(enrId, order.user_id, order.item_id).run();
    } else if (order.item_type === "template") {
      const licId = "lic_" + Date.now().toString(36);
      const licenseKey = "AA-LIC-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      await db.prepare(`
        INSERT OR IGNORE INTO template_access (id, user_id, template_id, license_key)
        VALUES (?, ?, ?, ?)
      `).bind(licId, order.user_id, order.item_id, licenseKey).run();
    }
  }

  return json({
    success: true,
    message: `Order #${order.order_code} has been successfully ${newStatus}! Access has been updated.`
  });
}
