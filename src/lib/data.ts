import { Bindings } from '../types';

export async function getSettings(db: D1Database): Promise<Record<string, string>> {
  const { results } = await db.prepare('SELECT key, value FROM settings').all<{ key: string; value: string }>();
  const map: Record<string, string> = {};
  for (const r of results) map[r.key] = r.value ?? '';
  return map;
}

export async function setSetting(db: D1Database, key: string, value: string) {
  await db.prepare(
    'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP'
  ).bind(key, value).run();
}

// Which pages are enabled (from settings page_* keys)
export function pageEnabled(settings: Record<string, string>, page: string): boolean {
  return settings[`page_${page}`] === '1';
}

// Active social links only (non-empty)
export function activeSocials(settings: Record<string, string>) {
  const platforms = [
    { key: 'social_facebook', name: 'facebook', icon: 'fa-facebook-f', label: 'Facebook' },
    { key: 'social_instagram', name: 'instagram', icon: 'fa-instagram', label: 'Instagram' },
    { key: 'social_whatsapp', name: 'whatsapp', icon: 'fa-whatsapp', label: 'WhatsApp' },
    { key: 'social_twitter', name: 'twitter', icon: 'fa-x-twitter', label: 'Twitter' },
    { key: 'social_youtube', name: 'youtube', icon: 'fa-youtube', label: 'YouTube' },
  ];
  return platforms
    .map((p) => ({ ...p, url: (settings[p.key] || '').trim() }))
    .filter((p) => p.url.length > 0);
}
