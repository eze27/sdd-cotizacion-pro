import { get, post, put, del } from '../api.js';
import {
  el, aviso, confirmar, button, field, formError, pageHeader, dataList, setFieldError, clearFieldErrors,
} from '../ui.js';
import { formatMoney, parsePrice, validatePrice } from '../calc.js';

const COLUMNS = [
  { label: 'Servicio' },
  { label: 'Precio por defecto', num: true },
  { label: 'Acciones', actions: true },
];

export async function render(container) {
  let services = await get('/services');
  let editingId = null;

  const holder = el('div');
  const name = el('input', { id: 's-name', type: 'text' });
  const price = el('input', { id: 's-price', type: 'text', inputmode: 'decimal', placeholder: '0.00' });
  const error = formError();
  const formTitle = el('h2', { class: 'card__title' }, 'Nuevo servicio');
  const submit = el('button', { class: 'btn btn--primary', type: 'submit' }, 'Guardar servicio');
  const cancel = button('Cancelar edición', null, resetForm, { hidden: true });

  function resetForm() {
    editingId = null;
    name.value = '';
    price.value = '';
    error.textContent = '';
    clearFieldErrors(name, price);
    formTitle.textContent = 'Nuevo servicio';
    cancel.hidden = true;
  }

  function startEdit(s) {
    editingId = s.id;
    name.value = s.name;
    price.value = (s.priceCents / 100).toFixed(2);
    formTitle.textContent = 'Editar servicio';
    cancel.hidden = false;
    name.focus();
  }

  function drawList() {
    holder.replaceChildren();
    if (services.length === 0) {
      holder.append(el('p', { class: 'card empty' }, 'Aún no tienes servicios guardados.'));
      return;
    }
    holder.append(dataList(COLUMNS, services.map((s) => [
      el('span', { class: 'data-list__primary' }, s.name),
      formatMoney(s.priceCents),
      el('div', { class: 'actions actions--inline' },
        button('Editar', null, () => startEdit(s)),
        button('Eliminar', 'danger', async () => {
          if (!await confirmar(`¿Eliminar el servicio "${s.name}"?`)) return;
          try {
            await del(`/services/${s.id}`);
            services = services.filter((x) => x.id !== s.id);
            if (editingId === s.id) resetForm();
            drawList();
          } catch (err) { aviso(err.message); }
        }),
      ),
    ])));
  }

  async function save(e) {
    e.preventDefault();
    error.textContent = '';
    clearFieldErrors(name, price);
    // El campo con error se marca además de llevar su mensaje debajo (FR-022).
    if (!name.value.trim()) { setFieldError(name, 'Escribe el nombre del servicio.'); name.focus(); return; }
    const cents = parsePrice(price.value);
    const v = cents === null ? { ok: false, error: 'Escribe un precio válido (máximo 2 decimales).' } : validatePrice(cents);
    if (!v.ok) { setFieldError(price, v.error); price.focus(); return; }
    try {
      if (editingId) {
        const updated = await put(`/services/${editingId}`, { name: name.value.trim(), priceCents: cents });
        services = services.map((s) => (s.id === editingId ? updated : s));
      } else {
        services.push(await post('/services', { name: name.value.trim(), priceCents: cents }));
      }
      services.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      resetForm();
      drawList();
      aviso('Servicio guardado', 'ok');
    } catch (err) {
      error.textContent = err.message;
    }
  }

  container.append(
    pageHeader('Servicios'),
    holder,
    el('form', { class: 'card', onsubmit: save },
      formTitle,
      field('Nombre del servicio', name),
      field('Precio por defecto (MXN)', price),
      error,
      el('div', { class: 'actions' }, submit, cancel),
    ),
  );
  drawList();
}
