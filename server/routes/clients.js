import { Router } from 'express';
import { badRequest, notFound } from '../errors.js';
import { isValidRfc, normalizeRfc } from '../../public/js/calc.js';

function parseClient(body) {
  const b = body ?? {};
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  if (!name) throw badRequest('Escribe el nombre o la razón social del cliente.');
  if (b.type !== 'MORAL' && b.type !== 'FISICA') throw badRequest('Elige si el cliente es persona moral o persona física.');
  const rfc = normalizeRfc(b.rfc);
  if (!isValidRfc(rfc, { allowEmpty: true })) throw badRequest('El RFC del cliente no tiene un formato válido.');
  return { name, rfc: rfc || null, type: b.type };
}

export function createClientsRouter(db) {
  const router = Router();
  const byId = db.prepare('SELECT id, name, rfc, type FROM clients WHERE id = ?');

  router.get('/', (req, res) => {
    res.json(db.prepare('SELECT id, name, rfc, type FROM clients ORDER BY name COLLATE NOCASE, id').all());
  });

  router.post('/', (req, res) => {
    const c = parseClient(req.body);
    const info = db.prepare('INSERT INTO clients (name, rfc, type) VALUES (?, ?, ?)').run(c.name, c.rfc, c.type);
    res.status(201).json(byId.get(info.lastInsertRowid));
  });

  router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!byId.get(id)) throw notFound('No se encontró el cliente.');
    const c = parseClient(req.body);
    db.prepare('UPDATE clients SET name = ?, rfc = ?, type = ? WHERE id = ?').run(c.name, c.rfc, c.type, id);
    res.json(byId.get(id));
  });

  router.delete('/:id', (req, res) => {
    const info = db.prepare('DELETE FROM clients WHERE id = ?').run(Number(req.params.id));
    if (info.changes === 0) throw notFound('No se encontró el cliente.');
    res.status(204).end();
  });

  return router;
}
