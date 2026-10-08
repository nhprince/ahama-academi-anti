export async function onRequestGet(context) {
  const { params, env, json, getUser } = context;
  const slug = params.slug;
  const user = await getUser();

  const db = env.DB;
  if (!db) {
    // Mock response
    return json({
      course: {
        id: "crs_java_app",
        slug,
        title: "App Development with Java (Native Android)",
        description: "Master Android app development using Java & XML. Build 5 production-ready mobile apps from scratch.",
        category: "Mobile Development",
        level: "Beginner → Intermediate",
        price: 1499,
        is_free: 0,
        badge: "Bestseller",
        instructor: "Sahariyar Ahamad"
      },
      curriculum: [
        { id: "cur_01", module_title: "Module 1: Android Studio & Setup", lesson_title: "1.1 Installing Android Studio & SDK Configuration", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "14m", is_preview: 1 },
        { id: "cur_02", module_title: "Module 1: Android Studio & Setup", lesson_title: "1.2 Understanding Project Structure, Gradle & Manifest", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "18m", is_preview: 1 },
        { id: "cur_03", module_title: "Module 2: Layouts & UI Design", lesson_title: "2.1 ConstraintLayout, LinearLayout & XML Attributes", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "25m", is_preview: 0 },
        { id: "cur_04", module_title: "Module 2: Layouts & UI Design", lesson_title: "2.2 Responsive UI for Multi-Screen Android Devices", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "22m", is_preview: 0 },
        { id: "cur_05", module_title: "Module 3: Java Logic & Activities", lesson_title: "3.1 Activity Lifecycle, Intent & Screen Navigation", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "30m", is_preview: 0 },
        { id: "cur_06", module_title: "Module 3: Java Logic & Activities", lesson_title: "3.2 RecyclerView, Custom Adapters & ViewHolders", video_url: "https://www.youtube.com/embed/fis26HvvDII", duration: "35m", is_preview: 0 }
      ],
      isEnrolled: user?.email === "student@ahama.academy"
    });
  }

  const course = await db.prepare("SELECT * FROM courses WHERE slug = ?").bind(slug).first();
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

  // If not enrolled and not free, hide full video URLs for non-preview lessons for security
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
    isEnrolled
  });
}
