import { Hono } from 'hono';
import { Bindings } from '../types';
import { login, logout, getSession, requireAuth } from '../lib/auth';
import { setSetting, getSettings } from '../lib/data';

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
  return c.json({ user: session });
});

// All routes below require auth
api.use('/*', requireAuth);

// ---------- SETTINGS ----------
api.get('/settings', async (c) => {
  const settings = await getSettings(c.env.DB);
  return c.json({ settings });
});

api.post('/settings', async (c) => {
  const body = await c.req.json<Record<string, string>>();
  for (const [key, value] of Object.entries(body)) {
    await setSetting(c.env.DB, key, String(value ?? ''));
  }
  return c.json({ ok: true });
});

// ---------- Generic helpers ----------
function nowStamp() { return new Date().toISOString(); }

// ---------- SERVICES ----------
api.get('/services', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM services ORDER BY sort_order ASC, id ASC').all();
  return c.json({ items: results });
});
api.get('/services/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ item: row });
});
api.post('/services', async (c) => {
  const b = await c.req.json();
  const r = await c.env.DB.prepare(
    `INSERT INTO services (slug, sort_order, icon, title_en, short_en, description_en, title_te, short_te, description_te, title_hi, short_hi, description_hi, features, image_url, is_active)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    b.slug, b.sort_order || 0, b.icon || 'fa-chart-line', b.title_en, b.short_en, b.description_en,
    b.title_te, b.short_te, b.description_te, b.title_hi, b.short_hi, b.description_hi,
    b.features || '[]', b.image_url || null, b.is_active ?? 1
  ).run();
  return c.json({ ok: true, id: r.meta.last_row_id });
});
api.put('/services/:id', async (c) => {
  const b = await c.req.json();
  await c.env.DB.prepare(
    `UPDATE services SET slug=?, sort_order=?, icon=?, title_en=?, short_en=?, description_en=?, title_te=?, short_te=?, description_te=?, title_hi=?, short_hi=?, description_hi=?, features=?, image_url=?, is_active=?, updated_at=? WHERE id=?`
  ).bind(
    b.slug, b.sort_order || 0, b.icon || 'fa-chart-line', b.title_en, b.short_en, b.description_en,
    b.title_te, b.short_te, b.description_te, b.title_hi, b.short_hi, b.description_hi,
    b.features || '[]', b.image_url || null, b.is_active ?? 1, nowStamp(), c.req.param('id')
  ).run();
  return c.json({ ok: true });
});
api.delete('/services/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM services WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ ok: true });
});

// ---------- BLOGS ----------
api.get('/blogs', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM blogs ORDER BY published_at DESC, id DESC').all();
  return c.json({ items: results });
});
api.get('/blogs/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ item: row });
});
api.post('/blogs', async (c) => {
  const b = await c.req.json();
  const r = await c.env.DB.prepare(
    `INSERT INTO blogs (slug, category, cover_image, author, title_en, excerpt_en, content_en, title_te, excerpt_te, content_te, title_hi, excerpt_hi, content_hi, meta_title, meta_description, keywords, is_published, published_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    b.slug, b.category || 'General', b.cover_image || null, b.author || 'Vijayavyuham Team',
    b.title_en, b.excerpt_en, b.content_en, b.title_te, b.excerpt_te, b.content_te,
    b.title_hi, b.excerpt_hi, b.content_hi, b.meta_title, b.meta_description, b.keywords,
    b.is_published ?? 1, b.published_at || nowStamp()
  ).run();
  return c.json({ ok: true, id: r.meta.last_row_id });
});
api.put('/blogs/:id', async (c) => {
  const b = await c.req.json();
  await c.env.DB.prepare(
    `UPDATE blogs SET slug=?, category=?, cover_image=?, author=?, title_en=?, excerpt_en=?, content_en=?, title_te=?, excerpt_te=?, content_te=?, title_hi=?, excerpt_hi=?, content_hi=?, meta_title=?, meta_description=?, keywords=?, is_published=?, updated_at=? WHERE id=?`
  ).bind(
    b.slug, b.category || 'General', b.cover_image || null, b.author || 'Vijayavyuham Team',
    b.title_en, b.excerpt_en, b.content_en, b.title_te, b.excerpt_te, b.content_te,
    b.title_hi, b.excerpt_hi, b.content_hi, b.meta_title, b.meta_description, b.keywords,
    b.is_published ?? 1, nowStamp(), c.req.param('id')
  ).run();
  return c.json({ ok: true });
});
api.delete('/blogs/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM blogs WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ ok: true });
});

// ---------- GALLERY ----------
api.get('/gallery', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM gallery ORDER BY sort_order ASC, id DESC').all();
  return c.json({ items: results });
});
api.post('/gallery', async (c) => {
  const b = await c.req.json();
  const r = await c.env.DB.prepare(
    `INSERT INTO gallery (image_url, category, sort_order, title_en, title_te, title_hi, caption_en, caption_te, caption_hi, is_active)
     VALUES (?,?,?,?,?,?,?,?,?,?)`
  ).bind(b.image_url, b.category || 'General', b.sort_order || 0, b.title_en, b.title_te, b.title_hi, b.caption_en, b.caption_te, b.caption_hi, b.is_active ?? 1).run();
  return c.json({ ok: true, id: r.meta.last_row_id });
});
api.put('/gallery/:id', async (c) => {
  const b = await c.req.json();
  await c.env.DB.prepare(
    `UPDATE gallery SET image_url=?, category=?, sort_order=?, title_en=?, title_te=?, title_hi=?, caption_en=?, caption_te=?, caption_hi=?, is_active=? WHERE id=?`
  ).bind(b.image_url, b.category || 'General', b.sort_order || 0, b.title_en, b.title_te, b.title_hi, b.caption_en, b.caption_te, b.caption_hi, b.is_active ?? 1, c.req.param('id')).run();
  return c.json({ ok: true });
});
api.delete('/gallery/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM gallery WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ ok: true });
});

// ---------- TEAM ----------
api.get('/team', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM team ORDER BY sort_order ASC, id ASC').all();
  return c.json({ items: results });
});
api.post('/team', async (c) => {
  const b = await c.req.json();
  const r = await c.env.DB.prepare(
    `INSERT INTO team (name, photo_url, sort_order, role_en, role_te, role_hi, bio_en, bio_te, bio_hi, linkedin, twitter, email, is_active)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(b.name, b.photo_url, b.sort_order || 0, b.role_en, b.role_te, b.role_hi, b.bio_en, b.bio_te, b.bio_hi, b.linkedin, b.twitter, b.email, b.is_active ?? 1).run();
  return c.json({ ok: true, id: r.meta.last_row_id });
});
api.put('/team/:id', async (c) => {
  const b = await c.req.json();
  await c.env.DB.prepare(
    `UPDATE team SET name=?, photo_url=?, sort_order=?, role_en=?, role_te=?, role_hi=?, bio_en=?, bio_te=?, bio_hi=?, linkedin=?, twitter=?, email=?, is_active=? WHERE id=?`
  ).bind(b.name, b.photo_url, b.sort_order || 0, b.role_en, b.role_te, b.role_hi, b.bio_en, b.bio_te, b.bio_hi, b.linkedin, b.twitter, b.email, b.is_active ?? 1, c.req.param('id')).run();
  return c.json({ ok: true });
});
api.delete('/team/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM team WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ ok: true });
});

// ---------- TESTIMONIALS ----------
api.get('/testimonials', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC').all();
  return c.json({ items: results });
});
api.post('/testimonials', async (c) => {
  const b = await c.req.json();
  const r = await c.env.DB.prepare(
    `INSERT INTO testimonials (author_name, author_role, photo_url, sort_order, quote_en, quote_te, quote_hi, is_active) VALUES (?,?,?,?,?,?,?,?)`
  ).bind(b.author_name, b.author_role, b.photo_url, b.sort_order || 0, b.quote_en, b.quote_te, b.quote_hi, b.is_active ?? 1).run();
  return c.json({ ok: true, id: r.meta.last_row_id });
});
api.put('/testimonials/:id', async (c) => {
  const b = await c.req.json();
  await c.env.DB.prepare(
    `UPDATE testimonials SET author_name=?, author_role=?, photo_url=?, sort_order=?, quote_en=?, quote_te=?, quote_hi=?, is_active=? WHERE id=?`
  ).bind(b.author_name, b.author_role, b.photo_url, b.sort_order || 0, b.quote_en, b.quote_te, b.quote_hi, b.is_active ?? 1, c.req.param('id')).run();
  return c.json({ ok: true });
});
api.delete('/testimonials/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM testimonials WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ ok: true });
});

// ---------- ENQUIRIES ----------
api.get('/enquiries', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all();
  return c.json({ items: results });
});
api.put('/enquiries/:id', async (c) => {
  const b = await c.req.json();
  await c.env.DB.prepare('UPDATE enquiries SET status=?, is_read=? WHERE id=?')
    .bind(b.status || 'new', b.is_read ?? 1, c.req.param('id')).run();
  return c.json({ ok: true });
});
api.delete('/enquiries/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM enquiries WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ ok: true });
});

// ---------- DASHBOARD STATS ----------
api.get('/stats', async (c) => {
  const services = await c.env.DB.prepare('SELECT COUNT(*) as n FROM services').first<{ n: number }>();
  const blogs = await c.env.DB.prepare('SELECT COUNT(*) as n FROM blogs').first<{ n: number }>();
  const gallery = await c.env.DB.prepare('SELECT COUNT(*) as n FROM gallery').first<{ n: number }>();
  const team = await c.env.DB.prepare('SELECT COUNT(*) as n FROM team').first<{ n: number }>();
  const enquiries = await c.env.DB.prepare('SELECT COUNT(*) as n FROM enquiries').first<{ n: number }>();
  const unread = await c.env.DB.prepare('SELECT COUNT(*) as n FROM enquiries WHERE is_read = 0').first<{ n: number }>();
  return c.json({
    services: services?.n || 0,
    blogs: blogs?.n || 0,
    gallery: gallery?.n || 0,
    team: team?.n || 0,
    enquiries: enquiries?.n || 0,
    unread: unread?.n || 0,
  });
});

export default api;
