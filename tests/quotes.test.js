import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let t;
before(async () => { t = await startTestServer({ today: '2026-10-20' }); });
after(async () => { await t.close(); });

const profile = { name: 'Ezequiel', rfc: 'HEXE940101AB1', regime: 'AEP', contact: 'a@b.mx' };
const lines = [
  { description: 'Diseño', quantityHundredths: 100, unitPriceCents: 1500000 },
  { description: 'Hosting', quantityHundredths: 100, unitPriceCents: 500000 },
];

async function mkClient(type = 'MORAL') {
  const r = await t.post('/api/clients', { name: `Cliente ${type}`, rfc: 'ACM010101AB1', type });
  return r.body.id;
}

test('sin perfil → 400', async () => {
  const clientId = await mkClient();
  const r = await t.post('/api/quotes', { clientId, lines });
  assert.equal(r.status, 400);
  assert.ok(r.body.error);
});

test('con perfil: validaciones y folios', async () => {
  await t.put('/api/profile', profile);
  const clientId = await mkClient();

  // sin conceptos: 400 y no consume folio
  assert.equal((await t.post('/api/quotes', { clientId, lines: [] })).status, 400);
  // cantidades inválidas
  for (const q of [0, -100, 25.5]) {
    const r = await t.post('/api/quotes', { clientId, lines: [{ ...lines[0], quantityHundredths: q }] });
    assert.equal(r.status, 400, `cantidad ${q}`);
  }
  assert.equal((await t.post('/api/quotes', { clientId, lines: [{ ...lines[0], unitPriceCents: 0 }] })).status, 400);
  assert.equal((await t.post('/api/quotes', { clientId: 9999, lines })).status, 400);

  // cantidad 0.25 aceptada; primer folio 2026-001
  const a = await t.post('/api/quotes', { clientId, lines: [{ ...lines[0], quantityHundredths: 25 }] });
  assert.equal(a.status, 201);
  assert.equal(a.body.folio, '2026-001');
  const b = await t.post('/api/quotes', { clientId, lines });
  assert.equal(b.body.folio, '2026-002');

  // folio eliminado no se reutiliza
  assert.equal((await t.del(`/api/quotes/${b.body.id}`)).status, 204);
  const c = await t.post('/api/quotes', { clientId, lines });
  assert.equal(c.body.folio, '2026-003');

  // año nuevo: vuelve a 001
  t.today.value = '2027-01-02';
  const d = await t.post('/api/quotes', { clientId, lines });
  assert.equal(d.body.folio, '2027-001');
  assert.equal(d.body.issueDate, '2027-01-02');
  t.today.value = '2026-10-20';
});

test('copia perfil, cliente y tasa; cambios posteriores no la modifican', async () => {
  await t.put('/api/profile', { ...profile, regime: 'AEP' });
  const clientId = await mkClient();
  const q = await t.post('/api/quotes', { clientId, lines });
  assert.equal(q.body.isrRateBp, 1000);
  assert.equal(q.body.freelancer.name, 'Ezequiel');
  assert.equal(q.body.client.name, 'Cliente MORAL');

  await t.put('/api/profile', { ...profile, name: 'Otro Nombre', regime: 'RESICO' });
  await t.put(`/api/clients/${clientId}`, { name: 'Renombrado', type: 'FISICA' }).catch(() => {});
  const again = await t.get(`/api/quotes/${q.body.id}`);
  assert.equal(again.body.isrRateBp, 1000);
  assert.equal(again.body.freelancer.name, 'Ezequiel');
  assert.equal(again.body.freelancer.regime, 'AEP');
  assert.equal(again.body.client.name, 'Cliente MORAL');
  assert.equal(again.body.totals.total, 1906667);

  const r = await t.post('/api/quotes', { clientId, lines });
  assert.equal(r.body.isrRateBp, 125);
  await t.put('/api/profile', profile);
});

test('totales de los tres ejemplos', async () => {
  await t.put('/api/profile', { ...profile, regime: 'AEP' });
  const moral = await mkClient('MORAL');
  const fisica = await mkClient('FISICA');
  const aep = await t.post('/api/quotes', { clientId: moral, lines });
  assert.equal(aep.body.totals.total, 1906667);
  assert.equal(aep.body.totals.retIva, 213333);
  const fis = await t.post('/api/quotes', { clientId: fisica, lines });
  assert.equal(fis.body.totals.total, 2320000);

  await t.put('/api/profile', { ...profile, regime: 'RESICO' });
  const resico = await t.post('/api/quotes', { clientId: moral, lines });
  assert.equal(resico.body.totals.total, 2081667);
  await t.put('/api/profile', profile);
});

test('lista incluye folio, cliente, fecha, total y expired', async () => {
  const r = await t.get('/api/quotes');
  assert.equal(r.status, 200);
  const first = r.body[0];
  for (const k of ['id', 'folio', 'clientName', 'issueDate', 'total', 'expired']) assert.ok(k in first, k);
});
