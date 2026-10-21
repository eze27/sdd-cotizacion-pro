# Data Model: Exportar todas las cotizaciones en un .zip

No hay cambios en el esquema de SQLite (spec 001, [`data-model.md`](../001-cotizaciones-pro/data-model.md)). La
exportación solo lee. Este documento describe el contenido de `datos-cotizaciones.json`.

## Archivo de datos

| Campo | Contenido | Origen |
|-------|-----------|--------|
| `exportDate` | `AAAA-MM-DD`, día de la exportación en hora de la Ciudad de México | Fecha del servidor |
| `profile` | `{ name, rfc, regime, contact, logo }` o `null` si aún no hay perfil. `logo` es un data URL o `null` | Tabla `profile` |
| `services` | Lista de `{ id, name, priceCents }` | Tabla `services` |
| `clients` | Lista de `{ id, name, rfc, type }` | Tabla `clients` |
| `quotes` | Lista de cotizaciones completas (abajo) | Tablas `quotes` y `quote_lines` |
| `folioCounters` | Lista de `{ year, lastNumber }` | Tabla `folio_counters` |

### Cotización dentro de `quotes`

Misma forma que devuelve `GET /api/quotes/:id`, para que el PDF y el archivo de datos salgan de un solo
origen:

`{ id, folio, issueDate, validUntil, expired, isrRateBp, freelancer: { name, rfc, regime, contact, logo }, client: { name, rfc, type }, lines: [{ description, quantityHundredths, unitPriceCents, amount }], totals: {...} }`

- Dinero en centavos enteros y cantidades en centésimas, como en toda la aplicación.
- `freelancer` y `client` son la copia guardada al crear o editar la cotización (no el perfil actual).
- `expired`, `validUntil`, `amount` y `totals` son derivados; se incluyen porque salen de la misma
  serialización y facilitan comprobar que los importes cuadran. Una importación puede ignorarlos y
  recalcular con `calc.js`.

### Reglas

- `quotes` va ordenado como la lista de la aplicación (fecha de emisión descendente, luego `id`
  descendente).
- Con 0 cotizaciones no se genera ningún archivo; el endpoint igual responde con las listas vacías y el
  cliente decide avisar (research.md, decisión 7).
- `folioCounters` conserva el último número usado por año, aunque ese folio ya se haya eliminado.

## Entidades de la exportación (no persisten)

| Entidad | Qué es | Reglas |
|---------|--------|--------|
| Copia de seguridad (.zip) | Se arma en memoria y se descarga | Se crea solo si hay ≥ 1 cotización y todos los PDF se generaron |
| Entrada PDF | Un archivo por cotización dentro del .zip | Nombre `<folio> - <cliente limpio>.pdf` (research.md, decisión 4) |
| Entrada de datos | `datos-cotizaciones.json` | Una por .zip, en el mismo nivel que los PDF |
