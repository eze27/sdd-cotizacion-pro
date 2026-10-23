# Pre-especificación: dirección visual «Despacho»

Documento de entrada para `/speckit.specify`. **No es una spec**: no tiene requisitos numerados
ni plan. Describe la intención, la dirección elegida y los límites, para que la spec se escriba
sobre una decisión ya tomada y no sobre un gusto por descubrir.

- **Fecha**: 2026-10-21
- **Decide**: Ezequiel Hernandez (dueño del producto)
- **Spec que se propone**: `004-direccion-visual-despacho`
- **Reemplaza a**: el sistema visual de la spec 002 (`specs/002-rediseno-inicio/contracts/design-system.md`)
- **Constitución aplicable**: 1.0.2

---

## 1. Objetivo

Sustituir el sistema visual actual —paleta y tipografía por defecto de framework, sin carácter
propio— por una identidad deliberada llamada **Despacho**, que haga que tanto la aplicación como
el PDF que recibe el cliente se lean como el trabajo de un profesional establecido.

El objetivo no es «modernizar» por estética. Es que el documento que el freelance manda a cobrar
**genere confianza al abrirlo**: que un cliente persona moral que lo archiva junto a sus facturas
lo reciba como un presupuesto formal y no como la exportación de una herramienta genérica.

Tres resultados concretos que se buscan:

1. **Identidad propia y única.** Un juego de tokens con tipografía elegida, acento propio y
   jerarquía real, definido en un solo lugar de `styles.css`.
2. **Coherencia pantalla ↔ PDF.** El PDF sigue leyendo su identidad del mismo sitio que la
   aplicación; quien ve la pantalla reconoce el documento, y al revés.
3. **Cierre de los huecos detectados.** Estados que hoy no existen (pulsado, carga, campo
   inválido), densidad adecuada en escritorio y separación de secciones a nivel de página.

Lo que **no** cambia: ningún cálculo, ningún importe, ningún contenido del PDF, ninguna ruta,
ningún endpoint, ningún dato almacenado. Es un cambio de presentación.

## 2. Usuarios

### 2.1 Usuario de la aplicación (uno solo)

Freelance mexicano, persona física, régimen de Actividades Empresariales y Profesionales o
RESICO. Factura por servicios profesionales. Usa la aplicación él mismo, sin cuenta ni
contraseña, varias veces por semana, para capturar y mandar cotizaciones.

Características que condicionan el diseño:

- **Trabaja a dos anchos.** Captura y revisa en escritorio (monitor de 1440 px o portátil de
  1280 px); consulta y descarga en el celular (360–430 px).
- **Es el mismo cada vez.** No necesita que la interfaz le explique el producto; necesita que los
  datos que ya conoce aparezcan rápido y bien ordenados. Prefiere densidad a decoración.
- **Lee números.** Importes, folios, fechas, retenciones. La legibilidad de las cifras es
  funcional, no estética.
- **No es técnico** para verificar el resultado (Principio IV): toda comprobación se hace
  abriendo la aplicación y mirando el PDF.

### 2.2 Destinatario del PDF (no usa la aplicación, pero es a quien hay que convencer)

Quien recibe la cotización por correo: un cliente persona moral (despacho, agencia, empresa
pequeña) o persona física con actividad empresarial. **No entra nunca a la aplicación.** Su única
experiencia del producto es un archivo PDF, muchas veces:

- abierto en el visor del móvil o en el de Chrome, no en un visor profesional;
- **impreso en una láser monocromática de oficina**, para archivarlo con las facturas;
- comparado contra la cotización de otro proveedor, lado a lado.

Es el usuario decisivo de esta spec. La dirección visual se elige por él.

## 3. Dirección visual elegida: «Despacho»

**Referencias de producto:** Stripe Invoicing (documentos fiscales sobrios y densos, cifras
tabulares, cero decoración) y Mercury (solvencia sin corporativismo, verde profundo, mucho aire
controlado).

**Idea central:** papel caro antes que pantalla brillante. Fondo crema en lugar de gris azulado,
tinta casi negra, serif con autoridad para los títulos y los folios, sans neutro para la
interfaz, monoespaciada tabular para los importes. El acento es un **verde profundo** que da
solvencia sin parecer banco, con un **cobre** reservado para avisos y vencimientos.

**Qué transmite al cliente que recibe el presupuesto:** «esto lo manda alguien que lleva años
facturando». El serif y el papel crema remiten a despacho contable, no a startup. Es la dirección
que mejor sostiene la conversación con un cliente que pide factura y revisa retenciones, y la
única de las tres evaluadas que se imprime impecable en blanco y negro: la jerarquía no depende
del color, sino del tamaño, el peso y las reglas horizontales.

**Qué se descartó y por qué.** «Taller» (oscuro, violeta eléctrico, Geist) le queda mejor a la
aplicación pero peor al PDF: el violeta se imprime morado sucio y un cliente conservador lo lee
como poco formal. «Cal y Barro» (terracota, Fraunces) tiene más personalidad pero es la más
frágil de ejecutar y arriesga parecer plantilla de evento. **Decisión tomada: Despacho, en
pantalla y en PDF, con un solo juego de tokens.** Se descarta explícitamente mantener dos
identidades (una para la app, otra para el documento) por el Principio I.

### 3.1 Riesgo asumido

Si el dueño del producto cambia de perfil (de servicios profesionales a trabajo creativo), esta
dirección puede sentirse disfrazada. Se asume: hoy el producto es cotizaciones con IVA y
retenciones de ISR, y la credibilidad vale más que la personalidad.

## 4. Reglas de diseño (tokens)

Mismo contrato estructural que hoy: **un solo lugar de definición**, la sección `:root` al inicio
de `public/css/styles.css`; ningún componente usa valores sueltos de color, tamaño, espacio o
sombra; `public/js/pdf.js` sigue leyendo los colores de ahí con `getComputedStyle`.

### 4.1 Color

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-ground` | `#FBFAF8` | Fondo de página (crema, no gris azulado) |
| `--color-surface` | `#FFFFFF` | Tarjetas, campos, barra superior |
| `--color-surface-raised` | `#F6F3EE` | **Nuevo.** Encabezado de tabla, celdas de totales, superficie secundaria |
| `--color-border` | `#E7E3DC` | Bordes y separadores normales |
| `--color-border-strong` | `#D6D0C6` | **Nuevo.** Separador de sección, regla bajo un título |
| `--color-text` | `#111827` | Texto principal (tinta) |
| `--color-text-muted` | `#6B6760` | Texto secundario (gris cálido, no slate) |
| `--color-primary` | `#11523F` | Acción principal, elemento de nav activo, total |
| `--color-primary-hover` | `#0C3F31` | Hover y `:active` del primario |
| `--color-primary-contrast` | `#FFFFFF` | Texto sobre primario |
| `--color-accent` | `#A8613A` | **Nuevo.** Cobre: vencimientos, dato que requiere atención |
| `--color-danger` | `#9B2C1F` | Acciones destructivas y errores (rojo cálido) |

Etiquetas de estado, en la misma familia tostada (los cuatro reservados se mantienen para los
estados futuros, igual que en la 002):

| Token | Valor | Uso |
|-------|-------|-----|
| `--tag-success-bg` / `-fg` | `#E4EDE7` / `#1F5134` | **Vigente** (cambia: hoy es `info`) |
| `--tag-warn-bg` / `-fg` | `#F6E9DC` / `#8A4A22` | **Vencida** |
| `--tag-info-bg` / `-fg` | `#EAEEF2` / `#33485C` | Reservado: Enviado |
| `--tag-danger-bg` / `-fg` | `#F7E5E2` / `#8A2318` | Reservado: Rechazado |
| `--tag-help-bg` / `-fg` | `#EFEAE2` / `#6B5B43` | Reservado: Aceptado |
| `--tag-neutral-bg` / `-fg` | `#F1EFEA` / `#4A4640` | Reservado: Borrador |

Reglas de color:

- Contraste mínimo 4.5:1 para todo texto y 3:1 para bordes de control y estados de foco.
- Ningún estado se comunica **solo** con color: la etiqueta siempre lleva su texto
  («Vigente» / «Vencida»), el error de campo siempre lleva su mensaje.
- Sin degradados, sin ilustraciones, sin sombras de color.
- `--color-accent` **no** se usa para acciones: es informativo, nunca pulsable.

### 4.2 Tipografía

Tres familias, servidas como archivos locales en `public/fonts/` (igual que jsPDF y JSZip viven
en `public/vendor/`): sin CDN, sin compilación, sin red externa.

| Token | Valor |
|-------|-------|
| `--font-serif` | `"Source Serif 4", Georgia, "Times New Roman", serif` |
| `--font-sans` | `Inter, system-ui, -apple-system, "Segoe UI", sans-serif` |
| `--font-mono` | `"IBM Plex Mono", ui-monospace, Consolas, monospace` |

**Por qué Source Serif 4 y no Instrument Serif:** es variable, tiene todos los pesos y cursivas
necesarios, licencia SIL OFL, y aguanta tamaños pequeños (el folio dentro de una fila de tabla),
donde un serif de display se rompe.

Reparto de familias:

- **Serif** (`--font-serif`): `h1`, `h2`, `h3`, el folio de la cotización, el importe total y los
  títulos del PDF. Es la voz del documento.
- **Sans** (`--font-sans`): todo el cuerpo, etiquetas, botones, navegación, ayudas y errores.
- **Mono** (`--font-mono`): importes, cantidades, porcentajes de retención y fechas en tabla,
  siempre con `font-variant-numeric: tabular-nums`.

Escala, con el hueco actual entre 20 y 28 px cerrado:

| Token | Valor | Uso |
|-------|-------|-----|
| `--text-xs` | `12px` | Eyebrow, pie de tabla |
| `--text-sm` | `14px` | Etiqueta de campo, ayuda, error, encabezado de tabla |
| `--text-md` | `16px` | Cuerpo |
| `--text-lg` | `18px` | **Nuevo.** Título de tarjeta, subtítulo |
| `--text-xl` | `22px` | `h2` de sección |
| `--text-2xl` | `28px` | `h1` de página |
| `--text-3xl` | `36px` | **Nuevo.** Cifra de resumen en Inicio, total de la cotización |

Pesos: `400`, `500` (**nuevo**, para encabezados de tabla y etiquetas), `600`, `700` (**nuevo**,
solo para `h1` serif). Interlineado: `1.55` texto, `1.2` títulos (**baja** de 1.25 para que el
serif grande no se separe). Tracking: `--tracking-tight: -0.011em` en títulos serif;
`--tracking-eyebrow: 0.08em` con mayúsculas para encabezados de tabla y eyebrows.

El `h1` sube de 20 a 28 px en serif 700, y la marca `.brand` deja de compartir tamaño con él.

### 4.3 Espaciado y medida

Se conserva la escala base 4 px (`--space-1 … --space-8` = 4, 8, 12, 16, 24, 32, 48, 64) y se
añade la obligación de usarla completa: **`--space-7` y `--space-8`, hoy declarados y sin un solo
uso, pasan a ser la separación entre secciones de una página.**

| Token | Valor | Uso |
|-------|-------|-----|
| `--page-max` | `1200px` | Ancho máximo de `main` (**sube** de 960 px) |
| `--gutter` | `16px` / `24px` / `40px` | Margen lateral de `main` por tramo (hoy es 16 px siempre) |
| `--measure` | `68ch` | Ancho máximo de un bloque de texto corrido |
| `--card-pad` | `20px` / `24px` | Relleno de tarjeta (hoy 16 px uniforme) |

### 4.4 Forma, elevación y densidad

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | `4px` | Etiquetas de estado, celdas |
| `--radius` | `6px` | Botones, campos |
| `--radius-lg` | `10px` | Tarjetas, panel de totales |
| `--shadow-sm` | `0 1px 2px rgba(17,24,39,.05)` | Tarjeta en reposo |
| `--shadow-md` | `0 2px 8px rgba(17,24,39,.07)` | Tarjeta pulsable en hover, panel sticky de totales |
| `--shadow-lg` | `0 12px 32px rgba(17,24,39,.12)` | Diálogo de confirmación |
| `--control-h` | `44px` | Altura táctil, por debajo de 1024 px |
| `--control-h-compact` | `36px` | **Nuevo.** Altura de control desde 1024 px |
| `--row-h-compact` | `40px` | **Nuevo.** Alto objetivo de fila de tabla en escritorio |
| `--nav-h` | `48px` / `56px` | Barra inferior en celular / barra superior en escritorio |

Densidad: tres tramos declarados (`768px`, `1024px`, `1280px`) en lugar del único de hoy. El
tramo de 1024 px es el que introduce la densidad de escritorio; el de 1280 px es el que permite
que la rejilla de accesos pase de 2 a 4 columnas.

### 4.5 Movimiento y estados

| Token | Valor |
|-------|-------|
| `--transition` | `140ms` |
| `--transition-slow` | `240ms` |
| `--ease` | `cubic-bezier(.2,.6,.3,1)` |

Todo elemento interactivo define **cinco** estados, no tres: reposo, `:hover`, `:active` (hoy
ausente), `:focus-visible` y `:disabled`. Los campos añaden además un estado inválido con borde
`--color-danger` y `aria-invalid`, no solo el mensaje de abajo. Todo queda neutralizado bajo
`prefers-reduced-motion: reduce`, como hoy.

### 4.6 El PDF

El PDF conserva **exactamente** su contenido, su orden, sus cálculos y sus importes. Cambia su
presentación, leyendo los nuevos tokens de color:

- Títulos y folio en **serif**, usando la fuente estándar `times` que jsPDF ya trae incorporada:
  no se incrusta ninguna tipografía, el archivo no engorda y no hace falta un blob en base64.
- Cuerpo y tabla en `helvetica`, como hoy.
- Verde profundo para el total y la regla del encabezado; cobre solo para la fecha de vigencia.
- Fondo blanco, nunca crema: el crema es de pantalla, el papel ya es papel.
- **Se verifica impreso en blanco y negro.** Si la jerarquía se pierde sin color, la propuesta no
  está terminada.

## 5. Criterios de aceptación verificables

Todos comprobables abriendo la aplicación y mirando el PDF, sin leer código (Principio IV). Para
los dos de contraste basta un medidor de contraste en línea con los códigos de la tabla de color.

**Identidad y tipografía**

1. En cualquier pantalla, el título de página se ve claramente más grande y con una tipografía
   distinta (con remates) que el texto de la marca «CotizacionesPro» de la barra superior.
2. El fondo de la página es crema cálido, no gris azulado: puesto al lado de una tarjeta blanca,
   se distingue.
3. En la lista de cotizaciones, los importes de la columna «Total» tienen todos sus dígitos
   alineados en columna vertical, incluidos los que llevan y no llevan coma de miles.

**Color y accesibilidad**

4. Ningún texto de la aplicación queda por debajo de 4.5:1 de contraste contra su fondo,
   etiquetas de estado incluidas.
5. No aparece ni un solo azul de framework (`#1d4ed8`, `#dbeafe`, `#e2e8f0`, `#f8fafc`) en
   ninguna pantalla ni en el PDF.
6. Con la pantalla en escala de grises (o impreso en blanco y negro), se sigue distinguiendo una
   cotización «Vigente» de una «Vencida» sin adivinar.

**Estados**

7. Al mantener pulsado cualquier botón, el botón cambia visiblemente antes de soltarlo.
8. Al recargar Inicio con la red lenta, en el lugar de cada cifra hay un bloque del mismo tamaño
   que la cifra final: al llegar el dato, nada salta ni se ensancha.
9. Si un campo obligatorio del editor se deja vacío y se intenta guardar, el borde del campo se
   pone rojo **y** aparece el mensaje debajo.
10. Al pulsar «Exportar todo (.zip)», el botón conserva su ancho mientras exporta: «Nueva
    cotización», a su lado, no se mueve ni un píxel.
11. Al eliminar una cotización, la confirmación se ve dentro de la aplicación y con su
    tipografía; no es el cuadro del navegador con la dirección `localhost:3000`.
12. Un mensaje de error permanece hasta que el usuario lo cierra o cambia de pantalla; un mensaje
    de éxito desaparece solo. Ambos se pueden cerrar.

**Densidad y disposición**

13. En un monitor de 1440 px, el contenido ocupa un ancho claramente mayor que hoy y los márgenes
    laterales son visiblemente más anchos que en el celular.
14. En un monitor de 1440 px, en la lista de cotizaciones caben al menos 14 filas sin desplazar.
15. En la lista de cotizaciones en celular (360 px), cada cotización muestra una acción principal
    visible y las demás agrupadas; no hay cuatro botones envueltos en tres renglones.
16. En el celular a 360 px no hay desplazamiento horizontal en ninguna pantalla, y los cinco
    destinos de la barra inferior se leen completos.
17. En Inicio, entre el bloque de cifras y el título «Accesos» hay una separación claramente
    mayor que la que hay entre «Accesos» y sus tarjetas.

**PDF**

18. Abierto el PDF de una cotización existente, todos los datos, conceptos, impuestos,
    retenciones y el total son idénticos a los del PDF de antes del cambio, cifra por cifra.
19. El PDF nuevo se ve de la misma familia visual que la pantalla: mismo verde, mismos títulos
    con remates.
20. Impreso en una láser en blanco y negro, el PDF mantiene legible la jerarquía: se identifica
    de un golpe el folio, el cliente, el total y la fecha de vigencia.
21. El PDF no pesa más de un 20 % de lo que pesaba antes del cambio.

## 6. Fuera de alcance

Explícitamente **no** entra en esta spec (Principio III: si se quiere, se propone aparte):

- **Modo oscuro.** Sigue fuera de alcance, como en la nota de `specs/README.md`.
- **Los estados Borrador, Enviado, Aceptado y Rechazado.** Sus tokens de etiqueta quedan
  definidos y reservados, como hoy; no se construye la funcionalidad.
- **Cualquier cambio de lógica**: `public/js/calc.js`, `server/`, el esquema de la base de datos,
  las rutas `#/...`, los endpoints de la API y el contenido del PDF no se tocan.
- **Importar o restaurar copias de seguridad**, exportar a Excel o CSV, copias automáticas,
  enviar el .zip por correo.
- **Cuentas, contraseña, multiusuario.** Decisión del dueño, sin cambio.
- **Framework, compilación, paso de build, gestor de paquetes en el frontend.** La aplicación
  sigue siendo HTML, CSS y módulos ES servidos tal cual.
- **Iconografía.** No se introduce un juego de iconos; la barra inferior sigue siendo de texto.
  Si al cerrar el criterio 16 hiciera falta, se propone como spec aparte.
- **Ilustraciones, degradados, animaciones de entrada, pantallas de bienvenida, onboarding.**
- **Plantillas de PDF alternativas** o que el usuario elija colores. Hay una identidad, la del
  producto.
- **Logo nuevo o rediseño de marca.** El logo que el usuario sube en Perfil se usa como está.
- **Reescritura de textos de producto.** Si un texto estorba a la jerarquía se anota como
  sugerencia; no se cambia la redacción en esta spec.

## 7. Invariantes: qué debe seguir siendo cierto al terminar

Lo que la spec no debe romper, y que conviene que la verificación compruebe aparte:

1. **Un solo lugar de definición.** Todos los colores, tamaños, espacios, radios y sombras viven
   en `:root` de `styles.css`. Ningún componente con un valor suelto.
2. **El PDF lee de ahí.** `pdf.js` sigue tomando los colores con `getComputedStyle`, sin duplicar
   códigos hexadecimales.
3. **`statusTag()` sigue siendo el único lugar** que decide el texto y la variante del estado de
   una cotización.
4. **Nada de `innerHTML` con datos.** Todo texto se inserta con `textContent` a través de `el()`.
5. **El foco visible nunca se elimina** sin un sustituto al menos igual de claro.
6. **Usable a 360 px sin desplazamiento horizontal.**
7. **Sin dependencias nuevas de red.** Las tipografías son archivos locales del repositorio,
   igual que jsPDF y JSZip.
8. **`npm test` sigue pasando sin cambios**: esta spec no toca lo que esas pruebas cubren.

## 8. Preguntas abiertas para `/speckit.clarify`

Puntos donde la pre-especificación deja una decisión al dueño; ninguno bloquea empezar:

1. **Diálogo de confirmación propio (criterio 11).** Sustituir `window.confirm` obliga a construir
   un componente de diálogo con foco atrapado y cierre con `Esc`. Es la pieza de más trabajo de
   toda la spec. ¿Entra, o se queda el diálogo nativo y se cae el criterio 11?
2. **Peso de las tipografías.** Tres familias locales son unos 300–450 KB de woff2. ¿Se acepta, o
   se reduce a dos familias (serif + sans) y los importes usan la sans con `tabular-nums`?
3. **Acción agrupada en celular (criterio 15).** Agrupar «Descargar PDF», «Editar» y «Eliminar»
   necesita un menú de desbordamiento, que hoy no existe como componente. ¿Menú, o basta con
   jerarquizar los cuatro botones (uno primario, tres de texto)?
4. **Barra inferior sin iconos (criterio 16).** Con cinco destinos de texto a 360 px el espacio es
   justo. ¿Se abrevia alguna etiqueta, se baja a cuatro destinos, o se acepta el texto a 12 px?
5. **Serif en el PDF.** `times` incorporada en jsPDF es la opción sin coste, pero no es Source
   Serif 4: el documento no usará exactamente la misma tipografía que la pantalla, solo la misma
   clase. ¿Se acepta el parecido, o se incrusta la tipografía y crece el PDF (criterio 21)?
