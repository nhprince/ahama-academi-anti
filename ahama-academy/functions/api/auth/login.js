import { hashPassword, createJwt } from "./jwt.js";

export async function onRequestPost(context) {
  const { request, env, json } = context;
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return json({ error: "Email and password are required" }, 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = env.DB;

    // Check demo accounts directly if db not attached
    if (!db) {
      if (cleanEmail === "admin@ahama.academy" && password === "admin123") {
        const token = await createJwt({ id: "usr_admin", name: "Ahama Administrator", email: cleanEmail, role: "admin", avatar: "AA" });
        return json({ success: true, token, user: { id: "usr_admin", name: "Ahama Administrator", email: cleanEmail, role: "admin", avatar: "AA" } });
      }
      const token = await createJwt({ id: "usr_student", name: "Sahariyar Ahamad", email: cleanEmail, role: "student", avatar: "SA" });
      return json({ success: true, token, user: { id: "usr_student", name: "Sahariyar Ahamad", email: cleanEmail, role: "student", avatar: "SA" } });
    }

    const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(cleanEmail).first();
    if (!user) {
      return json({ error: "Invalid email or password" }, 401);
    }

    const passwordHash = await hashPassword(password);
    if (user.password_hash !== passwordHash) {
      return json({ error: "Invalid email or password" }, 401);
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
