# Vijayavyuham

Trilingual (English / తెలుగు / हिन्दी) political-campaign consultancy website
for Telangana & Andhra Pradesh, with a built-in admin panel.

## Project Overview
- **Name**: Vijayavyuham
- **Goal**: A modern, mobile-first marketing + content site for a political
  consultancy, manageable end-to-end from an admin panel — that runs with or
  without any external service connected.
- **Key idea**: Works in **offline demo mode** (in-memory data, default login)
  with zero services, and switches to a real **Supabase** database the moment
  you add two secrets — **with no code changes**.

## URLs
- **Production**: https://vijayavyuham.pages.dev
- **Admin panel**: https://vijayavyuham.pages.dev/studio
- **GitHub**: https://github.com/Kbs-sol/vijayavyuham

### Public routes
| Path | Notes |
|------|-------|
| `/` | Home |
| `/about` | About |
| `/services` · `/services/:slug` | Services list + detail |
| `/blog` · `/blog/:slug` | Blog list + post |
| `/gallery` | Media gallery (**disabled by default** — enable in admin) |
| `/team` | Team (**disabled by default** — enable in admin) |
| `/contact` | Contact + enquiry form |
| `/sitemap.xml` | SEO sitemap |
| `?lang=en\|te\|hi` | Force a language on any page |

### API routes
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/enquiry` | Contact-form submission (public) |
| POST | `/api/admin/login`, `/logout` | Admin auth |
| GET | `/api/admin/me`, `/stats` | Session + dashboard stats (reports storage mode) |
| GET/POST/PUT/DELETE | `/api/admin/{services\|blogs\|gallery\|team\|testimonials}` | Content CRUD |
| GET/PUT | `/api/admin/settings` | Site settings |
| GET | `/api/admin/enquiries` | Read enquiries |

## Currently completed features
- ✅ Trilingual public site (EN/TE/HI) with per-language DB columns
- ✅ Offline demo mode (in-memory store seeded with default content)
- ✅ Supabase (PostgreSQL/REST) backend — activates when secrets are set
- ✅ Stateless signed-cookie admin sessions (login works without any DB)
- ✅ Admin panel (Studio) — CRUD for services, blogs, gallery, team,
     testimonials, settings, page toggles; reads enquiries
- ✅ Universal embed gallery — paste Cloudinary / YouTube / Vimeo / direct
     image or video links; type auto-detected
- ✅ Mobile-first, mobile-optimized UI (slide-in drawer, safe-area insets,
     iOS-zoom-safe forms, ≥44px touch targets)
- ✅ Relocated language switcher (segmented header toggle + non-intrusive
     first-visit bottom toast; in mobile the toggle lives in the drawer)
- ✅ SEO: canonical, hreflang, Open Graph, Twitter, JSON-LD, sitemap
- ✅ Zero-service deployable — builds & deploys to Cloudflare even with
     nothing connected

## Data Architecture
- **Data models**: `settings` (key/value), `services`, `blogs`, `gallery`
  (uses `media_url` + `media_type`), `team`, `testimonials`, `enquiries`.
  Localized text columns are suffixed `_en` / `_te` / `_hi`.
- **Storage services**:
  - **Supabase (PostgreSQL)** via REST/PostgREST when `SUPABASE_URL` +
    `SUPABASE_SERVICE_KEY` are set.
  - **In-memory offline store** (seeded from `src/lib/seed-data.ts`) otherwise.
  - Both sit behind one `Store` interface (`src/lib/store.ts`), so routes are
    backend-agnostic.
- **Media**: Cloudinary / YouTube **embed links** (no file uploads, no API key
  required for the gallery to work).
- **Auth**: stateless HMAC-signed cookie (`src/lib/auth.ts`), no session table.

## Environment variables (all optional — see `.dev.vars.example`)
`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SESSION_SECRET`,
`ADMIN_DEV_PASSWORD`, `ADMIN_MGR_PASSWORD`, `CLOUDINARY_CLOUD_NAME`.
Set them as **Cloudflare Pages secrets** in production — never in code.

## User Guide
1. **Browse** the public site; switch languages with the EN·తె·हि toggle.
2. **Admin**: go to `/studio`, log in (demo: `developer` / `Vijaya@Dev2025`),
   and manage content. The dashboard shows whether you're in `offline` or
   `supabase` mode.
3. **Gallery**: add items by pasting a Cloudinary or YouTube link; enable the
   gallery page from Settings.
4. **Go live with a real DB**: run `supabase/schema.sql` in your Supabase
   project, then add `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` secrets and
   redeploy. See **[SYSTEM_GUIDE.md](SYSTEM_GUIDE.md)** for full details.

## Features not yet implemented
- Image/video uploading from the admin UI (currently link-based by design)
- Analytics dashboard for enquiries
- Multi-user admin accounts beyond the two built-in roles

## Recommended next steps
- Connect Supabase and set production secrets
- Add real contact phone / WhatsApp / email + social links in admin settings
- Populate the gallery and team, then enable those pages
- Set a strong `SESSION_SECRET` and override the demo admin passwords

## Deployment
- **Platform**: Cloudflare Pages (GitHub `main` → auto-deploy)
- **Build command**: `npm run build` · **Output dir**: `dist`
- **Status**: ✅ Active
- **Tech stack**: Hono + TypeScript + Vite + Cloudflare Pages; Supabase (optional)
- **Bindings**: none required (D1 removed) — deploys with zero services
- **Last Updated**: 2026-08-23

## Local development
```bash
npm install
npm run build
npm run dev:sandbox     # http://localhost:3000
```
Regenerate derived files after editing seed content:
```bash
python scripts/gen-seed.py          # seed.sql        -> src/lib/seed-data.ts
node scripts/gen-supabase-sql.mjs   # src/lib/seed... -> supabase/schema.sql
```
