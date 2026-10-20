import { Router } from 'express';
import { createProfileRouter } from './profile.js';
import { createClientsRouter } from './clients.js';
import { createQuotesRouter } from './quotes.js';
import { createServicesRouter } from './services.js';

export function createApiRouter(db, today) {
  const router = Router();
  router.use('/profile', createProfileRouter(db));
  router.use('/clients', createClientsRouter(db));
  router.use('/services', createServicesRouter(db));
  router.use('/quotes', createQuotesRouter(db, today));
  return router;
}
