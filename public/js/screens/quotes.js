import { get, del } from '../api.js';
import {
  el, aviso, confirmar, formatDateLong, button, linkButton, statusTag, pageHeader, dataList,
} from '../ui.js';
import { formatMoney } from '../calc.js';
import { downloadQuotePdf } from '../pdf.js';
import { exportAll } from '../backup.js';

const COLUMNS = [
  { label: 'Cotización' },
  { label: 'Cliente' },
  { label: 'Fecha de emisión' },
  { label: 'Total', num: true },
  { label: 'Estado' },
  { label: 'Acciones', actions: true },
];

export async function render(container) {
  let quotes = await get('/quotes');
  const holder = el('div');

  function drawList() {
    holder.replaceChildren();
    if (quotes.length === 0) {
      holder.append(el('p', { class: 'card empty' }, 'Aún no tienes cotizaciones. Crea la primera con "Nueva cotización".'));
      return;
    }
    holder.append(dataList(COLUMNS, quotes.map((q) => [
      el('a', { class: 'data-list__primary', href: `#/cotizacion/${q.id}` }, `Cotización ${q.folio}`),
      q.clientName,
      formatDateLong(q.issueDate),
      formatMoney(q.total),
      statusTag(q.expired),
      // Tres acciones jerarquizadas, sin «Abrir»: el folio de la fila ya es el enlace (FR-026a).
      el('div', { class: 'actions actions--inline' },
        button('Descargar PDF', null, async () => {
          try { await downloadQuotePdf(await get(`/quotes/${q.id}`)); } catch (err) { aviso('No se pudo crear el PDF. Intenta de nuevo.'); }
        }),
        linkButton('Editar', 'text', `#/cotizacion/${q.id}/editar`),
        button('Eliminar', 'danger', async () => {
          if (!await confirmar(`¿Eliminar la cotización ${q.folio}? Esta acción no se puede deshacer.`)) return;
          try {
            await del(`/quotes/${q.id}`);
            quotes = quotes.filter((x) => x.id !== q.id);
            drawList();
          } catch (err) { aviso(err.message); }
        }),
      ),
    ])));
  }

  // El avance se muestra dentro del botón, cuyo ancho se congela al empezar: así ni él ni
  // «Nueva cotización», a su lado, se desplazan durante la exportación (SC-020).
  const EXPORT_LABEL = 'Exportar todo (.zip)';
  const exportLabel = el('span', {}, EXPORT_LABEL);
  const exportAvance = el('span', { class: 'btn__avance' });
  const exportBtn = button([exportLabel, exportAvance], null, async () => {
    exportBtn.style.width = `${exportBtn.offsetWidth}px`;
    exportBtn.disabled = true;
    exportLabel.textContent = 'Exportando…';
    try {
      await exportAll((done, total) => { exportAvance.textContent = ` ${done}/${total}`; });
    } catch (err) {
      aviso(err.message);
    } finally {
      exportAvance.textContent = '';
      exportLabel.textContent = EXPORT_LABEL;
      exportBtn.disabled = false;
      exportBtn.style.width = '';
    }
  });

  container.append(
    pageHeader('Cotizaciones', exportBtn, linkButton('Nueva cotización', 'primary', '#/cotizacion/nueva')),
    holder,
  );
  drawList();
}
