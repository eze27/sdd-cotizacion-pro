# Contrato: PDF de la cotización

Contenido y orden del PDF (tamaño carta, vertical, español de México). Archivo:
`Cotizacion-AAAA-NNN.pdf`. No lleva notas ni condiciones de pago (fuera de alcance en v0).

1. **Encabezado**: logo del freelancer (si existe, a la izquierda), título "Cotización" y folio.
2. **Fechas**: "Fecha de emisión" y "Vigencia hasta" (emisión + 30 días naturales), en formato
   día de mes de año (por ejemplo, 19 de octubre de 2026).
3. **Datos del freelancer**: nombre, RFC, régimen fiscal (nombre completo) y datos de contacto.
4. **Datos del cliente**: nombre o razón social, RFC (si lo hay) y tipo (persona moral o física).
5. **Tabla de conceptos**: columnas Descripción, Cantidad, Precio unitario e Importe; una fila por
   concepto; descripciones largas pasan a varias líneas; la tabla continúa en otra página si no cabe.
6. **Desglose** alineado a la derecha, en este orden: Subtotal, IVA (16 %), Retención de ISR (con
   su porcentaje), Retención de IVA (2/3), Total. Las retenciones aparecen con un guion normal
   delante (`-$2,000.00`), no con el signo "−" tipográfico, porque la tipografía predeterminada del
   PDF no lo incluye, y **solo si el cliente es persona moral**; para persona física se omiten.
7. **Importes**: pesos mexicanos con formato `$20,000.00`; el total se destaca.

Si no hay logo, el encabezado se genera sin él. Con una cotización vencida, el PDF muestra las
mismas fechas (no cambia de contenido).
