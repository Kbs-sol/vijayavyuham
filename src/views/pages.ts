import { Lang } from '../types';
import { t, loc } from '../lib/i18n';
import { escHtml, escAttr } from './layout';
import { resolveEmbed } from '../lib/embed';

// ---------- HERO / HOME ----------
export function homePage(lang: Lang, settings: Record<string, string>, services: any[], blogs: any[], testimonials: any[], faqs: any[] = []): string {
  const headline = settings[`hero_headline_${lang}`] || settings.hero_headline_en || '';
  const sub = settings[`hero_subtext_${lang}`] || settings.hero_subtext_en || '';

  const trust = [
    { icon: 'fa-magnifying-glass-chart', k: { en: 'Evidence-led strategy', te: 'ఆధారాధారిత వ్యూహం', hi: 'साक्ष्य-आधारित रणनीति' } },
    { icon: 'fa-location-dot', k: { en: 'Built for Telangana & AP', te: 'తెలంగాణ & ఏపీ కోసం', hi: 'तेलंगाना और एपी के लिए' } },
    { icon: 'fa-people-group', k: { en: 'Booth-level execution', te: 'బూత్-స్థాయి అమలు', hi: 'बूथ-स्तरीय निष्पादन' } },
  ];

  const serviceCards = services.slice(0, 9).map((s, idx) => `
    <a class="service-card reveal" href="/services/${escAttr(s.slug)}">
      <div class="service-num">${String(idx + 1).padStart(2, '0')}</div>
      <div class="service-icon"><i class="fa-solid ${escAttr(s.icon)} ${s.icon === 'fa-whatsapp' ? '' : ''}"></i></div>
      <h3>${escHtml(loc(s, 'title', lang))}</h3>
      <p>${escHtml(loc(s, 'short', lang))}</p>
      <span class="service-link">${t('cta_view_service', lang)} <i class="fa-solid fa-arrow-right"></i></span>
    </a>`).join('');

  const why = [
    { icon: 'fa-chess', title: { en: 'Meticulous Strategy', te: 'సూక్ష్మ వ్యూహం', hi: 'सूक्ष्म रणनीति' }, desc: { en: 'Every recommendation grounded in ground-level evidence, not guesswork.', te: 'ప్రతి సిఫార్సు క్షేత్రస్థాయి ఆధారాలపై ఆధారపడి ఉంటుంది.', hi: 'हर सिफारिश जमीनी सबूत पर आधारित, अनुमान पर नहीं।' } },
    { icon: 'fa-microchip', title: { en: 'Intelligence Edge', te: 'విశ్లేషణ ఆధిక్యత', hi: 'बुद्धिमत्ता बढ़त' }, desc: { en: 'Field and digital analytics that reveal what voters actually think.', te: 'ఓటర్లు నిజంగా ఏమనుకుంటున్నారో వెల్లడించే విశ్లేషణలు.', hi: 'फील्ड और डिजिटल एनालिटिक्स जो बताते हैं मतदाता वास्तव में क्या सोचते हैं।' } },
    { icon: 'fa-comments', title: { en: 'Persuasive Messaging', te: 'ఒప్పించే సందేశం', hi: 'प्रेरक संदेश' }, desc: { en: 'Message discipline in Telugu, Hindi & English that connects locally.', te: 'స్థానికంగా కనెక్ట్ అయ్యే తెలుగు, హిందీ & ఇంగ్లీష్ సందేశం.', hi: 'तेलुगु, हिंदी और अंग्रेजी में संदेश जो स्थानीय रूप से जुड़ता है।' } },
    { icon: 'fa-bullseye', title: { en: 'Disciplined Execution', te: 'క్రమశిక్షణ అమలు', hi: 'अनुशासित निष्पादन' }, desc: { en: 'From war room to booth — plans delivered with precision on the ground.', te: 'వార్ రూమ్ నుండి బూత్ వరకు — ఖచ్చితత్వంతో అమలు.', hi: 'वॉर रूम से बूथ तक — जमीन पर सटीकता के साथ योजनाएं।' } },
  ];
  const whyCards = why.map((w) => `
    <div class="feature reveal">
      <div class="ico"><i class="fa-solid ${w.icon}"></i></div>
      <h3>${escHtml(w.title[lang])}</h3>
      <p>${escHtml(w.desc[lang])}</p>
    </div>`).join('');

  const blogCards = blogs.slice(0, 3).map((b) => blogCard(b, lang)).join('');
  const testiCards = testimonials.slice(0, 2).map((tt) => `
    <div class="testi reveal">
      <span class="quote-mark">"</span>
      <p>${escHtml(loc(tt, 'quote', lang))}</p>
      <div class="who">${escHtml(tt.author_name)}<span>${escHtml(tt.author_role || '')}</span></div>
    </div>`).join('');

  return `
<section class="hero">
  <img class="hero-bg-star" src="/static/logo.png" alt="">
  <div class="container">
    <div class="hero-inner">
      <span class="eyebrow reveal in">${t('hero_eyebrow', lang)}</span>
      <h1 class="reveal in">${escHtml(headline)}</h1>
      <p class="lead reveal in">${escHtml(sub)}</p>
      <div class="hero-actions reveal in">
        <a href="/services" class="btn btn-gold">${t('cta_all_services', lang)}</a>
        <a href="/contact" class="btn btn-ghost">${t('cta_get_started', lang)}</a>
      </div>
      <div class="hero-trust reveal in">
        ${trust.map((tr) => `<div class="item"><div class="k"><i class="fa-solid ${tr.icon}"></i> ${escHtml(tr.k[lang])}</div></div>`).join('')}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow" style="justify-content:center;">${t('our_services', lang)}</span>
      <h2>${t('services_sub', lang)}</h2>
    </div>
    <div class="services-grid">${serviceCards}</div>
    <div style="text-align:center;margin-top:44px;">
      <a href="/services" class="btn btn-ghost">${t('cta_all_services', lang)}</a>
    </div>
  </div>
</section>

<section class="section" style="background:var(--black-2);">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow" style="justify-content:center;">${t('why_us', lang)}</span>
      <h2>${lang === 'te' ? 'మీ రాజకీయ భవిష్యత్తు మాకు అత్యంత ముఖ్యం' : lang === 'hi' ? 'आपका राजनीतिक भविष्य हमारे लिए सर्वोपरि है' : 'Your political future is paramount to us'}</h2>
    </div>
    <div class="feature-grid">${whyCards}</div>
  </div>
</section>

${testiCards ? `
<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow" style="justify-content:center;">${t('what_clients_say', lang)}</span>
    </div>
    <div class="testi-grid">${testiCards}</div>
  </div>
</section>` : ''}

${blogCards ? `
<section class="section" style="background:var(--black-2);">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow" style="justify-content:center;">${t('latest_insights', lang)}</span>
      <h2>${lang === 'te' ? 'ప్రచార వ్యూహం & డిజిటల్ రాజకీయాలపై విశ్లేషణలు' : lang === 'hi' ? 'अभियान रणनीति और डिजिटल राजनीति पर अंतर्दृष्टि' : 'Insights on campaign strategy & digital politics'}</h2>
    </div>
    <div class="blog-grid">${blogCards}</div>
    <div style="text-align:center;margin-top:44px;"><a href="/blog" class="btn btn-ghost">${t('nav_blog', lang)}</a></div>
  </div>
</section>` : ''}

${faqHomeSection(lang, faqs)}

${ctaBand(lang)}
`;
}

// ---------- CTA band ----------
export function ctaBand(lang: Lang): string {
  const headline = { en: 'Ready to build a winning campaign?', te: 'గెలిచే ప్రచారాన్ని నిర్మించడానికి సిద్ధమా?', hi: 'एक विजयी अभियान बनाने के लिए तैयार हैं?' };
  const sub = { en: 'Let us understand your constituency, your voters, and your goals — then build the strategy to win.', te: 'మీ నియోజకవర్గం, మీ ఓటర్లు మరియు మీ లక్ష్యాలను అర్థం చేసుకుని, గెలవడానికి వ్యూహాన్ని నిర్మిద్దాం.', hi: 'हमें आपके निर्वाचन क्षेत्र, आपके मतदाताओं और आपके लक्ष्यों को समझने दें — फिर जीतने की रणनीति बनाएं।' };
  return `
<section class="section" style="text-align:center;position:relative;overflow:hidden;">
  <img class="hero-bg-star" src="/static/logo.png" alt="" style="opacity:.05;width:min(70vw,600px);right:auto;left:50%;transform:translate(-50%,-50%);top:50%;">
  <div class="container" style="position:relative;z-index:3;max-width:720px;">
    <span class="eyebrow" style="justify-content:center;">${t('get_in_touch', lang)}</span>
    <h2 style="margin-bottom:.4em;">${escHtml(headline[lang])}</h2>
    <p style="max-width:560px;margin:0 auto 32px;">${escHtml(sub[lang])}</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/contact" class="btn btn-gold">${t('cta_enquire', lang)}</a>
      <button class="btn btn-ghost" onclick="openEnquiry()">${t('quick_enquiry', lang)}</button>
    </div>
  </div>
</section>`;
}

// ---------- ABOUT ----------
export function aboutPage(lang: Lang, settings: Record<string, string>): string {
  const body = settings[`about_body_${lang}`] || settings.about_body_en || '';
  const mission = settings[`mission_${lang}`] || settings.mission_en || '';
  const vision = settings[`vision_${lang}`] || settings.vision_en || '';
  const values = [
    { icon: 'fa-scale-balanced', t: { en: 'Integrity', te: 'నిజాయితీ', hi: 'ईमानदारी' }, d: { en: 'Honest counsel, always — even when it is not what a client wants to hear.', te: 'ఎల్లప్పుడూ నిజాయితీతో కూడిన సలహా.', hi: 'हमेशा ईमानदार सलाह।' } },
    { icon: 'fa-chart-line', t: { en: 'Evidence', te: 'ఆధారం', hi: 'साक्ष्य' }, d: { en: 'We lead with data and let the ground reality guide the strategy.', te: 'మేము డేటాతో నడిపిస్తాము.', hi: 'हम डेटा से नेतृत्व करते हैं।' } },
    { icon: 'fa-handshake-angle', t: { en: 'Partnership', te: 'భాగస్వామ్యం', hi: 'साझेदारी' }, d: { en: 'We work as one team with our clients, invested in their success.', te: 'మేము మా క్లయింట్లతో ఒకే బృందంగా పనిచేస్తాము.', hi: 'हम अपने ग्राहकों के साथ एक टीम के रूप में काम करते हैं।' } },
  ];

  return `
${pageHero(lang, t('nav_about', lang), settings.site_name || 'Vijayavyuham', settings)}
<section class="section">
  <div class="container split">
    <div class="reveal">
      <span class="eyebrow">${t('nav_about', lang)}</span>
      <h2>${lang === 'te' ? 'తెలుగు రాష్ట్రాల కోసం నిర్మించబడిన కొత్త తరం రాజకీయ వ్యూహం' : lang === 'hi' ? 'तेलुगु राज्यों के लिए बनाई गई नई पीढ़ी की राजनीतिक रणनीति' : 'A new-generation political strategy firm for the Telugu states'}</h2>
      <p>${escHtml(body)}</p>
    </div>
    <div class="reveal">
      <div class="mv-card"><h3><i class="fa-solid fa-bullseye" style="margin-right:10px;"></i>${t('mission', lang)}</h3><p>${escHtml(mission)}</p></div>
      <div class="mv-card"><h3><i class="fa-solid fa-eye" style="margin-right:10px;"></i>${t('vision', lang)}</h3><p>${escHtml(vision)}</p></div>
    </div>
  </div>
</section>
<section class="section" style="background:var(--black-2);">
  <div class="container">
    <div class="section-head"><span class="eyebrow" style="justify-content:center;">${lang === 'te' ? 'మా విలువలు' : lang === 'hi' ? 'हमारे मूल्य' : 'Our Values'}</span></div>
    <div class="feature-grid" style="grid-template-columns:repeat(3,1fr);">
      ${values.map((v) => `<div class="feature reveal"><div class="ico"><i class="fa-solid ${v.icon}"></i></div><h3>${escHtml(v.t[lang])}</h3><p>${escHtml(v.d[lang])}</p></div>`).join('')}
    </div>
  </div>
</section>
${ctaBand(lang)}`;
}

// ---------- SERVICES LIST ----------
export function servicesPage(lang: Lang, settings: Record<string, string>, services: any[]): string {
  const cards = services.map((s, idx) => `
    <a class="service-card reveal" href="/services/${escAttr(s.slug)}">
      <div class="service-num">${String(idx + 1).padStart(2, '0')}</div>
      <div class="service-icon"><i class="fa-solid ${escAttr(s.icon)}"></i></div>
      <h3>${escHtml(loc(s, 'title', lang))}</h3>
      <p>${escHtml(loc(s, 'short', lang))}</p>
      <span class="service-link">${t('cta_view_service', lang)} <i class="fa-solid fa-arrow-right"></i></span>
    </a>`).join('');
  return `
${pageHero(lang, t('nav_services', lang), t('services_sub', lang), settings)}
<section class="section">
  <div class="container">
    <div class="services-grid">${cards}</div>
  </div>
</section>
${ctaBand(lang)}`;
}

// ---------- SERVICE DETAIL ----------
export function serviceDetailPage(lang: Lang, settings: Record<string, string>, s: any, others: any[]): string {
  let features: any[] = [];
  try { features = JSON.parse(s.features || '[]'); } catch (e) { features = []; }
  const featureHtml = features.map((f: any) => `<li><i class="fa-solid fa-circle-check"></i> ${escHtml(f[lang] || f.en)}</li>`).join('');
  const otherHtml = others.slice(0, 3).map((o) => `
    <a class="service-card reveal" href="/services/${escAttr(o.slug)}">
      <div class="service-icon"><i class="fa-solid ${escAttr(o.icon)}"></i></div>
      <h3 style="font-size:1.15rem;">${escHtml(loc(o, 'title', lang))}</h3>
      <span class="service-link">${t('cta_view_service', lang)} <i class="fa-solid fa-arrow-right"></i></span>
    </a>`).join('');

  return `
<section class="page-hero">
  <div class="container">
    <div class="breadcrumb"><a href="/services">${t('nav_services', lang)}</a> / ${escHtml(loc(s, 'title', lang))}</div>
    <div class="service-icon" style="font-size:2.6rem;justify-content:center;display:flex;"><i class="fa-solid ${escAttr(s.icon)}"></i></div>
    <h1>${escHtml(loc(s, 'title', lang))}</h1>
    <p>${escHtml(loc(s, 'short', lang))}</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="service-detail-body reveal">
      <p style="font-size:1.1rem;color:var(--text);">${escHtml(loc(s, 'description', lang))}</p>
      ${featureHtml ? `<ul class="feature-list">${featureHtml}</ul>` : ''}
      <div style="margin-top:30px;display:flex;gap:16px;flex-wrap:wrap;">
        <a href="/contact" class="btn btn-gold">${t('cta_enquire', lang)}</a>
        <button class="btn btn-ghost" onclick="openEnquiry()">${t('quick_enquiry', lang)}</button>
      </div>
      <div style="margin-top:40px;"><a href="/services" class="service-link"><i class="fa-solid fa-arrow-left"></i> ${t('back_to_services', lang)}</a></div>
    </div>
  </div>
</section>
${otherHtml ? `<section class="section" style="background:var(--black-2);">
  <div class="container">
    <div class="section-head"><span class="eyebrow" style="justify-content:center;">${t('our_services', lang)}</span></div>
    <div class="services-grid" style="grid-template-columns:repeat(3,1fr);">${otherHtml}</div>
  </div>
</section>` : ''}`;
}

// ---------- BLOG LIST ----------
export function blogListPage(lang: Lang, settings: Record<string, string>, blogs: any[]): string {
  const cards = blogs.length ? blogs.map((b) => blogCard(b, lang)).join('') : `<p style="grid-column:1/-1;text-align:center;color:var(--text-faint);">${t('no_posts', lang)}</p>`;
  return `
${pageHero(lang, t('nav_blog', lang), lang === 'te' ? 'ప్రచార వ్యూహం, విశ్లేషణ & డిజిటల్ రాజకీయాలపై విశ్లేషణలు' : lang === 'hi' ? 'अभियान रणनीति, विश्लेषण और डिजिटल राजनीति पर अंतर्दृष्टि' : 'Insights from campaign strategy, analytics & digital politics', settings)}
<section class="section">
  <div class="container">
    <div class="blog-grid">${cards}</div>
  </div>
</section>`;
}

function blogCard(b: any, lang: Lang): string {
  const title = loc(b, 'title', lang);
  const excerpt = loc(b, 'excerpt', lang);
  return `
  <a class="blog-card reveal" href="/blog/${escAttr(b.slug)}">
    <div class="cover ${b.cover_image ? '' : 'placeholder'}">
      ${b.cover_image ? `<img src="${escAttr(b.cover_image)}" alt="${escAttr(title)}" loading="lazy">` : '<i class="fa-solid fa-feather-pointed"></i>'}
    </div>
    <div class="body">
      <span class="cat">${escHtml(b.category || 'General')}</span>
      <h3>${escHtml(title)}</h3>
      <p>${escHtml((excerpt || '').slice(0, 130))}${(excerpt || '').length > 130 ? '…' : ''}</p>
      <span class="service-link">${t('cta_read_more', lang)} <i class="fa-solid fa-arrow-right"></i></span>
    </div>
  </a>`;
}

// ---------- BLOG DETAIL ----------
export function blogDetailPage(lang: Lang, settings: Record<string, string>, b: any, related: any[]): string {
  const title = loc(b, 'title', lang);
  const content = loc(b, 'content', lang) || loc(b, 'excerpt', lang);
  const relatedHtml = related.slice(0, 3).map((r) => blogCard(r, lang)).join('');
  const date = b.published_at ? new Date(b.published_at).toLocaleDateString(lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  return `
<section class="page-hero">
  <div class="container">
    <div class="breadcrumb"><a href="/blog">${t('nav_blog', lang)}</a> / ${escHtml(b.category || 'General')}</div>
    <h1 style="max-width:800px;margin:0 auto;">${escHtml(title)}</h1>
    <p>${escHtml(b.author || 'Vijayavyuham Team')} ${date ? '· ' + date : ''}</p>
  </div>
</section>
<section class="section">
  <div class="container" style="max-width:800px;">
    ${b.cover_image ? `<img src="${escAttr(b.cover_image)}" alt="${escAttr(title)}" style="width:100%;border-radius:8px;margin-bottom:36px;border:1px solid var(--gold-line);">` : ''}
    <div class="service-detail-body reveal" style="max-width:100%;font-size:1.08rem;line-height:1.9;color:var(--text-dim);">
      ${formatContent(content)}
    </div>
    <div style="margin-top:40px;"><a href="/blog" class="service-link"><i class="fa-solid fa-arrow-left"></i> ${t('nav_blog', lang)}</a></div>
  </div>
</section>
${relatedHtml ? `<section class="section" style="background:var(--black-2);">
  <div class="container"><div class="section-head"><span class="eyebrow" style="justify-content:center;">${t('latest_insights', lang)}</span></div><div class="blog-grid">${relatedHtml}</div></div>
</section>` : ''}
${ctaBand(lang)}`;
}

function formatContent(content: string): string {
  if (!content) return '';
  // If it already contains HTML tags, trust it; otherwise convert paragraphs
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  return content.split(/\n\n+/).map((p) => `<p>${escHtml(p.trim())}</p>`).join('');
}

// ---------- GALLERY ----------
export function galleryPage(lang: Lang, settings: Record<string, string>, items: any[]): string {
  const grid = items.length ? items.map((g) => galleryItem(g, lang)).join('')
    : `<p style="grid-column:1/-1;text-align:center;color:var(--text-faint);">${lang === 'te' ? 'త్వరలో చిత్రాలు జోడించబడతాయి.' : lang === 'hi' ? 'जल्द ही तस्वीरें जोड़ी जाएंगी।' : 'Photos coming soon.'}</p>`;
  return `
${pageHero(lang, t('nav_gallery', lang), t('our_work', lang), settings)}
<section class="section">
  <div class="container"><div class="gallery-grid">${grid}</div></div>
</section>
${ctaBand(lang)}`;
}

// Renders a single gallery item — supports images, direct videos,
// YouTube, Vimeo and generic iframe embeds from any hosting link.
function galleryItem(g: any, lang: Lang): string {
  const url = g.media_url || g.image_url || '';
  const forced = (g.media_type && g.media_type !== 'auto') ? g.media_type : null;
  const e = resolveEmbed(url);
  const kind = forced || e.kind;
  const label = loc(g, 'title', lang) || 'Vijayavyuham';
  const caption = loc(g, 'caption', lang) || loc(g, 'title', lang);
  const capHtml = caption ? `<div class="cap">${escHtml(caption)}</div>` : '';

  let media = '';
  if (kind === 'youtube' || kind === 'iframe' || (forced === 'video' && e.kind !== 'video' && e.src.includes('/embed/'))) {
    media = `<div class="gallery-embed"><iframe src="${escAttr(e.src)}" title="${escAttr(label)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  } else if (kind === 'video') {
    media = `<video src="${escAttr(e.src)}" controls preload="metadata" ${e.thumbnail ? `poster="${escAttr(e.thumbnail)}"` : ''} playsinline></video>`;
  } else {
    media = `<img src="${escAttr(e.src || url)}" alt="${escAttr(label)}" loading="lazy">`;
  }
  const isEmbed = kind === 'youtube' || kind === 'iframe';
  return `<div class="gallery-item reveal${isEmbed ? ' is-embed' : ''}">${media}${capHtml}</div>`;
}

// ---------- TEAM ----------
export function teamPage(lang: Lang, settings: Record<string, string>, members: any[]): string {
  const grid = members.length ? members.map((m) => `
    <div class="team-card reveal">
      <div class="team-photo ${m.photo_url ? '' : 'placeholder'}">
        ${m.photo_url ? `<img src="${escAttr(m.photo_url)}" alt="${escAttr(m.name)}" loading="lazy">` : '<i class="fa-solid fa-user"></i>'}
      </div>
      <h3>${escHtml(m.name)}</h3>
      <div class="role">${escHtml(loc(m, 'role', lang))}</div>
      ${loc(m, 'bio', lang) ? `<p class="bio">${escHtml(loc(m, 'bio', lang))}</p>` : ''}
      <div class="team-social">
        ${m.linkedin ? `<a href="${escAttr(m.linkedin)}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
        ${m.twitter ? `<a href="${escAttr(m.twitter)}" target="_blank" rel="noopener"><i class="fa-brands fa-x-twitter"></i></a>` : ''}
        ${m.email ? `<a href="mailto:${escAttr(m.email)}"><i class="fa-solid fa-envelope"></i></a>` : ''}
      </div>
    </div>`).join('') : `<p style="grid-column:1/-1;text-align:center;color:var(--text-faint);">${lang === 'te' ? 'త్వరలో మా బృందాన్ని పరిచయం చేస్తాము.' : lang === 'hi' ? 'जल्द ही हम अपनी टीम का परिचय देंगे।' : 'Meet our team soon.'}</p>`;
  return `
${pageHero(lang, t('nav_team', lang), lang === 'te' ? 'యువ శక్తి మరియు అనుభవం కలిగిన మా బృందం' : lang === 'hi' ? 'युवा ऊर्जा और अनुभव से भरी हमारी टीम' : 'A team blending young energy with experienced minds', settings)}
<section class="section">
  <div class="container"><div class="team-grid">${grid}</div></div>
</section>
${ctaBand(lang)}`;
}

// ---------- CONTACT ----------
export function contactPage(lang: Lang, settings: Record<string, string>, services: any[]): string {
  const phone = (settings.contact_phone || '').trim();
  const whatsapp = (settings.contact_whatsapp || '').trim();
  const email = (settings.contact_email || '').trim();
  const address = settings[`contact_address_${lang}`] || settings.contact_address_en || '';

  const serviceOptions = services.map((s) => `<option value="${escAttr(loc(s, 'title', lang))}">${escHtml(loc(s, 'title', lang))}</option>`).join('');

  const contactItems: string[] = [];
  if (phone) contactItems.push(`<div class="ci"><div class="ico"><i class="fa-solid fa-phone"></i></div><div><h4>${t('cta_call', lang)}</h4><a href="tel:${escAttr(phone)}">${escHtml(phone)}</a></div></div>`);
  if (whatsapp) contactItems.push(`<div class="ci"><div class="ico"><i class="fa-brands fa-whatsapp"></i></div><div><h4>${t('cta_whatsapp', lang)}</h4><a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener">${escHtml(whatsapp)}</a></div></div>`);
  if (email) contactItems.push(`<div class="ci"><div class="ico"><i class="fa-solid fa-envelope"></i></div><div><h4>${t('cta_email', lang)}</h4><a href="mailto:${escAttr(email)}">${escHtml(email)}</a></div></div>`);
  contactItems.push(`<div class="ci"><div class="ico"><i class="fa-solid fa-location-dot"></i></div><div><h4>${t('address', lang)}</h4><p>${escHtml(address)}</p></div></div>`);

  return `
${pageHero(lang, t('contact_us', lang), lang === 'te' ? 'కలిసి గెలుద్దాం. మీ ప్రచారం గురించి మాట్లాడుకుందాం.' : lang === 'hi' ? 'आइए मिलकर जीतें। अपने अभियान के बारे में बात करें।' : "Let's win together. Tell us about your campaign.", settings)}
<section class="section">
  <div class="container contact-grid">
    <div class="contact-info reveal">
      <span class="eyebrow">${t('get_in_touch', lang)}</span>
      <h2 style="margin-bottom:30px;">${lang === 'te' ? 'మమ్మల్ని సంప్రదించండి' : lang === 'hi' ? 'हमसे संपर्क करें' : 'Reach out to us'}</h2>
      ${contactItems.join('')}
    </div>
    <div class="form-card reveal">
      <h3 class="serif" style="color:var(--champagne);">${t('cta_enquire', lang)}</h3>
      <p style="color:var(--text-faint);font-size:.92rem;margin-bottom:24px;">${lang === 'te' ? 'క్రింది ఫారమ్‌ను పూరించండి, మేము త్వరలో మీను సంప్రదిస్తాము.' : lang === 'hi' ? 'नीचे दिया फॉर्म भरें, हम जल्द ही आपसे संपर्क करेंगे।' : "Fill the form below and we'll get back to you shortly."}</p>
      <div class="form-msg" id="cFormMsg"></div>
      <form id="contactForm" onsubmit="return submitEnquiry(event, 'page')">
        <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
        <div class="field"><label>${t('form_name', lang)}</label><input type="text" name="name" required></div>
        <div class="field" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div><label>${t('form_phone', lang)}</label><input type="text" name="phone"></div>
          <div><label>${t('form_email', lang)} <span class="opt">${t('form_optional', lang)}</span></label><input type="email" name="email"></div>
        </div>
        <div class="field"><label>${t('form_service', lang)} <span class="opt">${t('form_optional', lang)}</span></label>
          <select name="service_interest"><option value="">—</option>${serviceOptions}</select>
        </div>
        <div class="field"><label>${t('form_message', lang)}</label><textarea name="message" required></textarea></div>
        <button type="submit" class="btn btn-gold btn-block">${t('form_send', lang)}</button>
      </form>
    </div>
  </div>
</section>`;
}

// ---------- Shared page hero ----------
function pageHero(lang: Lang, title: string, sub: string, settings: Record<string, string>): string {
  return `
<section class="page-hero">
  <div class="container">
    <span class="eyebrow" style="justify-content:center;">${settings.site_name || 'Vijayavyuham'}</span>
    <h1>${escHtml(title)}</h1>
    <p>${escHtml(sub)}</p>
  </div>
</section>`;
}

// ---------- FAQ ----------
// Accessible, SEO/AEO-friendly accordion. Answers stay in the DOM (visually
// collapsed) so search & answer engines can read every answer.
function faqAccordion(lang: Lang, faqs: any[]): string {
  return faqs.map((f, i) => {
    const q = loc(f, 'question', lang);
    const a = loc(f, 'answer', lang);
    if (!q) return '';
    return `
    <div class="faq-item reveal" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <button class="faq-q" type="button" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="faq-a-${i}">
        <span itemprop="name">${escHtml(q)}</span>
        <i class="fa-solid fa-chevron-down faq-chevron" aria-hidden="true"></i>
      </button>
      <div class="faq-a${i === 0 ? ' open' : ''}" id="faq-a-${i}" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <div class="faq-a-inner" itemprop="text">${formatContent(a)}</div>
      </div>
    </div>`;
  }).join('');
}

// Compact FAQ block used on the homepage (top N questions).
export function faqHomeSection(lang: Lang, faqs: any[]): string {
  const top = faqs.slice(0, 5);
  if (!top.length) return '';
  return `
<section class="section faq-section" id="faq" itemscope itemtype="https://schema.org/FAQPage">
  <div class="container" style="max-width:820px;">
    <div class="section-head">
      <span class="eyebrow" style="justify-content:center;">${t('faq_home_eyebrow', lang)}</span>
      <h2>${t('faq_title', lang)}</h2>
    </div>
    <div class="faq-list">${faqAccordion(lang, top)}</div>
    <div style="text-align:center;margin-top:36px;">
      <a href="/faq" class="btn btn-ghost">${t('faq_title', lang)} <i class="fa-solid fa-arrow-right" style="margin-left:6px;"></i></a>
    </div>
  </div>
</section>`;
}

// Dedicated /faq page (all questions, grouped-friendly single list).
export function faqPage(lang: Lang, settings: Record<string, string>, faqs: any[]): string {
  const list = faqs.length
    ? `<div class="faq-list" itemscope itemtype="https://schema.org/FAQPage">${faqAccordion(lang, faqs)}</div>`
    : `<p style="text-align:center;color:var(--text-faint);">${t('no_posts', lang)}</p>`;
  return `
${pageHero(lang, t('faq_title', lang), t('faq_sub', lang), settings)}
<section class="section">
  <div class="container" style="max-width:820px;">
    ${list}
    <div class="faq-cta reveal">
      <p>${t('faq_cta_line', lang)}</p>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
        <a href="/contact" class="btn btn-gold">${t('cta_enquire', lang)}</a>
        <button class="btn btn-ghost" onclick="openEnquiry()">${t('quick_enquiry', lang)}</button>
      </div>
    </div>
  </div>
</section>
${ctaBand(lang)}`;
}

// Build FAQPage structured data (for AEO / rich results).
export function faqJsonLd(lang: Lang, faqs: any[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.filter((f) => loc(f, 'question', lang)).map((f) => ({
      '@type': 'Question',
      name: loc(f, 'question', lang),
      acceptedAnswer: { '@type': 'Answer', text: loc(f, 'answer', lang) },
    })),
  };
}
