import { Hono } from 'hono';
import { Bindings } from '../types';
import { getSession } from '../lib/auth';

const app = new Hono<{ Bindings: Bindings }>();

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Studio · Vijayavyuham Admin</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="/static/logo.png">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" rel="stylesheet">
<link href="/static/admin.css" rel="stylesheet">
</head>
<body class="login-body">
  <div class="login-card">
    <img src="/static/logo.png" alt="Vijayavyuham" class="login-logo">
    <h1>Studio Access</h1>
    <p class="login-sub">Vijayavyuham Admin Dashboard</p>
    <div class="form-msg" id="loginMsg"></div>
    <form id="loginForm">
      <div class="field"><label>Username</label><input type="text" name="username" autocomplete="username" required></div>
      <div class="field"><label>Password</label><input type="password" name="password" autocomplete="current-password" required></div>
      <button type="submit" class="btn btn-gold btn-block">Sign In</button>
    </form>
    <p class="login-hint">Authorized personnel only.</p>
  </div>
<script>
document.getElementById('loginForm').addEventListener('submit', async function(e){
  e.preventDefault();
  var msg = document.getElementById('loginMsg');
  var data = Object.fromEntries(new FormData(e.target).entries());
  var btn = e.target.querySelector('button');
  btn.disabled = true; btn.textContent = 'Signing in...';
  try {
    var r = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
    var j = await r.json();
    if (r.ok) { window.location.href = '/studio'; }
    else { msg.className='form-msg error'; msg.textContent = j.error || 'Login failed'; btn.disabled=false; btn.textContent='Sign In'; }
  } catch(err) { msg.className='form-msg error'; msg.textContent='Network error'; btn.disabled=false; btn.textContent='Sign In'; }
});
</script>
</body>
</html>`;

app.get('/', async (c) => {
  const session = await getSession(c);
  if (!session) {
    return c.html(LOGIN_HTML);
  }
  // Serve dashboard shell
  return c.html(dashboardHtml(session.displayName, session.role));
});

function dashboardHtml(displayName: string, role: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard · Vijayavyuham Studio</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="/static/logo.png">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Telugu:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" rel="stylesheet">
<link href="/static/admin.css" rel="stylesheet">
</head>
<body>
<div class="admin-shell">
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <img src="/static/logo.png" alt="VV">
      <div><strong>Vijayavyuham</strong><small>Studio</small></div>
    </div>
    <nav class="sidebar-nav" id="sidebarNav">
      <a data-view="dashboard" class="active"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
      <a data-view="enquiries"><i class="fa-solid fa-inbox"></i> Enquiries <span class="badge" id="unreadBadge"></span></a>
      <div class="nav-label">Content</div>
      <a data-view="services"><i class="fa-solid fa-briefcase"></i> Services</a>
      <a data-view="blogs"><i class="fa-solid fa-newspaper"></i> Blog Posts</a>
      <a data-view="gallery"><i class="fa-solid fa-images"></i> Gallery</a>
      <a data-view="team"><i class="fa-solid fa-users"></i> Team</a>
      <a data-view="testimonials"><i class="fa-solid fa-quote-left"></i> Testimonials</a>
      <div class="nav-label">Configuration</div>
      <a data-view="pages"><i class="fa-solid fa-toggle-on"></i> Pages On/Off</a>
      <a data-view="contact"><i class="fa-solid fa-address-book"></i> Contact Info</a>
      <a data-view="social"><i class="fa-solid fa-share-nodes"></i> Social Links</a>
      <a data-view="content"><i class="fa-solid fa-sliders"></i> Site Content</a>
    </nav>
    <div class="sidebar-foot">
      <div class="user-chip"><i class="fa-solid fa-user-shield"></i><div><strong>${escJs(displayName)}</strong><small>${role === 'developer' ? 'Developer' : 'Website Manager'}</small></div></div>
      <button id="logoutBtn" class="btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
    </div>
  </aside>
  <div class="admin-main">
    <header class="admin-topbar">
      <button class="menu-toggle" id="menuToggle"><i class="fa-solid fa-bars"></i></button>
      <h2 id="viewTitle">Dashboard</h2>
      <a href="/" target="_blank" class="btn-view-site"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Site</a>
    </header>
    <div class="admin-content" id="adminContent">
      <div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</div>
    </div>
  </div>
</div>
<div class="modal-overlay" id="editModal"><div class="admin-modal" id="editModalInner"></div></div>
<div class="toast" id="toast"></div>
<script src="/static/admin.js"></script>
</body>
</html>`;
}

function escJs(s: string): string {
  return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default app;
