# Verificación a mano: dirección visual «Despacho»

Revisión 2, 2026-10-22. Reemplaza la guía de la revisión 1 (consultable en `main`).

Guía de comprobación, no de implementación. Cada paso cierra uno o varios criterios de éxito de
[`spec.md`](spec.md). Se hace entera en Chrome y se repiten en Firefox los pasos marcados **[CF]**.

## Antes de empezar

```
npm install
npm start          # http://localhost:3000
npm test           # debe pasar sin cambios: comprobación de no-regresión
```

Hace falta tener capturado el perfil y, al menos:

- 1 cliente persona moral con ISR 10 %, 1 persona moral con ISR 1.25 % y 1 persona física;
- las 3 cotizaciones de ejemplo de la spec 001 (totales 19,066.67 / 20,816.67 / 23,200.00);
- **15 cotizaciones o más** en total, para poder contar filas en escritorio (paso 6.2);
- al menos 1 cotización vencida (emitida hace más de 30 días) y 1 vigente.

### Paso 0 — Capturar la referencia, ANTES de tocar el código

Obligatorio, y solo sirve si se hace primero. Con el código **sin modificar**:

1. Descargar los PDF de las 3 cotizaciones de ejemplo y guardarlos aparte como referencia.
2. Anotar el **tamaño en bytes** de cada uno (base de SC-031).
3. Regenerar `baseline-hashes.txt` y `baseline-pdf-text.txt` con el procedimiento de la revisión 1.

> Si se implementa antes de este paso, SC-027 y SC-031 ya no pueden verificarse: los
> `baseline-*.txt` del repositorio describen el PDF **anterior** a esta revisión.

---

## 1. Identidad y tipografía

| # | Comprobación | Criterio |
|---|--------------|----------|
| 1.1 | En las 6 pantallas, el título de página se ve claramente más grande y con remates frente a la marca "CotizacionesPro". Preguntar a 3 personas cuál es el elemento de mayor jerarquía | SC-011 |
| 1.2 | Poner una tarjeta blanca sobre el fondo: el fondo es un crema cálido distinguible, no gris azulado | SC-012 |
| 1.3 | En la lista de cotizaciones, con 6 importes de distinta longitud, los dígitos de la columna de totales quedan en columna vertical en todas las filas | SC-013 |
| 1.4 | Buscar en las 6 pantallas y en el PDF los colores de la revisión 1 (azul de acción, grises azulados de fondo y borde): no aparece ninguno | SC-015 |
| 1.5 | Cortar la carga de tipografías (modo sin conexión tras limpiar la caché): la aplicación sigue legible y la disposición no se rompe | FR-014c |

## 2. Color y accesibilidad

| # | Comprobación | Criterio |
|---|--------------|----------|
| 2.1 | Con un comprobador de contraste, revisar: texto principal y secundario sobre crema y sobre blanco; texto de botón primario; las dos etiquetas de estado; el rojo de error. Ninguno por debajo de 4.5:1 | SC-014 |
| 2.2 | Revisar el borde de un campo de texto y el anillo de foco: ninguno por debajo de 3:1 | SC-014 |
| 2.2b | Bajar el brillo de la pantalla a aproximadamente un 25 % y recorrer las 6 pantallas: ninguna etiqueta, botón ni mensaje queda difícil de leer sobre su fondo. Mirar en particular el texto secundario sobre crema y las dos etiquetas de estado | SC-008 |
| 2.3 | Poner la pantalla en escala de grises y recorrer la lista: se sigue distinguiendo "Vigente" de "Vencida" en todas las filas | SC-016 |
| 2.4 | Pedir a alguien que no participó en el diseño que señale una cotización vencida: menos de 5 segundos | SC-005 |

## 3. Estados **[CF]**

| # | Comprobación | Criterio |
|---|--------------|----------|
| 3.1 | Mantener pulsado cada tipo de botón (primario, neutro, de texto, destructivo) en las 6 pantallas: todos cambian visiblemente antes de soltar. Repetir en un celular real o con emulación táctil | SC-017 |
| 3.2 | Limitar la red a 3G lenta y recargar Inicio: las cifras aparecen en el hueco ya reservado y **ningún elemento de la página se desplaza** al llegar los datos | SC-018 |
| 3.3 | Apagar el servidor y recargar Inicio: en lugar de las cifras hay un texto breve que **no se confunde con un cero**, los accesos siguen funcionando y aparece el aviso | FR-005, FR-021 |
| 3.4 | En el editor, dejar vacío un campo obligatorio e intentar guardar: el campo queda marcado **y** aparece el mensaje debajo. Repetir en los formularios de cliente, servicio y perfil | SC-019 |
| 3.5 | Con un lector de pantalla, llegar al campo inválido: se anuncia el error | FR-022 |
| 3.6 | Lanzar "Exportar todo (.zip)": el botón informa del avance y ni él ni "Nueva cotización" se mueven ni un píxel | SC-020 |
| 3.7 | Provocar un error (apagar el servidor y eliminar algo): el aviso permanece y se puede cerrar. Provocar un éxito: desaparece solo en menos de 10 s y también se puede cerrar | SC-021 |
| 3.8 | Activar "reducir movimiento" en el sistema y repetir 3.1 y 3.2: todo sigue entendiéndose; nada depende de una animación | Borde del caso |

## 4. Confirmación **[CF]**

| # | Comprobación | Criterio |
|---|--------------|----------|
| 4.1 | Eliminar una cotización: la confirmación aparece **dentro de la aplicación**, con su tipografía. No aparece el cuadro del navegador con `localhost:3000` | SC-026a |
| 4.2 | Con la confirmación abierta, intentar pulsar algo detrás: no responde | FR-024a |
| 4.3 | Recorrer con la tecla de tabulación: el foco no sale de la confirmación | FR-024a |
| 4.4 | Al abrir, el foco está en "Cancelar"; pulsar la tecla de escape la cierra sin eliminar | FR-024a |
| 4.5 | Al cerrarse, el foco vuelve al botón que la abrió | FR-024a |
| 4.6 | Repetir 4.1 al eliminar un cliente y al eliminar un servicio: en ningún caso aparece el cuadro del navegador. Son los tres únicos sitios del producto que confirman algo | SC-026a |
| 4.7 | Confirmar de verdad una eliminación: se elimina igual que antes | FR-017 |

## 5. Densidad y disposición **[CF]**

| # | Comprobación | Criterio |
|---|--------------|----------|
| 5.1 | A 360 px, recorrer las 6 pantallas: sin desplazamiento horizontal, sin elementos cortados | SC-004 |
| 5.2 | A 360 px, mirar la barra inferior: las 5 etiquetas se leen completas | SC-024 |
| 5.3 | A 360 px, medir el alto táctil de botones y campos: igual o mayor que antes del cambio | SC-024 |
| 5.4 | A 360 px, mirar una cotización de la lista: tres acciones jerarquizadas, un solo bloque, sin renglones de botones envueltos. El folio sigue abriendo la cotización en un toque | SC-026 |
| 5.5 | A 1440 px, mirar cualquier pantalla: el contenido ocupa un ancho claramente mayor que antes y los márgenes laterales son mayores que en celular | SC-022 |
| 5.6 | A 1440 px, contar las filas visibles de la lista sin desplazar: **al menos 14** | SC-023 |
| 5.7 | A 1024 px (portátil), comprobar que la tabla está en filas y los controles ya son compactos; a 800 px, que la tabla está en filas pero los controles siguen siendo táctiles | FR-025 |
| 5.8 | En Inicio, medir: la separación entre el bloque de cifras y "Accesos" es al menos el doble de la que hay entre "Accesos" y sus tarjetas | SC-025 |
| 5.9 | A 1280 px o más, la rejilla de accesos muestra 4 columnas | FR-025 |
| 5.10 | En una pantalla ancha, un bloque de texto corrido no se estira de lado a lado | FR-028 |

## 6. El PDF **[CF]**

| # | Comprobación | Criterio |
|---|--------------|----------|
| 6.1 | Descargar los 3 PDF de ejemplo y compararlos **cifra por cifra** con la referencia del paso 0: datos, conceptos, impuestos, retenciones y totales idénticos (19,066.67 / 20,816.67 / 23,200.00) | SC-007, SC-027 |
| 6.2 | Comparar el tamaño en bytes con el anotado en el paso 0: no más de un 20 % mayor | SC-031 |
| 6.3 | Poner el PDF nuevo al lado de una pantalla de la aplicación y preguntar a 3 personas si son el mismo producto | SC-028 |
| 6.4 | Cronometrar la descarga del PDF: menos de 3 segundos | SC-009 |
| 6.5 | **Imprimir** un PDF en una impresora en blanco y negro (o exportar en escala de grises) e identificar folio, cliente, total y fecha de vigencia: menos de 5 segundos | SC-029 |
| 6.6 | En el impreso en gris, comprobar que no hay ninguna información que solo se distinguiera por color | SC-030 |
| 6.7 | Generar un PDF de una cotización con muchos conceptos (varias páginas): el encabezado de tabla se repite, el estilo se mantiene y el total no queda partido | FR-015 |
| 6.8 | Generar el PDF de una cotización sin logo: el diseño sigue ordenado | FR-015 |
| 6.9 | Generar uno con acentos, ñ y descripciones largas: se leen bien | FR-015 |
| 6.10 | Generar el PDF de una cotización vencida: idéntico al de una vigente | FR-015 |

## 7. No-regresión

| # | Comprobación | Criterio |
|---|--------------|----------|
| 7.1 | `npm test` pasa sin que se haya modificado ninguna prueba | Invariante |
| 7.1b | Cambiar `--color-primary` en `:root` de `public/css/styles.css` a un valor chillón (por ejemplo `#FF00FF`), recargar y comprobar que el cambio se ve **en las 6 pantallas y en el PDF a la vez**, sin tocar nada más. Revertir el valor | SC-010 |
| 7.2 | Recorrido completo de la spec 001: perfil → cliente → cotización → PDF, editar, eliminar, catálogos. Mismos textos, datos y cifras | SC-006 |
| 7.3 | Recorrido de la spec 003: "Exportar todo (.zip)" produce el .zip con un PDF por cotización y `datos-cotizaciones.json` | SC-006 |
| 7.4 | Abrir las direcciones guardadas (`#/cotizaciones`, `#/cotizacion/:id`, `#/clientes`, `#/servicios`, `#/perfil`): llevan a la misma pantalla que antes | FR-008 |
| 7.5 | Con la base de datos vacía de perfil, cualquier ruta redirige a `#/perfil` | FR-008 |
| 7.6 | Desde cada pantalla, llegar a cualquier otra sección en un solo toque | SC-003 |
| 7.7 | Comparar el resumen de Inicio con la lista: la suma coincide y cada cifra cuadra con las etiquetas | SC-002 |

## 8. Cierre

- Revalidar [`checklists/ux.md`](checklists/ux.md) de la revisión 1 y resolver sus ítems `[Gap]`.
- Comprobar los invariantes de la spec: ningún valor suelto en componentes, `pdf.js` sin códigos de
  color, `statusTag()` como único lugar del estado, nada de `innerHTML` con datos, foco visible
  siempre, sin dependencias de red nuevas.
