export async function onRequestPost(context) {
  const { request, env, json, getUser } = context;
  try {
    const user = await getUser();
    if (!user) {
      return json({ error: "Please log in to complete your order." }, 401);
    }

    const {
      item_type, // 'course' | 'template'
      item_id,
      payment_method, // 'bkash' | 'nagad' | 'card' | 'free'
      trx_id,
      sender_phone,
      coupon_code
    } = await request.json();

    if (!item_type || !item_id || !payment_method) {
      return json({ error: "Missing required order fields" }, 400);
    }

    const db = env.DB;
    if (!db) {
      // Mock instant checkout
      const mockOrderCode = "AA-" + Math.floor(10000 + Math.random() * 90000);
      return json({
        success: true,
        order: {
          id: "ord_mock_" + Date.now(),
          order_code: mockOrderCode,
          status: payment_method === "free" ? "approved" : "pending",
          item_type,
          item_id,
          amount: 0,
          payment_method,
          trx_id: trx_id || "TRX-DEMO"
        },
        message: payment_method === "free" ? "Enrollment activated!" : "Order placed! Awaiting TrxID verification."
      });
    }

    // Fetch item details
    let itemTitle = "";
    let basePrice = 0;
    let isFree = false;

    if (item_type === "course") {
      const course = await db.prepare("SELECT title, price, is_free FROM courses WHERE id = ?").bind(item_id).first();
      if (!course) return json({ error: "Course not found" }, 404);
      itemTitle = course.title;
      basePrice = course.price;
      isFree = course.is_free === 1;
    } else {
      const template = await db.prepare("SELECT title, price, is_free FROM templates WHERE id = ?").bind(item_id).first();
      if (!template) return json({ error: "Template not found" }, 404);
      itemTitle = template.title;
      basePrice = template.price;
      isFree = template.is_free === 1;
    }

    // Apply coupon if provided
    let finalAmount = isFree ? 0 : basePrice;
    if (coupon_code && finalAmount > 0) {
      const coupon = await db.prepare("SELECT * FROM coupons WHERE code = ? AND is_active = 1").bind(coupon_code.toUpperCase().trim()).first();
      if (coupon) {
        if (coupon.discount_type === "percent") {
          finalAmount = Math.max(0, Math.round(finalAmount * (1 - coupon.discount_value / 100)));
        } else {
          finalAmount = Math.max(0, finalAmount - coupon.discount_value);
        }
      }
    }

    const orderId = "ord_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const orderCode = "AA-" + Math.floor(10000 + Math.random() * 90000);
    
    // Auto-approve if final amount is 0 or payment is 'free'
    const isAutoApproved = finalAmount === 0 || payment_method === "free";
    const status = isAutoApproved ? "approved" : "pending";

    await db.prepare(`
      INSERT INTO orders (id, order_code, user_id, user_email, item_type, item_id, item_title, amount, payment_method, trx_id, sender_phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId,
      orderCode,
      user.id,
      user.email,
      item_type,
      item_id,
      itemTitle,
      finalAmount,
      payment_method,
      trx_id || (isAutoApproved ? "FREE-ENROLL" : ""),
      sender_phone || "",
      status
    ).run();

    // If auto-approved, grant access immediately!
    if (isAutoApproved) {
      if (item_type === "course") {
        const enrId = "enr_" + Date.now().toString(36);
        await db.prepare(`
          INSERT OR IGNORE INTO enrollments (id, user_id, course_id, progress_percent, completed_lessons)
          VALUES (?, ?, ?, 0, '[]')
        `).bind(enrId, user.id, item_id).run();
      } else {
        const licId = "lic_" + Date.now().toString(36);
        const licenseKey = "AA-LIC-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
        await db.prepare(`
          INSERT OR IGNORE INTO template_access (id, user_id, template_id, license_key)
          VALUES (?, ?, ?, ?)
        `).bind(licId, user.id, item_id, licenseKey).run();
      }
    }

    return json({
      success: true,
      order: {
        id: orderId,
        order_code: orderCode,
        status,
        final_amount: finalAmount,
        item_title: itemTitle
      },
      message: isAutoApproved 
        ? "Access granted immediately! Check your dashboard." 
        : "Order submitted! Your bKash/Nagad TrxID is being verified by admin."
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
