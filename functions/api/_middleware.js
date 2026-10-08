// ==========================================================
// Cloudflare Pages Functions Middleware
// Handles CORS, Headers, Token Extraction, and Response Helpers
// ==========================================================

let latestRequest = null;

export const jsonResponse = (data, status = 200, extraHeaders = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...extraHeaders,
    },
  });
};

export const extractUser = async (req) => {
  const request = req || latestRequest;
  if (!request) return null;
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

// Guarantee availability on any EventContext instance or prototype
try {
  if (!Object.prototype.json) {
    Object.defineProperty(Object.prototype, "json", {
      value: jsonResponse,
      writable: true,
      configurable: true,
    });
  }
  if (!Object.prototype.getUser) {
    Object.defineProperty(Object.prototype, "getUser", {
      value: function() {
        return extractUser(this && this.request ? this.request : latestRequest);
      },
      writable: true,
      configurable: true,
    });
  }
} catch (e) {}

export async function onRequest(context) {
  const { request, env } = context;
  latestRequest = request;

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

  // Attach directly to current context and context prototype
  context.json = jsonResponse;
  context.getUser = () => extractUser(request);

  if (context.data) {
    context.data.json = jsonResponse;
    context.data.getUser = () => extractUser(request);
  }

  const proto = Object.getPrototypeOf(context);
  if (proto && proto !== Object.prototype) {
    proto.json = jsonResponse;
    proto.getUser = function() {
      return extractUser(this && this.request ? this.request : latestRequest);
    };
  }

  try {
    const response = await context.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (err) {
    console.error("Pages Functions execution error:", err);
    return jsonResponse({ error: err.message || "Internal Server Error" }, 500);
  }
}
