/* SiteForge – Navigation, aktiver Menüpunkt, Scroll-Reveal, E-Mail kopieren */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile Navigation ---------- */
  var burger = document.getElementById('burgerBtn');
  var menu = document.getElementById('navLinks');
  var mobile = window.matchMedia('(max-width: 980px)');

  if (burger && menu) {
    var isOpen = function () { return menu.classList.contains('open'); };

    var setMenu = function (open, returnFocus) {
      var show = open && mobile.matches;
      menu.classList.toggle('open', show);
      burger.setAttribute('aria-expanded', String(show));
      burger.setAttribute('aria-label', show ? 'Menü schließen' : 'Menü öffnen');
      // Geschlossenes Mobil-Menü aus Tab-Reihenfolge und Screenreader nehmen
      if (mobile.matches && !show) menu.setAttribute('inert', '');
      else menu.removeAttribute('inert');
      if (returnFocus) burger.focus();
    };

    setMenu(false);

    burger.addEventListener('click', function () {
      var open = !isOpen();
      setMenu(open, !open);
      if (open) {
        // Einen Frame warten, bis das Menü sichtbar und fokussierbar ist
        requestAnimationFrame(function () {
          var first = menu.querySelector('a');
          if (first) first.focus();
        });
      }
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('click', function (e) {
      if (isOpen() && !menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') {
        setMenu(false, true);
        return;
      }
      // Fokus im geöffneten Menü halten
      if (e.key === 'Tab') {
        var items = [burger].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    var onBreakpoint = function () { setMenu(false); };
    if (mobile.addEventListener) mobile.addEventListener('change', onBreakpoint);
    else mobile.addListener(onBreakpoint);
  }

  /* ---------- Aktiven Menüpunkt beim Scrollen markieren ---------- */
  if (menu && 'IntersectionObserver' in window) {
    var navLinks = {};
    menu.querySelectorAll('a[href^="#"]:not(.btn)').forEach(function (a) {
      navLinks[a.getAttribute('href').slice(1)] = a;
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(navLinks).forEach(function (id) { navLinks[id].removeAttribute('aria-current'); });
        var link = navLinks[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll-Reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !reduceMotion) {
    var viewport = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    });

    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < viewport) el.classList.add('in');
      else io.observe(el);
      // Per Tastatur angesteuerte Inhalte sofort sichtbar machen
      el.addEventListener('focusin', function () { el.classList.add('in'); });
    });

    root.classList.add('reveal-ready');
  }

  /* ---------- E-Mail-Adresse kopieren ---------- */
  var copyBtn = document.getElementById('copyEmailBtn');
  var status = document.getElementById('copyStatus');

  if (copyBtn && status && navigator.clipboard && navigator.clipboard.writeText) {
    var mail = copyBtn.getAttribute('data-email');
    copyBtn.hidden = false;
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(mail).then(
        function () { status.textContent = 'E-Mail-Adresse kopiert.'; },
        function () { status.textContent = 'Kopieren nicht möglich – bitte die Adresse markieren: ' + mail; }
      );
    });
  }
})();
