# Feature Specification: Página de inicio y rediseño visual

**Feature Branch**: `002-rediseno-inicio`

**Created**: 2026-10-20

**Status**: Draft

**Input**: User description: "Mejorar la presentación de CotizacionesPro (aplicación ya implementada en la spec 001) con dos cambios, sin alterar ninguna funcionalidad ni dato existente. Primero, una página de inicio como punto de entrada, con acceso claro a Cotizaciones, Clientes, Servicios y Perfil, un resumen de actividad con el número de cotizaciones por estado y una navegación común, visible y adaptable a móvil en todas las páginas. Segundo, un rediseño visual de toda la aplicación y del PDF, limpio, sobrio y profesional, con referencia al estilo de PrimeNG, con tipografía consistente, paleta limitada y centralizada, espaciado uniforme, componentes reutilizables y etiquetas de estado con colores semánticos discretos. Mantener mobile-first. La lógica de negocio, los cálculos, la API, el esquema de datos y las funcionalidades existentes no deben cambiar."

## Clarifications

### Session 2026-10-20

- Q: ¿Cómo se tratan los estados Borrador, Enviado, Aceptado, Rechazado y Caducado, si hoy solo existe el estado derivado "vencida"? → A: Solo visual. Se muestran únicamente los estados que ya existen (vigente y vencida) con etiquetas de color; el resumen cuenta cotizaciones por esos dos estados. Borrador, Enviado, Aceptado y Rechazado quedan fuera de esta spec.
- Q: ¿Español de España o de México? → A: Se mantiene español de México y pesos MXN (Principio II de la constitución y FR-021 de la spec 001); no se cambia ningún texto ni formato de importes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar por una página de inicio con resumen (Priority: P1)

Al abrir la dirección principal de la aplicación, la persona ve una página de inicio que le da la bienvenida, le muestra cuántas cotizaciones tiene vigentes y cuántas vencidas, y le ofrece accesos claros a Cotizaciones, Clientes, Servicios y Perfil, además de un acceso directo para crear una cotización nueva.

**Why this priority**: Es el punto de entrada de toda la aplicación y el cambio funcional visible de esta spec; sin él, abrir la dirección sigue llevando directo a la lista.

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

En cualquier pantalla de la aplicación (inicio, listas, formularios, editor de cotización), la persona ve la misma navegación, con la sección actual resaltada, y puede pasar a otra sección sin volver atrás. En el celular la navegación se adapta al ancho de pantalla y sigue siendo fácil de usar con una mano.

**Why this priority**: Moverse entre secciones es parte de todo flujo; tener una navegación única y coherente es requisito para el resto del rediseño.

**Independent Test**: Recorrer cada pantalla en escritorio y a 360 px de ancho, comprobando que la navegación está presente, que marca la sección actual y que permite llegar a las otras cuatro secciones y al inicio.

**Acceptance Scenarios**:

1. **Given** cualquier pantalla, **When** se muestra, **Then** aparece la misma navegación con acceso al inicio y a Cotizaciones, Clientes, Servicios y Perfil.
2. **Given** que la persona está en una sección o en el editor de una cotización, **When** mira la navegación, **Then** la sección a la que pertenece aparece resaltada.
3. **Given** una pantalla de celular, **When** se usa la navegación, **Then** todas las secciones son accesibles sin desplazamiento horizontal y cada elemento tiene un tamaño táctil cómodo.
4. **Given** un teclado, **When** se recorre la navegación, **Then** cada acceso se puede alcanzar y activar, y el foco es visible.

---

### User Story 3 - Apariencia profesional y consistente (Priority: P2)

Todas las pantallas comparten una misma identidad visual sobria, similar a la de un producto empresarial moderno: misma tipografía, una paleta limitada, espaciado uniforme y una jerarquía clara de títulos, texto y acciones. Botones, formularios, tablas o listas, tarjetas y etiquetas de estado se ven y se comportan igual en toda la aplicación. En las cotizaciones, las etiquetas "Vigente" y "Vencida" se distinguen por color discreto y por texto.

**Why this priority**: Es el cambio de mayor alcance pero no altera lo que la persona puede hacer; aporta confianza y legibilidad una vez que existe la estructura de inicio y navegación.

**Independent Test**: Recorrer todas las pantallas (inicio, perfil, clientes, servicios, lista y editor de cotizaciones) y comprobar que los mismos tipos de elemento se ven iguales en todas, que todas las tareas de la spec 001 siguen funcionando y que no cambia ningún dato, texto de negocio ni cifra.

**Acceptance Scenarios**:

1. **Given** cualquier pantalla, **When** se compara con otra, **Then** usan la misma tipografía, los mismos colores base, el mismo espaciado y el mismo aspecto para botones principales, secundarios y de eliminación.
2. **Given** un formulario cualquiera, **When** hay un error de validación, **Then** el campo y el mensaje se muestran con el mismo estilo claro en toda la aplicación, y cada campo tiene su etiqueta visible.
3. **Given** la lista de cotizaciones, **When** hay cotizaciones vigentes y vencidas, **Then** cada una muestra una etiqueta de estado con texto ("Vigente" o "Vencida") y un color semántico discreto, de modo que el estado se entienda sin depender solo del color.
4. **Given** una cotización existente, **When** se abre tras el rediseño, **Then** sus folios, fechas, conceptos, importes, impuestos y totales son idénticos a los de antes.
5. **Given** las pantallas de lista, **When** se ven en celular, **Then** la información se apila y se lee sin desplazamiento horizontal; en escritorio aprovecha el ancho disponible.

---

### User Story 4 - PDF con la misma identidad visual (Priority: P2)

El PDF que recibe el cliente adopta la misma identidad visual sobria y profesional: encabezado ordenado con el logo y los datos del emisor, tabla de conceptos clara y desglose de impuestos y total destacado, con la misma paleta y tipografía de la aplicación en la medida en que el PDF lo permita.

**Why this priority**: El PDF es lo que ve el cliente final y es el producto principal de la herramienta; debe verse tan profesional como la aplicación, sin cambiar su contenido.

**Independent Test**: Descargar el PDF de las tres cotizaciones de ejemplo de la spec 001 (persona moral con ISR 10 %, persona moral con ISR 1.25 % y persona física) y comprobar que el contenido y las cifras coinciden con las de antes y que el aspecto es el nuevo.

**Acceptance Scenarios**:

1. **Given** una cotización, **When** se descarga el PDF, **Then** conserva todo el contenido de la spec 001 (folio, fechas, emisor, cliente, conceptos, subtotal, IVA, retenciones solo para persona moral y total) con idénticos importes.
2. **Given** el PDF, **When** se lee, **Then** los títulos, la tabla de conceptos, el desglose y el total tienen una jerarquía visual clara y el total aparece destacado.
3. **Given** una cotización sin logo o con muchos conceptos que ocupan más de una página, **When** se descarga el PDF, **Then** el diseño sigue siendo ordenado y legible en todas las páginas.
4. **Given** una cotización vencida, **When** se descarga el PDF, **Then** el contenido es el mismo que el de una vigente (el PDF no cambia por estar vencida, como ya ocurría).
5. **Given** acentos, la letra ñ y descripciones largas, **When** se descarga el PDF, **Then** se leen correctamente.

---

### Edge Cases

- ¿Qué pasa si no se puede consultar el resumen (falla de conexión)? La página de inicio sigue mostrando los accesos a las secciones y un aviso claro de que no se pudo cargar el resumen, sin bloquear la navegación.
- ¿Qué pasa con las direcciones guardadas por la persona (por ejemplo, a la lista de cotizaciones o a una cotización concreta)? Siguen funcionando y llevan a la misma pantalla de antes.
- ¿Qué pasa con nombres o descripciones muy largos (cliente, concepto, servicio)? No rompen el diseño: se ajustan en varias líneas sin desbordar la pantalla ni el PDF.
- ¿Qué pasa con cientos de cotizaciones? El resumen y la lista siguen mostrándose de forma instantánea para el uso esperado.
- ¿Qué pasa si el navegador está en modo de texto grande o en una pantalla muy angosta? La navegación y los formularios siguen siendo utilizables.
- ¿Qué pasa si la persona prefiere movimiento reducido? No hay animaciones necesarias para entender la interfaz.

## Requirements *(mandatory)*

### Functional Requirements

**Página de inicio y navegación**

- **FR-001**: Al abrir la dirección principal de la aplicación, el sistema MUST mostrar una página de inicio como punto de entrada, en lugar de llevar directamente a la lista de cotizaciones.
- **FR-002**: La página de inicio MUST ofrecer accesos claros a Cotizaciones, Clientes, Servicios y Perfil, y un acceso directo para crear una cotización nueva.
- **FR-003**: La página de inicio MUST mostrar un resumen de actividad con el número de cotizaciones vigentes y el número de vencidas, calculados con la misma regla de vigencia de la spec 001 (FR-014), de modo que siempre coincidan con la lista de cotizaciones.
- **FR-004**: Si no hay cotizaciones, el resumen MUST mostrar cero en cada estado y un mensaje que invite a crear la primera.
- **FR-005**: Si falla la carga del resumen, la página de inicio MUST seguir mostrando los accesos y un aviso claro en español, sin impedir la navegación.
- **FR-006**: Todas las pantallas MUST compartir una misma navegación visible con acceso al inicio y a las cuatro secciones, que resalte la sección actual y que se adapte al ancho de pantalla, desde 360 px hasta escritorio, sin desplazamiento horizontal: barra fija inferior en celular y barra superior en escritorio (desde 768 px).
- **FR-007**: La navegación MUST poder usarse con teclado, con foco visible, y sus elementos táctiles MUST tener un tamaño cómodo en celular.
- **FR-008**: Las direcciones existentes de la aplicación (lista de cotizaciones, cotización, edición, clientes, servicios y perfil) MUST seguir funcionando y llevar a la misma pantalla que antes. La regla de redirigir al perfil cuando aún no existe MUST conservarse.

**Rediseño visual**

- **FR-009**: Toda la aplicación MUST aplicar una identidad visual única, limpia, sobria y profesional, de estilo empresarial moderno inspirada en PrimeNG, con una sola tipografía, una paleta de colores limitada, una escala de espaciado uniforme y una jerarquía clara de títulos, texto y acciones.
- **FR-010**: Los colores, la tipografía y el espaciado MUST definirse en un solo lugar, de forma que un cambio de paleta se aplique a toda la aplicación y al PDF sin tocar cada pantalla.
- **FR-011**: Botones (principal, secundario, peligroso), campos de formulario con su etiqueta y mensajes de error, tablas o listas, tarjetas y etiquetas de estado MUST tener un único estilo reutilizable en todas las pantallas.
- **FR-012**: Las etiquetas de estado de cotización MUST mostrar texto ("Vigente" o "Vencida") y un color semántico discreto; el significado MUST ser comprensible sin depender solo del color. El sistema de etiquetas MUST dejar definidos los estilos para los estados futuros (Borrador, Enviado, Aceptado, Rechazado), pero esta spec MUST NOT mostrarlos ni exigir datos nuevos.
- **FR-013**: El diseño MUST evitar elementos decorativos innecesarios y priorizar legibilidad, consistencia y facilidad de uso; el contraste entre texto y fondo MUST ser suficiente para leerse con comodidad.
- **FR-014**: El enfoque mobile-first MUST conservarse: todas las pantallas MUST ser plenamente utilizables a 360 px de ancho y aprovechar el espacio en escritorio, en Chrome y Firefox vigentes.

**PDF**

- **FR-015**: La plantilla del PDF MUST adoptar la misma identidad visual (jerarquía, tipografía lo más cercana posible y paleta de la aplicación), manteniendo clara la lectura de conceptos, impuestos y totales, con el total destacado.
- **FR-016**: El contenido, el orden de la información, los importes y las reglas del PDF definidos en la spec 001 MUST permanecer idénticos; solo cambia su presentación. Sigue sin llevar notas ni condiciones de pago.

**Sin cambios funcionales**

- **FR-017**: Esta mejora MUST NOT cambiar la lógica de negocio, los cálculos de importes, folios y vigencia, el comportamiento del servidor y de su interfaz de datos, la estructura de los datos guardados ni ninguna funcionalidad de la spec 001; los datos ya guardados MUST seguir mostrándose sin migración ni pérdida.
- **FR-018**: Todos los textos, mensajes y el PDF MUST seguir en español de México y los importes en pesos mexicanos con el formato de la spec 001 (por ejemplo, $20,000.00); los textos nuevos de esta spec MUST seguir esa misma norma.
- **FR-019**: Antes de implementar, se MUST revisar la estructura y los componentes existentes para reutilizar lo que corresponda; no se MUST añadir dependencias nuevas que no sean imprescindibles (PrimeNG se toma solo como referencia visual, no como componente a incorporar).

### Key Entities *(include if feature involves data)*

- **Resumen de actividad**: dato derivado, no guardado, con el número de cotizaciones vigentes y vencidas en el momento de abrir el inicio; su suma es el total de cotizaciones.
- **Estado de cotización**: etiqueta visual derivada de la fecha de emisión (vigente o vencida); no es un dato nuevo ni editable.
- **Sistema visual**: conjunto único de colores, tipografía, espaciado y estilos de componentes compartido por las pantallas y por el PDF.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al abrir la dirección principal, el 100 % de las veces aparece la página de inicio con los cuatro accesos y el resumen, y desde ella se llega a cualquiera de las cuatro secciones en un solo toque o clic.
- **SC-002**: La suma de cotizaciones vigentes y vencidas del resumen es igual al número de cotizaciones de la lista, y cada cifra coincide con las etiquetas de la lista, en el 100 % de las pruebas con datos de ejemplo.
- **SC-003**: Desde cualquier pantalla se puede llegar a cualquier otra sección en un solo toque o clic, sin usar el botón de atrás del navegador.
- **SC-004**: Las seis pantallas (inicio, cotizaciones, editor, clientes, servicios y perfil) se pueden usar a 360 px de ancho sin desplazamiento horizontal y sin elementos cortados, en Chrome y Firefox.
- **SC-005**: Una persona que no participó en el diseño distingue, sin ayuda, una cotización vigente de una vencida en menos de 5 segundos al ver la lista.
- **SC-006**: Los flujos de la spec 001 (perfil → cliente → cotización → PDF, editar, eliminar, catálogos) se completan igual que antes, con los mismos textos, datos y cifras.
- **SC-007**: Los tres ejemplos de cálculo de la spec 001 siguen dando 19,066.67, 20,816.67 y 23,200.00 en pantalla y en el PDF.
- **SC-008**: Todos los textos se leen con comodidad en las seis pantallas, también con el brillo de pantalla bajo; ninguna etiqueta, botón ni mensaje queda difícil de leer sobre su fondo.
- **SC-009**: El PDF de una cotización sigue descargándose en menos de 3 segundos y sigue siendo legible, con el total identificable a simple vista, en cotizaciones de una y de varias páginas.
- **SC-010**: Cuando la persona dueña pide un cambio de color de la paleta, el cambio se ve en todas las pantallas y en el PDF a la vez, sin ajustes pantalla por pantalla.

## Assumptions

- El producto se llama CotizacionesPro (nombre vigente de la constitución); "PresupuestosPro" y "presupuestos" del texto original se entienden como CotizacionesPro y cotizaciones, y "Servicio" como la sección Servicios.
- La petición de "español de España" se descarta por decisión de la persona dueña: se mantiene español de México y MXN (ver Clarificaciones).
- Por decisión de la persona dueña, los estados Borrador, Enviado, Aceptado y Rechazado no se implementan: requerirían datos y funciones nuevas, fuera del alcance de "sin cambiar datos ni funcionalidad" y del alcance de la spec 001. Solo se muestran Vigente y Vencida; "Caducado" del texto original corresponde al término ya vigente "Vencida" (FR-014 de la spec 001), que no se renombra.
- La navegación común reemplaza a la barra actual; las cuatro secciones existentes y sus direcciones no cambian.
- PrimeNG es solo una referencia de estilo (sobrio, de producto empresarial); no se incorpora como librería. Las fuentes y recursos visuales no deben depender de servicios externos en producción.
- El PDF mantiene sus limitaciones actuales de tipografía; "misma identidad" significa jerarquía, paleta y orden coherentes, no una fuente idéntica.
- Como criterio técnico de apoyo, el contraste de texto normal es de al menos 4.5:1 (verificado en T023 de `tasks.md`); no es un criterio de éxito verificable por la persona usuaria.
- Se mantiene el uso de un solo usuario sin cuentas ni contraseña, y la compatibilidad con Chrome y Firefox vigentes en escritorio y celular.
- Dependencia: se apoya en la información de cotizaciones que la aplicación ya entrega (folio, cliente, fecha, total y vencida); no requiere información nueva.
- Se mantiene el comportamiento actual de la spec 001 al salir de un formulario con cambios sin guardar y al confirmar una eliminación; esta spec solo cambia su apariencia (botón peligroso del sistema visual).
- "Instantáneo" significa que el inicio y la lista se muestran sin espera apreciable para el uso esperado; no se fija una cifra distinta de la del PDF (SC-009).
- La aplicación requiere JavaScript; no se define un contenido alternativo si los scripts o estilos no cargan.
- La impresión del PDF en blanco y negro no es un requisito: el acento azul oscuro con texto claro y el texto oscuro sobre blanco se leen en escala de grises.
- Fuera de alcance: modo oscuro, cambio de tema por la persona, nuevos estados de cotización, gráficas, filtros o búsqueda, y cualquier función nueva no descrita aquí.
