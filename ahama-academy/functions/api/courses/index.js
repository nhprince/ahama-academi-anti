export async function onRequestGet(context) {
  const { request, env, json } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const type = url.searchParams.get("type"); // 'free' | 'premium'
  const query = url.searchParams.get("q") || "";

  const db = env.DB;
  if (!db) {
    // Return sample courses if D1 is not bound
    return json({
      courses: [
        {
          id: "crs_java_app",
          slug: "app-development-with-java",
          title: "App Development with Java (Native Android)",
          description: "Master Android app development using Java & XML. Build 5 production-ready mobile apps from scratch.",
          category: "Mobile Development",
          level: "Beginner → Intermediate",
          price: 1499,
          is_free: 0,
          lessons_count: 28,
          badge: "Bestseller",
          instructor: "Sahariyar Ahamad"
        },
        {
          id: "crs_java_found",
          slug: "java-foundation",
          title: "Java Foundation & OOP Mastery",
          description: "Build a rock-solid core Java programming foundation before stepping into Android and enterprise frameworks.",
          category: "Programming",
          level: "Beginner",
          price: 0,
          is_free: 1,
          lessons_count: 12,
          badge: "Free Starter",
          instructor: "Ahama Academy"
        },
        {
          id: "crs_android_lab",
          slug: "android-project-lab",
          title: "Android Project Lab & Advanced Architecture",
          description: "Build scalable Android applications with MVVM, Retrofit, Room Database, and clean code principles.",
          category: "Mobile Development",
          level: "Intermediate",
          price: 1999,
          is_free: 0,
          lessons_count: 36,
          badge: "Hot & New",
          instructor: "Sahariyar Ahamad"
        },
        {
          id: "crs_fullstack_edge",
          slug: "fullstack-web-edge",
          title: "Full-Stack Edge Web Development",
          description: "Create blazing fast web apps on Cloudflare Pages, Workers, and D1 with pure Vanilla JS and zero frameworks.",
          category: "Web Development",
          level: "All Levels",
          price: 1299,
          is_free: 0,
          lessons_count: 24,
          badge: "Trending",
          instructor: "Ahama Web Team"
        }
      ]
    });
  }

  let sql = `
    SELECT c.*, COUNT(cur.id) AS lessons_count
    FROM courses c
    LEFT JOIN curriculum cur ON c.id = cur.course_id
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== "all") {
    sql += ` AND c.category = ?`;
    params.push(category);
  }
  if (type === "free") {
    sql += ` AND c.is_free = 1`;
  } else if (type === "premium") {
    sql += ` AND c.is_free = 0`;
  }
  if (query) {
    sql += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
    params.push(`%${query}%`, `%${query}%`);
  }

  sql += ` GROUP BY c.id ORDER BY c.created_at DESC`;

  const results = await db.prepare(sql).bind(...params).all();
  return json({ courses: results.results || [] });
}
