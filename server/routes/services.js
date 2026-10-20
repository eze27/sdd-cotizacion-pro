import { Router } from 'express';
import { badRequest, notFound } from '../errors.js';

function parseService(body) {
  const b = body ?? {};
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  if (!name) throw badRequest('Escribe el nombre del servicio.');
  if (!Number.isInteger(b.priceCents) || b.priceCents <= 0) {
    throw badRequest('El precio debe ser mayor que 0 y tener máximo 2 decimales.');
  }
  return { name, priceCents: b.priceCents };
}

export function createServicesRouter(db) {
  const router = Router();
  const byId = db.prepare('SELECT id, name, price_cents AS priceCents FROM services WHERE id = ?');

  router.get('/', (req, res) => {
    res.json(db.prepare('SELECT id, name, price_cents AS priceCents FROM services ORDER BY name COLLATE NOCASE, id').all());
  });

  router.post('/', (req, res) => {
    const s = parseService(req.body);
    const info = db.prepare('INSERT INTO services (name, price_cents) VALUES (?, ?)').run(s.name, s.priceCents);
    res.status(201).json(byId.get(info.lastInsertRowid));
  });

  router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!byId.get(id)) throw notFound('No se encontró el servicio.');
    const s = parseService(req.body);
    db.prepare('UPDATE services SET name = ?, price_cents = ? WHERE id = ?').run(s.name, s.priceCents, id);
    res.json(byId.get(id));
  });

  router.delete('/:id', (req, res) => {
    const info = db.prepare('DELETE FROM services WHERE id = ?').run(Number(req.params.id));
    if (info.changes === 0) throw notFound('No se encontró el servicio.');
    res.status(204).end();
  });

  return router;
}
