(function () {
  const P = window.PHRASES;
  const RECITER = 'https://everyayah.com/data/Alafasy_128kbps/';

  const PRAYERS = {
    fajr:    { name: 'Fajr',    pt: 'Alvorada',   rakats: 2, aloud: true },
    dhuhr:   { name: 'Dhuhr',   pt: 'Meio-dia',   rakats: 4, aloud: false },
    asr:     { name: 'Asr',     pt: 'Tarde',      rakats: 4, aloud: false },
    maghrib: { name: 'Maghrib', pt: 'Pôr do sol', rakats: 3, aloud: true },
    isha:    { name: 'Isha',    pt: 'Noite',      rakats: 4, aloud: true },
  };
  const FATIHA = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'amin'];
  // Tashahhud em 4 partes: cada uma cabe na tela do celular e o destaque acompanha a recitação.
  const TASHAHHUD = ['th1', 'th2', 'th3', 'th4'];
  const SURAHS = {
    1: { name: 'Al-Ikhlas (surata 112)', ids: ['ik1', 'ik2', 'ik3', 'ik4'] },
    2: { name: 'Al-Kawthar (surata 108)', ids: ['kw1', 'kw2', 'kw3'] },
  };
  const ORD = ['', '1ª', '2ª', '3ª', '4ª'];

  const L = (id, rep = 1, note = '') => ({ id, rep, note });
  const tashahhudLines = () =>
    TASHAHHUD.map((id) => L(id, 1, id === 'th4' ? 'levante o indicador direito' : ''));

  function buildSteps(key) {
    const pr = PRAYERS[key];
    const n = pr.rakats;
    const s = [];
    const voice = pr.aloud
      ? 'Nesta oração, nas duas primeiras rakʿahs, a Al-Fatiha e a surata são recitadas em voz audível (quem reza sozinho pode recitar em voz baixa).'
      : 'Nesta oração toda a recitação é feita em silêncio, movendo os lábios.';

    s.push({ r: 1, pose: 'niyyah', title: 'Intenção', ar: 'النِّيَّة', tr: 'Niyyah',
      text: `De pé, voltado para a Qibla (direção de Meca), faça no coração a intenção de rezar ${n} rakʿahs de ${pr.name}, por Allah. A intenção não precisa ser dita em voz alta.`,
      lines: [] });

    for (let r = 1; r <= n; r++) {
      if (r === 1) {
        s.push({ r, pose: 'takbir', title: 'Takbir de abertura', ar: 'تَكْبِيرَةُ الإِحْرَام', tr: 'Takbīratul-iḥrām',
          text: 'Erga as mãos até a altura das orelhas, palmas voltadas para a frente, e diga:',
          tip: 'A partir deste momento você está em oração: não fale, não olhe em volta, não coma nem beba.',
          lines: [L('takbir')] });
        s.push({ r, pose: 'qiyam', title: 'Súplica de abertura', ar: 'دُعَاءُ الاِسْتِفْتَاح', tr: 'Duʿāʾ al-istiftāḥ',
          text: 'Coloque a mão direita sobre a esquerda, sobre o peito. Olhe para o lugar onde a testa vai tocar o chão e recite, em voz baixa:',
          lines: [L('istiftah'), L('taawwudh')] });
      } else {
        s.push({ r, pose: 'qiyam', title: `De pé para a ${ORD[r]} rakʿah`, ar: 'القِيَام', tr: 'Qiyām',
          text: `Diga Allāhu akbar enquanto se levanta para a ${ORD[r]} rakʿah. Já de pé, coloque de novo a mão direita sobre a esquerda, no peito.`,
          lines: [L('takbir', 1, 'ao se levantar')] });
      }

      s.push({ r, pose: 'qiyam', title: 'Al-Fatiha', ar: 'الفَاتِحَة', tr: 'Sūratul-Fātiḥah',
        text: 'Recite a Al-Fatiha, a surata de abertura do Alcorão. Ela é obrigatória em todas as rakʿahs. No fim, diga “Āmīn”.',
        tip: r <= 2 ? voice : 'Na 3ª e na 4ª rakʿah recita-se somente a Al-Fatiha, em silêncio, sem outra surata.',
        lines: FATIHA.map((id) => L(id)) });

      if (r <= 2) {
        const su = SURAHS[r];
        s.push({ r, pose: 'qiyam', title: `Surata curta: ${su.name}`, ar: 'قِرَاءَةُ السُّورَة', tr: 'Qirāʾatus-sūrah',
          text: 'Nas duas primeiras rakʿahs, depois da Al-Fatiha, recite uma surata curta (ou alguns versículos). Aqui usamos uma das mais curtas:',
          lines: su.ids.map((id) => L(id)) });
      }

      s.push({ r, pose: 'ruku', title: 'Inclinação', ar: 'الرُّكُوع', tr: 'Rukūʿ',
        text: 'Diga Allāhu akbar e incline-se: costas retas na horizontal, cabeça alinhada com as costas, mãos firmes nos joelhos com os dedos abertos. Recite 3 vezes:',
        lines: [L('takbir', 1, 'ao se inclinar'), L('ruku', 3)] });

      s.push({ r, pose: 'itidal', title: 'De pé, após a inclinação', ar: 'الاِعْتِدَال', tr: 'Iʿtidāl',
        text: 'Levante-se dizendo a primeira frase. Já de pé, com o corpo reto e os braços soltos ao lado do corpo, diga a segunda:',
        lines: [L('tasmi', 1, 'ao se levantar'), L('tahmid', 1, 'já de pé')] });

      s.push({ r, pose: 'sujud', title: '1ª prostração', ar: 'السُّجُود', tr: 'Sujūd',
        text: 'Diga Allāhu akbar e prostre-se: sete partes tocam o chão — testa (com o nariz), as duas palmas, os dois joelhos e as pontas dos dois pés. Cotovelos afastados do chão e do corpo. Recite 3 vezes:',
        lines: [L('takbir', 1, 'ao descer'), L('sujud', 3)] });

      s.push({ r, pose: 'jalsa', title: 'Sentado entre as prostrações', ar: 'الجَلْسَة', tr: 'Jalsah',
        text: 'Diga Allāhu akbar e sente-se sobre o pé esquerdo, com o pé direito em pé e os dedos voltados para a Qibla. Mãos sobre as coxas. Diga:',
        lines: [L('takbir', 1, 'ao se sentar'), L('jalsa', 2)] });

      s.push({ r, pose: 'sujud', title: '2ª prostração', ar: 'السُّجُود الثَّانِي', tr: 'Sujūd',
        text: 'Diga Allāhu akbar e faça a segunda prostração, igual à primeira. Recite 3 vezes:',
        lines: [L('takbir', 1, 'ao descer'), L('sujud', 3)] });

      if (r === 2 && n > 2) {
        s.push({ r, pose: 'tashahhud', title: '1º Tashahhud (sentado)', ar: 'التَّشَهُّد الأَوَّل', tr: 'At-tashahhud al-awwal',
          text: 'Diga Allāhu akbar e sente-se como na jalsah. Recite o Tashahhud. Ao dizer “lā ilāha illa llāh”, levante o dedo indicador direito.',
          tip: 'Depois deste Tashahhud você se levanta para a 3ª rakʿah (próxima etapa).',
          lines: [L('takbir', 1, 'ao se sentar'), ...tashahhudLines()] });
      }

      if (r === n) {
        s.push({ r, pose: 'tashahhud', title: 'Tashahhud final', ar: 'التَّشَهُّد الأَخِير', tr: 'At-tashahhud al-akhīr',
          text: 'Diga Allāhu akbar e sente-se para a parte final. Recite o Tashahhud, levantando o dedo indicador direito ao dizer “lā ilāha illa llāh”.',
          tip: n > 2 ? 'Na última rakʿah de orações com 3 ou 4 rakʿahs, muitos sentam com o pé esquerdo passado por baixo da perna direita (tawarruk).' : '',
          lines: [L('takbir', 1, 'ao se sentar'), ...tashahhudLines()] });
        s.push({ r, pose: 'tashahhud', title: 'Bênção sobre o Profeta', ar: 'الصَّلَاةُ الإِبْرَاهِيمِيَّة', tr: 'Aṣ-ṣalāh al-Ibrāhīmiyyah',
          text: 'Ainda sentado, recite a bênção sobre o Profeta Muhammad e a família de Abraão:',
          lines: [L('salawat1'), L('salawat2')] });
        s.push({ r, pose: 'tashahhud', title: 'Súplica final', ar: 'الدُّعَاء', tr: 'Duʿāʾ',
          text: 'Antes de encerrar, faça uma súplica. Esta, do Alcorão, é uma das mais usadas:',
          lines: [L('dua')] });
        s.push({ r, pose: 'salam_right', title: 'Saudação à direita', ar: 'التَّسْلِيم', tr: 'Taslīm',
          text: 'Vire o rosto para a direita, olhando por cima do ombro direito, e diga:',
          lines: [L('salam')] });
        s.push({ r, pose: 'salam_left', title: 'Saudação à esquerda', ar: 'التَّسْلِيم', tr: 'Taslīm',
          text: 'Agora vire o rosto para a esquerda, por cima do ombro esquerdo, e diga de novo:',
          lines: [L('salam')] });
      }
    }

    s.push({ r: n, pose: 'end', title: 'Oração concluída', ar: 'تَقَبَّلَ اللَّهُ', tr: 'Taqabbala llāh',
      text: `Você completou as ${n} rakʿahs de ${pr.name}. Depois da oração é costume continuar sentado e fazer lembranças de Deus (dhikr) e súplicas pessoais (duʿāʾ), na sua própria língua.`,
      lines: [] });
    return s;
  }

  // ---------- Estado ----------
  const saved = JSON.parse(localStorage.getItem('salah') || '{}');
  const st = {
    prayer: PRAYERS[saved.prayer] ? saved.prayer : 'fajr',
    i: 0,
    auto: !!saved.auto,
    showTr: saved.showTr !== false,
    reciter: saved.reciter !== false,
    speed: saved.speed || 1,
    playing: false,
  };
  let steps = buildSteps(st.prayer);
  const save = () => localStorage.setItem('salah', JSON.stringify({
    prayer: st.prayer, auto: st.auto, showTr: st.showTr, reciter: st.reciter, speed: st.speed,
  }));

  const $ = (id) => document.getElementById(id);
  const audio = $('audio');

  // ---------- Rolagem ----------
  // Só scrollToY() mexe na rolagem da página: duas rolagens suaves disparadas juntas se
  // cancelam (era o que impedia a troca de etapa de voltar ao desenho da posição).
  const MARGIN = 12;
  const POSE_DWELL = 1500; // ms com a nova posição à vista antes de recitar (modo guiado)
  const isMobile = () => matchMedia('(max-width: 759px)').matches;
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let userScrollUntil = 0;

  // Resolve quando a rolagem termina (evento scrollend, ou 900 ms onde ele não existe).
  function scrollToY(y) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = Math.round(Math.max(0, Math.min(y, max)));
    return new Promise((resolve) => {
      if (Math.abs(window.scrollY - target) < 2) { resolve(); return; }
      if (reduceMotion()) { window.scrollTo({ top: target, behavior: 'auto' }); resolve(); return; }
      let fallback = null;
      const done = () => { clearTimeout(fallback); window.removeEventListener('scrollend', done); resolve(); };
      fallback = setTimeout(done, 900);
      window.addEventListener('scrollend', done);
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  }

  // Área livre da tela: abaixo da faixa da miniatura (celular) e acima da barra de botões.
  function usableArea() {
    const strip = isMobile() ? $('miniPose').offsetHeight : 0;
    const barTop = document.querySelector('.controls').getBoundingClientRect().top;
    return { top: strip + MARGIN, bottom: Math.min(window.innerHeight, barTop) - MARGIN };
  }

  // Leva a frase à área livre, rolando só o necessário.
  async function revealLine(el) {
    if (document.fonts && document.fonts.status !== 'loaded') await document.fonts.ready;
    if (!el.isConnected || Date.now() < userScrollUntil) return;
    const r = el.getBoundingClientRect();
    const area = usableArea();
    const d = window.SalahScroll.scrollDelta(r.top, r.bottom, area.top, area.bottom);
    if (d) await scrollToY(window.scrollY + d);
  }

  // Leva a etapa ao topo da tela: barra de progresso, desenho e título à vista.
  function revealStep() {
    const progressTop = document.querySelector('.progress').getBoundingClientRect().top;
    return scrollToY(window.scrollY + progressTop - MARGIN);
  }

  // Rolar com o dedo ou a roda suspende a rolagem automática das frases por 4 s.
  ['wheel', 'touchmove'].forEach((ev) =>
    window.addEventListener(ev, () => { userScrollUntil = Date.now() + 4000; }, { passive: true }));

  // ---------- Render ----------
  function renderPrayers() {
    $('prayers').innerHTML = Object.entries(PRAYERS).map(([k, p]) =>
      `<button class="chip ${k === st.prayer ? 'on' : ''}" data-k="${k}">
        <b>${p.name}</b><small>${p.pt} · ${p.rakats} rakʿahs</small></button>`).join('');
  }

  function render() {
    const step = steps[st.i];
    const pr = PRAYERS[st.prayer];
    $('rakatLabel').textContent = `${pr.name} · ${ORD[step.r]} rakʿah de ${pr.rakats}`;
    $('stepCount').textContent = `Etapa ${st.i + 1} de ${steps.length}`;
    $('barFill').style.width = `${((st.i + 1) / steps.length) * 100}%`;
    $('poseSvg').innerHTML = window.figure(step.pose);
    $('stepAr').textContent = step.ar;
    $('stepTr').textContent = step.tr;
    $('stepTitle').textContent = step.title;
    $('stepText').textContent = step.text;
    $('miniPoseImg').src = window.figureSrc(step.pose);
    $('miniPoseTitle').textContent = step.title;
    $('miniPoseSub').textContent = `${ORD[step.r]} rakʿah · etapa ${st.i + 1} de ${steps.length}`;
    const tip = $('stepTip');
    tip.hidden = !step.tip;
    tip.textContent = step.tip || '';

    $('lines').innerHTML = step.lines.map((l, idx) => {
      const p = P[l.id];
      return `<li class="line" data-idx="${idx}">
        <button class="line-play" data-idx="${idx}" aria-label="Ouvir esta frase">▶</button>
        <div class="line-body">
          ${l.note || l.rep > 1 ? `<div class="line-meta">${l.note ? `<span>${l.note}</span>` : ''}${l.rep > 1 ? `<span class="rep">${l.rep}×</span>` : ''}${p.quran ? '<span class="qr">Alcorão</span>' : ''}</div>` : (p.quran ? '<div class="line-meta"><span class="qr">Alcorão</span></div>' : '')}
          <p class="ar" lang="ar" dir="rtl">${p.ar}</p>
          <p class="tr">${p.tr}</p>
          <p class="pt">${p.pt}</p>
        </div>
      </li>`;
    }).join('');
    document.body.classList.toggle('no-tr', !st.showTr);

    $('prevBtn').disabled = st.i === 0;
    $('nextBtn').disabled = st.i === steps.length - 1;
    $('playBtn').disabled = step.lines.length === 0 && !st.auto;
    updatePlayBtn();

    $('stepList').innerHTML = steps.map((s, k) =>
      `<li class="${k === st.i ? 'cur' : ''}"><button data-go="${k}">${ORD[s.r]} · ${s.title}</button></li>`).join('');

    const card = $('card');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
  }

  // ---------- Áudio ----------
  let queue = [];
  let qPos = 0;
  let timer = null;
  let token = 0;

  function sources(id) {
    const local = `audio/${id}.mp3`;
    const q = P[id].quran;
    return q && st.reciter ? [RECITER + q + '.mp3', local] : [local];
  }

  function highlight(idx) {
    document.querySelectorAll('.line').forEach((el) =>
      el.classList.toggle('active', Number(el.dataset.idx) === idx));
    const el = document.querySelector(`.line[data-idx="${idx}"]`);
    if (el) revealLine(el);
  }

  function stop() {
    token++;
    clearTimeout(timer);
    audio.pause();
    st.playing = false;
    queue = [];
    highlight(-1);
    updatePlayBtn();
  }

  function playQueue(items, onDone) {
    stop();
    const my = ++token;
    queue = items;
    qPos = 0;
    st.playing = true;
    updatePlayBtn();
    const next = () => {
      if (my !== token) return;
      if (qPos >= queue.length) {
        st.playing = false;
        highlight(-1);
        updatePlayBtn();
        if (onDone) onDone();
        return;
      }
      const it = queue[qPos++];
      highlight(it.idx);
      playSrc(it.srcs, 0, my, () => { timer = setTimeout(next, it.gap); });
    };
    next();
  }

  function playSrc(srcs, k, my, done) {
    if (my !== token) return;
    if (k >= srcs.length) { done(); return; }
    audio.onended = () => { if (my === token) done(); };
    audio.onerror = () => { if (my === token) playSrc(srcs, k + 1, my, done); };
    audio.src = srcs[k];
    audio.defaultPlaybackRate = st.speed;
    audio.playbackRate = st.speed;
    audio.play().catch(() => { if (my === token) playSrc(srcs, k + 1, my, done); });
  }

  function stepItems(step, only) {
    const items = [];
    step.lines.forEach((l, idx) => {
      if (only !== undefined && idx !== only) return;
      for (let k = 0; k < l.rep; k++) {
        items.push({ idx, srcs: sources(l.id), gap: k < l.rep - 1 ? 350 : 600 });
      }
    });
    return items;
  }

  function playStep() {
    const step = steps[st.i];
    const after = () => {
      if (!st.auto) return;
      if (st.i < steps.length - 1) {
        timer = setTimeout(() => advance(st.i + 1), 800);
      } else {
        st.auto = false; $('autoOpt').checked = false; save();
      }
    };
    if (!step.lines.length) {
      if (st.auto) {
        stop();
        st.playing = true; updatePlayBtn();
        const my = token;
        timer = setTimeout(() => { if (my === token) { st.playing = false; after(); } }, 5000);
      }
      return;
    }
    playQueue(stepItems(step), after);
  }

  function updatePlayBtn() {
    $('playBtn').textContent = st.playing ? '❚❚ Pausar' : '▶ Ouvir';
  }

  // ---------- Navegação ----------
  function go(i, { scroll = true } = {}) {
    stop();
    st.i = Math.max(0, Math.min(steps.length - 1, i));
    render();
    if (scroll) scrollToY(0);
  }

  // Modo guiado: troca de etapa, mostra a nova posição por POSE_DWELL e só então recita.
  // Pausar ou trocar de etapa no meio muda o token e cancela o resto.
  async function advance(i) {
    go(i, { scroll: false });
    const my = token;
    st.playing = true;
    updatePlayBtn();
    await revealStep();
    await new Promise((resolve) => { timer = setTimeout(resolve, POSE_DWELL); });
    if (my !== token || !st.auto) return;
    st.playing = false;
    playStep();
  }

  function setPrayer(k) {
    stop();
    st.prayer = k;
    steps = buildSteps(k);
    st.i = 0;
    save();
    renderPrayers();
    render();
  }

  // ---------- Eventos ----------
  $('prayers').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (b) setPrayer(b.dataset.k);
  });
  $('prevBtn').onclick = () => (st.auto ? advance(st.i - 1) : go(st.i - 1));
  $('nextBtn').onclick = () => (st.auto ? advance(st.i + 1) : go(st.i + 1));
  $('playBtn').onclick = () => (st.playing ? stop() : playStep());
  $('lines').addEventListener('click', (e) => {
    const b = e.target.closest('.line-play');
    if (!b) return;
    const idx = Number(b.dataset.idx);
    playQueue(stepItems(steps[st.i], idx));
  });
  $('stepList').addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    // go() redesenha a lista e desconecta o botão clicado: fechar a lista antes.
    if (b) { b.closest('details').open = false; go(Number(b.dataset.go)); }
  });

  $('autoOpt').checked = st.auto;
  $('autoOpt').onchange = (e) => { st.auto = e.target.checked; save(); if (st.auto && !st.playing) advance(st.i); else if (!st.auto) render(); };
  $('trOpt').checked = st.showTr;
  $('trOpt').onchange = (e) => { st.showTr = e.target.checked; save(); document.body.classList.toggle('no-tr', !st.showTr); };
  $('reciterOpt').checked = st.reciter;
  $('reciterOpt').onchange = (e) => { st.reciter = e.target.checked; save(); };
  $('speedOpt').value = String(st.speed);
  $('speedOpt').onchange = (e) => { st.speed = Number(e.target.value); audio.playbackRate = st.speed; save(); };

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('select, input')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); $('nextBtn').click(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); $('prevBtn').click(); }
    else if (e.key === ' ') { e.preventDefault(); $('playBtn').click(); }
  });

  // Celular: quando o desenho sai da tela, a faixa do topo mostra a posição atual.
  new IntersectionObserver(([entry]) => {
    $('miniPose').classList.toggle('show', isMobile() && entry.intersectionRatio < 0.35);
  }, { threshold: [0, 0.35, 1] }).observe($('poseSvg'));

  renderPrayers();
  render();
})();
