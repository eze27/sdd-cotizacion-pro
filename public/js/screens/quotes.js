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
      el('div', { class: 'actions actions--inline' },
        linkButton('Abrir', null, `#/cotizacion/${q.id}`),
        button('Descargar PDF', null, async () => {
          try { await downloadQuotePdf(await get(`/quotes/${q.id}`)); } catch (err) { aviso('No se pudo crear el PDF. Intenta de nuevo.'); }
        }),
        linkButton('Editar', null, `#/cotizacion/${q.id}/editar`),
        button('Eliminar', 'danger', async () => {
          if (!confirmar(`¿Eliminar la cotización ${q.folio}? Esta acción no se puede deshacer.`)) return;
          try {
            await del(`/quotes/${q.id}`);
            quotes = quotes.filter((x) => x.id !== q.id);
            drawList();
          } catch (err) { aviso(err.message); }
        }),
      ),
    ])));
  }

  const EXPORT_LABEL = 'Exportar todo (.zip)';
  const exportBtn = button(EXPORT_LABEL, null, async () => {
    exportBtn.disabled = true;
    try {
      await exportAll((done, total) => { exportBtn.textContent = `Exportando… ${done} de ${total}`; });
    } catch (err) {
      aviso(err.message);
    } finally {
      exportBtn.textContent = EXPORT_LABEL;
      exportBtn.disabled = false;
    }
  });

  container.append(
    pageHeader('Cotizaciones', exportBtn, linkButton('Nueva cotización', 'primary', '#/cotizacion/nueva')),
    holder,
  );
  drawList();
}
