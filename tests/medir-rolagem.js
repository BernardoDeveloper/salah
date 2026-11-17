// Medição da rolagem do modo guiado (plans/rolagem-modo-guiado.md). Não é carregado pelo site.
// Uso, no console da página:
//   const s = document.createElement('script'); s.src = 'tests/medir-rolagem.js'; document.head.append(s);
//   await medirRolagem({ de: 3, ate: 9, velocidade: 2 });   // etapas 4 a 10 do Fajr
//   relatorioRolagem();
// Com { instantanea: true } força rolagem sem animação (útil quando a aba está em segundo plano,
// onde o navegador não anima a rolagem suave).
(function () {
  window.medirRolagem = async ({ de, ate, velocidade = 2, instantanea = false }) => {
    if (instantanea) {
      const original = window.matchMedia.bind(window);
      window.matchMedia = (q) => (q.includes('prefers-reduced-motion') ? { matches: true } : original(q));
    }
    const R = (window.__rolagem = { frases: [], etapas: [], fim: false, erros: [] });
    window.addEventListener('error', (e) => R.erros.push(e.message));
    const audio = document.getElementById('audio');
    const barra = () => document.querySelector('.controls').getBoundingClientRect().top;
    const faixa = () => {
      const m = document.getElementById('miniPose');
      return m.classList.contains('show') ? m.getBoundingClientRect().bottom : 0;
    };
    let t0 = performance.now();
    let primeiroAudio = null;

    audio.addEventListener('play', () => {
      if (primeiroAudio === null) {
        primeiroAudio = performance.now();
        const e = R.etapas[R.etapas.length - 1];
        if (e) e.esperaMs = Math.round(primeiroAudio - t0);
      }
      setTimeout(() => {
        const a = document.querySelector('.line.active');
        if (!a) return;
        const r = a.getBoundingClientRect();
        const topo = faixa();
        const fundo = Math.min(window.innerHeight, barra());
        const alta = r.height > fundo - topo;
        const ok = alta ? Math.abs(r.top - topo) <= 16 : r.top >= topo - 1 && r.bottom <= fundo + 1;
        R.frases.push({ etapa: document.getElementById('stepTitle').textContent, idx: a.dataset.idx,
          top: Math.round(r.top), bottom: Math.round(r.bottom), topo: Math.round(topo), fundo: Math.round(fundo), alta, ok });
      }, 1000);
    });

    new MutationObserver(() => {
      t0 = performance.now();
      primeiroAudio = null;
      const idx = [...document.querySelectorAll('#stepList li')].findIndex((li) => li.classList.contains('cur'));
      const e = { etapa: document.getElementById('stepTitle').textContent, idx };
      R.etapas.push(e);
      setTimeout(() => {
        const p = document.querySelector('#poseSvg img').getBoundingClientRect();
        e.desenhoVisivel = p.top >= -1 && p.bottom <= Math.min(window.innerHeight, barra()) + 1;
      }, 1200);
      if (idx > ate && !R.fim) {
        document.getElementById('autoOpt').click();
        audio.pause();
        R.fim = true;
      }
    }).observe(document.getElementById('stepTitle'), { childList: true });

    const sel = document.getElementById('speedOpt');
    const opt = document.createElement('option');
    opt.value = String(velocidade);
    opt.textContent = `${velocidade}×`;
    sel.appendChild(opt);
    sel.value = String(velocidade);
    sel.dispatchEvent(new Event('change'));
    document.querySelector(`[data-go="${de}"]`).click();
    await new Promise((r) => setTimeout(r, 900));
    document.getElementById('autoOpt').click();
    return 'medindo';
  };

  window.relatorioRolagem = () => {
    const R = window.__rolagem;
    const ruins = R.frases.filter((f) => !f.ok);
    const etapas = R.etapas.filter((e, i, a) => i === 0 || e.idx !== a[i - 1].idx);
    return [
      `${window.innerWidth}x${window.innerHeight} fim=${R.fim} frases=${R.frases.length} cortadas=${ruins.length} erros=${R.erros.length}`,
      ...ruins.map((f) => `  CORTADA ${f.etapa} #${f.idx} top=${f.top} bottom=${f.bottom} área=${f.topo}..${f.fundo}${f.alta ? ' (alta)' : ''}`),
      ...R.frases.filter((f) => f.alta).map((f) => `  alta: ${f.etapa} #${f.idx} top=${f.top} área=${f.topo} ok=${f.ok}`),
      ...etapas.map((e) => `  etapa ${e.idx + 1} ${e.etapa}: desenho visível=${e.desenhoVisivel} espera até o 1º áudio=${e.esperaMs ?? '-'} ms`),
    ].join('\n');
  };
})();
