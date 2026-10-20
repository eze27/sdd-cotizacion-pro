import { get, post, put, del } from '../api.js';
import {
  el, aviso, confirmar, CLIENT_TYPES, button, field, formError, pageHeader, dataList,
} from '../ui.js';
import { isValidRfc, normalizeRfc } from '../calc.js';

const COLUMNS = [
  { label: 'Nombre o razón social' },
  { label: 'Tipo' },
  { label: 'RFC' },
  { label: 'Acciones', actions: true },
];

export async function render(container) {
  let clients = await get('/clients');
  let editingId = null;

  const holder = el('div');
  const name = el('input', { id: 'c-name', type: 'text' });
  const rfc = el('input', { id: 'c-rfc', type: 'text', maxlength: 13, autocapitalize: 'characters' });
  const type = el('select', { id: 'c-type' },
    el('option', { value: '' }, 'Elige el tipo'),
    Object.entries(CLIENT_TYPES).map(([v, t]) => el('option', { value: v }, t)));
  const error = formError();
  const formTitle = el('h2', { class: 'card__title' }, 'Nuevo cliente');
  const cancel = button('Cancelar edición', null, resetForm, { hidden: true });

  function resetForm() {
    editingId = null;
    name.value = '';
    rfc.value = '';
    type.value = '';
    error.textContent = '';
    formTitle.textContent = 'Nuevo cliente';
    cancel.hidden = true;
  }

  function startEdit(c) {
    editingId = c.id;
    name.value = c.name;
    rfc.value = c.rfc ?? '';
    type.value = c.type;
    formTitle.textContent = 'Editar cliente';
    cancel.hidden = false;
    name.focus();
  }

  function drawList() {
    holder.replaceChildren();
    if (clients.length === 0) {
      holder.append(el('p', { class: 'card empty' }, 'Aún no tienes clientes guardados.'));
      return;
    }
    holder.append(dataList(COLUMNS, clients.map((c) => [
      el('span', { class: 'data-list__primary' }, c.name),
      CLIENT_TYPES[c.type],
      c.rfc ? `RFC ${c.rfc}` : '',
      el('div', { class: 'actions actions--inline' },
        button('Editar', null, () => startEdit(c)),
        button('Eliminar', 'danger', async () => {
          if (!confirmar(`¿Eliminar al cliente "${c.name}"? Las cotizaciones ya guardadas no cambian.`)) return;
          try {
            await del(`/clients/${c.id}`);
            clients = clients.filter((x) => x.id !== c.id);
            if (editingId === c.id) resetForm();
            drawList();
          } catch (err) { aviso(err.message); }
        }),
      ),
    ])));
  }

  async function save(e) {
    e.preventDefault();
    error.textContent = '';
    if (!name.value.trim()) { error.textContent = 'Escribe el nombre o la razón social del cliente.'; return; }
    if (!type.value) { error.textContent = 'Elige si el cliente es persona moral o persona física.'; return; }
    if (!isValidRfc(rfc.value, { allowEmpty: true })) { error.textContent = 'El RFC del cliente no tiene un formato válido.'; return; }
    const body = { name: name.value.trim(), rfc: normalizeRfc(rfc.value), type: type.value };
    try {
      if (editingId) {
        const updated = await put(`/clients/${editingId}`, body);
        clients = clients.map((c) => (c.id === editingId ? updated : c));
      } else {
        clients.push(await post('/clients', body));
      }
      clients.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      resetForm();
      drawList();
      aviso('Cliente guardado', 'ok');
    } catch (err) {
      error.textContent = err.message;
    }
  }

  container.append(
    pageHeader('Clientes'),
    holder,
    el('form', { class: 'card', onsubmit: save },
      formTitle,
      field('Nombre o razón social', name),
      field('RFC (opcional)', rfc),
      field('Tipo de cliente', type),
      error,
      el('div', { class: 'actions' }, el('button', { class: 'btn btn--primary', type: 'submit' }, 'Guardar cliente'), cancel),
    ),
  );
  drawList();
}
