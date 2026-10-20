import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function openDb(path = process.env.DB_PATH || 'data/cotizaciones.db') {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma('foreign_keys = ON');
  if (path !== ':memory:') db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      rfc TEXT NOT NULL,
      regime TEXT NOT NULL CHECK (regime IN ('AEP', 'RESICO')),
      contact TEXT,
      logo TEXT
    );
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price_cents INTEGER NOT NULL CHECK (price_cents > 0)
    );
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rfc TEXT,
      type TEXT NOT NULL CHECK (type IN ('MORAL', 'FISICA'))
    );
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folio TEXT NOT NULL UNIQUE,
      issue_date TEXT NOT NULL,
      freelancer_name TEXT NOT NULL,
      freelancer_rfc TEXT NOT NULL,
      freelancer_regime TEXT NOT NULL,
      freelancer_contact TEXT,
      freelancer_logo TEXT,
      client_name TEXT NOT NULL,
      client_rfc TEXT,
      client_type TEXT NOT NULL,
      isr_rate_bp INTEGER NOT NULL CHECK (isr_rate_bp IN (1000, 125))
    );
    CREATE TABLE IF NOT EXISTS quote_lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      description TEXT NOT NULL,
      quantity_hundredths INTEGER NOT NULL CHECK (quantity_hundredths > 0),
      unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0)
    );
    CREATE TABLE IF NOT EXISTS folio_counters (
      year INTEGER PRIMARY KEY,
      last_number INTEGER NOT NULL
    );
  `);
  return db;
}
