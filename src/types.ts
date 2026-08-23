export type Bindings = {
  DB: D1Database;
};

export type Lang = 'en' | 'te' | 'hi';

export interface AdminUser {
  username: string;
  role: 'developer' | 'manager';
  displayName: string;
}

// Hardcoded credentials for testing the admin dashboard.
// Both roles get maximum access as requested.
export const ADMIN_USERS: Record<string, { password: string; role: 'developer' | 'manager'; displayName: string }> = {
  'developer': { password: 'Vijaya@Dev2025', role: 'developer', displayName: 'Developer' },
  'manager': { password: 'Vijaya@Mgr2025', role: 'manager', displayName: 'Website Manager' },
};
