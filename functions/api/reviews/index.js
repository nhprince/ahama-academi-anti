export async function onRequestGet(context) {
  const { request, env, json } = context;
  const url = new URL(request.url);
  const targetType = url.searchParams.get("type"); // 'course' | 'template'
  const targetId = url.searchParams.get("target_id");

  const db = env.ahama_db_anti || env.DB;
  if (!db) {
    return json({ reviews: [] });
  }

  const reviews = await db.prepare(`
    SELECT r.id, r.rating, r.review_text, r.created_at, u.name as user_name, u.avatar as user_avatar
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.target_type = ? AND r.target_id = ?
    ORDER BY r.created_at DESC LIMIT 20
  `).bind(targetType, targetId).all();

  return json({ reviews: reviews.results || [] });
}

export async function onRequestPost(context) {
  const { request, env, json, getUser } = context;
  const user = await getUser();
  if (!user) {
    return json({ error: "Please log in to leave a review." }, 401);
  }

  const { target_type, target_id, rating, review_text } = await request.json();
  if (!target_type || !target_id || !rating || !review_text) {
    return json({ error: "Rating and review text are required." }, 400);
  }

  const db = env.ahama_db_anti || env.DB;
  if (!db) {
    return json({ success: true, message: "Review posted (Mock mode)" });
  }

  const revId = "rev_" + Date.now().toString(36);
  await db.prepare(`
    INSERT INTO reviews (id, user_id, target_type, target_id, rating, review_text)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(revId, user.id, target_type, target_id, parseInt(rating), review_text.trim()).run();

  return json({ success: true, message: "Thank you! Your review has been submitted." });
}
