import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let t;
let clientId;
const lines = [{ description: 'Trabajo', quantityHundredths: 100, unitPriceCents: 2000000 }];

before(async () => {
  t = await startTestServer({ today: '2026-10-01' });
  await t.put('/api/profile', { name: 'Eze', rfc: 'HEXE940101AB1', regime: 'AEP' });
  clientId = (await t.post('/api/clients', { name: 'Cli', type: 'MORAL' })).body.id;
});
after(async () => { await t.close(); });

test('PUT renueva la fecha a hoy y conserva folio y tasa de ISR', async () => {
  t.today.value = '2026-10-01';
  const q = await t.post('/api/quotes', { clientId, lines });
  await t.put('/api/profile', { name: 'Eze', rfc: 'HEXE940101AB1', regime: 'RESICO' });
  t.today.value = '2026-10-15';
  const u = await t.put(`/api/quotes/${q.body.id}`, {
    clientId, lines: [{ description: 'Otro', quantityHundredths: 200, unitPriceCents: 1000000 }],
  });
  assert.equal(u.status, 200);
  assert.equal(u.body.folio, q.body.folio);
  assert.equal(u.body.issueDate, '2026-10-15');
  assert.equal(u.body.isrRateBp, 1000);
  assert.equal(u.body.lines.length, 1);
  assert.equal(u.body.lines[0].description, 'Otro');
  assert.equal(u.body.totals.total, 1906667);
  await t.put('/api/profile', { name: 'Eze', rfc: 'HEXE940101AB1', regime: 'AEP' });
});

test('editar una vencida la deja de marcar como vencida', async () => {
  t.today.value = '2026-10-01';
  const q = await t.post('/api/quotes', { clientId, lines });
  t.today.value = '2026-12-01';
  assert.equal((await t.get(`/api/quotes/${q.body.id}`)).body.expired, true);
  const u = await t.put(`/api/quotes/${q.body.id}`, { clientId, lines });
  assert.equal(u.body.expired, false);
  assert.equal(u.body.issueDate, '2026-12-01');
});

test('PUT con lines vacío → 400; no cambia la cotización', async () => {
  t.today.value = '2026-10-01';
  const q = await t.post('/api/quotes', { clientId, lines });
  const r = await t.put(`/api/quotes/${q.body.id}`, { clientId, lines: [] });
  assert.equal(r.status, 400);
  assert.equal((await t.get(`/api/quotes/${q.body.id}`)).body.lines.length, 1);
  assert.equal((await t.put('/api/quotes/99999', { clientId, lines })).status, 404);
});

test('cambiar de cliente actualiza la copia pero no la tasa', async () => {
  t.today.value = '2026-10-01';
  const q = await t.post('/api/quotes', { clientId, lines });
  const other = (await t.post('/api/clients', { name: 'Otro cliente', rfc: 'ABCD010101AB1', type: 'FISICA' })).body.id;
  await t.put('/api/profile', { name: 'Eze', rfc: 'HEXE940101AB1', regime: 'RESICO' });
  const u = await t.put(`/api/quotes/${q.body.id}`, { clientId: other, lines });
  assert.equal(u.body.client.name, 'Otro cliente');
  assert.equal(u.body.client.type, 'FISICA');
  assert.equal(u.body.isrRateBp, 1000);
  assert.equal(u.body.totals.total, 2320000);
  await t.put('/api/profile', { name: 'Eze', rfc: 'HEXE940101AB1', regime: 'AEP' });
});

test('DELETE responde 204 y el folio no se reutiliza', async () => {
  t.today.value = '2026-10-01';
  const a = await t.post('/api/quotes', { clientId, lines });
  assert.equal((await t.del(`/api/quotes/${a.body.id}`)).status, 204);
  assert.equal((await t.get(`/api/quotes/${a.body.id}`)).status, 404);
  const b = await t.post('/api/quotes', { clientId, lines });
  const na = Number(a.body.folio.slice(-3));
  const nb = Number(b.body.folio.slice(-3));
  assert.equal(nb, na + 1);
});

test('la lista marca expired según emisión + 30 días', async () => {
  t.today.value = '2026-10-01';
  const q = await t.post('/api/quotes', { clientId, lines });
  const find = async () => (await t.get('/api/quotes')).body.find((x) => x.id === q.body.id);
  t.today.value = '2026-10-31';
  assert.equal((await find()).expired, false);
  t.today.value = '2026-11-01';
  const row = await find();
  assert.equal(row.expired, true);
  for (const k of ['folio', 'clientName', 'issueDate', 'total']) assert.ok(k in row, k);
});
