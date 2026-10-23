---

description: "Task list for feature implementation"
---

# Tasks: Página de inicio y dirección visual «Despacho»

**Input**: Design documents from `/specs/002-rediseno-inicio/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md) (revisión 2), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/)

**Revisión 2, 2026-10-22**: esta lista **reemplaza** la de la revisión 1 (consultable en `main`), cuyas 35 tareas ya se implementaron. Aquí solo está el trabajo de la dirección visual «Despacho».

**Tests**: no se generan tareas de prueba automatizada. La spec no las pide y `npm test` cubre cálculo, API y `summary.js`, que esta feature no toca: se ejecuta como comprobación de no-regresión (T069), no de la feature. La verificación propia es manual, con [quickstart.md](quickstart.md).

**Organization**: agrupadas por historia de usuario. Dentro de la prioridad P1, el orden de las fases sigue la dependencia técnica: US3 (identidad) habilita a US4, US2 y US1, porque todas heredan los tokens.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede ir en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: a qué historia pertenece (US1…US6)
- Cada tarea lleva su ruta exacta

## Path Conventions

Aplicación web sin framework ni compilación. Todo el trabajo vive en `public/`:

- Tema y componentes: `public/css/styles.css`
- Ayudas y componentes de interfaz: `public/js/ui.js`
- Plantilla del PDF: `public/js/pdf.js`
- Pantallas: `public/js/screens/*.js`
- Tipografías: `public/fonts/` (nuevo)

**Prohibido tocar**: `public/js/calc.js`, `server/`, `test/`, el esquema de datos.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: capturar la referencia antes de cambiar nada y dejar las tipografías servidas desde el producto.

- [ ] T001 Descargar los PDF de las 3 cotizaciones de ejemplo de la spec 001 (persona moral ISR 10 %, persona moral ISR 1.25 %, persona física) con el código **sin modificar**, guardarlos como referencia fuera del repositorio y anotar el tamaño en bytes de cada uno al final de `specs/002-rediseno-inicio/baseline-pdf-text.txt`
- [ ] T002 Regenerar `specs/002-rediseno-inicio/baseline-hashes.txt` y `specs/002-rediseno-inicio/baseline-pdf-text.txt` con el código sin modificar, siguiendo el procedimiento de la revisión 1
- [X] T003 [P] Crear `public/fonts/` y colocar los archivos `woff2` de Source Serif 4 (variable, SIL OFL) e Inter (variable, SIL OFL), más el archivo de licencia de cada una
- [X] T004 Declarar las dos familias con `@font-face` y `font-display: swap` al inicio de `public/css/styles.css`, apuntando a `public/fonts/`

> **⚠️ T001 y T002 son bloqueantes y no se pueden recuperar después.** Si se modifica el código antes, SC-027 (contenido idéntico cifra por cifra) y SC-031 (el PDF no crece más de un 20 %) quedan sin base de comparación. Ver `research.md` §11.

**Checkpoint**: referencia capturada y tipografías disponibles.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: sustituir el bloque de tokens, que es el único lugar de definición del tema. Todo lo demás hereda de aquí.

**⚠️ CRITICAL**: ninguna historia puede empezar hasta que esta fase esté completa. Todas las tareas tocan `public/css/styles.css`, así que **ninguna es paralelizable entre sí**.

- [X] T005 Reemplazar los tokens de color de `:root` en `public/css/styles.css` por los 13 de `contracts/design-system.md`: `--color-ground: #FBFAF8`, `--color-surface: #FFFFFF`, `--color-surface-raised: #F6F3EE`, `--color-border: #E7E3DC`, `--color-border-strong: #D6D0C6`, `--color-border-control: #8C8373`, `--color-text: #111827`, `--color-text-muted: #6B6760`, `--color-primary: #11523F`, `--color-primary-hover: #0C3F31`, `--color-primary-contrast: #FFFFFF`, `--color-accent: #A8613A`, `--color-danger: #9B2C1F`
- [X] T006 Reemplazar los 6 pares de etiqueta de estado en `:root` de `public/css/styles.css`: `--tag-success-bg: #E4EDE7` / `-fg: #1F5134` (Vigente), `--tag-warn-bg: #F6E9DC` / `-fg: #8A4A22` (Vencida), `--tag-info-bg: #EAEEF2` / `-fg: #33485C`, `--tag-danger-bg: #F7E5E2` / `-fg: #8A2318`, `--tag-help-bg: #EFEAE2` / `-fg: #6B5B43`, `--tag-neutral-bg: #F1EFEA` / `-fg: #4A4640`. Los cuatro últimos quedan definidos y sin uso (FR-014)
- [X] T007 Reemplazar los tokens de tipografía en `:root` de `public/css/styles.css`: `--font-serif: "Source Serif 4", Georgia, "Times New Roman", serif` y `--font-sans: Inter, system-ui, -apple-system, "Segoe UI", sans-serif`. **Eliminar** el token de familia monoespaciada si se hubiera añadido: la identidad son dos familias (FR-011)
- [X] T008 Añadir a `:root` de `public/css/styles.css` la escala de texto completa, cerrando el hueco actual entre 20 y 28 px: `--text-xs: 12px`, `--text-sm: 14px`, `--text-md: 16px`, `--text-lg: 18px` (nuevo), `--text-xl: 22px`, `--text-2xl: 28px`, `--text-3xl: 36px` (nuevo); pesos `400`, `500` (nuevo), `600`, `700` (nuevo); `--leading-text: 1.55`, `--leading-title: 1.2`; `--tracking-tight: -0.011em`, `--tracking-eyebrow: 0.08em`
- [X] T009 Añadir a `:root` de `public/css/styles.css` los tokens de medida: `--page-max: 1200px`, `--measure: 68ch`, y `--gutter` y `--card-pad` con su valor base (16 px y 20 px), que los tramos de la fase de US6 redefinirán
- [X] T010 Añadir a `:root` de `public/css/styles.css` los tokens de forma y elevación: `--radius-sm: 4px`, `--radius: 6px`, `--radius-lg: 10px`, `--shadow-sm: 0 1px 2px rgba(17,24,39,.05)`, `--shadow-md: 0 2px 8px rgba(17,24,39,.07)`, `--shadow-lg: 0 12px 32px rgba(17,24,39,.12)`
- [X] T011 Añadir a `:root` de `public/css/styles.css` los tokens de densidad y movimiento: `--control-h: 44px`, `--control-h-compact: 36px`, `--row-h-compact: 40px`, `--nav-h: 48px`, `--transition: 140ms`, `--ease: cubic-bezier(.2,.6,.3,1)`
- [X] T012 Actualizar los estilos de elemento base en `public/css/styles.css`: `body` con `--font-sans` e interlineado `--leading-text`; `h1`, `h2`, `h3` con `--font-serif`, `--leading-title` y `--tracking-tight`; `h1` a `--text-2xl` y peso `700`; `h2` a `--text-xl`; `a` con `--color-primary`
- [X] T013 Buscar en `public/css/styles.css` y eliminar todo valor de la revisión 1 que quede suelto: `#1d4ed8`, `#1e40af`, `#dbeafe`, `#e2e8f0`, `#f8fafc`, `#0f172a`, `#475569`, `#b91c1c`, `#f1f5f9`, `#334155`, `#fef3c7`, `#92400e`, `#dcfce7`, `#166534`, `#fee2e2`, `#991b1b`, `#ede9fe`, `#5b21b6` y la antigua familia `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` (SC-015)
- [X] T014 Actualizar la transición global en `public/css/styles.css` para que cubra `background`, `border-color`, `color` y `box-shadow` con `--transition` y `--ease`, **nunca `transform`**, y comprobar que el bloque `prefers-reduced-motion: reduce` sigue neutralizándolas

**Checkpoint**: el tema está sustituido. Las seis pantallas ya se ven «Despacho» en lo que heredan, aunque los componentes aún no estén ajustados.

---

## Phase 3: User Story 3 - Identidad visual «Despacho» en toda la aplicación (Priority: P1) 🎯 MVP

**Goal**: los componentes compartidos adoptan la identidad, de modo que las seis pantallas se vean como un solo producto deliberado.

**Independent Test**: recorrer las seis pantallas y comprobar que los mismos tipos de elemento se ven iguales, que el título manda sobre la marca, que el fondo es crema, que los dígitos de los importes quedan en columna y que no queda ningún color de la revisión 1. Pasos 1 y 2 de `quickstart.md`.

**Nota de contención**: todas las tareas de esta fase salvo T020 tocan `public/css/styles.css`, así que no son paralelizables entre sí.

- [X] T015 [US3] Actualizar `.btn` y sus variantes en `public/css/styles.css`: el botón neutro usa `--color-border-control` como borde (3:1, ver `research.md` §1); `--primary` usa `--color-primary` con texto `--color-primary-contrast`; `--secondary` y `--text` usan `--color-primary`; `--danger` usa `--color-danger`; peso `600`; `--radius`
- [X] T016 [US3] Actualizar los controles de formulario (`input`, `select`, `textarea`) en `public/css/styles.css` para que usen `--color-border-control` en lugar de `--color-border`, con `--radius` y altura `--control-h`. Los separadores y el filo de tarjeta se quedan en `--color-border`
- [X] T017 [US3] Actualizar `.card` en `public/css/styles.css`: `--radius-lg`, relleno `--card-pad`, `--shadow-sm`, filo `--color-border`; `a.card` pasa a `--shadow-md` al apuntarla; `.card__title` a `--text-lg` en `--font-serif`
- [X] T018 [US3] Actualizar `.data-list` en `public/css/styles.css`: encabezado con fondo `--color-surface-raised`, texto `--text-sm` peso `500` y `--tracking-eyebrow` en mayúsculas; separadores `--color-border`; `.data-list__primary` en `--font-serif` (es el folio); y añadir `font-variant-numeric: tabular-nums` a `.num` para que los dígitos queden alineados en columna (SC-013)
- [X] T019 [US3] Actualizar `.tag` en `public/css/styles.css` a `--radius-sm` y comprobar que las seis variantes toman los pares nuevos; verificar que «Vigente» se ve verde y «Vencida» cobre
- [X] T020 [US3] En `public/js/ui.js`, cambiar la variante de `statusTag()`: `Vigente` pasa de `tag--info` a `tag--success` y `Vencida` se queda en `tag--warn`. No cambiar el texto. Esta función sigue siendo el único lugar que decide texto y variante del estado
- [X] T021 [US3] Actualizar `.page-header` en `public/css/styles.css` para que el `h1` se vea en `--font-serif` a `--text-2xl` peso `700`, y bajar `.brand` a `--text-lg` en `--font-sans`, de modo que el título de página mande sobre la marca, y añadirle una regla inferior de 1 px en `--color-border-strong` que separe la cabecera del contenido (SC-011, FR-027)
- [X] T022 [US3] Actualizar `.totals` en `public/css/styles.css`: fondo `--color-surface-raised`, `--radius-lg`, `--shadow-md` cuando está fijo, y `.totals__row--total` en `--font-serif` a `--text-3xl` con `--color-primary`
- [X] T023 [US3] Actualizar `.aviso` y `.aviso--ok` en `public/css/styles.css` a los pares de etiqueta nuevos (error en la familia `danger`, éxito en la familia `success`), con `--radius` y sin borde azul
- [ ] T024 [US3] Comprobar con un medidor de contraste los pares de `research.md` §1 tal como quedan en pantalla: texto principal y secundario sobre crema y sobre blanco, texto de botón primario, las dos etiquetas en uso, rojo de error, borde de control y anillo de foco (SC-014)

**Checkpoint**: US3 completa y verificable sola. Las seis pantallas comparten la identidad «Despacho».

---

## Phase 4: User Story 4 - PDF que el cliente recibe con la identidad «Despacho» (Priority: P1)

**Goal**: el documento que ve el cliente adopta la identidad, con su contenido intacto, y se lee igual de bien impreso en blanco y negro.

**Independent Test**: descargar los 3 PDF de ejemplo, compararlos cifra por cifra con la referencia de T001, comprobar el tamaño del archivo e imprimir uno en blanco y negro. Paso 6 de `quickstart.md`.

**Nota de contención**: todas las tareas tocan `public/js/pdf.js`, así que no son paralelizables entre sí.

- [X] T025 [US4] En `public/js/pdf.js`, actualizar la lectura de tokens con `getComputedStyle`: añadir `--color-accent` y `--color-surface-raised`, y retirar `--color-ground`, que deja de usarse porque el PDF va sobre fondo blanco (`contracts/pdf-visual.md`)
- [X] T026 [US4] En `public/js/pdf.js`, pasar el título «Cotización» y el folio a la fuente serif estándar con `doc.setFont('times', ...)`, sin incrustar ninguna tipografía (`research.md` §3). El cuerpo y la tabla se quedan en `helvetica`
- [X] T027 [US4] En `public/js/pdf.js`, pasar la regla de acento superior y la caja del total a `--color-primary`, con el importe del total en `times` y al mayor tamaño del documento
- [X] T028 [US4] En `public/js/pdf.js`, poner el valor de «Vigencia hasta» en `--color-accent`, que es el único uso del cobre en el documento; la etiqueta se queda en `--color-text-muted`
- [X] T029 [US4] En `public/js/screens/quote-editor.js`, poner el valor de «Vigencia hasta» en `--color-accent`, igual que en el PDF (T028), de modo que el dato de vencimiento se señale igual en pantalla y en el documento (FR-009)
- [X] T030 [US4] En `public/js/pdf.js`, pasar el fondo del encabezado de la tabla de conceptos a `--color-surface-raised` y los separadores de fila a `--color-border`
- [X] T031 [US4] Comprobar que `public/js/pdf.js` no contiene ningún código de color escrito a mano: todos salen de los tokens (invariante 2 de la spec)
- [ ] T032 [US4] Descargar los 3 PDF de ejemplo y compararlos cifra por cifra con la referencia de T001: datos, conceptos, impuestos, retenciones y totales idénticos (19,066.67 / 20,816.67 / 23,200.00) (SC-007, SC-027)
- [ ] T033 [US4] Comparar el tamaño en bytes de los 3 PDF con el anotado en T001: ninguno más de un 20 % mayor (SC-031)
- [ ] T034 [US4] **Imprimir** un PDF en una impresora monocromática (o exportar en escala de grises) y comprobar que folio, cliente, total y fecha de vigencia se identifican en menos de 5 segundos y que nada se distingue solo por color (SC-029, SC-030, FR-016a)
- [ ] T035 [US4] Generar los casos límite del PDF y comprobar que el diseño aguanta: varias páginas con el encabezado de tabla repetido y el total sin partir, sin logo, con acentos y ñ, y una cotización vencida idéntica a una vigente (FR-015)

**Checkpoint**: US4 completa. El documento del cliente tiene la identidad y conserva su contenido.

---

## Phase 5: User Story 2 - Navegación común en todas las páginas (Priority: P1)

**Goal**: la navegación adopta la identidad y gana altura en escritorio, sin cambiar su comportamiento.

**Independent Test**: recorrer las seis pantallas en escritorio y a 360 px, comprobando presencia, sección resaltada, cinco etiquetas legibles y foco visible con teclado. Pasos 5.1 a 5.3 de `quickstart.md`.

- [X] T036 [US2] En `public/css/styles.css`, actualizar `#nav` y `.topbar` a la identidad: superficie `--color-surface`, borde `--color-border`, y el elemento activo con `--color-primary` y su regla interior
- [X] T037 [US2] En `public/css/styles.css`, subir `--nav-h` a `56px` desde 768 px, manteniendo `48px` en la barra inferior de celular, y ajustar el relleno inferior de `main` para que nada quede tapado (`contracts/ui-shell.md`)
- [ ] T038 [US2] Comprobar a 360 px que las cinco etiquetas de la barra inferior («Inicio», «Cotizaciones», «Clientes», «Servicios», «Perfil») se leen completas en `--text-xs`, sin abreviar ni recortar (SC-024)
- [ ] T039 [US2] Recorrer la navegación con teclado en las seis pantallas y comprobar que el anillo de foco de 2 px en `--color-primary` es visible sobre crema y sobre superficie (FR-007)

**Checkpoint**: US2 completa.

---

## Phase 6: User Story 1 - Entrar por una página de inicio con resumen (Priority: P1)

**Goal**: Inicio conserva intacto su comportamiento y adopta la identidad. **No hay cambio funcional en esta historia**: ya se implementó en la revisión 1.

**Independent Test**: abrir la dirección principal con cotizaciones guardadas y comprobar que el resumen coincide con la lista y que cada acceso lleva a su sección. Pasos 7.5 a 7.7 de `quickstart.md`.

- [X] T040 [US1] En `public/css/styles.css`, actualizar `.summary-grid`, `.access-grid` y `.summary__value` a los tokens nuevos: la cifra del resumen pasa a `--text-3xl` y las tarjetas heredan `--card-pad` y `--radius-lg`
- [X] T041 [US1] Comprobar en `public/js/screens/home.js` que las tarjetas «Vigentes» y «Vencidas» usan las variantes correctas tras T020 (verde y cobre) y que el saludo, el total y el mensaje de lista vacía conservan su texto exacto (FR-018)
- [ ] T042 [US1] Verificar que la suma de vigentes y vencidas sigue coincidiendo con el número de cotizaciones de la lista y con sus etiquetas (SC-002), y que sin perfil guardado Inicio sigue redirigiendo a `#/perfil` (FR-008)

**Checkpoint**: las cuatro historias P1 están completas. **Este es el punto de corte recomendado para una primera entrega.**

---

## Phase 7: User Story 5 - Saber qué está pasando: estados y retroalimentación (Priority: P2)

**Goal**: la interfaz responde: pulsado, hueco reservado durante la carga, campo marcado como inválido, avisos cerrables y confirmación propia.

**Independent Test**: pulsar cada tipo de botón, recargar Inicio con la red limitada, guardar con un campo vacío, lanzar la exportación y provocar error y éxito. Pasos 3 y 4 de `quickstart.md`.

### Estados de control y carga

- [X] T043 [US5] En `public/css/styles.css`, añadir el estado `:active` a **todo elemento interactivo**, no solo a los botones: `.btn` y sus cuatro variantes, los enlaces de navegación `#nav a` y las tarjetas pulsables `a.card`. Cambio de fondo y de borde, **sin `transform`**, para que funcione en táctil sin apagarse con movimiento reducido (FR-020, `research.md` §7, SC-017)
- [X] T044 [US5] En `public/css/styles.css`, añadir el componente `.skeleton`: rectángulo neutro, sin animación, que ocupa el tamaño del dato que va a sustituir
- [X] T045 [US5] En `public/css/styles.css`, añadir el estado inválido de campo: `input[aria-invalid="true"]`, `select[aria-invalid="true"]` y `textarea[aria-invalid="true"]` con borde `--color-danger`
- [X] T046 [US5] En `public/js/screens/home.js`, sustituir el texto inicial `'Cargando…'` de las dos cifras por un `.skeleton` del tamaño de la cifra final, de modo que al llegar el dato nada se desplace (SC-018)
- [X] T047 [US5] En `public/js/screens/home.js`, sustituir el `'–'` del caso de fallo por un texto breve en español que no se confunda con un cero, conservando el aviso y el `role="alert"` actuales (FR-005, FR-021)
- [X] T048 [US5] En `public/js/ui.js`, ampliar la ayuda `field()` para que acepte el estado inválido: pone `aria-invalid="true"` en el control y enlaza el mensaje con `aria-describedby`, generando el identificador a partir del `id` del control. La forma de llamarla desde las pantallas que no lo usan no cambia (`research.md` §8)
- [X] T049 [US5] En `public/js/screens/quote-editor.js`, usar el estado inválido de `field()` al validar los campos obligatorios antes de guardar (SC-019)
- [X] T050 [P] [US5] En `public/js/screens/clients.js`, usar el estado inválido de `field()` en su validación
- [X] T051 [P] [US5] En `public/js/screens/services.js`, usar el estado inválido de `field()` en su validación
- [X] T052 [P] [US5] En `public/js/screens/profile.js`, usar el estado inválido de `field()` en su validación

### Avisos y acción en curso

- [X] T053 [US5] En `public/js/ui.js` y `public/index.html`, añadir un botón de cierre a la franja de avisos; el aviso de error pierde todo temporizador y el de éxito conserva su desaparición a los 4 segundos (SC-021, FR-024)
- [X] T054 [US5] En `public/js/screens/quotes.js`, hacer que el botón «Exportar todo (.zip)» conserve su etiqueta y muestre el avance en un elemento interno de ancho reservado, fijando su ancho al iniciar y liberándolo al terminar, de modo que «Nueva cotización» no se desplace (SC-020, `research.md` §9)

### Componente de confirmación

- [X] T055 [US5] En `public/css/styles.css`, añadir el componente `.dialog` sobre el elemento `<dialog>` nativo: superficie, `--radius-lg`, `--shadow-lg`, y el pseudo-elemento de fondo con el crema atenuado
- [X] T056 [US5] En `public/js/ui.js`, sustituir `confirmar(texto)` por una función que abre un `<dialog>` con `showModal()` y devuelve una promesa de booleano. El navegador aporta bloqueo de la página, foco atrapado, cierre con la tecla de escape y rol correcto. El botón «Cancelar» recibe el foco al abrir y es la acción por defecto; el de confirmar usa la variante `--danger` cuando la acción es destructiva; al cerrarse, el foco vuelve al elemento que lo abrió (FR-024a, `research.md` §4)
- [X] T057 [US5] En `public/js/screens/quotes.js`, pasar la confirmación de eliminar cotización a la función nueva con `await`, conservando el texto exacto de la pregunta
- [X] T058 [P] [US5] En `public/js/screens/clients.js`, pasar su confirmación a la función nueva con `await`, conservando su texto
- [X] T059 [P] [US5] En `public/js/screens/services.js`, pasar su confirmación a la función nueva con `await`, conservando su texto
- [X] T060 [US5] Buscar en todo `public/js/` cualquier uso restante de `window.confirm` y comprobar que no queda ninguno: los tres sitios son `quotes.js`, `clients.js` y `services.js` (SC-026a)

**Checkpoint**: US5 completa. La interfaz responde y el cuadro del navegador ha desaparecido del producto.

---

## Phase 8: User Story 6 - Densidad y aprovechamiento del ancho en escritorio (Priority: P2)

**Goal**: el escritorio recibe su propia densidad y las páginas separan sus secciones, sin reducir los tamaños táctiles del celular.

**Independent Test**: abrir las seis pantallas a 1440 px y a 360 px, contar filas en escritorio y medir los tamaños táctiles en celular. Paso 5 de `quickstart.md`.

**Nota de contención**: T061 a T065 tocan `public/css/styles.css` y no son paralelizables entre sí.

- [X] T061 [US6] En `public/css/styles.css`, aplicar `--page-max: 1200px` a `main` y redefinir `--gutter` por tramo: 16 px en base, 24 px desde 768 px y 40 px desde 1024 px (`contracts/design-system.md`)
- [X] T062 [US6] En `public/css/styles.css`, añadir el tramo de 1024 px con la densidad de escritorio: controles a `--control-h-compact`, filas de `.data-list` a `--row-h-compact` y `--card-pad` a 24 px. **Las alturas táctiles no bajan por debajo de 1024 px** (`research.md` §6, SC-024)
- [X] T063 [US6] En `public/css/styles.css`, añadir el tramo de 1280 px para que `.access-grid` pase de 2 a 4 columnas (FR-025)
- [X] T064 [US6] En `public/css/styles.css`, aplicar `--space-7` o `--space-8` como separación entre secciones de página, de modo que sea al menos el doble de la separación entre un título y su contenido; revisar el margen de `h2` para que agrupe con lo que encabeza (SC-025)
- [X] T065 [US6] En `public/css/styles.css`, aplicar `--measure: 68ch` a los bloques de texto corrido para que no se estiren de lado a lado en pantalla ancha (FR-028)
- [X] T066 [US6] En `public/js/screens/quotes.js`, retirar el botón «Abrir» de cada fila y jerarquizar las tres acciones restantes: «Descargar PDF» como botón neutro, «Editar» como botón de texto y «Eliminar» como `--danger`. El folio de la fila sigue siendo el enlace a la cotización (FR-026a, SC-026)
- [ ] T067 [US6] Verificar a 1440 px que la lista de cotizaciones muestra al menos 14 filas sin desplazar, con 15 o más cotizaciones guardadas (SC-023)
- [ ] T068 [US6] Verificar a 1024 px que la tabla está en filas y los controles ya son compactos, y a 800 px que la tabla está en filas pero los controles siguen siendo táctiles (FR-025)

**Checkpoint**: las seis historias están completas.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: no-regresión, verificación completa y puesta al día de los artefactos.

- [X] T069 Ejecutar `npm test` y comprobar que pasa **sin haber modificado ninguna prueba**: es la comprobación de que esta feature no tocó cálculo, API ni `summary.js` (invariante 8)
- [ ] T070 Recorrer los flujos de la spec 001 (perfil → cliente → cotización → PDF, editar, eliminar, catálogos) y comprobar que se completan con los mismos textos, datos y cifras (SC-006)
- [ ] T071 Recorrer el flujo de la spec 003 («Exportar todo (.zip)») y comprobar que el .zip sigue trayendo un PDF por cotización y `datos-cotizaciones.json` (SC-006)
- [ ] T072 Comprobar los invariantes de la spec: ningún valor suelto de color, tamaño, espacio, forma o duración en los componentes de `public/css/styles.css`; `public/js/pdf.js` sin códigos de color; `statusTag()` como único lugar del estado; nada de `innerHTML` con datos; foco visible siempre; ninguna dependencia de red nueva; **ningún degradado, ilustración ni sombra de color en toda la hoja de estilos** (FR-014b); y el paso 7.1b de `quickstart.md` (un cambio de paleta se propaga a todo a la vez, SC-010)
- [ ] T073 Comprobar el borde del caso de tipografías: con la caché limpia y sin conexión, la aplicación sigue legible con las familias de reserva y la disposición no se rompe (FR-014c)
- [ ] T074 Activar «reducir movimiento» en el sistema y comprobar que ningún estado se entiende solo por movimiento, incluidos el pulsado y el bloque de carga
- [ ] T075 Ejecutar `specs/002-rediseno-inicio/quickstart.md` completo en Chrome, y los pasos marcados **[CF]** también en Firefox
- [ ] T076 Revalidar `specs/002-rediseno-inicio/checklists/ux.md` de la revisión 1 y resolver sus ítems `[Gap]` con la persona dueña
- [X] T077 Actualizar `specs/README.md`: la fila 002 pasa a describir la revisión 2 («dirección visual Despacho»), con su estado y sus pendientes
- [X] T078 Actualizar `CLAUDE.md` en la raíz del proyecto: el tema único de `styles.css` ahora incluye dos familias tipográficas locales en `public/fonts/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: sin dependencias. **T001 y T002 deben ir antes de cualquier cambio de código** y no se pueden recuperar después
- **Foundational (Fase 2)**: depende de la Fase 1. **Bloquea todas las historias**: sin los tokens, ningún componente puede ajustarse
- **US3 (Fase 3)**: depende de la Fase 2. Habilita al resto de las P1
- **US4 (Fase 4)**: depende de la Fase 2 para los tokens de color. Independiente de US3 en el archivo (`pdf.js` frente a `styles.css`), así que puede ir en paralelo con ella
- **US2 (Fase 5)** y **US1 (Fase 6)**: dependen de la Fase 2 y de T020 (variante de `statusTag`). Tocan `styles.css`, así que van después de US3
- **US5 (Fase 7)**: depende de la Fase 2. Es la fase con más archivos propios y la que menos choca con las demás
- **US6 (Fase 8)**: depende de la Fase 2 y de US3, porque redefine por tramo lo que US3 definió en base
- **Polish (Fase 9)**: depende de todas las historias que se quieran entregar

### Within Each User Story

- Los tokens antes que los componentes
- Los componentes compartidos de `ui.js` antes que las pantallas que los usan (T048 antes de T049–T052; T056 antes de T057–T059)
- La verificación al final de cada fase

### Parallel Opportunities

El cuello de botella es `public/css/styles.css`: **concentra 33 de las 78 tareas y no admite trabajo paralelo sobre sí mismo**. Lo que sí puede ir a la vez:

- **T003** (tipografías) en paralelo con **T001/T002** (captura de referencia): archivos distintos
- **US4 completa (T025–T035)** en paralelo con **US3 (T015–T024)**: `pdf.js` frente a `styles.css`
- **T050, T051, T052** entre sí: tres pantallas distintas, el mismo patrón, tras T048
- **T058, T059** entre sí: dos pantallas distintas, tras T056
- Dentro de US5, el trabajo de `ui.js` (T048, T053, T056) y el de `styles.css` (T043–T045) pueden repartirse entre dos personas

---

## Parallel Example: US3 y US4 a la vez

```bash
# Dos frentes, dos archivos distintos, tras completar la Fase 2:
Persona A → T015…T024  en public/css/styles.css   (identidad en pantalla)
Persona B → T025…T035  en public/js/pdf.js        (identidad en el documento)
```

---

## Implementation Strategy

### MVP: las cuatro historias P1 (Fases 1 a 6, T001–T042)

1. Fase 1: capturar la referencia **antes de tocar nada** y colocar las tipografías
2. Fase 2: sustituir el bloque de tokens
3. Fase 3 (US3): identidad en los componentes compartidos
4. Fase 4 (US4): identidad en el PDF
5. Fases 5 y 6 (US2, US1): navegación e Inicio
6. **PARAR Y VERIFICAR**: pasos 1, 2, 6 y 7 de `quickstart.md`

En este punto el producto ya cumple el objetivo de la revisión: la aplicación y el documento que recibe el cliente tienen una identidad deliberada. Los huecos de estados y la densidad quedan como estaban, que es como funcionan hoy.

### Entrega incremental

1. MVP (P1) → verificar → entregar
2. US5 (estados y confirmación) → verificar → entregar. Es la historia con más trabajo de la revisión, por el componente de confirmación
3. US6 (densidad) → verificar → entregar
4. Fase 9 (no-regresión y cierre)

### Nota sobre el orden dentro de P1

La spec prioriza US1 y US2 como P1 porque son el punto de entrada y la navegación, pero **ya están implementadas**: su trabajo aquí es heredar la identidad y verificar. Por eso las fases van US3 → US4 → US2 → US1: el orden de dependencia técnica, no el de la numeración.

---

## Notes

- `[P]` = archivos distintos, sin dependencias pendientes
- `[Story]` liga cada tarea a su historia, para trazabilidad
- Cada tarea se rastrea a un requisito o criterio de la spec (Principio III)
- Confirmar los cambios tras cada tarea o grupo lógico
- **Prohibido tocar**: `public/js/calc.js`, `server/`, `test/`, el esquema de datos (FR-017)
- Ninguna prueba automatizada se modifica: `npm test` es comprobación de no-regresión
