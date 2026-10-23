# Feature Specification: Página de inicio y dirección visual «Despacho»

**Feature Branch**: `002-rediseno-inicio` (revisión 2 desarrollada en `002-rediseno-visual-despacho`)

**Created**: 2026-10-20

**Last Revised**: 2026-10-21

**Status**: Draft (revisión 2 — la revisión 1 quedó PUBLISHED e implementada)

**Input**: User description (revisión 2): "Reescribir esta spec, no crear una nueva. La dirección visual elegida es «Despacho»: sustituir la paleta y la tipografía por defecto de framework de la revisión 1 por una identidad deliberada —fondo crema, tinta casi negra, verde profundo, cobre, serif con autoridad para títulos y folios, sans neutro para la interfaz, monoespaciada tabular para los importes—, cerrar los huecos de estados (pulsado, carga, campo inválido), dar densidad al escritorio y separar las secciones a nivel de página, en la aplicación y en el PDF. Los criterios de modificación están en `specs/pre-specs/direccion-visual-despacho.md`. Ningún cálculo, importe, contenido de PDF, ruta, endpoint ni dato almacenado cambia."

**Input (revisión 1)**: User description: "Mejorar la presentación de CotizacionesPro (aplicación ya implementada en la spec 001) con dos cambios, sin alterar ninguna funcionalidad ni dato existente. Primero, una página de inicio como punto de entrada, con acceso claro a Cotizaciones, Clientes, Servicios y Perfil, un resumen de actividad con el número de cotizaciones por estado y una navegación común, visible y adaptable a móvil en todas las páginas. Segundo, un rediseño visual de toda la aplicación y del PDF, limpio, sobrio y profesional, con referencia al estilo de PrimeNG, con tipografía consistente, paleta limitada y centralizada, espaciado uniforme, componentes reutilizables y etiquetas de estado con colores semánticos discretos. Mantener mobile-first. La lógica de negocio, los cálculos, la API, el esquema de datos y las funcionalidades existentes no deben cambiar."

## Revisiones

### Revisión 2 (2026-10-21) — dirección visual «Despacho»

Esta revisión **reemplaza la dirección visual** de la revisión 1, no su estructura. Qué cambia y qué no:

| Parte de la spec | Revisión 2 |
|------------------|-----------|
| Página de inicio con resumen (US1, FR-001 a FR-005) | **Sin cambios.** Ya implementada; solo cambia su apariencia |
| Navegación común (US2, FR-006 a FR-008) | **Sin cambios de comportamiento.** Cambia su apariencia y su altura en escritorio |
| Identidad visual (US3, FR-009 a FR-014) | **Reescrita.** La referencia deja de ser PrimeNG y pasa a ser la dirección «Despacho» |
| PDF (US4, FR-015 a FR-016) | **Reescrita** su presentación. Su contenido y sus cifras siguen intactos |
| Sin cambios funcionales (FR-017 a FR-019) | **Conservados**, con FR-019 actualizado (desaparece la referencia a PrimeNG) |
| Estados y retroalimentación (US5, FR-020 a FR-024) | **Nuevo.** Cierra huecos que la revisión 1 dejó sin cubrir |
| Densidad y uso del ancho (US6, FR-025 a FR-028) | **Nuevo.** La revisión 1 solo definió un tramo de pantalla |

**Reversión explícita respecto a la revisión 1**: esa revisión asumió que «la impresión del PDF en blanco y negro no es un requisito». En la revisión 2 **sí lo es** (FR-016a, SC-030): el destinatario archiva el PDF impreso junto a sus facturas.

**Valores exactos de los tokens**: viven en `specs/pre-specs/direccion-visual-despacho.md`, sección 4 (color, tipografía, espaciado, forma, movimiento). Esta spec define el *qué* y el *por qué*; `/speckit-plan` transcribe esos valores a `contracts/design-system.md`, que queda reemplazado por completo.

**Artefactos que esta revisión invalida y hay que regenerar**: `plan.md`, `tasks.md`, `contracts/design-system.md`, `contracts/pdf-visual.md` y los `baseline-*.txt` (que deben recapturarse *antes* de implementar, como referencia de «el PDF de antes del cambio»).

## Clarifications

### Session 2026-10-20 (revisión 1)

- Q: ¿Cómo se tratan los estados Borrador, Enviado, Aceptado, Rechazado y Caducado, si hoy solo existe el estado derivado "vencida"? → A: Solo visual. Se muestran únicamente los estados que ya existen (vigente y vencida) con etiquetas de color; el resumen cuenta cotizaciones por esos dos estados. Borrador, Enviado, Aceptado y Rechazado quedan fuera de esta spec.
- Q: ¿Español de España o de México? → A: Se mantiene español de México y pesos MXN (Principio II de la constitución y FR-021 de la spec 001); no se cambia ningún texto ni formato de importes.

### Session 2026-10-21 (revisión 2)

- Q: ¿Qué dirección visual, entre «Despacho», «Taller» y «Cal y Barro»? → A: **«Despacho»**, en pantalla y en PDF, con un solo juego de tokens. Se descarta mantener dos identidades (una para la aplicación y otra para el documento) por el Principio I de la constitución.
- Q: ¿La etiqueta «Vigente» conserva el color informativo de la revisión 1? → A: No. En la paleta «Despacho» no hay azul; «Vigente» pasa a la familia verde y «Vencida» a la cobre. El texto de la etiqueta no cambia.
- Q: ¿El PDF usa exactamente la misma tipografía que la pantalla? → A: No se exige. El PDF usa un serif de la misma clase, sin incrustar tipografías, para no engordar el archivo (SC-031). «Misma identidad» significa misma paleta, misma jerarquía y misma clase tipográfica.

### Session 2026-10-22 (revisión 2 — alcance)

- Q: ¿Entra un componente propio de confirmación al eliminar, o se conserva el cuadro del navegador? → A: **Entra, y como componente genérico reutilizable** (superposición, foco atrapado, cierre con la tecla de escape, retorno del foco al elemento de origen), no como un caso particular de la eliminación. Es la pieza de más trabajo de la revisión y se asume a conciencia: el momento irreversible del producto no puede seguir mostrando el cuadro del navegador. Lo usarán los tres sitios que hoy confirman algo: eliminar cotización, cliente y servicio.
- Q: ¿Cómo se agrupan en celular las cuatro acciones de cada cotización? → A: **Se retira «Abrir» y se jerarquizan las tres restantes.** «Abrir» es redundante, porque el folio de la fila ya es un enlace a la cotización; quitarlo no pierde funcionalidad y evita introducir un menú de acciones, que sería un componente nuevo. No se construye menú de desbordamiento.
- Q: ¿Cuántas familias tipográficas entran? → A: **Dos: serif y sans.** La sans cubre los importes con sus cifras de ancho fijo, con lo que se cumple igual la alineación de dígitos (SC-013) y se ahorra la tercera descarga. Se renuncia a la monoespaciada y al matiz de «libro de cuentas» en las columnas de importes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar por una página de inicio con resumen (Priority: P1)

*Sin cambios respecto a la revisión 1; ya implementada. Solo cambia su apariencia.*

Al abrir la dirección principal de la aplicación, la persona ve una página de inicio que le da la bienvenida, le muestra cuántas cotizaciones tiene vigentes y cuántas vencidas, y le ofrece accesos claros a Cotizaciones, Clientes, Servicios y Perfil, además de un acceso directo para crear una cotización nueva.

**Why this priority**: Es el punto de entrada de toda la aplicación y el cambio funcional visible de la revisión 1; sin él, abrir la dirección sigue llevando directo a la lista.

**Independent Test**: Abrir la dirección principal con varias cotizaciones guardadas (algunas con más de 30 días desde su emisión) y comprobar que el resumen coincide con lo que muestra la lista de cotizaciones y que cada acceso lleva a su sección.

**Acceptance Scenarios**:

1. **Given** que existen cotizaciones guardadas, **When** la persona abre la dirección principal, **Then** ve la página de inicio con el número de cotizaciones vigentes y el de vencidas, cuya suma es el total de cotizaciones de la lista.
2. **Given** la página de inicio, **When** elige Cotizaciones, Clientes, Servicios o Perfil, **Then** llega a la sección correspondiente, que funciona igual que antes.
3. **Given** que no hay cotizaciones, **When** abre el inicio, **Then** el resumen muestra cero en cada estado y un mensaje que invita a crear la primera cotización, con acceso directo a hacerlo.
4. **Given** que aún no hay perfil guardado, **When** abre el inicio, **Then** se le dirige a capturar su perfil, como ya ocurre hoy.
5. **Given** que una cotización vigente cumple más de 30 días, **When** se recarga el inicio, **Then** el resumen la cuenta como vencida, igual que la lista.
6. **Given** una pantalla de celular (360 px de ancho), **When** se abre el inicio, **Then** el contenido se lee sin desplazamiento horizontal y los accesos se pueden tocar con comodidad.

---

### User Story 2 - Navegación común en todas las páginas (Priority: P1)

*Comportamiento sin cambios respecto a la revisión 1; ya implementada. Cambia su apariencia y su altura en escritorio.*

En cualquier pantalla de la aplicación (inicio, listas, formularios, editor de cotización), la persona ve la misma navegación, con la sección actual resaltada, y puede pasar a otra sección sin volver atrás. En el celular la navegación se adapta al ancho de pantalla y sigue siendo fácil de usar con una mano.

**Why this priority**: Moverse entre secciones es parte de todo flujo; tener una navegación única y coherente es requisito para el resto de la identidad visual.

**Independent Test**: Recorrer cada pantalla en escritorio y a 360 px de ancho, comprobando que la navegación está presente, que marca la sección actual y que permite llegar a las otras cuatro secciones y al inicio.

**Acceptance Scenarios**:

1. **Given** cualquier pantalla, **When** se muestra, **Then** aparece la misma navegación con acceso al inicio y a Cotizaciones, Clientes, Servicios y Perfil.
2. **Given** que la persona está en una sección o en el editor de una cotización, **When** mira la navegación, **Then** la sección a la que pertenece aparece resaltada.
3. **Given** una pantalla de celular, **When** se usa la navegación, **Then** todas las secciones son accesibles sin desplazamiento horizontal, cada elemento tiene un tamaño táctil cómodo y las cinco etiquetas se leen completas.
4. **Given** un teclado, **When** se recorre la navegación, **Then** cada acceso se puede alcanzar y activar, y el foco es visible.

---

### User Story 3 - Identidad visual «Despacho» en toda la aplicación (Priority: P1)

*Reescrita en la revisión 2.*

Todas las pantallas comparten una identidad visual deliberada y propia: fondo de papel crema en lugar de gris azulado, tinta casi negra, un verde profundo como único color de acción, un cobre reservado para lo que requiere atención, títulos en una tipografía con remates que da autoridad, interfaz en una sans neutra e importes en una tipografía de ancho fijo cuyos dígitos quedan alineados en columna. La jerarquía se nota de un golpe: el título de página manda, los títulos de sección agrupan, el cuerpo se lee cómodo y las cifras destacan. Botones, formularios, tablas, tarjetas y etiquetas de estado se ven y se comportan igual en toda la aplicación.

**Why this priority**: Es el objeto de esta revisión y lo que hace que la herramienta —y sobre todo el documento que genera— se lea como el trabajo de un profesional establecido, no como la exportación de una herramienta genérica.

**Independent Test**: Recorrer las seis pantallas (inicio, perfil, clientes, servicios, lista y editor de cotizaciones) y comprobar que los mismos tipos de elemento se ven iguales en todas, que la identidad es la descrita, que no queda ningún color de la revisión 1, que todas las tareas de la spec 001 siguen funcionando y que no cambia ningún dato, texto de negocio ni cifra.

**Acceptance Scenarios**:

1. **Given** cualquier pantalla, **When** se compara con otra, **Then** usan la misma paleta, el mismo reparto de tipografías, el mismo espaciado y el mismo aspecto para botones principales, secundarios y de eliminación.
2. **Given** cualquier pantalla, **When** se mira el título de página junto al nombre del producto de la barra superior, **Then** el título es claramente más grande y usa la tipografía con remates, mientras el nombre del producto no compite con él.
3. **Given** el fondo de cualquier pantalla, **When** se compara con una tarjeta, **Then** el fondo es un crema cálido distinguible del blanco de la tarjeta, y no un gris azulado.
4. **Given** la lista de cotizaciones, **When** se mira la columna de importes, **Then** los dígitos de todas las filas quedan alineados en columna vertical, lleven o no coma de miles.
5. **Given** la lista de cotizaciones, **When** hay cotizaciones vigentes y vencidas, **Then** cada una muestra una etiqueta con su texto («Vigente» o «Vencida») y un color de la familia de la identidad, de modo que el estado se entienda sin depender solo del color.
6. **Given** cualquier pantalla puesta en escala de grises, **When** se mira la lista, **Then** sigue distinguiéndose una cotización vigente de una vencida sin adivinar.
7. **Given** una cotización existente, **When** se abre tras el cambio, **Then** sus folios, fechas, conceptos, importes, impuestos y totales son idénticos a los de antes.
8. **Given** las pantallas de lista, **When** se ven en celular, **Then** la información se apila y se lee sin desplazamiento horizontal.
9. **Given** cualquier pantalla, **When** se buscan los colores de la revisión 1 (el azul de acción y los grises azulados de fondo y borde), **Then** no aparece ninguno.

---

### User Story 4 - PDF que el cliente recibe con la identidad «Despacho» (Priority: P1)

*Reescrita en la revisión 2. Sube de P2 a P1.*

El PDF que recibe el cliente adopta la identidad «Despacho»: encabezado ordenado con el logo y los datos del emisor, títulos y folio en la tipografía con remates, tabla de conceptos clara con los importes alineados, desglose de impuestos y total destacado en el verde profundo, y la fecha de vigencia señalada en cobre. Se lee igual de bien en el visor del celular que impreso en una láser en blanco y negro, porque su jerarquía no depende del color.

**Why this priority**: El destinatario del PDF no entra nunca a la aplicación: el documento es su única experiencia del producto, y es quien decide si contrata. Es el usuario por el que se eligió esta dirección visual.

**Independent Test**: Capturar primero los PDF de referencia de las tres cotizaciones de ejemplo de la spec 001 (persona moral con ISR 10 %, persona moral con ISR 1.25 % y persona física); tras el cambio, descargar los tres de nuevo, comprobar cifra por cifra que el contenido coincide, que el aspecto es el nuevo, y que impresos en blanco y negro siguen legibles.

**Acceptance Scenarios**:

1. **Given** una cotización, **When** se descarga el PDF, **Then** conserva todo el contenido de la spec 001 (folio, fechas, emisor, cliente, conceptos, subtotal, IVA, retenciones solo para persona moral y total) con idénticos importes.
2. **Given** el PDF nuevo junto a una pantalla de la aplicación, **When** se comparan, **Then** se reconocen como el mismo producto: misma paleta y títulos de la misma clase tipográfica.
3. **Given** el PDF, **When** se lee, **Then** el folio, el cliente, el total y la fecha de vigencia se identifican de un golpe, y el total aparece destacado.
4. **Given** el PDF impreso en una láser monocromática, **When** se lee en papel, **Then** mantiene la misma jerarquía: no hay información que solo se distinga por color.
5. **Given** una cotización sin logo o con muchos conceptos que ocupan más de una página, **When** se descarga el PDF, **Then** el diseño sigue siendo ordenado y legible en todas las páginas.
6. **Given** una cotización vencida, **When** se descarga el PDF, **Then** el contenido es el mismo que el de una vigente (el PDF no cambia por estar vencida, como ya ocurría).
7. **Given** acentos, la letra ñ y descripciones largas, **When** se descarga el PDF, **Then** se leen correctamente.
8. **Given** el PDF de una cotización, **When** se compara su tamaño de archivo con el de antes del cambio, **Then** no ha crecido de forma apreciable.

---

### User Story 5 - Saber qué está pasando: estados y retroalimentación (Priority: P2)

*Nueva en la revisión 2.*

La interfaz responde. Al pulsar un botón, el botón acusa el toque antes de soltarlo. Mientras el inicio carga sus cifras, el hueco de cada cifra ya está reservado, así que nada salta cuando el dato llega. Si un campo obligatorio queda vacío, el propio campo se marca, además del mensaje de abajo. Si una acción tarda, el elemento que la lanzó lo indica sin empujar lo que tiene al lado. Los avisos de error se quedan hasta que la persona los cierra; los de éxito se van solos.

**Why this priority**: Son huecos reales que la revisión 1 dejó sin cubrir y que hacen que la aplicación se sienta inerte, pero no impiden completar ninguna tarea. Van después de la identidad.

**Independent Test**: Recorrer las seis pantallas pulsando cada tipo de botón, recargar el inicio con la red limitada, intentar guardar un formulario con un campo obligatorio vacío, lanzar la exportación completa y provocar un error y un éxito, comprobando cada comportamiento descrito.

**Acceptance Scenarios**:

1. **Given** cualquier botón, **When** se mantiene pulsado, **Then** cambia visiblemente antes de soltarlo.
2. **Given** el inicio con la red limitada, **When** se recarga, **Then** en el lugar de cada cifra hay un hueco del tamaño de la cifra final, y al llegar el dato nada salta ni se ensancha.
3. **Given** el editor de cotización con un campo obligatorio vacío, **When** se intenta guardar, **Then** el campo queda marcado como inválido **y** aparece su mensaje debajo, y quien use lector de pantalla también recibe el aviso.
4. **Given** la lista de cotizaciones, **When** se lanza la exportación completa, **Then** el elemento que la lanzó indica el avance sin cambiar de ancho, y nada de lo que tiene al lado se mueve.
5. **Given** un error, **When** se muestra el aviso, **Then** permanece hasta que la persona lo cierra o cambia de pantalla; **Given** un éxito, **Then** el aviso desaparece solo. En ambos casos se puede cerrar.
6. **Given** que la persona prefiere movimiento reducido, **When** usa la aplicación, **Then** ningún cambio de estado depende de una animación para entenderse.
7. **Given** cualquier elemento interactivo, **When** se recorre con teclado, **Then** el foco es visible y claramente distinguible del estado de reposo.
8. **Given** una cotización de la lista, **When** se pide eliminarla, **Then** la confirmación aparece dentro de la aplicación y con su identidad visual, el resto de la página queda inactivo, el foco no se escapa de la confirmación, se puede cancelar con la tecla de escape y con un botón, la opción por defecto es cancelar, y al cerrarse el foco vuelve al elemento que la abrió.

---

### User Story 6 - Densidad y aprovechamiento del ancho en escritorio (Priority: P2)

*Nueva en la revisión 2.*

En el monitor donde la persona captura y revisa, la aplicación aprovecha el ancho: el contenido ocupa una franja más amplia, con márgenes laterales generosos, y las listas muestran muchas más filas de un vistazo porque las filas y los controles son más compactos que en el celular. En el celular nada de esto cambia: los tamaños táctiles se mantienen. Además, en cada página se nota dónde acaba una sección y empieza la siguiente.

**Why this priority**: Mejora el trabajo diario de la única persona que usa la aplicación, pero no afecta al PDF ni a lo que ve el cliente.

**Independent Test**: Abrir las seis pantallas en un monitor de 1440 px y en un celular de 360 px, contar las filas visibles de la lista de cotizaciones en escritorio y comprobar que los tamaños táctiles del celular no se han reducido.

**Acceptance Scenarios**:

1. **Given** un monitor de 1440 px, **When** se abre cualquier pantalla, **Then** el contenido ocupa un ancho claramente mayor que antes del cambio y los márgenes laterales son visiblemente más anchos que en el celular.
2. **Given** un monitor de 1440 px, **When** se abre la lista de cotizaciones con datos suficientes, **Then** caben al menos 14 filas sin desplazar.
3. **Given** un celular de 360 px, **When** se tocan botones y campos, **Then** su tamaño táctil es el mismo de antes del cambio: la densidad de escritorio no lo reduce.
4. **Given** la página de inicio, **When** se mira, **Then** la separación entre el bloque de cifras y el título «Accesos» es claramente mayor que la que hay entre «Accesos» y sus tarjetas.
5. **Given** una pantalla ancha, **When** hay un bloque de texto corrido, **Then** su ancho de línea se mantiene cómodo de leer y no se estira de lado a lado.
6. **Given** la lista de cotizaciones en un celular de 360 px, **When** se mira una cotización, **Then** muestra tres acciones jerarquizadas (sin la de abrir, que vive en el folio) y ocupa un solo bloque legible, sin varios renglones de botones.

---

### Edge Cases

- ¿Qué pasa si no se puede consultar el resumen (falla de conexión)? La página de inicio sigue mostrando los accesos a las secciones y un aviso claro de que no se pudo cargar el resumen, sin bloquear la navegación; el fallo se distingue de un cero.
- ¿Qué pasa con las direcciones guardadas por la persona (por ejemplo, a la lista de cotizaciones o a una cotización concreta)? Siguen funcionando y llevan a la misma pantalla de antes.
- ¿Qué pasa con nombres o descripciones muy largos (cliente, concepto, servicio)? No rompen el diseño: se ajustan en varias líneas sin desbordar la pantalla ni el PDF.
- ¿Qué pasa con cientos de cotizaciones? El resumen y la lista siguen mostrándose de forma instantánea para el uso esperado.
- ¿Qué pasa si el navegador está en modo de texto grande o en una pantalla muy angosta? La navegación y los formularios siguen siendo utilizables, y la densidad de escritorio no se aplica.
- ¿Qué pasa si la persona prefiere movimiento reducido? No hay animaciones necesarias para entender la interfaz, y ningún estado se comunica solo con movimiento.
- ¿Qué pasa si las tipografías de la identidad no llegan a cargar? La aplicación sigue siendo legible con las tipografías de reserva, sin que el texto desaparezca ni la disposición se rompa.
- ¿Qué pasa si el cliente imprime el PDF en blanco y negro? Mantiene toda su jerarquía; es un caso previsto, no un accidente.
- ¿Qué pasa en el PDF con el cobre de la fecha de vigencia al imprimirse en gris? La fecha sigue identificándose por su posición y su etiqueta, no por el color.

## Requirements *(mandatory)*

### Functional Requirements

**Página de inicio y navegación** *(sin cambios respecto a la revisión 1)*

- **FR-001**: Al abrir la dirección principal de la aplicación, el sistema MUST mostrar una página de inicio como punto de entrada, en lugar de llevar directamente a la lista de cotizaciones.
- **FR-002**: La página de inicio MUST ofrecer accesos claros a Cotizaciones, Clientes, Servicios y Perfil, y un acceso directo para crear una cotización nueva.
- **FR-003**: La página de inicio MUST mostrar un resumen de actividad con el número de cotizaciones vigentes y el número de vencidas, calculados con la misma regla de vigencia de la spec 001 (FR-014), de modo que siempre coincidan con la lista de cotizaciones.
- **FR-004**: Si no hay cotizaciones, el resumen MUST mostrar cero en cada estado y un mensaje que invite a crear la primera.
- **FR-005**: Si falla la carga del resumen, la página de inicio MUST seguir mostrando los accesos y un aviso claro en español, sin impedir la navegación, y el fallo MUST distinguirse visualmente de un resultado de cero.
- **FR-006**: Todas las pantallas MUST compartir una misma navegación visible con acceso al inicio y a las cuatro secciones, que resalte la sección actual y que se adapte al ancho de pantalla, desde 360 px hasta escritorio, sin desplazamiento horizontal: barra fija inferior en celular y barra superior en escritorio.
- **FR-007**: La navegación MUST poder usarse con teclado, con foco visible, y sus elementos táctiles MUST tener un tamaño cómodo en celular. Las cinco etiquetas MUST leerse completas a 360 px.
- **FR-008**: Las direcciones existentes de la aplicación (lista de cotizaciones, cotización, edición, clientes, servicios y perfil) MUST seguir funcionando y llevar a la misma pantalla que antes. La regla de redirigir al perfil cuando aún no existe MUST conservarse.

**Identidad visual «Despacho»** *(reescrito en la revisión 2)*

- **FR-009**: Toda la aplicación MUST aplicar la identidad visual «Despacho», definida por: fondo de papel crema cálido, superficies blancas, tinta casi negra, un único color de acción verde profundo, un color de atención cobre que nunca es pulsable, y un rojo cálido para lo destructivo. La identidad MUST NOT conservar ningún color de la revisión 1.
- **FR-010**: Los colores, las tipografías, los tamaños de texto, el espaciado, las formas, las elevaciones y las duraciones MUST definirse en un solo lugar, de forma que un cambio se aplique a toda la aplicación y al PDF sin tocar cada pantalla. Ningún componente MUST usar un valor suelto.
- **FR-011**: La identidad MUST usar **dos** familias tipográficas, con dos papeles: una tipografía con remates para los títulos, el folio de la cotización y el importe total; y una sans neutra para todo lo demás (cuerpo, etiquetas, botones, navegación, ayudas, errores e importes). Los importes, cantidades, porcentajes y fechas en tabla MUST usar las cifras de ancho fijo de la sans, de modo que sus dígitos queden alineados en columna. La spec MUST NOT añadir una tercera familia.
- **FR-012**: La escala de tamaños de texto MUST permitir una jerarquía inequívoca: el título de página MUST verse claramente mayor y de distinta clase tipográfica que el nombre del producto de la barra superior, y los títulos de tarjeta MUST distinguirse del texto de cuerpo sin recurrir solo al peso.
- **FR-013**: Botones (principal, secundario, peligroso, de texto), campos de formulario con su etiqueta, ayuda y mensaje de error, tablas o listas, tarjetas, panel de totales y etiquetas de estado MUST tener un único estilo reutilizable en todas las pantallas, con un repertorio de formas y elevaciones que distinga una tarjeta en reposo de una pulsable y de un elemento superpuesto.
- **FR-014**: Las etiquetas de estado de cotización MUST mostrar texto («Vigente» o «Vencida») y un color de la familia de la identidad; «Vigente» MUST pasar a la familia verde y «Vencida» a la cobre. El significado MUST ser comprensible sin depender solo del color, también en escala de grises. El sistema de etiquetas MUST dejar definidos los estilos para los estados futuros (Borrador, Enviado, Aceptado, Rechazado), pero esta spec MUST NOT mostrarlos ni exigir datos nuevos.
- **FR-014a**: Todo texto MUST alcanzar un contraste de al menos 4.5:1 contra su fondo, etiquetas de estado incluidas, y todo borde de control o anillo de foco al menos 3:1.
- **FR-014b**: El diseño MUST evitar elementos decorativos innecesarios: sin degradados, sin ilustraciones y sin sombras de color.
- **FR-014c**: Las tipografías de la identidad MUST servirse desde el propio producto, sin depender de ningún servicio externo en producción, y la aplicación MUST seguir siendo legible y bien dispuesta si no llegan a cargar.

**PDF** *(reescrito en la revisión 2)*

- **FR-015**: La plantilla del PDF MUST adoptar la identidad «Despacho»: títulos y folio en un serif de la misma clase que el de la pantalla, cuerpo y tabla en la sans, total destacado en el verde profundo, fecha de vigencia señalada en cobre, fondo blanco y los importes alineados. «Misma identidad» significa misma paleta, misma jerarquía y misma clase tipográfica, no necesariamente la misma tipografía exacta.
- **FR-016**: El contenido, el orden de la información, los importes y las reglas del PDF definidos en la spec 001 MUST permanecer idénticos; solo cambia su presentación. Sigue sin llevar notas ni condiciones de pago.
- **FR-016a**: El PDF MUST mantener su jerarquía completa impreso en una impresora monocromática: ninguna información MUST distinguirse únicamente por color. Esta comprobación es parte de dar la plantilla por terminada.
- **FR-016b**: El PDF MUST NOT crecer de forma apreciable respecto al actual; no se MUST incrustar tipografías para lograr el parecido de FR-015.

**Estados y retroalimentación** *(nuevo en la revisión 2)*

- **FR-020**: Todo elemento interactivo MUST definir cinco estados distinguibles: reposo, apuntado, pulsado, enfocado y deshabilitado. El estado pulsado MUST notarse antes de soltar, también en pantalla táctil.
- **FR-021**: Mientras un dato se está cargando, su hueco MUST estar reservado con el tamaño que tendrá el dato final, de modo que al llegar nada salte ni se ensanche. Un dato que no se pudo cargar MUST distinguirse de un dato cuyo valor es cero.
- **FR-022**: Un campo con error MUST marcarse en el propio campo, además de su mensaje de texto, y MUST anunciarse a las tecnologías de asistencia.
- **FR-023**: Un elemento que lanza una acción que tarda MUST indicar el avance sin cambiar de tamaño ni desplazar a los elementos vecinos.
- **FR-024**: Los avisos MUST poder cerrarse. Un aviso de error MUST permanecer hasta que la persona lo cierre o cambie de pantalla; un aviso de éxito MUST desaparecer solo.
- **FR-024a**: Las confirmaciones de acciones irreversibles MUST mostrarse dentro de la aplicación, con su propia identidad visual, mediante un componente de confirmación **reutilizable** (no un caso particular de una pantalla). El componente MUST: impedir la interacción con el resto de la página mientras está abierto; mantener el foco dentro de sí; poder cancelarse con la tecla de escape y con un botón explícito; devolver el foco al elemento que lo abrió al cerrarse; y distinguir visualmente la acción destructiva de la de cancelar. La acción por defecto MUST ser la de cancelar. El cuadro de confirmación del navegador MUST NOT seguir usándose.

**Densidad y disposición** *(nuevo en la revisión 2)*

- **FR-025**: La aplicación MUST definir al menos tres tramos de ancho de pantalla, de modo que el escritorio reciba su propia densidad en lugar de heredar la del celular.
- **FR-026**: En escritorio, los controles y las filas de lista MUST ser más compactos que en celular, y el contenido MUST ocupar una franja más amplia con márgenes laterales mayores que los del celular. En celular, los tamaños táctiles MUST NOT reducirse.
- **FR-026a**: Cada cotización de la lista MUST ofrecer tres acciones, no cuatro: la acción de abrir MUST retirarse de la fila, porque el folio de la cotización ya es un enlace a ella. Las tres restantes (descargar, editar y eliminar) MUST jerarquizarse visualmente, de modo que a 360 px cada cotización ocupe un solo bloque legible. Esta spec MUST NOT introducir un menú de acciones ni ningún otro componente de desbordamiento.
- **FR-027**: Las páginas MUST separar visiblemente sus secciones: la distancia entre dos secciones MUST ser claramente mayor que la distancia entre un título y el contenido al que encabeza.
- **FR-028**: Un bloque de texto corrido MUST tener un ancho de línea limitado, de modo que no se estire de lado a lado en una pantalla ancha.

**Sin cambios funcionales** *(conservado de la revisión 1)*

- **FR-017**: Esta mejora MUST NOT cambiar la lógica de negocio, los cálculos de importes, folios y vigencia, el comportamiento del servidor y de su interfaz de datos, la estructura de los datos guardados ni ninguna funcionalidad de las specs 001 y 003; los datos ya guardados MUST seguir mostrándose sin migración ni pérdida.
- **FR-018**: Todos los textos, mensajes y el PDF MUST seguir en español de México y los importes en pesos mexicanos con el formato de la spec 001 (por ejemplo, $20,000.00); los textos nuevos de esta spec MUST seguir esa misma norma. Esta spec MUST NOT reescribir ningún texto de producto existente.
- **FR-019**: Antes de implementar, se MUST revisar la estructura y los componentes existentes para reutilizar lo que corresponda; esta spec MUST NOT añadir ningún framework, paso de compilación ni dependencia de red nueva. Las referencias visuales de la dirección «Despacho» se toman como inspiración, no como librerías a incorporar.

### Key Entities *(include if feature involves data)*

- **Resumen de actividad**: dato derivado, no guardado, con el número de cotizaciones vigentes y vencidas en el momento de abrir el inicio; su suma es el total de cotizaciones.
- **Estado de cotización**: etiqueta visual derivada de la fecha de emisión (vigente o vencida); no es un dato nuevo ni editable. Un solo lugar decide su texto y su color.
- **Sistema visual**: conjunto único de colores, tipografías, tamaños, espaciado, formas, elevaciones y duraciones, compartido por las pantallas y por el PDF, definido en un solo lugar.

## Success Criteria *(mandatory)*

### Measurable Outcomes

*SC-001 a SC-010 vienen de la revisión 1 y siguen vigentes. SC-011 y siguientes son de la revisión 2.*

- **SC-001**: Al abrir la dirección principal, el 100 % de las veces aparece la página de inicio con los cuatro accesos y el resumen, y desde ella se llega a cualquiera de las cuatro secciones en un solo toque o clic.
- **SC-002**: La suma de cotizaciones vigentes y vencidas del resumen es igual al número de cotizaciones de la lista, y cada cifra coincide con las etiquetas de la lista, en el 100 % de las pruebas con datos de ejemplo.
- **SC-003**: Desde cualquier pantalla se puede llegar a cualquier otra sección en un solo toque o clic, sin usar el botón de atrás del navegador.
- **SC-004**: Las seis pantallas (inicio, cotizaciones, editor, clientes, servicios y perfil) se pueden usar a 360 px de ancho sin desplazamiento horizontal y sin elementos cortados, en Chrome y Firefox.
- **SC-005**: Una persona que no participó en el diseño distingue, sin ayuda, una cotización vigente de una vencida en menos de 5 segundos al ver la lista.
- **SC-006**: Los flujos de las specs 001 y 003 (perfil → cliente → cotización → PDF, editar, eliminar, catálogos, exportar todo) se completan igual que antes, con los mismos textos, datos y cifras.
- **SC-007**: Los tres ejemplos de cálculo de la spec 001 siguen dando 19,066.67, 20,816.67 y 23,200.00 en pantalla y en el PDF.
- **SC-008**: Todos los textos se leen con comodidad en las seis pantallas, también con el brillo de pantalla bajo; ninguna etiqueta, botón ni mensaje queda difícil de leer sobre su fondo.
- **SC-009**: El PDF de una cotización sigue descargándose en menos de 3 segundos y sigue siendo legible, con el total identificable a simple vista, en cotizaciones de una y de varias páginas.
- **SC-010**: Cuando la persona dueña pide un cambio de color de la paleta, el cambio se ve en todas las pantallas y en el PDF a la vez, sin ajustes pantalla por pantalla.
- **SC-011**: En las seis pantallas, el título de página se ve claramente más grande y con una tipografía distinta (con remates) que el nombre del producto de la barra superior; 3 de 3 personas consultadas lo señalan como el elemento de mayor jerarquía.
- **SC-012**: El fondo de la página es un crema cálido que se distingue a simple vista del blanco de una tarjeta puesta encima, en las seis pantallas.
- **SC-013**: En la lista de cotizaciones con al menos 6 importes de distinta longitud, los dígitos de la columna de totales quedan alineados en columna vertical en el 100 % de las filas.
- **SC-014**: Medido con un comprobador de contraste, ningún texto de la aplicación queda por debajo de 4.5:1 contra su fondo, etiquetas de estado incluidas, y ningún borde de control o anillo de foco por debajo de 3:1.
- **SC-015**: No aparece ningún color de la paleta de la revisión 1 en ninguna de las seis pantallas ni en el PDF.
- **SC-016**: Con la pantalla en escala de grises, se sigue distinguiendo una cotización vigente de una vencida sin adivinar, en el 100 % de las filas.
- **SC-017**: En las seis pantallas, el 100 % de los botones cambia visiblemente al mantenerlos pulsados, antes de soltar.
- **SC-018**: Al recargar el inicio con la red limitada, las cifras aparecen en el hueco ya reservado: ningún elemento de la página se desplaza al llegar los datos.
- **SC-019**: Al intentar guardar con un campo obligatorio vacío, el campo queda marcado y su mensaje aparece debajo, en el 100 % de los formularios de la aplicación.
- **SC-020**: Durante la exportación completa, el elemento que la lanzó indica el avance y ningún elemento vecino se desplaza.
- **SC-021**: Un aviso de error permanece hasta que la persona lo cierra o cambia de pantalla; uno de éxito desaparece solo en menos de 10 segundos. Ambos se pueden cerrar.
- **SC-022**: En un monitor de 1440 px, el contenido ocupa un ancho claramente mayor que antes del cambio, y los márgenes laterales son visiblemente mayores que los del celular.
- **SC-023**: En un monitor de 1440 px, la lista de cotizaciones muestra al menos 14 filas sin desplazar.
- **SC-024**: En un celular de 360 px, el tamaño táctil de botones y campos es el mismo o mayor que antes del cambio, y las cinco etiquetas de la navegación se leen completas.
- **SC-025**: En la página de inicio, la separación entre el bloque de cifras y el título «Accesos» es al menos el doble de la separación entre «Accesos» y sus tarjetas.
- **SC-026**: En la lista de cotizaciones a 360 px, cada cotización ocupa un solo bloque con tres acciones jerarquizadas y sin varios renglones de botones; el folio sigue llevando a la cotización en un solo toque.
- **SC-026a**: Al eliminar una cotización, la confirmación aparece dentro de la aplicación en el 100 % de los intentos, se puede completar y cancelar usando solo el teclado, y el cuadro de confirmación del navegador no aparece en ninguna pantalla.
- **SC-027**: Comparados cifra por cifra con los PDF de referencia capturados antes del cambio, los PDF de las tres cotizaciones de ejemplo coinciden en el 100 % de sus datos, conceptos, impuestos, retenciones y totales.
- **SC-028**: Puestos uno al lado del otro el PDF nuevo y una pantalla de la aplicación, 3 de 3 personas consultadas los reconocen como el mismo producto.
- **SC-029**: Impreso en una láser en blanco y negro, en el PDF se identifican el folio, el cliente, el total y la fecha de vigencia en menos de 5 segundos.
- **SC-030**: Ninguna información del PDF se distingue únicamente por color: el documento impreso en gris conserva toda su jerarquía.
- **SC-031**: El PDF de una cotización no pesa más de un 20 % de lo que pesaba antes del cambio.

## Assumptions

- El producto se llama CotizacionesPro (nombre vigente de la constitución); "PresupuestosPro" y "presupuestos" del texto original se entienden como CotizacionesPro y cotizaciones, y "Servicio" como la sección Servicios.
- La petición de "español de España" se descarta por decisión de la persona dueña: se mantiene español de México y MXN (ver Clarificaciones).
- Por decisión de la persona dueña, los estados Borrador, Enviado, Aceptado y Rechazado no se implementan: requerirían datos y funciones nuevas, fuera del alcance de "sin cambiar datos ni funcionalidad". Solo se muestran Vigente y Vencida; "Caducado" corresponde al término ya vigente "Vencida" (FR-014 de la spec 001), que no se renombra.
- La navegación común reemplaza a la barra original de la spec 001; las cuatro secciones existentes y sus direcciones no cambian.
- **PrimeNG deja de ser la referencia visual.** La dirección «Despacho» se inspira en Stripe Invoicing y Mercury, de nuevo solo como referencia de estilo: no se incorpora ninguna librería.
- **La dirección visual es una decisión tomada, no un punto a explorar.** Las alternativas «Taller» y «Cal y Barro» quedaron descartadas (ver Clarificaciones de 2026-10-21); `/speckit-plan` no debe reabrirlas.
- **Los valores exactos de los tokens** (códigos de color, nombres y tamaños de tipografía, escalas, radios, sombras, duraciones y tramos de pantalla) están fijados en `specs/pre-specs/direccion-visual-despacho.md`, sección 4, y son parte del acuerdo; `/speckit-plan` los transcribe a `contracts/design-system.md` sin reinterpretarlos, **con dos correcciones**: (1) la aclaración de 2026-10-22 deja la identidad en dos familias, así que la familia de ancho fijo que la pre-especificación listaba en §4.2 no se incorpora; y (2) se añade `--color-border-control`, que la pre-especificación no contemplaba, porque sus dos tokens de borde no alcanzan el 3:1 que exige FR-014a para el borde de un control (medición en `research.md` §1).
- El PDF mantiene sus limitaciones de tipografía: usa un serif disponible sin incrustar archivos. "Misma identidad" significa jerarquía, paleta y clase tipográfica coherentes, no una tipografía idéntica (SC-028, SC-031).
- **La impresión del PDF en blanco y negro sí es un requisito** en esta revisión (FR-016a, SC-029, SC-030); es una reversión explícita del supuesto de la revisión 1.
- Las tipografías se sirven como archivos del propio repositorio, igual que las librerías que ya se usan sin red; no se añade ninguna dependencia externa.
- Se mantiene el uso de un solo usuario sin cuentas ni contraseña, y la compatibilidad con Chrome y Firefox vigentes en escritorio y celular.
- Dependencia: se apoya en la información de cotizaciones que la aplicación ya entrega (folio, cliente, fecha, total y vencida); no requiere información nueva.
- Se mantiene el comportamiento actual de las specs 001 y 003 al confirmar una eliminación: qué se pregunta y qué pasa con cada respuesta no cambia. Lo que cambia es dónde se pregunta (FR-024a). Son tres sitios: cotización, cliente y servicio.
- **Corrección a la revisión 1**: esa revisión daba por supuesta una confirmación al salir de un formulario con cambios sin guardar. **No existe en el producto**: no hay guardia de cambios en el código. Añadirla sería funcionalidad nueva y queda fuera de esta revisión (Principio III); se anota como sugerencia para una spec aparte.
- El componente de confirmación se construye como pieza reutilizable aunque hoy solo tenga un uso (eliminar una cotización). Es una excepción consciente al Principio I, aceptada por la persona dueña, y está justificada en `plan.md` → Complexity Tracking.
- Al retirar la acción de abrir de las filas de la lista (FR-026a) no se pierde funcionalidad: el folio de cada cotización ya es un enlace a ella, y así sigue siendo.
- "Instantáneo" significa que el inicio y la lista se muestran sin espera apreciable para el uso esperado; no se fija una cifra distinta de la del PDF (SC-009).
- La aplicación requiere JavaScript; no se define un contenido alternativo si los scripts no cargan. Si las tipografías no cargan, la aplicación sigue siendo utilizable con las de reserva.
- Antes de implementar hay que **recapturar los PDF y los datos de referencia** de las tres cotizaciones de ejemplo: los `baseline-*.txt` de la revisión 1 describen el PDF anterior a esta revisión y son la base de comparación de SC-027.
- Fuera de alcance: modo oscuro; cambio de tema por la persona; plantillas de PDF alternativas o elección de colores por la persona; nuevos estados de cotización; gráficas, filtros o búsqueda; juego de iconos (la navegación sigue siendo de texto); menú de acciones o cualquier componente de desbordamiento (FR-026a); una tercera familia tipográfica (FR-011); ilustraciones, degradados, animaciones de entrada u onboarding; logo nuevo o rediseño de marca; reescritura de los textos de producto; importar o restaurar copias de seguridad; cuentas o contraseña; y cualquier función nueva no descrita aquí.
