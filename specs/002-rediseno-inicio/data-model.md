# Data Model: Página de inicio y dirección visual «Despacho»

Revisión 2, 2026-10-22.

**Sin cambios, igual que en la revisión 1.** Esta feature no añade, modifica ni elimina tablas, campos
ni datos guardados. Se respeta íntegro
[`001-cotizaciones-pro/data-model.md`](../001-cotizaciones-pro/data-model.md). Tampoco cambia nada de
lo que la spec 003 añadió (`GET /api/backup`).

## Valores derivados (no se guardan)

| Valor | Origen | Regla |
|-------|--------|-------|
| Cotizaciones vigentes | Lista de cotizaciones existente | Cuántas tienen `expired = false` |
| Cotizaciones vencidas | Lista de cotizaciones existente | Cuántas tienen `expired = true` |
| Total | Lista de cotizaciones existente | Vigentes + vencidas = número de elementos de la lista |
| Estado mostrado | `expired` de cada cotización | `false` → "Vigente"; `true` → "Vencida" |

"Vencida" sigue siendo el valor calculado de la spec 001 (hoy, hora de México, posterior a emisión
+ 30 días naturales). No se guarda ningún estado.

## Estados de interfaz (revisión 2, no son datos)

La revisión 2 hace visibles algunos estados que antes no se distinguían. Ninguno se guarda ni viaja
por la API; son situaciones momentáneas de la pantalla, y se listan aquí para que `tasks.md` no los
confunda con datos.

| Estado | Dónde | Cómo se distingue |
|--------|-------|-------------------|
| Cargando | Cifras del resumen de Inicio | Bloque de carga del tamaño del dato final |
| No se pudo cargar | Cifras del resumen de Inicio | Texto breve en español, nunca un guion, distinguible de un cero |
| Campo inválido | Cualquier formulario | `aria-invalid`, borde `--color-danger` y mensaje enlazado al control |
| Acción en curso | Botón de exportar todo | Avance dentro del botón, con ancho reservado |
| Confirmación abierta | Eliminar o salir con cambios | Diálogo propio; el resto de la página queda inactivo |

El tercero es el único que afecta a una ayuda compartida: `field()` de `ui.js` pasa a aceptar el estado
inválido. No cambia la forma de llamarla desde las pantallas que no lo usan.
