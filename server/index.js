import { openDb } from './db.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3000;
const db = openDb(process.env.DB_PATH || 'data/cotizaciones.db');
const app = createApp(db);

app.listen(port, () => {
  console.log(`CotizacionesPro escuchando en el puerto ${port}`);
});
