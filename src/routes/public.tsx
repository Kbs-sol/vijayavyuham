import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { Bindings, Lang } from '../types';
import { getSettings, pageEnabled } from '../lib/data';
import { renderLayout, escHtml } from '../views/layout';
import {
  homePage, aboutPage, servicesPage, serviceDetailPage,
  blogListPage, blogDetailPage, galleryPage, teamPage, contactPage,
} from '../views/pages';
import { t, loc } from '../lib/i18n';

const app = new Hono<{ Bindings: Bindings }>();

function resolveLang(c: any): Lang {
  const q = c.req.query('lang');
  if (q === 'en' || q === 'te' || q === 'hi') {
    // set cookie so it persists
    c.header('Set-Cookie', `vv_lang=${q}; Path=/; Max-Age=${60 * 60 * 24 * 365}`);
    return q;
  }
  const cookie = getCookie(c, 'vv_lang');
  if (cookie === 'en' || cookie === 'te' || cookie === 'hi') return cookie;
  return 'en';
}

async function getActiveServices(db: D1Database) {
  const { results } = await db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all();
  return results as any[];
}

function notEnabled(c: any, settings: Record<string, string>, lang: Lang) {
  return c.html(renderLayout(`
    <section class="page-hero" style="min-height:60vh;display:flex;align-items:center;">
      <div class="container">
        <h1>404</h1>
        <p>${lang === 'te' ? 'ఈ పేజీ అందుబాటులో లేదు.' : lang === 'hi' ? 'यह पृष्ठ उपलब्ध नहीं है।' : 'This page is not available.'}</p>
        <a href="/" class="btn btn-gold" style="margin-top:20px;">${t('nav_home', lang)}</a>
      </div>
    </section>`, {
    title: '404 · Vijayavyuham', description: '', lang, path: '/404', settings,
  }), 404);
}

// ---------- HOME ----------
app.get('/', async (c) => {
  const lang = resolveLang(c);
  const settings = await getSettings(c.env.DB);
  const services = await getActiveServices(c.env.DB);
  const blogs = pageEnabled(settings, 'blog')
    ? (await c.env.DB.prepare('SELECT * FROM blogs WHERE is_published = 1 ORDER BY published_at DESC LIMIT 3').all()).results as any[]
    : [];
  const testimonials = (await c.env.DB.prepare('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 2').all()).results as any[];

  const title = `Vijayavyuham · ${lang === 'te' ? 'తెలుగు రాష్ట్రాల రాజకీయ ప్రచార భాగస్వామి' : lang === 'hi' ? 'तेलुगु राज्यों का राजनीतिक अभियान भागीदार' : 'Political Campaign Consultancy for Telangana & Andhra Pradesh'}`;
  const desc = settings[`meta_description_${lang}`] || settings.meta_description_en || '';

  return c.html(renderLayout(homePage(lang, settings, services, blogs, testimonials), {
    title, description: desc, lang, path: '/', settings,
    keywords: settings.meta_keywords,
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'WebSite', name: 'Vijayavyuham',
      url: 'https://vijayavyuham.pages.dev',
    }],
  }));
});

// ---------- ABOUT ----------
app.get('/about', async (c) => {
  const lang = resolveLang(c);
  const settings = await getSettings(c.env.DB);
  if (!pageEnabled(settings, 'about')) return notEnabled(c, settings, lang);
  const title = `${t('nav_about', lang)} · Vijayavyuham`;
  return c.html(renderLayout(aboutPage(lang, settings), {
    title, description: settings[`about_body_${lang}`]?.slice(0, 160) || '', lang, path: '/about', settings,
    keywords: settings.meta_keywords,
  }));
});

// ---------- SERVICES ----------
app.get('/services', async (c) => {
  const lang = resolveLang(c);
  const settings = await getSettings(c.env.DB);
  if (!pageEnabled(settings, 'services')) return notEnabled(c, settings, lang);
  const services = await getActiveServices(c.env.DB);
  const title = `${t('nav_services', lang)} · Vijayavyuham`;
  const desc = lang === 'te' ? 'రాజకీయ సర్వే, ఓటర్ మ్యాపింగ్, బూత్ నిర్వహణ, సోషల్ మీడియా, IVR, వాట్సాప్ మరియు AI వీడియో సందేశం.' : lang === 'hi' ? 'राजनीतिक सर्वेक्षण, मतदाता मानचित्रण, बूथ प्रबंधन, सोशल मीडिया, IVR, व्हाट्सएप और AI वीडियो।' : 'Political survey & research, voter mapping, booth management, social media campaigns, IVR bulk calls, WhatsApp outreach, AI video messaging and more — for Telangana & Andhra Pradesh.';

  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem', position: i + 1, name: loc(s, 'title', lang),
      url: `https://vijayavyuham.pages.dev/services/${s.slug}`,
    })),
  };
  return c.html(renderLayout(servicesPage(lang, settings, services), {
    title, description: desc, lang, path: '/services', settings,
    keywords: settings.meta_keywords, jsonLd: [itemListLd],
  }));
});

// ---------- SERVICE DETAIL ----------
app.get('/services/:slug', async (c) => {
  const lang = resolveLang(c);
  const settings = await getSettings(c.env.DB);
  if (!pageEnabled(settings, 'services')) return notEnabled(c, settings, lang);
  const slug = c.req.param('slug');
  const s = await c.env.DB.prepare('SELECT * FROM services WHERE slug = ? AND is_active = 1').bind(slug).first();
  if (!s) return notEnabled(c, settings, lang);
  const others = (await c.env.DB.prepare('SELECT * FROM services WHERE is_active = 1 AND slug != ? ORDER BY sort_order ASC LIMIT 3').bind(slug).all()).results as any[];

  const title = `${loc(s, 'title', lang)} · Vijayavyuham`;
  const desc = loc(s, 'short', lang);
  const serviceLd = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: loc(s, 'title', lang), description: loc(s, 'description', lang),
    provider: { '@type': 'Organization', name: 'Vijayavyuham' },
    areaServed: ['Telangana', 'Andhra Pradesh'],
    serviceType: 'Political Campaign Consulting',
  };
  return c.html(renderLayout(serviceDetailPage(lang, settings, s, others), {
    title, description: desc, lang, path: `/services/${slug}`, settings,
    keywords: `${loc(s, 'title', 'en')}, ${settings.meta_keywords}`, jsonLd: [serviceLd],
  }));
});

// ---------- BLOG ----------
app.get('/blog', async (c) => {
  const lang = resolveLang(c);
  const settings = await getSettings(c.env.DB);
  if (!pageEnabled(settings, 'blog')) return notEnabled(c, settings, lang);
  const blogs = (await c.env.DB.prepare('SELECT * FROM blogs WHERE is_published = 1 ORDER BY published_at DESC').all()).results as any[];
  const title = `${t('nav_blog', lang)} · Vijayavyuham`;
  return c.html(renderLayout(blogListPage(lang, settings, blogs), {
    title, description: 'Insights on political campaign strategy, voter research, and digital politics in Telangana and Andhra Pradesh.', lang, path: '/blog', settings,
    keywords: settings.meta_keywords,
  }));
});

app.get('/blog/:slug', async (c) => {
  const lang = resolveLang(c);
  const settings = await getSettings(c.env.DB);
  if (!pageEnabled(settings, 'blog')) return notEnabled(c, settings, lang);
  const slug = c.req.param('slug');
  const b = await c.env.DB.prepare('SELECT * FROM blogs WHERE slug = ? AND is_published = 1').bind(slug).first();
  if (!b) return notEnabled(c, settings, lang);
  const related = (await c.env.DB.prepare('SELECT * FROM blogs WHERE is_published = 1 AND slug != ? ORDER BY published_at DESC LIMIT 3').bind(slug).all()).results as any[];

  const title = (b.meta_title as string) || `${loc(b, 'title', lang)} · Vijayavyuham`;
  const desc = (b.meta_description as string) || loc(b, 'excerpt', lang);
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: loc(b, 'title', lang), description: loc(b, 'excerpt', lang),
    author: { '@type': 'Organization', name: (b.author as string) || 'Vijayavyuham' },
    publisher: { '@type': 'Organization', name: 'Vijayavyuham', logo: { '@type': 'ImageObject', url: 'https://vijayavyuham.pages.dev/static/logo.png' } },
    datePublished: b.published_at, ...(b.cover_image ? { image: b.cover_image } : {}),
  };
  return c.html(renderLayout(blogDetailPage(lang, settings, b, related), {
    title, description: desc, lang, path: `/blog/${slug}`, settings,
    keywords: (b.keywords as string) || settings.meta_keywords,
    ogImage: (b.cover_image as string) || undefined, jsonLd: [articleLd],
  }));
});

// ---------- GALLERY ----------
app.get('/gallery', async (c) => {
  const lang = resolveLang(c);
  const settings = await getSettings(c.env.DB);
  if (!pageEnabled(settings, 'gallery')) return notEnabled(c, settings, lang);
  const items = (await c.env.DB.prepare('SELECT * FROM gallery WHERE is_active = 1 ORDER BY sort_order ASC, id DESC').all()).results as any[];
  const title = `${t('nav_gallery', lang)} · Vijayavyuham`;
  return c.html(renderLayout(galleryPage(lang, settings, items), {
    title, description: 'Vijayavyuham campaign work, events, and field operations across Telangana and Andhra Pradesh.', lang, path: '/gallery', settings,
  }));
});

// ---------- TEAM ----------
app.get('/team', async (c) => {
  const lang = resolveLang(c);
  const settings = await getSettings(c.env.DB);
  if (!pageEnabled(settings, 'team')) return notEnabled(c, settings, lang);
  const members = (await c.env.DB.prepare('SELECT * FROM team WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all()).results as any[];
  const title = `${t('nav_team', lang)} · Vijayavyuham`;
  return c.html(renderLayout(teamPage(lang, settings, members), {
    title, description: 'Meet the Vijayavyuham team — political strategists, researchers, and field experts serving the Telugu states.', lang, path: '/team', settings,
  }));
});

// ---------- CONTACT ----------
app.get('/contact', async (c) => {
  const lang = resolveLang(c);
  const settings = await getSettings(c.env.DB);
  if (!pageEnabled(settings, 'contact')) return notEnabled(c, settings, lang);
  const services = await getActiveServices(c.env.DB);
  const title = `${t('contact_us', lang)} · Vijayavyuham`;
  return c.html(renderLayout(contactPage(lang, settings, services), {
    title, description: 'Contact Vijayavyuham for political campaign strategy, voter research, and election management across Telangana and Andhra Pradesh.', lang, path: '/contact', settings,
    keywords: settings.meta_keywords,
  }));
});

// ---------- SEO: sitemap & robots ----------
app.get('/sitemap.xml', async (c) => {
  const settings = await getSettings(c.env.DB);
  const base = 'https://vijayavyuham.pages.dev';
  const urls: string[] = ['/'];
  ['about', 'services', 'blog', 'gallery', 'team', 'contact'].forEach((p) => { if (pageEnabled(settings, p)) urls.push('/' + p); });
  const services = await getActiveServices(c.env.DB);
  if (pageEnabled(settings, 'services')) services.forEach((s) => urls.push('/services/' + s.slug));
  if (pageEnabled(settings, 'blog')) {
    const blogs = (await c.env.DB.prepare('SELECT slug FROM blogs WHERE is_published = 1').all()).results as any[];
    blogs.forEach((b) => urls.push('/blog/' + b.slug));
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u === '/' ? '' : u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;
  return c.body(xml, 200, { 'Content-Type': 'application/xml' });
});

app.get('/robots.txt', (c) => {
  return c.body(`User-agent: *
Allow: /
Disallow: /studio
Disallow: /api/admin

Sitemap: https://vijayavyuham.pages.dev/sitemap.xml
`, 200, { 'Content-Type': 'text/plain' });
});

export default app;
