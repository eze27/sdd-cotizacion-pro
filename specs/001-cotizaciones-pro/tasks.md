---

description: "Lista de tareas para CotizacionesPro v0 (México)"
---

# Tasks: CotizacionesPro v0 (México)

**Input**: Documentos de diseño en `/specs/001-cotizaciones-pro/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (api.md, calculo-cotizacion.md, pdf-cotizacion.md), quickstart.md

**Tests**: Incluidos solo donde el plan los decidió (research §10): pruebas automáticas del cálculo y de la API con `node --test`. La interfaz se comprueba a mano con `quickstart.md`.

**Organization**: Las tareas se agrupan por historia de usuario. Todo el texto visible, los mensajes de error y el PDF MUST estar en español de México (FR-021). Sin funcionalidad fuera de la spec (Principio III).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: historia de la spec (US1 a US5)
- Cada tarea incluye la ruta exacta del archivo

## Path Conventions

Proyecto único (plan.md → Project Structure): `server/`, `public/`, `tests/`, `data/` en la raíz del repositorio.

**Orden de fases**: las historias P1 son US1 (emitir cotización) y US2 (perfil). US1 necesita un perfil guardado, así que la fase de US2 va primero. US1 incluye lo mínimo de clientes (crear y listar, "alta ahí mismo"); US4 añade la administración completa.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del proyecto

- [X] T001 Crear `package.json` en la raíz con `"type": "module"`, dependencias `express` y `better-sqlite3`, `engines.node` `>=22`, y scripts `start` (`node server/index.js`) y `test` (`node --test`; en Node 24 pasar la carpeta `tests/` como argumento falla, sin argumento descubre `tests/*.test.js`); crear las carpetas `server/routes/`, `public/css/`, `public/js/screens/`, `public/vendor/`, `tests/`
- [X] T002 [P] Crear `.gitignore` en la raíz que excluya `node_modules/` y `data/`
- [X] T003 [P] Descargar jsPDF en una versión fija (con al menos dos semanas de antigüedad) a `public/vendor/jspdf.umd.min.js` (copia local, sin depender de una CDN en producción)
- [X] T004 [P] Crear `public/index.html` (`lang="es-MX"`, meta viewport, barra de navegación con Cotizaciones, Clientes, Servicios y Perfil, contenedor `#app`, carga `js/main.js` como módulo)
- [X] T005 [P] Crear `public/css/styles.css` con diseño adaptable primero para celular (columna única, botones grandes, tablas que se acomodan en pantalla angosta) y ajustes para escritorio, probado en Chrome y Firefox

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Núcleo que MUST estar completo antes de cualquier historia

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta terminar esta fase

- [X] T006 [P] Escribir primero (deben fallar) las pruebas de `public/js/calc.js` en `tests/calc.test.js`: los tres casos de `contracts/calculo-cotizacion.md` (total 19,066.67 / 20,816.67 / 23,200.00, retención de IVA 2,133.33), cantidad 2.5 × 333.33 con redondeo 0.005 sube, cantidad 0 o negativa rechazada, cantidad 0.25 aceptada, cantidad 0.255 rechazada, folio 009 → 010 y año nuevo → 001, vencimiento (día 30 vigente, día 31 vencida), RFC válido de 12 y de 13 caracteres, RFC inválido y vacío de cliente
- [X] T007 Implementar en `public/js/calc.js` el cálculo con enteros: subtotal desde cantidad en centésimas × precio en centavos; IVA = S × 16/100; ISR = S × 10/100 (`isrRateBp` 1000) o S × 1.25/100 (`isrRateBp` 125); retención de IVA = S × 16/100 × 2/3 sobre el subtotal sin redondear; cada importe redondeado a centavos con 0.005 sube; total = subtotal + IVA − retIsr − retIva con importes ya redondeados; `FISICA` → ambas retenciones 0 (módulo ES sin dependencias del navegador, importable desde Node)
- [X] T008 Añadir en `public/js/calc.js` (después de T007): `formatMoney` (pesos MXN, coma de miles, punto decimal, ej. `$20,000.00`), validación de cantidad (entero en centésimas > 0, máximo 2 decimales) y de precio (> 0), validación básica de RFC (3 letras = persona moral o 4 = persona física, 6 dígitos, 3 de homoclave; letras pueden incluir Ñ y &; se acepta en minúsculas y se normaliza a mayúsculas; vacío válido solo para cliente), `formatFolio(year, n)` → `AAAA-NNN`, `addDays` y `isExpired(issueDate, today)` (vencida cuando hoy es posterior a emisión + 30 días naturales); `today` se recibe como parámetro
- [X] T009 Implementar `server/db.js`: abrir SQLite con `better-sqlite3` en `DB_PATH` (por defecto `data/cotizaciones.db`, creando la carpeta; acepta `:memory:`) y crear si no existen las tablas de data-model.md: `profile` (una fila `id = 1`; `name` obligatorio, `rfc` obligatorio en mayúsculas, `regime` `AEP` o `RESICO` obligatorio, `contact` opcional, `logo` opcional), `services` (`name` obligatorio, `price_cents` entero mayor que 0), `clients` (`name` obligatorio, `rfc` opcional, `type` `MORAL` o `FISICA` obligatorio), `quotes` (`folio` único `AAAA-NNN`, `issue_date`, copia `freelancer_*` y `client_*`, `isr_rate_bp` 1000 o 125), `quote_lines` (`quote_id` con borrado en cascada, `position`, `description` obligatorio, `quantity_hundredths` entero mayor que 0, `unit_price_cents` entero mayor que 0), `folio_counters` (`year` clave, `last_number`); activar claves foráneas
- [X] T010 [P] Crear `server/dates.js` con `todayInMexico()` (fecha `AAAA-MM-DD` en la zona `America/Mexico_City`) y `yearInMexico()`, aceptando una fecha inyectable para pruebas
- [X] T011 Crear `server/app.js` (FR-014, SC-005): función `createApp(db, { today })` que recibe la base y, opcionalmente, una función `today()` que devuelve la fecha `AAAA-MM-DD` (por defecto `todayInMexico()` de `server/dates.js`; las rutas la comparten) y devuelve la app Express con JSON (límite 2 MB), sirve `public/`, monta el router de `/api` (vacío por ahora), responde 404 en español y un manejador de errores que devuelve `{ "error": "mensaje en español de México" }` (400 validaciones, 500 mensaje genérico) según `contracts/api.md`
- [X] T012 Crear `server/index.js`: lee `PORT` (por defecto 3000) y `DB_PATH`, abre la base con `server/db.js`, arma la app con `server/app.js` y escucha; sin claves ni secretos
- [X] T013 [P] Crear `public/js/api.js`: funciones `get/post/put/del` con `fetch` a `/api`, que devuelven los datos o lanzan un error con el mensaje en español del servidor, y ante fallo de red lanzan "No hay conexión con el servidor. Intenta de nuevo."
- [X] T014 Crear `public/js/main.js`: navegación por `#` (`#/cotizaciones`, `#/cotizacion/nueva`, `#/cotizacion/:id`, `#/clientes`, `#/servicios`, `#/perfil`), montaje de la pantalla en `#app`, aviso visible de errores de conexión, y redirección a `#/perfil` si aún no hay perfil guardado
- [X] T015 [P] Crear `tests/helpers.js`: levanta la app de `server/app.js` con SQLite en memoria en un puerto libre y expone un cliente `fetch` para las pruebas de la API (FR-014, SC-005); acepta un `today` opcional que pasa a `createApp` y permite cambiarlo entre pruebas

**Checkpoint**: Cimientos listos; las historias pueden comenzar

---

## Phase 3: User Story 2 - Configurar mi perfil de freelancer (Priority: P1) 🎯 requisito de US1

**Goal**: El freelancer guarda su nombre, RFC, régimen (obligatorio), contacto y logo una sola vez.

**Independent Test**: Capturar el perfil, cerrar y reabrir la app; los datos siguen ahí. Perfil vacío o con RFC inválido no se guarda y explica qué falta.

### Tests for User Story 2

- [X] T016 [P] [US2] Pruebas de la API de perfil en `tests/profile.test.js` (escribir primero): `GET` devuelve `null` sin perfil; `PUT` sin nombre, RFC o régimen → 400 con mensaje; RFC inválido → 400; RFC en minúsculas se guarda en mayúsculas; régimen distinto de `AEP`/`RESICO` → 400; contacto y logo opcionales; el perfil persiste entre peticiones

### Implementation for User Story 2

- [X] T017 [US2] Implementar `server/routes/profile.js` (`GET /api/profile`, `PUT /api/profile` con las validaciones de data-model.md: `name` obligatorio, `rfc` obligatorio con formato básico, `regime` `AEP` o `RESICO` obligatorio, `contact` y `logo` opcionales) y montarlo en `server/app.js`
- [X] T018 [P] [US2] Crear `public/js/logo.js`: acepta solo PNG o JPG de hasta 2 MB (si no, mensaje claro), y lo reduce en un canvas a un ancho máximo de 400 px devolviendo texto base64 para enviarlo al servidor
- [X] T019 [US2] Crear `public/js/screens/profile.js`: formulario con nombre, RFC, régimen (opciones "Actividades Empresariales y Profesionales" y "RESICO"), contacto y logo (usa `logo.js`, con vista previa y opción de quitarlo); valida con `calc.js` antes de enviar, muestra qué falta y confirma "Perfil guardado"; añadir el estilo necesario a `public/css/styles.css`

**Checkpoint**: Perfil funcional y verificable por sí solo

---

## Phase 4: User Story 1 - Emitir una cotización correcta en PDF (Priority: P1) 🎯 MVP

**Goal**: Con perfil y cliente, crear una cotización, ver los totales calculados solos y descargar el PDF.

**Independent Test**: Con el perfil de US2, dar de alta un cliente en la propia cotización, agregar dos conceptos a mano ($15,000.00 y $5,000.00) y descargar el PDF; los importes coinciden con los tres ejemplos de la spec (19,066.67 / 20,816.67 / 23,200.00).

### Tests for User Story 1

- [X] T020 [P] [US1] Pruebas de clientes en `tests/clients.test.js` (escribir primero): `POST /api/clients` crea y `GET` lista; nombre y tipo obligatorios; tipo solo `MORAL` o `FISICA`; RFC inválido → 400; RFC vacío válido
- [X] T021 [P] [US1] Pruebas de cotizaciones en `tests/quotes.test.js` (escribir primero): `POST /api/quotes` sin perfil o sin régimen → 400; sin conceptos → 400 y sin consumir folio; cantidad 0, negativa o con más de 2 decimales → 400; cantidad 0.25 aceptada; primer folio `AAAA-001` y segundo `AAAA-002`; con `today` inyectado en el año siguiente, el primer folio es `AAAA-001` otra vez (SC-005); el folio de una cotización eliminada no se reutiliza; la cotización copia datos de perfil, cliente y `isr_rate_bp`; cambiar el régimen del perfil después no modifica cotizaciones existentes; los tres ejemplos de totales (moral AEP, moral RESICO, física) cuadran al centavo

### Implementation for User Story 1

- [X] T022 [US1] Implementar `server/routes/clients.js` con `GET /api/clients` y `POST /api/clients` (nombre o razón social obligatorio, RFC opcional con formato básico, tipo `MORAL` o `FISICA` obligatorio) y montarlo en `server/app.js`
- [X] T023 [US1] Implementar `server/routes/quotes.js` con `POST /api/quotes` (`clientId`, `lines`; exige perfil con régimen; rechaza `lines` vacío; valida cantidad y precio con `calc.js`; en una sola transacción copia perfil, cliente y tasa de ISR según régimen —`AEP` → 1000, `RESICO` → 125—, incrementa `folio_counters` del año de `today()` de la app (FR-013, FR-014), asigna el folio `AAAA-NNN`, fija `issue_date` y guarda los conceptos), `GET /api/quotes` (folio, cliente, fecha, total y `expired`) y `GET /api/quotes/:id` (con conceptos, totales calculados con `calc.js` y `expired`); montarlo en `server/app.js`
- [X] T024 [P] [US1] Crear `public/js/pdf.js`: arma el PDF con jsPDF según `contracts/pdf-cotizacion.md` (tamaño carta, logo si existe, "Cotización" y folio, fechas de emisión y vigencia en español, datos del freelancer con RFC y régimen, datos del cliente, tabla de conceptos con descripción, cantidad, precio unitario e importe que continúa en otra página si hace falta, desglose subtotal / IVA / retención de ISR / retención de IVA solo para persona moral / total destacado (FR-018; las retenciones se escriben con el guion normal `-` delante del importe, no con "−"; verificar que acentos y ñ se vean bien), importes con `formatMoney`, sin notas) y lo descarga como `Cotizacion-AAAA-NNN.pdf`
- [X] T025 [US1] Crear `public/js/screens/quote-editor.js` (modo nueva cotización): elegir cliente de la lista o darlo de alta ahí mismo (nombre, RFC opcional, tipo; se guarda en el catálogo), agregar conceptos escritos a mano (descripción, cantidad, precio), editar y eliminar cualquier concepto, totales en vivo con `calc.js` (subtotal, IVA, retenciones solo si es persona moral, total), validar cantidades y precios con mensajes claros, bloquear guardar y descargar sin conceptos con aviso, guardar con `POST /api/quotes` y mostrar el folio; sale sin guardar → se descarta sin consumir folio
- [X] T026 [US1] Tras guardar en `public/js/screens/quote-editor.js`, mostrar la cotización guardada con botón "Descargar PDF" (usa `pdf.js` con los datos del servidor) y enlazar la ruta `#/cotizacion/nueva` y `#/cotizacion/:id` en `public/js/main.js`
- [X] T027 [P] [US1] Añadir a `public/css/styles.css` los estilos del editor (lista de conceptos apilada en celular, totales siempre visibles, botones grandes) y revisar el uso en pantalla de celular

**Checkpoint**: US1 + US2 forman el MVP: se puede emitir una cotización correcta y descargar el PDF

---

## Phase 5: User Story 3 - Catálogo de servicios (Priority: P2)

**Goal**: Mantener servicios con precio por defecto y agregarlos a las cotizaciones.

**Independent Test**: Crear, editar y eliminar un servicio (con confirmación) y agregarlo a una cotización; cambiar luego su precio no altera cotizaciones existentes.

### Tests for User Story 3

- [X] T028 [P] [US3] Pruebas de servicios en `tests/services.test.js` (escribir primero): CRUD; nombre obligatorio; `priceCents` entero mayor que 0 (0 y negativos → 400); `DELETE` responde 204; cambiar el precio de un servicio no modifica una cotización ya guardada

### Implementation for User Story 3

- [X] T029 [US3] Implementar `server/routes/services.js` (`GET`, `POST`, `PUT /:id`, `DELETE /:id` de `/api/services`, con las validaciones de data-model.md) y montarlo en `server/app.js`
- [X] T030 [P] [US3] Crear `public/js/screens/services.js`: lista, alta y edición de servicios (precio en pesos con centavos, rechaza 0 y negativos), eliminación solo tras confirmación (cancelar no borra nada)
- [X] T031 [US3] En `public/js/screens/quote-editor.js` añadir "Agregar del catálogo": copia nombre y precio a un concepto nuevo, editable en esa cotización (no queda ligado al servicio)

**Checkpoint**: El catálogo de servicios funciona y se integra con el editor

---

## Phase 6: User Story 4 - Catálogo de clientes (Priority: P2)

**Goal**: Administrar los clientes guardados (ver, editar, eliminar) además de elegirlos o darlos de alta al cotizar.

**Independent Test**: Editar y eliminar clientes (con confirmación); una cotización existente conserva los datos del cliente con que se creó; cambiar un cliente a persona física solo afecta cotizaciones nuevas.

### Tests for User Story 4

- [X] T032 [P] [US4] Pruebas de administración de clientes en `tests/clients-catalog.test.js` (escribir primero): `PUT` y `DELETE` (204); editar o eliminar un cliente no cambia las cotizaciones ya guardadas; cambiar un cliente de `MORAL` a `FISICA` no altera cotizaciones existentes y la siguiente no aplica retenciones

### Implementation for User Story 4

- [X] T033 [US4] Añadir `PUT /api/clients/:id` y `DELETE /api/clients/:id` a `server/routes/clients.js` con las mismas validaciones
- [X] T034 [P] [US4] Crear `public/js/screens/clients.js`: lista, alta y edición de clientes (nombre o razón social, RFC opcional con validación, tipo persona moral o física) y eliminación solo tras confirmación (cancelar no borra nada)

**Checkpoint**: Catálogo de clientes completo

---

## Phase 7: User Story 5 - Consultar y administrar mis cotizaciones (Priority: P2)

**Goal**: Sección con todas las cotizaciones para abrir, editar, volver a descargar el PDF y eliminar; las vencidas se marcan.

**Independent Test**: Crear dos cotizaciones, reabrir la app, verlas en la lista, editar una (la fecha pasa a hoy y conserva el folio), volver a descargar su PDF y eliminar la otra con confirmación.

### Tests for User Story 5

- [X] T035 [P] [US5] Pruebas de edición y borrado en `tests/quotes-edit.test.js` (escribir primero): `PUT` renueva `issue_date` a hoy y conserva folio y `isr_rate_bp`; editar una vencida la deja de marcar como vencida; `PUT` con `lines` vacío → 400; cambiar de cliente al editar actualiza la copia del cliente pero no la tasa; `DELETE` responde 204 y el folio no se reutiliza; la lista marca `expired` según fecha de emisión (+30 días) usando una fecha de hoy inyectada; la lista incluye folio, cliente, fecha y total

### Implementation for User Story 5

- [X] T036 [US5] Añadir `PUT /api/quotes/:id` y `DELETE /api/quotes/:id` a `server/routes/quotes.js` (editar reemplaza los conceptos, renueva `issue_date` a `today()` de la app, conserva `folio` y `isr_rate_bp`, rechaza `lines` vacío; calcular `expired` en las lecturas con `isExpired`)
- [X] T037 [P] [US5] Crear `public/js/screens/quotes.js`: lista de cotizaciones (folio, cliente, fecha, total, etiqueta "vencida"), abrir, "Descargar PDF" de nuevo (usa `pdf.js`), editar y eliminar solo tras confirmación (cancelar no borra nada); pantalla de inicio de la app (`#/cotizaciones`) con botón "Nueva cotización"
- [X] T038 [US5] Añadir a `public/js/screens/quote-editor.js` el modo edición: carga la cotización con `GET /api/quotes/:id`, permite editar o eliminar conceptos y cambiar de cliente, recalcula con la tasa de ISR de la cotización (no la del perfil actual), avisa que la fecha de emisión se renueva al guardar y no permite guardar sin conceptos

**Checkpoint**: Todas las historias funcionan de forma independiente

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verificación final contra la spec y la constitución

- [X] T039 [P] Revisar en `public/` que todos los textos, mensajes de error y el PDF estén en español de México, con importes `$20,000.00` en todas las pantallas (FR-012, FR-021)
- [X] T040 [P] Revisar seguridad básica en `server/` y `public/js/`: todas las consultas SQL con parámetros (sin concatenar texto), contenido del usuario mostrado con `textContent` (nunca `innerHTML` con datos), y ningún secreto ni clave en el código (Principio V)
- [ ] T041 Probar en Chrome y Firefox, en escritorio y a 360 px de ancho, el flujo completo (perfil → cliente → cotización → PDF) y corregir lo que se vea mal en `public/css/styles.css`
- [ ] T042 Ejecutar `npm test` y recorrer `specs/001-cotizaciones-pro/quickstart.md` completo, incluyendo abrir la app desde otro dispositivo y apagar/encender el servidor; anotar y corregir cualquier diferencia contra los criterios SC-001 a SC-009
- [X] T043 Comprobar el arranque local con `PORT` y `DB_PATH` definidos: el archivo de datos se crea y los datos persisten tras reiniciar el servidor (FR-020)
- [ ] T044 Publicar el servidor en un hosting de Node.js con disco persistente (FR-020): definir comando de arranque `npm start`, versión de Node 22 o superior, `PORT` y `DB_PATH` apuntando al disco persistente (sin claves ni secretos); abrir la dirección pública desde el celular y repetir `quickstart.md` §1, §3 y §6; anotar la dirección en `quickstart.md` y recordar que no debe compartirse

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea todas las historias
- **US2 (Phase 3)**: depende de Foundational; US1 la necesita (sin perfil no hay cotizaciones)
- **US1 (Phase 4)**: depende de Foundational y US2
- **US3 (Phase 5)**: depende de Foundational; se integra con el editor de US1 (T031 depende de T025)
- **US4 (Phase 6)**: depende de T022 (rutas de clientes de US1)
- **US5 (Phase 7)**: depende de US1 (T023, T025, T024)
- **Polish (Phase 8)**: depende de las historias deseadas

### Dentro de Foundational

- T006 (pruebas) antes de T007 y T008; T007 antes de T008 (mismo archivo `calc.js`)
- T009 antes de T011 y T015; T011 antes de T012, T015 y los routers de las historias; T010 antes de T023

### Dentro de cada historia

- Las pruebas se escriben primero y deben fallar antes de implementar
- Rutas del servidor antes de las pantallas que las usan
- T023 antes de T025/T026; T024 antes de T026

### Parallel Opportunities

- Setup: T002, T003, T004 y T005 en paralelo tras T001
- Foundational: T006, T010, T013 y T015 en paralelo; T009 y T007/T008 son independientes entre sí
- Cada historia: sus tareas [P] de pruebas y las pantallas en archivos distintos
- Tras US1/US2, US3 y US4 pueden avanzar en paralelo (archivos distintos salvo T031)

---

## Parallel Example: User Story 1

```text
# Pruebas de US1 juntas:
Task: "Pruebas de clientes en tests/clients.test.js"
Task: "Pruebas de cotizaciones en tests/quotes.test.js"

# Piezas independientes de US1:
Task: "Crear public/js/pdf.js"
Task: "Estilos del editor en public/css/styles.css"
```

---

## Implementation Strategy

### MVP First (US2 + US1)

1. Phase 1: Setup
2. Phase 2: Foundational (crítica; deja `calc.js` probado al centavo)
3. Phase 3: US2 (perfil)
4. Phase 4: US1 (emitir y descargar PDF)
5. **PARAR Y VALIDAR**: pasos 1, 3 y 4 de `quickstart.md`; cifras 19,066.67 / 20,816.67 / 23,200.00
6. Publicar si se desea (recordando el disco persistente y que no hay contraseña)

### Incremental Delivery

1. MVP (US2 + US1) → validar → publicar
2. US3 (catálogo de servicios) → validar
3. US4 (administración de clientes) → validar
4. US5 (lista y edición de cotizaciones) → validar
5. Polish y validación completa de `quickstart.md`

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes
- La etiqueta [Story] enlaza cada tarea con la historia de la spec
- Cada historia debe poder completarse y probarse por sí sola (con las dependencias anotadas arriba)
- Verificar que las pruebas fallen antes de implementar
- Confirmar con el dueño del producto antes de añadir cualquier cosa que no esté en la spec (Principio III)
- Evitar: tareas vagas, conflictos en el mismo archivo, funcionalidad nueva sin spec
