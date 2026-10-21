import { Router } from 'express';
import { readProfile } from './profile.js';
import { createQuoteSerializer } from './quotes.js';

// Copia de seguridad: todo lo que guarda la aplicación, en una respuesta. Solo lectura.
export function createBackupRouter(db, today) {
  const router = Router();
  const serialize = createQuoteSerializer(db, today);

  router.get('/', (req, res) => {
    res.json({
      exportDate: today(),
      profile: readProfile(db),
      services: db.prepare('SELECT id, name, price_cents AS priceCents FROM services ORDER BY name COLLATE NOCASE, id').all(),
      clients: db.prepare('SELECT id, name, rfc, type FROM clients ORDER BY name COLLATE NOCASE, id').all(),
      quotes: db.prepare('SELECT * FROM quotes ORDER BY issue_date DESC, id DESC').all().map(serialize),
      folioCounters: db.prepare('SELECT year, last_number AS lastNumber FROM folio_counters ORDER BY year').all(),
    });
  });

  return router;
}
