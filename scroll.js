// Conta de rolagem do guia, separada do app para poder ser testada com `node --test`.
(function (root) {
  /**
   * Quanto rolar (em px, positivo = descer) para um elemento ficar visível dentro da
   * área útil da tela (entre o topo livre e a barra de botões).
   * - Já visível por inteiro: 0.
   * - Mais alto que a área útil: alinha o começo do elemento ao topo da área.
   * - Abaixo da área: desce só até o fim do elemento encostar no fim da área.
   * - Acima da área: sobe só até o começo do elemento encostar no topo da área.
   */
  function scrollDelta(top, bottom, areaTop, areaBottom) {
    if (bottom - top > areaBottom - areaTop) return top - areaTop;
    if (bottom > areaBottom) return bottom - areaBottom;
    if (top < areaTop) return top - areaTop;
    return 0;
  }

  const api = { scrollDelta };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SalahScroll = api;
})(this);
