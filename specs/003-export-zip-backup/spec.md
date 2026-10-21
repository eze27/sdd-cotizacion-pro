# Feature Specification: Exportar todas las cotizaciones en un .zip

**Feature Branch**: `003-export-zip-backup`

**Created**: 2026-10-21

**Status**: Draft

**Input**: User description: "Exportar todos mis presupuestos en un .zip. Que la persona freelancer pueda llevarse todas sus cotizaciones de una sola vez, en un único archivo comprimido, como copia de seguridad y para archivarlas donde quiera. Un botón «Exportar todo (.zip)» en la lista de cotizaciones descarga un .zip con un PDF por cada cotización (el mismo que ya genera la aplicación) y un único archivo de datos con cotizaciones, catálogo de servicios y perfil (logo incluido), pensado para poder restaurar la aplicación en el futuro. Importar la copia, exportar a Excel/CSV, copias automáticas y enviar el zip por email o nube quedan fuera."

## Clarifications

### Session 2026-10-21

- Q: ¿El archivo de datos debe incluir también la lista de clientes guardados? → A: Sí, se incluyen los clientes guardados junto con cotizaciones, servicios y perfil.
- Q: ¿Qué nombre debe llevar el archivo de datos dentro del .zip? → A: «datos-cotizaciones» (la extensión se decide en el plan).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descargar una copia completa en un solo archivo (Priority: P1)

La persona freelancer está en la lista de cotizaciones y quiere guardar todo su trabajo. Pulsa «Exportar todo (.zip)» y recibe un único archivo .zip. Al descomprimirlo con doble clic encuentra un PDF por cada cotización, con nombre «folio - cliente», y un archivo de datos con toda su información.

**Why this priority**: Es el valor completo de la spec: hoy los datos viven solo en su computadora y no hay forma de llevárselos de una vez. Sin esto no hay copia de seguridad.

**Independent Test**: Con 3 cotizaciones creadas, pulsar el botón, descargar el .zip, descomprimirlo y ver 3 PDF con nombre «folio - cliente» y un archivo de datos. Se puede comprobar solo con la aplicación y el explorador de archivos.

**Acceptance Scenarios**:

1. **Given** 3 cotizaciones guardadas, **When** la persona pulsa «Exportar todo (.zip)», **Then** se descarga un único archivo .zip.
2. **Given** el .zip descargado, **When** la persona lo descomprime, **Then** ve 3 PDF con nombre «folio - cliente» (por ejemplo, «2026-001 - Estudio García.pdf») y un archivo de datos.
3. **Given** el .zip exportado el 15 de marzo de 2026, **When** la persona ve el nombre del archivo, **Then** es «cotizacion-copia-2026-03-15.zip».
4. **Given** una sola cotización guardada, **When** exporta, **Then** el .zip contiene ese único PDF y el archivo de datos.
5. **Given** 200 cotizaciones guardadas, **When** exporta, **Then** el .zip contiene los 200 PDF y el archivo de datos, sin omitir ninguno.

---

### User Story 2 - Los PDF de la copia son idénticos a los de la aplicación (Priority: P1)

La persona abre cualquier PDF del .zip y lo compara con el que descarga desde la aplicación para la misma cotización: muestran exactamente lo mismo, con los mismos importes al centavo.

**Why this priority**: Una copia cuyos importes no cuadran con los documentos que ya entregó a sus clientes no sirve como respaldo ni como archivo.

**Independent Test**: Descargar desde la aplicación el PDF de una cotización, abrir el PDF con el mismo folio dentro del .zip y comparar contenido e importes.

**Acceptance Scenarios**:

1. **Given** una cotización con IVA y retenciones, **When** la persona compara su PDF del .zip con el que descarga desde la aplicación, **Then** el contenido y todos los importes (subtotal, IVA, retenciones, total) son idénticos al centavo.
2. **Given** una cotización vencida, **When** exporta, **Then** su PDF está incluido y es igual al que genera la aplicación para ella.

---

### User Story 3 - Aviso claro cuando no hay nada que exportar (Priority: P2)

La persona aún no ha creado cotizaciones y pulsa el botón. La aplicación le avisa en español, con claridad, que no hay nada que exportar y no descarga ningún archivo.

**Why this priority**: Evita descargar un .zip vacío que parezca una copia válida y dé una falsa sensación de respaldo.

**Independent Test**: Con 0 cotizaciones, pulsar el botón y comprobar que aparece el aviso y que no se descarga nada.

**Acceptance Scenarios**:

1. **Given** 0 cotizaciones guardadas, **When** la persona pulsa «Exportar todo (.zip)», **Then** ve un aviso claro de que no hay nada que exportar y no se descarga ningún archivo.

---

### User Story 4 - Ver que la exportación está trabajando (Priority: P3)

Con muchas cotizaciones (50 o más) la exportación puede tardar. Mientras trabaja, la persona ve que la aplicación está ocupada y no pulsa el botón varias veces ni cierra la página pensando que falló.

**Why this priority**: Mejora la confianza en un caso frecuente para quien ya acumula cotizaciones, pero la función ya sirve sin ello.

**Independent Test**: Con 50 o más cotizaciones, pulsar el botón y comprobar que durante la espera hay una señal visible de progreso y que al terminar se descarga el .zip.

**Acceptance Scenarios**:

1. **Given** 50 o más cotizaciones, **When** la persona pulsa el botón, **Then** mientras dura la exportación ve una indicación visible de que está en curso y el botón no permite lanzar otra exportación a la vez.
2. **Given** una exportación terminada, **When** se descarga el .zip, **Then** la indicación de trabajo desaparece y el botón vuelve a estar disponible.

---

### Edge Cases

- **Sin cotizaciones**: aviso claro, sin descarga (Historia 3).
- **Caracteres conflictivos en el nombre del cliente** (por ejemplo, «Diseño/Web S.L.»): el nombre del PDF dentro del .zip se limpia para que el archivo no se rompa ni se cree una carpeta no deseada; se conservan las letras con acento y la «ñ».
- **Nombre de cliente vacío o que queda vacío al limpiarlo**: el PDF se nombra solo con el folio.
- **Nombre de cliente muy largo**: se recorta para que el nombre de archivo siga siendo válido al descomprimir.
- **Muchas cotizaciones (50 o más)**: puede tardar; debe verse que está trabajando (Historia 4).
- **Falla la exportación a medias** (por ejemplo, se pierde la conexión con el servidor): la persona recibe un mensaje de error claro y no se descarga un .zip incompleto.
- **Cotizaciones de distintos años**: todas se incluyen, con su folio completo.
- **Exportar dos veces el mismo día**: el segundo .zip lleva el mismo nombre; el navegador gestiona el duplicado como en cualquier descarga.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La lista de cotizaciones MUST mostrar, en un lugar visible, un botón con el texto «Exportar todo (.zip)».
- **FR-002**: Al pulsar el botón con una o más cotizaciones guardadas, el sistema MUST descargar un único archivo .zip.
- **FR-003**: El .zip MUST contener exactamente un PDF por cada cotización guardada, sin omitir ni duplicar ninguna.
- **FR-004**: Cada PDF del .zip MUST ser el mismo documento que la aplicación genera hoy para esa cotización, con los mismos importes al centavo, sin recalcular ni reinterpretar.
- **FR-005**: El .zip MUST contener un único archivo de datos con toda la información: cotizaciones (con sus conceptos), clientes guardados, catálogo de servicios y perfil de la persona freelancer, incluido el logo.
- **FR-005a**: El archivo de datos MUST llamarse «datos-cotizaciones» (más la extensión que defina el plan) y MUST estar en el mismo nivel que los PDF.
- **FR-006**: El archivo de datos MUST contener la información completa y suficiente para poder restaurar la aplicación en el futuro (la restauración en sí queda fuera de esta spec).
- **FR-007**: El nombre del .zip MUST ser «cotizacion-copia-AAAA-MM-DD.zip», con la fecha del día de la exportación en hora de la Ciudad de México.
- **FR-008**: El nombre de cada PDF dentro del .zip MUST ser «folio - cliente.pdf» (por ejemplo, «2026-001 - Estudio García.pdf»).
- **FR-009**: El sistema MUST limpiar del nombre del cliente los caracteres no válidos en nombres de archivo, de forma que el .zip se abra correctamente y todos los PDF queden en el mismo nivel, sin carpetas intermedias.
- **FR-010**: Con 0 cotizaciones guardadas, el sistema MUST mostrar un aviso claro en español de que no hay nada que exportar y MUST NOT descargar ningún archivo.
- **FR-011**: Mientras la exportación está en curso, el sistema MUST mostrar una indicación visible de trabajo y MUST impedir lanzar otra exportación simultánea.
- **FR-012**: Si la exportación falla, el sistema MUST informar con un mensaje claro en español y MUST NOT descargar un .zip incompleto.
- **FR-013**: La exportación MUST ser de solo lectura: no modifica cotizaciones, folios, fechas de emisión, vigencia, servicios ni perfil; tras exportar, la aplicación MUST quedar exactamente igual.
- **FR-014**: Todo texto nuevo (botón, avisos, errores) MUST estar en español de México.

### Key Entities *(include if feature involves data)*

- **Copia de seguridad (.zip)**: archivo único que agrupa los PDF de todas las cotizaciones y el archivo de datos; su nombre lleva la fecha de exportación.
- **PDF de cotización**: documento de una cotización, igual al que ya se descarga una a una; en la copia se nombra «folio - cliente».
- **Archivo de datos**: un solo archivo con las cotizaciones y sus conceptos, los clientes guardados, el catálogo de servicios y el perfil con su logo, pensado para una restauración futura.
- **Cotización, Cliente, Servicio, Perfil del freelancer**: entidades existentes de la spec 001; esta spec solo las lee.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con 3 cotizaciones creadas, la persona pulsa el botón y obtiene un único .zip, que al descomprimir muestra 3 PDF con nombre «folio - cliente» y un archivo de datos.
- **SC-002**: En el 100 % de las cotizaciones comprobadas, el PDF del .zip es idéntico en contenido y en importes (al centavo) al que se descarga desde la aplicación para esa cotización.
- **SC-003**: Con 0 cotizaciones, la persona ve el aviso de que no hay nada que exportar y no se descarga ningún archivo.
- **SC-004**: Un cliente llamado «Diseño/Web S.L.» produce un PDF con nombre válido y el .zip se abre sin errores.
- **SC-005**: Con 50 cotizaciones, la persona ve una señal de trabajo durante toda la espera y termina con un .zip que contiene los 50 PDF.
- **SC-006**: Tras exportar, la lista de cotizaciones, los folios, las fechas y los totales son exactamente los mismos que antes de exportar.
- **SC-007**: Una persona no técnica completa la exportación (pulsar, descargar, descomprimir) en menos de 1 minuto con unas 10 cotizaciones, sin ayuda.

## Assumptions

- «Presupuesto» en la petición equivale a «cotización» en la aplicación (spec 001), y «número» equivale al folio (AAAA-NNN); el texto de producto usa «cotización» y «folio».
- «Céntimo» se entiende como centavo, acorde con la moneda MXN (Principio II de la constitución).
- Se exportan todas las cotizaciones guardadas, vigentes y vencidas, sin filtros ni selección parcial.
- La aplicación es de una sola persona, sin cuentas ni contraseña; la exportación no pide autenticación.
- El formato y la extensión del archivo de datos quedan a decisión del plan; solo se exige que sea un único archivo con información completa y el nombre «datos-cotizaciones». Su restauración (importar) es otra spec.
- Dos cotizaciones nunca tienen el mismo folio, por lo que los nombres de PDF dentro del .zip no chocan aunque dos clientes se llamen igual.
- El .zip se guarda donde el navegador guarde las descargas; la aplicación no elige la carpeta ni envía el archivo a ningún lado.
- Fuera de alcance: importar o restaurar la copia, exportar a Excel/CSV con formato contable, copias automáticas o programadas, y enviar el .zip por correo o subirlo a una nube.
