# Implementation Plan: Exportar todas las cotizaciones en un .zip

**Branch**: `003-export-zip-backup` | **Date**: 2026-10-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-export-zip-backup/spec.md`

## Summary

Un botón «Exportar todo (.zip)» en la lista de cotizaciones descarga un único .zip con un PDF por
cotización y el archivo `datos-cotizaciones.json`. Un endpoint nuevo de solo lectura
(`GET /api/backup`) entrega en una sola respuesta todo lo que hay en la base: perfil, servicios,
clientes, cotizaciones completas y contadores de folio. El navegador usa esas mismas cotizaciones para
generar cada PDF con la misma función que ya produce el PDF individual (`pdf.js` se refactoriza para
separar «armar» de «guardar»), así que el contenido y los importes son los mismos. El .zip se arma en
el navegador con JSZip como archivo local en `public/vendor/`, igual que jsPDF.

## Technical Context

**Stack, convenciones y estructura**: los de [`001-cotizaciones-pro/plan.md`](../001-cotizaciones-pro/plan.md)
y [`data-model.md`](../001-cotizaciones-pro/data-model.md). Sin cambios en el esquema de datos.

**Language/Version**: JavaScript (Node.js ≥ 22; módulos ES en el navegador), sin compilación

**Primary Dependencies**: se añade `JSZip 3.10.1` como archivo local en `public/vendor/jszip.min.js`
(licencia MIT, sin dependencias propias). Nada nuevo en `package.json`.

**Storage**: SQLite existente; solo lectura. No se crean tablas ni columnas.

**Testing**: `node --test`:
- API de `/api/backup` contra base en memoria (contenido completo, vacío, no modifica nada).
- Función pura de nombres de archivo (`public/js/backup.js`).
El .zip, los PDF y la barra de progreso se verifican a mano con `quickstart.md` (Principio IV).

**Target Platform**: Chrome y Firefox vigentes, escritorio y 360 px de ancho

**Project Type**: aplicación web (servidor Express + páginas estáticas)

**Performance Goals**: 50 cotizaciones sin congelar la pantalla (indicador de avance que se
actualiza); 200 cotizaciones terminan sin error. Sin meta de tiempo fija: lo que importa es que se vea
que trabaja (spec, Historia 4).

**Constraints**: español de México; texto con `textContent` (`el()`); componentes de `ui.js`; sin
valores sueltos de estilo; un .zip incompleto nunca se descarga (FR-012).

**Scale/Scope**: una persona, hasta ~200 cotizaciones; logo ≤ 400 px de ancho, así que el JSON sigue
siendo pequeño aunque cada cotización traiga su copia del logo.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|-----------|------------|--------|
| I. Simplicidad ante todo | Un endpoint, un módulo de navegador pequeño y una librería local. Sin formatos extra, sin selección parcial, sin carpetas dentro del .zip. JSZip en lugar de escribir un escritor de .zip propio (ver research.md, decisión 1) | Pasa |
| II. Idioma y mercado | Botón, avisos y errores en español de México; los PDF son los existentes (MXN) | Pasa |
| III. Cero alcance fantasma | Cada pieza traza a un FR de la spec (tabla abajo). Sin importar, sin CSV, sin copias automáticas. Los contadores de folio entran por FR-006 (restauración futura) | Pasa |
| IV. Verificable por persona no técnica | `quickstart.md` usa solo la app y el explorador de archivos | Pasa |
| V. Datos con respeto | Solo datos que la app ya guarda; el .zip va únicamente al equipo de la persona. Sin claves ni secretos | Pasa |
| Restricciones del Producto | El .zip solo devuelve a la persona sus propios datos, lo que la constitución 1.0.2 admite expresamente («devolvérselos a esa misma persona, por ejemplo en una copia de seguridad»). El alcance es el de esta spec | Pasa |

Re-evaluación tras el diseño (Phase 1): sin cambios, todos pasan. Sin entradas en Complexity Tracking.

**Nota sobre la constitución**: la restricción de uso de datos se aclaró en la versión 1.0.2 (PATCH, aprobada
por la persona dueña el 2026-10-21) para admitir copias de seguridad que se devuelven a la misma persona.
Además, la 001 guarda los datos en SQLite del servidor (en uso local, el mismo equipo); no afecta a esta feature.

### Trazabilidad spec → diseño

| Requisito | Dónde se cumple |
|-----------|-----------------|
| FR-001 botón visible | `screens/quotes.js`: acción en `pageHeader` junto a «Nueva cotización» |
| FR-002, FR-003 un .zip, un PDF por cotización | `backup.js` recorre `quotes` del endpoint |
| FR-004 PDF idéntico | `pdf.js`: `buildQuotePdf` compartida; mismos datos que `GET /api/quotes/:id` |
| FR-005, FR-005a, FR-006 archivo de datos | `contracts/api-backup.md`, `contracts/zip-layout.md` |
| FR-007 nombre del .zip | `zipFileName(date)` con la fecha de México que da el servidor |
| FR-008, FR-009 nombre de PDF | `pdfEntryName(folio, clientName)` |
| FR-010 sin cotizaciones | Aviso en el cliente cuando `quotes` viene vacío; no se crea el .zip |
| FR-011 trabajando | Botón deshabilitado con «Exportando… N de M» |
| FR-012 error | Cualquier fallo aborta, `aviso()` con el mensaje, sin descarga |
| FR-013 solo lectura | Endpoint solo con `SELECT`; prueba de que nada cambia |
| FR-014 español | Textos en `backup.js` y `quotes.js` |

## Project Structure

### Documentation (this feature)

```text
specs/003-export-zip-backup/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── api-backup.md
│   └── zip-layout.md
└── tasks.md             # lo crea /speckit-tasks
```

### Source Code (repository root)

```text
server/
└── routes/
    ├── backup.js        # NUEVO: GET /  (solo lectura)
    ├── index.js         # monta /backup
    └── quotes.js        # exporta `createQuoteSerializer(db, today)` para reutilizar `serialize` (sin cambiar su comportamiento)

public/
├── vendor/
│   └── jszip.min.js     # NUEVO: archivo local
├── js/
│   ├── backup.js        # NUEVO: nombres (puros) + exportAll(): pide datos, arma PDFs y .zip, descarga
│   ├── pdf.js           # buildQuotePdf(quote) → doc; downloadQuotePdf la usa y guarda
│   └── screens/quotes.js# botón «Exportar todo (.zip)»
└── index.html           # carga jszip.min.js junto a jspdf

tests/
├── backup.test.js       # NUEVO: API /api/backup
└── backup-names.test.js # NUEVO: nombres de archivo
```

**Structure Decision**: se mantiene la estructura de la 001 (servidor Express + `public/`). El código
nuevo cabe en un módulo de navegador, una ruta y dos archivos de prueba. `calc.js`, el esquema de datos
y el comportamiento de las rutas existentes no se tocan; `quotes.js` solo expone la serialización que ya
tiene.

## Complexity Tracking

Sin violaciones de la constitución que justificar. Único añadido externo: JSZip (research.md, decisión 1).
