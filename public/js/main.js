import { get } from './api.js';
import { aviso } from './ui.js';

const app = document.getElementById('app');

const routes = [
  { pattern: /^#\/inicio$/, nav: 'inicio', screen: () => import('./screens/home.js') },
  { pattern: /^#\/cotizaciones$/, nav: 'cotizaciones', screen: () => import('./screens/quotes.js') },
  { pattern: /^#\/cotizacion\/nueva$/, nav: 'cotizaciones', screen: () => import('./screens/quote-editor.js') },
  { pattern: /^#\/cotizacion\/(\d+)\/editar$/, nav: 'cotizaciones', edit: true, screen: () => import('./screens/quote-editor.js') },
  { pattern: /^#\/cotizacion\/(\d+)$/, nav: 'cotizaciones', screen: () => import('./screens/quote-editor.js') },
  { pattern: /^#\/clientes$/, nav: 'clientes', screen: () => import('./screens/clients.js') },
  { pattern: /^#\/servicios$/, nav: 'servicios', screen: () => import('./screens/services.js') },
  { pattern: /^#\/perfil$/, nav: 'perfil', screen: () => import('./screens/profile.js') },
];

let renderToken = 0;

async function navigate() {
  const token = ++renderToken;
  const hash = location.hash || '#/inicio';
  const route = routes.find((r) => r.pattern.test(hash));
  if (!route) { location.hash = '#/cotizaciones'; return; }

  aviso('');
  try {
    if (route.nav !== 'perfil') {
      const profile = await get('/profile');
      if (!profile) {
        location.hash = '#/perfil';
        aviso('Primero captura tu perfil para poder cotizar.');
        return;
      }
    }
    const mod = await route.screen();
    if (token !== renderToken) return;
    const match = route.pattern.exec(hash);
    document.querySelectorAll('#nav a').forEach((a) => {
      if (a.dataset.route === route.nav) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    app.replaceChildren();
    await mod.render(app, { id: match[1] ? Number(match[1]) : null, edit: Boolean(route.edit) });
  } catch (err) {
    if (token === renderToken) aviso(err.message);
  }
}

window.addEventListener('hashchange', navigate);
navigate();
