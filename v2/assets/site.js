/* ===== Dental Arts Studio — motion condiviso (reveal robusto, no IntersectionObserver) ===== */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var animated = [].slice.call(document.querySelectorAll('[data-anim], .reveal'));

  if (reduce) {
    animated.forEach(function (e) { e.classList.add('in'); });
  } else {
    // Rivela gli elementi quando entrano nel viewport (calcolo diretto, affidabile ovunque)
    var reveal = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = animated.length - 1; i >= 0; i--) {
        var r = animated[i].getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) {
          animated[i].classList.add('in');
          animated.splice(i, 1);
        }
      }
    };
    reveal();
    window.addEventListener('scroll', reveal, { passive: true });
    window.addEventListener('resize', reveal, { passive: true });
    window.addEventListener('load', function () { reveal(); setTimeout(reveal, 200); });
    // Failsafe assoluto: dopo 4s mostra comunque tutto cio che resta (mai contenuti nascosti)
    setTimeout(function () { animated.slice().forEach(function (e) { e.classList.add('in'); }); }, 4000);
  }

  // Parallax leggero: elementi con [data-parallax="0.12"]
  var parE = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (!reduce && parE.length) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      parE.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var factor = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var center = r.top + r.height / 2 - vh / 2;
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
