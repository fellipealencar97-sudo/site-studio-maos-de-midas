// faq-accordion.js – controla o acordeão de Perguntas Frequentes
export function initFAQAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const button = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!button || !panel) return;

    // Estado inicial
    button.setAttribute('aria-expanded', 'false');
    item.classList.remove('is-open');

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      // Fechar todos os itens
      items.forEach(i => {
        const b = i.querySelector('.faq-trigger');
        if (b) b.setAttribute('aria-expanded', 'false');
        i.classList.remove('is-open');
      });
      // Expandir o item clicado, se ainda não estava expandido
      if (!isExpanded) {
        button.setAttribute('aria-expanded', 'true');
        item.classList.add('is-open');
      }
    });
  });
}
