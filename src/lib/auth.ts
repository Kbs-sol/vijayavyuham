import { Context, Next } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { Bindings, ADMIN_USERS } from '../types';

const COOKIE_NAME = 'vv_admin_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

function genToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function login(c: Context<{ Bindings: Bindings }>, username: string, password: string) {
  const user = ADMIN_USERS[username.toLowerCase()];
  if (!user || user.password !== password) {
    return null;
  }
  const token = genToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  await c.env.DB.prepare(
    'INSERT INTO admin_sessions (token, username, role, expires_at) VALUES (?, ?, ?, ?)'
  ).bind(token, username.toLowerCase(), user.role, expiresAt).run();

  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
  return { username: username.toLowerCase(), role: user.role, displayName: user.displayName };
}

export async function logout(c: Context<{ Bindings: Bindings }>) {
  const token = getCookie(c, COOKIE_NAME);
  if (token) {
    await c.env.DB.prepare('DELETE FROM admin_sessions WHERE token = ?').bind(token).run();
  }
  deleteCookie(c, COOKIE_NAME, { path: '/' });
}

export async function getSession(c: Context<{ Bindings: Bindings }>) {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return null;
  const row = await c.env.DB.prepare(
    'SELECT username, role, expires_at FROM admin_sessions WHERE token = ?'
  ).bind(token).first<{ username: string; role: string; expires_at: string }>();
  if (!row) return null;
  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    await c.env.DB.prepare('DELETE FROM admin_sessions WHERE token = ?').bind(token).run();
    return null;
  }
  const user = ADMIN_USERS[row.username];
  return { username: row.username, role: row.role, displayName: user?.displayName || row.username };
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
