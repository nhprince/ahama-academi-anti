export async function onRequestGet(context) {
  const { request, env, json, getUser } = context;
  const user = await getUser();
  if (!user) return json({ error: "Unauthorized" }, 401);

  const url = new URL(request.url);
  const courseId = url.searchParams.get("course_id");
  const curriculumId = url.searchParams.get("curriculum_id");

  const db = env.ahama_db_anti || env.DB;
  if (!db) return json({ notes: [] });

  const notes = await db.prepare(`
    SELECT * FROM student_notes
    WHERE user_id = ? AND course_id = ? AND curriculum_id = ?
    ORDER BY timestamp_seconds ASC
  `).bind(user.id, courseId, curriculumId).all();

  return json({ notes: notes.results || [] });
}

export async function onRequestPost(context) {
  const { request, env, json, getUser } = context;
  const user = await getUser();
  if (!user) return json({ error: "Unauthorized" }, 401);

  const { course_id, curriculum_id, timestamp_seconds, note_content } = await request.json();
  if (!course_id || !curriculum_id || !note_content) {
    return json({ error: "Missing note content" }, 400);
  }

  const db = env.ahama_db_anti || env.DB;
  if (!db) return json({ success: true, message: "Note saved (Mock mode)" });

  const id = "note_" + Date.now().toString(36);
  await db.prepare(`
    INSERT INTO student_notes (id, user_id, course_id, curriculum_id, timestamp_seconds, note_content)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, user.id, course_id, curriculum_id, parseInt(timestamp_seconds) || 0, note_content.trim()).run();

  return json({ success: true, id, message: "Note saved successfully!" });
}
