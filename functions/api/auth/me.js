export async function onRequestGet(context) {
  const { env, json, getUser } = context;
  const user = await getUser();
  if (!user) {
    return json({ authenticated: false, user: null }, 401);
  }

  const db = env.DB;
  if (!db) {
    return json({ authenticated: true, user });
  }

  const dbUser = await db.prepare("SELECT id, name, email, role, avatar FROM users WHERE id = ?").bind(user.id).first();
  if (!dbUser) {
    return json({ authenticated: false, user: null }, 401);
  }

  return json({ authenticated: true, user: dbUser });
}
