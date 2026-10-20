# Data Model: CotizacionesPro v0

Los datos viven en un archivo SQLite en el servidor. Los importes se guardan en **centavos
enteros**, las cantidades en **centésimas** y las fechas como `AAAA-MM-DD` (hora de la Ciudad de
México). No hay tabla de usuarios: la base es de un solo freelancer.

## Tablas

### `profile` (una sola fila, `id = 1`)

| Campo | Tipo | Regla |
|-------|------|-------|
| `name` | texto | Obligatorio |
| `rfc` | texto | Obligatorio; formato básico; se guarda en mayúsculas |
| `regime` | `AEP` o `RESICO` | Obligatorio (AEP = Actividades Empresariales y Profesionales) |
| `contact` | texto | Opcional (texto libre) |
| `logo` | imagen (texto base64) | Opcional; PNG/JPG reducida a 400 px de ancho |

### `services`

| Campo | Tipo | Regla |
|-------|------|-------|
| `id` | entero autonumérico | Generado |
| `name` | texto | Obligatorio |
| `price_cents` | entero | Obligatorio; mayor que 0 |

### `clients`

| Campo | Tipo | Regla |
|-------|------|-------|
| `id` | entero autonumérico | Generado |
| `name` | texto | Obligatorio (nombre o razón social) |
| `rfc` | texto | Opcional; si se captura, formato básico |
| `type` | `MORAL` o `FISICA` | Obligatorio |

### `quotes`

Al guardarse por primera vez copia los datos del freelancer, del cliente y la tasa de ISR vigentes.
Cambios posteriores en perfil, servicios o clientes **no** la modifican (FR-016).

| Campo | Tipo | Regla |
|-------|------|-------|
| `id` | entero autonumérico | Generado |
| `folio` | texto `AAAA-NNN` | Único; asignado al guardarse por primera vez; no cambia al editar |
| `issue_date` | fecha | Día de creación; se renueva a hoy al guardar una edición |
| `freelancer_name`, `freelancer_rfc`, `freelancer_regime`, `freelancer_contact`, `freelancer_logo` | copia | Datos del perfil al crearla |
| `client_name`, `client_rfc`, `client_type` | copia | Datos del cliente elegido (se actualizan si se cambia de cliente al editar) |
| `isr_rate_bp` | entero | 1000 (10 %) o 125 (1.25 %), fijada al crearla según el régimen |

### `quote_lines`

| Campo | Tipo | Regla |
|-------|------|-------|
| `id` | entero autonumérico | Generado |
| `quote_id` | entero | Referencia a `quotes`; se borra junto con la cotización |
| `position` | entero | Orden dentro de la cotización |
| `description` | texto | Obligatorio; viene del catálogo o se escribe a mano |
| `quantity_hundredths` | entero | Cantidad en centésimas (2.5 → 250; 0.25 → 25); mayor que 0 |
| `unit_price_cents` | entero | Mayor que 0 |

### `folio_counters`

| Campo | Tipo | Regla |
|-------|------|-------|
| `year` | entero | Clave |
| `last_number` | entero | Último NNN usado; solo avanza (un folio eliminado no se reutiliza) |

## Valores derivados (no se guardan; los calcula `calc.js`)

Fecha de vencimiento, estado "vencida", subtotal, IVA, retenciones y total.

## Relaciones y ciclo de vida

- Una cotización tiene uno o más conceptos y una **copia** de datos de cliente y freelancer (sin
  referencia a `clients` ni `profile`); por eso borrar o editar un cliente o servicio no la toca.
- Un concepto del catálogo solo copia nombre y precio; no queda ligado al servicio.
- Una cotización nueva no existe en la base hasta que se guarda con al menos un concepto (no consume
  folio antes). Al guardarse, el servidor crea la cotización, sus conceptos y avanza el contador en
  una sola transacción. Después solo se edita o se elimina.
- "Vencida" es un valor calculado: hoy (hora de México) es posterior a `issue_date` + 30 días.
- Las tablas se crean automáticamente la primera vez que arranca el servidor.
