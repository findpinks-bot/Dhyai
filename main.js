(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.getAttribute('data-open') === 'true';
      navLinks.setAttribute('data-open', open ? 'false' : 'true');
      navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  // Mark current page in nav
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  // Fade-in sections (opacity only)
  const sections = document.querySelectorAll('.fade-section');
  if ('IntersectionObserver' in window && sections.length) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    sections.forEach(s => obs.observe(s));
  } else {
    sections.forEach(s => s.classList.add('is-visible'));
  }
})();