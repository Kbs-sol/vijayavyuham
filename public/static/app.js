// ============================================================
// Vijayavyuham — Frontend interactions
// ============================================================
(function () {
  'use strict';

  // ---------- Language ----------
  function getLangCookie() {
    const m = document.cookie.match(/(?:^|; )vv_lang=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setLang(lang) {
    document.cookie = 'vv_lang=' + lang + '; path=/; max-age=' + (60 * 60 * 24 * 365);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
  }

  // Always-visible segmented language toggle (header)
  document.querySelectorAll('.lang-seg[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var code = b.getAttribute('data-lang');
      if (code !== (window.VV && window.VV.lang)) setLang(code);
    });
  });

  // Non-intrusive first-visit language toast (does NOT block the page)
  var toast = document.getElementById('langToast');
  if (toast) {
    if (!getLangCookie()) {
      setTimeout(function () { toast.classList.add('show'); }, 700);
    }
    function dismissToast() {
      toast.classList.remove('show');
      // remember dismissal even if they didn't pick (default English stays)
      if (!getLangCookie()) document.cookie = 'vv_lang=en; path=/; max-age=' + (60 * 60 * 24 * 365);
    }
    var closeBtn = document.getElementById('langToastClose');
    if (closeBtn) closeBtn.addEventListener('click', dismissToast);
    toast.querySelectorAll('.lang-toast-choice[data-lang]').forEach(function (el) {
      el.addEventListener('click', function () { setLang(el.getAttribute('data-lang')); });
    });
  }

  // ---------- Header scroll ----------
  const header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // ---------- Mobile menu (drawer + backdrop + scroll lock) ----------
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const backdrop = document.getElementById('navBackdrop');
  // CRITICAL: the drawer lives inside the fixed <header>, which gets
  // `backdrop-filter` when scrolled — that creates a new stacking/containing
  // context and makes the fixed drawer render transparent & un-clickable.
  // Move the drawer + backdrop to be direct children of <body> so they
  // escape the header context entirely.
  if (navLinks && navLinks.parentElement !== document.body) {
    document.body.appendChild(navLinks);
  }
  if (backdrop && backdrop.parentElement !== document.body) {
    document.body.appendChild(backdrop);
  }
  function setMenu(open) {
    if (!navLinks) return;
    navLinks.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (toggle) {
      const icon = toggle.querySelector('i');
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  }
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      setMenu(!navLinks.classList.contains('open'));
    });
    // Close when a nav link is tapped
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    // Close on backdrop tap
    if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false);
    });
    // Reset if resized back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && navLinks.classList.contains('open')) setMenu(false);
    });
  }

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- Enquiry modal ----------
  window.openEnquiry = function () {
    const m = document.getElementById('enquiryModal');
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  window.closeEnquiry = function () {
    const m = document.getElementById('enquiryModal');
    if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
  };
  const overlay = document.getElementById('enquiryModal');
  if (overlay) {
    overlay.addEventListener('click', function (e) { if (e.target === overlay) window.closeEnquiry(); });
  }

  // ---------- Form submission ----------
  window.submitEnquiry = function (e, mode) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    data.source_page = window.location.pathname;
    const msgEl = mode === 'modal' ? document.getElementById('mFormMsg') : document.getElementById('cFormMsg');
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; }

    fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (msgEl) {
          msgEl.className = 'form-msg ' + (res.ok ? 'success' : 'error');
          msgEl.textContent = res.ok ? window.VV.msgSuccess : (res.j.error || window.VV.msgError);
        }
        if (res.ok) {
          form.reset();
          if (mode === 'modal') { setTimeout(function () { window.closeEnquiry(); if (msgEl) msgEl.className = 'form-msg'; }, 2600); }
        }
      }).catch(function () {
        if (msgEl) { msgEl.className = 'form-msg error'; msgEl.textContent = window.VV.msgError; }
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
      });
    return false;
  };
})();
