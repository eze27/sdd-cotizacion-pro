# Contrato: rutas, navegación e inicio

Solo presentación. La API (`001/contracts/api.md`) no cambia; el inicio usa únicamente `GET /api/profile`
y `GET /api/quotes`, que ya existen.

**Revisión 2 (2026-10-22)**: las rutas y la estructura de la navegación **no cambian**. Cambian las
alturas por tramo, el comportamiento de carga de Inicio, las acciones de la fila de cotización y el
continente de las confirmaciones. Lo añadido en esta revisión va marcado.

## Rutas (navegación por `#`)

| Dirección | Pantalla | Sección resaltada | Cambio |
|-----------|----------|-------------------|--------|
| `/` o `#/inicio` | Inicio | Inicio | **Nueva**; es la predeterminada |
| `#/cotizaciones` | Lista de cotizaciones | Cotizaciones | Sin cambio |
| `#/cotizacion/nueva`, `#/cotizacion/:id`, `#/cotizacion/:id/editar` | Editor y detalle | Cotizaciones | Sin cambio |
| `#/clientes` | Clientes | Clientes | Sin cambio |
| `#/servicios` | Servicios | Servicios | Sin cambio |
| `#/perfil` | Perfil | Perfil | Sin cambio |

- Sin perfil guardado, todas las rutas salvo `#/perfil` redirigen a `#/perfil` con el aviso actual
  (incluida `#/inicio`, FR-008).
- Una dirección desconocida se comporta como hoy; si hoy no hay regla, lleva al inicio.

## Navegación común

- Elementos, en este orden: **Inicio, Cotizaciones, Clientes, Servicios, Perfil**; la marca
  "CotizacionesPro" enlaza al inicio.
- Celular (< 768 px): barra fija en la parte inferior, 5 elementos de igual ancho, `--nav-h` = 48 px.
  Escritorio (≥ 768 px): barra superior horizontal, `--nav-h` = 56 px *(revisión 2: antes 48 px)*.
- El elemento activo lleva `aria-current="page"` y estilo resaltado; todos son enlaces alcanzables con
  teclado y con foco visible.
- El contenido deja espacio para la barra inferior para que nada quede tapado.
- *Revisión 2*: las cinco etiquetas se leen completas a 360 px, en `--text-xs`. No se abrevian, no se
  sustituyen por iconos y no se reduce el número de destinos (SC-024).

## Pantalla de inicio

| Bloque | Contenido |
|--------|-----------|
| Encabezado | "Inicio" y el nombre del perfil (saludo) |
| Resumen | Tarjetas "Vigentes" y "Vencidas" con su número; texto del total ("N cotizaciones") |
| Acción principal | Botón "Nueva cotización" → `#/cotizacion/nueva` |
| Accesos | Cuatro tarjetas con título y descripción corta: Cotizaciones, Clientes, Servicios, Perfil |
| Mientras carga el resumen | *Revisión 2*: cada cifra muestra un bloque de carga (`.skeleton`) **con el tamaño del dato final**, no el texto "Cargando…"; los accesos ya están visibles. Al llegar el dato nada se desplaza (SC-018) |
| Sin cotizaciones | Ceros y mensaje: "Aún no tienes cotizaciones. Crea la primera." |
| Falla al cargar el resumen | Accesos visibles + aviso "No se pudo cargar el resumen. Intenta de nuevo." *Revisión 2*: en el lugar de las cifras va un texto breve, **no un guion**, para que el fallo no se confunda con un cero (FR-005, FR-021) |

Las tarjetas "Vigentes" y "Vencidas" usan las etiquetas de estado del sistema visual; con la paleta
«Despacho», "Vigentes" pasa a la variante verde y "Vencidas" a la cobre.

*Revisión 2*: la separación entre el bloque de cifras y el título "Accesos" es `--space-7` o
`--space-8`, al menos el doble de la que hay entre "Accesos" y sus tarjetas (SC-025). La rejilla de
accesos es de 2 columnas y pasa a 4 desde 1280 px.

## Lista de cotizaciones *(revisión 2)*

Cada fila ofrece **tres** acciones, no cuatro:

| Acción | Forma | Nota |
|--------|-------|------|
| Abrir la cotización | El folio de la fila, que ya es un enlace | **Se retira el botón "Abrir"** (FR-026a): era redundante |
| Descargar PDF | Botón neutro | Sin cambios de comportamiento |
| Editar | Botón de texto | Sin cambios de comportamiento |
| Eliminar | Botón `--danger` | Pasa por el componente de confirmación |

A 360 px cada cotización ocupa un solo bloque legible, sin varios renglones de botones (SC-026). No se
introduce menú de acciones ni ningún componente de desbordamiento.

El botón "Exportar todo (.zip)" conserva su etiqueta y muestra el avance en un elemento interno de
ancho reservado: ni el botón ni "Nueva cotización", a su lado, se desplazan durante la exportación
(SC-020).

## Confirmaciones *(revisión 2)*

Las tres confirmaciones actuales (eliminar cotización, cliente o servicio) pasan por el componente
de confirmación de
[`design-system.md`](design-system.md). **Qué se pregunta y qué ocurre con cada respuesta no cambia**;
cambia dónde se pregunta. El cuadro del navegador deja de aparecer en todo el producto (SC-026a).

## Función `summarizeQuotes(list)` (`summary.js`)

Entrada: arreglo de elementos con `expired` (booleano). Salida: `{ vigentes, vencidas, total }`, con
`vigentes + vencidas = total = list.length`. Lista vacía → todo 0.
