// Resend Transactional Email Helper for Cloudflare Pages Functions
export async function sendEmail({ env, to, subject, html }) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    // Graceful no-op if API key not configured yet
    return { success: false, reason: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "Ahama Academy <noreply@ahama.academy>",
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
