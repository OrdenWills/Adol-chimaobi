(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  (function initTheme() {
    if (localStorage.getItem('selected-theme')) return;
    document.body.classList.add('dark-theme');
    var btn = document.getElementById('theme-button');
    if (btn && btn.classList.contains('uil-moon')) btn.classList.remove('uil-moon');
    if (btn && !btn.classList.contains('uil-sun')) btn.classList.add('uil-sun');
  })();

  var revealTargets =
    '.home__content, .section__title, .section__subtitle, .services__content, .skills__content, .blog__card, .qualification__content, .about__info > div, .contact__information';

  function initReveal() {
    var els = document.querySelectorAll(revealTargets);
    if (!els.length) return;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    els.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  }

  var TILT_SELECTOR = '.blog__card, .portfolio__content, .skills__content';

  function initTilt() {
    if (prefersReduced || !canHover) return;
    document.addEventListener('mousemove', function (e) {
      var card = e.target.closest(TILT_SELECTOR);
      if (!card) return;
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transition = 'transform 0.05s linear';
      card.style.transform =
        'perspective(1000px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 7).toFixed(2) + 'deg) translateY(-4px)';
      clearTimeout(card._tiltTimer);
      card._tiltTimer = setTimeout(function () {
        card.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      }, 120);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initTilt();
  });
})();