# Estado del producto: CotizacionesPro

Índice de las specs y de su avance. Las reglas del producto están en `.specify/memory/constitution.md`.

| Spec | Qué entrega | Implementación | Pendiente |
|------|-------------|----------------|-----------|
| [001-cotizaciones-pro](001-cotizaciones-pro/spec.md) | Perfil, clientes, servicios y cotizaciones con IVA y retenciones; PDF; folios y vigencia de 30 días | 41 de 44 tareas | T041 prueba en Chrome y Firefox, T042 recorrido final de pruebas y `quickstart.md`, T044 publicar en un hosting con disco persistente |
| [002-rediseno-inicio](002-rediseno-inicio/spec.md) | Página de inicio con resumen de vigentes y vencidas, navegación común, sistema visual único y PDF con la misma identidad | 31 de 35 tareas | T031 prueba visual en Chrome y Firefox, T032 revisión de los PDF, T033 recorrido de los flujos de la spec 001, T034 decidir con el dueño los ítems `[Gap]` de `checklists/ux.md` |

## Notas

- Ambas specs tienen el estado `Draft` en su `spec.md`; no se ha cerrado ninguna formalmente.
- Las tareas pendientes son verificaciones a mano en navegador o visor de PDF, y la publicación del servidor.
- Fuera de alcance por ahora: los estados Borrador, Enviado, Aceptado y Rechazado, el modo oscuro, cuentas y contraseña.
- Cada spec vive en `specs/NNN-nombre/` con su `plan.md`, `tasks.md`, `contracts/` y `quickstart.md`.
