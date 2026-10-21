import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zipFileName, pdfEntryName } from '../public/js/backup.js';

test('el nombre del .zip lleva la fecha de la exportación', () => {
  assert.equal(zipFileName('2026-03-15'), 'cotizacion-copia-2026-03-15.zip');
});

test('el PDF se nombra «folio - cliente»', () => {
  assert.equal(pdfEntryName('2026-001', 'Estudio García'), '2026-001 - Estudio García.pdf');
});

test('la barra y otros caracteres no válidos pasan a guion; se quita el punto final', () => {
  assert.equal(pdfEntryName('2026-004', 'Diseño/Web S.L.'), '2026-004 - Diseño-Web S.L.pdf');
  assert.equal(pdfEntryName('2026-005', 'A:B*C?"D"<E>|F\\G'), '2026-005 - A-B-C--D--E--F-G.pdf');
});

test('caracteres de control pasan a guion', () => {
  assert.equal(pdfEntryName('2026-008', 'A\u0000B\nC'), '2026-008 - A-B-C.pdf');
});

test('espacios repetidos se juntan y los de los extremos se quitan', () => {
  assert.equal(pdfEntryName('2026-009', '  Acme    SA  '), '2026-009 - Acme SA.pdf');
});

test('si el cliente queda vacío, el nombre es solo el folio', () => {
  assert.equal(pdfEntryName('2026-006', '  ...  '), '2026-006.pdf');
  assert.equal(pdfEntryName('2026-006', ''), '2026-006.pdf');
});

test('un nombre muy largo se recorta a 80 caracteres', () => {
  assert.equal(pdfEntryName('2026-007', 'a'.repeat(120)), `2026-007 - ${'a'.repeat(80)}.pdf`);
});

test('tras recortar se vuelven a quitar espacios y puntos del final', () => {
  const name = pdfEntryName('2026-010', `${'a'.repeat(79)} .b`);
  assert.equal(name, `2026-010 - ${'a'.repeat(79)}.pdf`);
});
