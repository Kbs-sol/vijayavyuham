import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { Bindings, Lang } from '../types';
import { getStore } from '../lib/store';
import { pageEnabled } from '../lib/data';
import { renderLayout } from '../views/layout';
import {
  homePage, aboutPage, servicesPage, serviceDetailPage,
  blogListPage, blogDetailPage, galleryPage, teamPage, contactPage,
  faqPage, faqJsonLd,
} from '../views/pages';
import { t, loc } from '../lib/i18n';

const app = new Hono<{ Bindings: Bindings }>();

const SITE_URL = 'https://vijayavyuham.pages.dev';

function resolveLang(c: any): Lang {
  const q = c.req.query('lang');
  if (q === 'en' || q === 'te' || q === 'hi') {
    c.header('Set-Cookie', `vv_lang=${q}; Path=/; Max-Age=${60 * 60 * 24 * 365}`);
    return q;
  }
  const cookie = getCookie(c, 'vv_lang');
  if (cookie === 'en' || cookie === 'te' || cookie === 'hi') return cookie;
  return 'en';
}

async function getActiveServices(store: ReturnType<typeof getStore>) {
  return store.list('services', { where: { is_active: 1 }, orderBy: [['sort_order', 'asc'], ['id', 'asc']] });
}

async function getActiveFaqs(store: ReturnType<typeof getStore>) {
  return store.list('faqs', { where: { is_active: 1 }, orderBy: [['sort_order', 'asc'], ['id', 'asc']] });
}

// BreadcrumbList structured data — helps search engines show breadcrumb rich results
function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
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
  const store = getStore(c.env);
  const settings = await store.getSettings();
  const services = await getActiveServices(store);
  const blogs = pageEnabled(settings, 'blog')
    ? await store.list('blogs', { where: { is_published: 1 }, orderBy: [['published_at', 'desc']], limit: 3 })
    : [];
  const testimonials = await store.list('testimonials', { where: { is_active: 1 }, orderBy: [['sort_order', 'asc']], limit: 2 });
  const faqs = await getActiveFaqs(store);

  const title = `Vijayavyuham · ${lang === 'te' ? 'తెలుగు రాష్ట్రాల రాజకీయ ప్రచార భాగస్వామి' : lang === 'hi' ? 'तेलुगु राज्यों का राजनीतिक अभियान भागीदार' : 'Political Campaign Consultancy for Telangana & Andhra Pradesh'}`;
  const desc = settings[`meta_description_${lang}`] || settings.meta_description_en || '';

  return c.html(renderLayout(homePage(lang, settings, services, blogs, testimonials, faqs), {
    title, description: desc, lang, path: '/', settings,
    keywords: settings.meta_keywords,
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'WebSite', name: 'Vijayavyuham', url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/blog?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      ...(faqs.length ? [faqJsonLd(lang, faqs.slice(0, 5))] : []),
    ],
  }));
});

// ---------- FAQ ----------
app.get('/faq', async (c) => {
  const lang = resolveLang(c);
  const store = getStore(c.env);
  const settings = await store.getSettings();
  const faqs = await getActiveFaqs(store);
  const title = `${t('faq_title', lang)} · Vijayavyuham`;
  const desc = lang === 'te'
    ? 'విజయవ్యూహం రాజకీయ ప్రచార కన్సల్టెన్సీ గురించి తరచుగా అడిగే ప్రశ్నలు — తెలంగాణ & ఆంధ్రప్రదేశ్.'
    : lang === 'hi'
      ? 'विजयव्यूहम राजनीतिक अभियान कंसल्टेंसी के बारे में अक्सर पूछे जाने वाले प्रश्न — तेलंगाना और आंध्र प्रदेश।'
      : 'Frequently asked questions about Vijayavyuham political campaign consultancy — voter research, booth management, digital outreach and elections in Telangana & Andhra Pradesh.';
  return c.html(renderLayout(faqPage(lang, settings, faqs), {
    title, description: desc, lang, path: '/faq', settings,
    keywords: `political consultancy FAQ, election campaign questions Telangana Andhra Pradesh, ${settings.meta_keywords || ''}`,
    jsonLd: [
      breadcrumbLd([{ name: t('nav_home', lang), path: '/' }, { name: t('faq_title', lang), path: '/faq' }]),
      ...(faqs.length ? [faqJsonLd(lang, faqs)] : []),
    ],
  }));
});

// ---------- ABOUT ----------
app.get('/about', async (c) => {
  const lang = resolveLang(c);
  const store = getStore(c.env);
  const settings = await store.getSettings();
  if (!pageEnabled(settings, 'about')) return notEnabled(c, settings, lang);
  const title = `${t('nav_about', lang)} · Vijayavyuham`;
  return c.html(renderLayout(aboutPage(lang, settings), {
    title, description: settings[`about_body_${lang}`]?.slice(0, 160) || '', lang, path: '/about', settings,
    keywords: settings.meta_keywords,
    jsonLd: [breadcrumbLd([{ name: t('nav_home', lang), path: '/' }, { name: t('nav_about', lang), path: '/about' }])],
  }));
});

// ---------- SERVICES ----------
app.get('/services', async (c) => {
  const lang = resolveLang(c);
  const store = getStore(c.env);
  const settings = await store.getSettings();
  if (!pageEnabled(settings, 'services')) return notEnabled(c, settings, lang);
  const services = await getActiveServices(store);
  const title = `${t('nav_services', lang)} · Vijayavyuham`;
  const desc = lang === 'te' ? 'రాజకీయ సర్వే, ఓటర్ మ్యాపింగ్, బూత్ నిర్వహణ, సోషల్ మీడియా, IVR, వాట్సాప్ మరియు AI వీడియో సందేశం.' : lang === 'hi' ? 'राजनीतिक सर्वेक्षण, मतदाता मानचित्रण, बूथ प्रबंधन, सोशल मीडिया, IVR, व्हाट्सएप और AI वीडियो।' : 'Political survey & research, voter mapping, booth management, social media campaigns, IVR bulk calls, WhatsApp outreach, AI video messaging and more — for Telangana & Andhra Pradesh.';

  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem', position: i + 1, name: loc(s, 'title', lang),
      url: `${SITE_URL}/services/${s.slug}`,
    })),
  };
  return c.html(renderLayout(servicesPage(lang, settings, services), {
    title, description: desc, lang, path: '/services', settings,
    keywords: settings.meta_keywords,
    jsonLd: [breadcrumbLd([{ name: t('nav_home', lang), path: '/' }, { name: t('nav_services', lang), path: '/services' }]), itemListLd],
  }));
});

// ---------- SERVICE DETAIL ----------
app.get('/services/:slug', async (c) => {
  const lang = resolveLang(c);
  const store = getStore(c.env);
  const settings = await store.getSettings();
  if (!pageEnabled(settings, 'services')) return notEnabled(c, settings, lang);
  const slug = c.req.param('slug');
  const s = await store.getBy('services', 'slug', slug);
  if (!s || s.is_active == 0) return notEnabled(c, settings, lang);
  const others = (await getActiveServices(store)).filter((x) => x.slug !== slug).slice(0, 3);

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
    keywords: `${loc(s, 'title', 'en')}, ${settings.meta_keywords}`,
    jsonLd: [
      breadcrumbLd([
        { name: t('nav_home', lang), path: '/' },
        { name: t('nav_services', lang), path: '/services' },
        { name: loc(s, 'title', lang), path: `/services/${slug}` },
      ]),
      serviceLd,
    ],
  }));
});

// ---------- BLOG ----------
app.get('/blog', async (c) => {
  const lang = resolveLang(c);
  const store = getStore(c.env);
  const settings = await store.getSettings();
  if (!pageEnabled(settings, 'blog')) return notEnabled(c, settings, lang);
  const blogs = await store.list('blogs', { where: { is_published: 1 }, orderBy: [['published_at', 'desc']] });
  const title = `${t('nav_blog', lang)} · Vijayavyuham`;
  return c.html(renderLayout(blogListPage(lang, settings, blogs), {
    title, description: 'Insights on political campaign strategy, voter research, and digital politics in Telangana and Andhra Pradesh.', lang, path: '/blog', settings,
    keywords: settings.meta_keywords,
    jsonLd: [breadcrumbLd([{ name: t('nav_home', lang), path: '/' }, { name: t('nav_blog', lang), path: '/blog' }])],
  }));
});

app.get('/blog/:slug', async (c) => {
  const lang = resolveLang(c);
  const store = getStore(c.env);
  const settings = await store.getSettings();
  if (!pageEnabled(settings, 'blog')) return notEnabled(c, settings, lang);
  const slug = c.req.param('slug');
  const b = await store.getBy('blogs', 'slug', slug);
  if (!b || b.is_published == 0) return notEnabled(c, settings, lang);
  const related = (await store.list('blogs', { where: { is_published: 1 }, orderBy: [['published_at', 'desc']], limit: 4 })).filter((x) => x.slug !== slug).slice(0, 3);

  const title = (b.meta_title as string) || `${loc(b, 'title', lang)} · Vijayavyuham`;
  const desc = (b.meta_description as string) || loc(b, 'excerpt', lang);
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: loc(b, 'title', lang), description: loc(b, 'excerpt', lang),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
    author: { '@type': 'Organization', name: (b.author as string) || 'Vijayavyuham' },
    publisher: { '@type': 'Organization', name: 'Vijayavyuham', logo: { '@type': 'ImageObject', url: `${SITE_URL}/static/logo.png` } },
    inLanguage: lang, datePublished: b.published_at,
    dateModified: (b.updated_at as string) || (b.published_at as string),
    ...(b.cover_image ? { image: b.cover_image } : {}),
  };
  return c.html(renderLayout(blogDetailPage(lang, settings, b, related), {
    title, description: desc, lang, path: `/blog/${slug}`, settings,
    keywords: (b.keywords as string) || settings.meta_keywords,
    ogImage: (b.cover_image as string) || undefined,
    jsonLd: [
      breadcrumbLd([
        { name: t('nav_home', lang), path: '/' },
        { name: t('nav_blog', lang), path: '/blog' },
        { name: loc(b, 'title', lang), path: `/blog/${slug}` },
      ]),
      articleLd,
    ],
  }));
});

// ---------- GALLERY ----------
app.get('/gallery', async (c) => {
  const lang = resolveLang(c);
  const store = getStore(c.env);
  const settings = await store.getSettings();
  if (!pageEnabled(settings, 'gallery')) return notEnabled(c, settings, lang);
  const items = await store.list('gallery', { where: { is_active: 1 }, orderBy: [['sort_order', 'asc'], ['id', 'desc']] });
  const title = `${t('nav_gallery', lang)} · Vijayavyuham`;
  return c.html(renderLayout(galleryPage(lang, settings, items), {
    title, description: 'Vijayavyuham campaign work, events, and field operations across Telangana and Andhra Pradesh.', lang, path: '/gallery', settings,
  }));
});

// ---------- TEAM ----------
app.get('/team', async (c) => {
  const lang = resolveLang(c);
  const store = getStore(c.env);
  const settings = await store.getSettings();
  if (!pageEnabled(settings, 'team')) return notEnabled(c, settings, lang);
  const members = await store.list('team', { where: { is_active: 1 }, orderBy: [['sort_order', 'asc'], ['id', 'asc']] });
  const title = `${t('nav_team', lang)} · Vijayavyuham`;
  return c.html(renderLayout(teamPage(lang, settings, members), {
    title, description: 'Meet the Vijayavyuham team — political strategists, researchers, and field experts serving the Telugu states.', lang, path: '/team', settings,
  }));
});

// ---------- CONTACT ----------
app.get('/contact', async (c) => {
  const lang = resolveLang(c);
  const store = getStore(c.env);
  const settings = await store.getSettings();
  if (!pageEnabled(settings, 'contact')) return notEnabled(c, settings, lang);
  const services = await getActiveServices(store);
  const title = `${t('contact_us', lang)} · Vijayavyuham`;
  return c.html(renderLayout(contactPage(lang, settings, services), {
    title, description: 'Contact Vijayavyuham for political campaign strategy, voter research, and election management across Telangana and Andhra Pradesh.', lang, path: '/contact', settings,
    keywords: settings.meta_keywords,
  }));
});

// ---------- SEO: sitemap & robots ----------
app.get('/sitemap.xml', async (c) => {
  const store = getStore(c.env);
  const settings = await store.getSettings();
  const base = SITE_URL;
  const urls: string[] = ['/'];
  ['about', 'services', 'blog', 'gallery', 'team', 'contact'].forEach((p) => { if (pageEnabled(settings, p)) urls.push('/' + p); });
  urls.push('/faq'); // always available (built-in content)
  const services = await getActiveServices(store);
  if (pageEnabled(settings, 'services')) services.forEach((s) => urls.push('/services/' + s.slug));
  if (pageEnabled(settings, 'blog')) {
    const blogs = await store.list('blogs', { where: { is_published: 1 } });
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

Sitemap: ${SITE_URL}/sitemap.xml
`, 200, { 'Content-Type': 'text/plain' });
});

export default app;
