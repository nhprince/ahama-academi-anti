export async function onRequestGet(context) {
  const { request, env, json } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const type = url.searchParams.get("type"); // 'free' | 'premium'
  const query = url.searchParams.get("q") || "";

  const db = env.ahama_db_anti || env.DB;
  if (!db) {
    return json({
      courses: [
        {
          id: "crs_java_app",
          slug: "app-development-with-java",
          title: "App Development with Java (Native Android)",
          description: "Master native Android development using Java & XML. Go from absolute beginner to building production apps with SQLite, Room, REST APIs, and Material Design UI.",
          category: "Mobile Development",
          level: "Beginner → Intermediate",
          price: 1499,
          price_usd: 15,
          is_free: 0,
          lessons_count: 7,
          badge: "Bestseller",
          instructor_name: "Sahariyar Ahamad",
          duration_hours: 18.5,
          rating: 4.9,
          reviews_count: 48
        },
        {
          id: "crs_java_found",
          slug: "java-foundation",
          title: "Java Foundation & OOP Mastery",
          description: "Build a rock-solid core Java programming foundation before stepping into Android, Spring Boot, or enterprise development. Features 40+ coding exercises.",
          category: "Programming",
          level: "Beginner",
          price: 0,
          price_usd: 0,
          is_free: 1,
          lessons_count: 3,
          badge: "Free Starter",
          instructor_name: "Sahariyar Ahamad",
          duration_hours: 8.0,
          rating: 5.0,
          reviews_count: 82
        },
        {
          id: "crs_android_lab",
          slug: "android-project-lab",
          title: "Android Project Lab: MVVM & Production Architecture",
          description: "Take your Android skills to the senior level. Build an enterprise e-commerce app with MVVM, Clean Architecture, Repository Pattern, Dependency Injection, and Jetpack.",
          category: "Mobile Development",
          level: "Intermediate",
          price: 1999,
          price_usd: 20,
          is_free: 0,
          lessons_count: 8,
          badge: "Hot & New",
          instructor_name: "Sahariyar Ahamad",
          duration_hours: 22.0,
          rating: 4.8,
          reviews_count: 31
        },
        {
          id: "crs_fullstack_edge",
          slug: "fullstack-web-edge",
          title: "Full-Stack Edge Web Development",
          description: "Create blazing fast web applications on Cloudflare Pages, Edge Functions, and D1 database using pure Vanilla JS. Zero framework bloat, 100/100 Lighthouse performance.",
          category: "Web Development",
          level: "All Levels",
          price: 1299,
          price_usd: 13,
          is_free: 0,
          lessons_count: 6,
          badge: "Trending",
          instructor_name: "Sahariyar Ahamad",
          duration_hours: 14.0,
          rating: 4.9,
          reviews_count: 24
        }
      ]
    });
  }

  let sql = `
    SELECT c.*, 
           i.display_name AS instructor_name,
           i.avatar AS instructor_avatar,
           (SELECT COUNT(id) FROM curriculum WHERE course_id = c.id) AS lessons_count,
           (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE target_type = 'course' AND target_id = c.id) AS rating,
           (SELECT COUNT(id) FROM reviews WHERE target_type = 'course' AND target_id = c.id) AS reviews_count
    FROM courses c
    LEFT JOIN instructors i ON c.instructor_id = i.id
    WHERE c.is_published = 1
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

  sql += ` ORDER BY c.created_at DESC`;

  const results = await db.prepare(sql).bind(...params).all();
  return json({ courses: results.results || [] });
}
