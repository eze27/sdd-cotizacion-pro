# Contrato: `GET /api/backup`

Único endpoint nuevo. Solo lectura: ejecuta únicamente `SELECT` y no cambia ninguna fila (FR-013). Sin
autenticación, como el resto de la API (decisión del dueño, spec 001).

## Petición

`GET /api/backup` — sin parámetros ni cuerpo.

## Respuesta 200

```json
{
  "exportDate": "2026-03-15",
  "profile": { "name": "...", "rfc": "...", "regime": "AEP", "contact": "...", "logo": "data:image/png;base64,..." },
  "services": [{ "id": 1, "name": "Diseño de sitio", "priceCents": 1500000 }],
  "clients": [{ "id": 1, "name": "Estudio García", "rfc": null, "type": "MORAL" }],
  "quotes": [ { "id": 7, "folio": "2026-003", "...": "misma forma que GET /api/quotes/:id" } ],
  "folioCounters": [{ "year": 2026, "lastNumber": 3 }]
}
```

- `exportDate`: `today()` del servidor (hora de la Ciudad de México).
- `profile`: `null` si todavía no hay perfil.
- `quotes`: cada elemento es exactamente lo que devuelve `serialize(row)` en `server/routes/quotes.js`;
  orden: `issue_date DESC, id DESC`.
- Con la base vacía: `services`, `clients`, `quotes` y `folioCounters` son `[]` y la respuesta sigue
  siendo 200. El aviso de «nada que exportar» lo decide el navegador.

## Errores

| Estado | Cuándo | Cuerpo |
|--------|--------|--------|
| 500 | Fallo inesperado | `{ "error": "Ocurrió un error en el servidor. Intenta de nuevo." }` (manejador existente) |

## Pruebas (`tests/backup.test.js`)

1. Base vacía → 200 con listas vacías y `profile: null`.
2. Con perfil (con logo), 2 servicios, 2 clientes y 3 cotizaciones → todo presente; cada cotización es
   igual (`deepEqual`) a la de `GET /api/quotes/:id`.
3. Cotización eliminada → su folio no aparece pero `folioCounters` conserva el número usado.
4. Tras llamar al endpoint, conteos y contenido de todas las tablas son los mismos que antes.
