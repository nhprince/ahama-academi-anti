export async function onRequestGet(context) {
  const { params, env, json } = context;
  const quizId = params.id;
  const db = env.ahama_db_anti || env.DB;

  if (!db) {
    return json({
      quiz: {
        id: quizId,
        title: "Android Fundamentals & Activity Lifecycle Quiz",
        passing_score: 75,
        questions: [
          { id: "q1", question: "Which file declares all activities and application permissions in an Android project?", options: ["build.gradle", "AndroidManifest.xml", "strings.xml", "MainActivity.java"], explanation: "AndroidManifest.xml is the central manifest declaring components and permissions." },
          { id: "q2", question: "Which lifecycle method is called right before an activity becomes visible to the user?", options: ["onCreate()", "onStart()", "onResume()", "onPause()"], explanation: "onStart() makes the activity visible." },
          { id: "q3", question: "Why is RecyclerView preferred over ListView in modern Android?", options: ["RecyclerView is older", "RecyclerView recycles ViewHolders to preserve RAM", "ListView does not support scrolling", "RecyclerView requires no adapter"], explanation: "RecyclerView reuses view items as they scroll off-screen, preventing memory lag." }
        ]
      }
    });
  }

  const quiz = await db.prepare("SELECT * FROM quizzes WHERE id = ?").bind(quizId).first();
  if (!quiz) {
    return json({ error: "Quiz not found" }, 404);
  }

  const rawQuestions = JSON.parse(quiz.questions_json || "[]");
  // Omit correct_idx on GET to prevent cheating
  const safeQuestions = rawQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  return json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      passing_score: quiz.passing_score,
      questions: safeQuestions
    }
  });
}

export async function onRequestPost(context) {
  const { params, request, env, json, getUser } = context;
  const quizId = params.id;
  const user = await getUser();
  const { answers } = await request.json(); // { q1: 1, q2: 1, ... }

  const db = env.ahama_db_anti || env.DB;
  if (!db) {
    return json({
      score: 100,
      passed: true,
      message: "Quiz Passed! (Demo Mode)"
    });
  }

  const quiz = await db.prepare("SELECT * FROM quizzes WHERE id = ?").bind(quizId).first();
  if (!quiz) return json({ error: "Quiz not found" }, 404);

  const rawQuestions = JSON.parse(quiz.questions_json || "[]");
  let correct = 0;
  const results = rawQuestions.map(q => {
    const studentChoice = answers ? answers[q.id] : null;
    const isCorrect = studentChoice === q.correct_idx;
    if (isCorrect) correct++;
    return {
      id: q.id,
      correct: isCorrect,
      correct_idx: q.correct_idx,
      explanation: q.explanation
    };
  });

  const scorePct = Math.round((correct / rawQuestions.length) * 100);
  const passed = scorePct >= quiz.passing_score;

  if (user) {
    const subId = "sub_" + Date.now().toString(36);
    await db.prepare(`
      INSERT INTO quiz_submissions (id, user_id, quiz_id, score, passed)
      VALUES (?, ?, ?, ?, ?)
    `).bind(subId, user.id, quizId, scorePct, passed ? 1 : 0).run();
  }

  return json({
    score: scorePct,
    passed,
    results,
    message: passed ? `Congratulations! You passed with ${scorePct}%.` : `Score: ${scorePct}%. You need ${quiz.passing_score}% to pass. Try again!`
  });
}
