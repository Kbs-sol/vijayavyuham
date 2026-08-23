import { Store } from './store';

export async function getSettings(store: Store): Promise<Record<string, string>> {
  return store.getSettings();
}

export async function setSetting(store: Store, key: string, value: string) {
  await store.setSettings({ [key]: value });
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
