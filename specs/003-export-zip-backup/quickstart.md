# Quickstart: validar la exportación en .zip

Guía para comprobar la spec 003 usando la aplicación (Principio IV). No requiere leer código.

## Preparación

- `npm install`, `npm start`, abrir `http://localhost:3000`.
- Tener perfil (con logo), un cliente persona moral, uno persona física y **3 cotizaciones**. Una de ellas
  con cliente `Diseño/Web S.L.`. Conviene que una sea vencida.
- Probar en Chrome y Firefox, en escritorio y a 360 px de ancho.
- Para el recorrido 5 hacen falta 50 cotizaciones (se pueden crear con un guion de datos de ejemplo).

## 1. Descargar la copia (Historia 1 · SC-001, SC-004)

1. Abrir **Cotizaciones**: junto a «Nueva cotización» está el botón **Exportar todo (.zip)**.
2. Pulsarlo → se descarga un único archivo `cotizacion-copia-AAAA-MM-DD.zip` con la fecha de hoy.
3. Descomprimirlo con doble clic: hay 3 PDF `folio - cliente.pdf` y `datos-cotizaciones.json`, todos en el
   mismo nivel. Para el cliente `Diseño/Web S.L.` el archivo se llama `2026-004 - Diseño-Web S.L.pdf`
   (sustituye la barra por un guion), con el folio que corresponda.
4. Abrir `datos-cotizaciones.json` con el Bloc de notas: se ve el perfil, los servicios, los clientes y
   las 3 cotizaciones.
5. Con unas 10 cotizaciones, medir con reloj desde que se pulsa el botón hasta ver los archivos
   descomprimidos: menos de 1 minuto, sin ayuda (SC-007).

## 2. PDF idénticos (Historia 2 · SC-002)

1. Para cada cotización, descargar su PDF con **Descargar PDF** en la lista.
2. Abrir ese PDF y el del .zip con el mismo folio, uno junto al otro.
3. Comparar logo, datos, fechas, conceptos y desglose: todo igual, con los mismos importes al centavo.
   Incluir la cotización vencida y una con persona moral (con retenciones).

## 3. Sin cotizaciones (Historia 3 · SC-003)

1. Con la base vacía (o en una copia de trabajo sin cotizaciones), pulsar **Exportar todo (.zip)**.
2. Aparece «No hay cotizaciones para exportar.» y **no** se descarga ningún archivo.

## 4. No cambia nada (SC-006)

1. Antes de exportar, anotar folios, fechas de emisión y totales de la lista.
2. Exportar. Recargar la página.
3. La lista, los folios, las fechas y los totales son los mismos. Crear una cotización nueva: recibe el
   folio siguiente de siempre.

## 5. Muchas cotizaciones (Historia 4 · SC-005)

1. Con 50 cotizaciones, pulsar el botón.
2. Mientras trabaja, el botón está deshabilitado y dice «Exportando… N de 50» con N creciendo.
3. Al terminar se descarga el .zip con 50 PDF y el botón vuelve a «Exportar todo (.zip)».

## 6. Fallo a mitad (FR-012)

1. Pulsar el botón y, de inmediato, detener el servidor.
2. Aparece un mensaje claro en español, no se descarga ningún .zip y el botón vuelve a estar activo.

## 7. Celular (360 px)

El botón es visible y se puede pulsar sin desplazamiento horizontal; el indicador de avance cabe en
pantalla.

## Pruebas automáticas

`npm test` debe pasar completo: las existentes sin editarse más `tests/backup.test.js` y
`tests/backup-names.test.js`.
