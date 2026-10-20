import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let t;
before(async () => { t = await startTestServer(); });
after(async () => { await t.close(); });

test('crea y lista clientes', async () => {
  const c = await t.post('/api/clients', { name: 'Acme SA de CV', rfc: 'ACM010101AB1', type: 'MORAL' });
  assert.equal(c.status, 201);
  assert.equal(c.body.name, 'Acme SA de CV');
  assert.ok(c.body.id);
  const list = await t.get('/api/clients');
  assert.equal(list.status, 200);
  assert.equal(list.body.length, 1);
});

test('nombre y tipo obligatorios; tipo solo MORAL o FISICA', async () => {
  assert.equal((await t.post('/api/clients', { type: 'MORAL' })).status, 400);
  assert.equal((await t.post('/api/clients', { name: 'X' })).status, 400);
  assert.equal((await t.post('/api/clients', { name: 'X', type: 'OTRO' })).status, 400);
});

test('RFC inválido → 400; RFC vacío válido', async () => {
  assert.equal((await t.post('/api/clients', { name: 'X', rfc: 'MAL', type: 'FISICA' })).status, 400);
  const ok = await t.post('/api/clients', { name: 'Sin RFC', type: 'FISICA' });
  assert.equal(ok.status, 201);
  assert.equal(ok.body.rfc, null);
  const ok2 = await t.post('/api/clients', { name: 'RFC vacío', rfc: '', type: 'FISICA' });
  assert.equal(ok2.status, 201);
});

test('RFC en minúsculas se guarda en mayúsculas', async () => {
  const c = await t.post('/api/clients', { name: 'Min', rfc: 'abcd010101ab1', type: 'FISICA' });
  assert.equal(c.body.rfc, 'ABCD010101AB1');
});
