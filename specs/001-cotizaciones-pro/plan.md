# Implementation Plan: CotizacionesPro v0 (México)

**Branch**: `001-cotizaciones-pro` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-cotizaciones-pro/spec.md`

## Summary

CotizacionesPro es una aplicación web con un servidor pequeño: Node.js + Express sirve las
pantallas y una API mínima, y SQLite guarda los datos del freelancer en un solo archivo. Es de un
solo usuario, sin cuentas ni contraseña (decisión del dueño del producto), y se usa desde
cualquier dispositivo con la misma dirección. El PDF se genera en el dispositivo y los cálculos de
dinero (IVA, retenciones, redondeo) viven en un módulo único, probado con los ejemplos de la
spec, que usan tanto el servidor como la pantalla.

## Technical Context

**Language/Version**: JavaScript (Node.js 22 LTS o superior); pantallas en HTML, CSS y
JavaScript estándar, sin framework ni compilación

**Primary Dependencies**: `express` (servidor), `better-sqlite3` (base de datos) y `jsPDF`
(PDF, como archivo local en el proyecto)

**Storage**: SQLite, un archivo (`data/cotizaciones.db`) en un disco que no se borre entre
reinicios del servidor

**Testing**: pruebas automáticas con el ejecutor incluido en Node.js (`node --test`): cálculo y
reglas, y la API contra una base en memoria; el resto, a mano con `quickstart.md`

**Target Platform**: servidor Node.js en un hosting con disco persistente; navegadores Chrome y
Firefox vigentes, en escritorio y celular

**Project Type**: aplicación web (servidor + páginas servidas por el mismo servidor)

**Performance Goals**: pantallas y totales instantáneos para el uso esperado (decenas de
cotizaciones); PDF descargado en menos de 3 segundos

**Constraints**: un solo usuario, sin cuentas ni contraseña; sin claves ni secretos en el código
(solo ajustes de entorno: `PORT` y `DB_PATH`); sin pasos de compilación; requiere conexión al
servidor para usarse; la zona horaria de las fechas es la Ciudad de México

**Scale/Scope**: un freelancer; 6 pantallas (inicio, cotizaciones, editor de cotización,
clientes, servicios, perfil); cientos de registros como máximo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|-----------|------------|--------|
| I. Simplicidad ante todo | Servidor mínimo (Express) y un archivo SQLite; sin framework de pantallas, sin compilación, sin cuentas. La solución más simple sería guardar en el navegador, pero se descartó por decisión del dueño (acceso desde cualquier dispositivo) | Pasa con justificación (ver Complexity Tracking) |
| II. Idioma y mercado | Textos, mensajes, errores del servidor y PDF en español de México; moneda MXN con formato `$20,000.00` | Pasa |
| III. Cero alcance fantasma | Solo lo escrito en la spec; sin cuentas, exportar/respaldar, modo oscuro ni instalación como app | Pasa |
| IV. Verificable por no técnicos | Cada criterio de éxito se prueba usando la app; `quickstart.md` son pasos en pantalla | Pasa |
| V. Datos con respeto | Solo datos imprescindibles; sin analítica, claves ni secretos en el código. **Riesgo aceptado**: sin contraseña, quien tenga la dirección ve los datos (incluido RFC de clientes); documentado en la spec | Pasa con riesgo aceptado |

Re-evaluación tras el diseño (Fase 1): sin cambios; la API tiene los endpoints mínimos que la spec
exige y no se añadió nada más.

## Decisiones importantes, en lenguaje de negocio

| Decisión | Qué significa para el negocio | Alternativa descartada |
|----------|-------------------------------|------------------------|
| Servidor Node.js + Express con SQLite (pedido del dueño) | Los datos viven en el servidor y se ven igual desde el celular y la computadora; un solo archivo fácil de respaldar | Guardar en el navegador: más simple, pero cada dispositivo vería datos distintos |
| Un solo usuario, sin contraseña | Sin pantallas de registro ni inicio de sesión; entrar es abrir la dirección. **Riesgo**: quien la tenga puede ver y cambiar todo; no compartirla | Contraseña única o cuentas: descartadas por el dueño; fuera de alcance de v0 |
| Hosting con disco que se conserva | El archivo de datos no se borra al reiniciar; hay que elegir un hosting con "volumen" o disco persistente y hacer copias periódicas del archivo | Hosting gratuito con disco temporal: perdería todos los datos en cada reinicio |
| Dinero en centavos enteros | Los totales cuadran siempre al centavo (por ejemplo, $2,133.33) | Decimales normales: pueden dar $2,133.34 o $2,133.333 |
| Un solo módulo de cálculo para servidor y pantalla | Las cifras de la pantalla, del PDF y de la lista son siempre las mismas | Calcular por separado: riesgo de que no coincidan |
| PDF creado en el dispositivo | Descarga inmediata, sin trabajo extra del servidor | PDF en el servidor: más piezas sin necesidad |
| Fechas y folios con hora de la Ciudad de México | El año del folio y el "vencida" no cambian por la hora del servidor | Hora del servidor: un folio de 31 de diciembre podría quedar en el año siguiente |
| Pruebas automáticas del cálculo y de la API | Lo que más duele equivocar (impuestos) y el guardado de datos quedan protegidos; el resto se revisa en pantalla | Pruebas para todo: más trabajo del que merece una v1 |
| Logo reducido automáticamente | Se sube cualquier foto razonable sin llenar el almacenamiento | Pedir un tamaño exacto |

## Project Structure

### Documentation (this feature)

```text
specs/001-cotizaciones-pro/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── api.md
│   ├── calculo-cotizacion.md
│   └── pdf-cotizacion.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
package.json               # dependencias (express, better-sqlite3) y comandos start/test
server/
├── index.js               # arranque: lee PORT y DB_PATH, escucha
├── app.js                 # arma Express: sirve public/ y monta la API
├── db.js                  # abre SQLite y crea las tablas si no existen
└── routes/                # perfil, servicios, clientes y cotizaciones
public/                    # lo que ve el navegador
├── index.html             # página única; navegación por #
├── css/styles.css         # diseño adaptable (primero celular)
├── js/
│   ├── main.js            # arranque y navegación
│   ├── api.js             # llamadas al servidor
│   ├── calc.js            # IVA, retenciones, redondeo, folio, vigencia, validaciones (compartido con el servidor)
│   ├── pdf.js             # arma el PDF de una cotización
│   └── screens/           # perfil, servicios, clientes, cotizaciones, editor
└── vendor/jspdf.umd.min.js
data/                      # archivo SQLite (fuera de git)
tests/
├── calc.test.js           # ejemplos de la spec
└── api.test.js            # guardado, folios y reglas contra base en memoria
```

**Structure Decision**: un solo proyecto con servidor y páginas estáticas servidas por el mismo
servidor. `calc.js` está en `public/js/` y el servidor lo importa, para tener una sola copia de
las reglas de dinero. `data/` no se publica ni se versiona.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Servidor Express + base SQLite (Principio I) | El dueño del producto pidió esa pila y que los datos sean accesibles desde cualquier dispositivo | Guardar en el navegador es más simple pero cada dispositivo tendría datos distintos; descartado por decisión explícita |
| Sin contraseña (Principio V) | Decisión del dueño; la spec dice sin inicio de sesión | Contraseña única: propuesta y rechazada por el dueño; se documenta el riesgo |
