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

  // Language intro overlay — show only once (first visit)
  const intro = document.getElementById('langIntro');
  if (intro) {
    if (getLangCookie()) {
      intro.classList.add('hidden');
    } else {
      document.body.style.overflow = 'hidden';
    }
    intro.querySelectorAll('.lang-choice').forEach(function (el) {
      el.addEventListener('click', function () {
        document.body.style.overflow = '';
        setLang(el.getAttribute('data-lang'));
      });
    });
  }

  // Language dropdown
  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      langMenu.classList.toggle('open');
    });
    document.addEventListener('click', function () { langMenu.classList.remove('open'); });
    langMenu.querySelectorAll('a[data-lang]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        setLang(a.getAttribute('data-lang'));
      });
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

  // ---------- Mobile menu ----------
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const icon = toggle.querySelector('i');
      if (navLinks.classList.contains('open')) { icon.className = 'fa-solid fa-xmark'; }
      else { icon.className = 'fa-solid fa-bars'; }
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
