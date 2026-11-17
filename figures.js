// Ilustrações das posições. Origem: repositório CC0 BernardoDeveloper/salah-imagens
// (cópia local em img/posicoes/ para o site funcionar sem internet).
(function () {
  const FILES = {
    niyyah: 'itidal', takbir: 'takbir', qiyam: 'qiyam', itidal: 'itidal', ruku: 'ruku',
    sujud: 'sujud', jalsa: 'jalsa', tashahhud: 'tashahhud',
    salam_right: 'salam_right', salam_left: 'salam_left', end: 'jalsa',
  };
  const ALT = {
    niyyah: 'Homem em pé sobre o tapete, braços soltos ao lado do corpo, olhando para o chão',
    takbir: 'Homem em pé com as mãos erguidas ao lado das orelhas, palmas para a frente',
    qiyam: 'Homem em pé com a mão direita sobre a esquerda, no peito',
    itidal: 'Homem em pé, corpo reto, braços soltos ao lado do corpo',
    ruku: 'Homem inclinado com as costas retas na horizontal e as mãos nos joelhos',
    sujud: 'Homem prostrado com a testa e o nariz no chão, palmas no chão ao lado da cabeça',
    jalsa: 'Homem sentado sobre os pés, mãos sobre as coxas',
    tashahhud: 'Homem sentado sobre os pés, com o dedo indicador direito levantado',
    salam_right: 'Homem sentado, de frente, virando o rosto para a própria direita',
    salam_left: 'Homem sentado, de frente, virando o rosto para a própria esquerda',
    end: 'Homem sentado sobre os pés, mãos sobre as coxas',
  };
  // Destaques sobre a imagem onde o desenho sozinho é sutil.
  const CUE = {
    niyyah: 'Intenção no coração',
    salam_right: 'Rosto para a SUA direita',
    salam_left: 'Rosto para a SUA esquerda',
    end: 'Oração concluída',
  };
  // As saudações são de frente; as demais, de perfil voltado para a Qibla.
  const FRONT = new Set(['salam_right', 'salam_left']);

  window.figure = function (pose) {
    const key = FILES[pose] ? pose : 'qiyam';
    return `<figure class="pose-fig">
      <img src="img/posicoes/${FILES[key]}.webp" width="480" height="480" alt="${ALT[key]}" decoding="async">
      ${FRONT.has(key) ? '' : '<span class="qibla-tag">Qibla →</span>'}
      ${CUE[key] ? `<span class="cue-tag">${CUE[key]}</span>` : ''}
    </figure>`;
  };

  // Só o endereço da imagem (usado pela miniatura do celular).
  window.figureSrc = (pose) => `img/posicoes/${FILES[FILES[pose] ? pose : 'qiyam']}.webp`;

  // Pré-carrega todas para a troca de etapa não piscar.
  new Set(Object.values(FILES)).forEach((f) => { new Image().src = `img/posicoes/${f}.webp`; });
})();
