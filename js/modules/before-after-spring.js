// before-after-spring.js – comparador de Antes & Depois com inércia
export function initBeforeAfterSpring() {
  const stage = document.querySelector('.ba-stage');
  const divider = document.querySelector('.ba-divider');
  const caseButtons = document.querySelectorAll('[data-case-btn]');

  if (!stage || !divider) return;

  let dragging = false;
  let startX = 0;
  let startValue = 0; // 0-100

  const setValue = (val) => {
    const clamped = Math.max(0, Math.min(100, val));
    stage.setAttribute('aria-valuenow', clamped);
    const percent = clamped / 100;
    // Move divider (assume it's centered initially)
    divider.style.left = `${percent * 100}%`;
    // Clip before layer (revela o Depois na camada base à direita)
    const beforeLayer = stage.querySelector('.ba-layer-before');
    if (beforeLayer) {
      beforeLayer.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    }
  };

  const onPointerDown = (e) => {
    dragging = true;
    startX = e.clientX;
    startValue = parseInt(stage.getAttribute('aria-valuenow') || '50', 10);
    stage.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const width = stage.getBoundingClientRect().width;
    const deltaPercent = (dx / width) * 100;
    setValue(startValue + deltaPercent);
  };
  const onPointerUp = (e) => {
    dragging = false;
    stage.releasePointerCapture(e.pointerId);
  };

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerUp);

  // Keyboard controls (left/right arrows)
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const step = 5; // adjust 5%
      const current = parseInt(stage.getAttribute('aria-valuenow') || '50', 10);
      const newVal = e.key === 'ArrowLeft' ? current - step : current + step;
      setValue(newVal);
    }
  });

  // Cases (switch images)
  caseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.dataset.caseBtn;
      // Keep the accessible state and visual button style in sync.
      caseButtons.forEach(b => {
        const isActive = b === btn;
        b.setAttribute('aria-pressed', String(isActive));
        b.classList.toggle('btn-primary', isActive);
        b.classList.toggle('btn-outline', !isActive);
      });
      // Show/hide appropriate images via data attributes (simple implementation)
      const beforeImg = document.querySelector('[data-ba-before-img]');
      const afterImg = document.querySelector('[data-ba-after-img]');
      if (!beforeImg || !afterImg) return;

      if (caseId === 'sorriso') {
        beforeImg.src = 'assets/images/comparador/sorriso-antes.webp';
        beforeImg.alt = 'Registro inicial antes do planejamento estético do sorriso';
        afterImg.src = 'assets/images/comparador/sorriso-depois.webp';
        afterImg.alt = 'Simulação estética após protocolo de lentes em porcelana ultra-fina';
      } else if (caseId === 'facial') {
        beforeImg.src = 'assets/images/comparador/facial-antes.jpg';
        beforeImg.alt = 'Registro facial antes do planejamento de harmonização orofacial';
        afterImg.src = 'assets/images/comparador/facial-depois.jpg';
        afterImg.alt = 'Simulação facial após planejamento de harmonização orofacial';
      }
      // Reset slider to middle
      setValue(50);
    });
  });

  // Initialize at middle
  setValue(50);
}
