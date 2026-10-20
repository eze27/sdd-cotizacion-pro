# Research: Página de inicio y rediseño visual

No quedaban `NEEDS CLARIFICATION`. Decisiones tomadas tras revisar el código existente
(`public/index.html`, `css/styles.css`, `js/main.js`, `js/ui.js`, `js/pdf.js` y las pantallas).

## 0. Revisión de lo existente (se reutiliza)

- `ui.js` ya tiene `el()` (construye DOM con `textContent`), `aviso()`, `confirmar()` y las etiquetas
  de régimen y tipo de cliente: se amplía, no se reemplaza.
- `styles.css` ya es mobile-first con variables CSS; se reorganiza en tokens + componentes.
- `main.js` ya enruta por `#`, resalta la sección activa (`data-route`) y redirige al perfil si no
  existe: se conserva y solo cambia la ruta predeterminada.
- La lista `GET /api/quotes` ya entrega `expired` calculado en el servidor: suficiente para el resumen.
- Hoy el estado vencido se pinta con una clase `.etiqueta` suelta: pasa a ser el componente de etiqueta.

## 1. Página de inicio

- **Decision**: nueva ruta `#/inicio` y predeterminada (`/` sin `#`). `home.js` pide la lista de
  cotizaciones y muestra: bienvenida, dos tarjetas de resumen (vigentes, vencidas), acceso rápido a
  "Nueva cotización" y cuatro accesos a las secciones. Las rutas existentes no cambian.
- **Rationale**: la raíz ya sirve `index.html`; solo falta una pantalla y apuntar la ruta
  predeterminada. Sin cambios en servidor (FR-017).
- **Alternatives considered**: segunda página HTML en `/` (rompería la navegación única y duplicaría
  el armazón); endpoint de resumen (cambia la API, prohibido).

## 2. Resumen de actividad

- **Decision**: función pura `summarizeQuotes(list)` en `summary.js` →
  `{ vigentes, vencidas, total }` según el campo `expired`. Si la carga falla, se muestran los accesos
  y un aviso (FR-005).
- **Rationale**: usa la misma regla de vigencia que la lista (FR-003); es la única lógica nueva y se
  prueba con `node --test`.
- **Alternatives considered**: recalcular con `isExpired` en el navegador (duplicaría la regla).

## 3. Navegación común

- **Decision**: una sola barra definida en `index.html`: en celular, barra fija inferior con 5
  elementos (Inicio, Cotizaciones, Clientes, Servicios, Perfil) de al menos 48 px de alto; desde
  768 px, barra superior horizontal con la marca a la izquierda. La sección activa se marca con
  `aria-current="page"`. El editor de cotización cuenta como Cotizaciones. Las áreas con "sticky"
  (totales del editor) respetan la altura de la barra inferior.
- **Rationale**: 5 destinos caben en 360 px sin desplazamiento; el pulgar alcanza la parte inferior.
- **Alternatives considered**: menú hamburguesa (oculta destinos); barra superior con envoltura
  (ocupa mucha altura en celular).

## 4. Sistema visual (referencia: PrimeNG)

- **Decision**: lenguaje sobrio estilo "Aura" de PrimeNG: fondo gris muy claro, tarjetas blancas con
  borde fino, radio pequeño (6 px), sombras mínimas, un solo color de acento (azul), etiquetas de
  estado con fondo suave y texto oscuro, controles de 44–48 px de alto, foco visible en anillo.
  Detalle de valores en `contracts/design-system.md`.
- **Rationale**: PrimeNG solo se usa como referencia (FR-019); replicar sus proporciones y colores
  semánticos da el aspecto SaaS pedido sin dependencia ni compilación.
- **Alternatives considered**: instalar PrimeNG/PrimeVue (requiere framework y compilación,
  contradice el plan 001); copiar su CSS (licencia y peso innecesarios).

## 5. Un solo lugar para el tema

- **Decision**: tokens como variables CSS en `:root` al inicio de `styles.css` (colores, tipografía,
  espaciado, radio, sombras, alturas). Todos los componentes usan solo tokens, nunca valores sueltos.
  `pdf.js` lee los tokens de color con `getComputedStyle` al generar el PDF.
- **Rationale**: cumple FR-010 y SC-010: cambiar un token cambia pantallas y PDF.
- **Alternatives considered**: módulo JS con la paleta que escribe las variables CSS (dos pasos y
  parpadeo al cargar); duplicar hex en `pdf.js` (se desalinea).

## 6. Tipografía

- **Decision**: pila del sistema (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`),
  escala fija de 5 tamaños (12, 14, 16, 20, 28 px) y 2 pesos (400 y 600).
- **Rationale**: sin descargas, sin dependencia externa en producción; consistente en todas las pantallas.
- **Alternatives considered**: Inter/otra fuente descargada (peso y archivos; se puede añadir después
  cambiando un token).

## 7. Componentes reutilizables

- **Decision**: clases CSS: `.btn` (`--primary`, `--secondary`, `--danger`, `--text`), `.field`
  (etiqueta, control, ayuda y error), `.card`, `.data-list` (lista que se apila en celular y se
  muestra como tabla desde 768 px), `.tag` (`--info`, `--success`, `--warn`, `--danger`, `--help`,
  `--neutral`) y `.page-header`. Ayudas en `ui.js`: `button()`, `statusTag(expired)`, `field()`.
  Las pantallas dejan de usar clases propias sueltas.
- **Rationale**: FR-011; un cambio en un componente aplica a todas las pantallas.
- **Alternatives considered**: web components (más complejidad sin necesidad).

## 8. Etiquetas de estado

- **Decision**: Vigente → `info` (azul suave); Vencida → `warn` (ámbar suave). Texto siempre visible
  (no solo color). Colores reservados, sin conectar a datos ni mostrar: Borrador → `neutral`,
  Enviado → `help` (violeta), Aceptado → `success`, Rechazado → `danger`.
- **Rationale**: FR-012; los seis colores distinguibles evitan choques cuando una spec futura añada
  los otros estados. "Vencida" conserva el término de la spec 001 (no "Caducado").
- **Alternatives considered**: Vigente en verde (chocaría con Aceptado en el futuro).

## 9. Contraste y accesibilidad

- **Decision**: todos los pares texto/fondo ≥ 4.5:1 (verificados: entre 6.1:1 y 17.1:1); foco visible
  con anillo; controles táctiles ≥ 44 px; respetar `prefers-reduced-motion` (sin animaciones
  necesarias).
- **Rationale**: SC-008, FR-007, FR-013.

## 10. PDF

- **Decision**: mismo contenido y orden (`001/contracts/pdf-cotizacion.md`); nueva presentación: franja
  de acento en la parte superior, título y folio con jerarquía clara, bloques "De" y "Para" en dos
  columnas, tabla con encabezado sombreado y líneas finas, desglose alineado a la derecha y total en
  una caja de color destacado. Fuente Helvetica de jsPDF; colores desde los tokens. Detalle en
  `contracts/pdf-visual.md`.
- **Rationale**: FR-015/016; Helvetica garantiza acentos y ñ ya verificados.
- **Alternatives considered**: incrustar una fuente TTF (peso, riesgo de codificación); PDF desde HTML
  del navegador (resultado variable en celular, ya descartado en 001).

## 11. Pruebas

- **Decision**: `tests/summary.test.js` para el conteo. Las pruebas existentes no se editan. El resto
  se valida con `quickstart.md`, incluyendo una comprobación de que no hay cambios en `server/` ni
  `calc.js` (SC-006/007).
- **Alternatives considered**: pruebas automáticas de interfaz (infraestructura extra, igual que en 001).
