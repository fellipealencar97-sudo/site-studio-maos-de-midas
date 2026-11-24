const ANATOMY_DATA = {
  lamina: {
    mode: "dental",
    vtKey: "lentes",
    tag: "Camada 01 • Odontologia Digital",
    title: "Lâmina Cerâmica Ultra-Fina (0,2 mm)",
    desc: "Projetada em CAD/CAM a partir do escaneamento intraoral, a lente mimetiza a translucidez incisal e a microtextura do dente natural sem comprometer a estrutura sadia.",
    spec1: "Dissilicato de Lítio Estratificado",
    spec2: "95% a 100% do esmalte intacto",
    spec3: "2 a 3 encontros planejados",
    linkHref: "procedimentos/lentes-contato-dental.html",
    linkText: "Explorar protocolo de Lentes"
  },
  esmalte: {
    mode: "dental",
    vtKey: "lentes",
    tag: "Camada 02 • Biomecânica Adesiva",
    title: "Preservação Máxima de Esmalte",
    desc: "A adesão micromecânica em esmalte íntegro garante longevidade clínica superior, estabilidade cromática e ausência de sensibilidade pós-operatória.",
    spec1: "Adesão Fotoativada de Alta Carga",
    spec2: "Zero desgaste invasivo de dentina",
    spec3: "Longevidade média de 15+ anos",
    linkHref: "procedimentos/lentes-contato-dental.html",
    linkText: "Conhecer preservação de esmalte"
  },
  gengiva: {
    mode: "dental",
    vtKey: "lentes",
    tag: "Camada 03 • Arquitetura Rosa",
    title: "Adaptação Cervical e Perfil de Emergência",
    desc: "O término cervical polido sob magnificação óptica respeita o espaço biológico periodontal, mantendo a papila gengival saudável e livre de inflamação.",
    spec1: "Acabamento sob Magnificação 16x",
    spec2: "Biocompatibilidade periodontal total",
    spec3: "Contorno gengival harmônico",
    linkHref: "procedimentos/lentes-contato-dental.html",
    linkText: "Ver detalhes do acabamento clínico"
  },
  "terco-superior": {
    mode: "facial",
    vtKey: "harmonizacao",
    tag: "Terço Superior • Dinâmica Muscular",
    title: "Suavização Cinética e Arquitetura do Olhar",
    desc: "Modulação seletiva dos vetores de contração frontal e glabelar para descansar a expressão sem bloquear a mímica natural do rosto.",
    spec1: "Toxina Botulínica Purificada",
    spec2: "Preservação da expressividade natural",
    spec3: "Sessão única de 40 minutos",
    linkHref: "procedimentos/harmonizacao-orofacial.html",
    linkText: "Explorar Harmonização Orofacial"
  },
  "terco-medio": {
    mode: "facial",
    vtKey: "harmonizacao",
    tag: "Terço Médio • Sustentação Profunda",
    title: "Reposicionamento Malar e Suporte Zigomático",
    desc: "Restauração dos compartimentos profundos de gordura e pontos de ancoragem ligamentar, devolvendo projeção suave e efeito lifting sem exageros.",
    spec1: "Ácido Hialurônico de Alta Coesividade",
    spec2: "Aplicação supraperiosteal guiada",
    spec3: "Resultado imediato e progressivo",
    linkHref: "procedimentos/harmonizacao-orofacial.html",
    linkText: "Conhecer sustentação malar"
  },
  "terco-inferior": {
    mode: "facial",
    vtKey: "dual",
    tag: "Terço Inferior • Contorno e Proporção",
    title: "Definição Mandibular e Equilíbrio Labial",
    desc: "Refinamento do ângulo mandibular, projeção mentual e hidratação estrutural dos lábios em total sintonia com a largura do novo sorriso.",
    spec1: "Preenchedores Reológicos Específicos",
    spec2: "Integração estética lábio-dental",
    spec3: "Protocolo Reabilitação Dual",
    linkHref: "procedimentos/reabilitacao-estetica-dual.html",
    linkText: "Conhecer Reabilitação Dual"
  }
};

const MODE_CONFIG = {
  dental: {
    hud: "CAD/CAM 3D • CORTE SAGITAL",
    defaultHotspot: "lamina"
  },
  facial: {
    hud: "ANÁLISE 3D • PERFIL FACIAL",
    defaultHotspot: "terco-superior"
  }
};

export function initAnatomyExplorer() {
  const section = document.getElementById("anatomia");
  if (!section) return;

  const tabs = section.querySelectorAll("[data-anatomy-mode]");
  const models = section.querySelectorAll("[data-svg-model]");
  const layers = section.querySelectorAll("[data-layer]");
  const hotspots = section.querySelectorAll(".hotspot-btn[data-hotspot]");
  const hudBadge = section.querySelector("[data-anatomy-hud]");
  const panel = section.querySelector("#panel-anatomia");
  const fields = {
    tag: section.querySelector("[data-anatomy-tag]"),
    title: section.querySelector("[data-anatomy-title]"),
    desc: section.querySelector("[data-anatomy-desc]"),
    spec1: section.querySelector("[data-anatomy-spec1]"),
    spec2: section.querySelector("[data-anatomy-spec2]"),
    spec3: section.querySelector("[data-anatomy-spec3]"),
    link: section.querySelector("[data-anatomy-link]"),
    linkText: section.querySelector("[data-anatomy-link-text]")
  };

  let activeHotspot = "lamina";
  const stage = section.querySelector("[data-anatomy-stage]");

  const VT_STORAGE_KEY = "smm_anatomy_vt";

  function applyAnatomyTransitionPairing(vtKey) {
    if (!vtKey || !panel) return () => {};
    const cardMedia = document.querySelector(`.vt-${vtKey}-media`);
    const cardTitle = document.querySelector(`.vt-${vtKey}-title`);

    if (cardMedia) cardMedia.style.viewTransitionName = "none";
    if (cardTitle) cardTitle.style.viewTransitionName = "none";

    panel.style.viewTransitionName = `proc-${vtKey}-media`;
    if (fields.title) {
      fields.title.style.viewTransitionName = `proc-${vtKey}-title`;
    }

    return () => {
      if (cardMedia) cardMedia.style.viewTransitionName = "";
      if (cardTitle) cardTitle.style.viewTransitionName = "";
      panel.style.viewTransitionName = "";
      if (fields.title) fields.title.style.viewTransitionName = "";
    };
  }

  if (fields.link) {
    fields.link.addEventListener("click", () => {
      const currentData = ANATOMY_DATA[activeHotspot];
      if (currentData?.vtKey) {
        sessionStorage.setItem(VT_STORAGE_KEY, currentData.vtKey);
      }
    });
  }

  window.addEventListener("pageswap", (event) => {
    const vtKey = sessionStorage.getItem(VT_STORAGE_KEY);
    if (!vtKey) return;
    const cleanup = applyAnatomyTransitionPairing(vtKey);
    if (event.viewTransition) {
      event.viewTransition.finished.finally(cleanup);
    } else {
      cleanup();
    }
  });

  window.addEventListener("pagereveal", (event) => {
    const vtKey = sessionStorage.getItem(VT_STORAGE_KEY);
    if (!vtKey) return;
    sessionStorage.removeItem(VT_STORAGE_KEY);
    const cleanup = applyAnatomyTransitionPairing(vtKey);
    if (event.viewTransition) {
      event.viewTransition.finished.finally(cleanup);
    } else {
      cleanup();
    }
  });

  let updateTimer = null;

  function renderHotspot(hotspotKey, animate = true) {
    const data = ANATOMY_DATA[hotspotKey];
    if (!data) return;

    activeHotspot = hotspotKey;

    hotspots.forEach((btn) => {
      const isSelected = btn.dataset.hotspot === hotspotKey;
      btn.setAttribute("aria-pressed", String(isSelected));
    });

    layers.forEach((layer) => {
      const isMatch = layer.dataset.layer === hotspotKey;
      layer.classList.toggle("is-active", isMatch);
    });

    const applyContent = () => {
      if (fields.tag) fields.tag.textContent = data.tag;
      if (fields.title) fields.title.textContent = data.title;
      if (fields.desc) fields.desc.textContent = data.desc;
      if (fields.spec1) fields.spec1.textContent = data.spec1;
      if (fields.spec2) fields.spec2.textContent = data.spec2;
      if (fields.spec3) fields.spec3.textContent = data.spec3;
      if (fields.link) fields.link.setAttribute("href", data.linkHref);
      if (fields.linkText) fields.linkText.textContent = data.linkText;
    };

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!panel || !animate || prefersReduced) {
      applyContent();
      return;
    }

    window.clearTimeout(updateTimer);
    panel.classList.add("is-updating");

    updateTimer = window.setTimeout(() => {
      applyContent();
      panel.classList.remove("is-updating");
    }, 140);
  }

  function triggerStageDraw() {
    if (!stage) return;
    stage.classList.remove("is-drawn");
    void stage.offsetWidth;
    stage.classList.add("is-drawn");
  }

  function switchMode(mode) {
    const config = MODE_CONFIG[mode];
    if (!config) return;

    tabs.forEach((tab) => {
      const isSelected = tab.dataset.anatomyMode === mode;
      tab.setAttribute("aria-selected", String(isSelected));
    });

    models.forEach((svg) => {
      const isMatch = svg.dataset.svgModel === mode;
      svg.toggleAttribute("hidden", !isMatch);
      svg.setAttribute("aria-hidden", String(!isMatch));
    });

    if (hudBadge) {
      hudBadge.textContent = config.hud;
    }

    triggerStageDraw();
    renderHotspot(config.defaultHotspot, true);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetMode = tab.dataset.anatomyMode;
      if (targetMode && tab.getAttribute("aria-selected") !== "true") {
        switchMode(targetMode);
      }
    });
  });

  hotspots.forEach((btn) => {
    const activate = () => {
      const key = btn.dataset.hotspot;
      if (key && key !== activeHotspot) {
        renderHotspot(key, true);
      }
    };

    btn.addEventListener("click", activate);
    btn.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });

  triggerStageDraw();
  renderHotspot(activeHotspot, false);
}
