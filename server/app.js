import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { todayInMexico } from './dates.js';
import { createApiRouter } from './routes/index.js';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

export function createApp(db, { today = () => todayInMexico() } = {}) {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(express.static(publicDir));
  app.use('/api', createApiRouter(db, today));

  app.use((req, res) => {
    res.status(404).json({ error: 'No se encontró lo que buscas.' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.status === 400 || err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: err.type === 'entity.parse.failed' ? 'Los datos enviados no son válidos.' : err.message });
    }
    if (err.status === 413 || err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Los datos enviados son demasiado grandes.' });
    }
    if (err.status === 404) return res.status(404).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error en el servidor. Intenta de nuevo.' });
  });

  return app;
}
