// Welcome screen -> start the page
var started = false;
document.getElementById('enter').addEventListener('click', function () {
  document.getElementById('splash').classList.add('hide');
  document.body.classList.remove('locked');
  if (!started) { started = true; start(); }
});

function start() {
  // Pop-up on scroll (removing .in when off screen makes it replay each visit)
  var targets = document.querySelectorAll(
    '.hero-content > *, .hero-photo, .section-title, .about-content, .education, .stat, .project-card, .skill-card, .contact-form'
  );
  targets.forEach(function (el) {
    el.classList.add('reveal');
    var i = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.setProperty('--d', (i % 6) * 0.12 + 's');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.target.classList.toggle('in', e.isIntersecting);
      if (e.isIntersecting && e.target.classList.contains('stat')) count(e.target.querySelector('b'));
    });
  }, { threshold: 0.15 });
  targets.forEach(function (el) { io.observe(el); });

  // Highlight the current section in the navbar
  var links = document.querySelectorAll('.nav-links a:not(.btn-primary)');
  var so = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section').forEach(function (s) { so.observe(s); });

  typeRoles();
}

// Number count-up
function count(el) {
  var n = +el.dataset.count, i = 0, step = Math.max(1, Math.ceil(n / 20));
  clearInterval(el._t);
  el.textContent = 0;
  el._t = setInterval(function () { i = Math.min(n, i + step); el.textContent = i; if (i >= n) clearInterval(el._t); }, 60);
}

// Typing roles (edit this list)
function typeRoles() {
  var roles = ['BSIT Student.', 'Aspiring Network Administrator.', 'Aspiring Database Administrator.', 'I create simple programs.'], r = 0, c = 0, del = false, el = document.getElementById('typed');
  (function tick() {
    var w = roles[r];
    el.textContent = w.slice(0, c);
    if (!del && c < w.length) { c++; setTimeout(tick, 90); }
    else if (!del) { del = true; setTimeout(tick, 1400); }
    else if (c > 0) { c--; setTimeout(tick, 45); }
    else { del = false; r = (r + 1) % roles.length; setTimeout(tick, 300); }
  })();
}

// Project details pop-up: fills the pop-up from the hidden .details block in each card
var modal = document.getElementById('modal'), modalBody = document.getElementById('modalBody'), lastBtn;
document.querySelectorAll('.details-btn').forEach(function (b) {
  b.addEventListener('click', function () {
    var card = b.closest('.project-card');
    var gh = card.querySelector('.project-links a');
    modalBody.innerHTML =
      '<div class="m-img">' + card.querySelector('.project-img').innerHTML + '</div>' +
      '<h3>' + card.querySelector('h3').textContent + '</h3>' +
      '<div class="tech-tags">' + card.querySelector('.tech-tags').innerHTML + '</div>' +
      card.querySelector('.details').innerHTML +
      (gh ? '<div class="m-links">' + gh.outerHTML + '</div>' : '');
    lastBtn = b;
    modal.classList.add('open');
    document.body.classList.add('locked');
    modal.querySelector('.m-close').focus();
  });
});
function closeModal() {
  modal.classList.remove('open');
  document.body.classList.remove('locked');
  if (lastBtn) lastBtn.focus();
}
modal.querySelector('.m-close').addEventListener('click', closeModal);
modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

// Skill cards: "View more" opens the full list inside the card
document.querySelectorAll('.more-btn').forEach(function (b) {
  b.addEventListener('click', function () {
    var c = b.closest('.skill-card');
    var open = c.classList.toggle('open');
    b.setAttribute('aria-expanded', open);
    b.firstChild.textContent = open ? 'View less ' : 'View more ';
  });
});