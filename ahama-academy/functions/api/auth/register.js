import { hashPassword, createJwt } from "./jwt.js";

export async function onRequestPost(context) {
  const { request, env, json } = context;
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return json({ error: "Name, email, and password are required" }, 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = env.DB;

    if (!db) {
      // Mock Edge fallback if D1 not attached yet
      const token = await createJwt({ id: "usr_mock", name, email: cleanEmail, role: "student" });
      return json({ success: true, token, user: { id: "usr_mock", name, email: cleanEmail, role: "student" } });
    }

    // Check if user already exists
    const existing = await db.prepare("SELECT id FROM users WHERE email = ?").bind(cleanEmail).first();
    if (existing) {
      return json({ error: "An account with this email already exists" }, 409);
    }

    const userId = "usr_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const passwordHash = await hashPassword(password);
    const avatar = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "ST";

    await db.prepare(
      "INSERT INTO users (id, name, email, password_hash, role, avatar) VALUES (?, ?, ?, ?, 'student', ?)"
    ).bind(userId, name, cleanEmail, passwordHash, avatar).run();

    const token = await createJwt({ id: userId, name, email: cleanEmail, role: "student", avatar });
    return json({
      success: true,
      token,
      user: { id: userId, name, email: cleanEmail, role: "student", avatar }
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
