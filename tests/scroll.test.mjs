// Requisito (plans/rolagem-modo-guiado.md, tarefa 1.1): a frase ativa fica inteira dentro
// da área útil — entre o topo livre e a barra de botões —, rolando só o necessário;
// frase maior que a área começa alinhada ao topo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import scroll from '../scroll.js';

const { scrollDelta } = scroll;
// Celular 375×812 do diagnóstico: barra de botões começa em 744; margem de 12 px.
const AREA_TOP = 12;
const AREA_BOTTOM = 744 - 12;

test('frase já inteira na área: não rola', () => {
  assert.equal(scrollDelta(100, 300, AREA_TOP, AREA_BOTTOM), 0);
});

test('frase atrás da barra (caso do bug: fim em 812): desce até o fim sair de trás da barra', () => {
  // A frase da Al-Fatiha medida: top 636, bottom 812, altura 176.
  const d = scrollDelta(636, 812, AREA_TOP, AREA_BOTTOM);
  assert.equal(d, 812 - AREA_BOTTOM);
  assert.ok(812 - d <= AREA_BOTTOM, 'o fim fica acima da barra');
  assert.ok(636 - d >= AREA_TOP, 'o começo continua visível');
});

test('frase acima da tela (cortada 8 px no topo): sobe até o começo aparecer', () => {
  assert.equal(scrollDelta(-8, 142, AREA_TOP, AREA_BOTTOM), -8 - AREA_TOP);
});

test('frase mais alta que a área (Tashahhud, 783 px): alinha o começo ao topo, descendo', () => {
  assert.equal(scrollDelta(500, 1283, AREA_TOP, AREA_BOTTOM), 500 - AREA_TOP);
});

test('frase mais alta que a área e começando acima: alinha o começo ao topo, subindo', () => {
  assert.equal(scrollDelta(-300, 483, AREA_TOP, AREA_BOTTOM), -300 - AREA_TOP);
});

test('frase do tamanho exato da área: cabe, não é tratada como alta demais', () => {
  assert.equal(scrollDelta(AREA_TOP, AREA_BOTTOM, AREA_TOP, AREA_BOTTOM), 0);
});

test('área com faixa da miniatura no topo (61 px + margem): respeita o topo maior', () => {
  const top = 61 + 12;
  assert.equal(scrollDelta(40, 200, top, AREA_BOTTOM), 40 - top);
});
