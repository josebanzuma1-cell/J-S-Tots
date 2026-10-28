/* =========================================================================
   J & S Tots Pre-School — site behaviour
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------- mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.target.closest('.nav')) return;
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    });
  }

  /* ---------------------------------------------- sticky nav shadow */
  var navWrap = document.querySelector('.nav-wrap');
  if (navWrap) {
    var setStuck = function () {
      navWrap.classList.toggle('is-stuck', window.scrollY > 14);
    };
    setStuck();
    window.addEventListener('scroll', setStuck, { passive: true });
  }

  /* ---------------------------------------------- cut-out strokes
     The coloured stroke behind each photograph is a pseudo-element masked by
     that same photograph. Until the mask image has decoded there is nothing
     to cut the shape with, so it paints as a plain rectangle — which is what
     made the cut-outs look like they had failed. Reveal it only once the
     pictures are decoded; they are the same files, so the mask is in cache
     by then. The timeout is a backstop: a stroke that never appears is worse
     than one that appears unmasked for a moment. */
  document.querySelectorAll(".hero-cast, .cta").forEach(function (group) {
    var pics = group.querySelectorAll(".cast-slot img");
    if (!pics.length) return;
    var ready = function () { group.classList.add("is-ready"); };
    var jobs = Array.prototype.map.call(pics, function (img) {
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    });
    Promise.all(jobs).then(ready);
    setTimeout(ready, 3000);
  });

  /* ---------------------------------------------- scroll reveal */
  var revealables = document.querySelectorAll('.reveal');

  if (!revealables.length) {
    /* nothing to do */
  } else if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------- carousels */
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    if (!track) return;

    /* the arrow buttons may live outside the carousel, linked by data-for */
    var nav = carousel.id
      ? document.querySelector('.carousel-nav[data-for="' + carousel.id + '"]')
      : null;
    var scope = nav || carousel;
    var prev = scope.querySelector('[data-dir="prev"]');
    var next = scope.querySelector('[data-dir="next"]');

    /* Scroll to a real snap position rather than by a pixel amount — with
       scroll-snap: mandatory, an arbitrary offset gets snapped straight back. */
    var offsets = function () {
      var items = Array.prototype.slice.call(track.children);
      if (!items.length) return [0];
      var base = items[0].offsetLeft;
      var max = track.scrollWidth - track.clientWidth;
      return items.map(function (el) { return Math.min(el.offsetLeft - base, max); });
    };

    var go = function (dir) {
      var stops = offsets();
      var here = track.scrollLeft;
      var i = 0;
      for (var n = 0; n < stops.length; n++) {
        if (stops[n] <= here + 4) i = n;
      }
      var target = Math.min(Math.max(i + dir, 0), stops.length - 1);
      /* no explicit behavior: the track's scroll-behavior decides, so the
         reduced-motion rule turns the animation off for good */
      track.scrollTo({ left: stops[target] });
    };

    var sync = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    window.addEventListener('load', sync);

    /* the track's scrollWidth is not final until the card images have laid
       out, so re-check whenever its size settles */
    if ('ResizeObserver' in window) {
      new ResizeObserver(sync).observe(track);
    } else {
      setTimeout(sync, 400);
    }

    sync();
  });

  /* ---------------------------------------------- news ticker */
  var ticker = document.querySelector('.ticker-text');
  if (ticker && !reduceMotion) {
    var messages = [];
    try { messages = JSON.parse(ticker.getAttribute('data-messages') || '[]'); } catch (err) { messages = []; }

    if (messages.length > 1) {
      var i = 0;
      setInterval(function () {
        ticker.classList.add('is-out');
        setTimeout(function () {
          i = (i + 1) % messages.length;
          ticker.textContent = messages[i];
          ticker.classList.remove('is-out');
        }, 420);
      }, 5200);
    }
  }

  /* ---------------------------------------------- accordion */
  document.querySelectorAll('.acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc-item');
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (item) item.classList.toggle('is-open', !open);
    });
  });

  /* ---------------------------------------------- enquiry form
     There is no server behind this site, so the form hands the parent's
     message straight to the school's WhatsApp number. Nothing is sent
     anywhere until the parent confirms in WhatsApp itself.              */
  var form = document.getElementById('enquiry-form');
  if (form) {
    var status = document.getElementById('form-status');

    var show = function (text, isError) {
      if (!status) return;
      status.textContent = text;
      status.classList.add('is-shown');
      status.classList.toggle('is-error', !!isError);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();
      var child = (data.get('child') || '').toString().trim();
      var level = (data.get('level') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      if (!name || !phone) {
        show('Please fill in your name and phone number so we can reach you.', true);
        return;
      }

      var lines = [
        'Hello J&S Tots Pre-School, I would like to enquire about a place.',
        '',
        'Parent / guardian: ' + name,
        'Phone: ' + phone
      ];
      if (child) lines.push("Child's name / age: " + child);
      if (level) lines.push('Class of interest: ' + level);
      if (message) lines.push('', 'Message: ' + message);

      var url = 'https://wa.me/' + form.dataset.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');

      show('Thank you, ' + name.split(' ')[0] + '. Your message is ready in WhatsApp — press send there and we will reply shortly.');
      form.reset();
    });
  }

  /* ---------------------------------------------- footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
