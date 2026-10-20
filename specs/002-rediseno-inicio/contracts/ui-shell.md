# Contrato: rutas, navegación e inicio

Solo presentación. La API (`001/contracts/api.md`) no cambia; el inicio usa únicamente `GET /api/profile`
y `GET /api/quotes`, que ya existen.

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
- Celular (< 768 px): barra fija en la parte inferior, 5 elementos de igual ancho, mínimo 48 px de alto.
  Escritorio (≥ 768 px): barra superior horizontal.
- El elemento activo lleva `aria-current="page"` y estilo resaltado; todos son enlaces alcanzables con
  teclado y con foco visible.
- El contenido deja espacio para la barra inferior para que nada quede tapado.

## Pantalla de inicio

| Bloque | Contenido |
|--------|-----------|
| Encabezado | "Inicio" y el nombre del perfil (saludo) |
| Resumen | Tarjetas "Vigentes" y "Vencidas" con su número; texto del total ("N cotizaciones") |
| Acción principal | Botón "Nueva cotización" → `#/cotizacion/nueva` |
| Accesos | Cuatro tarjetas con título y descripción corta: Cotizaciones, Clientes, Servicios, Perfil |
| Mientras carga el resumen | Las tarjetas "Vigentes" y "Vencidas" muestran "Cargando…" en lugar del número; los accesos ya están visibles |
| Sin cotizaciones | Ceros y mensaje: "Aún no tienes cotizaciones. Crea la primera." |
| Falla al cargar el resumen | Accesos visibles + aviso "No se pudo cargar el resumen. Intenta de nuevo." |

Las tarjetas "Vigentes" y "Vencidas" usan las etiquetas de estado del sistema visual.

## Función `summarizeQuotes(list)` (`summary.js`)

Entrada: arreglo de elementos con `expired` (booleano). Salida: `{ vigentes, vencidas, total }`, con
`vigentes + vencidas = total = list.length`. Lista vacía → todo 0.
