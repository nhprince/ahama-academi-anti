export async function onRequestGet(context) {
  const { params, env, json, getUser } = context;
  const slug = params.slug;
  const user = await getUser();

  const db = env.ahama_db_anti || env.DB;
  if (!db) {
    return json({
      course: {
        id: "crs_java_app",
        slug,
        title: "App Development with Java (Native Android)",
        subtitle: "Build 5 Real-World Android Apps from Scratch",
        description: "Master native Android development using Java & XML. Go from absolute beginner to building production apps with SQLite, Room, REST APIs, and Material Design UI.",
        category: "Mobile Development",
        level: "Beginner → Intermediate",
        price: 1499,
        price_usd: 15,
        is_free: 0,
        badge: "Bestseller",
        instructor_name: "Sahariyar Ahamad",
        instructor_title: "Lead Android Architect",
        duration_hours: 18.5,
        rating: 4.9,
        reviews_count: 48
      },
      curriculum: [
        { id: "cur_01", module_title: "Module 1: Android Studio & Environment Setup", lesson_title: "1.1 Installing Android Studio, JDK & SDK Setup", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "14m", is_preview: 1 },
        { id: "cur_02", module_title: "Module 1: Android Studio & Environment Setup", lesson_title: "1.2 Understanding Project Structure, Gradle & Manifest", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "18m", is_preview: 1 },
        { id: "cur_03", module_title: "Module 2: UI Design with XML & ConstraintLayout", lesson_title: "2.1 ConstraintLayout Deep Dive & Responsive Rules", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "25m", is_preview: 0 },
        { id: "cur_04", module_title: "Module 2: UI Design with XML & ConstraintLayout", lesson_title: "2.2 Material Design Components: Buttons, Cards, & Pickers", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "22m", is_preview: 0 },
        { id: "cur_05", module_title: "Module 3: Java Logic & Activity Navigation", lesson_title: "3.1 Activity Lifecycle, Intent & Screen Navigation", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "30m", is_preview: 0 },
        { id: "cur_06", module_title: "Module 3: Java Logic & Activity Navigation", lesson_title: "3.2 RecyclerView, Custom Adapters & ViewHolders", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "35m", is_preview: 0 },
        { id: "cur_07", module_title: "Module 4: Real-World Capstone Project", lesson_title: "4.1 Building a Complete Task & Habit Tracker App", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "45m", is_preview: 0 }
      ],
      quizzes: [
        { id: "quiz_java_app_01", title: "Android Fundamentals & Activity Lifecycle Quiz", passing_score: 75 }
      ],
      reviews: [
        { user_name: "Tanvir Hasan", rating: 5, review_text: "Best practical Android course in Bangla. The explanation of ConstraintLayout and RecyclerView helped me finally land my junior Android internship!", created_at: "2026-10-06" }
      ],
      isEnrolled: user?.email === "student@ahama.academy"
    });
  }

  const course = await db.prepare(`
    SELECT c.*, 
           i.display_name AS instructor_name,
           i.title AS instructor_title,
           i.avatar AS instructor_avatar,
           i.bio AS instructor_bio,
           (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE target_type = 'course' AND target_id = c.id) AS rating,
           (SELECT COUNT(id) FROM reviews WHERE target_type = 'course' AND target_id = c.id) AS reviews_count
    FROM courses c
    LEFT JOIN instructors i ON c.instructor_id = i.id
    WHERE c.slug = ? OR c.id = ?
  `).bind(slug, slug).first();

  if (!course) {
    return json({ error: "Course not found" }, 404);
  }

  let isEnrolled = false;
  if (user) {
    const enrollment = await db.prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?")
      .bind(user.id, course.id).first();
    isEnrolled = !!enrollment || user.role === "admin";
  }

  const lessons = await db.prepare(
    "SELECT * FROM curriculum WHERE course_id = ? ORDER BY sort_order ASC"
  ).bind(course.id).all();

  const quizzes = await db.prepare(
    "SELECT id, title, passing_score FROM quizzes WHERE course_id = ?"
  ).bind(course.id).all();

  const reviews = await db.prepare(`
    SELECT r.rating, r.review_text, r.created_at, u.name AS user_name, u.avatar AS user_avatar
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.target_type = 'course' AND r.target_id = ?
    ORDER BY r.created_at DESC LIMIT 10
  `).bind(course.id).all();

  // Protect video stream URLs for non-enrolled students
  const curriculum = (lessons.results || []).map(l => {
    if (course.is_free || isEnrolled || l.is_preview) {
      return l;
    }
    return {
      ...l,
      video_url: "" // Locked until enrollment
    };
  });

  return json({
    course,
    curriculum,
    quizzes: quizzes.results || [],
    reviews: reviews.results || [],
    isEnrolled
  });
}
