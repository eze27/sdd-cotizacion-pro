import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

const profile = {
  name: 'Ezequiel', rfc: 'HEXE940101AB1', regime: 'AEP', contact: 'a@b.mx',
  logo: 'data:image/png;base64,iVBORw0KGgo=',
};
const lines = [
  { description: 'Diseño', quantityHundredths: 100, unitPriceCents: 1500000 },
  { description: 'Hosting', quantityHundredths: 250, unitPriceCents: 500000 },
];

async function withServer(opts, fn) {
  const t = await startTestServer(opts);
  try { await fn(t); } finally { await t.close(); }
}

async function mkClient(t, name, type = 'MORAL') {
  const r = await t.post('/api/clients', { name, rfc: 'ACM010101AB1', type });
  return r.body.id;
}

const TABLES = ['profile', 'services', 'clients', 'quotes', 'quote_lines', 'folio_counters'];
const snapshot = (t) => Object.fromEntries(TABLES.map((n) => [n, t.db.prepare(`SELECT * FROM ${n} ORDER BY 1`).all()]));

test('base vacía: 200 con listas vacías y perfil nulo', async () => {
  await withServer({}, async (t) => {
    const r = await t.get('/api/backup');
    assert.equal(r.status, 200);
    assert.deepEqual(r.body, {
      exportDate: '2026-10-20', profile: null, services: [], clients: [], quotes: [], folioCounters: [],
    });
  });
});

test('datos completos: perfil con logo, servicios, clientes y cotizaciones iguales a GET /api/quotes/:id', async () => {
  await withServer({ today: '2025-12-30' }, async (t) => {
    await t.put('/api/profile', profile);
    await t.post('/api/services', { name: 'Diseño de sitio', priceCents: 1500000 });
    await t.post('/api/services', { name: 'Hosting', priceCents: 500000 });
    const moral = await mkClient(t, 'Estudio García', 'MORAL');
    const fisica = await mkClient(t, 'Ana Pérez', 'FISICA');

    const ids = [];
    ids.push((await t.post('/api/quotes', { clientId: moral, lines })).body.id); // 2025-001
    t.today.value = '2026-03-15';
    ids.push((await t.post('/api/quotes', { clientId: fisica, lines })).body.id); // 2026-001
    ids.push((await t.post('/api/quotes', { clientId: moral, lines: [lines[0]] })).body.id); // 2026-002

    const r = await t.get('/api/backup');
    assert.equal(r.status, 200);
    assert.equal(r.body.exportDate, '2026-03-15');
    assert.equal(r.body.profile.name, 'Ezequiel');
    assert.equal(r.body.profile.logo, profile.logo);
    assert.deepEqual(r.body.services.map((s) => s.name).sort(), ['Diseño de sitio', 'Hosting']);
    assert.deepEqual(r.body.clients.map((c) => c.name).sort(), ['Ana Pérez', 'Estudio García']);
    assert.equal(r.body.quotes.length, 3);
    assert.deepEqual(r.body.folioCounters, [{ year: 2025, lastNumber: 1 }, { year: 2026, lastNumber: 2 }]);

    for (const id of ids) {
      const single = await t.get(`/api/quotes/${id}`);
      const inBackup = r.body.quotes.find((q) => q.id === id);
      assert.deepEqual(inBackup, single.body, `cotización ${id}`);
    }
    // mismo orden que la lista de la aplicación
    const list = await t.get('/api/quotes');
    assert.deepEqual(r.body.quotes.map((q) => q.id), list.body.map((q) => q.id));
  });
});

test('un folio eliminado no aparece pero su número sigue en los contadores', async () => {
  await withServer({}, async (t) => {
    await t.put('/api/profile', profile);
    const clientId = await mkClient(t, 'Acme');
    await t.post('/api/quotes', { clientId, lines });
    const second = await t.post('/api/quotes', { clientId, lines });
    assert.equal((await t.del(`/api/quotes/${second.body.id}`)).status, 204);

    const r = await t.get('/api/backup');
    assert.deepEqual(r.body.quotes.map((q) => q.folio), ['2026-001']);
    assert.deepEqual(r.body.folioCounters, [{ year: 2026, lastNumber: 2 }]);
  });
});

test('solo lectura: ninguna tabla cambia al llamar al endpoint', async () => {
  await withServer({}, async (t) => {
    await t.put('/api/profile', profile);
    await t.post('/api/services', { name: 'Hosting', priceCents: 500000 });
    const clientId = await mkClient(t, 'Acme');
    await t.post('/api/quotes', { clientId, lines });

    const before = snapshot(t);
    assert.equal((await t.get('/api/backup')).status, 200);
    assert.equal((await t.get('/api/backup')).status, 200);
    assert.deepEqual(snapshot(t), before);

    // el siguiente folio sigue siendo el de siempre
    const next = await t.post('/api/quotes', { clientId, lines });
    assert.equal(next.body.folio, '2026-002');
  });
});
