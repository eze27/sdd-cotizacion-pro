# Data Model: Página de inicio y rediseño visual

**Sin cambios.** Esta feature no añade, modifica ni elimina tablas, campos ni datos guardados. Se
respeta íntegro [`001-cotizaciones-pro/data-model.md`](../001-cotizaciones-pro/data-model.md).

## Valores derivados (no se guardan)

| Valor | Origen | Regla |
|-------|--------|-------|
| Cotizaciones vigentes | Lista de cotizaciones existente | Cuántas tienen `expired = false` |
| Cotizaciones vencidas | Lista de cotizaciones existente | Cuántas tienen `expired = true` |
| Total | Lista de cotizaciones existente | Vigentes + vencidas = número de elementos de la lista |
| Estado mostrado | `expired` de cada cotización | `false` → "Vigente"; `true` → "Vencida" |

"Vencida" sigue siendo el valor calculado de la spec 001 (hoy, hora de México, posterior a emisión
+ 30 días naturales). No se guarda ningún estado.
