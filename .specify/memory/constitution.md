<!--
Sync Impact Report
- Version change: 1.0.0 → 1.0.1 (PATCH: el producto se renombra de PresupuestosPro a CotizacionesPro)
- Principios modificados: ninguno (constitución inicial)
- Secciones añadidas: Principios Fundamentales (5), Restricciones del Producto, Forma de Trabajo, Gobernanza
- Secciones eliminadas: ninguna
- TODOs pendientes: ninguno
-->

# CotizacionesPro Constitution

CotizacionesPro es una herramienta web para que freelancers generen presupuestos en PDF.

## Core Principles

### I. Simplicidad ante todo
Entre dos soluciones, SIEMPRE se elige la más simple. Esta es una versión 1: está
prohibido añadir complejidad anticipada (opciones, capas o preparativos "por si acaso").
Cualquier complejidad extra MUST justificarse por escrito con una necesidad actual de la spec.

### II. Idioma y mercado
Todo el producto (textos, mensajes, errores, PDF generado) MUST estar en español de México.
La moneda es el peso mexicano (MXN) y los importes MUST mostrarse con ese formato
(por ejemplo, $1,250.00 MXN). No se admiten otros idiomas ni monedas.

### III. Cero alcance fantasma
NO se implementa ninguna funcionalidad que no esté escrita en la spec. Si surge una idea
nueva, se propone (se añade a la spec o se anota como sugerencia) y NO se construye hasta
que sea aprobada.

### IV. Verificable por una persona no técnica
Cada criterio de éxito MUST poder comprobarse usando la app, sin leer código ni usar
herramientas de programación. Un criterio que no se pueda verificar así se reescribe.

### V. Datos del usuario con respeto
Se piden solo los datos imprescindibles para generar el presupuesto. NO se introducen
claves, contraseñas ni secretos en el código ni en el repositorio.

## Restricciones del Producto

- El alcance del producto es únicamente el definido en la spec vigente.
- Los datos que el usuario captura MUST usarse solo para generar su presupuesto.

## Forma de Trabajo

- Toda tarea MUST poder rastrearse a un requisito de la spec (Principio III).
- Antes de dar algo por terminado, se comprueba cada criterio de éxito usando la app
  (Principio IV).
- Las revisiones MUST verificar el cumplimiento de estos principios.

## Governance

Esta constitución prevalece sobre cualquier otra práctica del proyecto. Para enmendarla se
requiere dejar el cambio por escrito y la aprobación de la persona dueña del producto.
Versionado semántico: MAJOR si se elimina o redefine un principio; MINOR si se añade un
principio o se amplía materialmente; PATCH para aclaraciones de redacción. Cada plan y
revisión MUST confirmar que cumple los principios.

**Version**: 1.0.1 | **Ratified**: 2026-10-16 | **Last Amended**: 2026-10-19
