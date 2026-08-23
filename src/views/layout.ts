import { Lang } from '../types';
import { t, LANGS } from '../lib/i18n';
import { pageEnabled, activeSocials } from '../lib/data';

export interface LayoutOptions {
  title: string;
  description: string;
  lang: Lang;
  path: string;
  settings: Record<string, string>;
  keywords?: string;
  ogImage?: string;
  jsonLd?: object[];
  canonical?: string;
}

const SITE_URL = 'https://vijayavyuham.pages.dev';

function navItems(settings: Record<string, string>, lang: Lang) {
  const items: { href: string; key: string; page: string }[] = [
    { href: '/', key: 'nav_home', page: 'home' },
    { href: '/about', key: 'nav_about', page: 'about' },
    { href: '/services', key: 'nav_services', page: 'services' },
    { href: '/blog', key: 'nav_blog', page: 'blog' },
    { href: '/gallery', key: 'nav_gallery', page: 'gallery' },
    { href: '/team', key: 'nav_team', page: 'team' },
    { href: '/faq', key: 'nav_faq', page: 'faq' },
    { href: '/contact', key: 'nav_contact', page: 'contact' },
  ];
  // 'home' and 'faq' are always available (FAQ ships with built-in content).
  return items.filter((i) => i.page === 'home' || i.page === 'faq' || pageEnabled(settings, i.page));
}

export function renderLayout(body: string, opts: LayoutOptions): string {
  const { title, description, lang, path, settings, keywords, ogImage, jsonLd, canonical } = opts;
  const nav = navItems(settings, lang);
  const socials = activeSocials(settings);
  const phone = (settings.contact_phone || '').trim();
  const whatsapp = (settings.contact_whatsapp || '').trim();
  const email = (settings.contact_email || '').trim();
  const siteName = settings.site_name || 'Vijayavyuham';

  const htmlLang = lang === 'te' ? 'te' : lang === 'hi' ? 'hi' : 'en';
  const canonicalUrl = canonical || `${SITE_URL}${path === '/' ? '' : path}`;

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Vijayavyuham',
    description: settings.meta_description_en || description,
    url: SITE_URL,
    logo: `${SITE_URL}/static/logo.png`,
    image: `${SITE_URL}/static/logo.png`,
    areaServed: [
      { '@type': 'State', name: 'Telangana' },
      { '@type': 'State', name: 'Andhra Pradesh' },
    ],
    address: { '@type': 'PostalAddress', addressRegion: 'Telangana', addressCountry: 'IN' },
    slogan: 'Strategy • Intelligence • Impact',
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(socials.length ? { sameAs: socials.map((s) => s.url) } : {}),
  };

  const allLd = [orgLd, ...(jsonLd || [])];

  const navLinksHtml = nav.map((i) => {
    const active = (i.href === '/' && path === '/') || (i.href !== '/' && path.startsWith(i.href)) ? 'active' : '';
    return `<li><a class="${active}" href="${i.href}">${t(i.key, lang)}</a></li>`;
  }).join('');

  const footerLinksHtml = nav.map((i) => `<li><a href="${i.href}">${t(i.key, lang)}</a></li>`).join('');

  const socialHtml = socials.length
    ? socials.map((s) => `<a href="${escAttr(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}"><i class="fa-brands ${s.icon}"></i></a>`).join('')
    : '';

  // Compact, always-visible segmented language toggle (clear one-tap UX)
  const langSegHtml = LANGS.map((l) =>
    `<button type="button" class="lang-seg${l.code === lang ? ' active' : ''}" data-lang="${l.code}" title="${escAttr(l.label)}" aria-label="${escAttr(l.label)}"${l.code === lang ? ' aria-current="true"' : ''}>${l.native}</button>`
  ).join('');

  // Floating contact
  const floatBtns: string[] = [];
  if (whatsapp) floatBtns.push(`<a class="float-btn float-wa" href="https://wa.me/${digits(whatsapp)}?text=${encodeURIComponent('Hello Vijayavyuham, I would like to enquire about your services.')}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`);
  if (phone) floatBtns.push(`<a class="float-btn float-call" href="tel:${escAttr(phone)}" aria-label="Call"><i class="fa-solid fa-phone"></i></a>`);
  floatBtns.push(`<button class="float-btn float-enq" onclick="openEnquiry()" aria-label="${t('cta_enquire', lang)}"><i class="fa-solid fa-envelope-open-text"></i></button>`);

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(title)}</title>
<meta name="description" content="${escAttr(description)}">
${keywords ? `<meta name="keywords" content="${escAttr(keywords)}">` : ''}
<meta name="robots" content="index, follow">
<meta name="author" content="Vijayavyuham">
<meta name="geo.region" content="IN-TG">
<meta name="geo.placename" content="Hyderabad, Telangana">
<meta name="geo.region" content="IN-AP">
<link rel="canonical" href="${escAttr(canonicalUrl)}">
<link rel="alternate" hreflang="en" href="${SITE_URL}${path === '/' ? '' : path}">
<link rel="alternate" hreflang="te" href="${SITE_URL}${path === '/' ? '' : path}?lang=te">
<link rel="alternate" hreflang="hi" href="${SITE_URL}${path === '/' ? '' : path}?lang=hi">
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Vijayavyuham">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(description)}">
<meta property="og:url" content="${escAttr(canonicalUrl)}">
<meta property="og:image" content="${escAttr(ogImage || `${SITE_URL}/static/logo.png`)}">
<meta property="og:locale" content="${lang === 'te' ? 'te_IN' : lang === 'hi' ? 'hi_IN' : 'en_IN'}">
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(title)}">
<meta name="twitter:description" content="${escAttr(description)}">
<meta name="twitter:image" content="${escAttr(ogImage || `${SITE_URL}/static/logo.png`)}">
<!-- Favicon -->
<link rel="icon" type="image/png" href="/static/logo.png">
<link rel="apple-touch-icon" href="/static/logo.png">
<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Telugu:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" rel="stylesheet">
<link href="/static/style.css" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(allLd)}</script>
</head>
<body data-lang="${lang}">

<!-- Language prompt: non-intrusive bottom toast on first visit (does NOT block the page) -->
<div class="lang-toast" id="langToast" role="region" aria-label="Choose language">
  <button class="lang-toast-close" id="langToastClose" aria-label="Dismiss">&times;</button>
  <div class="lang-toast-head"><i class="fa-solid fa-globe"></i> ${t('lang_prompt', lang)}</div>
  <div class="lang-toast-choices">
    ${LANGS.map((l) => `<button type="button" class="lang-toast-choice${l.code === lang ? ' active' : ''}" data-lang="${l.code}"><span class="native">${l.native}</span><span class="en-name">${l.label}</span></button>`).join('')}
  </div>
</div>

<header class="site-header" id="siteHeader">
  <div class="container nav">
    <a class="brand" href="/">
      <img src="/static/logo.png" alt="${escAttr(siteName)} logo">
      <span class="brand-name">${escHtml(siteName)}<small>${escHtml(settings[`tagline_${lang}`] || settings.tagline_en || 'Strategy • Intelligence • Impact')}</small></span>
    </a>
    <ul class="nav-links" id="navLinks">
      ${navLinksHtml}
      <li class="drawer-lang">
        <span class="drawer-lang-label"><i class="fa-solid fa-globe"></i> ${t('lang_prompt', lang)}</span>
        <div class="lang-seg-group" role="group" aria-label="Language">${langSegHtml}</div>
      </li>
      <li class="mobile-only-cta"><a href="/contact" class="gold-text">${t('cta_enquire', lang)}</a></li>
    </ul>
    <div class="nav-actions">
      <div class="lang-seg-group hide-mobile" id="langSeg" role="group" aria-label="Language">${langSegHtml}</div>
      <a href="/contact" class="btn btn-gold hide-mobile" style="padding:10px 22px;">${t('cta_enquire', lang)}</a>
      <button class="mobile-toggle" id="mobileToggle" aria-label="Menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
    </div>
  </div>
</header>

<!-- Mobile drawer backdrop -->
<div class="nav-backdrop" id="navBackdrop" aria-hidden="true"></div>

<main>
${body}
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/static/logo.png" alt="${escAttr(siteName)}">
        <p>${escHtml(settings[`meta_description_${lang}`] || settings.meta_description_en || description)}</p>
      </div>
      <div class="footer-col">
        <h4>${t('quick_links', lang)}</h4>
        <ul>${footerLinksHtml}</ul>
      </div>
      <div class="footer-col">
        <h4>${t('contact_us', lang)}</h4>
        <ul>
          ${phone ? `<li><a href="tel:${escAttr(phone)}"><i class="fa-solid fa-phone" style="color:var(--gold);margin-right:8px;"></i>${escHtml(phone)}</a></li>` : ''}
          ${whatsapp ? `<li><a href="https://wa.me/${digits(whatsapp)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" style="color:var(--gold);margin-right:8px;"></i>${escHtml(whatsapp)}</a></li>` : ''}
          ${email ? `<li><a href="mailto:${escAttr(email)}"><i class="fa-solid fa-envelope" style="color:var(--gold);margin-right:8px;"></i>${escHtml(email)}</a></li>` : ''}
          <li style="color:var(--text-faint);"><i class="fa-solid fa-location-dot" style="color:var(--gold);margin-right:8px;"></i>${escHtml(settings[`contact_address_${lang}`] || settings.contact_address_en || '')}</li>
        </ul>
      </div>
      <div class="footer-col">
        ${socialHtml ? `<h4>${t('follow_us', lang)}</h4><div class="footer-social">${socialHtml}</div>` : ''}
        <div style="margin-top:24px;">
          <a href="/contact" class="btn btn-ghost" style="padding:10px 22px;">${t('cta_enquire', lang)}</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${escHtml(siteName)}. ${t('rights', lang)}</span>
      <span>${t('serving', lang)}</span>
    </div>
  </div>
</footer>

<!-- Floating contact -->
<div class="float-contact">
  ${floatBtns.join('')}
</div>

<!-- Enquiry modal -->
<div class="modal-overlay" id="enquiryModal">
  <div class="modal">
    <button class="modal-close" onclick="closeEnquiry()" aria-label="Close">&times;</button>
    <h3 class="serif">${t('quick_enquiry', lang)}</h3>
    <p class="sub">${t('get_in_touch', lang)}</p>
    <div class="form-msg" id="mFormMsg"></div>
    <form id="enquiryForm" onsubmit="return submitEnquiry(event, 'modal')">
      <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
      <div class="field"><label>${t('form_name', lang)}</label><input type="text" name="name" required></div>
      <div class="field"><label>${t('form_phone', lang)} <span class="opt">/ ${t('form_email', lang)}</span></label><input type="text" name="phone" placeholder="${t('form_phone', lang)}"></div>
      <div class="field"><label>${t('form_email', lang)} <span class="opt">${t('form_optional', lang)}</span></label><input type="email" name="email"></div>
      <div class="field"><label>${t('form_message', lang)}</label><textarea name="message" required></textarea></div>
      <button type="submit" class="btn btn-gold btn-block">${t('form_send', lang)}</button>
    </form>
  </div>
</div>

<script>
  window.VV = {
    lang: "${lang}",
    msgSuccess: ${JSON.stringify(t('form_success', lang))},
    msgError: ${JSON.stringify(t('form_error', lang))}
  };
</script>
<script src="/static/app.js"></script>
</body>
</html>`;
}

export function escHtml(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function escAttr(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function digits(s: string): string {
  return String(s ?? '').replace(/[^0-9]/g, '');
}
