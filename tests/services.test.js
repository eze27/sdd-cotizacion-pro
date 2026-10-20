import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let t;
before(async () => { t = await startTestServer(); });
after(async () => { await t.close(); });

test('CRUD de servicios', async () => {
  const c = await t.post('/api/services', { name: 'Diseño de logotipo', priceCents: 1500000 });
  assert.equal(c.status, 201);
  assert.equal(c.body.priceCents, 1500000);
  const id = c.body.id;

  const list = await t.get('/api/services');
  assert.equal(list.body.length, 1);

  const u = await t.put(`/api/services/${id}`, { name: 'Diseño de marca', priceCents: 2000000 });
  assert.equal(u.status, 200);
  assert.equal(u.body.name, 'Diseño de marca');

  assert.equal((await t.del(`/api/services/${id}`)).status, 204);
  assert.equal((await t.get('/api/services')).body.length, 0);
  assert.equal((await t.del(`/api/services/${id}`)).status, 404);
});

test('nombre obligatorio y precio entero mayor que 0', async () => {
  assert.equal((await t.post('/api/services', { priceCents: 100 })).status, 400);
  assert.equal((await t.post('/api/services', { name: '  ', priceCents: 100 })).status, 400);
  assert.equal((await t.post('/api/services', { name: 'X', priceCents: 0 })).status, 400);
  assert.equal((await t.post('/api/services', { name: 'X', priceCents: -5 })).status, 400);
  assert.equal((await t.post('/api/services', { name: 'X', priceCents: 10.5 })).status, 400);
  assert.equal((await t.post('/api/services', { name: 'X' })).status, 400);
});

test('cambiar el precio de un servicio no modifica una cotización guardada', async () => {
  await t.put('/api/profile', { name: 'Eze', rfc: 'HEXE940101AB1', regime: 'AEP' });
  const client = await t.post('/api/clients', { name: 'Cli', type: 'MORAL' });
  const svc = await t.post('/api/services', { name: 'Consultoría', priceCents: 100000 });
  const q = await t.post('/api/quotes', {
    clientId: client.body.id,
    lines: [{ description: svc.body.name, quantityHundredths: 100, unitPriceCents: svc.body.priceCents }],
  });
  await t.put(`/api/services/${svc.body.id}`, { name: 'Consultoría', priceCents: 999900 });
  const after = await t.get(`/api/quotes/${q.body.id}`);
  assert.equal(after.body.lines[0].unitPriceCents, 100000);
  assert.equal(after.body.lines[0].description, 'Consultoría');
});
