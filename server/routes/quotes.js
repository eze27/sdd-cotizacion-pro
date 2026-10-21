import { Router } from 'express';
import { badRequest, notFound } from '../errors.js';
import {
  calcQuote, lineAmount, validateQuantity, validatePrice, isExpired, formatFolio, nextFolioNumber, addDays, VIGENCIA_DIAS,
} from '../../public/js/calc.js';
import { readProfile } from './profile.js';

function parseLines(lines) {
  if (!Array.isArray(lines) || lines.length === 0) throw badRequest('Agrega al menos un concepto a la cotización.');
  return lines.map((l, i) => {
    const n = i + 1;
    const description = typeof l?.description === 'string' ? l.description.trim() : '';
    if (!description) throw badRequest(`Escribe la descripción del concepto ${n}.`);
    const q = validateQuantity(l.quantityHundredths);
    if (!q.ok) throw badRequest(`Concepto ${n}: ${q.error}`);
    const p = validatePrice(l.unitPriceCents);
    if (!p.ok) throw badRequest(`Concepto ${n}: ${p.error}`);
    return { description, quantityHundredths: l.quantityHundredths, unitPriceCents: l.unitPriceCents };
  });
}

// Cotización completa tal como la entrega la API; la usan GET /quotes/:id y GET /backup.
export function createQuoteSerializer(db, today) {
  const getLines = db.prepare(
    'SELECT description, quantity_hundredths, unit_price_cents FROM quote_lines WHERE quote_id = ? ORDER BY position',
  );

  return function serialize(row) {
    const lines = getLines.all(row.id).map((l) => ({
      description: l.description,
      quantityHundredths: l.quantity_hundredths,
      unitPriceCents: l.unit_price_cents,
      amount: lineAmount(l.quantity_hundredths, l.unit_price_cents),
    }));
    const totals = calcQuote(lines, row.client_type, row.isr_rate_bp);
    return {
      id: row.id,
      folio: row.folio,
      issueDate: row.issue_date,
      validUntil: addDays(row.issue_date, VIGENCIA_DIAS),
      expired: isExpired(row.issue_date, today()),
      isrRateBp: row.isr_rate_bp,
      freelancer: {
        name: row.freelancer_name, rfc: row.freelancer_rfc, regime: row.freelancer_regime,
        contact: row.freelancer_contact, logo: row.freelancer_logo,
      },
      client: { name: row.client_name, rfc: row.client_rfc, type: row.client_type },
      lines,
      totals,
    };
  };
}

export function createQuotesRouter(db, today) {
  const router = Router();

  const getQuoteRow = db.prepare('SELECT * FROM quotes WHERE id = ?');
  const getClient = db.prepare('SELECT id, name, rfc, type FROM clients WHERE id = ?');
  const serialize = createQuoteSerializer(db, today);

  function insertLines(quoteId, lines) {
    const ins = db.prepare(
      'INSERT INTO quote_lines (quote_id, position, description, quantity_hundredths, unit_price_cents) VALUES (?, ?, ?, ?, ?)',
    );
    lines.forEach((l, i) => ins.run(quoteId, i + 1, l.description, l.quantityHundredths, l.unitPriceCents));
  }

  function requireClient(clientId) {
    const client = Number.isInteger(clientId) ? getClient.get(clientId) : null;
    if (!client) throw badRequest('Elige un cliente para la cotización.');
    return client;
  }

  router.get('/', (req, res) => {
    const now = today();
    const rows = db.prepare('SELECT * FROM quotes ORDER BY issue_date DESC, id DESC').all();
    res.json(rows.map((row) => {
      const q = serialize(row);
      return {
        id: q.id, folio: q.folio, clientName: q.client.name, issueDate: q.issueDate,
        total: q.totals.total, expired: isExpired(row.issue_date, now),
      };
    }));
  });

  router.get('/:id', (req, res) => {
    const row = getQuoteRow.get(Number(req.params.id));
    if (!row) throw notFound('No se encontró la cotización.');
    res.json(serialize(row));
  });

  router.post('/', (req, res) => {
    const b = req.body ?? {};
    const profile = readProfile(db);
    if (!profile || !profile.regime || !profile.rfc) {
      throw badRequest('Primero captura tu perfil (nombre, RFC y régimen fiscal).');
    }
    const client = requireClient(b.clientId);
    const lines = parseLines(b.lines);
    const isrRateBp = profile.regime === 'RESICO' ? 125 : 1000;

    const create = db.transaction(() => {
      const issueDate = today();
      const year = Number(issueDate.slice(0, 4));
      const counter = db.prepare('SELECT last_number FROM folio_counters WHERE year = ?').get(year);
      const n = nextFolioNumber(counter ? counter.last_number : 0);
      db.prepare(`
        INSERT INTO folio_counters (year, last_number) VALUES (?, ?)
        ON CONFLICT(year) DO UPDATE SET last_number = excluded.last_number
      `).run(year, n);
      const info = db.prepare(`
        INSERT INTO quotes (folio, issue_date, freelancer_name, freelancer_rfc, freelancer_regime,
          freelancer_contact, freelancer_logo, client_name, client_rfc, client_type, isr_rate_bp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(formatFolio(year, n), issueDate, profile.name, profile.rfc, profile.regime,
        profile.contact, profile.logo, client.name, client.rfc, client.type, isrRateBp);
      insertLines(info.lastInsertRowid, lines);
      return info.lastInsertRowid;
    });

    const id = create();
    res.status(201).json(serialize(getQuoteRow.get(id)));
  });

  router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!getQuoteRow.get(id)) throw notFound('No se encontró la cotización.');
    const b = req.body ?? {};
    const client = requireClient(b.clientId);
    const lines = parseLines(b.lines);

    // Conserva folio y tasa de ISR; renueva la fecha y la copia del cliente; reemplaza los conceptos.
    db.transaction(() => {
      db.prepare('UPDATE quotes SET issue_date = ?, client_name = ?, client_rfc = ?, client_type = ? WHERE id = ?')
        .run(today(), client.name, client.rfc, client.type, id);
      db.prepare('DELETE FROM quote_lines WHERE quote_id = ?').run(id);
      insertLines(id, lines);
    })();
    res.json(serialize(getQuoteRow.get(id)));
  });

  router.delete('/:id', (req, res) => {
    const info = db.prepare('DELETE FROM quotes WHERE id = ?').run(Number(req.params.id));
    if (info.changes === 0) throw notFound('No se encontró la cotización.');
    res.status(204).end();
  });

  return router;
}

export { parseLines };
