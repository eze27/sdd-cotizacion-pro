# Contrato: cálculo de una cotización

Reglas de `calc.js`. Es la parte con pruebas automáticas; no depende de la pantalla.

## Entrada

- `lines`: conceptos con cantidad en centésimas y precio unitario en centavos.
- `clientType`: `MORAL` o `FISICA`.
- `isrRateBp`: 1000 o 125 (tasa de ISR de la cotización).

## Salida (todo en centavos enteros)

| Campo | Regla |
|-------|-------|
| `subtotal` | Suma de cantidad × precio, redondeada a centavos (0.005 sube) |
| `iva` | exacto: subtotal × 16 %; redondeado a centavos |
| `retIsr` | Solo `MORAL`: subtotal × tasa; redondeado. `FISICA`: 0 |
| `retIva` | Solo `MORAL`: subtotal × 16 % × 2/3 (sobre el subtotal sin redondear); redondeado. `FISICA`: 0 |
| `total` | `subtotal + iva − retIsr − retIva` con los importes ya redondeados |

## Otras reglas

- Folio: `AAAA-NNN` con NNN de tres dígitos con ceros a la izquierda; sigue el contador del año.
- Vencimiento: `issueDate` + 30 días naturales; "vencida" cuando hoy es posterior. "Hoy" y el año
  del folio los da el servidor en hora de la Ciudad de México; `calc.js` los recibe como parámetro
  (no lee el reloj), así se pueden probar fechas.
- Formato de dinero: pesos mexicanos, miles con coma, punto decimal, dos decimales: `$20,000.00`.
- Validaciones: cantidad > 0 con máximo 2 decimales; precio > 0; RFC con formato básico.

## Casos de prueba obligatorios

| Caso | Subtotal | IVA | Ret. ISR | Ret. IVA | Total |
|------|----------|-----|----------|----------|-------|
| AEP, persona moral (15,000.00 + 5,000.00) | 20,000.00 | 3,200.00 | 2,000.00 | 2,133.33 | **19,066.67** |
| RESICO, persona moral (mismos conceptos) | 20,000.00 | 3,200.00 | 250.00 | 2,133.33 | **20,816.67** |
| Cualquier régimen, persona física | 20,000.00 | 3,200.00 | 0.00 | 0.00 | **23,200.00** |

Casos adicionales: cantidad 2.5 × 333.33 (fracción de centavo, redondeo 0.005 sube); cantidad 0 o
negativa rechazada; cantidad con 3 decimales rechazada; folio tras el 009 es 010; el primero del
año nuevo es 001; vencimiento el día 30 aún vigente y el 31 vencida.
