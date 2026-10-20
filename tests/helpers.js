import { openDb } from '../server/db.js';
import { createApp } from '../server/app.js';

// Levanta la app con SQLite en memoria en un puerto libre.
// `today` es un objeto { value } mutable: cambia `ctx.today.value` entre pruebas.
export async function startTestServer({ today = '2026-10-20' } = {}) {
  const state = { value: today };
  const db = openDb(':memory:');
  const app = createApp(db, { today: () => state.value });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;

  async function request(method, path, body) {
    const res = await fetch(base + path, {
      method,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let json = null;
    if (text) { try { json = JSON.parse(text); } catch { json = text; } }
    return { status: res.status, body: json };
  }

  return {
    db,
    today: state,
    get: (p) => request('GET', p),
    post: (p, b) => request('POST', p, b),
    put: (p, b) => request('PUT', p, b),
    del: (p) => request('DELETE', p),
    close: () => new Promise((resolve) => { server.close(() => { db.close(); resolve(); }); }),
  };
}
