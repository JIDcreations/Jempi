/* ==========================================================================
   Jempi Travel — shared behaviour
   - Injects the shared header (nav) and footer into every page
   - Sticky-nav colour state on scroll
   - Mobile menu + promo bar
   - Reveal-on-scroll (IntersectionObserver)
   - Destination filter (bestemmingen)
   - Newsletter form (demo)

   NOTE FOR WORDPRESS: the HEADER_HTML / FOOTER_HTML strings below map 1:1 to
   header.php / footer.php. The active menu item is taken from
   <body data-page="..."> — in WP this becomes a body_class() / menu check.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- shared markup ---------------------------------------------------- */
  var NAV_ITEMS = [
    { key: 'bestemmingen', label: 'Bestemmingen', href: 'bestemmingen.html' },
    { key: 'themas',       label: "Thema's",      href: 'themas.html' },
    { key: 'blog',         label: 'Blog',         href: 'blog.html' },
    { key: 'over-ons',     label: 'Over ons',     href: 'over-ons.html' }
  ];

  /* Thema's submenu — mirrors the sections on themas.html.
     Boutique Cruises has its own detail page; the rest deep-link to a
     section anchor on themas.html (ids added in that file). */
  var THEME_ITEMS = [
    { label: 'Boutique Cruises',  desc: 'Varen in kleine kring',         href: 'thema-boutique-cruises.html', img: 'assets/foto%20jempi/cruise-lake.jpg' },
    { label: 'Safari & Wildlife', desc: 'Oog in oog met de wildernis',   href: 'thema-safari-wildlife.html',  img: 'assets/foto%20jempi/summit.jpg' },
    { label: 'Groepsreizen',      desc: 'Samen op pad, vlot begeleid',   href: 'thema-groepsreizen.html',     img: 'assets/foto%20jempi/chairs-pool.jpeg' },
    { label: 'Huwelijksreizen',   desc: 'Romantiek op een droomplek',    href: 'thema-huwelijksreizen.html',  img: 'assets/foto%20jempi/hammock.jpg' },
    { label: 'Avontuur & Natuur', desc: 'Reizen die je buiten beleeft',  href: 'thema-avontuur-natuur.html',  img: 'assets/foto%20jempi/hiking-coast.jpg' },
    { label: 'Strand & Eilanden', desc: 'Palmen, poederzand, eilandritme', href: 'thema-strand-eilanden.html', img: 'assets/foto%20jempi/beach-palm.jpg' }
  ];

  function megaHTML() {
    var items = THEME_ITEMS.map(function (t) {
      return '' +
      '<a class="mega__item" href="' + t.href + '">' +
        '<span class="mega__thumb"><img src="' + t.img + '" alt="" loading="lazy"></span>' +
        '<span class="mega__text">' +
          '<span class="mega__name">' + t.label + '</span>' +
          '<span class="mega__desc">' + t.desc + '</span>' +
        '</span>' +
        '<span class="mega__arrow">→</span>' +
      '</a>';
    }).join('');
    return '' +
    '<div class="mega">' +
      '<div class="mega__inner">' +
        '<div class="mega__head">' +
          '<span class="eyebrow">Reizen per thema</span>' +
          '<a class="link-underline mega__all" href="themas.html">Alle thema’s <span class="arrow">→</span></a>' +
        '</div>' +
        '<div class="mega__grid">' + items + '</div>' +
      '</div>' +
    '</div>';
  }

  function navLinks(active, mobile) {
    if (mobile) {
      return NAV_ITEMS.map(function (it) {
        if (it.key === 'themas') {
          var sub = '<a href="themas.html">Alle thema’s</a>' +
            THEME_ITEMS.map(function (t) {
              return '<a href="' + t.href + '">' + t.label + '</a>';
            }).join('');
          return '<details class="nav__m-group"' + (it.key === active ? ' open' : '') + '>' +
            '<summary>' + it.label + '</summary>' +
            '<div class="nav__m-sub">' + sub + '</div>' +
          '</details>';
        }
        return '<a href="' + it.href + '">' + it.label + '</a>';
      }).join('');
    }
    return NAV_ITEMS.map(function (it) {
      var activeCls = it.key === active ? ' is-active' : '';
      if (it.key === 'themas') {
        return '<div class="nav__item has-mega">' +
          '<a class="nav__link' + activeCls + '" href="' + it.href + '">' + it.label + '<span class="nav__caret"></span></a>' +
          megaHTML() +
        '</div>';
      }
      return '<a class="nav__link' + activeCls + '" href="' + it.href + '">' + it.label + '</a>';
    }).join('');
  }

  var IG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none"/></svg>';
  var FB_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.35l.35-2.73h-2.7V9.53c0-.79.22-1.33 1.35-1.33h1.44V5.76c-.25-.03-1.1-.1-2.1-.1-2.08 0-3.5 1.27-3.5 3.6v2.01H8.3V14h2.35v7h2.85z"/></svg>';
  function socialIcons() {
    return '<a href="https://www.instagram.com/jempi.travel/" target="_blank" rel="noopener" aria-label="Instagram">' + IG_ICON + '</a>' +
           '<a href="https://www.facebook.com/jempi.reizen/" target="_blank" rel="noopener" aria-label="Facebook">' + FB_ICON + '</a>';
  }

  function headerHTML(active) {
    return '' +
    '<div class="nav-wrap">' +
      '<div class="promo" data-promo>' +
        '<span>\u2736&nbsp;&nbsp;Infoavond \u2018Verre Reizen 2026\u2019 — donderdag 26 juni, 19u in ons kantoor.&nbsp;&nbsp;' +
        '<a href="index.html#agenda">Schrijf je in</a></span>' +
        '<button class="promo__close" data-promo-close aria-label="Sluiten">\u00d7</button>' +
      '</div>' +
      '<nav class="nav" data-nav>' +
        '<div class="nav__bar">' +
          '<a class="nav__logo" href="index.html">' +
            '<img class="logo-light" src="assets/logo/jempi/SVG/logo_licht.svg" alt="Jempi Travel" style="filter:brightness(0) invert(1);">' +
            '<img class="logo-dark" src="assets/logo/jempi/SVG/logo_donker.svg" alt="Jempi Travel">' +
          '</a>' +
          '<div class="nav__links">' + navLinks(active, false) +
            '<span class="nav__social">' + socialIcons() + '</span>' +
          '</div>' +
          '<button class="nav__burger" data-burger aria-label="Menu"><span></span></button>' +
        '</div>' +
        '<div class="nav__mobile" data-mobile>' + navLinks(active, true) +
          '<div class="nav__social nav__social--m">' + socialIcons() + '</div>' +
        '</div>' +
      '</nav>' +
    '</div>';
  }

  function footerHTML(active) {
    var year = new Date().getFullYear();
    return '' +
    '<footer class="footer" id="footer">' +
      '<div class="container">' +
        (active === 'nieuwsbrief' ? '' : '<div class="footer__top">' +
          '<div>' +
            '<h3>Blijf dromen, <em>ook thuis</em></h3>' +
            '<p>Reisinspiratie, exclusieve aanbiedingen en uitnodigingen — recht in je inbox. Kies wat je wil ontvangen.</p>' +
          '</div>' +
          '<div>' +
            '<a class="btn btn--light" href="nieuwsbrief.html">Schrijf je in <span class="arrow">→</span></a>' +
            '<p class="nl-fine" style="margin-top:16px;">Inschrijven op onze nieuwsbriefpagina — dubbele opt-in, uitschrijven kan altijd.</p>' +
          '</div>' +
        '</div>') +
        '<div class="footer__cols">' +
          '<div class="footer__brand">' +
            '<img src="assets/logo/jempi/SVG/logo_licht.svg" alt="Jempi Travel" style="filter:brightness(0) invert(1);">' +
            '<p>Reisbureau met ziel sinds 1976. Gelukkige klanten wiens reisdromen werkelijkheid worden — in alle veiligheid en vertrouwen.</p>' +
            '<div class="social">' +
              '<a href="https://www.instagram.com/jempi.travel/" target="_blank" rel="noopener" aria-label="Volg Jempi Travel op Instagram">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none"/></svg>' +
              '</a>' +
              '<a href="https://www.facebook.com/jempi.reizen/" target="_blank" rel="noopener" aria-label="Volg Jempi Travel op Facebook">' +
                '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.35l.35-2.73h-2.7V9.53c0-.79.22-1.33 1.35-1.33h1.44V5.76c-.25-.03-1.1-.1-2.1-.1-2.08 0-3.5 1.27-3.5 3.6v2.01H8.3V14h2.35v7h2.85z"/></svg>' +
              '</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer__col">' +
            '<p class="head">Ontdek</p>' +
            '<div class="links">' +
              '<a href="bestemmingen.html">Bestemmingen</a>' +
              '<a href="themas.html">Thema\u2019s</a>' +
              '<a href="blog.html">Blog</a>' +
              '<a href="index.html#agenda">Agenda</a>' +
              '<a href="nieuwsbrief.html">Nieuwsbrief</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer__col">' +
            '<p class="head">Jempi Travel</p>' +
            '<div class="links">' +
              '<a href="over-ons.html">Over ons</a>' +
              '<a href="index.html">Cadeaubonnen</a>' +
              '<a href="themas.html">Incentives</a>' +
              '<a href="over-ons.html#duurzaamheid">Duurzaamheid</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer__col">' +
            '<p class="head">Contact</p>' +
            '<div class="links">' +
              '<a href="tel:+3200000000">+32 (0)00 00 00 00</a>' +
              '<a href="mailto:hallo@jempireizen.be">hallo@jempireizen.be</a>' +
              '<span>Ma\u2013Vr \u00b7 9u\u201318u</span>' +
              '<span>Za \u00b7 op afspraak</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<span>\u00a9 ' + year + ' Jempi Travel — alle rechten voorbehouden</span>' +
          '<div class="legal"><a href="#">Privacy</a><a href="#">Algemene voorwaarden</a><a href="https://www.instagram.com/jempi.travel/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/jempi.reizen/" target="_blank" rel="noopener">Facebook</a></div>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  /* ---- behaviours ------------------------------------------------------- */
  function setNavHeight() {
    var wrap = document.querySelector('.nav-wrap');
    if (!wrap) return;
    document.documentElement.style.setProperty('--navh', wrap.offsetHeight + 'px');
  }

  function initNav() {
    var nav = document.querySelector('[data-nav]');
    if (!nav) return;
    var onScroll = function () {
      var solid = (window.scrollY || window.pageYOffset || 0) > 60;
      nav.classList.toggle('nav--solid', solid);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    setNavHeight();
    window.addEventListener('resize', setNavHeight, { passive: true });

    var burger = document.querySelector('[data-burger]');
    var mobile = document.querySelector('[data-mobile]');
    if (burger && mobile) {
      burger.addEventListener('click', function () {
        mobile.classList.toggle('is-open');
        setNavHeight();
      });
    }
    var promoClose = document.querySelector('[data-promo-close]');
    var promo = document.querySelector('[data-promo]');
    if (promoClose && promo) {
      promoClose.addEventListener('click', function () { promo.style.display = 'none'; setNavHeight(); });
    }
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function initFilter() {
    var root = document.querySelector('[data-filter-root]');
    if (!root) return;
    var chips = root.querySelectorAll('[data-filter]');
    var cards = root.querySelectorAll('[data-cats]');
    var countEl = root.querySelector('[data-count]');
    function apply(key) {
      var n = 0;
      cards.forEach(function (c) {
        var show = key === 'alle' || c.getAttribute('data-cats').split(' ').indexOf(key) >= 0;
        c.style.display = show ? '' : 'none';
        if (show) n++;
      });
      if (countEl) countEl.textContent = n + ' bestemmingen';
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        apply(chip.getAttribute('data-filter'));
      });
    });
  }

  /* Modern multi-facet filter with custom dropdowns (bestemmingen).
     - one open panel at a time, closes on outside-click / Esc
     - multi-select within a facet (OR), combined across facets (AND)
     - live result count, per-facet count badge, reset */
  function initFacetFilter() {
    var root = document.querySelector('[data-facet-root]');
    if (!root) return;

    var facets   = [].slice.call(root.querySelectorAll('.facet'));
    var cards    = [].slice.call(root.querySelectorAll('[data-cats]'));
    var countEl  = root.querySelector('[data-count]');
    var resetEl  = root.querySelector('[data-reset]');
    var emptyEl  = root.querySelector('[data-empty]');

    function closeAll(except) {
      facets.forEach(function (f) { if (f !== except) f.classList.remove('is-open'); });
    }

    function recompute() {
      // collect selected values per facet
      var active = facets.map(function (f) {
        var sel = [].slice.call(f.querySelectorAll('.opt.is-active'))
          .map(function (o) { return o.getAttribute('data-value'); });
        var badge = f.querySelector('.count');
        f.classList.toggle('has-sel', sel.length > 0);
        if (badge) badge.textContent = sel.length;
        return sel;
      });
      var anySel = active.some(function (s) { return s.length > 0; });

      var shown = 0;
      cards.forEach(function (c) {
        var cats = c.getAttribute('data-cats').split(' ');
        var match = active.every(function (sel) {
          if (!sel.length) return true;
          return sel.some(function (v) { return cats.indexOf(v) >= 0; });
        });
        c.style.display = match ? '' : 'none';
        if (match) shown++;
      });

      if (countEl) countEl.textContent = shown + (shown === 1 ? ' bestemming' : ' bestemmingen');
      if (emptyEl) emptyEl.classList.toggle('is-shown', shown === 0);
      if (resetEl) resetEl.classList.toggle('is-shown', anySel);
    }

    facets.forEach(function (f) {
      var btn = f.querySelector('.facet__btn');
      if (btn) btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = f.classList.contains('is-open');
        closeAll(f);
        f.classList.toggle('is-open', !open);
      });
      f.querySelectorAll('.opt').forEach(function (opt) {
        opt.addEventListener('click', function () {
          opt.classList.toggle('is-active');
          recompute();
        });
      });
    });

    if (resetEl) resetEl.addEventListener('click', function () {
      root.querySelectorAll('.opt.is-active').forEach(function (o) { o.classList.remove('is-active'); });
      closeAll(null);
      recompute();
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.facet')) closeAll(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });

    recompute();
  }

  function initNewsletter() {
    var forms = document.querySelectorAll('[data-nl]');
    forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.outerHTML =
        '<div class="nl-thanks"><p>Bedankt! \u2736</p>' +
        '<p>Check je inbox om je inschrijving te bevestigen — zo weten we zeker dat jij het bent.</p></div>';
    });
    });
  }

  function initSearch() {
    var form = document.querySelector('[data-search-form]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'bestemmingen.html';
    });
  }

  /* ---- boot ------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var active = document.body.getAttribute('data-page') || '';
    var head = document.getElementById('site-header');
    var foot = document.getElementById('site-footer');
    if (head) head.innerHTML = headerHTML(active);
    if (foot) foot.innerHTML = footerHTML(active);
    initNav();
    initReveal();
    initFilter();
    initFacetFilter();
    initNewsletter();
    initSearch();
  });
})();
