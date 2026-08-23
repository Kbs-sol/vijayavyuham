// ============================================================
// Environment bindings (Cloudflare Pages)
// ------------------------------------------------------------
// EVERYTHING here is OPTIONAL. When Supabase env vars are absent
// the app falls back to a built-in offline store so the site is
// fully demonstrable with ZERO services connected. Add these as
// Cloudflare secrets / environment variables to go live — never
// hardcode them in the repo.
// ============================================================
export type Bindings = {
  // Supabase (database). If unset -> offline in-memory store.
  SUPABASE_URL?: string;          // https://<project-ref>.supabase.co
  SUPABASE_SERVICE_KEY?: string;  // service_role key (server-side only, keep secret)

  // Secret used to sign stateless admin session cookies (HMAC).
  // If unset a safe built-in default is used (fine for the demo,
  // set your own in production).
  SESSION_SECRET?: string;

  // Optional: override the hardcoded admin credentials via secrets.
  ADMIN_DEV_PASSWORD?: string;
  ADMIN_MGR_PASSWORD?: string;

  // Optional: Cloudinary cloud name (used only to build/validate
  // embed URLs on the client; images/videos are pasted as links).
  CLOUDINARY_CLOUD_NAME?: string;
};

export type Lang = 'en' | 'te' | 'hi';

export interface AdminUser {
  username: string;
  role: 'developer' | 'manager';
  displayName: string;
}

// Default hardcoded credentials for testing the admin dashboard.
// Both roles get maximum access as requested. Passwords can be
// overridden with the ADMIN_DEV_PASSWORD / ADMIN_MGR_PASSWORD
// Cloudflare secrets without touching code.
export const ADMIN_USERS: Record<string, { password: string; role: 'developer' | 'manager'; displayName: string }> = {
  'developer': { password: 'Vijaya@Dev2025', role: 'developer', displayName: 'Developer' },
  'manager': { password: 'Vijaya@Mgr2025', role: 'manager', displayName: 'Website Manager' },
};

// Resolve effective credentials, allowing secret overrides.
export function resolveAdminUsers(env: Bindings): typeof ADMIN_USERS {
  const users = {
    developer: { ...ADMIN_USERS.developer },
    manager: { ...ADMIN_USERS.manager },
  };
  if (env.ADMIN_DEV_PASSWORD) users.developer.password = env.ADMIN_DEV_PASSWORD;
  if (env.ADMIN_MGR_PASSWORD) users.manager.password = env.ADMIN_MGR_PASSWORD;
  return users;
}
