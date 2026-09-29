// Edge-compatible authentication helpers using Web Crypto.
// Secrets are supplied by Cloudflare environment variables; nothing sensitive is hard-coded.

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function requireSecret(secret: string | undefined): string {
  if (!secret) throw new Error('AUTH_SECRET is not configured');
  return secret;
}

export async function signSession(username: string, secret: string): Promise<string> {
  const sessionSecret = requireSecret(secret);
  const data = username + ':' + Date.now();
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(sessionSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const sigHex = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return btoa(data) + '.' + sigHex;
}

export async function verifySession(token: string | undefined, secret: string | undefined): Promise<boolean> {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  try {
    const sessionSecret = requireSecret(secret);
    const payloadBase64 = parts[0];
    const sigHex = parts[1];
    const data = atob(payloadBase64);
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(sessionSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const sigPairs = sigHex.match(/.{1,2}/g);
    if (!sigPairs || sigPairs.length !== 32 || sigPairs.some((byte) => !/^[0-9a-f]{2}$/i.test(byte))) return false;
    const sigBytes = new Uint8Array(sigPairs.map((byte) => parseInt(byte, 16)));
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data));
    if (!isValid) return false;
    const separator = data.lastIndexOf(':');
    if (separator < 1) return false;
    const timestamp = Number(data.slice(separator + 1));
    if (!Number.isFinite(timestamp) || timestamp <= 0) return false;
    const age = Date.now() - timestamp;
    if (age > SESSION_TTL_MS || age < -60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}
