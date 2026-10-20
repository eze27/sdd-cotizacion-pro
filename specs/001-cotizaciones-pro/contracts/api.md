# Contrato: API del servidor

JSON sobre HTTP, bajo `/api`. Sin autenticación (decisión del dueño). Importes en centavos y
cantidades en centésimas. Errores: respuesta 400 con `{ "error": "mensaje en español de México" }`
(404 si no existe, 500 con mensaje genérico). El servidor valida todo, aunque la pantalla también lo haga.

| Método y ruta | Qué hace | Respuesta |
|---------------|----------|-----------|
| `GET /api/profile` | Lee el perfil | Perfil, o `null` si aún no existe |
| `PUT /api/profile` | Guarda el perfil (nombre, RFC y régimen obligatorios) | Perfil guardado |
| `GET /api/services` | Lista servicios | Arreglo |
| `POST /api/services` | Crea un servicio (`name`, `priceCents`) | Servicio creado |
| `PUT /api/services/:id` | Edita un servicio | Servicio |
| `DELETE /api/services/:id` | Elimina un servicio | 204 |
| `GET /api/clients` | Lista clientes | Arreglo |
| `POST /api/clients` | Crea un cliente (`name`, `rfc?`, `type`) | Cliente creado |
| `PUT /api/clients/:id` | Edita un cliente | Cliente |
| `DELETE /api/clients/:id` | Elimina un cliente | 204 |
| `GET /api/quotes` | Lista cotizaciones con folio, cliente, fecha, total y `expired` | Arreglo |
| `GET /api/quotes/:id` | Cotización completa con conceptos, totales y `expired` | Cotización |
| `POST /api/quotes` | Guarda por primera vez (`clientId`, `lines`); asigna folio y fecha, copia perfil, cliente y tasa de ISR | Cotización con folio |
| `PUT /api/quotes/:id` | Edita (`clientId`, `lines`); renueva fecha de emisión; conserva folio y tasa de ISR | Cotización |
| `DELETE /api/quotes/:id` | Elimina la cotización (el folio no se reutiliza) | 204 |

## Reglas que el servidor hace cumplir

- Perfil sin régimen o sin RFC válido: no se pueden crear cotizaciones (error claro).
- `lines` vacío: se rechaza (no se guarda ni consume folio).
- `quantityHundredths` entero > 0; cantidad con más de 2 decimales: se rechaza; `unitPriceCents` entero > 0.
- RFC con formato inválido: se rechaza; RFC vacío de cliente es válido.
- `POST /api/quotes` y el avance del contador ocurren en una sola transacción.
- Fechas y año del folio: hora de `America/Mexico_City`.
- El servidor calcula totales con `calc.js` (los mismos de la pantalla); el cliente nunca los envía.

## Archivos estáticos

`GET /` entrega `public/index.html`; el resto de `public/` se sirve tal cual.
