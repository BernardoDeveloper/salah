// Desenhos das posições, vista lateral, rosto voltado para a direita (para a Qibla).
(function () {
  const line = (pts, w = 13, cls = '') =>
    `<polyline class="limb ${cls}" points="${pts}" stroke-width="${w}"/>`;
  const head = (x, y, r = 15, ex = 6, ey = -2) =>
    `<circle class="head" cx="${x}" cy="${y}" r="${r}"/>` +
    `<circle class="eye" cx="${x + ex}" cy="${y + ey}" r="2.2"/>`;

  // Partes comuns
  const standingBody =
    line('104,62 104,122', 15) +
    line('101,122 99,160 99,195') +
    line('107,122 109,160 109,195') +
    line('96,197 120,197', 9);

  const sittingBody =
    line('64,196 128,196') + // canelas no chão
    line('66,196 58,181', 9) + // pé direito em pé, dedos dobrados
    line('128,191 82,177') + // coxa
    line('82,176 88,112', 15) + // tronco
    '';

  const arrow = (dir) => {
    // seta curva acima da cabeça indicando para onde virar o rosto
    const right = dir === 'right';
    const d = right ? 'M66,52 Q92,30 118,52' : 'M118,52 Q92,30 66,52';
    const tip = right ? '118,52' : '66,52';
    const [tx, ty] = tip.split(',').map(Number);
    const head = right
      ? `${tx - 9},${ty - 9} ${tx},${ty} ${tx - 12},${ty + 2}`
      : `${tx + 9},${ty - 9} ${tx},${ty} ${tx + 12},${ty + 2}`;
    return `<path class="cue" d="${d}" fill="none" stroke-width="4"/>` +
      `<polyline class="cue" points="${head}" fill="none" stroke-width="4"/>` +
      `<text class="cue-text" x="${right ? 150 : 34}" y="40" text-anchor="middle">${right ? 'direita' : 'esquerda'}</text>`;
  };

  const POSES = {
    niyyah:
      standingBody + line('105,68 114,96 113,124', 10, 'arm') + head(104, 40) +
      '<path class="cue fill" d="M136,70 c-6,-8 -18,-2 -10,8 l10,10 l10,-10 c8,-10 -4,-16 -10,-8z"/>',
    takbir:
      standingBody + line('104,68 118,88 122,44', 10, 'arm') + head(104, 40),
    qiyam:
      standingBody + line('105,68 106,102 128,88', 10, 'arm') + head(104, 40),
    itidal:
      standingBody + line('105,68 114,96 113,124', 10, 'arm') + head(104, 40),
    ruku:
      line('84,122 84,160 84,195') + line('80,197 104,197', 9) +
      line('84,120 146,118', 15) +
      line('140,122 114,140 90,156', 10, 'arm') +
      head(163, 120, 14, 3, 5),
    sujud:
      line('56,196 98,196') + line('56,196 47,182', 9) +
      line('98,192 88,150') +
      line('88,150 138,178', 15) +
      line('134,176 124,189 148,197', 10, 'arm') +
      head(154, 185, 13, 5, 4),
    jalsa:
      sittingBody + line('88,118 96,150 120,178', 10, 'arm') + head(92, 92),
    tashahhud:
      sittingBody + line('88,118 96,150 120,178', 10, 'arm') +
      line('120,178 134,172', 5, 'finger') + head(92, 92),
    salam_right:
      sittingBody + line('88,118 96,150 120,178', 10, 'arm') + head(92, 92, 15, 1, -1) + arrow('right'),
    salam_left:
      sittingBody + line('88,118 96,150 120,178', 10, 'arm') + head(92, 92, 15, -4, -1) + arrow('left'),
    end:
      sittingBody + line('88,118 96,150 120,178', 10, 'arm') + head(92, 92) +
      '<polyline class="cue" points="140,60 152,74 176,44" fill="none" stroke-width="7"/>',
  };

  window.figure = function (pose) {
    return `<svg viewBox="0 0 220 215" role="img" aria-label="Posição: ${pose}">
      <rect class="rug" x="26" y="198" width="168" height="10" rx="4"/>
      <rect class="rug-edge" x="26" y="198" width="10" height="10" rx="2"/>
      <rect class="rug-edge" x="184" y="198" width="10" height="10" rx="2"/>
      <g class="qibla"><text x="206" y="18" text-anchor="end">Qibla →</text></g>
      <g class="person">${POSES[pose] || POSES.qiyam}</g>
    </svg>`;
  };
})();
