// Smart back navigation for "Voltar às Especialidades" links
function initSmartBackNavigation() {
  const anatomyOrigin = sessionStorage.getItem('smm_anatomy_vt');
  const backLinks = document.querySelectorAll('a[href="../index.html#especialidades"]');

  backLinks.forEach(link => {
    if (anatomyOrigin && link.classList.contains('btn')) {
      link.textContent = 'Voltar à Anatomia 3D';
      link.setAttribute('href', '../index.html#anatomia');
    }

    link.addEventListener('click', event => {
      const referrerOrigin = document.referrer && new URL(document.referrer).origin;
      if (referrerOrigin === window.location.origin && window.history.length > 1) {
        event.preventDefault();
        window.history.back();
      }
    });
  });

  document.querySelectorAll('.service-card-cta:not([data-anatomy-link])').forEach(cardLink => {
    cardLink.addEventListener('click', () => {
      sessionStorage.removeItem('smm_anatomy_vt');
    });
  });
}

// Interceptação e feedback para botões demonstrativos de portfólio
function initDemoCtaNotice() {
  let toast = document.querySelector('.demo-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'demo-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <strong>Projeto Demonstrativo</strong>
      <p>Este site é um projeto conceitual de portfólio. As solicitações de agendamento e simulações são apenas ilustrativas.</p>
    `;
    document.body.appendChild(toast);

    toast.addEventListener('click', () => {
      toast.classList.remove('is-visible');
    });
  }

  let toastTimeout = null;

  document.querySelectorAll('[data-demo-cta]').forEach(cta => {
    cta.addEventListener('click', event => {
      event.preventDefault();
      toast.classList.add('is-visible');

      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }

      toastTimeout = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 4200);
    });
  });
}

// ScrollSpy: rastreamento do link ativo na navegação via aria-current
function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('.main-nav .nav-link[href^="#"]'));
  if (!navLinks.length) return;

  // IDs monitorados pelo scrollspy (seções com âncora)
  const SECTION_IDS = ['especialidades', 'anatomia', 'resultados', 'faq'];

  const sections = SECTION_IDS
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const header = document.querySelector('.site-header');

  function updateActiveLink() {
    const triggerY = (header ? header.getBoundingClientRect().bottom : 104) + 24;

    // Percorre as seções de baixo para cima usando suas posições reais na viewport.
    let currentSectionId = '';
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].getBoundingClientRect().top <= triggerY) {
        currentSectionId = sections[i].id;
        break;
      }
    }

    // Se ainda estamos no Hero (acima da primeira seção monitorada), limpa tudo.
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (currentSectionId && href === `#${currentSectionId}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener('hashchange', updateActiveLink);
  window.addEventListener('scrollend', updateActiveLink);

  // Marcar imediatamente o link clicado (antes do scroll terminar)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (!link.getAttribute('href').startsWith('#')) return;
      navLinks.forEach(l => l.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
    });
  });

  updateActiveLink();
}

import { initScrollAnimations } from './modules/scroll-animations.js';
import { initAnatomyExplorer } from './modules/anatomy-explorer.js';
import { initBeforeAfterSpring } from './modules/before-after-spring.js';
import { initFAQAccordion } from './modules/faq-accordion.js';
import { initMobileMenu } from './modules/mobile-menu.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollSpy();
  initScrollAnimations();
  initAnatomyExplorer();
  initBeforeAfterSpring();
  initFAQAccordion();
  initSmartBackNavigation();
  initDemoCtaNotice();

  // Na página inicial, a logo volta ao topo sem recarregar; nas páginas internas
  // o href original continua levando normalmente à página inicial.
  const isHomePage = window.location.pathname === '/' ||
    window.location.pathname.endsWith('/index.html');
  const brandLogo = document.querySelector('.site-header .brand-logo');

  if (isHomePage && brandLogo) {
    brandLogo.addEventListener('click', event => {
      event.preventDefault();
      const hero = document.querySelector('.hero');
      if (!hero) return;

      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(window.history.state, '', cleanUrl);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      hero.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
    });
  }
});




