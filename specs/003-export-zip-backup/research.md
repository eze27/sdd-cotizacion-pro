# Research: Exportar todas las cotizaciones en un .zip

No quedaban `NEEDS CLARIFICATION` en el contexto técnico. Estas son las decisiones tomadas.

## 1. Cómo armar el .zip

- **Decision**: JSZip 3.10.1 (MIT) como archivo local `public/vendor/jszip.min.js`, cargado con una
  etiqueta `<script>` igual que jsPDF. Los PDF se añaden con el método de compresión por defecto.
- **Rationale**: es la librería estándar para esto en el navegador, maneja nombres UTF-8 («García»,
  «Diseño») y el formato de forma probada. Sigue el patrón ya aceptado en el proyecto (jsPDF local, sin
  CDN, sin compilación). Verificado: la versión 3.10.1 existe en el registro de npm.
- **Alternatives considered**:
  - Escritor de .zip propio (CRC32, cabeceras, directorio central): ~80 líneas más pruebas; un error
    produce un .zip que el Explorador no abre, y viola «la solución más simple» al sustituir una
    librería probada por código propio.
  - Armar el .zip en el servidor: obligaría a generar los PDF allí, duplicando `pdf.js` y rompiendo la
    regla de que el PDF sale del navegador (FR-004).
  - `fflate`: válida y más pequeña, pero JSZip tiene API más directa para este caso y mejor
    documentación.

## 2. De dónde salen los datos

- **Decision**: nuevo `GET /api/backup` de solo lectura que devuelve, en una respuesta, perfil,
  servicios, clientes, cotizaciones completas (las mismas que `GET /api/quotes/:id`), contadores de
  folio y la fecha de hoy en México.
- **Rationale**: una sola petición evita 200 peticiones y da una instantánea coherente; reutilizar
  `serialize` de `quotes.js` garantiza que cada cotización traiga exactamente los mismos campos y
  totales que ya alimentan el PDF individual (FR-004). Los contadores de folio no se pueden deducir de
  las cotizaciones (un folio eliminado no se reutiliza), y sin ellos una restauración futura podría
  repetir folios (FR-006). La fecha del servidor da el nombre del .zip en hora de la Ciudad de México
  (FR-007) sin depender del reloj del equipo.
- **Alternatives considered**: componer el archivo en el navegador con las rutas existentes
  (`/profile`, `/services`, `/clients`, `/quotes` y `/quotes/:id` por cada cotización). Sin cambios en
  el servidor, pero N+1 peticiones, sin contadores de folio y con el riesgo de leer datos en momentos
  distintos.

## 3. PDF idénticos a los individuales

- **Decision**: separar en `pdf.js` el armado del guardado: `buildQuotePdf(quote)` devuelve el
  documento jsPDF y `downloadQuotePdf` pasa a ser «armar y `doc.save`». El .zip toma el contenido con
  `doc.output('arraybuffer')`. Cero cambios de maquetación.
- **Rationale**: una sola copia del dibujo del PDF; lo que se descarga uno a uno y lo que va en el .zip
  no puede divergir.
- **Nota**: jsPDF escribe la fecha de creación en los metadatos del archivo, así que dos PDF generados
  en momentos distintos no son idénticos byte a byte. «Idéntico» se verifica por contenido visible e
  importes, como se hizo en la spec 002 (`baseline-pdf-text.txt`).

## 4. Nombres de archivo

- **Decision**: funciones puras en `public/js/backup.js`, probadas con `node --test`:
  - `zipFileName(isoDate)` → `cotizacion-copia-AAAA-MM-DD.zip`.
  - `pdfEntryName(folio, clientName)` → `<folio> - <cliente limpio>.pdf`.
  - Limpieza del cliente: cada carácter de `\ / : * ? " < > |` y de control pasa a un guion; se colapsan
    espacios repetidos; se quitan espacios y puntos al inicio y al final (Windows no los admite); se
    recorta a 80 caracteres. Si queda vacío, el nombre es solo `<folio>.pdf`. Se conservan acentos y «ñ».
- **Rationale**: cubre FR-008, FR-009 y los casos límite. Como el folio es único, los nombres no chocan.
  Ejemplo: «Diseño/Web S.L.» → `2026-004 - Diseño-Web S.L.pdf`. El punto final de «S.L.» se quita para
  que Windows no lo descarte.
- **Alternatives considered**: eliminar los caracteres en vez de sustituirlos (se pegarían palabras),
  carpetas por año (la spec pide PDF y archivo de datos en el mismo nivel).

## 5. Formato del archivo de datos

- **Decision**: `datos-cotizaciones.json`, JSON con sangría. Sin número de versión del formato: sería un preparativo para una importación que esta spec deja fuera (Principio I).
- **Rationale**: se puede abrir con cualquier editor de texto, no necesita herramientas especiales y
  una futura importación lo lee directamente. El nombre lo fijó la clarificación; la extensión era del
  plan. Incluye el logo como texto (data URL), por lo que el archivo es autosuficiente.
- **Alternatives considered**: CSV/Excel (fuera de alcance), un archivo por entidad (la spec pide uno solo).

## 6. Progreso y errores

- **Decision**: mientras corre, el botón se deshabilita y muestra «Exportando… N de M». Entre PDF se
  cede el control al navegador (`await` de un turno de eventos) para que la pantalla se actualice. Si algo
  falla, se descarta el .zip a medias y se muestra el aviso; el botón vuelve a quedar activo.
- **Rationale**: FR-011 y FR-012 sin barras ni cancelación (no pedidas por la spec).

## 7. Sin cotizaciones

- **Decision**: el cliente mira `quotes.length === 0` en la respuesta del endpoint y avisa «No hay
  cotizaciones para exportar.»; no se crea ningún .zip.
- **Rationale**: decide con los datos reales del servidor, no con la lista que puede estar desactualizada
  en pantalla.
