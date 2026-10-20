import { get } from '../api.js';
import { el, linkButton, pageHeader } from '../ui.js';
import { summarizeQuotes } from '../summary.js';

const ACCESS = [
  { href: '#/cotizaciones', title: 'Cotizaciones', text: 'Consulta, edita y descarga tus cotizaciones.' },
  { href: '#/clientes', title: 'Clientes', text: 'Administra los clientes a quienes cotizas.' },
  { href: '#/servicios', title: 'Servicios', text: 'Guarda tus servicios con su precio por defecto.' },
  { href: '#/perfil', title: 'Perfil', text: 'Actualiza tus datos fiscales y tu logo.' },
];

function countText(n) {
  return `${n} ${n === 1 ? 'cotización' : 'cotizaciones'}`;
}

export async function render(container) {
  const profile = await get('/profile');

  const vigentes = el('span', { class: 'tag tag--info summary__value' }, 'Cargando…');
  const vencidas = el('span', { class: 'tag tag--warn summary__value' }, 'Cargando…');
  const total = el('p', { class: 'muted' });
  const message = el('p', { class: 'empty' });

  container.append(
    pageHeader('Inicio', linkButton('Nueva cotización', 'primary', '#/cotizacion/nueva')),
    profile ? el('p', { class: 'muted' }, `Hola, ${profile.name}.`) : null,
    el('div', { class: 'summary-grid' },
      el('div', { class: 'card' }, el('h2', { class: 'card__title' }, 'Vigentes'), vigentes),
      el('div', { class: 'card' }, el('h2', { class: 'card__title' }, 'Vencidas'), vencidas),
    ),
    total,
    message,
    el('h2', {}, 'Accesos'),
    el('div', { class: 'access-grid' },
      ACCESS.map((a) => el('a', { class: 'card', href: a.href },
        el('h3', { class: 'card__title' }, a.title),
        el('span', { class: 'muted' }, a.text)))),
  );

  try {
    const summary = summarizeQuotes(await get('/quotes'));
    vigentes.textContent = String(summary.vigentes);
    vencidas.textContent = String(summary.vencidas);
    total.textContent = `Total: ${countText(summary.total)}`;
    if (summary.total === 0) message.textContent = 'Aún no tienes cotizaciones. Crea la primera.';
  } catch {
    vigentes.textContent = '–';
    vencidas.textContent = '–';
    message.textContent = 'No se pudo cargar el resumen. Intenta de nuevo.';
    message.setAttribute('role', 'alert');
  }
}
