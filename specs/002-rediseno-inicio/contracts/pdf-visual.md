# Contrato: presentación visual del PDF

**Contenido, orden y reglas sin cambios** respecto de
[`001/contracts/pdf-cotizacion.md`](../../001-cotizaciones-pro/contracts/pdf-cotizacion.md): mismos
bloques, mismos importes, retenciones solo para persona moral con guion normal `-`, sin notas, archivo
`Cotizacion-AAAA-NNN.pdf`, carta vertical, español de México. Este contrato solo describe cómo se ve.

## Colores y fuente

- Los colores salen de los tokens de `design-system.md` leídos al generar el PDF: acento
  (`--color-primary`), texto, texto secundario, borde y fondo suave (`--color-ground`).
- Fuente Helvetica (la integrada), en dos pesos; mismos tamaños relativos que la jerarquía de la app.

## Composición

1. **Franja de acento** de ancho completo en el borde superior (alto pequeño).
2. **Encabezado**: logo a la izquierda (si existe); a la derecha "Cotización" en grande (acento) y el
   folio debajo en gris. Sin logo, el título ocupa el lado izquierdo.
3. **Fechas**: dos pares etiqueta-valor ("Fecha de emisión", "Vigencia hasta") en gris/negro.
4. **Partes**: dos columnas, "De" (emisor) y "Para" (cliente); etiquetas pequeñas en gris;
   nombre en negrita.
5. **Tabla de conceptos**: encabezado con fondo suave y texto en negrita; filas separadas por línea
   fina; cantidad y precios alineados a la derecha; si continúa en otra página, el encabezado se repite.
6. **Desglose** alineado a la derecha, en el orden de 001; etiquetas en gris, importes en negro.
7. **Total** en una caja de fondo de acento con texto claro y tamaño mayor; es el elemento más visible.

## Reglas

- Contraste del texto sobre fondo ≥ 4.5:1 (también en la caja del total).
- Descripciones largas se parten en varias líneas sin salirse de la tabla; acentos y ñ se leen bien.
- Cotizaciones de una o varias páginas mantienen el mismo estilo; el total no queda partido entre páginas.
- Una cotización vencida produce el mismo PDF que una vigente (sin sello ni marca).
