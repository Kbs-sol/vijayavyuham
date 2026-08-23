// ============================================================
// Vijayavyuham Studio — Admin Dashboard SPA
// ============================================================
(function () {
  'use strict';
  const API = '/api/admin';
  const content = document.getElementById('adminContent');
  const viewTitle = document.getElementById('viewTitle');
  const modal = document.getElementById('editModal');
  const modalInner = document.getElementById('editModalInner');

  // ---------- helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function toast(msg, isErr) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.className = 'toast show' + (isErr ? ' error' : '');
    setTimeout(function () { el.className = 'toast' + (isErr ? ' error' : ''); }, 3000);
  }
  async function api(path, opts) {
    const r = await fetch(API + path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts));
    if (r.status === 401) { window.location.href = '/studio'; throw new Error('unauth'); }
    const j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw new Error(j.error || 'Request failed');
    return j;
  }
  function openModal(html) { modalInner.innerHTML = html; modal.classList.add('open'); }
  function closeModal() { modal.classList.remove('open'); modalInner.innerHTML = ''; }
  window.closeAdminModal = closeModal;
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  function langTabs(fields, values) {
    // fields: [{key, label, type}], produces EN/TE/HI tabbed panes
    const langs = [['en', 'English'], ['te', 'తెలుగు'], ['hi', 'हिन्दी']];
    let tabs = '<div class="lang-tabs">';
    langs.forEach(function (l, i) { tabs += '<div class="lang-tab' + (i === 0 ? ' active' : '') + '" data-lang="' + l[0] + '">' + l[1] + '</div>'; });
    tabs += '</div>';
    let panes = '';
    langs.forEach(function (l, i) {
      panes += '<div class="lang-pane' + (i === 0 ? ' active' : '') + '" data-lang="' + l[0] + '">';
      fields.forEach(function (f) {
        const name = f.key + '_' + l[0];
        const val = values ? (values[name] || '') : '';
        panes += fieldHtml(name, f.label + ' (' + l[1] + ')', f.type, val, f.optional);
      });
      panes += '</div>';
    });
    return tabs + panes;
  }
  function fieldHtml(name, label, type, val, optional, hint) {
    val = val == null ? '' : val;
    let input;
    if (type === 'textarea') input = '<textarea name="' + name + '"' + (optional ? '' : '') + '>' + esc(val) + '</textarea>';
    else if (type === 'richtext') input = '<textarea name="' + name + '" style="min-height:200px;">' + esc(val) + '</textarea>';
    else input = '<input type="' + (type || 'text') + '" name="' + name + '" value="' + esc(val) + '">';
    return '<div class="field"><label>' + esc(label) + (optional ? ' <span style="color:var(--text-faint);text-transform:none;">(optional)</span>' : '') + '</label>' + input + (hint ? '<div class="hint">' + esc(hint) + '</div>' : '') + '</div>';
  }
  function bindLangTabs(scope) {
    (scope || document).querySelectorAll('.lang-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        const parent = tab.closest('.admin-modal') || document;
        parent.querySelectorAll('.lang-tab').forEach(function (t) { t.classList.remove('active'); });
        parent.querySelectorAll('.lang-pane').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        const pane = parent.querySelector('.lang-pane[data-lang="' + tab.getAttribute('data-lang') + '"]');
        if (pane) pane.classList.add('active');
      });
    });
  }
  function formData(form) {
    const d = {};
    new FormData(form).forEach(function (v, k) { d[k] = v; });
    return d;
  }
  function confirmDelete(msg, cb) {
    if (window.confirm(msg || 'Delete this item? This cannot be undone.')) cb();
  }

  // ---------- VIEWS ----------
  const views = {};

  // Dashboard
  views.dashboard = async function () {
    viewTitle.textContent = 'Dashboard';
    const s = await api('/stats');
    content.innerHTML =
      '<div class="stats-grid">' +
      statCard('fa-inbox', s.unread, 'Unread Enquiries', true) +
      statCard('fa-envelope', s.enquiries, 'Total Enquiries') +
      statCard('fa-briefcase', s.services, 'Services') +
      statCard('fa-newspaper', s.blogs, 'Blog Posts') +
      statCard('fa-images', s.gallery, 'Gallery Items') +
      statCard('fa-users', s.team, 'Team Members') +
      '</div>' +
      '<div class="panel"><div class="panel-head"><div><h3>Quick Actions</h3><p>Jump straight to a section</p></div></div>' +
      '<div class="quick-links">' +
      ql('enquiries', 'fa-inbox', 'View Enquiries') +
      ql('services', 'fa-briefcase', 'Manage Services') +
      ql('blogs', 'fa-newspaper', 'Write a Blog Post') +
      ql('pages', 'fa-toggle-on', 'Enable/Disable Pages') +
      ql('social', 'fa-share-nodes', 'Add Social Links') +
      ql('contact', 'fa-address-book', 'Update Contact Info') +
      '</div></div>';
    updateUnreadBadge(s.unread);
  };
  function statCard(icon, num, lbl, hl) {
    return '<div class="stat-card' + (hl ? ' highlight' : '') + '"><div class="ico"><i class="fa-solid ' + icon + '"></i></div><div class="num">' + (num || 0) + '</div><div class="lbl">' + lbl + '</div></div>';
  }
  function ql(view, icon, label) { return '<a class="ql" data-goto="' + view + '"><i class="fa-solid ' + icon + '"></i> ' + label + '</a>'; }

  // ENQUIRIES
  views.enquiries = async function () {
    viewTitle.textContent = 'Enquiries';
    const { items } = await api('/enquiries');
    let rows = items.map(function (e) {
      return '<tr>' +
        '<td>' + (e.is_read ? '' : '<span class="pill new">New</span> ') + '<span class="title-cell">' + esc(e.name) + '</span><br><small>' + esc(e.created_at ? e.created_at.slice(0, 16).replace('T', ' ') : '') + '</small></td>' +
        '<td>' + (e.phone ? '<div><i class="fa-solid fa-phone" style="color:var(--gold);"></i> ' + esc(e.phone) + '</div>' : '') + (e.email ? '<div><i class="fa-solid fa-envelope" style="color:var(--gold);"></i> ' + esc(e.email) + '</div>' : '') + '</td>' +
        '<td>' + (e.service_interest ? esc(e.service_interest) + '<br>' : '') + '<small>' + esc((e.message || '').slice(0, 80)) + ((e.message || '').length > 80 ? '…' : '') + '</small></td>' +
        '<td><div class="row-actions"><button class="icon-btn" data-enq-view="' + e.id + '" title="View"><i class="fa-solid fa-eye"></i></button><button class="icon-btn danger" data-enq-del="' + e.id + '" title="Delete"><i class="fa-solid fa-trash"></i></button></div></td>' +
        '</tr>';
    }).join('');
    content.innerHTML = '<div class="panel"><div class="panel-head"><div><h3>Enquiries</h3><p>Messages sent through the website</p></div></div>' +
      (items.length ? '<table class="data-table"><thead><tr><th>From</th><th>Contact</th><th>Message</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : emptyState('fa-inbox', 'No enquiries yet')) + '</div>';
    window.__enq = items;
    content.querySelectorAll('[data-enq-view]').forEach(function (b) { b.onclick = function () { viewEnquiry(b.getAttribute('data-enq-view')); }; });
    content.querySelectorAll('[data-enq-del]').forEach(function (b) { b.onclick = function () { confirmDelete('Delete this enquiry?', async function () { await api('/enquiries/' + b.getAttribute('data-enq-del'), { method: 'DELETE' }); toast('Deleted'); views.enquiries(); refreshBadge(); }); }; });
  };
  async function viewEnquiry(id) {
    const e = (window.__enq || []).find(function (x) { return String(x.id) === String(id); });
    if (!e) return;
    if (!e.is_read) { api('/enquiries/' + id, { method: 'PUT', body: JSON.stringify({ status: e.status || 'read', is_read: 1 }) }).then(refreshBadge); }
    openModal('<h3>Enquiry <button class="modal-x" onclick="closeAdminModal()">&times;</button></h3>' +
      '<div class="field"><label>Name</label><div>' + esc(e.name) + '</div></div>' +
      '<div class="form-grid"><div class="field"><label>Phone</label><div>' + (e.phone ? esc(e.phone) : '—') + '</div></div>' +
      '<div class="field"><label>Email</label><div>' + (e.email ? esc(e.email) : '—') + '</div></div></div>' +
      '<div class="field"><label>Service of Interest</label><div>' + (e.service_interest ? esc(e.service_interest) : '—') + '</div></div>' +
      '<div class="field"><label>Source Page</label><div>' + esc(e.source_page || '—') + '</div></div>' +
      '<div class="field"><label>Message</label><div style="white-space:pre-wrap;background:var(--black);padding:14px;border-radius:6px;border:1px solid var(--gold-line);">' + esc(e.message) + '</div></div>' +
      '<div class="modal-actions">' +
      (e.phone ? '<a class="btn btn-ghost" href="tel:' + esc(e.phone) + '"><i class="fa-solid fa-phone"></i> Call</a>' : '') +
      (e.phone ? '<a class="btn btn-ghost" href="https://wa.me/' + String(e.phone).replace(/[^0-9]/g, '') + '" target="_blank"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>' : '') +
      (e.email ? '<a class="btn btn-gold" href="mailto:' + esc(e.email) + '"><i class="fa-solid fa-reply"></i> Reply by Email</a>' : '') +
      '</div>');
  }

  // SERVICES
  views.services = async function () {
    viewTitle.textContent = 'Services';
    const { items } = await api('/services');
    const rows = items.map(function (s) {
      return '<tr><td><i class="fa-solid ' + esc(s.icon) + '" style="color:var(--gold);width:20px;"></i> <span class="title-cell">' + esc(s.title_en) + '</span><br><small>' + esc(s.slug) + '</small></td>' +
        '<td>' + s.sort_order + '</td>' +
        '<td><span class="pill ' + (s.is_active ? 'on' : 'off') + '">' + (s.is_active ? 'Active' : 'Hidden') + '</span></td>' +
        '<td><div class="row-actions"><button class="icon-btn" data-edit="' + s.id + '"><i class="fa-solid fa-pen"></i></button><button class="icon-btn danger" data-del="' + s.id + '"><i class="fa-solid fa-trash"></i></button></div></td></tr>';
    }).join('');
    content.innerHTML = '<div class="panel"><div class="panel-head"><div><h3>Services</h3><p>Political campaign services shown on the site</p></div><button class="btn btn-gold" id="addBtn"><i class="fa-solid fa-plus"></i> Add Service</button></div>' +
      (items.length ? '<table class="data-table"><thead><tr><th>Service</th><th>Order</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : emptyState('fa-briefcase', 'No services yet')) + '</div>';
    document.getElementById('addBtn').onclick = function () { serviceForm(null); };
    bindEditDel(items, serviceForm, '/services', views.services);
  };
  function serviceForm(s) {
    const isEdit = !!s; s = s || {};
    openModal('<h3>' + (isEdit ? 'Edit' : 'Add') + ' Service <button class="modal-x" onclick="closeAdminModal()">&times;</button></h3>' +
      '<form id="svcForm">' +
      '<div class="form-grid">' +
      fieldHtml('slug', 'Slug (URL)', 'text', s.slug, false, 'e.g. voter-mapping') +
      fieldHtml('icon', 'Icon (Font Awesome)', 'text', s.icon || 'fa-chart-line', false, 'e.g. fa-map-location-dot') +
      fieldHtml('sort_order', 'Sort Order', 'number', s.sort_order || 0) +
      '<div class="field"><label>Active</label><select name="is_active"><option value="1"' + (s.is_active !== 0 ? ' selected' : '') + '>Active</option><option value="0"' + (s.is_active === 0 ? ' selected' : '') + '>Hidden</option></select></div>' +
      fieldHtml('image_url', 'Image URL', 'text', s.image_url, true) +
      '</div>' +
      langTabs([{ key: 'title', label: 'Title' }, { key: 'short', label: 'Short Description', type: 'textarea' }, { key: 'description', label: 'Full Description', type: 'richtext' }], s) +
      fieldHtml('features', 'Features (JSON array)', 'richtext', s.features || '[{"en":"","te":"","hi":""}]', true, 'Format: [{"en":"...","te":"...","hi":"..."}]') +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" onclick="closeAdminModal()">Cancel</button><button type="submit" class="btn btn-gold">Save Service</button></div>' +
      '</form>');
    bindLangTabs(modalInner);
    document.getElementById('svcForm').onsubmit = async function (e) {
      e.preventDefault();
      const d = formData(e.target);
      try { JSON.parse(d.features || '[]'); } catch (err) { toast('Features must be valid JSON', true); return; }
      try {
        if (isEdit) await api('/services/' + s.id, { method: 'PUT', body: JSON.stringify(d) });
        else await api('/services', { method: 'POST', body: JSON.stringify(d) });
        toast('Service saved'); closeModal(); views.services();
      } catch (err) { toast(err.message, true); }
    };
  }

  // BLOGS
  views.blogs = async function () {
    viewTitle.textContent = 'Blog Posts';
    const { items } = await api('/blogs');
    const rows = items.map(function (b) {
      return '<tr><td>' + (b.cover_image ? '<img class="thumb" src="' + esc(b.cover_image) + '">' : '<div class="thumb-ph"><i class="fa-solid fa-image"></i></div>') + '</td>' +
        '<td><span class="title-cell">' + esc(b.title_en) + '</span><br><small>' + esc(b.category) + ' · ' + esc(b.slug) + '</small></td>' +
        '<td><span class="pill ' + (b.is_published ? 'on' : 'off') + '">' + (b.is_published ? 'Published' : 'Draft') + '</span></td>' +
        '<td><div class="row-actions"><button class="icon-btn" data-edit="' + b.id + '"><i class="fa-solid fa-pen"></i></button><button class="icon-btn danger" data-del="' + b.id + '"><i class="fa-solid fa-trash"></i></button></div></td></tr>';
    }).join('');
    content.innerHTML = '<div class="panel"><div class="panel-head"><div><h3>Blog Posts</h3><p>SEO-optimized insights and articles</p></div><button class="btn btn-gold" id="addBtn"><i class="fa-solid fa-plus"></i> New Post</button></div>' +
      (items.length ? '<table class="data-table"><thead><tr><th></th><th>Title</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : emptyState('fa-newspaper', 'No blog posts yet')) + '</div>';
    document.getElementById('addBtn').onclick = function () { blogForm(null); };
    bindEditDel(items, blogForm, '/blogs', views.blogs);
  };
  function blogForm(b) {
    const isEdit = !!b; b = b || {};
    openModal('<h3>' + (isEdit ? 'Edit' : 'New') + ' Blog Post <button class="modal-x" onclick="closeAdminModal()">&times;</button></h3>' +
      '<form id="blogForm">' +
      '<div class="form-grid">' +
      fieldHtml('slug', 'Slug (URL)', 'text', b.slug, false, 'e.g. political-survey-in-telangana') +
      fieldHtml('category', 'Category', 'text', b.category || 'General') +
      fieldHtml('author', 'Author', 'text', b.author || 'Vijayavyuham Team') +
      '<div class="field"><label>Published</label><select name="is_published"><option value="1"' + (b.is_published !== 0 ? ' selected' : '') + '>Published</option><option value="0"' + (b.is_published === 0 ? ' selected' : '') + '>Draft</option></select></div>' +
      fieldHtml('cover_image', 'Cover Image URL', 'text', b.cover_image, true) +
      '</div>' +
      langTabs([{ key: 'title', label: 'Title' }, { key: 'excerpt', label: 'Excerpt', type: 'textarea' }, { key: 'content', label: 'Content', type: 'richtext' }], b) +
      '<div style="border-top:1px solid var(--gold-line);margin:16px 0;padding-top:16px;"><strong style="color:var(--gold);font-size:.8rem;letter-spacing:1px;">SEO</strong></div>' +
      '<div class="form-grid">' +
      fieldHtml('meta_title', 'Meta Title', 'text', b.meta_title, true) +
      fieldHtml('keywords', 'Keywords', 'text', b.keywords, true) +
      '</div>' + fieldHtml('meta_description', 'Meta Description', 'textarea', b.meta_description, true) +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" onclick="closeAdminModal()">Cancel</button><button type="submit" class="btn btn-gold">Save Post</button></div>' +
      '</form>');
    bindLangTabs(modalInner);
    document.getElementById('blogForm').onsubmit = async function (e) {
      e.preventDefault();
      const d = formData(e.target);
      try {
        if (isEdit) await api('/blogs/' + b.id, { method: 'PUT', body: JSON.stringify(d) });
        else await api('/blogs', { method: 'POST', body: JSON.stringify(d) });
        toast('Post saved'); closeModal(); views.blogs();
      } catch (err) { toast(err.message, true); }
    };
  }

  // GALLERY
  views.gallery = async function () {
    viewTitle.textContent = 'Gallery';
    const { items } = await api('/gallery');
    const rows = items.map(function (g) {
      return '<tr><td><img class="thumb" src="' + esc(g.image_url) + '"></td>' +
        '<td><span class="title-cell">' + esc(g.title_en || '—') + '</span><br><small>' + esc(g.category) + '</small></td>' +
        '<td>' + g.sort_order + '</td>' +
        '<td><span class="pill ' + (g.is_active ? 'on' : 'off') + '">' + (g.is_active ? 'Shown' : 'Hidden') + '</span></td>' +
        '<td><div class="row-actions"><button class="icon-btn" data-edit="' + g.id + '"><i class="fa-solid fa-pen"></i></button><button class="icon-btn danger" data-del="' + g.id + '"><i class="fa-solid fa-trash"></i></button></div></td></tr>';
    }).join('');
    content.innerHTML = '<div class="panel"><div class="panel-head"><div><h3>Gallery</h3><p>Enable the Gallery page under "Pages On/Off" to display these</p></div><button class="btn btn-gold" id="addBtn"><i class="fa-solid fa-plus"></i> Add Image</button></div>' +
      (items.length ? '<table class="data-table"><thead><tr><th></th><th>Title</th><th>Order</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : emptyState('fa-images', 'No gallery items yet')) + '</div>';
    document.getElementById('addBtn').onclick = function () { galleryForm(null); };
    bindEditDel(items, galleryForm, '/gallery', views.gallery);
  };
  function galleryForm(g) {
    const isEdit = !!g; g = g || {};
    openModal('<h3>' + (isEdit ? 'Edit' : 'Add') + ' Gallery Image <button class="modal-x" onclick="closeAdminModal()">&times;</button></h3>' +
      '<form id="galForm">' +
      fieldHtml('image_url', 'Image URL', 'text', g.image_url, false, 'Paste an image URL') +
      '<div class="form-grid">' + fieldHtml('category', 'Category', 'text', g.category || 'General') + fieldHtml('sort_order', 'Sort Order', 'number', g.sort_order || 0) + '</div>' +
      '<div class="field"><label>Status</label><select name="is_active"><option value="1"' + (g.is_active !== 0 ? ' selected' : '') + '>Shown</option><option value="0"' + (g.is_active === 0 ? ' selected' : '') + '>Hidden</option></select></div>' +
      langTabs([{ key: 'title', label: 'Title', optional: true }, { key: 'caption', label: 'Caption', type: 'textarea', optional: true }], g) +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" onclick="closeAdminModal()">Cancel</button><button type="submit" class="btn btn-gold">Save</button></div>' +
      '</form>');
    bindLangTabs(modalInner);
    document.getElementById('galForm').onsubmit = async function (e) {
      e.preventDefault(); const d = formData(e.target);
      try { if (isEdit) await api('/gallery/' + g.id, { method: 'PUT', body: JSON.stringify(d) }); else await api('/gallery', { method: 'POST', body: JSON.stringify(d) }); toast('Saved'); closeModal(); views.gallery(); } catch (err) { toast(err.message, true); }
    };
  }

  // TEAM
  views.team = async function () {
    viewTitle.textContent = 'Team';
    const { items } = await api('/team');
    const rows = items.map(function (m) {
      return '<tr><td>' + (m.photo_url ? '<img class="thumb" src="' + esc(m.photo_url) + '">' : '<div class="thumb-ph"><i class="fa-solid fa-user"></i></div>') + '</td>' +
        '<td><span class="title-cell">' + esc(m.name) + '</span><br><small>' + esc(m.role_en || '') + '</small></td>' +
        '<td>' + m.sort_order + '</td>' +
        '<td><span class="pill ' + (m.is_active ? 'on' : 'off') + '">' + (m.is_active ? 'Active' : 'Hidden') + '</span></td>' +
        '<td><div class="row-actions"><button class="icon-btn" data-edit="' + m.id + '"><i class="fa-solid fa-pen"></i></button><button class="icon-btn danger" data-del="' + m.id + '"><i class="fa-solid fa-trash"></i></button></div></td></tr>';
    }).join('');
    content.innerHTML = '<div class="panel"><div class="panel-head"><div><h3>Team</h3><p>Enable the Team page under "Pages On/Off" to display these</p></div><button class="btn btn-gold" id="addBtn"><i class="fa-solid fa-plus"></i> Add Member</button></div>' +
      (items.length ? '<table class="data-table"><thead><tr><th></th><th>Name</th><th>Order</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : emptyState('fa-users', 'No team members yet')) + '</div>';
    document.getElementById('addBtn').onclick = function () { teamForm(null); };
    bindEditDel(items, teamForm, '/team', views.team);
  };
  function teamForm(m) {
    const isEdit = !!m; m = m || {};
    openModal('<h3>' + (isEdit ? 'Edit' : 'Add') + ' Team Member <button class="modal-x" onclick="closeAdminModal()">&times;</button></h3>' +
      '<form id="teamForm">' +
      '<div class="form-grid">' + fieldHtml('name', 'Name', 'text', m.name) + fieldHtml('photo_url', 'Photo URL', 'text', m.photo_url, true) +
      fieldHtml('sort_order', 'Sort Order', 'number', m.sort_order || 0) +
      '<div class="field"><label>Status</label><select name="is_active"><option value="1"' + (m.is_active !== 0 ? ' selected' : '') + '>Active</option><option value="0"' + (m.is_active === 0 ? ' selected' : '') + '>Hidden</option></select></div>' +
      fieldHtml('linkedin', 'LinkedIn URL', 'text', m.linkedin, true) + fieldHtml('twitter', 'Twitter/X URL', 'text', m.twitter, true) + fieldHtml('email', 'Email', 'text', m.email, true) +
      '</div>' +
      langTabs([{ key: 'role', label: 'Role' }, { key: 'bio', label: 'Bio', type: 'textarea', optional: true }], m) +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" onclick="closeAdminModal()">Cancel</button><button type="submit" class="btn btn-gold">Save</button></div>' +
      '</form>');
    bindLangTabs(modalInner);
    document.getElementById('teamForm').onsubmit = async function (e) {
      e.preventDefault(); const d = formData(e.target);
      try { if (isEdit) await api('/team/' + m.id, { method: 'PUT', body: JSON.stringify(d) }); else await api('/team', { method: 'POST', body: JSON.stringify(d) }); toast('Saved'); closeModal(); views.team(); } catch (err) { toast(err.message, true); }
    };
  }

  // TESTIMONIALS
  views.testimonials = async function () {
    viewTitle.textContent = 'Testimonials';
    const { items } = await api('/testimonials');
    const rows = items.map(function (t) {
      return '<tr><td><span class="title-cell">' + esc(t.author_name) + '</span><br><small>' + esc(t.author_role || '') + '</small></td>' +
        '<td><small>' + esc((t.quote_en || '').slice(0, 90)) + '…</small></td>' +
        '<td><span class="pill ' + (t.is_active ? 'on' : 'off') + '">' + (t.is_active ? 'Active' : 'Hidden') + '</span></td>' +
        '<td><div class="row-actions"><button class="icon-btn" data-edit="' + t.id + '"><i class="fa-solid fa-pen"></i></button><button class="icon-btn danger" data-del="' + t.id + '"><i class="fa-solid fa-trash"></i></button></div></td></tr>';
    }).join('');
    content.innerHTML = '<div class="panel"><div class="panel-head"><div><h3>Testimonials</h3><p>Shown on the home page</p></div><button class="btn btn-gold" id="addBtn"><i class="fa-solid fa-plus"></i> Add Testimonial</button></div>' +
      (items.length ? '<table class="data-table"><thead><tr><th>Author</th><th>Quote</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : emptyState('fa-quote-left', 'No testimonials yet')) + '</div>';
    document.getElementById('addBtn').onclick = function () { testiForm(null); };
    bindEditDel(items, testiForm, '/testimonials', views.testimonials);
  };
  function testiForm(t) {
    const isEdit = !!t; t = t || {};
    openModal('<h3>' + (isEdit ? 'Edit' : 'Add') + ' Testimonial <button class="modal-x" onclick="closeAdminModal()">&times;</button></h3>' +
      '<form id="tForm">' +
      '<div class="form-grid">' + fieldHtml('author_name', 'Author Name', 'text', t.author_name) + fieldHtml('author_role', 'Author Role', 'text', t.author_role, true) +
      fieldHtml('sort_order', 'Sort Order', 'number', t.sort_order || 0) +
      '<div class="field"><label>Status</label><select name="is_active"><option value="1"' + (t.is_active !== 0 ? ' selected' : '') + '>Active</option><option value="0"' + (t.is_active === 0 ? ' selected' : '') + '>Hidden</option></select></div></div>' +
      langTabs([{ key: 'quote', label: 'Quote', type: 'textarea' }], t) +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" onclick="closeAdminModal()">Cancel</button><button type="submit" class="btn btn-gold">Save</button></div>' +
      '</form>');
    bindLangTabs(modalInner);
    document.getElementById('tForm').onsubmit = async function (e) {
      e.preventDefault(); const d = formData(e.target);
      try { if (isEdit) await api('/testimonials/' + t.id, { method: 'PUT', body: JSON.stringify(d) }); else await api('/testimonials', { method: 'POST', body: JSON.stringify(d) }); toast('Saved'); closeModal(); views.testimonials(); } catch (err) { toast(err.message, true); }
    };
  }

  // PAGES TOGGLE
  views.pages = async function () {
    viewTitle.textContent = 'Pages On/Off';
    const { settings } = await api('/settings');
    const pages = [
      ['about', 'About', 'Company story, mission & vision'],
      ['services', 'Services', 'All political campaign services'],
      ['blog', 'Blog', 'Articles and insights'],
      ['gallery', 'Gallery', 'Photos of campaign work'],
      ['team', 'Team', 'Your team members'],
      ['contact', 'Contact', 'Contact form & details'],
    ];
    let html = '<div class="panel"><div class="panel-head"><div><h3>Website Pages</h3><p>Turn pages on or off. Disabled pages are hidden from the menu and return 404. Home is always on.</p></div></div><div class="toggle-list">';
    pages.forEach(function (p) {
      const on = settings['page_' + p[0]] === '1';
      html += '<div class="toggle-row"><div class="info"><strong>' + p[1] + '</strong><small>' + p[2] + '</small></div>' +
        '<label class="switch"><input type="checkbox" data-page="' + p[0] + '"' + (on ? ' checked' : '') + '><span class="slider"></span></label></div>';
    });
    html += '</div></div>';
    content.innerHTML = html;
    content.querySelectorAll('[data-page]').forEach(function (cb) {
      cb.onchange = async function () {
        const key = 'page_' + cb.getAttribute('data-page');
        const obj = {}; obj[key] = cb.checked ? '1' : '0';
        try { await api('/settings', { method: 'POST', body: JSON.stringify(obj) }); toast(cb.getAttribute('data-page') + ' page ' + (cb.checked ? 'enabled' : 'disabled')); }
        catch (err) { toast(err.message, true); cb.checked = !cb.checked; }
      };
    });
  };

  // CONTACT INFO
  views.contact = async function () {
    viewTitle.textContent = 'Contact Info';
    const { settings } = await api('/settings');
    content.innerHTML = '<div class="panel"><div class="panel-head"><div><h3>Contact Information</h3><p>Phone, WhatsApp and Email power the call/WhatsApp/enquiry buttons. Leave blank to hide.</p></div></div>' +
      '<form id="contactForm">' +
      '<div class="form-grid">' +
      fieldHtml('contact_phone', 'Phone (call button)', 'text', settings.contact_phone, true, 'e.g. +91 98765 43210') +
      fieldHtml('contact_whatsapp', 'WhatsApp number', 'text', settings.contact_whatsapp, true, 'e.g. +91 98765 43210') +
      fieldHtml('contact_email', 'Email', 'text', settings.contact_email, true) +
      '</div>' +
      '<div style="border-top:1px solid var(--gold-line);margin:8px 0 16px;padding-top:16px;"><strong style="color:var(--gold);font-size:.8rem;letter-spacing:1px;">ADDRESS</strong></div>' +
      fieldHtml('contact_address_en', 'Address (English)', 'text', settings.contact_address_en, true) +
      fieldHtml('contact_address_te', 'Address (Telugu)', 'text', settings.contact_address_te, true) +
      fieldHtml('contact_address_hi', 'Address (Hindi)', 'text', settings.contact_address_hi, true) +
      '<div class="modal-actions"><button type="submit" class="btn btn-gold">Save Contact Info</button></div>' +
      '</form></div>';
    document.getElementById('contactForm').onsubmit = saveSettingsForm(views.contact);
  };

  // SOCIAL LINKS
  views.social = async function () {
    viewTitle.textContent = 'Social Links';
    const { settings } = await api('/settings');
    content.innerHTML = '<div class="panel"><div class="panel-head"><div><h3>Social Media Links</h3><p>Only links you fill in will appear on the website. Leave blank to hide that icon.</p></div></div>' +
      '<form id="socialForm">' +
      fieldHtml('social_facebook', 'Facebook URL', 'text', settings.social_facebook, true, 'https://facebook.com/...') +
      fieldHtml('social_instagram', 'Instagram URL', 'text', settings.social_instagram, true, 'https://instagram.com/...') +
      fieldHtml('social_whatsapp', 'WhatsApp link', 'text', settings.social_whatsapp, true, 'https://wa.me/91... or full URL') +
      fieldHtml('social_twitter', 'Twitter / X URL', 'text', settings.social_twitter, true, 'https://x.com/...') +
      fieldHtml('social_youtube', 'YouTube URL', 'text', settings.social_youtube, true, 'https://youtube.com/@...') +
      '<div class="modal-actions"><button type="submit" class="btn btn-gold">Save Social Links</button></div>' +
      '</form></div>';
    document.getElementById('socialForm').onsubmit = saveSettingsForm(views.social);
  };

  // SITE CONTENT
  views.content = async function () {
    viewTitle.textContent = 'Site Content';
    const { settings } = await api('/settings');
    content.innerHTML = '<div class="panel"><div class="panel-head"><div><h3>Homepage Hero</h3><p>The main headline and subtext on the home page</p></div></div>' +
      '<form id="heroForm">' +
      '<div class="lang-tabs"><div class="lang-tab active" data-lang="en">English</div><div class="lang-tab" data-lang="te">తెలుగు</div><div class="lang-tab" data-lang="hi">हिन्दी</div></div>' +
      ['en', 'te', 'hi'].map(function (l, i) {
        return '<div class="lang-pane' + (i === 0 ? ' active' : '') + '" data-lang="' + l + '">' +
          fieldHtml('hero_headline_' + l, 'Hero Headline', 'text', settings['hero_headline_' + l]) +
          fieldHtml('hero_subtext_' + l, 'Hero Subtext', 'textarea', settings['hero_subtext_' + l]) + '</div>';
      }).join('') +
      '<div class="modal-actions"><button type="submit" class="btn btn-gold">Save Hero</button></div></form></div>' +

      '<div class="panel"><div class="panel-head"><div><h3>About Content</h3><p>About page body, mission and vision</p></div></div>' +
      '<form id="aboutForm">' +
      '<div class="lang-tabs"><div class="lang-tab active" data-lang="en">English</div><div class="lang-tab" data-lang="te">తెలుగు</div><div class="lang-tab" data-lang="hi">हिन्दी</div></div>' +
      ['en', 'te', 'hi'].map(function (l, i) {
        return '<div class="lang-pane' + (i === 0 ? ' active' : '') + '" data-lang="' + l + '">' +
          fieldHtml('about_body_' + l, 'About Body', 'richtext', settings['about_body_' + l]) +
          fieldHtml('mission_' + l, 'Mission', 'textarea', settings['mission_' + l]) +
          fieldHtml('vision_' + l, 'Vision', 'textarea', settings['vision_' + l]) + '</div>';
      }).join('') +
      '<div class="modal-actions"><button type="submit" class="btn btn-gold">Save About</button></div></form></div>' +

      '<div class="panel"><div class="panel-head"><div><h3>SEO Defaults</h3><p>Default meta description & keywords for search engines</p></div></div>' +
      '<form id="seoForm">' +
      fieldHtml('meta_description_en', 'Meta Description (English)', 'textarea', settings.meta_description_en) +
      fieldHtml('meta_description_te', 'Meta Description (Telugu)', 'textarea', settings.meta_description_te, true) +
      fieldHtml('meta_description_hi', 'Meta Description (Hindi)', 'textarea', settings.meta_description_hi, true) +
      fieldHtml('meta_keywords', 'Keywords', 'textarea', settings.meta_keywords) +
      '<div class="modal-actions"><button type="submit" class="btn btn-gold">Save SEO</button></div></form></div>';
    bindLangTabs(content);
    document.getElementById('heroForm').onsubmit = saveSettingsForm(views.content);
    document.getElementById('aboutForm').onsubmit = saveSettingsForm(views.content);
    document.getElementById('seoForm').onsubmit = saveSettingsForm(views.content);
  };

  function saveSettingsForm(reload) {
    return async function (e) {
      e.preventDefault();
      const d = formData(e.target);
      try { await api('/settings', { method: 'POST', body: JSON.stringify(d) }); toast('Saved successfully'); }
      catch (err) { toast(err.message, true); }
    };
  }

  // ---------- shared bindings ----------
  function bindEditDel(items, formFn, path, reload) {
    content.querySelectorAll('[data-edit]').forEach(function (b) {
      b.onclick = function () { const item = items.find(function (x) { return String(x.id) === String(b.getAttribute('data-edit')); }); formFn(item); };
    });
    content.querySelectorAll('[data-del]').forEach(function (b) {
      b.onclick = function () { confirmDelete('Delete this item? This cannot be undone.', async function () { try { await api(path + '/' + b.getAttribute('data-del'), { method: 'DELETE' }); toast('Deleted'); reload(); } catch (err) { toast(err.message, true); } }); };
    });
  }
  function emptyState(icon, msg) { return '<div class="empty"><i class="fa-solid ' + icon + '"></i>' + msg + '</div>'; }

  async function refreshBadge() { try { const s = await api('/stats'); updateUnreadBadge(s.unread); } catch (e) {} }
  function updateUnreadBadge(n) { const b = document.getElementById('unreadBadge'); if (b) b.textContent = n > 0 ? n : ''; }

  // ---------- routing ----------
  function go(view) {
    document.querySelectorAll('.sidebar-nav a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-view') === view); });
    content.innerHTML = '<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</div>';
    (views[view] || views.dashboard)().catch(function (e) { if (e.message !== 'unauth') { content.innerHTML = '<div class="empty"><i class="fa-solid fa-triangle-exclamation"></i>' + esc(e.message) + '</div>'; } });
    document.getElementById('sidebar').classList.remove('open');
    location.hash = view;
  }
  document.getElementById('sidebarNav').addEventListener('click', function (e) {
    const a = e.target.closest('a[data-view]'); if (a) { e.preventDefault(); go(a.getAttribute('data-view')); }
  });
  content.addEventListener('click', function (e) {
    const q = e.target.closest('[data-goto]'); if (q) go(q.getAttribute('data-goto'));
  });
  document.getElementById('menuToggle').onclick = function () { document.getElementById('sidebar').classList.toggle('open'); };
  document.getElementById('logoutBtn').onclick = async function () { await fetch(API + '/logout', { method: 'POST' }); window.location.href = '/studio'; };

  // init
  const initial = (location.hash || '#dashboard').slice(1);
  go(views[initial] ? initial : 'dashboard');
  refreshBadge();
})();
