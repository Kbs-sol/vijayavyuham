-- ============================================================
-- Vijayavyuham Database Schema
-- ============================================================

-- Services table (13 political campaign services)
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  icon TEXT DEFAULT 'fa-chart-line',
  -- English
  title_en TEXT NOT NULL,
  short_en TEXT,
  description_en TEXT,
  -- Telugu
  title_te TEXT,
  short_te TEXT,
  description_te TEXT,
  -- Hindi
  title_hi TEXT,
  short_hi TEXT,
  description_hi TEXT,
  -- Feature bullet points (JSON array of {en,te,hi})
  features TEXT DEFAULT '[]',
  image_url TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'General',
  cover_image TEXT,
  author TEXT DEFAULT 'Vijayavyuham Team',
  -- English
  title_en TEXT NOT NULL,
  excerpt_en TEXT,
  content_en TEXT,
  -- Telugu
  title_te TEXT,
  excerpt_te TEXT,
  content_te TEXT,
  -- Hindi
  title_hi TEXT,
  excerpt_hi TEXT,
  content_hi TEXT,
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  is_published INTEGER DEFAULT 1,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery items
CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  sort_order INTEGER DEFAULT 0,
  title_en TEXT,
  title_te TEXT,
  title_hi TEXT,
  caption_en TEXT,
  caption_te TEXT,
  caption_hi TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Team members
CREATE TABLE IF NOT EXISTS team (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  photo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  role_en TEXT,
  role_te TEXT,
  role_hi TEXT,
  bio_en TEXT,
  bio_te TEXT,
  bio_hi TEXT,
  linkedin TEXT,
  twitter TEXT,
  email TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Enquiries (contact form submissions)
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  service_interest TEXT,
  source_page TEXT,
  status TEXT DEFAULT 'new',
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site settings (key-value store: contact info, social links, page toggles, meta)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials / trust signals
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name TEXT NOT NULL,
  author_role TEXT,
  photo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  quote_en TEXT,
  quote_te TEXT,
  quote_hi TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin users (for reference; auth is hardcoded in app but we log activity)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_team_active ON team(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status, created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON admin_sessions(token);
