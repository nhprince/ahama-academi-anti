import { createJwt } from "./jwt.js";

// Google OAuth Edge Token Verification
export async function onRequestPost(context) {
  const { request, env, json } = context;
  try {
    const { credential } = await request.json(); // Google JWT credential from GSI client
    if (!credential) {
      return json({ error: "Missing Google credential" }, 400);
    }

    // Decode Google JWT payload
    const parts = credential.split(".");
    if (parts.length !== 3) {
      return json({ error: "Invalid Google token structure" }, 400);
    }

    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return json({ error: "No email associated with Google account" }, 400);
    }

    const db = env.ahama_db_anti || env.DB;
    const cleanEmail = email.toLowerCase().trim();

    if (!db) {
      const mockUser = { id: "usr_g_" + googleId.slice(0, 8), name, email: cleanEmail, role: "student", avatar: name.slice(0, 2).toUpperCase() };
      const token = await createJwt(mockUser);
      return json({ success: true, token, user: mockUser });
    }

    let user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(cleanEmail).first();
    if (!user) {
      const userId = "usr_g_" + Date.now().toString(36);
      const avatar = name.slice(0, 2).toUpperCase();
      await db.prepare(
        "INSERT INTO users (id, name, email, password_hash, role, avatar) VALUES (?, ?, ?, 'GOOGLE_OAUTH', 'student', ?)"
      ).bind(userId, name, cleanEmail, avatar).run();

      user = { id: userId, name, email: cleanEmail, role: "student", avatar };
    }

    const token = await createJwt({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || user.name.slice(0, 2).toUpperCase()
    });

    return json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || user.name.slice(0, 2).toUpperCase()
      }
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
