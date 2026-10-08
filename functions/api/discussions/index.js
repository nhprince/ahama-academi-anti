export async function onRequestGet(context) {
  const { request, env, json } = context;
  const url = new URL(request.url);
  const courseId = url.searchParams.get("course_id");

  const db = env.ahama_db_anti || env.DB;
  if (!db) {
    return json({
      discussions: [
        { id: "disc_01", author_name: "Tanvir Hasan", author_avatar: "TH", question: "I got a Gradle sync issue on Windows with JDK 21. How do I point Android Studio to JDK 17?", reply_text: "Go to Settings -> Build Tools -> Gradle -> Gradle JDK, and select Embedded JDK 17.", replied_by: "Sahariyar Ahamad", created_at: "2026-10-06" }
      ]
    });
  }

  const list = await db.prepare(
    "SELECT * FROM discussions WHERE course_id = ? ORDER BY created_at DESC LIMIT 30"
  ).bind(courseId).all();

  return json({ discussions: list.results || [] });
}

export async function onRequestPost(context) {
  const { request, env, json, getUser } = context;
  const user = await getUser();
  if (!user) return json({ error: "Unauthorized" }, 401);

  const { course_id, curriculum_id, question } = await request.json();
  if (!course_id || !question) return json({ error: "Missing required fields" }, 400);

  const db = env.ahama_db_anti || env.DB;
  if (!db) return json({ success: true, message: "Question posted (Mock mode)" });

  const id = "disc_" + Date.now().toString(36);
  await db.prepare(`
    INSERT INTO discussions (id, course_id, curriculum_id, user_id, author_name, author_avatar, question)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(id, course_id, curriculum_id || "", user.id, user.name, user.avatar || "ST", question.trim()).run();

  return json({ success: true, message: "Your question has been posted to the instructor!" });
}
