/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'cartoleria-correnti',
    /* nessun WhatsApp: il fisso della scheda Google */
    whatsapp: { number: '', message: '', ids: [] },
    /* il cartello «ORARIO NEGOZIO» sulla loro vetrina (foto di un cliente, inizio 2026; la scheda Google ha gli orari vecchi):
       lunedì 11–14 e 15:30–19:30, martedì–venerdì 10–14 e 15:30–19:30, sabato 10:30–13:30 e 15:30–19:30, domenica chiuso */
    hours: {
      0: [], 1: [['11:00', '14:00'], ['15:30', '19:30']], 2: [['10:00', '14:00'], ['15:30', '19:30']], 3: [['10:00', '14:00'], ['15:30', '19:30']],
      4: [['10:00', '14:00'], ['15:30', '19:30']], 5: [['10:00', '14:00'], ['15:30', '19:30']], 6: [['10:30', '13:30'], ['15:30', '19:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Cartoleria Correnti: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.scaffali": "On the shelves",
      "n.negozio": "In the shop",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Stationery shop · Via Cesare Correnti 20, between the Carrobbio and De Amicis",
      "h.titolo": "Your trusted stationer.",
      "h.bandiera": "Everything for the office and for school.",
      "h.testo": "Notebooks and stationery, office supplies, tax forms and stamps; and at the counter photocopies, fax, laminating and binding.",
      "h.google": "on Google, 38 reviews",
      "h.chi": "Vincenzo, in a review on Google (in English: «They always have a solution for every kind of need.»)",
      "p.titolo": "The stack of notebooks",
      "p.desc": "As on our shelves: the page is ruled line by line; the notebooks fall one on top of the other onto the green shelf with white stripes; the blue pen writes the label on the stack and ticks it. Three labels: QUAD A for squared paper, RIG C for lined paper with the red margin, Q for large squares.",
      "p.d0": "QUAD A: squared paper, the stack, the label written in pen just like on our shelves.",
      "p.d1": "RIG C: lined paper, with the red margin.",
      "p.d2": "Q: the large squares.",
      "p.modi": "Which stack",
      "p.nota": "The stacks of notebooks as on our green shelves, with the label written in pen.",
      "s.etichetta": "On the shelves",
      "s.titolo": "For school, for the office, and at the counter",
      "s.r1": "School",
      "s.r1a": "Lined and squared notebooks",
      "s.r1b": "Pens, pencils, felt-tip pens",
      "s.r1c": "Drawing pads and albums",
      "s.r1d": "Backpacks and pencil cases",
      "s.r1e": "Made-to-measure covers for books of every kind and size",
      "s.r1f": "And even a few games",
      "s.r2": "Office",
      "s.r2a": "Reams of paper and ring binders",
      "s.r2b": "Folders and display books",
      "s.r2c": "Tax forms and register stamping",
      "s.r2d": "Stamps",
      "s.r2e": "Calculators and scissors",
      "s.r3": "At the counter",
      "s.r3a": "Photocopies",
      "s.r3b": "Fax",
      "s.r3c": "Laminating",
      "s.r3d": "Binding",
      "s.nota": "No prices here: to find out whether we have something, call or drop by.",
      "g.etichetta": "In the shop",
      "g.titolo": "The green shelves, the blue counter",
      "g.sotto": "From our photos of a few years ago.",
      "a.interno": "The inside: the green shelves with the folders, the blue counter at the back, the reams of paper.",
      "k.interno": "The blue counter and the green shelves",
      "a.scaffali": "The shelves with the notebooks in stacks and the ring binders at the top.",
      "k.scaffali": "The notebooks in stacks",
      "a.vetrina": "The inside towards the window, with our name written on the glass, the gift bags and the globe.",
      "k.vetrina": "Towards the window, with our name on the glass",
      "a.quaderni": "Coloured folders, decorated ring binders, wrapping paper by the window.",
      "k.quaderni": "Folders, ring binders, wrapping paper",
      "a.raccoglitori": "Ring binders in a row: light blue, green, blue, yellow, red.",
      "k.raccoglitori": "Ring binders in every colour",
      "a.pennarelli": "Coloured felt-tip pens, their caps in rows.",
      "k.pennarelli": "The felt-tip pens",
      "b.etichetta": "At the counter",
      "b.titolo": "Max and Mara",
      "b.testo": "On Via Correnti they are the ones at the counter: for school, for the office, for a gift idea. Just ask.",
      "d.etichetta": "Reviews",
      "d.titolo": "Who drops by",
      "d.google": "on Google, 38 reviews",
      "d.g11m": "Google, 11 months ago",
      "d.g2a": "Google, 2 years ago",
      "d.g3a": "Google, 3 years ago",
      "d.g4a": "Google, 4 years ago",
      "d.g5a": "Google, 5 years ago",
      "d.nota": "From the reviews on Google, in Italian, as they were written; […] where we cut. The line at the top comes from another client, also on Google.",
      "d.tutte": "All the reviews on Google",
      "r.etichetta": "Hours and where",
      "r.titolo": "Monday to Saturday, with a lunch break",
      "r.testa": "Shop hours",
      "r.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "r.chiuso": "closed",
      "r.nota": "Hours from the sign on our shop window (2026).",
      "w.mappa": "Map: Cartoleria Correnti, Via Cesare Correnti 20, Milan",
      "w.dove": "Where",
      "w.dovev": "Via Cesare Correnti 20, 20123 Milan, between the Carrobbio and De Amicis",
      "w.metro": "By metro",
      "w.metrov": "M4 De Amicis, about 150 metres away; M2 and M4 Sant’Ambrogio, about 500",
      "w.tram": "Tram and bus",
      "w.tramv": "tram 3 at the Carrobbio, about 150 metres away; buses 96 and 97 at De Amicis",
      "w.tel": "Phone",
      "w.mail": "Email",
      "f2.riga": "Everything for the office and for school",
      "f2.orario": "Monday to Saturday, with a lunch break · Sunday closed",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · rating and reviews from their Google listing (September 2026), the hours from the sign on their shop window; the photos of the shop from their Google listing. We drew the stack of notebooks ourselves.",
      "f2.su": "Back to the top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ CARTOLERIA CORRENTI — Via Cesare Correnti 20 ══════════
     la FIRMA — «la pila dei quaderni»: come sui loro scaffali verdi, la pagina si riga linea per linea; i quaderni cadono uno
     sull'altro; la penna blu scrive l'etichetta sulla pila (QUAD A, RIG C, Q) e la spunta. Lo stato è M (le tre etichette), T (0…1) e
     V (0 al suo posto; fino a 1 la pila esce a destra; da −1 a 0 entra da sinistra la prossima, vuota). Senza JS e alla fine: QUAD A,
     T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la pagina bianca sullo scaffale. Reduced-motion: tutto subito. rAF a tempo,
     guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,560],"via":560,"cala":380,"fasi":{"riga":{"t":0.02,"d":0.26},"pila":{"t":0.3,"d":0.34},"scrive":{"t":0.66,"d":0.22},"spunta":{"t":0.9,"d":0.1}},"durate":{"riga":0.06,"quaderno":0.07,"tratto":0.045},"quaderni":[1,1,1,1,1,1,1,1,1,1,1,1],"modi":[{"nome":"QUAD A","righe":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"tratti":[1,1,1,1,1,1,1,1,1,1]},{"nome":"RIG C","righe":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"tratti":[1,1,1,1,1]},{"nome":"Q","righe":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"tratti":[1,1,1]}],"tempi":{"inizio":300,"pila":7400,"servi":480,"arriva":520,"pilaV":6600}};
  /* la pila a (M, T, V) — una sola fonte: la usano _cco_firma.mjs (l'HTML allo stato finale), main.js (via cco_main.cjs) e la prova
     (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     Le loro pile di quaderni sugli scaffali verdi, con l'etichetta scritta a penna («QUAD A», «RIG C», «Q»): la pagina si riga linea
     per linea (la rigatura del modo); i quaderni cadono uno sull'altro sullo scaffale; la penna blu scrive l'etichetta sulla pila; la
     spunta. Col V la pila esce a destra; la prossima entra da sinistra vuota. */
  function creaPila(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var servito = svg.querySelector('.servito');
    var Q = D.quaderni.map(function (_, j) { return svg.querySelector('.quaderno[data-j="' + j + '"]'); });
    var P = D.modi.map(function (M, m) {
      var q = function (c, i) { return svg.querySelector('.' + c + '[data-m="' + m + '"][data-i="' + i + '"]'); };
      return {
        righe: M.righe.map(function (_, i) { return q('riga', i); }),
        tratti: M.tratti.map(function (_, i) { return q('tratto', i); }),
        spunta: svg.querySelector('.spunta[data-m="' + m + '"]'),
      };
    });
    /* un tratto disegnato da 0 a «quanto» (pathLength = 1) */
    var tratto = function (el, quanto) { el.setAttribute('stroke-dasharray', r3(quanto) + ' 2'); el.setAttribute('stroke-dashoffset', '0'); };
    /* la finestra dell'i-esimo di n elementi in fila dentro una fase, ognuno lungo d */
    var inFila = function (F, i, n, d) { return { t: F.t + (n > 1 ? i * (F.d - d) / (n - 1) : 0), d: d }; };
    function disegna(m, t, v) {
      var F = D.fasi, M = D.modi[m], q = P[m];
      /* la pagina si riga, una linea dopo l'altra */
      q.righe.forEach(function (el, i) { tratto(el, dolce(fase(t, inFila(F.riga, i, q.righe.length, D.durate.riga)))); });
      /* i quaderni cadono sulla pila, dal basso in alto */
      Q.forEach(function (el, j) {
        var u = fase(t, inFila(F.pila, j, Q.length, D.durate.quaderno));
        el.setAttribute('transform', 'translate(0 ' + r1(-D.cala * (1 - u * u)) + ')');
        el.setAttribute('opacity', String(r3(c01(u * 6))));
      });
      /* la penna scrive l'etichetta, tratto per tratto; poi la spunta */
      q.tratti.forEach(function (el, i) { tratto(el, dolce(fase(t, inFila(F.scrive, i, q.tratti.length, D.durate.tratto)))); });
      tratto(q.spunta, dolce(fase(t, F.spunta)));
      /* col V la pila esce a destra; la prossima entra da sinistra */
      servito.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!servito && Q.every(Boolean) && P.every(function (q) { return q.spunta && q.righe.every(Boolean) && q.tratti.every(Boolean); });
    return { disegna: disegna, pezzi: P, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('pila-firma'), svgF = prendi('pilaSvg'), leggiF = prendi('pilaLeggi');
  var PILA = svgF ? creaPila(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.pila__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.pila__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    PILA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) PILA.disegna(k, 1, 0); });
    PILA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la pagina bianca */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la pagina bianca */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.pila, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.pila });
  }
  /* il gesto: scegliere la pila. Se è quella che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la pila esce a destra, entra da sinistra la prossima vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.pilaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && PILA && PILA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaPila); } catch (e) {}
    window.__pila = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__pila.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la pagina bianca */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__pila.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
