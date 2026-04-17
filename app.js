const revealElements = document.querySelectorAll('.reveal');
const progressBars = document.querySelectorAll('.progress-bar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealElements.forEach(el => revealObserver.observe(el));

  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.getAttribute('data-progress') || 0;
        requestAnimationFrame(() => {
          bar.style.width = value + '%';
        });
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  progressBars.forEach(bar => progressObserver.observe(bar));
} else {
  revealElements.forEach(el => el.classList.add('is-visible'));
  progressBars.forEach(bar => {
    const value = bar.getAttribute('data-progress') || 0;
    bar.style.width = value + '%';
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Lazy-load portfolio iframes
if ('IntersectionObserver' in window) {
  const iframeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        if (iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
        }
        obs.unobserve(iframe);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('.preview iframe[data-src]').forEach(f => iframeObserver.observe(f));
}
