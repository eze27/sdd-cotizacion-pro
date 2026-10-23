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

// Avisos: se pueden cerrar. El de error permanece hasta que la persona lo cierra o cambia de
// pantalla; el de éxito desaparece solo a los 4 segundos (FR-024).
let avisoTimer;
let avisoCerrarListo = false;

function ocultarAviso() {
  const box = document.getElementById('aviso');
  if (box) box.hidden = true;
}

export function aviso(texto, tipo = 'error') {
  const box = document.getElementById('aviso');
  if (!box) return;
  const cuerpo = document.getElementById('aviso-texto');
  const cerrar = document.getElementById('aviso-cerrar');
  if (cerrar && !avisoCerrarListo) {
    cerrar.addEventListener('click', () => { clearTimeout(avisoTimer); ocultarAviso(); });
    avisoCerrarListo = true;
  }
  clearTimeout(avisoTimer);
  if (!texto) { box.hidden = true; return; }
  if (cuerpo) cuerpo.textContent = texto;
  else box.textContent = texto;
  box.className = tipo === 'ok' ? 'aviso aviso--ok' : 'aviso';
  box.hidden = false;
  if (tipo === 'ok') avisoTimer = setTimeout(ocultarAviso, 4000);
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
// El párrafo de error existe siempre (vacío se oculta con CSS) para que setFieldError pueda
// escribir en él y enlazarlo con aria-describedby.
export function field(label, control, { hint, error } = {}) {
  const errorId = control.id ? `${control.id}-error` : undefined;
  return el('div', { class: 'field' },
    el('label', { for: control.id }, label),
    control,
    hint ? el('p', { class: 'field__hint' }, hint) : null,
    el('p', { class: 'field__error', id: errorId, role: 'alert' }, error ?? null),
  );
}

// Marca o limpia el estado inválido de un control: borde rojo (aria-invalid), mensaje debajo y
// anuncio a tecnologías de asistencia (FR-022). Sin mensaje, limpia el estado.
export function setFieldError(control, mensaje) {
  if (!control || !control.id) return;
  const node = document.getElementById(`${control.id}-error`);
  if (mensaje) {
    control.setAttribute('aria-invalid', 'true');
    control.setAttribute('aria-describedby', `${control.id}-error`);
    if (node) node.textContent = mensaje;
  } else {
    control.removeAttribute('aria-invalid');
    control.removeAttribute('aria-describedby');
    if (node) node.textContent = '';
  }
}

export function clearFieldErrors(...controls) {
  for (const c of controls.flat()) setFieldError(c, '');
}

// Mensaje de error de formulario: mismo estilo que el error de un campo.
export function formError() {
  return el('p', { class: 'field__error', role: 'alert' });
}

// Único lugar que decide el texto y la variante del estado de una cotización.
export function statusTag(expired) {
  return expired
    ? el('span', { class: 'tag tag--warn' }, 'Vencida')
    : el('span', { class: 'tag tag--success' }, 'Vigente');
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

// Confirmación propia, dentro de la aplicación (FR-024a). Devuelve una promesa de booleano.
// Se apoya en el elemento <dialog> nativo con showModal(), que ya aporta: bloqueo del resto de la
// página, foco atrapado, cierre con la tecla de escape y el rol correcto para lectores de pantalla.
// La acción por defecto es cancelar: su botón recibe el foco al abrir.
export function confirmar(texto, { destructivo = true } = {}) {
  return new Promise((resolve) => {
    const origen = document.activeElement;
    const dialogo = el('dialog', { class: 'dialog' });
    const cancelar = button('Cancelar', null, () => dialogo.close('cancelar'));
    const aceptar = button(
      destructivo ? 'Eliminar' : 'Confirmar',
      destructivo ? 'danger' : 'primary',
      () => dialogo.close('aceptar'),
    );
    dialogo.append(
      el('p', { class: 'dialog__texto' }, texto),
      el('div', { class: 'dialog__acciones' }, cancelar, aceptar),
    );
    dialogo.addEventListener('close', () => {
      const aceptado = dialogo.returnValue === 'aceptar';
      dialogo.remove();
      if (origen instanceof HTMLElement && origen.isConnected) origen.focus();
      resolve(aceptado);
    });
    document.body.append(dialogo);
    dialogo.showModal();
    cancelar.focus();
  });
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
