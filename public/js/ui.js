// Ayudas de interfaz. Todo el texto se inserta con textContent (nunca innerHTML con datos).
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (k === 'value') node.value = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === undefined || c === null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

let avisoTimer;
export function aviso(texto, tipo = 'error') {
  const box = document.getElementById('aviso');
  if (!box) return;
  clearTimeout(avisoTimer);
  if (!texto) { box.hidden = true; return; }
  box.textContent = texto;
  box.className = tipo === 'ok' ? 'aviso aviso--ok' : 'aviso';
  box.hidden = false;
  if (tipo === 'ok') avisoTimer = setTimeout(() => { box.hidden = true; }, 4000);
}

// Componentes reutilizables (contracts/design-system.md). Las variantes se escriben como
// 'primary' | 'secondary' | 'danger' | 'text'; sin variante es el botón neutro.
function btnClass(variant) {
  return variant ? `btn btn--${variant}` : 'btn';
}

export function button(text, variant, onclick, attrs = {}) {
  return el('button', { type: 'button', ...attrs, class: btnClass(variant), onclick }, text);
}

export function linkButton(text, variant, href) {
  return el('a', { class: btnClass(variant), href }, text);
}

// Etiqueta + control (+ ayuda y error). El control debe traer su id para enlazar la etiqueta.
export function field(label, control, { hint, error } = {}) {
  return el('div', { class: 'field' },
    el('label', { for: control.id }, label),
    control,
    hint ? el('p', { class: 'field__hint' }, hint) : null,
    error ? el('p', { class: 'field__error', role: 'alert' }, error) : null,
  );
}

// Mensaje de error de formulario: mismo estilo que el error de un campo.
export function formError() {
  return el('p', { class: 'field__error', role: 'alert' });
}

// Único lugar que decide el texto y la variante del estado de una cotización.
export function statusTag(expired) {
  return expired
    ? el('span', { class: 'tag tag--warn' }, 'Vencida')
    : el('span', { class: 'tag tag--info' }, 'Vigente');
}

export function pageHeader(title, ...actions) {
  return el('div', { class: 'page-header' },
    el('h1', {}, title),
    actions.length ? el('div', { class: 'page-header__actions' }, actions) : null,
  );
}

// Lista de datos: apilada en celular, filas con encabezado desde 768 px.
// columns: [{ label, num?, actions? }]; rows: arreglo de arreglos de nodos, uno por columna.
export function dataList(columns, rows) {
  const cell = (tag, col, content) => el(tag, {
    class: [col.num ? 'num' : '', col.actions ? 'data-list__actions' : ''].filter(Boolean).join(' ') || undefined,
    scope: tag === 'th' ? 'col' : undefined,
  }, content);
  return el('table', { class: 'data-list' },
    el('thead', {}, el('tr', {}, columns.map((c) => cell('th', c, c.label)))),
    el('tbody', {}, rows.map((r) => el('tr', {}, columns.map((c, i) => cell('td', c, r[i]))))),
  );
}

export function confirmar(texto) {
  return window.confirm(texto);
}

export function formatDateLong(isoDate) {
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${d} de ${meses[m - 1]} de ${y}`;
}

export const REGIMES = {
  AEP: 'Actividades Empresariales y Profesionales',
  RESICO: 'RESICO',
};
export const CLIENT_TYPES = { MORAL: 'Persona moral', FISICA: 'Persona física' };
