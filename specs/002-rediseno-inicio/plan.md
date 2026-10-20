# Implementation Plan: Página de inicio y rediseño visual

**Branch**: `002-rediseno-inicio` | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-rediseno-inicio/spec.md`

## Summary

Cambio solo de presentación sobre la aplicación de la spec 001. Se añade una pantalla de inicio
(resumen de cotizaciones vigentes y vencidas, calculado en el navegador con la lista que la API ya
entrega), una navegación común que se adapta al ancho de pantalla y un sistema visual único
(colores, tipografía y espaciado definidos en un solo sitio, con componentes reutilizables). El
PDF toma sus colores de ese mismo sitio, así que pantallas y PDF comparten identidad sin duplicar
valores. Servidor, API, esquema de datos, cálculos y pruebas existentes no se tocan.

## Technical Context

**Stack, convenciones y estructura**: los de [`001-cotizaciones-pro/plan.md`](../001-cotizaciones-pro/plan.md)
y [`data-model.md`](../001-cotizaciones-pro/data-model.md), sin cambios. Esta feature no añade
dependencias, ni fuentes externas, ni pasos de compilación.

**Alcance técnico**: solo `public/` (HTML, CSS y JavaScript de las pantallas y `pdf.js`) y una
prueba nueva en `tests/`. No se modifica nada de `server/`, `calc.js`, `data/` ni las pruebas
existentes.

**Testing**: las pruebas actuales (`npm test`) deben pasar sin editarse (SC-006). Se añade una
prueba para la única lógica nueva (contar vigentes y vencidas); lo visual se verifica a mano con
`quickstart.md` (Principio IV).

**Constraints**: mobile-first (360 px sin desplazamiento horizontal); español de México e importes
`$20,000.00`; contraste de texto mínimo 4.5:1; Chrome y Firefox vigentes; sin recursos externos en
producción (tipografía del sistema).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|-----------|------------|--------|
| I. Simplicidad ante todo | Sin librerías ni compilación (PrimeNG solo como referencia visual). Un solo lugar para el tema; sin sistema de temas ni variantes "por si acaso" | Pasa |
| II. Idioma y mercado | Todos los textos nuevos en español de México; importes sin cambios. La petición de español de España se descartó por decisión del dueño (spec, Clarificaciones) | Pasa |
| III. Cero alcance fantasma | Solo lo que dice la spec 002. Los estilos de Borrador/Enviado/Aceptado/Rechazado se dejan como colores reservados (FR-012) y no se muestran ni se conectan a datos | Pasa |
| IV. Verificable por no técnicos | Cada criterio se comprueba mirando la app y el PDF (`quickstart.md`); contraste y pruebas automáticas quedan como apoyo técnico, no como criterio de éxito | Pasa |
| V. Datos con respeto | No se piden ni guardan datos nuevos; sin analítica ni recursos de terceros | Pasa |

Re-evaluación tras el diseño (Fase 1): sin cambios. No hay entradas en Complexity Tracking.

## Decisiones importantes, en lenguaje de negocio

| Decisión | Qué significa para el negocio | Alternativa descartada |
|----------|-------------------------------|------------------------|
| El resumen del inicio se calcula con la lista de cotizaciones que ya existe | Las cifras del inicio siempre coinciden con la lista; no cambia el servidor ni los datos | Nuevo servicio de resumen en el servidor: más piezas y riesgo de que no coincida |
| Colores y tipografía definidos una sola vez, y el PDF los lee de ahí | Cambiar un color cambia pantallas y PDF a la vez | Repetir los colores en el PDF: se desalinearían con el tiempo |
| Navegación inferior en celular y superior en escritorio | Alcanzable con el pulgar en el celular; clásica en escritorio | Menú de hamburguesa: oculta las secciones y exige un toque más |
| Tipografía del sistema, sin fuentes de internet | Carga inmediata y sin depender de terceros; el aspecto varía levemente entre dispositivos | Descargar una fuente (p. ej. la de PrimeNG): más peso y archivos |
| El PDF mantiene su fuente actual (Helvetica) | Mismo contenido y legibilidad garantizada con acentos y ñ; la identidad viene de la jerarquía y el color | Incrustar otra fuente: archivos grandes y riesgo con ñ y acentos |
| Estados solo Vigente y Vencida | No hay datos ni funciones nuevas; los otros cuatro estados quedan para una spec futura | Añadir los cinco estados: cambia datos y alcance de la spec 001 |

## Project Structure

### Documentation (this feature)

```text
specs/002-rediseno-inicio/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (sin cambios de datos)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── ui-shell.md          # rutas, navegación e inicio
│   ├── design-system.md     # colores, tipografía, espaciado y componentes
│   └── pdf-visual.md        # cambios visuales del PDF (contenido sin cambios)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

Se respeta la estructura de la spec 001; solo cambian o se añaden estos archivos:

```text
public/
├── index.html             # CAMBIA: navegación común (incluye Inicio) y marcas para la barra inferior
├── css/styles.css         # CAMBIA: tokens en :root + estilos de componentes (único lugar del tema)
└── js/
    ├── main.js            # CAMBIA: ruta #/inicio como predeterminada; resalta la sección activa
    ├── ui.js              # CAMBIA: ayudas de componentes (botón, etiqueta de estado, campo)
    ├── summary.js         # NUEVO: cuenta vigentes y vencidas de una lista (función pura)
    ├── pdf.js             # CAMBIA: solo presentación; lee colores de los tokens
    └── screens/           # CAMBIAN todas para usar los componentes; se añade home.js
tests/
└── summary.test.js        # NUEVO: prueba del conteo
```

**Sin cambios**: `server/`, `public/js/calc.js`, `public/js/api.js`, `data/`, pruebas existentes.

**Structure Decision**: sin carpetas nuevas. El tema vive en `styles.css` (sección de tokens al
inicio); `pdf.js` lo consulta en tiempo de ejecución. `summary.js` es independiente del navegador
para poder probarse con `node --test`, como `calc.js`.

## Complexity Tracking

Sin violaciones de la constitución que justificar.
