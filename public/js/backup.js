// Exportar todo: arma un .zip con un PDF por cotización y el archivo de datos
// (contracts/zip-layout.md y contracts/api-backup.md de la spec 003). Las funciones de nombre no usan
// nada del navegador para poder probarlas con `node --test`.
import { get } from './api.js';

const DATA_FILE = 'datos-cotizaciones.json';
const MAX_CLIENT_CHARS = 80;
const INVALID_CHARS = /[\\/:*?"<>|\u0000-\u001f]/g;
const EDGE_SPACES_DOTS = /^[\s.]+|[\s.]+$/g;

export function zipFileName(isoDate) {
  return `cotizacion-copia-${isoDate}.zip`;
}

function cleanClientName(name) {
  const trim = (s) => s.replace(EDGE_SPACES_DOTS, '');
  let clean = trim(String(name ?? '').replace(INVALID_CHARS, '-').replace(/\s+/g, ' '));
  if (clean.length > MAX_CLIENT_CHARS) clean = trim(clean.slice(0, MAX_CLIENT_CHARS));
  return clean;
}

export function pdfEntryName(folio, clientName) {
  const client = cleanClientName(clientName);
  return client ? `${folio} - ${client}.pdf` : `${folio}.pdf`;
}

function saveBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Pide todo al servidor, genera los PDF con la misma función que el PDF individual y descarga el .zip.
// `onProgress(hechos, total)` avisa tras cada PDF. Si algo falla lanza un Error en español y no se descarga nada.
export async function exportAll(onProgress = () => {}) {
  const data = await get('/backup');
  const total = data.quotes.length;
  if (total === 0) throw new Error('No hay cotizaciones para exportar.');
  onProgress(0, total);

  let blob;
  try {
    const { buildQuotePdf } = await import('./pdf.js');
    const zip = new window.JSZip();
    let done = 0;
    for (const quote of data.quotes) {
      const doc = await buildQuotePdf(quote);
      zip.file(pdfEntryName(quote.folio, quote.client.name), doc.output('arraybuffer'));
      onProgress(++done, total);
      await new Promise((resolve) => setTimeout(resolve)); // deja que el navegador actualice la pantalla
    }
    const { exportDate, profile, services, clients, quotes, folioCounters } = data;
    zip.file(DATA_FILE, JSON.stringify({ exportDate, profile, services, clients, quotes, folioCounters }, null, 2));
    blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  } catch {
    throw new Error('No se pudo crear la copia. Intenta de nuevo.');
  }
  saveBlob(blob, zipFileName(data.exportDate));
}
