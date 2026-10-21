---

description: "Lista de tareas de la spec 003: exportar todas las cotizaciones en un .zip"
---

# Tasks: Exportar todas las cotizaciones en un .zip

**Input**: Documentos de diseño en `/specs/003-export-zip-backup/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-backup.md, contracts/zip-layout.md, quickstart.md

**Tests**: el plan los pide (`tests/backup.test.js` y `tests/backup-names.test.js`); van antes de la implementación de cada historia. Lo visual, el .zip y los PDF se verifican a mano con `quickstart.md` (Principio IV).

**Organization**: tareas agrupadas por historia de usuario de la spec.

## Format: `[ID] [P?] [Story] Descripción`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: historia a la que pertenece (US1 a US4)
- Todas las rutas son relativas a la raíz del repositorio

## Convenciones a respetar (CLAUDE.md)

- Texto de producto en español de México; texto insertado con `el()` de `public/js/ui.js` (nunca `innerHTML` con datos).
- Pantallas con `button`, `pageHeader` y demás componentes de `ui.js`; sin valores de estilo sueltos.
- No tocar `calc.js` ni el esquema de datos (`server/db.js`). El comportamiento de las rutas existentes no cambia.
- Nada fuera de la spec (Principio III).

---

## Phase 1: Setup

**Purpose**: dejar disponible la única dependencia nueva.

- [ ] T001 Descargar `jszip@3.10.1` con `npm pack` en la carpeta temporal (no instalarlo en el proyecto), copiar `dist/jszip.min.js` a `public/vendor/jszip.min.js` y comprobar que la licencia del paquete es `(MIT OR GPL-3.0-or-later)`. No se modifica `package.json`
- [ ] T002 Añadir `<script src="vendor/jszip.min.js"></script>` justo después de la línea de `vendor/jspdf.umd.min.js` en `public/index.html`

---

## Phase 2: Foundational (bloquea todas las historias)

**Purpose**: dos refactorizaciones sin cambio de comportamiento que permiten reutilizar lo existente (FR-004).

**⚠️ CRITICAL**: `npm test` debe seguir pasando, sin editar las pruebas existentes, al terminar esta fase.

- [ ] T003 Extraer `serialize` de `createQuotesRouter` en `server/routes/quotes.js` a una función exportada `createQuoteSerializer(db)` que devuelve `serialize(row)` con exactamente el mismo resultado de hoy; el router la usa internamente y no cambia ninguna respuesta (research.md, decisión 2)
- [ ] T004 [P] Separar en `public/js/pdf.js` el armado del guardado: `export async function buildQuotePdf(quote)` contiene todo el dibujo actual y devuelve el `doc` de jsPDF; `downloadQuotePdf(quote)` pasa a ser `const doc = await buildQuotePdf(quote); doc.save(\`Cotizacion-${quote.folio}.pdf\`);`. No cambiar ninguna medida, color ni texto del PDF (research.md, decisión 3)
- [ ] T005 Ejecutar `npm test` y confirmar que todas las pruebas existentes pasan sin cambios

**Checkpoint**: la base está lista; las historias pueden empezar.

---

## Phase 3: User Story 1 - Descargar una copia completa en un solo archivo (Priority: P1) 🎯 MVP

**Goal**: pulsar «Exportar todo (.zip)» y recibir un único `cotizacion-copia-AAAA-MM-DD.zip` con un PDF `folio - cliente.pdf` por cotización y `datos-cotizaciones.json` (FR-001, FR-002, FR-003, FR-005, FR-005a, FR-006, FR-007, FR-008, FR-009, FR-012, FR-013, FR-014).

**Independent Test**: `quickstart.md` §1: con 3 cotizaciones, el botón descarga un .zip con 3 PDF bien nombrados y el archivo de datos; `Diseño/Web S.L.` queda como `Diseño-Web S.L.`.

### Tests for User Story 1 ⚠️

> Escribirlas primero y comprobar que fallan antes de implementar.

- [ ] T006 [P] [US1] Crear `tests/backup-names.test.js` con la tabla de `contracts/zip-layout.md`: `zipFileName('2026-03-15')` = `cotizacion-copia-2026-03-15.zip`; `pdfEntryName` para `Estudio García`, `Diseño/Web S.L.`, `A:B*C?"D"<E>|F\G`, `  ...  ` (solo el folio) y 120 letras «a» (recortado a 80)
- [ ] T007 [P] [US1] Crear `tests/backup.test.js` con `startTestServer` de `tests/helpers.js` y los cuatro casos de `contracts/api-backup.md`: base vacía (listas vacías y `profile: null`); datos completos con perfil y logo, 2 servicios, 2 clientes y 3 cotizaciones, cada cotización `deepEqual` a `GET /api/quotes/:id`; folio eliminado conservado en `folioCounters`; conteos y contenido de las tablas iguales antes y después de llamar al endpoint (FR-013)

### Implementation for User Story 1

- [ ] T008 [US1] Crear `server/routes/backup.js` con `createBackupRouter(db, today)` y `GET /` según `contracts/api-backup.md`: solo `SELECT`; devuelve `exportDate: today()`, `profile` (vía `readProfile`, o `null`), `services` y `clients` con los mismos campos y orden que sus rutas, `quotes` ordenadas `issue_date DESC, id DESC` y serializadas con `createQuoteSerializer(db)`, y `folioCounters` como `{ year, lastNumber }` ordenados por año (depende de T003)
- [ ] T009 [US1] Montar `router.use('/backup', createBackupRouter(db, today))` en `server/routes/index.js` (depende de T008)
- [ ] T010 [US1] Crear `public/js/backup.js` con `zipFileName(isoDate)` y `pdfEntryName(folio, clientName)` sin importar nada del navegador. Limpieza del cliente, en este orden: «Cada `\ / : * ? " < > |` y carácter de control → `-`»; «Espacios repetidos → un espacio»; «Quitar espacios y puntos al inicio y al final»; «Recortar a 80 caracteres y repetir el paso 3»; «Si queda vacío, el nombre es `<folio>.pdf` (sin « - »)». Acentos y «ñ» se conservan. Debe hacer pasar T006
- [ ] T011 [US1] En `public/js/backup.js` añadir `exportAll(onProgress)`: `get('/backup')` de `public/js/api.js`; con `import('./pdf.js')` dinámico, `buildQuotePdf(quote)` para cada cotización y `doc.output('arraybuffer')`; un `JSZip` (global `JSZip`) con cada PDF como `pdfEntryName(folio, client.name)` y `datos-cotizaciones.json` (`JSON.stringify(..., null, 2)`) con `{ formatVersion: 1, exportDate, profile, services, clients, quotes, folioCounters }` según `data-model.md`, todo en el mismo nivel; `generateAsync({ type: 'blob' })` y descarga con un enlace temporal a `URL.createObjectURL`, nombre `zipFileName(exportDate)`. Cualquier fallo lanza `Error` en español y no descarga nada (depende de T001, T002, T004, T009, T010)
- [ ] T012 [US1] En `public/js/screens/quotes.js` añadir a `pageHeader('Cotizaciones', ...)` un `button('Exportar todo (.zip)', null, ...)` junto a «Nueva cotización» que llama a `exportAll()`; si falla, `aviso(err.message)` (FR-001, FR-012). Variante `secondary` o neutra para que «Nueva cotización» siga siendo la acción principal (depende de T011)
- [ ] T013 [US1] Ejecutar `npm test` (T006 y T007 deben pasar) y recorrer `quickstart.md` §1

**Checkpoint**: la Historia 1 funciona sola; con datos reales se descarga un .zip válido. MVP.

---

## Phase 4: User Story 2 - Los PDF de la copia son idénticos a los de la aplicación (Priority: P1)

**Goal**: el contenido y los importes de cada PDF del .zip coinciden al centavo con el PDF que descarga la aplicación (FR-004).

**Independent Test**: `quickstart.md` §2: comparar lado a lado el PDF del .zip y el de **Descargar PDF** de la misma cotización, incluida la vencida y una de persona moral con retenciones.

### Implementation for User Story 2

- [ ] T014 [US2] Revisar que `exportAll` en `public/js/backup.js` pasa a `buildQuotePdf` el objeto de cotización tal cual llega de `/api/backup` (sin recalcular, reformatear ni completar campos) y que `downloadQuotePdf` en `public/js/pdf.js` usa la misma `buildQuotePdf`; ninguna otra ruta de código dibuja PDF
- [ ] T015 [US2] Recorrer `quickstart.md` §2 con las 3 cotizaciones (una vencida, una persona moral con retenciones, una con logo): logo, datos, fechas, conceptos, desglose y total iguales en ambos PDF. Anotar cualquier diferencia y corregirla antes de seguir

**Checkpoint**: Historias 1 y 2 completas; la copia es fiable como respaldo.

---

## Phase 5: User Story 3 - Aviso claro cuando no hay nada que exportar (Priority: P2)

**Goal**: con 0 cotizaciones, aviso claro y ninguna descarga (FR-010).

**Independent Test**: `quickstart.md` §3.

### Implementation for User Story 3

- [ ] T016 [US3] En `exportAll` de `public/js/backup.js`, si `quotes.length === 0` lanzar `new Error('No hay cotizaciones para exportar.')` antes de crear el `JSZip` ni ningún enlace de descarga; el manejador de `public/js/screens/quotes.js` ya lo muestra con `aviso()` (depende de T011, T012)
- [ ] T017 [US3] Recorrer `quickstart.md` §3 con la base vacía: aparece «No hay cotizaciones para exportar.» y la carpeta de descargas no recibe ningún archivo

**Checkpoint**: Historias 1 a 3 completas.

---

## Phase 6: User Story 4 - Ver que la exportación está trabajando (Priority: P3)

**Goal**: con 50 o más cotizaciones se ve que trabaja y no se lanzan dos exportaciones a la vez (FR-011).

**Independent Test**: `quickstart.md` §5.

### Implementation for User Story 4

- [ ] T018 [US4] En `exportAll` de `public/js/backup.js`, tras cada PDF llamar a `onProgress(hechos, total)` y ceder el control al navegador con `await new Promise((r) => setTimeout(r))` para que la pantalla se actualice (research.md, decisión 6)
- [ ] T019 [US4] En `public/js/screens/quotes.js`, mientras corre la exportación: deshabilitar el botón (atributo `disabled`), mostrar `Exportando… N de M` con `textContent` y, al terminar o fallar (`finally`), restaurar «Exportar todo (.zip)» y habilitarlo. Si el estilo `disabled` de `.btn` no existe, resolverlo con las clases de `public/css/styles.css`, sin valores sueltos (depende de T012, T018)
- [ ] T020 [US4] Recorrer `quickstart.md` §5 con 50 cotizaciones (Chrome y Firefox): contador creciente, botón bloqueado, .zip final con 50 PDF; y §6 (servidor detenido a mitad): mensaje claro, sin descarga, botón activo de nuevo

**Checkpoint**: las cuatro historias completas.

---

## Phase 7: Polish & Cross-Cutting

- [ ] T021 Ejecutar `npm test` completo: las pruebas existentes sin editar más `tests/backup.test.js` y `tests/backup-names.test.js`
- [ ] T022 Recorrer `quickstart.md` §4 (la exportación no cambia nada; el siguiente folio sigue igual) y §7 (360 px sin desplazamiento horizontal) en Chrome y Firefox
- [ ] T023 [P] Añadir la fila de la spec 003 a la tabla de `specs/README.md` (qué entrega, tareas hechas y pendientes)
- [ ] T024 [P] En `CLAUDE.md`, línea de Stack, añadir que JSZip va como archivo local en `public/vendor/` junto a jsPDF y que existe `GET /api/backup` de solo lectura (no tocar el resto del archivo)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: tras Setup; bloquea las historias. T004 es independiente de T003.
- **US1 (Phase 3)**: tras Phase 2. Es el MVP.
- **US2 (Phase 4)**: tras US1 (necesita el .zip para comparar).
- **US3 (Phase 5)**: tras T011 y T012 de US1.
- **US4 (Phase 6)**: tras T011 y T012 de US1; independiente de US3, pero ambas tocan `backup.js` y `quotes.js`, así que se hacen en orden.
- **Polish (Phase 7)**: tras las historias deseadas.

### Within US1

T006 y T007 (pruebas, [P]) → T008 → T009 → T010 → T011 → T012 → T013.

### Parallel Opportunities

- T003 y T004 (archivos distintos).
- T006 y T007 (archivos distintos).
- T023 y T024.

### Parallel Example: US1 pruebas

```text
Task: "Crear tests/backup-names.test.js según contracts/zip-layout.md"
Task: "Crear tests/backup.test.js según contracts/api-backup.md"
```

---

## Implementation Strategy

### MVP primero (solo US1)

1. Setup (T001–T002) y Foundational (T003–T005).
2. US1 (T006–T013).
3. **Parar y validar** con `quickstart.md` §1: ya existe una copia de seguridad utilizable.

### Entrega incremental

1. MVP (US1) → comprobar.
2. US2: verificar PDF idénticos (casi todo viene de la fase 2).
3. US3: aviso sin cotizaciones.
4. US4: indicador de avance.
5. Polish: pruebas completas, README y CLAUDE.md.

---

## Notes

- [P] = archivos distintos y sin dependencias pendientes.
- Fuera de alcance, no construir: importar/restaurar, Excel/CSV, copias automáticas, envío por correo o nube, selección parcial de cotizaciones.
- Hacer commit tras cada tarea o grupo lógico.
