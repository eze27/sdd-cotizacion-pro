# CotizacionesPro

Aplicación web de un solo usuario para que freelancers mexicanos generen cotizaciones en PDF (IVA, retenciones de ISR/IVA, MXN).

## Stack y decisiones vigentes
- Node.js ≥ 22, Express 5 y SQLite (`better-sqlite3`, archivo `data/cotizaciones.db`, fuera de git). Variables de entorno: `PORT`, `DB_PATH`.
- Frontend sin framework ni compilación: HTML, CSS y JS (módulos ES) en `public/`, navegación por `#/ruta`. jsPDF va como archivo local en `public/vendor/`.
- El PDF se genera en el navegador (`public/js/pdf.js`). Lee los colores de los tokens de `public/css/styles.css`.
- Dinero en centavos enteros y cantidades en centésimas. `public/js/calc.js` es la única copia de las reglas de cálculo y la usan el servidor y las pantallas.
- Fechas y folios con hora de la Ciudad de México. Sin cuentas ni contraseña, por decisión del dueño.
- Tema único en `:root` de `styles.css`: colores, tipografía y espaciado. Sin valores sueltos en los componentes.

## Local
- `npm install`, `npm start` y abrir http://localhost:3000.
- `npm test` ejecuta `node --test`, sin paquetes extra: cálculo y API contra base en memoria, más `summary.js`.
- Verificación visual y de PDF a mano con `specs/<feature>/quickstart.md`.

## Convenciones
- Todo texto de producto en español de México; importes con formato `$20,000.00`.
- Se inserta texto con `textContent` (la ayuda `el()` de `ui.js`), nunca `innerHTML` con datos.
- Pantallas con los componentes de `ui.js` (`button`, `field`, `statusTag`, `dataList`, `pageHeader`) y las clases de `styles.css` (`.btn--*`, `.card`, `.tag--*`).
- Mobile-first: usable a 360 px sin desplazamiento horizontal.
- No tocar `server/`, `calc.js` ni el esquema de datos en cambios solo visuales.
- Trabajo con spec-kit: spec → plan → tasks → implement; nada fuera de la spec. Los artefactos viven en `specs/NNN-nombre/`.

Las reglas de producto viven en .specify/memory/constitution.md y el estado del producto en specs/README.md
## Spec-kit

* Antes de ejecutar el flujo de `/speckit.specify`, SIEMPRE ejecuta primero el hook `before_specify` (skill `speckit-git-feature`) para crear la rama de la feature, y espera su resultado antes de crear la spec.
* Tras completar `/speckit.specify`, verifica con `git branch --show-current` que estamos en la rama `NNN-nombre-feature` y no en `master`. Si no es así, avísame antes de continuar.
