# Quickstart: validar la página de inicio y el rediseño

Guía para comprobar la spec 002 usando la app (Principio IV).

## Preparación

- `npm install`, `npm start`, abrir `http://localhost:3000`.
- Tener perfil, un cliente persona moral y uno persona física, y al menos 3 cotizaciones, una de ellas
  con más de 30 días desde su emisión (por ejemplo, datos de ejemplo con fecha de emisión antigua).
- Probar en Chrome y Firefox, en escritorio y a 360 px de ancho.

## 1. Inicio (US1)

1. Abrir la dirección principal sin `#` → aparece **Inicio** con resumen, "Nueva cotización" y los
   cuatro accesos.
2. Comparar los números de "Vigentes" y "Vencidas" con las etiquetas de la lista de cotizaciones; su
   suma es el total de la lista.
3. Cada acceso lleva a su sección; "Nueva cotización" abre el editor.
4. Con base vacía: ceros y mensaje de invitación. Sin perfil: se redirige a Perfil como antes.
5. Detener el servidor tras cargar y pulsar Inicio de nuevo: los accesos siguen y aparece el aviso
   de que no se pudo cargar el resumen.

## 2. Navegación (US2)

1. Recorrer las seis pantallas (inicio, cotizaciones, editor, clientes, servicios, perfil): la barra
   es la misma y resalta la sección actual (el editor resalta Cotizaciones).
2. A 360 px: barra inferior con 5 elementos sin desplazamiento horizontal ni contenido tapado
   (incluidos los totales del editor).
3. Con teclado: Tab recorre la barra y el foco se ve; Enter activa.
4. Abrir direcciones guardadas (`#/cotizaciones`, `#/cotizacion/1`) → siguen funcionando.

## 3. Apariencia (US3)

1. Comparar botones, campos, tarjetas y listas entre pantallas: mismo aspecto.
2. Provocar un error de formulario (perfil vacío): el mensaje y el campo se ven igual en todas.
3. En la lista de cotizaciones, una vigente y una vencida se distinguen por etiqueta con texto y color.
   Una persona ajena a la app las distingue en menos de 5 s.
4. Pedir al desarrollador que cambie el color principal de la paleta: el cambio se ve en todas las pantallas
   y en el PDF a la vez; pedir que lo revierta.
5. Verificar que los flujos de la spec 001 (`001/quickstart.md`) y sus cifras
   (19,066.67 / 20,816.67 / 23,200.00) siguen igual.

## 4. PDF (US4)

1. Descargar los PDF de las tres cotizaciones de ejemplo: mismo contenido e importes que antes,
   con el nuevo aspecto (franja, total destacado). Revisar contra `contracts/pdf-visual.md`.
2. Probar sin logo, con una descripción larga y con muchos conceptos (varias páginas).
3. Con el color principal cambiado (§3.4), volver a descargar: el PDF toma el nuevo color.
4. Descargar el PDF de una vencida: igual a uno vigente.

## 5. Sin regresiones

- `npm test` pasa sin modificar pruebas existentes (más `summary.test.js`).
- Confirmar que `server/` y `public/js/calc.js` no tienen cambios respecto de la spec 001.
