# Vijayavyuham — System Literacy Guide

A complete, plain-language guide to how this website works, how to run it,
how to connect a real database and media, and how it is deployed.

> **The one big idea:** the site works **with or without** any external
> service. With nothing connected it runs in **offline demo mode** (data
> lives in memory, default admin login works) so you can show every feature.
> The moment you connect Supabase, it runs on your real database instead —
> **with no code changes**.

---

## 1. What this project is

Vijayavyuham is a trilingual (English / తెలుగు / हिन्दी) political-campaign
consultancy website for Telangana & Andhra Pradesh, with a built-in admin
panel ("Studio") to manage content.

**Tech stack**

| Layer         | Technology                                        |
|---------------|---------------------------------------------------|
| Framework     | [Hono](https://hono.dev) (TypeScript)             |
| Runtime       | Cloudflare Pages / Workers (edge)                 |
| Build         | Vite + `@hono/vite-build`                         |
| Database      | Supabase (PostgreSQL via REST) — **optional**     |
| Media         | Cloudinary / YouTube **embed links** — no upload  |
| Styling       | Hand-written CSS (black & gold theme), mobile-first|

---

## 2. The two modes (offline vs connected)

The whole app talks to **one** data interface called `Store`
(`src/lib/store.ts`). At runtime, a factory picks the backend:

```
getStore(env):
   if SUPABASE_URL and SUPABASE_SERVICE_KEY are set  ->  SupabaseStore  (real DB)
   otherwise                                          ->  OfflineStore   (in-memory demo)
```

### Offline mode (nothing connected)
- Data is seeded from `src/lib/seed-data.ts` (13 services, 8 blog posts,
  10 FAQs, testimonials, all site settings).
- Kept in memory for the life of the worker instance. Admin edits are
  visible during the session but **reset** when the instance recycles.
- Admin login works with the built-in demo credentials (below).
- **Purpose:** demonstrate that every feature works before you connect anything.

### Connected mode (Supabase set)
- Every read/write goes to your Supabase PostgreSQL database.
- Data is permanent. Multiple admins see the same content.
- **Nothing else changes** — same pages, same admin panel.

You can check which mode is live: log into the admin panel — the dashboard
shows a **storage** badge (`offline` or `supabase`). The API also reports it
at `GET /api/admin/stats` → `"storage": "offline" | "supabase"`.

---

## 3. Running it locally

```bash
npm install
npm run build          # compile to dist/
npm run dev:sandbox    # wrangler pages dev on http://localhost:3000
```

By default this starts in **offline mode**. To test with a real database,
create a `.dev.vars` file (copy from `.dev.vars.example`) and add your
Supabase URL + service key, then rebuild.

Public site: `http://localhost:3000`
Admin panel: `http://localhost:3000/studio`

---

## 4. Connecting Supabase (one-time)

1. Create a free project at <https://supabase.com>.
2. Open **SQL Editor → New query**.
3. Paste the **entire** contents of [`supabase/schema.sql`](supabase/schema.sql)
   and click **RUN**. This creates all tables and loads the same default
   content the demo uses. (Safe to re-run.)
4. Go to **Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret key → `SUPABASE_SERVICE_KEY`
5. Add those two as **Cloudflare secrets** (see §7). Redeploy.

That's it — the site is now backed by your database.

> **Regenerating the SQL (source-of-truth chain):** the single source of
> truth for default content is **`seed.sql`**. Two generators derive the
> rest — always run **both, in order**, after editing `seed.sql`:
> ```bash
> python3 scripts/gen-seed.py          # seed.sql        -> src/lib/seed-data.ts
> node    scripts/gen-supabase-sql.mjs # src/lib/seed-data.ts -> supabase/schema.sql
> ```
> `gen-seed.py` reads **every** `INSERT OR REPLACE INTO <table>` block for a
> table (so you can split content across multiple INSERTs) and also applies
> simple `UPDATE <table> SET col='…' WHERE slug='…'` statements — this is how
> blog cover images are attached without rewriting the original INSERT.

> **Security note:** the `service_role` key bypasses row-level security and
> is used **server-side only** inside the Worker. It is never sent to the
> browser. Keep it in Cloudflare secrets, never in the code or in git.

---

## 5. Media & the gallery (Cloudinary / YouTube — universal embed)

The gallery does **not** upload files. In the admin panel you paste a
**link**, and the site figures out how to display it. Supported links
(`src/lib/embed.ts`):

| You paste…                                             | Rendered as            |
|--------------------------------------------------------|------------------------|
| `https://youtu.be/…`, `youtube.com/watch?v=…`, shorts, live | YouTube player (privacy `youtube-nocookie`) |
| `https://vimeo.com/123456`                             | Vimeo player           |
| Cloudinary image URL (`res.cloudinary.com/.../image/...`) | `<img>`             |
| Cloudinary video URL (`res.cloudinary.com/.../video/...`) | `<video controls>`  |
| Any direct `.jpg/.png/.webp/.gif/...`                  | `<img>`                |
| Any direct `.mp4/.webm/.mov/...`                       | `<video controls>`     |
| Anything else                                          | treated as an image    |

**How to use Cloudinary:** upload your image/video in the Cloudinary
dashboard, copy its delivery URL, and paste it into the gallery item's
"media URL" field. No API key needed — it's just a public link.

**How to use YouTube:** publish the video on YouTube, copy the watch/share
link, paste it. Done.

The gallery page is **disabled by default** (`page_gallery = 0`). Enable it
from the admin panel (Settings → page toggles) once you've added items.

### Built-in non-partisan imagery (bundled with the site)

The homepage hero, the **"Built for every kind of political engagement"**
section (`#who-we-work-with`), and every blog **cover image** use bundled
illustrative photos in `public/static/img/`:

| File                          | Used on                              |
|-------------------------------|--------------------------------------|
| `parties-rally.jpg`           | homepage hero visual + blog covers   |
| `parties-ap.jpg`              | engagement-section banner + covers   |
| `parties-telangana.jpg`       | blog covers                          |

**Non-partisan by design.** Every image shows **multiple rival parties
equally** (never one party alone) and each is captioned with a disclaimer:
*"We work with all parties and independents. Party symbols shown are for
illustration only and imply no endorsement."* When adding or replacing any
party imagery, keep this rule — the brand is deliberately neutral. To swap an
image, drop a replacement of the same name into `public/static/img/`, or
point a blog's `cover_image` at a new `/static/img/…` path (via `seed.sql`
UPDATE + regenerate, or the admin panel once connected).

---

## 6. The admin panel ("Studio")

- URL: `/studio`
- Two roles ship built-in:

  | Role       | Username    | Password (demo default) |
  |------------|-------------|-------------------------|
  | Developer  | `developer` | `Vijaya@Dev2025`        |
  | Manager    | `manager`   | `Vijaya@Mgr2025`        |

  **Change these in production** by setting `ADMIN_DEV_PASSWORD` and
  `ADMIN_MGR_PASSWORD` secrets (see §7).

### How login works (no database required)
Sessions are **stateless, HMAC-signed cookies** (`src/lib/auth.ts`):
- On login, the server checks the username/password, then issues a cookie
  containing a signed token `{username, role, displayName, exp}`.
- The signature uses `SESSION_SECRET` (HMAC-SHA256 via Web Crypto).
- No session table, no database lookup — so **login works even in offline
  mode** and even before Supabase is connected.
- Cookie is `httpOnly`, `secure`, `SameSite=Lax`, expires in 12 hours.

### What you can manage
Services, blog posts, gallery items, team members, testimonials, contact
info, social links, page on/off toggles, and read incoming enquiries.

---

## 7. Environment variables & secrets

**Every variable is optional.** With none set → offline demo mode.

| Variable                | Purpose                                          | If unset |
|-------------------------|--------------------------------------------------|----------|
| `SUPABASE_URL`          | Supabase project URL                             | offline mode |
| `SUPABASE_SERVICE_KEY`  | service_role key (server-side only)              | offline mode |
| `SESSION_SECRET`        | signs the admin session cookie                   | built-in default (set your own in prod) |
| `ADMIN_DEV_PASSWORD`    | overrides the `developer` password               | demo default |
| `ADMIN_MGR_PASSWORD`    | overrides the `manager` password                 | demo default |
| `CLOUDINARY_CLOUD_NAME` | shows upload hints in admin (gallery still works without it) | hint hidden |

**Setting secrets in production (Cloudflare Pages):**

*Dashboard:* Pages → your project → **Settings → Environment variables** →
add each one and click **Encrypt** (this makes it a secret).

*CLI:*
```bash
npx wrangler pages secret put SUPABASE_URL
npx wrangler pages secret put SUPABASE_SERVICE_KEY
npx wrangler pages secret put SESSION_SECRET
# …etc
```

**Never** hard-code these in source or commit `.dev.vars` — it is git-ignored.

---

## 8. Deployment

This project is wired for **GitHub → Cloudflare Pages auto-deploy**:

1. Push to the `main` branch on GitHub.
2. Cloudflare Pages (already connected to the repo) builds and deploys
   automatically to <https://vijayavyuham.pages.dev/>.

Build settings on Cloudflare:
- **Build command:** `npm run build`
- **Build output directory:** `dist`

Because the app has **no required bindings** (D1 was removed), it builds and
deploys successfully even with **zero services connected** — it simply runs
in offline demo mode until you add the Supabase secrets.

---

## 9. Taking it to production (go-live checklist)

The site is safe to ship at any moment (it degrades to offline demo mode),
but here is the recommended path to a **fully-integrated production build**,
in order.

### Step 1 — Connect the database (permanent content)
1. Create a Supabase project (§4).
2. Run `supabase/schema.sql` in the Supabase SQL Editor → creates tables +
   loads the 13 services / 8 blogs / 10 FAQs / testimonials / settings.
3. Add `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` as Cloudflare secrets (§7).
4. Redeploy. Confirm the admin dashboard **storage** badge reads `supabase`
   (or `GET /api/admin/stats` → `"storage":"supabase"`).

### Step 2 — Lock down the admin panel
1. Set a strong, unique `SESSION_SECRET` (any long random string).
2. Override `ADMIN_DEV_PASSWORD` and `ADMIN_MGR_PASSWORD` — **never** ship the
   demo defaults.
3. Log in once with each role to confirm the new passwords work.

### Step 3 — Real content & media
- Replace demo blog/service copy in the admin panel (or edit `seed.sql` and
  regenerate — see §4).
- Add gallery items as Cloudinary/YouTube links (§5) and enable the gallery
  page toggle.
- Swap the bundled party imagery for your own **non-partisan** photos if
  desired (§5), keeping the disclaimer captions.

### Step 4 — Brand, contact & social
- In the admin **Settings**: business name, phone, WhatsApp number, email,
  address, and social links. These feed the header, footer, floating action
  buttons, and the `ProfessionalService` JSON-LD.

### Step 5 — Custom domain (recommended for SEO)
1. Cloudflare Pages → your project → **Custom domains** → add e.g.
   `vijayavyuham.com`.
2. Update `SITE_URL` in `src/routes/public.tsx` to the final origin so
   canonical URLs, `hreflang`, Open Graph, sitemap, and JSON-LD all emit the
   real domain, then redeploy.
3. Submit `https://<domain>/sitemap.xml` in Google Search Console and Bing
   Webmaster Tools.

### Step 6 — Third-party services (optional, all via REST from the Worker)
Because this runs on Cloudflare Workers, any heavier capability is added as a
**server-side REST call** inside a Hono route (keep every token in a
Cloudflare secret, never in the browser):

| Need                    | Suggested service (REST)         | Where it plugs in                    |
|-------------------------|----------------------------------|--------------------------------------|
| Email enquiry alerts    | Resend / SendGrid / Mailgun      | `routes/public-api.ts` `/api/enquiry`|
| WhatsApp/SMS/IVR        | Twilio / Gupshup / Meta Cloud API| new route in `routes/public-api.ts`  |
| Analytics               | Cloudflare Web Analytics / Plausible | `<script>` in `views/layout.ts`  |
| Captcha / spam guard    | Cloudflare Turnstile             | contact form + `/api/enquiry`        |
| Error monitoring        | Sentry (edge SDK)                | `src/index.tsx` app-level handler    |

Pattern for any of them:
```ts
// inside a Hono route — env.MY_TOKEN comes from a Cloudflare secret
const res = await fetch('https://api.provider.com/v1/…', {
  method: 'POST',
  headers: { Authorization: `Bearer ${c.env.MY_TOKEN}`, 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});
```

### Step 7 — Final verification
- `npm run build` is clean; all public routes return **200**.
- `robots.txt` and `sitemap.xml` load and list every page.
- Test the three languages (`?lang=en|te|hi`) and the contact form end-to-end.
- Run the deployed URL through Google's Rich Results Test to confirm the
  structured data (below) is valid.

---

## 10. SEO / AEO / GEO stack (what's built in)

The site ships search-, answer-, and geo-optimized out of the box. All of it
is emitted server-side in `views/layout.ts` and `routes/public.tsx`.

**Classic SEO**
- Per-page `<title>`, meta description, and keywords (editable per blog/service).
- **Canonical** URL + **`hreflang`** alternates for `en` / `te` / `hi` on every page.
- **Open Graph** + **Twitter Card** tags (blog covers become the share image).
- `sitemap.xml` (all pages, all languages) and `robots.txt`.
- Semantic HTML, mobile-first, fast edge delivery, lazy-loaded images.

**AEO (Answer-Engine Optimization)** — helps Google's AI answers, Perplexity, etc.
- **FAQPage** JSON-LD + inline microdata on `/faq` and the homepage FAQ block.
- **BlogPosting** JSON-LD on every article, enriched with `dateModified`,
  `mainEntityOfPage`, `inLanguage`, and the cover `image`.
- **BreadcrumbList** JSON-LD on every sub-page (Home → section → item).
- **WebSite** + **SearchAction**, **ItemList** (services), **Service** JSON-LD.
- **ProfessionalService** organization schema in the layout (name, area served,
  contact, socials — driven by admin settings).

**GEO (geographic targeting)**
- `geo.region` meta for **IN-TG** (Telangana) and **IN-AP** (Andhra Pradesh),
  plus place-name signals throughout copy and metadata.
- `areaServed` on the organization schema.

**Organic-traffic content layer**
- 8 authority blog posts (exit polls, psephology, survey methodology,
  booth strategy, digital outreach, choosing a consultant, etc.) — trilingual,
  keyword-targeted, and cross-linked, so the blog acts as a topical hub.

> **After changing the domain**, update `SITE_URL` in
> `src/routes/public.tsx` so every canonical/OG/sitemap/JSON-LD URL is correct.

---

## 11. Project structure

```
src/
  index.tsx            app entry (mounts routes)
  types.ts             env Bindings + admin user config
  lib/
    store.ts           Store interface + SupabaseStore + OfflineStore + getStore()
    seed-data.ts       AUTO-GENERATED default content (offline seed)
    auth.ts            stateless signed-cookie sessions (no DB)
    embed.ts           universal media embed resolver
    data.ts            settings helpers, pageEnabled(), activeSocials()
    i18n.ts            translations + language list
  routes/
    public.tsx         all public pages
    public-api.ts      /api/enquiry (contact form)
    admin-api.ts       /api/admin/* CRUD (auth-protected)
    studio.ts          /studio admin UI (login + dashboard)
  views/
    layout.ts          shared HTML shell (header, footer, mobile drawer, lang)
    pages.ts           page bodies + gallery embed rendering
public/static/
    style.css          mobile-first theme
    app.js             menu, language toggle, forms, reveal animations
supabase/
    schema.sql         GENERATED Postgres schema + seed (paste into Supabase)
scripts/
    gen-seed.py        seed.sql -> seed-data.ts
    gen-supabase-sql.mjs seed-data.ts -> supabase/schema.sql
migrations/            legacy D1 schema (reference only; D1 no longer used)
```

---

## 12. Language UX

- A compact **segmented toggle** (EN · తె · हि) is always visible: in the
  header on desktop, and inside the mobile menu drawer on phones.
- On a first visit a **non-intrusive bottom toast** offers a language choice.
  It never blocks the page and is dismissible; the choice is remembered in
  the `vv_lang` cookie.
- Language can also be forced with `?lang=te` / `?lang=hi` / `?lang=en`.

---

## 13. Mobile-first design

- Base styles target phones; larger layouts are progressive enhancements.
- Touch targets are ≥44px; form inputs use 16px font to stop iOS auto-zoom.
- The mobile menu is a slide-in drawer with a dimmed backdrop, body-scroll
  lock, and it closes on link tap / backdrop tap / Escape.
- Floating WhatsApp/Call/Enquire buttons respect the device safe-area inset.

---

## 14. Common questions

**Q: I deployed but see demo content — is it broken?**
No. That's offline mode. Add `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` secrets
and redeploy to use your real database.

**Q: My admin edits disappeared.**
In offline mode edits are in-memory and reset when the worker recycles.
Connect Supabase for permanent storage.

**Q: The gallery page shows 404.**
It's disabled by default. Enable `page_gallery` in the admin settings.

**Q: How do I change the admin password?**
Set `ADMIN_DEV_PASSWORD` / `ADMIN_MGR_PASSWORD` secrets in Cloudflare.
