# Contrato: sistema visual «Despacho»

Revisión 2, 2026-10-22. **Reemplaza por completo** al contrato de la revisión 1 (consultable en `main`).

Único lugar de definición: el bloque `:root` al inicio de `public/css/styles.css`. Ningún componente
usa valores de color, tamaño, espacio, forma, elevación ni duración sueltos. `public/js/pdf.js` lee los
colores de aquí con `getComputedStyle`; no duplica ningún código de color.

Los valores vienen de `specs/pre-specs/direccion-visual-despacho.md` §4, con dos correcciones acordadas:
la familia de ancho fijo no entra (aclaración de 2026-10-22) y se añade `--color-border-control`
(investigación §1, por contraste).

## Tokens de color

Contraste verificado; las relaciones están en `research.md` §1.

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-ground` | `#FBFAF8` | Fondo de la página (crema cálido) |
| `--color-surface` | `#FFFFFF` | Tarjetas, campos, barra superior |
| `--color-surface-raised` | `#F6F3EE` | Encabezado de tabla, panel de totales, superficie secundaria |
| `--color-border` | `#E7E3DC` | Separadores y filo de tarjeta. **No** para bordes de control |
| `--color-border-strong` | `#D6D0C6` | Separador de sección, regla bajo un título |
| `--color-border-control` | `#8C8373` | Borde de campo, desplegable, área de texto y botón neutro (3:1) |
| `--color-text` | `#111827` | Texto principal (tinta) |
| `--color-text-muted` | `#6B6760` | Texto secundario (gris cálido) |
| `--color-primary` | `#11523F` | Acción principal, elemento de navegación activo, total |
| `--color-primary-hover` | `#0C3F31` | Apuntado y pulsado del primario |
| `--color-primary-contrast` | `#FFFFFF` | Texto sobre primario |
| `--color-accent` | `#A8613A` | Cobre: vencimiento y dato que requiere atención. **Nunca pulsable**, nunca en texto pequeño |
| `--color-danger` | `#9B2C1F` | Acciones destructivas, errores y borde de campo inválido |

### Etiquetas de estado

| Token | Valor | Uso |
|-------|-------|-----|
| `--tag-success-bg` / `-fg` | `#E4EDE7` / `#1F5134` | **Vigente** (en la revisión 1 era `info`) |
| `--tag-warn-bg` / `-fg` | `#F6E9DC` / `#8A4A22` | **Vencida** |
| `--tag-info-bg` / `-fg` | `#EAEEF2` / `#33485C` | Reservado: Enviado |
| `--tag-danger-bg` / `-fg` | `#F7E5E2` / `#8A2318` | Reservado: Rechazado |
| `--tag-help-bg` / `-fg` | `#EFEAE2` / `#6B5B43` | Reservado: Aceptado |
| `--tag-neutral-bg` / `-fg` | `#F1EFEA` / `#4A4640` | Reservado: Borrador |

Los cuatro reservados quedan definidos y sin uso, igual que en la revisión 1 (FR-014).

### Reglas de color

- Contraste mínimo: 4.5:1 en todo texto, etiquetas incluidas; 3:1 en borde de control y anillo de foco.
- Ningún estado se comunica solo con color: la etiqueta lleva su texto, el error lleva su mensaje.
- Sin degradados, sin ilustraciones, sin sombras de color.
- Ningún color de la revisión 1 permanece: `#1d4ed8`, `#1e40af`, `#dbeafe`, `#e2e8f0`, `#f8fafc`,
  `#0f172a`, `#475569`, `#b91c1c` y los seis pares de etiqueta anteriores desaparecen del archivo.

## Tipografía

**Dos familias**, en `woff2` dentro de `public/fonts/`, declaradas con `@font-face` y `font-display: swap`.
Sin CDN, sin compilación, sin recorte de subconjuntos.

| Token | Valor |
|-------|-------|
| `--font-serif` | `"Source Serif 4", Georgia, "Times New Roman", serif` |
| `--font-sans` | `Inter, system-ui, -apple-system, "Segoe UI", sans-serif` |

Reparto:

- **Serif**: `h1`, `h2`, `h3`, el folio de la cotización y el importe total.
- **Sans**: todo lo demás, incluidos los importes de tabla, que llevan
  `font-variant-numeric: tabular-nums` para que los dígitos queden en columna.

### Escala

| Token | Valor | Uso |
|-------|-------|-----|
| `--text-xs` | `12px` | Navegación en celular, pie de tabla |
| `--text-sm` | `14px` | Etiqueta de campo, ayuda, error, encabezado de tabla |
| `--text-md` | `16px` | Cuerpo |
| `--text-lg` | `18px` | Título de tarjeta, subtítulo, marca |
| `--text-xl` | `22px` | `h2` de sección |
| `--text-2xl` | `28px` | `h1` de página |
| `--text-3xl` | `36px` | Cifra del resumen de Inicio, total de la cotización |

Pesos: `400`, `500`, `600`, `700` (este último solo para `h1` serif).
Interlineado: `--leading-text: 1.55`, `--leading-title: 1.2`.
Tracking: `--tracking-tight: -0.011em` en títulos serif; `--tracking-eyebrow: 0.08em` con mayúsculas
en encabezados de tabla.

La marca `.brand` baja a `--text-lg` en sans; el `h1` sube a `--text-2xl` en serif 700. Es lo que hace
verificable el criterio «el título manda sobre la marca» (SC-011).

## Espaciado y medida

Escala base 4 px, sin cambios: `--space-1 … --space-8` = 4, 8, 12, 16, 24, 32, 48, 64 px.
`--space-7` y `--space-8` pasan a tener uso obligatorio: son la separación **entre secciones** de una
página, que debe ser al menos el doble de la separación entre un título y su contenido (SC-025).

| Token | Valor | Uso |
|-------|-------|-----|
| `--page-max` | `1200px` | Ancho máximo de `main` (antes 960 px) |
| `--gutter` | `16px` → `24px` → `40px` | Margen lateral de `main` por tramo |
| `--measure` | `68ch` | Ancho máximo de un bloque de texto corrido |
| `--card-pad` | `20px` → `24px` | Relleno de tarjeta por tramo (antes 16 px fijo) |

## Forma, elevación y densidad

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | `4px` | Etiquetas de estado |
| `--radius` | `6px` | Botones, campos |
| `--radius-lg` | `10px` | Tarjetas, panel de totales, confirmación |
| `--shadow-sm` | `0 1px 2px rgba(17,24,39,.05)` | Tarjeta en reposo |
| `--shadow-md` | `0 2px 8px rgba(17,24,39,.07)` | Tarjeta pulsable apuntada, panel de totales fijo |
| `--shadow-lg` | `0 12px 32px rgba(17,24,39,.12)` | Confirmación |
| `--control-h` | `44px` | Altura de control por debajo de 1024 px |
| `--control-h-compact` | `36px` | Altura de control desde 1024 px |
| `--row-h-compact` | `40px` | Alto objetivo de fila de tabla en escritorio |
| `--nav-h` | `48px` → `56px` | Barra inferior en celular / barra superior en escritorio |

### Tramos

| Tramo | Qué introduce |
|-------|---------------|
| Base, desde 360 px | Alturas de 44 px, navegación inferior fija, listas apiladas, margen 16 px |
| Desde 768 px | Navegación arriba, listas en filas con encabezado, margen 24 px. **Las alturas no bajan** |
| Desde 1024 px | Densidad de escritorio: control 36 px, fila 40 px, margen 40 px, ancho máximo 1200 px |
| Desde 1280 px | La rejilla de accesos de Inicio pasa de 2 a 4 columnas |

## Movimiento

| Token | Valor |
|-------|-------|
| `--transition` | `140ms` |
| `--ease` | `cubic-bezier(.2,.6,.3,1)` |

Las transiciones cubren solo `background`, `border-color`, `color` y `box-shadow`; nunca
`transform`. No hay una segunda duración: animar la entrada del diálogo está fuera de alcance, así
que un token de transición lenta sería complejidad anticipada (Principio I). Todo queda neutralizado bajo `prefers-reduced-motion: reduce`. Ningún estado se entiende
solo por movimiento.

## Componentes

| Componente | Clases | Reglas |
|------------|--------|--------|
| Botón | `.btn` + `--primary`, `--secondary`, `--danger`, `--text` | Cinco estados (ver abajo). Altura por tramo. El neutro usa `--color-border-control` |
| Campo | `.field` (etiqueta, control, `.field__hint`, `.field__error`) | Etiqueta siempre visible y arriba. Inválido: `aria-invalid`, borde `--color-danger` y mensaje enlazado con `aria-describedby` |
| Tarjeta | `.card` (+ `.card__title`) | Superficie, filo `--color-border`, `--radius-lg`, relleno `--card-pad`, `--shadow-sm`. Si es pulsable, `--shadow-md` al apuntarla |
| Lista de datos | `.data-list` | Apilada en celular; filas con encabezado desde 768 px; densidad desde 1024 px. Importes a la derecha con cifras tabulares |
| Etiqueta de estado | `.tag` + las seis variantes | Siempre con texto. `--radius-sm` |
| Encabezado de página | `.page-header` | `h1` serif `--text-2xl` y acción principal; los botones no cambian de ancho durante una acción |
| Aviso | `.aviso` (+ `--ok`) | Cerrable. Error: permanece. Éxito: desaparece en 4 s |
| Panel de totales | `.totals` | Superficie elevada, `--shadow-md` cuando está fijo; el total en serif `--text-3xl` y `--color-primary` |
| **Confirmación** | `.dialog` | **Nuevo.** Sobre el elemento `<dialog>` nativo con `showModal()`. Ver abajo |
| **Bloque de carga** | `.skeleton` | **Nuevo.** Rectángulo neutro, sin animación, con el tamaño del dato final |

### Los cinco estados

Todo elemento interactivo define: **reposo**, **apuntado** (`:hover`), **pulsado** (`:active`),
**enfocado** (`:focus-visible`) y **deshabilitado** (`:disabled`).

- El pulsado se dibuja con fondo y borde, nunca con desplazamiento ni escala, para que funcione en
  táctil sin apagarse con movimiento reducido.
- El foco es un anillo de 2 px en `--color-primary` con separación de 2 px; nunca se elimina sin
  sustituto al menos igual de claro.
- El deshabilitado usa fondo `--color-ground` y texto `--color-text-muted`, y se distingue del reposo.

### El componente de confirmación

Vive en `ui.js` y sustituye a `confirmar()`. Devuelve una promesa que resuelve a booleano.

- Se abre con `showModal()`, de modo que el navegador aporta: bloqueo del resto de la página, foco
  atrapado, cierre con la tecla de escape y rol correcto para tecnologías de asistencia.
- Al cerrarse devuelve el foco al elemento que lo abrió.
- Dos botones: cancelar (neutro, **recibe el foco al abrir**, es la acción por defecto) y confirmar
  (`--danger` cuando la acción es destructiva).
- El fondo del diálogo usa el pseudo-elemento de fondo, con el mismo crema atenuado.
- El texto de la pregunta es el que ya usa cada pantalla; esta spec no reescribe textos.

## Reglas de uso

- Una sola acción principal por pantalla.
- Importes con el formato `$20,000.00`, alineados a la derecha en tablas, con cifras tabulares.
- Texto siempre con `textContent` (la ayuda `el()`); nunca `innerHTML` con datos.
- `statusTag()` sigue siendo el único lugar que decide el texto y la variante del estado.
- Sin iconos, sin ilustraciones, sin menús de desbordamiento (fuera de alcance).
