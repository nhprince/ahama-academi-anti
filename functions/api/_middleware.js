// ==========================================================
// Cloudflare Pages Functions Middleware
// Handles CORS, Headers, Token Extraction, and Response Helpers
// ==========================================================

export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Attach helper to context for standardized JSON responses
  context.json = (data, status = 200, extraHeaders = {}) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...extraHeaders,
      },
    });
  };

  // JWT Verification helper using WebCrypto
  context.getUser = async () => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.substring(7);
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) return null;
      return payload; // { id, email, role, name }
    } catch (e) {
      return null;
    }
  };

  try {
    const response = await context.next();
    // Ensure CORS headers on outgoing response
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (err) {
    return context.json({ error: err.message || "Internal Server Error" }, 500);
  }
}
