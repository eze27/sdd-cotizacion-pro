import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeQuotes } from '../public/js/summary.js';

test('lista vacía: todo en cero', () => {
  assert.deepEqual(summarizeQuotes([]), { vigentes: 0, vencidas: 0, total: 0 });
});

test('cuenta vigentes y vencidas según expired', () => {
  const list = [{ expired: false }, { expired: true }, { expired: false }, { expired: true }, { expired: true }];
  assert.deepEqual(summarizeQuotes(list), { vigentes: 2, vencidas: 3, total: 5 });
});

test('vigentes + vencidas = total = longitud de la lista', () => {
  const list = Array.from({ length: 7 }, (_, i) => ({ expired: i % 3 === 0 }));
  const s = summarizeQuotes(list);
  assert.equal(s.vigentes + s.vencidas, s.total);
  assert.equal(s.total, list.length);
});

test('acepta elementos con solo el campo expired', () => {
  assert.deepEqual(summarizeQuotes([{ expired: false }]), { vigentes: 1, vencidas: 0, total: 1 });
});
