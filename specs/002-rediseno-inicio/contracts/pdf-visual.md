# Contrato: presentación visual del PDF

Revisión 2, 2026-10-22. **Reemplaza** al contrato de la revisión 1 (consultable en `main`).

**Contenido, orden y reglas sin cambios** respecto de
[`001/contracts/pdf-cotizacion.md`](../../001-cotizaciones-pro/contracts/pdf-cotizacion.md): mismos
bloques, mismos importes, retenciones solo para persona moral con guion normal `-`, sin notas, archivo
`Cotizacion-AAAA-NNN.pdf`, carta vertical, español de México. Este contrato solo describe cómo se ve.

## Colores y tipografía

- Los colores salen de los tokens de [`design-system.md`](design-system.md), leídos al generar el PDF
  con `getComputedStyle`: `--color-primary`, `--color-text`, `--color-text-muted`, `--color-border`,
  `--color-surface-raised` y `--color-accent`. **Ningún código de color se escribe en `pdf.js`.**
- **Fondo blanco**, nunca el crema de pantalla: el papel ya es papel. `--color-ground` deja de usarse
  en el PDF.
- Dos tipografías, ambas estándar del formato PDF, **sin incrustar ningún archivo**:
  - `times` (serif) para el título, el folio y el importe total.
  - `helvetica` (sans) para todo lo demás, como hasta ahora.
- El parecido con la pantalla es de clase tipográfica, no de tipografía exacta (aclaración de
  2026-10-21). Esto es lo que mantiene el archivo en su tamaño actual (SC-031).

## Composición

1. **Regla de acento** de ancho completo en el borde superior, en `--color-primary`.
2. **Encabezado**: logo a la izquierda si existe; a la derecha «Cotización» en serif grande
   (`--color-primary`) y el folio debajo, también en serif, en `--color-text-muted`. Sin logo, el
   título ocupa el lado izquierdo.
3. **Fechas**: dos pares etiqueta-valor, «Fecha de emisión» y «Vigencia hasta». La etiqueta en
   `--color-text-muted`; el valor de emisión en `--color-text` y **el de vigencia en
   `--color-accent`**, que es el único uso del cobre en el documento.
4. **Partes**: dos columnas, «De» (emisor) y «Para» (cliente); etiquetas pequeñas en
   `--color-text-muted`, nombre en negrita.
5. **Tabla de conceptos**: encabezado con fondo `--color-surface-raised` y texto en negrita; filas
   separadas por línea fina en `--color-border`; cantidad y precios alineados a la derecha; si continúa
   en otra página, el encabezado se repite.
6. **Desglose** alineado a la derecha, en el orden de la spec 001; etiquetas en
   `--color-text-muted`, importes en `--color-text`.
7. **Total** en una caja de fondo `--color-primary` con texto `--color-primary-contrast`, en serif y
   al mayor tamaño del documento; es el elemento más visible.

## Reglas

- Contraste del texto sobre su fondo ≥ 4.5:1, también en la caja del total (verificado: blanco sobre
  `#11523F` da 9.12).
- **Ninguna información se distingue únicamente por color.** El cobre de la vigencia es un refuerzo:
  la fecha se identifica por su etiqueta y su posición. Es la condición para dar la plantilla por
  terminada (FR-016a).
- **Se verifica impreso en blanco y negro**, no solo en pantalla.
- Descripciones largas se parten en varias líneas sin salirse de la tabla; acentos y ñ se leen bien.
- Cotizaciones de una o varias páginas mantienen el mismo estilo; el total no queda partido entre
  páginas.
- Una cotización vencida produce el mismo PDF que una vigente, sin sello ni marca.
- El archivo no crece más de un 20 % respecto al de la referencia recapturada antes de implementar.
