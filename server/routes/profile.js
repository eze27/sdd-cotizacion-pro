import { Router } from 'express';
import { badRequest } from '../errors.js';
import { isValidRfc, normalizeRfc } from '../../public/js/calc.js';

function readProfile(db) {
  const row = db.prepare('SELECT name, rfc, regime, contact, logo FROM profile WHERE id = 1').get();
  return row ?? null;
}

export function createProfileRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    res.json(readProfile(db));
  });

  router.put('/', (req, res) => {
    const b = req.body ?? {};
    const name = typeof b.name === 'string' ? b.name.trim() : '';
    const rfc = normalizeRfc(b.rfc);
    if (!name) throw badRequest('Escribe tu nombre.');
    if (!rfc) throw badRequest('Escribe tu RFC.');
    if (!isValidRfc(rfc)) throw badRequest('El RFC no tiene un formato válido.');
    if (b.regime !== 'AEP' && b.regime !== 'RESICO') throw badRequest('Elige tu régimen fiscal.');
    const contact = typeof b.contact === 'string' && b.contact.trim() ? b.contact.trim() : null;
    const logo = typeof b.logo === 'string' && b.logo ? b.logo : null;

    db.prepare(`
      INSERT INTO profile (id, name, rfc, regime, contact, logo) VALUES (1, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET name = excluded.name, rfc = excluded.rfc,
        regime = excluded.regime, contact = excluded.contact, logo = excluded.logo
    `).run(name, rfc, b.regime, contact, logo);
    res.json(readProfile(db));
  });

  return router;
}

export { readProfile };
