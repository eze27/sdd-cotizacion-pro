---

description: "Lista de tareas para la página de inicio y el rediseño visual de CotizacionesPro"
---

# Tasks: Página de inicio y rediseño visual

**Input**: Documentos de diseño en `/specs/002-rediseno-inicio/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md (sin cambios), contracts/ (ui-shell.md, design-system.md, pdf-visual.md), quickstart.md

**Tests**: Solo la lógica nueva (conteo de vigentes y vencidas) lleva prueba automática (plan.md → Testing). Lo visual se comprueba a mano con `quickstart.md`. Las pruebas existentes MUST pasar sin editarse (SC-006).

**Organization**: Tareas agrupadas por historia de usuario. Todo texto nuevo en español de México (FR-018). **No se toca** `server/`, `public/js/calc.js`, `public/js/api.js`, `data/` ni `tests/*.test.js` existentes (FR-017). Sin dependencias nuevas ni recursos externos (FR-019).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: historia de la spec (US1 a US4)
- Cada tarea incluye la ruta exacta del archivo

## Path Conventions

Estructura de la spec 001 (`public/`, `tests/`). Los tokens viven al inicio de `public/css/styles.css`; nada de colores, tamaños o espacios sueltos fuera de ahí (FR-010).

**Orden de fases**: US1 (inicio) y US2 (navegación) son P1; US3 (apariencia) y US4 (PDF) son P2. Los cimientos visuales (tokens y componentes) van primero porque las cuatro historias los usan. Las reglas CSS antiguas se conservan hasta migrar todas las pantallas (T022) para que la app no se rompa a mitad de camino.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Línea base para demostrar que nada funcional cambia

- [X] T001 Ejecutar `npm test` (deben pasar todas; anotar cuántas son) y guardar en `specs/002-rediseno-inicio/baseline-hashes.txt` el hash SHA-256 de cada archivo de `server/`, de `public/js/calc.js`, de `public/js/api.js` y de `tests/*.test.js`, para comprobar al final que no cambiaron
- [X] T002 [P] Generar un PDF de referencia con el pdf.js actual (antes de modificarlo), usando el script de prueba en Node del scratchpad con la cotización de ejemplo (AEP persona moral, 15,000.00 + 2.5 × 2,000.00), y guardar el texto extraído en `specs/002-rediseno-inicio/baseline-pdf-text.txt` para comparar el contenido después (FR-016)
- [X] T001b [P] Revisar `public/` (pantallas, `ui.js`, `styles.css`) y `specs/002-rediseno-inicio/research.md` para listar los componentes y estilos reutilizables antes de crear nada nuevo (FR-019)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tokens y componentes que MUST existir antes de cualquier historia

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta terminar esta fase

- [X] T003 Añadir al inicio de `public/css/styles.css` el bloque `:root` de tokens según `contracts/design-system.md`: colores (`--color-ground`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-primary-hover`, `--color-primary-contrast`, `--color-danger`, y los pares `--tag-{info,warn,success,danger,help,neutral}-{bg,fg}`), tipografía (`--font-sans`, `--text-xs` 12px … `--text-2xl` 28px, pesos 400 y 600), espaciado (`--space-1` … `--space-8` = 4, 8, 12, 16, 24, 32, 48, 64 px), `--radius` 6px, `--shadow-sm`, `--control-h` 44px y `--nav-h` 48px; conservar las variables antiguas como alias a los tokens nuevos mientras existan reglas antiguas
- [X] T004 Añadir en `public/css/styles.css` (después de T003) los estilos base: fondo y texto con tokens, pila de fuentes del sistema, escala de títulos, anillo de foco visible de 2 px en `--color-primary` para todo elemento interactivo, y `@media (prefers-reduced-motion: reduce)` que anula transiciones
- [X] T005 Añadir en `public/css/styles.css` (después de T004) los componentes reutilizables solo con tokens: `.btn` con `--primary`, `--secondary`, `--danger`, `--text` (alto ≥ `--control-h`, estado deshabilitado visible); `.field` con `.field__hint` y `.field__error` (etiqueta visible sobre el control); `.card` y `.card__title`; `.tag` con `--info`, `--warn`, `--success`, `--danger`, `--help`, `--neutral`; `.page-header`; `.aviso` y `.aviso--ok`
- [X] T006 Añadir en `public/js/ui.js` las ayudas `button(text, variant, onclick)`, `field(label, control, { hint, error })` y `statusTag(expired)`; `statusTag` es el único lugar que decide texto y variante: `false` → "Vigente" con `tag--info`, `true` → "Vencida" con `tag--warn`; todo texto con `textContent`, sin `innerHTML`

**Checkpoint**: Tokens y componentes listos; las historias pueden comenzar

---

## Phase 3: User Story 1 - Entrar por una página de inicio con resumen (Priority: P1) 🎯 MVP

**Goal**: La dirección principal muestra el inicio con el resumen de vigentes y vencidas, los cuatro accesos y "Nueva cotización".

**Independent Test**: Con varias cotizaciones (alguna con más de 30 días), abrir `/` y comprobar que las cifras coinciden con la lista y que cada acceso lleva a su sección.

### Tests for User Story 1

- [X] T007 [P] [US1] Escribir primero (debe fallar) `tests/summary.test.js` con `node --test`: lista vacía → `{ vigentes: 0, vencidas: 0, total: 0 }`; mezcla de `expired` true/false cuenta bien; `vigentes + vencidas = total = list.length`; los elementos sin otros campos se aceptan (`contracts/ui-shell.md`)

### Implementation for User Story 1

- [X] T008 [US1] Crear `public/js/summary.js` con `summarizeQuotes(list)` → `{ vigentes, vencidas, total }` según el campo `expired` (función pura, módulo ES sin dependencias del navegador); hacer pasar T007
- [X] T009 [US1] Crear `public/js/screens/home.js`: `page-header` "Inicio" con saludo con el nombre de `GET /api/profile`; dos tarjetas de resumen "Vigentes" y "Vencidas" con su número (usando `statusTag`) y el texto "N cotizaciones" calculados con `summarizeQuotes` sobre `GET /api/quotes`; botón principal "Nueva cotización" → `#/cotizacion/nueva`; cuatro tarjetas de acceso (Cotizaciones, Clientes, Servicios, Perfil) con descripción corta; mientras carga el resumen, las tarjetas muestran "Cargando…"; sin cotizaciones: ceros y "Aún no tienes cotizaciones. Crea la primera."; si falla la carga del resumen: accesos visibles y aviso "No se pudo cargar el resumen. Intenta de nuevo."
- [X] T010 [US1] En `public/js/main.js` añadir la ruta `#/inicio` (carga `screens/home.js`, sección `inicio`), hacerla la predeterminada cuando no hay `#`, dejar que las direcciones desconocidas se comporten como hoy (si hoy no hay regla, llevarlas a `#/inicio`) y conservar la redirección a `#/perfil` cuando no hay perfil (FR-008); no cambiar las demás rutas
- [X] T011 [US1] Añadir en `public/css/styles.css` los estilos del inicio con tokens: rejilla de tarjetas de resumen (2 columnas en celular), rejilla de accesos (1 columna en celular, 2 desde 768 px), números grandes del resumen (`--text-2xl`)

**Checkpoint**: El inicio funciona y se puede verificar solo (con la barra actual)

---

## Phase 4: User Story 2 - Navegación común en todas las páginas (Priority: P1)

**Goal**: Misma navegación en todas las pantallas, con la sección actual resaltada; barra inferior en celular y superior en escritorio.

**Independent Test**: Recorrer las seis pantallas a 360 px y en escritorio; la barra está siempre, resalta la sección y permite llegar a las otras cuatro y al inicio.

### Implementation for User Story 2

- [X] T012 [US2] Reescribir la navegación en `public/index.html`: marca "CotizacionesPro" enlazada a `#/inicio` y `<nav>` con Inicio, Cotizaciones, Clientes, Servicios y Perfil (enlaces con `data-route="inicio|cotizaciones|clientes|servicios|perfil"`), manteniendo `#aviso`, `#app` y los scripts; `lang="es-MX"` y meta viewport sin cambios
- [X] T013 [US2] En `public/js/main.js` marcar la sección activa con `aria-current="page"` (y quitarlo de las demás) en cada navegación, incluida `inicio`; el editor de cotización cuenta como `cotizaciones`
- [X] T014 [US2] Añadir en `public/css/styles.css` los estilos de la navegación: debajo de 768 px barra fija inferior de 5 elementos iguales con alto `--nav-h` y `padding-bottom` del contenido para no taparlo; desde 768 px barra superior horizontal con la marca a la izquierda; elemento activo resaltado con `[aria-current="page"]`; foco visible; sin desplazamiento horizontal a 360 px
- [X] T015 [US2] Ajustar en `public/css/styles.css` los elementos fijos o pegajosos existentes (`.totales` del editor) para que respeten la altura de la barra inferior (`bottom: var(--nav-h)`) y no queden tapados

**Checkpoint**: US1 y US2 forman el cambio funcional visible: inicio + navegación común

---

## Phase 5: User Story 3 - Apariencia profesional y consistente (Priority: P2)

**Goal**: Todas las pantallas usan los mismos componentes; etiquetas "Vigente" y "Vencida" con color discreto y texto.

**Independent Test**: Recorrer todas las pantallas comparando botones, campos, tarjetas y listas; todos los flujos de la spec 001 siguen igual y ninguna cifra cambia.

### Implementation for User Story 3

- [X] T016 [P] [US3] Migrar `public/js/screens/profile.js` a los componentes (`page-header`, `card`, `field`, `button`), sin cambiar validaciones, textos de negocio ni llamadas a la API
- [X] T017 [P] [US3] Migrar `public/js/screens/clients.js` a los componentes (`page-header`, `data-list`, `card`, `field`, `button`) sin cambiar su comportamiento; la eliminación sigue pidiendo confirmación
- [X] T018 [P] [US3] Migrar `public/js/screens/services.js` a los componentes (`page-header`, `data-list`, `card`, `field`, `button`) sin cambiar su comportamiento; importes con `formatMoney` alineados a la derecha
- [X] T019 [P] [US3] Migrar `public/js/screens/quotes.js` a `page-header` (con "Nueva cotización" como botón principal), `data-list` y `statusTag(q.expired)` en lugar de la etiqueta suelta "vencida"; el estado sigue entendiéndose por el texto, no solo por el color
- [X] T020 [US3] Migrar `public/js/screens/quote-editor.js` (detalle, nueva y edición) a los componentes: `page-header`, `card`, `field`, `button`, `statusTag` en el detalle, totales en una tarjeta con el total destacado y retenciones con guion normal `-`; sin tocar cálculos (`calc.js`) ni llamadas a la API
- [X] T021 [US3] Añadir en `public/css/styles.css` los estilos de `.data-list` (apilada en celular; desde 768 px filas tipo tabla con encabezado, importes a la derecha) y de los conceptos del editor y los totales, solo con tokens; los textos largos (cliente, concepto, servicio) se ajustan en varias líneas sin desbordar (`overflow-wrap: anywhere`)
- [X] T022 [US3] Eliminar de `public/css/styles.css` las reglas y alias antiguos que ya no usa ninguna pantalla (por ejemplo `.lista`, `.etiqueta`, `.acciones` si quedó sin uso, variables antiguas), comprobando con búsqueda que ningún archivo de `public/` los referencia; dejar sin valores de color, tamaño o espacio sueltos fuera del bloque de tokens
- [X] T023 [P] [US3] Comprobar con un script de Node (en el scratchpad) que todos los pares texto/fondo de los tokens (texto/fondo, atenuado/fondo, primario/contraste, cada `--tag-*-fg` sobre su `-bg`, peligro/superficie, elemento activo de la barra de navegación sobre su fondo, texto de controles deshabilitados) tengan contraste ≥ 4.5:1 leyendo los valores de `styles.css` (SC-008); ajustar el token que no cumpla

**Checkpoint**: Todas las pantallas comparten identidad visual; las historias funcionan igual que antes

---

## Phase 6: User Story 4 - PDF con la misma identidad visual (Priority: P2)

**Goal**: El PDF adopta la jerarquía y la paleta de la app sin cambiar su contenido ni sus importes.

**Independent Test**: Descargar el PDF de los tres ejemplos de la spec 001 (19,066.67 / 20,816.67 / 23,200.00): mismo contenido, nuevo aspecto.

### Implementation for User Story 4

- [X] T024 [US4] En `public/js/pdf.js` añadir `readTheme()`, que lee con `getComputedStyle(document.documentElement)` los tokens `--color-primary`, `--color-primary-contrast`, `--color-text`, `--color-text-muted`, `--color-border` y `--color-ground` y los convierte a RGB para jsPDF; sin colores escritos a mano en el archivo (FR-010, SC-010)
- [X] T025 [US4] En `public/js/pdf.js` rediseñar el encabezado según `contracts/pdf-visual.md`: franja de acento superior de ancho completo, logo a la izquierda si existe, "Cotización" grande en color de acento y folio en gris debajo (sin logo el título ocupa la izquierda), pares etiqueta-valor para "Fecha de emisión" y "Vigencia hasta", y bloques "De" y "Para" en dos columnas con etiquetas en gris y nombre en negrita; mismo contenido y orden que la spec 001
- [X] T026 [US4] En `public/js/pdf.js` rediseñar la tabla de conceptos: encabezado con fondo suave (`--color-ground`) y texto en negrita, filas separadas por línea fina (`--color-border`), cantidad y precios alineados a la derecha, descripciones largas en varias líneas, y encabezado repetido al continuar en otra página; mantener `formatMoney` y `formatQuantity`
- [X] T027 [US4] En `public/js/pdf.js` rediseñar el desglose y el total: etiquetas en gris e importes alineados a la derecha en el orden de la spec 001 (retenciones con guion normal `-` y solo para persona moral), total en una caja con fondo de acento y texto `--color-primary-contrast` en tamaño mayor, sin partirse entre páginas; el archivo sigue llamándose `Cotizacion-AAAA-NNN.pdf`
- [X] T028 [US4] Regenerar el PDF de referencia de T002 con el pdf.js nuevo mediante el mismo script de Node (simulando `getComputedStyle` con los valores leídos de `styles.css`), extraer su texto y comprobar que contiene los mismos folio, fechas, datos de emisor y cliente, conceptos, cantidades, importes, impuestos y total que `specs/002-rediseno-inicio/baseline-pdf-text.txt`; la única diferencia admitida es el orden en que el extractor entrega los textos por el nuevo diseño de dos columnas; repetir con persona física, sin logo, y con 40 conceptos (varias páginas)

**Checkpoint**: PDF con nueva identidad y contenido intacto

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificación final contra la spec y la constitución

- [X] T029 [P] Ejecutar `npm test` (deben pasar las 35 pruebas existentes más `tests/summary.test.js`) y comparar los hashes de T001 para confirmar que `server/`, `public/js/calc.js`, `public/js/api.js` y las pruebas existentes no cambiaron (SC-006, FR-017); anotar el resultado
- [X] T030 [P] Revisar en `public/` que todos los textos nuevos y existentes estén en español de México, que los importes sigan como `$20,000.00`, que no haya `innerHTML` con datos ni recursos externos (fuentes, CDN) ni dependencias nuevas en `package.json` (FR-018, FR-019, Principio V)
- [ ] T031 Probar en Chrome y Firefox, en escritorio y a 360 px de ancho, el recorrido completo de `quickstart.md` §1 a §3 (inicio, navegación con teclado, apariencia, error de formulario, cambio de `--color-primary` y reversión) ; pedir a una persona que no participó en el diseño que distinga vigente de vencida en la lista en menos de 5 segundos (SC-005); con un nombre de cliente y una descripción de concepto muy largos, texto del navegador al 200 % y unas 200 cotizaciones de ejemplo, comprobar que nada se desborda ni se corta y que el inicio y la lista siguen fluidos; y corregir lo que se vea mal en `public/css/styles.css`
- [ ] T032 Descargar y revisar a ojo en un visor de PDF los PDF de los tres ejemplos, sin logo, con descripción larga y de varias páginas (`quickstart.md` §4); corregir lo que se vea mal en `public/js/pdf.js`; comprobar además que la descarga de cada PDF tarda menos de 3 segundos (SC-009) y que el total se identifica a simple vista en los de una y de varias páginas
- [ ] T033 Recorrer los flujos de la spec 001 (`specs/001-cotizaciones-pro/quickstart.md`) y comprobar las cifras 19,066.67 / 20,816.67 / 23,200.00 en pantalla y PDF (SC-006, SC-007); anotar cualquier diferencia
- [ ] T034 Revisar los ítems `[Gap]` de `checklists/ux.md` que sigan abiertos y, con el dueño del producto, decidir si se añaden a la spec o se confirman como fuera de alcance; no implementar nada que no esté en la spec (Principio III)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias; T001 y T002 se hacen antes de modificar cualquier archivo
- **Foundational (Phase 2)**: depende de Setup; bloquea todas las historias; T003 → T004 → T005 (mismo archivo CSS) y T006 independiente (`ui.js`)
- **US1 (Phase 3)**: depende de Foundational; T007 → T008 → T009 → T010; T011 en cualquier momento después de T005
- **US2 (Phase 4)**: depende de Foundational y de T010 (el enlace "Inicio" necesita la ruta `#/inicio`); T010 antes de T013 (mismo `main.js`); T012 antes de T013 y T014; T012 y T014 se hacen seguidas para no dejar la barra sin estilos
- **US3 (Phase 5)**: depende de Foundational; T016–T020 dependen de T005 y T006; T022 al final de las migraciones (T016–T021)
- **US4 (Phase 6)**: depende de T003 (tokens) y T002 (referencia); T024 → T025 → T026 → T027 (mismo archivo) → T028
- **Polish (Phase 7)**: depende de las historias deseadas

### Dentro de cada historia

- La prueba (T007) se escribe primero y falla antes de implementar
- Un archivo = una tarea a la vez; las tareas [P] tocan archivos distintos
- Tareas del mismo archivo (`styles.css`, `main.js`, `pdf.js`, `quote-editor.js`) van en orden

### Parallel Opportunities

- Setup: T001 y T002
- Foundational: T006 en paralelo con T003–T005
- US1: T007 en paralelo con T011
- US3: T016, T017, T018 y T019 en paralelo (archivos distintos); T023 en paralelo con las migraciones
- Tras Foundational, US1/US2 (inicio y navegación) y US4 (PDF) pueden avanzar en paralelo por separado, salvo `main.js`
- Polish: T029 y T030

---

## Parallel Example: User Story 3

```text
# Migraciones de pantallas juntas:
Task: "Migrar public/js/screens/profile.js a los componentes"
Task: "Migrar public/js/screens/clients.js a los componentes"
Task: "Migrar public/js/screens/services.js a los componentes"
Task: "Migrar public/js/screens/quotes.js a los componentes"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Phase 1: Setup (línea base)
2. Phase 2: Foundational (tokens, componentes y ayudas)
3. Phase 3: US1 (inicio con resumen)
4. Phase 4: US2 (navegación común)
5. **PARAR Y VALIDAR**: `quickstart.md` §1 y §2

### Incremental Delivery

1. US1 + US2 → validar → ya hay inicio y navegación
2. US3 (apariencia) → validar → la app luce igual en todas las pantallas
3. US4 (PDF) → validar con los tres ejemplos
4. Polish y validación completa de `quickstart.md`

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes
- La etiqueta [Story] enlaza cada tarea con la historia de la spec
- No se implementan los estados Borrador, Enviado, Aceptado ni Rechazado: solo sus colores reservados en los tokens (FR-012)
- Cualquier tarea que requiera tocar `server/`, `calc.js`, `api.js` o el esquema de datos es una señal de error de alcance: parar y consultar (FR-017)
- Confirmar con el dueño del producto antes de añadir cualquier cosa que no esté en la spec (Principio III)
