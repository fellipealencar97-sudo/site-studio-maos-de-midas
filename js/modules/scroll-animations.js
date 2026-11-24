export function initScrollAnimations() {
  // Indica que o JavaScript está pronto – habilita estilos dependentes
  document.documentElement.classList.add('js-ready');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

  // Abertura do Hero: animar apenas conteúdo textual e mídia já presente na página.
  const hero = document.querySelector('.hero');
  const brandLogo = document.querySelector('.site-header .brand-logo');

  if (hero) {
    const heroItems = [
      brandLogo,
      ...hero.querySelectorAll('.hero-content > *, .hero-media')
    ].filter(Boolean);

    heroItems.forEach((item, index) => {
      item.classList.add('hero-intro-item');
      item.style.setProperty('--intro-index', index);
    });

    requestAnimationFrame(() => {
      document.documentElement.classList.add('hero-intro-ready');
    });
  }
}
