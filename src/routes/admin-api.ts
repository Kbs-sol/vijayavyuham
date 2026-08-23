import { Hono } from 'hono';
import { Bindings } from '../types';
import { login, logout, getSession, requireAuth } from '../lib/auth';
import { getStore, storeMode } from '../lib/store';

const api = new Hono<{ Bindings: Bindings }>();

// ---------- AUTH ----------
api.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  const user = await login(c, username || '', password || '');
  if (!user) return c.json({ error: 'Invalid credentials' }, 401);
  return c.json({ ok: true, user });
});

api.post('/logout', async (c) => {
  await logout(c);
  return c.json({ ok: true });
});

api.get('/me', async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: 'Unauthorized' }, 401);
  return c.json({ user: session, storage: storeMode(c.env) });
});

// All routes below require auth
api.use('/*', requireAuth);

// ---------- SETTINGS ----------
api.get('/settings', async (c) => {
  const settings = await getStore(c.env).getSettings();
  return c.json({ settings });
});

api.post('/settings', async (c) => {
  const body = await c.req.json<Record<string, string>>();
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) clean[k] = String(v ?? '');
  await getStore(c.env).setSettings(clean);
  return c.json({ ok: true });
});

// ---------- SERVICES ----------
api.get('/services', async (c) => {
  const items = await getStore(c.env).list('services', { orderBy: [['sort_order', 'asc'], ['id', 'asc']] });
  return c.json({ items });
});
api.get('/services/:id', async (c) => {
  const item = await getStore(c.env).get('services', c.req.param('id'));
  return c.json({ item });
});
api.post('/services', async (c) => {
  const b = await c.req.json();
  const r = await getStore(c.env).insert('services', serviceFields(b));
  return c.json({ ok: true, id: r.id });
});
api.put('/services/:id', async (c) => {
  const b = await c.req.json();
  await getStore(c.env).update('services', c.req.param('id'), { ...serviceFields(b), updated_at: new Date().toISOString() });
  return c.json({ ok: true });
});
api.delete('/services/:id', async (c) => {
  await getStore(c.env).remove('services', c.req.param('id'));
  return c.json({ ok: true });
});

function serviceFields(b: any) {
  return {
    slug: b.slug,
    sort_order: Number(b.sort_order) || 0,
    icon: b.icon || 'fa-chart-line',
    title_en: b.title_en, short_en: b.short_en, description_en: b.description_en,
    title_te: b.title_te, short_te: b.short_te, description_te: b.description_te,
    title_hi: b.title_hi, short_hi: b.short_hi, description_hi: b.description_hi,
    features: b.features || '[]',
    image_url: b.image_url || null,
    media_url: b.media_url || null,
    is_active: b.is_active ?? 1,
  };
}

// ---------- BLOGS ----------
api.get('/blogs', async (c) => {
  const items = await getStore(c.env).list('blogs', { orderBy: [['published_at', 'desc'], ['id', 'desc']] });
  return c.json({ items });
});
api.get('/blogs/:id', async (c) => {
  const item = await getStore(c.env).get('blogs', c.req.param('id'));
  return c.json({ item });
});
api.post('/blogs', async (c) => {
  const b = await c.req.json();
  const r = await getStore(c.env).insert('blogs', { ...blogFields(b), published_at: b.published_at || new Date().toISOString() });
  return c.json({ ok: true, id: r.id });
});
api.put('/blogs/:id', async (c) => {
  const b = await c.req.json();
  await getStore(c.env).update('blogs', c.req.param('id'), { ...blogFields(b), updated_at: new Date().toISOString() });
  return c.json({ ok: true });
});
api.delete('/blogs/:id', async (c) => {
  await getStore(c.env).remove('blogs', c.req.param('id'));
  return c.json({ ok: true });
});

function blogFields(b: any) {
  return {
    slug: b.slug,
    category: b.category || 'General',
    cover_image: b.cover_image || null,
    author: b.author || 'Vijayavyuham Team',
    title_en: b.title_en, excerpt_en: b.excerpt_en, content_en: b.content_en,
    title_te: b.title_te, excerpt_te: b.excerpt_te, content_te: b.content_te,
    title_hi: b.title_hi, excerpt_hi: b.excerpt_hi, content_hi: b.content_hi,
    meta_title: b.meta_title, meta_description: b.meta_description, keywords: b.keywords,
    is_published: b.is_published ?? 1,
  };
}

// ---------- GALLERY ----------
api.get('/gallery', async (c) => {
  const items = await getStore(c.env).list('gallery', { orderBy: [['sort_order', 'asc'], ['id', 'desc']] });
  return c.json({ items });
});
api.post('/gallery', async (c) => {
  const b = await c.req.json();
  const r = await getStore(c.env).insert('gallery', galleryFields(b));
  return c.json({ ok: true, id: r.id });
});
api.put('/gallery/:id', async (c) => {
  const b = await c.req.json();
  await getStore(c.env).update('gallery', c.req.param('id'), galleryFields(b));
  return c.json({ ok: true });
});
api.delete('/gallery/:id', async (c) => {
  await getStore(c.env).remove('gallery', c.req.param('id'));
  return c.json({ ok: true });
});

function galleryFields(b: any) {
  return {
    media_url: b.media_url || b.image_url || '',
    media_type: b.media_type || 'auto',
    category: b.category || 'General',
    sort_order: Number(b.sort_order) || 0,
    title_en: b.title_en, title_te: b.title_te, title_hi: b.title_hi,
    caption_en: b.caption_en, caption_te: b.caption_te, caption_hi: b.caption_hi,
    is_active: b.is_active ?? 1,
  };
}

// ---------- TEAM ----------
api.get('/team', async (c) => {
  const items = await getStore(c.env).list('team', { orderBy: [['sort_order', 'asc'], ['id', 'asc']] });
  return c.json({ items });
});
api.post('/team', async (c) => {
  const b = await c.req.json();
  const r = await getStore(c.env).insert('team', teamFields(b));
  return c.json({ ok: true, id: r.id });
});
api.put('/team/:id', async (c) => {
  const b = await c.req.json();
  await getStore(c.env).update('team', c.req.param('id'), teamFields(b));
  return c.json({ ok: true });
});
api.delete('/team/:id', async (c) => {
  await getStore(c.env).remove('team', c.req.param('id'));
  return c.json({ ok: true });
});

function teamFields(b: any) {
  return {
    name: b.name, photo_url: b.photo_url || null, sort_order: Number(b.sort_order) || 0,
    role_en: b.role_en, role_te: b.role_te, role_hi: b.role_hi,
    bio_en: b.bio_en, bio_te: b.bio_te, bio_hi: b.bio_hi,
    linkedin: b.linkedin || null, twitter: b.twitter || null, email: b.email || null,
    is_active: b.is_active ?? 1,
  };
}

// ---------- TESTIMONIALS ----------
api.get('/testimonials', async (c) => {
  const items = await getStore(c.env).list('testimonials', { orderBy: [['sort_order', 'asc'], ['id', 'asc']] });
  return c.json({ items });
});
api.post('/testimonials', async (c) => {
  const b = await c.req.json();
  const r = await getStore(c.env).insert('testimonials', testimonialFields(b));
  return c.json({ ok: true, id: r.id });
});
api.put('/testimonials/:id', async (c) => {
  const b = await c.req.json();
  await getStore(c.env).update('testimonials', c.req.param('id'), testimonialFields(b));
  return c.json({ ok: true });
});
api.delete('/testimonials/:id', async (c) => {
  await getStore(c.env).remove('testimonials', c.req.param('id'));
  return c.json({ ok: true });
});

function testimonialFields(b: any) {
  return {
    author_name: b.author_name, author_role: b.author_role, photo_url: b.photo_url || null,
    sort_order: Number(b.sort_order) || 0,
    quote_en: b.quote_en, quote_te: b.quote_te, quote_hi: b.quote_hi,
    is_active: b.is_active ?? 1,
  };
}

// ---------- ENQUIRIES ----------
api.get('/enquiries', async (c) => {
  const items = await getStore(c.env).list('enquiries', { orderBy: [['created_at', 'desc']] });
  return c.json({ items });
});
api.put('/enquiries/:id', async (c) => {
  const b = await c.req.json();
  await getStore(c.env).update('enquiries', c.req.param('id'), { status: b.status || 'new', is_read: b.is_read ?? 1 });
  return c.json({ ok: true });
});
api.delete('/enquiries/:id', async (c) => {
  await getStore(c.env).remove('enquiries', c.req.param('id'));
  return c.json({ ok: true });
});

// ---------- DASHBOARD STATS ----------
api.get('/stats', async (c) => {
  const store = getStore(c.env);
  const [services, blogs, gallery, team, enquiries, unread] = await Promise.all([
    store.count('services'),
    store.count('blogs'),
    store.count('gallery'),
    store.count('team'),
    store.count('enquiries'),
    store.count('enquiries', { is_read: 0 }),
  ]);
  return c.json({ services, blogs, gallery, team, enquiries, unread, storage: store.mode });
});

export default api;
