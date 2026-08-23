# Vijayavyuham — Political Campaign Consultancy Website

## Project Overview
- **Name**: Vijayavyuham
- **Goal**: A premium, trust-building website + admin dashboard for a new-generation political campaign consultancy focused on the **Telugu states (Telangana & Andhra Pradesh)**. Services modeled on the idrs.in business model.
- **Tagline**: *Strategy • Intelligence • Impact*
- **Theme**: Luxury **Black & Gold**, minimalist editorial aesthetic engineered to make political leaders/parties feel *"this is the brand I want to work with."*

## Live URLs
- **Local dev (sandbox)**: served on port 3000 via PM2
- **Public page routes**: `/`, `/about`, `/services`, `/services/:slug`, `/blog`, `/blog/:slug`, `/gallery`, `/team`, `/contact`
- **Admin dashboard**: `/studio`
- **SEO**: `/sitemap.xml`, `/robots.txt`

## Admin Dashboard (`/studio`)
Two hardcoded testing credentials (both have **maximum access**):

| Role | Username | Password |
|------|----------|----------|
| Developer | `developer` | `Vijaya@Dev2025` |
| Website Manager | `manager` | `Vijaya@Mgr2025` |

> ⚠️ Change these in `src/types.ts` (`ADMIN_USERS`) before going to production. Sessions are stored in D1 and set as an httpOnly cookie (12h expiry).

### Admin features (full CRUD)
- **Dashboard** — stats + quick actions, unread enquiry counter
- **Enquiries** — read submissions, mark read, reply via email/call/WhatsApp, delete
- **Services** — CRUD, sort order, icon, active toggle, EN/TE/HI + feature bullets
- **Blog Posts** — CRUD, EN/TE/HI content, SEO meta fields, draft/publish
- **Gallery** — CRUD (page auto-appears only when Gallery is enabled)
- **Team** — CRUD (page auto-appears only when Team is enabled)
- **Testimonials** — CRUD (shown on home page)
- **Pages On/Off** — toggle About / Services / Blog / Gallery / Team / Contact. Disabled pages are removed from nav + return 404.
- **Contact Info** — phone, WhatsApp, email, address (EN/TE/HI)
- **Social Links** — Facebook, Instagram, WhatsApp, Twitter/X, YouTube. **Only filled-in links appear** anywhere in the UI; empty ones are hidden.
- **Site Content** — homepage hero, About body/mission/vision, SEO defaults (all trilingual)

## Key Features
### Multilingual (Telugu / Hindi / English)
- **English is default**. First-time visitors see a full-screen language chooser (once).
- Language switcher in the header; choice persisted via cookie + `?lang=` param.
- All UI strings + all DB content are fully trilingual.

### Trust / psychological hooks (honest — no fabricated stats)
- Premium black-gold visual language signalling authority & competence.
- "Evidence-led", "Booth-level execution", "Built for Telangana & AP" trust chips.
- Values (Integrity / Evidence / Partnership), honest generic testimonials.
- No invented "500+ campaigns" claims — messaging is engineered for a *new* firm.

### Direct contact — everywhere, non-intrusive
- Floating action buttons on every page: WhatsApp, direct Call, Quick Enquiry modal.
- Enquiry modal + full contact form both post to `/api/enquiry` → stored in DB (users never leave the site).
- Contact channels only render when the admin has filled them in.

### SEO / GEO / AEO (organic traffic for Telangana & AP)
- Per-page `<title>`, meta description, keywords, canonical, hreflang (en/te/hi).
- Open Graph + Twitter cards.
- **JSON-LD structured data**: `ProfessionalService`, `Service`, `ItemList`, `BlogPosting`, `WebSite` — with `areaServed` = Telangana & Andhra Pradesh.
- `geo.region` meta (IN-TG / IN-AP), dynamic `sitemap.xml`, `robots.txt`.
- Semantic HTML, fast edge rendering, SEO-optimized seed blog posts targeting Telugu-state political keywords.

## API Endpoints
### Public
- `POST /api/enquiry` — submit an enquiry (name + message required; honeypot protected)

### Admin (require auth cookie)
- `POST /api/admin/login` · `POST /api/admin/logout` · `GET /api/admin/me`
- `GET /api/admin/stats`
- `GET|POST /api/admin/settings`
- `GET|POST|PUT|DELETE /api/admin/services[/:id]`
- `GET|POST|PUT|DELETE /api/admin/blogs[/:id]`
- `GET|POST|PUT|DELETE /api/admin/gallery[/:id]`
- `GET|POST|PUT|DELETE /api/admin/team[/:id]`
- `GET|POST|PUT|DELETE /api/admin/testimonials[/:id]`
- `GET|PUT|DELETE /api/admin/enquiries[/:id]`

## Data Architecture
- **Storage**: Cloudflare **D1** (SQLite at the edge)
- **Tables**: `services`, `blogs`, `gallery`, `team`, `testimonials`, `enquiries`, `settings` (key-value: contact, socials, page toggles, hero/about content, SEO), `admin_sessions`
- **i18n pattern**: localized columns `*_en` / `*_te` / `*_hi`, falling back to English.
- **13 services** seeded (Survey & Research → Door-to-Door Campaign), matching the requested business list.

## Tech Stack
- **Backend**: Hono (TypeScript) on Cloudflare Pages/Workers
- **Frontend**: Server-rendered HTML + vanilla JS, Font Awesome, Google Fonts (Cormorant Garamond serif + Inter + Noto Sans Telugu/Devanagari)
- **DB**: Cloudflare D1
- **Build**: Vite + `@hono/vite-build`
- **Process**: PM2 (`wrangler pages dev`)

## Local Development
```bash
npm run build                 # build to dist/
npm run db:migrate:local      # apply migrations to local D1
npm run db:seed               # seed data
pm2 start ecosystem.config.cjs
# → http://localhost:3000  (site)   /studio  (admin)

npm run db:reset              # wipe + re-migrate + re-seed local DB
```

## Deployment (Cloudflare Pages)
1. Create the production D1 DB: `npx wrangler d1 create vijayavyuham-production` and paste the `database_id` into `wrangler.jsonc`.
2. `npm run db:migrate:prod` then seed prod.
3. `npm run deploy:prod` (or via the platform hosted-deploy).
> Uses only **D1** (no KV) so it is compatible with the platform's one-click hosted deploy.

## Status
- **Deployment**: ⏳ Ready to deploy (not yet published to Cloudflare)
- **Last Updated**: 2026-08-23

## Recommended Next Steps
1. Add real contact details, social links, team members, and gallery photos via `/studio`.
2. Change the admin credentials in `src/types.ts`.
3. Deploy to Cloudflare Pages + connect a custom domain.
4. Submit `sitemap.xml` to Google Search Console; add a Google Business profile for local (GEO) ranking.
5. Optionally add image upload (Cloudflare R2) instead of pasting image URLs.
