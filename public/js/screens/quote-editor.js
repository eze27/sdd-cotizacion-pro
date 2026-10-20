import { get, post, put } from '../api.js';
import {
  el, aviso, formatDateLong, CLIENT_TYPES, REGIMES, button, linkButton, field, formError, statusTag, pageHeader, dataList,
} from '../ui.js';
import {
  calcQuote, lineAmount, formatMoney, formatQuantity, parseQuantity, parsePrice,
  validateQuantity, validatePrice, isValidRfc, normalizeRfc,
} from '../calc.js';
import { downloadQuotePdf } from '../pdf.js';

export async function render(container, { id, edit }) {
  if (id && edit) return renderForm(container, await get(`/quotes/${id}`));
  if (id) return renderSaved(container, id);
  return renderForm(container, null);
}

function totalsBox(totals, clientType, isrRateBp) {
  const fila = (label, value, cls = '') => el('div', { class: `totals__row ${cls}` }, el('span', {}, label), el('span', {}, value));
  const box = el('div', { class: 'totals' });
  box.append(fila('Subtotal', formatMoney(totals.subtotal)), fila('IVA (16 %)', formatMoney(totals.iva)));
  if (clientType === 'MORAL') {
    box.append(
      fila(`Retención de ISR (${isrRateBp / 100} %)`, `-${formatMoney(totals.retIsr)}`),
      fila('Retención de IVA (2/3)', `-${formatMoney(totals.retIva)}`),
    );
  }
  box.append(fila('Total', formatMoney(totals.total), 'totals__row--total'));
  return box;
}

async function renderSaved(container, id) {
  const quote = await get(`/quotes/${id}`);
  const rows = quote.lines.map((l) => [
    l.description,
    formatQuantity(l.quantityHundredths),
    formatMoney(l.unitPriceCents),
    formatMoney(l.amount),
  ]);
  container.append(
    pageHeader(`Cotización ${quote.folio}`, statusTag(quote.expired)),
    el('div', { class: 'card' },
      el('p', {}, `Cliente: ${quote.client.name} (${CLIENT_TYPES[quote.client.type]})`),
      el('p', { class: 'muted' }, `Emitida el ${formatDateLong(quote.issueDate)} · Vigencia hasta ${formatDateLong(quote.validUntil)}`),
      el('p', { class: 'muted' }, `Régimen: ${REGIMES[quote.freelancer.regime]}`),
    ),
    dataList([
      { label: 'Descripción' },
      { label: 'Cantidad', num: true },
      { label: 'Precio unitario', num: true },
      { label: 'Importe', num: true },
    ], rows),
    totalsBox(quote.totals, quote.client.type, quote.isrRateBp),
    el('div', { class: 'actions', id: 'acciones-cotizacion' },
      button('Descargar PDF', 'primary', () => pdfAction(quote)),
      linkButton('Editar', null, `#/cotizacion/${quote.id}/editar`),
      linkButton('Volver a la lista', null, '#/cotizaciones'),
    ),
  );
}

async function pdfAction(quote) {
  try {
    await downloadQuotePdf(quote);
  } catch (err) {
    aviso('No se pudo crear el PDF. Intenta de nuevo.');
  }
}

async function renderForm(container, existing) {
  const [clients, profile, services] = await Promise.all([get('/clients'), get('/profile'), get('/services')]);
  // En edición se usa la tasa de ISR de la cotización, no la del perfil actual.
  const state = existing
    ? {
      clientId: clients.find((c) => c.name === existing.client.name && c.type === existing.client.type)?.id ?? null,
      lines: existing.lines.map((l) => ({
        description: l.description,
        quantity: formatQuantity(l.quantityHundredths),
        price: (l.unitPriceCents / 100).toFixed(2),
      })),
      isrRateBp: existing.isrRateBp,
    }
    : {
      clientId: clients[0]?.id ?? null,
      lines: [newLine()],
      isrRateBp: profile?.regime === 'RESICO' ? 125 : 1000,
    };

  function newLine() {
    return { description: '', quantity: '1', price: '' };
  }

  const clientSelect = el('select', { id: 'q-client' });
  const newClientBox = el('div', { class: 'card', hidden: true });
  const linesBox = el('div');
  const totalsHolder = el('div');
  const error = formError();
  const catalogSelect = el('select', { id: 'q-catalog', 'aria-label': 'Servicio del catálogo' },
    el('option', { value: '' }, 'Agregar del catálogo…'),
    ...services.map((sv) => el('option', { value: String(sv.id) }, `${sv.name} · ${formatMoney(sv.priceCents)}`)));
  catalogSelect.addEventListener('change', () => {
    const sv = services.find((x) => String(x.id) === catalogSelect.value);
    catalogSelect.value = '';
    if (!sv) return;
    // Solo copia nombre y precio: el concepto no queda ligado al servicio.
    state.lines.push({ description: sv.name, quantity: '1', price: (sv.priceCents / 100).toFixed(2) });
    drawLines();
  });
  const saveBtn = button('Guardar cotización', 'primary', save);

  function drawClientOptions() {
    clientSelect.replaceChildren(
      el('option', { value: '' }, 'Elige un cliente'),
      ...clients.map((c) => el('option', { value: String(c.id) }, `${c.name} (${CLIENT_TYPES[c.type]})`)),
      el('option', { value: 'nuevo' }, '+ Nuevo cliente'),
    );
    clientSelect.value = state.clientId ? String(state.clientId) : '';
  }

  clientSelect.addEventListener('change', () => {
    if (clientSelect.value === 'nuevo') {
      newClientBox.hidden = false;
      clientSelect.value = state.clientId ? String(state.clientId) : '';
      return;
    }
    state.clientId = clientSelect.value ? Number(clientSelect.value) : null;
    updateTotals();
  });

  // Alta de cliente ahí mismo
  const ncName = el('input', { type: 'text', id: 'nc-name' });
  const ncRfc = el('input', { type: 'text', id: 'nc-rfc', maxlength: 13 });
  const ncType = el('select', { id: 'nc-type' },
    el('option', { value: '' }, 'Elige el tipo'),
    el('option', { value: 'MORAL' }, CLIENT_TYPES.MORAL),
    el('option', { value: 'FISICA' }, CLIENT_TYPES.FISICA));
  const ncError = formError();
  newClientBox.append(
    el('h2', { class: 'card__title' }, 'Nuevo cliente'),
    field('Nombre o razón social', ncName),
    field('RFC (opcional)', ncRfc),
    field('Tipo de cliente', ncType),
    ncError,
    el('div', { class: 'actions' },
      button('Guardar cliente', 'primary', async () => {
        ncError.textContent = '';
        if (!ncName.value.trim()) { ncError.textContent = 'Escribe el nombre o la razón social del cliente.'; return; }
        if (!ncType.value) { ncError.textContent = 'Elige si el cliente es persona moral o persona física.'; return; }
        if (!isValidRfc(ncRfc.value, { allowEmpty: true })) { ncError.textContent = 'El RFC del cliente no tiene un formato válido.'; return; }
        try {
          const c = await post('/clients', { name: ncName.value.trim(), rfc: normalizeRfc(ncRfc.value), type: ncType.value });
          clients.push(c);
          state.clientId = c.id;
          drawClientOptions();
          newClientBox.hidden = true;
          ncName.value = ''; ncRfc.value = ''; ncType.value = '';
          updateTotals();
        } catch (err) { ncError.textContent = err.message; }
      }),
      button('Cancelar', null, () => { newClientBox.hidden = true; }),
    ),
  );

  function selectedClient() {
    return clients.find((c) => c.id === state.clientId) ?? null;
  }

  // Interpreta una línea; devuelve { error } o los valores en centésimas/centavos.
  function parseLine(l) {
    const qty = parseQuantity(l.quantity);
    const price = parsePrice(l.price);
    if (!l.description.trim()) return { error: 'Escribe la descripción del concepto.' };
    if (qty === null) return { error: 'La cantidad debe ser un número con máximo 2 decimales.' };
    const vq = validateQuantity(qty);
    if (!vq.ok) return { error: vq.error };
    if (price === null) return { error: 'Escribe un precio válido (máximo 2 decimales).' };
    const vp = validatePrice(price);
    if (!vp.ok) return { error: vp.error };
    return { description: l.description.trim(), quantityHundredths: qty, unitPriceCents: price };
  }

  function updateTotals() {
    const valid = state.lines.map(parseLine).filter((p) => !p.error);
    const client = selectedClient();
    const rate = state.isrRateBp;
    const totals = calcQuote(valid, client?.type ?? 'FISICA', rate);
    totalsHolder.replaceChildren(totalsBox(totals, client?.type ?? 'FISICA', rate));
    state.lines.forEach((l, i) => {
      const p = parseLine(l);
      const importe = document.getElementById(`importe-${i}`);
      if (importe) importe.textContent = p.error ? '' : `Importe: ${formatMoney(lineAmount(p.quantityHundredths, p.unitPriceCents))}`;
    });
  }

  function drawLines() {
    linesBox.replaceChildren(...state.lines.map((l, i) => {
      const bind = (field) => (e) => { l[field] = e.target.value; updateTotals(); };
      return el('div', { class: 'card line-item' },
        el('div', { class: 'line-item__fields' },
          field('Descripción', el('input', { id: `desc-${i}`, type: 'text', value: l.description, oninput: bind('description') })),
          field('Cantidad', el('input', { id: `qty-${i}`, type: 'text', inputmode: 'decimal', value: l.quantity, oninput: bind('quantity') })),
          field('Precio unitario (MXN)', el('input', { id: `price-${i}`, type: 'text', inputmode: 'decimal', value: l.price, oninput: bind('price') })),
        ),
        el('div', { class: 'line-item__amount', id: `importe-${i}` }),
        el('div', { class: 'actions actions--inline' },
          button('Eliminar concepto', 'danger', () => {
            state.lines.splice(i, 1);
            drawLines();
            updateTotals();
          })),
      );
    }));
    if (state.lines.length === 0) {
      linesBox.append(el('p', { class: 'empty' }, 'Aún no hay conceptos. Agrega al menos uno.'));
    }
    updateTotals();
  }

  async function save() {
    error.textContent = '';
    if (!state.clientId) { error.textContent = 'Elige un cliente para la cotización.'; return; }
    if (state.lines.length === 0) { error.textContent = 'Agrega al menos un concepto a la cotización.'; return; }
    const parsed = [];
    for (let i = 0; i < state.lines.length; i++) {
      const p = parseLine(state.lines[i]);
      if (p.error) { error.textContent = `Concepto ${i + 1}: ${p.error}`; return; }
      parsed.push(p);
    }
    saveBtn.disabled = true;
    try {
      const body = { clientId: state.clientId, lines: parsed };
      const quote = existing ? await put(`/quotes/${existing.id}`, body) : await post('/quotes', body);
      aviso(`Cotización ${quote.folio} guardada`, 'ok');
      location.hash = `#/cotizacion/${quote.id}`;
    } catch (err) {
      error.textContent = err.message;
      saveBtn.disabled = false;
    }
  }

  drawClientOptions();
  container.append(
    pageHeader(existing ? `Editar cotización ${existing.folio}` : 'Nueva cotización'),
    existing ? el('p', { class: 'muted' }, 'Al guardar, la fecha de emisión se renueva a hoy y la vigencia vuelve a contar 30 días. El folio no cambia.') : null,
    el('div', { class: 'card' }, field('Cliente', clientSelect)),
    newClientBox,
    el('h2', {}, 'Conceptos'),
    linesBox,
    el('div', { class: 'actions', id: 'acciones-conceptos' },
      button('Agregar concepto', 'secondary', () => { state.lines.push(newLine()); drawLines(); }),
      services.length ? catalogSelect : null),
    totalsHolder,
    error,
    el('div', { class: 'actions' }, saveBtn, linkButton('Cancelar', null, existing ? `#/cotizacion/${existing.id}` : '#/cotizaciones')),
  );
  drawLines();
}
