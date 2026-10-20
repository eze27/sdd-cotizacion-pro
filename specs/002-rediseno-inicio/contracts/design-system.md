# Contrato: sistema visual

Único lugar de definición: sección de tokens al inicio de `public/css/styles.css` (`:root`). Ningún
componente usa valores de color, tamaño o espacio sueltos. El PDF lee los tokens de color de aquí.

## Tokens de color (valores iniciales; contraste ≥ 4.5:1 verificado)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-ground` | `#f8fafc` | Fondo de la página |
| `--color-surface` | `#ffffff` | Tarjetas, campos, barra |
| `--color-border` | `#e2e8f0` | Bordes y separadores |
| `--color-text` | `#0f172a` | Texto principal |
| `--color-text-muted` | `#475569` | Texto secundario |
| `--color-primary` / `-hover` / `-contrast` | `#1d4ed8` / `#1e40af` / `#ffffff` | Acción principal y elemento activo |
| `--color-danger` | `#b91c1c` | Acciones y errores destructivos |
| `--tag-info-bg` / `-fg` | `#dbeafe` / `#1e40af` | Vigente |
| `--tag-warn-bg` / `-fg` | `#fef3c7` / `#92400e` | Vencida |
| `--tag-success-bg` / `-fg` | `#dcfce7` / `#166534` | Reservado: Aceptado |
| `--tag-danger-bg` / `-fg` | `#fee2e2` / `#991b1b` | Reservado: Rechazado |
| `--tag-help-bg` / `-fg` | `#ede9fe` / `#5b21b6` | Reservado: Enviado |
| `--tag-neutral-bg` / `-fg` | `#f1f5f9` / `#334155` | Reservado: Borrador |

## Tipografía, espaciado y forma

- Fuente: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Tamaños: 12, 14, 16, 20, 28 px
  (`--text-xs … --text-2xl`). Pesos: 400 y 600. Interlineado 1.5 (texto) y 1.25 (títulos).
- Espaciado: escala base 4 px (`--space-1 … --space-8` = 4, 8, 12, 16, 24, 32, 48, 64 px).
- Forma: `--radius` 6 px; `--shadow-sm` único y muy leve; bordes de 1 px.
- Alturas: control táctil `--control-h` 44 px (48 px en la barra inferior `--nav-h`).
- Foco: anillo de 2 px en `--color-primary` con separación; nunca se elimina sin sustituto.
- Movimiento: ninguna animación necesaria; transiciones ≤ 150 ms y desactivadas con `prefers-reduced-motion`.

## Componentes

| Componente | Clases | Reglas |
|------------|--------|--------|
| Botón | `.btn` + `--primary`, `--secondary`, `--danger`, `--text` | Altura ≥ 44 px, texto en español, deshabilitado visible |
| Campo | `.field` (etiqueta visible, control, `.field__hint`, `.field__error`) | Etiqueta siempre arriba del control; error con texto, no solo color |
| Tarjeta | `.card` (+ `.card__title`) | Fondo superficie, borde fino, relleno `--space-4` |
| Lista de datos | `.data-list` | Apilada en celular; filas tipo tabla con encabezado desde 768 px |
| Etiqueta de estado | `.tag` + `--info`, `--warn`, `--success`, `--danger`, `--help`, `--neutral` | Siempre con texto; fondo suave y texto oscuro |
| Encabezado de página | `.page-header` | Título (`--text-xl`) y acción principal alineados |
| Aviso | `.aviso` (+ `--ok`) | Mantiene el comportamiento actual |

Ayudas en `ui.js`: `button(text, variant, onclick)`, `statusTag(expired)` (Vigente/Vencida; único lugar
que decide el texto y la variante), `field(label, control, { hint, error })`.

## Reglas de uso

- Una sola acción principal por pantalla.
- Importes alineados a la derecha en tablas; formato `$20,000.00` sin cambios.
- Sin ilustraciones ni degradados; sin iconos obligatorios.
