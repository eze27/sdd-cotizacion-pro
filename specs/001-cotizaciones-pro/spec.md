# Feature Specification: CotizacionesPro v0 (México)

**Feature Branch**: `001-cotizaciones-pro`

**Created**: 2026-10-19

**Status**: PUBLISHED

**Input**: User description: "CotizacionesPro v0 (México): herramienta para que un freelancer cree cotizaciones con su marca y las descargue en PDF, con IVA y retenciones calculados automáticamente. Incluye perfil, catálogo de servicios, catálogo de clientes y lista de cotizaciones."

## Clarifications

### Session 2026-10-19

- Q: Al editar una cotización guardada, ¿la fecha de emisión se conserva o se renueva? → A: Se renueva a hoy cada vez que se guarda una edición (la vigencia de 30 días se cuenta desde esa nueva fecha; el folio no cambia).
- Q: ¿Se puede guardar una cotización sin conceptos para terminarla después? → A: No. Una cotización solo se guarda (y consume folio) cuando tiene al menos un concepto; si el freelancer sale antes, se descarta sin consumir folio.
- Q: ¿Se pide confirmación antes de eliminar cotizaciones, clientes o servicios? → A: Sí, siempre, antes de eliminar cualquiera de los tres.
- Q: ¿Cuántos decimales admite la cantidad de un concepto? → A: Hasta 2 (por ejemplo, 0.25).
- Q: ¿Dónde se guardan los datos? → A: En un servidor publicado en internet, para un solo usuario (el freelancer), accesible desde cualquier dispositivo. Sin cuentas ni contraseña (se decidió no proteger el acceso; quien tenga la dirección puede ver y editar los datos).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Emitir una cotización correcta en PDF (Priority: P1)

Un freelancer con su perfil ya configurado crea una cotización: elige un cliente, agrega conceptos, ve los totales calculados solos (subtotal, IVA, retenciones y total) y descarga el PDF para enviarlo.

**Why this priority**: Es el valor central del producto: emitir una cotización correcta y con buena imagen en menos de 5 minutos.

**Independent Test**: Con perfil y un cliente capturados, crear una cotización con dos conceptos y descargar el PDF; los importes coinciden con el ejemplo de referencia.

**Acceptance Scenarios**:

1. **Given** un freelancer en Actividades Empresariales y Profesionales y un cliente persona moral, **When** crea una cotización con "Diseño de página web" $15,000.00 y "Sesión de fotos de producto" $5,000.00, **Then** ve subtotal $20,000.00, IVA $3,200.00, retención de ISR −$2,000.00, retención de IVA −$2,133.33 y total $19,066.67.
2. **Given** la misma cotización con el freelancer en RESICO, **When** la crea, **Then** la retención de ISR es −$250.00 y el total es $20,816.67.
3. **Given** la misma cotización con un cliente persona física, **When** la crea, **Then** no aparece ninguna retención y el total es $23,200.00.
4. **Given** una cotización con al menos un concepto, **When** descarga el PDF, **Then** el PDF muestra logo (si lo hay), datos del freelancer (con RFC y régimen) y del cliente, folio, fecha de emisión, vigencia, tabla de conceptos y el desglose completo.
5. **Given** una cotización nueva sin conceptos, **When** intenta guardarla o descargar el PDF, **Then** no se guarda ni se genera y se le avisa que debe agregar al menos un concepto.
6. **Given** una cotización en edición, **When** edita o elimina un concepto, **Then** los totales se actualizan al instante.
7. **Given** una cotización nueva sin conceptos, **When** el freelancer sale sin guardarla, **Then** se descarta y no consume folio.

---

### User Story 2 - Configurar mi perfil de freelancer (Priority: P1)

El freelancer captura una sola vez su nombre, RFC, régimen fiscal (obligatorio), datos de contacto y logo (opcional), y sus cotizaciones salen con su marca.

**Why this priority**: Sin perfil, y en particular sin régimen, no se pueden calcular las retenciones ni generar un PDF completo.

**Independent Test**: Capturar el perfil, cerrar y volver a abrir la aplicación; los datos siguen ahí y aparecen en el PDF.

**Acceptance Scenarios**:

1. **Given** un perfil vacío, **When** el freelancer intenta guardar sin nombre, RFC o régimen, **Then** se le indica qué falta y no se guarda.
2. **Given** un RFC con formato claramente inválido, **When** intenta guardar, **Then** se le avisa y no se guarda.
3. **Given** un perfil guardado, **When** cambia el régimen entre Actividades Empresariales y Profesionales y RESICO, **Then** las cotizaciones nuevas usan la tasa de ISR correspondiente (10 % o 1.25 %) y las existentes no cambian.
4. **Given** un perfil sin logo, **When** descarga un PDF, **Then** el PDF se genera sin logo.

---

### User Story 3 - Catálogo de servicios (Priority: P2)

El freelancer mantiene una lista de sus servicios con un precio por defecto (antes de impuestos) y los agrega a las cotizaciones sin reescribirlos.

**Why this priority**: Ahorra tiempo en cada cotización, pero se puede cotizar escribiendo los conceptos a mano.

**Independent Test**: Crear, editar y eliminar un servicio; agregarlo a una cotización.

**Acceptance Scenarios**:

1. **Given** un catálogo con un servicio, **When** lo agrega a una cotización, **Then** el concepto aparece con su nombre y precio, y puede cambiar cantidad y precio en esa cotización.
2. **Given** un servicio ya usado en una cotización, **When** cambia su precio en el catálogo, **Then** las cotizaciones existentes no cambian.
3. **Given** una cotización, **When** el freelancer escribe un concepto a mano que no está en el catálogo, **Then** se acepta con descripción, cantidad y precio unitario.
4. **Given** una cantidad o un precio igual a cero o negativo, **When** intenta guardarlo, **Then** se rechaza con un mensaje claro.

---

### User Story 4 - Catálogo de clientes (Priority: P2)

El freelancer guarda sus clientes (nombre o razón social, RFC opcional y tipo: persona moral o persona física) y los elige al crear una cotización. Si el cliente es nuevo, lo da de alta en el momento.

**Why this priority**: Evita recapturar datos y define si aplican las retenciones.

**Independent Test**: Dar de alta un cliente, crear una cotización eligiéndolo y comprobar que el tipo determina las retenciones.

**Acceptance Scenarios**:

1. **Given** clientes guardados, **When** crea una cotización, **Then** puede elegir uno de la lista.
2. **Given** un cliente que no existe, **When** crea la cotización, **Then** puede darlo de alta ahí mismo y queda guardado en el catálogo.
3. **Given** un RFC de cliente con formato inválido, **When** intenta guardarlo, **Then** se le avisa; dejar el RFC vacío es válido.
4. **Given** un cliente cambiado de persona moral a persona física en el catálogo, **When** crea una cotización nueva, **Then** no se aplican retenciones; las cotizaciones existentes no cambian.

---

### User Story 5 - Consultar y administrar mis cotizaciones (Priority: P2)

El freelancer tiene una sección con todas sus cotizaciones. Desde ahí puede abrir, editar, volver a descargar el PDF y eliminar. Una cotización pasada su vigencia se muestra como "vencida".

**Why this priority**: Las cotizaciones deben conservarse y poder reutilizarse, pero el flujo principal ya entrega valor sin esto.

**Independent Test**: Crear dos cotizaciones, cerrar y reabrir la aplicación, verlas en la lista, editar una, volver a descargarla y eliminar la otra.

**Acceptance Scenarios**:

1. **Given** cotizaciones guardadas, **When** el freelancer abre la sección de cotizaciones, **Then** ve cada una con su folio, cliente, fecha, total y si está vencida.
2. **Given** la segunda cotización creada en el año, **When** se crea, **Then** recibe el folio siguiente (por ejemplo, 2026-002) en el momento de su creación.
3. **Given** una cotización eliminada, **When** se crea otra, **Then** el folio eliminado no se reutiliza.
4. **Given** una cotización con más de 30 días naturales desde su emisión, **When** se muestra, **Then** aparece como "vencida".
5. **Given** un nuevo año, **When** se crea la primera cotización, **Then** el folio reinicia en NNN = 001 (por ejemplo, 2027-001).
6. **Given** cualquier cotización guardada, **When** la abre y la edita, **Then** los totales se recalculan con las tasas con que fue creada y puede volver a descargar su PDF.
7. **Given** una cotización vencida, **When** el freelancer la edita y guarda, **Then** su fecha de emisión pasa a ser hoy, su vigencia se cuenta desde esa fecha, deja de aparecer como "vencida" y conserva su folio.

---

### Edge Cases

- Cotización sin ningún concepto: no se puede guardar ni generar el PDF; se avisa. Si al editar una cotización guardada se eliminan todos sus conceptos, no se puede guardar el cambio (para quitarla, se elimina la cotización).
- Concepto escrito a mano: permitido.
- Cliente persona física: nunca hay retenciones, sin importar el régimen del freelancer.
- Cliente sin RFC: válido; el RFC del cliente es opcional.
- Cantidades o precios en cero o negativos: se rechazan.
- Cantidades decimales con hasta 2 decimales (por ejemplo, 0.25 o 2.5 horas): se aceptan; con más de 2 decimales se rechazan.
- Importes con fracciones de centavo: cada importe se redondea a 2 decimales; 0.005 sube.
- Servidor no disponible: la aplicación no puede guardar ni mostrar datos y se le avisa claramente al freelancer; no se pierde lo ya guardado.
- Eliminar un servicio o cliente del catálogo no altera las cotizaciones ya creadas.
- Cancelar la confirmación de eliminar no borra nada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir guardar y editar el perfil del freelancer: nombre, RFC, régimen fiscal (Actividades Empresariales y Profesionales o RESICO), datos de contacto y logo.
- **FR-002**: El nombre, el RFC y el régimen fiscal MUST ser obligatorios en el perfil; los datos de contacto y el logo son opcionales.
- **FR-003**: El sistema MUST validar el formato básico del RFC (del freelancer y del cliente) sin consultarlo con el SAT.
- **FR-004**: El sistema MUST permitir crear, editar y eliminar servicios del catálogo, con nombre y precio por defecto antes de impuestos.
- **FR-005**: El sistema MUST permitir crear, editar y eliminar clientes del catálogo, con nombre o razón social, RFC opcional y tipo (persona moral o persona física).
- **FR-006**: Al crear una cotización, el sistema MUST permitir elegir un cliente existente o darlo de alta ahí mismo.
- **FR-007**: Cada concepto de la cotización MUST poder venir del catálogo o escribirse a mano, con descripción, cantidad y precio unitario; al venir del catálogo el precio se copia y no queda vinculado.
- **FR-008**: El sistema MUST rechazar cantidades y precios unitarios iguales a cero o negativos y MUST aceptar cantidades con hasta 2 decimales (por ejemplo, 0.25) y precios con centavos; MUST rechazar cantidades con más de 2 decimales.
- **FR-009**: El sistema MUST calcular automáticamente en cada cotización:
  - Subtotal = suma de (cantidad × precio unitario) de todos los conceptos.
  - IVA trasladado = subtotal × 16 %.
  - Retención de ISR (solo cliente persona moral) = subtotal × 10 % en Actividades Empresariales y Profesionales, o subtotal × 1.25 % en RESICO.
  - Retención de IVA (solo cliente persona moral) = IVA trasladado sin redondear × 2/3, es decir, subtotal × 16 % × 2/3, y luego se redondea a centavos.
  - Total = subtotal + IVA − retención de ISR − retención de IVA.
- **FR-010**: Si el cliente es persona física, el sistema MUST NOT aplicar ninguna retención.
- **FR-011**: Cada importe (IVA y cada retención) MUST calcularse sobre el subtotal sin redondear y redondearse a 2 decimales (0.005 sube); el total MUST calcularse con los importes ya redondeados.
- **FR-012**: Los importes MUST mostrarse en pesos mexicanos (MXN) con coma de miles y punto decimal (por ejemplo, $20,000.00).
- **FR-013**: El sistema MUST asignar el folio cuando la cotización se guarda por primera vez (con al menos un concepto), con formato AAAA-NNN, reiniciando el contador cada año; un folio eliminado no se reutiliza.
- **FR-014**: La cotización MUST mostrar la fecha de emisión y una vigencia fija de 30 días naturales desde esa fecha; pasado ese plazo MUST mostrarse como "vencida". La fecha de emisión MUST ser la de creación y MUST renovarse a la fecha de hoy cada vez que se guarda una edición de la cotización; el folio no cambia.
- **FR-015**: El sistema MUST permitir editar o eliminar cualquier concepto antes de generar el PDF, y los totales MUST actualizarse.
- **FR-016**: El sistema MUST conservar en cada cotización las tasas, datos y precios con los que fue creada; cambiar después el régimen, el catálogo de servicios o los datos del cliente MUST NOT modificar cotizaciones existentes.
- **FR-017**: El sistema MUST NOT guardar ni generar el PDF de una cotización sin conceptos y MUST avisar al freelancer; una cotización sin guardar que se abandona se descarta sin consumir folio.
- **FR-018**: El sistema MUST generar un PDF con logo (si existe), datos del freelancer (incluidos RFC y régimen) y del cliente, folio, fechas, tabla de conceptos (descripción, cantidad, precio unitario e importe por línea) y el desglose de subtotal, IVA, retenciones y total. El PDF no incluye notas.
- **FR-019**: El sistema MUST ofrecer una sección con todas las cotizaciones guardadas, desde la cual se pueden abrir, editar, volver a descargar su PDF y eliminar.
- **FR-019a**: El sistema MUST pedir confirmación antes de eliminar una cotización, un cliente o un servicio; si el freelancer cancela, no se elimina nada.
- **FR-020**: El perfil, los catálogos y las cotizaciones MUST guardarse en el servidor y seguir disponibles al cerrar y volver a abrir la aplicación, desde cualquier dispositivo o navegador que abra la misma dirección.
- **FR-021**: Todo el producto (textos, mensajes y PDF) MUST estar en español de México.
- **FR-022**: La aplicación MUST funcionar en Chrome y Firefox y adaptarse a pantallas de escritorio y de celular.

### Key Entities *(include if feature involves data)*

- **Perfil del freelancer**: nombre, RFC, régimen fiscal, datos de contacto y logo; uno solo por despliegue.
- **Servicio**: nombre y precio por defecto antes de impuestos.
- **Cliente**: nombre o razón social, RFC opcional y tipo (persona moral o persona física).
- **Cotización**: folio, fecha de emisión, vigencia, datos del cliente y del freelancer tal como estaban al crearla, tasa de ISR aplicada, conceptos y totales.
- **Concepto**: descripción, cantidad y precio unitario; pertenece a una cotización.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un freelancer con perfil y cliente ya capturados emite una cotización con dos conceptos y descarga su PDF en menos de 5 minutos.
- **SC-002**: El ejemplo de referencia (régimen general, persona moral) muestra exactamente un total de $19,066.67; con RESICO, $20,816.67; con persona física, $23,200.00.
- **SC-003**: La retención de IVA del ejemplo se muestra como $2,133.33, con dos decimales exactos.
- **SC-004**: Al cambiar el tipo de cliente a persona física, ambas retenciones desaparecen y el total sube.
- **SC-005**: La segunda cotización del año recibe el folio 002. *Verificación diferida:* la primera cotización creada a partir del 1 de enero recibe el folio 001.
- **SC-006**: El PDF descargado muestra todos los datos listados en FR-018 y coincide con lo que se ve en pantalla.
- **SC-007**: Al cerrar y reabrir la aplicación, o abrirla desde otro dispositivo con la misma dirección, el perfil, los catálogos y las cotizaciones siguen ahí.
- **SC-008**: Todas las pantallas y el PDF se pueden usar y leer en Chrome y Firefox, tanto en escritorio como en celular.
- **SC-009**: Cada cotización muestra hasta qué fecha es vigente y las recién creadas no aparecen como vencidas. *Verificación diferida:* una cotización con más de 30 días desde su emisión aparece como "vencida" en la lista.

## Assumptions

- Los datos viven en un servidor publicado en internet, para un solo freelancer; se pueden usar desde cualquier dispositivo. No hay exportación ni respaldo manual en esta versión.
- No hay cuentas, inicio de sesión ni contraseña (decisión del dueño del producto): quien conozca la dirección puede ver y editar el perfil, los clientes (con RFC) y las cotizaciones. La dirección no debe compartirse. Riesgo aceptado conscientemente en v0 y a revisar antes de abrirlo a más personas.
- La tasa de IVA es 16 %, y las tasas de retención son las de las reglas de negocio de este documento.
- La vigencia es fija de 30 días naturales y no se puede editar; solo se reinicia al guardar una edición de la cotización.
- Fuera de alcance en v0: CFDI, timbrado o conexión con el SAT; varios usuarios, cuentas o protección con contraseña; multimoneda; envío del PDF por correo desde la aplicación; descuentos por concepto o globales; impuestos locales; notas, condiciones de pago o datos bancarios en el PDF; duplicar cotizaciones; estados distintos de "vencida".
- Chrome y Firefox, en sus versiones vigentes, son los navegadores obligatorios; otros navegadores no se prometen.
- Datos mínimos: se piden solo los datos necesarios para la cotización (Constitución, Principio V).
- Los criterios marcados como verificación diferida se comprueban en la app cuando se cumple el plazo real (día 31 desde una emisión, 1 de enero). Antes de publicar, las pruebas automáticas con fecha simulada son la evidencia de que funcionan.
