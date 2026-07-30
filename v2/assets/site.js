/* ===== Dental Arts Studio — motion condiviso ===== */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var animated = [].slice.call(document.querySelectorAll('[data-anim], .reveal'));

  // Reveal on scroll (fade/zoom/slide/clip via data-anim in CSS)
  if (reduce || !('IntersectionObserver' in window)) {
    animated.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (x) {
        if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    animated.forEach(function (e) { io.observe(e); });
  }

  // Parallax leggero: elementi con [data-parallax="0.12"] (fattore)
  var parE = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (!reduce && parE.length) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      parE.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var factor = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var center = r.top + r.height / 2 - vh / 2;   // distanza dal centro viewport
        el.style.transform = 'translate3d(0,' + (-center * factor) + 'px,0)';
      });
      ticking = false;
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  // Nav: ombra all'inizio dello scroll
  var nav = document.querySelector('nav');
  if (nav) {
    var onNav = function () {
      nav.style.boxShadow = window.scrollY > 16 ? '0 6px 24px rgba(10,15,30,.09)' : 'none';
    };
    window.addEventListener('scroll', onNav, { passive: true });
    onNav();
  }
})();
