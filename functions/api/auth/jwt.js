// Minimal WebCrypto JWT signing & SHA-256 hashing for Cloudflare Edge
const JWT_SECRET = "ahama-academy-edge-secret-key-2026";

export async function hashPassword(password) {
  const enc = new TextEncoder();
  const hashBuf = await crypto.subtle.digest("SHA-256", enc.encode(password));
  return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function createJwt(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
  const fullPayload = { ...payload, exp };

  const enc = new TextEncoder();
  const b64Header = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const b64Payload = btoa(JSON.stringify(fullPayload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const dataToSign = `${b64Header}.${b64Payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign));
  const b64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  return `${dataToSign}.${b64Sig}`;
}
