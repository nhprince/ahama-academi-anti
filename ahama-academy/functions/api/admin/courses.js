export async function onRequestGet(context) {
  const { env, json, getUser } = context;
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return json({ error: "Unauthorized" }, 403);
  }

  const db = env.DB;
  if (!db) {
    return json({ courses: [] });
  }

  const courses = await db.prepare(`
    SELECT c.*, (SELECT COUNT(id) FROM curriculum WHERE course_id = c.id) as lessons_count
    FROM courses c
    ORDER BY c.created_at DESC
  `).all();

  return json({ courses: courses.results || [] });
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
    level,
    price,
    is_free,
    badge,
    lessons // optional array of { module_title, lesson_title, video_url, duration, is_preview }
  } = body;

  if (!title || !slug) {
    return json({ error: "Title and slug are required" }, 400);
  }

  const db = env.DB;
  if (!db) {
    return json({ success: true, message: "Course saved (Mock mode)" });
  }

  const courseId = id || ("crs_" + Date.now().toString(36));

  await db.prepare(`
    INSERT OR REPLACE INTO courses (id, slug, title, description, category, level, price, is_free, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    courseId,
    slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
    title,
    description || "",
    category || "General",
    level || "Beginner",
    parseInt(price) || 0,
    is_free ? 1 : 0,
    badge || ""
  ).run();

  // If lessons provided, sync curriculum
  if (Array.isArray(lessons) && lessons.length > 0) {
    for (let i = 0; i < lessons.length; i++) {
      const l = lessons[i];
      const lessonId = l.id || ("cur_" + Date.now().toString(36) + i);
      await db.prepare(`
        INSERT OR REPLACE INTO curriculum (id, course_id, module_title, lesson_title, video_provider, video_url, duration, is_preview, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        lessonId,
        courseId,
        l.module_title || "Module 1",
        l.lesson_title || `Lesson ${i + 1}`,
        l.video_provider || "youtube",
        l.video_url || "",
        l.duration || "15m",
        l.is_preview ? 1 : 0,
        i + 1
      ).run();
    }
  }

  return json({ success: true, course_id: courseId, message: "Course saved successfully!" });
}
