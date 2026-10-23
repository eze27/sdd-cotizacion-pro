# Implementation Plan: Página de inicio y dirección visual «Despacho»

**Branch**: `002-rediseno-visual-despacho` | **Date**: 2026-10-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-rediseno-inicio/spec.md` (revisión 2)

**Note**: Este plan reemplaza al de la revisión 1, que sigue consultable en `main` (`git show main:specs/002-rediseno-inicio/plan.md`).

## Summary

Reemplazar el sistema visual de la revisión 1 —tokens por defecto de framework— por la identidad «Despacho» en `public/css/styles.css`, que es el único lugar de definición, y propagarla a las seis pantallas y al PDF sin tocar una sola línea de lógica. El trabajo es de tres tipos:

1. **Sustituir los tokens** (color, tipografía, escala, espaciado, forma, elevación, densidad, movimiento) y añadir los que faltaban, de modo que las pantallas hereden la identidad sin editarse una por una.
2. **Cerrar huecos de componente** que la revisión 1 dejó: estado pulsado, hueco reservado durante la carga, campo marcado como inválido, avisos cerrables, y un componente de confirmación propio que sustituye a `window.confirm`.
3. **Rehacer la presentación del PDF** en `public/js/pdf.js`, que ya lee los colores de los tokens con `getComputedStyle`, añadiendo el serif estándar de jsPDF para títulos y folio, sin incrustar tipografías.

El enfoque es deliberadamente conservador: la mayor parte del resultado se consigue cambiando el bloque `:root` y las reglas de componente de `styles.css`. Los módulos de pantalla se tocan solo donde el cambio es estructural (tres acciones por fila en lugar de cuatro, hueco reservado en Inicio, campo inválido, confirmación).

## Technical Context

**Language/Version**: JavaScript (módulos ES, sin transpilar) y CSS; Node.js ≥ 22 solo para el servidor, que no se toca.

**Primary Dependencies**: ninguna nueva. Las existentes (`express`, `better-sqlite3` en servidor; `jspdf` y `jszip` como archivos locales en `public/vendor/`) quedan intactas. Se añaden **archivos de tipografía** al repositorio, que no son dependencias de red ni de paquete.

**Storage**: SQLite (`data/cotizaciones.db`). **No se toca**: ni esquema, ni consultas, ni datos.

**Testing**: `npm test` (`node --test`) cubre cálculo, API y `summary.js`. Esta feature **no cambia nada de lo que esas pruebas cubren**, así que deben seguir pasando sin modificarse: es una comprobación de no-regresión, no de la feature. La verificación propia es manual, con `quickstart.md`.

**Target Platform**: Chrome y Firefox vigentes, en escritorio (1280–1440 px) y celular (360–430 px).

**Project Type**: aplicación web de un solo usuario, sin framework ni compilación; HTML, CSS y módulos ES servidos tal cual desde `public/`.

**Performance Goals**: inicio y lista sin espera apreciable; PDF en menos de 3 s (SC-009); el PDF no crece más de un 20 % (SC-031). El peso añadido de tipografías es de unos 150–250 KB en la primera visita, luego en caché.

**Constraints**:
- Un solo lugar de definición del tema: el bloque `:root` de `public/css/styles.css`. Ningún valor suelto en componentes.
- `pdf.js` lee los colores de ahí con `getComputedStyle`; prohibido duplicar códigos de color.
- Sin framework, sin paso de compilación, sin gestor de paquetes en el frontend, sin red externa.
- Texto siempre con `textContent` (la ayuda `el()`), nunca `innerHTML` con datos.
- Usable a 360 px sin desplazamiento horizontal.
- Contraste ≥ 4.5:1 en texto y ≥ 3:1 en bordes de control y foco.

**Scale/Scope**: 6 pantallas, 1 plantilla de PDF, ~974 líneas de frontend hoy. Archivos previstos: `styles.css` (reescritura del tema y de las reglas de componente), `ui.js` (componentes y confirmación), `pdf.js` (presentación), `screens/home.js`, `screens/quotes.js`, `screens/quote-editor.js` (cambios localizados), `index.html` (enlace de tipografías), y `public/fonts/` (nuevo).

## Constitution Check

*GATE: debe pasar antes de la Fase 0. Re-evaluado tras la Fase 1.*

Constitución 1.0.2.

| Principio | Evaluación | Estado |
|-----------|-----------|--------|
| **I. Simplicidad ante todo** | El grueso del cambio es sustituir tokens en un solo bloque, que es la opción más simple que logra el objetivo. El componente de confirmación reutilizable (FR-024a) parecía una excepción, pero **no lo es**: el producto ya confirma en tres sitios (`quotes.js`, `clients.js`, `services.js`), así que reutilizar es la opción simple y hacerlo tres veces a medida sería la compleja. Queda anotado en Complexity Tracking como decisión, no como violación. | ✅ PASA |
| **II. Idioma y mercado** | Ningún texto se traduce ni se reescribe (FR-018). Los importes conservan el formato `$20,000.00`. Los textos nuevos del componente de confirmación van en español de México. | ✅ PASA |
| **III. Cero alcance fantasma** | Todo el trabajo se rastrea a un FR. Las tentaciones descartadas están escritas como fuera de alcance: modo oscuro, iconos, menú de acciones, tercera familia tipográfica, plantillas alternativas de PDF. | ✅ PASA |
| **IV. Verificable por una persona no técnica** | Los 32 criterios de éxito se comprueban abriendo la aplicación y mirando el PDF. Dos usan herramientas de consulta, no de programación: un comprobador de contraste (SC-014) y el tamaño del archivo en el explorador (SC-031). | ✅ PASA |
| **V. Datos del usuario con respeto** | No se piden datos nuevos, no se añaden claves ni secretos, no se incorpora ningún servicio externo: las tipografías son archivos del repositorio. | ✅ PASA |

**Restricciones del producto**: el alcance es el de la spec; los datos siguen usándose solo para generar la cotización de su dueño. ✅

**Forma de trabajo**: cada tarea se rastreará a un FR en `tasks.md`; la verificación se hará con `quickstart.md` antes de dar algo por terminado. ✅

### Re-evaluación tras la Fase 1

Los artefactos de diseño no introdujeron ninguna violación nueva. La excepción al Principio I sigue siendo una sola y sigue acotada a un componente. El contrato `design-system.md` refuerza el Principio I al dejar el tema en un único bloque y prohibir valores sueltos. ✅ **La puerta sigue pasando.**

## Project Structure

### Documentation (this feature)

```text
specs/002-rediseno-inicio/
├── spec.md                      # Revisión 2 (reescrita)
├── plan.md                      # Este archivo
├── research.md                  # Fase 0 (reescrito en la revisión 2)
├── data-model.md                # Fase 1 (reescrito en la revisión 2)
├── quickstart.md                # Fase 1 (reescrito en la revisión 2)
├── contracts/
│   ├── design-system.md         # Reemplazado por completo: tokens «Despacho»
│   ├── ui-shell.md              # Revisado: densidad y altura de navegación
│   └── pdf-visual.md            # Reemplazado: presentación «Despacho» del PDF
├── checklists/
│   ├── requirements.md          # Calidad de la spec (todo en verde)
│   └── ux.md                    # De la revisión 1; se revalida al final
├── baseline-hashes.txt          # DE LA REVISIÓN 1 — hay que recapturar
├── baseline-pdf-text.txt        # DE LA REVISIÓN 1 — hay que recapturar
└── tasks.md                     # Fase 2 (/speckit-tasks, no lo crea este comando)
```

### Source Code (repository root)

```text
public/
├── index.html                   # Enlaza las tipografías locales
├── css/
│   └── styles.css               # Tema «Despacho» en :root + reglas de componente
├── fonts/                       # NUEVO: tipografías locales (serif + sans)
├── js/
│   ├── ui.js                    # Componentes + confirmación propia + estado inválido
│   ├── pdf.js                   # Presentación del PDF (contenido intacto)
│   ├── main.js                  # Sin cambios previstos
│   ├── api.js                   # Sin cambios
│   ├── calc.js                  # PROHIBIDO TOCAR
│   ├── summary.js               # Sin cambios
│   ├── backup.js                # Sin cambios
│   ├── logo.js                  # Sin cambios
│   └── screens/
│       ├── home.js              # Hueco reservado durante la carga
│       ├── quotes.js            # Tres acciones por fila + confirmación
│       ├── quote-editor.js      # Campo inválido + panel de totales
│       ├── clients.js           # Confirmación; resto heredado del tema
│       ├── services.js          # Confirmación; resto heredado del tema
│       └── profile.js           # Resto heredado del tema
└── vendor/                      # jspdf, jszip: sin cambios

server/                          # PROHIBIDO TOCAR
test/                            # Sin cambios: comprobación de no-regresión
```

**Structure Decision**: se conserva íntegra la estructura existente. La única carpeta nueva es `public/fonts/`, junto a `public/vendor/`, por el mismo criterio: recursos de terceros servidos desde el propio producto, sin red. No se introduce ninguna capa, ningún sistema de construcción y ningún módulo nuevo salvo lo que quepa en `ui.js`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Componente de confirmación propio, con tres usos hoy (FR-024a) | El cuadro del navegador rompe la identidad justo en el momento irreversible del producto (borrar) y muestra `localhost:3000` al usuario. Decisión expresa de la persona dueña el 2026-10-22. **Con tres sitios de llamada ya existentes, el componente reutilizable es la opción más simple**, no la más compleja: el coste real no es la reutilización sino el comportamiento accesible (foco atrapado, escape, retorno del foco), y escribirlo tres veces lo triplicaría | **Conservar `window.confirm`**: cero trabajo, pero deja el criterio sin cumplir y la identidad rota en el peor sitio. **Hacerlo a medida en cada pantalla**: triplica el comportamiento accesible y sus formas de fallar |
| Tres tramos de pantalla en lugar de uno (FR-025) | La revisión 1 aplicaba medidas táctiles de celular en monitores de 1440 px: filas de ~68 px donde caben de 40 px. Es la causa directa de SC-023 (14 filas) | **Un solo tramo**: es lo que hay hoy y es precisamente el defecto que la spec corrige. **Dos tramos**: no permite separar «aparece la tabla» (768 px) de «la tabla se vuelve compacta» (1024 px), y mezclar ambas cosas en un tramo deja el portátil con densidad táctil |
| Carpeta `public/fonts/` con archivos de tipografía | FR-014c exige que la identidad no dependa de ningún servicio externo, y la identidad «Despacho» no es alcanzable con tipografías del sistema (el serif con autoridad es la mitad de la dirección) | **Tipografías del sistema**: devuelve el producto al punto de partida, que es el defecto que esta revisión corrige. **Servirlas desde un CDN**: añade dependencia de red en producción, prohibido por FR-014c y por el criterio del proyecto con jsPDF y JSZip |

Las tres quedan dentro de lo que el Principio I permite cuando hay una necesidad escrita y actual; ninguna es una violación. Ninguna añade opciones «por si acaso»: no hay temas configurables, ni variantes de plantilla, ni capas de abstracción.
