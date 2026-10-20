import { get, put } from '../api.js';
import { el, aviso, REGIMES, button, field, formError, pageHeader } from '../ui.js';
import { isValidRfc, normalizeRfc } from '../calc.js';
import { processLogo } from '../logo.js';

export async function render(container) {
  const profile = (await get('/profile')) ?? { name: '', rfc: '', regime: '', contact: '', logo: null };
  let logo = profile.logo;

  const name = el('input', { id: 'p-name', type: 'text', value: profile.name, autocomplete: 'name' });
  const rfc = el('input', { id: 'p-rfc', type: 'text', value: profile.rfc, autocapitalize: 'characters', maxlength: 13 });
  const regime = el('select', { id: 'p-regime' },
    el('option', { value: '' }, 'Elige tu régimen'),
    Object.entries(REGIMES).map(([v, t]) => el('option', { value: v }, t)));
  regime.value = profile.regime || '';
  const contact = el('textarea', { id: 'p-contact' });
  contact.value = profile.contact ?? '';
  const error = formError();
  const preview = el('div');
  const file = el('input', { id: 'p-logo', type: 'file', accept: 'image/png,image/jpeg' });

  function drawPreview() {
    preview.replaceChildren();
    if (!logo) return;
    preview.append(
      el('img', { class: 'logo-preview', src: logo, alt: 'Vista previa del logo' }),
      button('Quitar logo', 'danger', () => { logo = null; file.value = ''; drawPreview(); }),
    );
  }
  drawPreview();

  file.addEventListener('change', async () => {
    error.textContent = '';
    if (!file.files[0]) return;
    try {
      logo = await processLogo(file.files[0]);
      drawPreview();
    } catch (err) {
      file.value = '';
      error.textContent = err.message;
    }
  });

  async function save(e) {
    e.preventDefault();
    error.textContent = '';
    if (!name.value.trim()) { error.textContent = 'Escribe tu nombre.'; return; }
    if (!rfc.value.trim()) { error.textContent = 'Escribe tu RFC.'; return; }
    if (!isValidRfc(rfc.value)) { error.textContent = 'El RFC no tiene un formato válido.'; return; }
    if (!regime.value) { error.textContent = 'Elige tu régimen fiscal.'; return; }
    try {
      await put('/profile', {
        name: name.value.trim(), rfc: normalizeRfc(rfc.value), regime: regime.value,
        contact: contact.value.trim(), logo,
      });
      rfc.value = normalizeRfc(rfc.value);
      aviso('Perfil guardado', 'ok');
    } catch (err) {
      error.textContent = err.message;
    }
  }

  container.append(
    pageHeader('Mi perfil'),
    el('form', { class: 'card', onsubmit: save },
      field('Nombre o razón social', name),
      field('RFC', rfc),
      field('Régimen fiscal', regime),
      field('Datos de contacto (opcional)', contact),
      field('Logo (opcional, PNG o JPG hasta 2 MB)', file),
      preview,
      error,
      el('div', { class: 'actions' }, el('button', { class: 'btn btn--primary', type: 'submit' }, 'Guardar perfil')),
    ),
  );
}
