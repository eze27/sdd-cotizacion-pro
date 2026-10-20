import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcQuote, lineAmount, formatMoney, parseQuantity, validateQuantity, validatePrice,
  isValidRfc, normalizeRfc, formatFolio, nextFolioNumber, addDays, isExpired,
} from '../public/js/calc.js';

const lines = [
  { quantityHundredths: 100, unitPriceCents: 1500000 },
  { quantityHundredths: 100, unitPriceCents: 500000 },
];

test('AEP persona moral: 19,066.67', () => {
  const r = calcQuote(lines, 'MORAL', 1000);
  assert.deepEqual(r, { subtotal: 2000000, iva: 320000, retIsr: 200000, retIva: 213333, total: 1906667 });
});

test('RESICO persona moral: 20,816.67', () => {
  const r = calcQuote(lines, 'MORAL', 125);
  assert.equal(r.retIsr, 25000);
  assert.equal(r.retIva, 213333);
  assert.equal(r.total, 2081667);
});

test('persona física: 23,200.00 sin retenciones', () => {
  for (const rate of [1000, 125]) {
    const r = calcQuote(lines, 'FISICA', rate);
    assert.equal(r.retIsr, 0);
    assert.equal(r.retIva, 0);
    assert.equal(r.total, 2320000);
  }
});

test('cantidad 2.5 x 333.33 redondea 0.005 hacia arriba', () => {
  // 2.5 * 333.33 = 833.325 -> 833.33
  assert.equal(lineAmount(250, 33333), 83333);
  const r = calcQuote([{ quantityHundredths: 250, unitPriceCents: 33333 }], 'FISICA', 1000);
  assert.equal(r.subtotal, 83333);
});

test('validación de cantidad', () => {
  assert.equal(validateQuantity(0).ok, false);
  assert.equal(validateQuantity(-100).ok, false);
  assert.equal(validateQuantity(25).ok, true);
  assert.equal(parseQuantity('0.25'), 25);
  assert.equal(parseQuantity('2.5'), 250);
  assert.equal(parseQuantity('0.255'), null);
  assert.equal(parseQuantity('0'), 0);
  assert.equal(parseQuantity('abc'), null);
  assert.equal(validatePrice(0).ok, false);
  assert.equal(validatePrice(1).ok, true);
});

test('folio', () => {
  assert.equal(formatFolio(2026, 9), '2026-009');
  assert.equal(nextFolioNumber(9), 10);
  assert.equal(formatFolio(2026, nextFolioNumber(9)), '2026-010');
  assert.equal(nextFolioNumber(0), 1);
  assert.equal(formatFolio(2027, 1), '2027-001');
});

test('vencimiento a 30 días', () => {
  assert.equal(addDays('2026-10-01', 30), '2026-10-31');
  assert.equal(isExpired('2026-10-01', '2026-10-31'), false);
  assert.equal(isExpired('2026-10-01', '2026-11-01'), true);
});

test('RFC', () => {
  assert.equal(isValidRfc('ABC010101AB1'), true);
  assert.equal(isValidRfc('ABCD010101AB1'), true);
  assert.equal(isValidRfc('abcd010101ab1'), true);
  assert.equal(isValidRfc('AÑ&010101AB1'), true);
  assert.equal(isValidRfc('XX'), false);
  assert.equal(isValidRfc(''), false);
  assert.equal(isValidRfc('', { allowEmpty: true }), true);
  assert.equal(normalizeRfc(' abcd010101ab1 '), 'ABCD010101AB1');
});

test('formatMoney', () => {
  assert.equal(formatMoney(2000000), '$20,000.00');
  assert.equal(formatMoney(5), '$0.05');
  assert.equal(formatMoney(213333), '$2,133.33');
});
