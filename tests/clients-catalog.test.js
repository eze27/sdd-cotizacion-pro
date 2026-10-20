import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let t;
before(async () => {
  t = await startTestServer();
  await t.put('/api/profile', { name: 'Eze', rfc: 'HEXE940101AB1', regime: 'AEP' });
});
after(async () => { await t.close(); });

const lines = [{ description: 'Trabajo', quantityHundredths: 100, unitPriceCents: 2000000 }];

test('PUT y DELETE de clientes', async () => {
  const c = await t.post('/api/clients', { name: 'Uno', type: 'MORAL' });
  const u = await t.put(`/api/clients/${c.body.id}`, { name: 'Uno editado', rfc: 'abc010101ab1', type: 'FISICA' });
  assert.equal(u.status, 200);
  assert.equal(u.body.name, 'Uno editado');
  assert.equal(u.body.rfc, 'ABC010101AB1');
  assert.equal((await t.put(`/api/clients/${c.body.id}`, { name: '', type: 'FISICA' })).status, 400);
  assert.equal((await t.put('/api/clients/9999', { name: 'X', type: 'FISICA' })).status, 404);
  assert.equal((await t.del(`/api/clients/${c.body.id}`)).status, 204);
  assert.equal((await t.del(`/api/clients/${c.body.id}`)).status, 404);
});

test('editar o eliminar un cliente no cambia cotizaciones guardadas', async () => {
  const c = await t.post('/api/clients', { name: 'Cliente Original', rfc: 'ACM010101AB1', type: 'MORAL' });
  const q = await t.post('/api/quotes', { clientId: c.body.id, lines });
  await t.put(`/api/clients/${c.body.id}`, { name: 'Nombre Nuevo', type: 'FISICA' });
  let got = await t.get(`/api/quotes/${q.body.id}`);
  assert.equal(got.body.client.name, 'Cliente Original');
  assert.equal(got.body.client.type, 'MORAL');
  assert.equal(got.body.totals.total, 1906667);
  await t.del(`/api/clients/${c.body.id}`);
  got = await t.get(`/api/quotes/${q.body.id}`);
  assert.equal(got.status, 200);
  assert.equal(got.body.client.name, 'Cliente Original');
});

test('cambiar un cliente a persona física solo afecta cotizaciones nuevas', async () => {
  const c = await t.post('/api/clients', { name: 'Cambia', type: 'MORAL' });
  const before = await t.post('/api/quotes', { clientId: c.body.id, lines });
  assert.equal(before.body.totals.retIsr, 200000);
  await t.put(`/api/clients/${c.body.id}`, { name: 'Cambia', type: 'FISICA' });
  const old = await t.get(`/api/quotes/${before.body.id}`);
  assert.equal(old.body.totals.retIsr, 200000);
  const next = await t.post('/api/quotes', { clientId: c.body.id, lines });
  assert.equal(next.body.totals.retIsr, 0);
  assert.equal(next.body.totals.retIva, 0);
  assert.equal(next.body.totals.total, 2320000);
});
