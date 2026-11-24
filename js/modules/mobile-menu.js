// mobile-menu.js – Gerenciamento acessível da navegação mobile
export function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('#mobile-nav') || document.querySelector('.main-nav');

  if (!toggleBtn || !mainNav) return;

  let closeBtn = mainNav.querySelector('.mobile-nav-close');
  if (!closeBtn) {
    const navHeader = document.createElement('div');
    navHeader.className = 'mobile-nav-header';
    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'mobile-nav-close';
    closeBtn.setAttribute('aria-label', 'Fechar menu');
    closeBtn.innerHTML = '&times;';
    navHeader.appendChild(closeBtn);
    mainNav.prepend(navHeader);
  }

  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  const openMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.classList.add('is-active');
    mainNav.classList.add('is-open');
    backdrop.classList.add('is-visible');
    document.body.classList.add('nav-open');
  };

  const closeMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('is-active');
    mainNav.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    document.body.classList.remove('nav-open');
  };

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);
  closeBtn.addEventListener('click', closeMenu);

  // Fechar ao teclar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Fechar ao clicar em qualquer link de navegação ou botão dentro do menu
  mainNav.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // Fechar menu se a janela for redimensionada para desktop (> 768px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}
