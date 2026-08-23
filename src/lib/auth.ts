import { Context, Next } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { Bindings, resolveAdminUsers } from '../types';

// ============================================================
// Stateless, signed-cookie admin sessions.
// ------------------------------------------------------------
// The session is a JSON payload signed with HMAC-SHA256 using
// SESSION_SECRET. NOTHING is stored server-side, so admin login
// works even when NO database (Supabase) is connected.
// ============================================================

const COOKIE_NAME = 'vv_admin_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

// Fallback secret so the demo works out of the box. Override with
// the SESSION_SECRET Cloudflare secret in production.
const DEFAULT_SECRET = 'vijayavyuham-default-session-secret-change-me';

function secretOf(c: Context<{ Bindings: Bindings }>): string {
  return c.env.SESSION_SECRET || DEFAULT_SECRET;
}

// base64url helpers (Workers-safe, no Buffer)
function b64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlEncodeStr(s: string): string {
  return b64urlEncode(new TextEncoder().encode(s));
}
function b64urlDecodeStr(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '==='.slice((b64.length + 3) % 4));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return b64urlEncode(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

interface SessionPayload {
  username: string;
  role: 'developer' | 'manager';
  displayName: string;
  exp: number; // epoch ms
}

async function signToken(secret: string, payload: SessionPayload): Promise<string> {
  const body = b64urlEncodeStr(JSON.stringify(payload));
  const sig = await hmac(secret, body);
  return `${body}.${sig}`;
}

async function verifyToken(secret: string, token: string): Promise<SessionPayload | null> {
  const dot = token.lastIndexOf('.');
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(secret, body);
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(b64urlDecodeStr(body)) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function login(c: Context<{ Bindings: Bindings }>, username: string, password: string) {
  const users = resolveAdminUsers(c.env);
  const user = users[username.toLowerCase()];
  if (!user || user.password !== password) return null;

  const payload: SessionPayload = {
    username: username.toLowerCase(),
    role: user.role,
    displayName: user.displayName,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const token = await signToken(secretOf(c), payload);

  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
  return { username: payload.username, role: user.role, displayName: user.displayName };
}

export async function logout(c: Context<{ Bindings: Bindings }>) {
  deleteCookie(c, COOKIE_NAME, { path: '/' });
}

export async function getSession(c: Context<{ Bindings: Bindings }>) {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return null;
  const payload = await verifyToken(secretOf(c), token);
  if (!payload) return null;
  return { username: payload.username, role: payload.role, displayName: payload.displayName };
}

// Middleware: require an authenticated admin for API routes
export async function requireAuth(c: Context<{ Bindings: Bindings }>, next: Next) {
  const session = await getSession(c);
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  c.set('session' as never, session as never);
  await next();
}
