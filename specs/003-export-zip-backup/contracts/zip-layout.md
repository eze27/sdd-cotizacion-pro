# Contrato: contenido y nombres del .zip

## Nombre del .zip (FR-007)

`cotizacion-copia-AAAA-MM-DD.zip`, con `exportDate` de la respuesta de `/api/backup`.
Ejemplo: `cotizacion-copia-2026-03-15.zip`.

## Estructura (FR-002, FR-003, FR-005, FR-009)

Todo en el mismo nivel, sin carpetas:

```text
cotizacion-copia-2026-03-15.zip
├── 2026-001 - Estudio García.pdf
├── 2026-002 - Diseño-Web S.L.pdf
├── 2026-003 - Acme SA de CV.pdf
└── datos-cotizaciones.json
```

- Un PDF por cada cotización de `quotes`; ninguna omitida ni repetida.
- Un único `datos-cotizaciones.json` con el contenido de [`data-model.md`](../data-model.md), sin
  los PDF dentro.

## Nombre de cada PDF (FR-008, FR-009)

`<folio> - <cliente limpio>.pdf`

Limpieza del nombre del cliente, en este orden:

1. Cada `\ / : * ? " < > |` y carácter de control → `-`.
2. Espacios repetidos → un espacio.
3. Quitar espacios y puntos al inicio y al final.
4. Recortar a 80 caracteres y repetir el paso 3.
5. Si queda vacío, el nombre es `<folio>.pdf` (sin « - »).

Acentos y «ñ» se conservan; los nombres se guardan en UTF-8.

### Casos de prueba (`tests/backup-names.test.js`)

| folio | cliente | nombre resultante |
|-------|---------|-------------------|
| 2026-001 | `Estudio García` | `2026-001 - Estudio García.pdf` |
| 2026-004 | `Diseño/Web S.L.` | `2026-004 - Diseño-Web S.L.pdf` |
| 2026-005 | `A:B*C?"D"<E>|F\G` | `2026-005 - A-B-C--D--E--F-G.pdf` |
| 2026-006 | `  ...  ` | `2026-006.pdf` |
| 2026-007 | 120 letras «a» | `2026-007 - ` + 80 «a» + `.pdf` |

`zipFileName('2026-03-15')` → `cotizacion-copia-2026-03-15.zip`.

## Interfaz de `public/js/backup.js`

| Exporta | Qué hace |
|---------|----------|
| `zipFileName(isoDate)` | Nombre del .zip |
| `pdfEntryName(folio, clientName)` | Nombre de cada PDF |
| `exportAll(onProgress)` | Pide `/api/backup`; si no hay cotizaciones lanza un `Error` con «No hay cotizaciones para exportar.»; genera los PDF uno a uno llamando a `onProgress(hechos, total)`; arma el .zip y lo descarga. Cualquier fallo lanza `Error` con mensaje en español y no descarga nada |

Las funciones de nombre no importan nada del navegador, para poder probarlas con `node --test`.
`exportAll` carga `pdf.js` con `import()` dinámico solo cuando se usa, para que `backup.js` se pueda
importar desde las pruebas.
