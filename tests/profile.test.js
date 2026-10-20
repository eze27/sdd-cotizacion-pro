import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let t;
before(async () => { t = await startTestServer(); });
after(async () => { await t.close(); });

const valid = { name: 'Ezequiel Hernández', rfc: 'HEXE940101AB1', regime: 'AEP' };

test('GET devuelve null sin perfil', async () => {
  const r = await t.get('/api/profile');
  assert.equal(r.status, 200);
  assert.equal(r.body, null);
});

test('PUT sin nombre, RFC o régimen → 400', async () => {
  for (const missing of ['name', 'rfc', 'regime']) {
    const body = { ...valid };
    delete body[missing];
    const r = await t.put('/api/profile', body);
    assert.equal(r.status, 400, missing);
    assert.ok(r.body.error);
  }
});

test('RFC inválido → 400; régimen inválido → 400', async () => {
  assert.equal((await t.put('/api/profile', { ...valid, rfc: 'XX' })).status, 400);
  assert.equal((await t.put('/api/profile', { ...valid, regime: 'OTRO' })).status, 400);
});

test('RFC en minúsculas se guarda en mayúsculas; contacto y logo opcionales; persiste', async () => {
  const r = await t.put('/api/profile', { ...valid, rfc: 'hexe940101ab1' });
  assert.equal(r.status, 200);
  assert.equal(r.body.rfc, 'HEXE940101AB1');
  const g = await t.get('/api/profile');
  assert.equal(g.body.name, valid.name);
  assert.equal(g.body.regime, 'AEP');
  assert.equal(g.body.rfc, 'HEXE940101AB1');
});

test('guarda contacto y logo', async () => {
  const r = await t.put('/api/profile', { ...valid, contact: 'ezequiel@example.com', logo: 'data:image/png;base64,AAAA' });
  assert.equal(r.status, 200);
  const g = await t.get('/api/profile');
  assert.equal(g.body.contact, 'ezequiel@example.com');
  assert.equal(g.body.logo, 'data:image/png;base64,AAAA');
});
