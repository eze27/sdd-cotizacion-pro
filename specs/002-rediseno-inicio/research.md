# Fase 0 — Investigación: dirección visual «Despacho»

Revisión 2, 2026-10-22. Reemplaza la investigación de la revisión 1 (consultable en `main`).

Cada apartado cierra una incógnita del plan con el formato **Decisión / Razón / Alternativas descartadas**. Nada queda como `NEEDS CLARIFICATION`.

---

## 1. Contraste de la paleta: verificado, con una corrección obligatoria

**Decisión**: la paleta de la pre-especificación se adopta tal cual en sus 12 colores y sus 6 pares de etiqueta, **más un token nuevo**: `--color-border-control: #8C8373`, para el borde de los controles de formulario. `--color-border: #E7E3DC` se queda, pero solo para separadores y bordes de tarjeta.

**Razón**: medidos los pares de la paleta (relación de contraste WCAG 2.x), **todo el texto pasa** y **todos los bordes fallan**:

| Par | Relación | Mínimo | Estado |
|-----|---------:|--------|--------|
| Texto principal `#111827` sobre fondo crema `#FBFAF8` | 17.01 | 4.5 | ✅ |
| Texto principal sobre superficie blanca | 17.74 | 4.5 | ✅ |
| Texto secundario `#6B6760` sobre crema / blanco / superficie elevada | 5.39 / 5.62 / 5.08 | 4.5 | ✅ |
| Verde primario `#11523F` sobre blanco / crema | 9.12 / 8.74 | 4.5 | ✅ |
| Blanco sobre verde primario / verde de hover | 9.12 / 11.86 | 4.5 | ✅ |
| Rojo destructivo `#9B2C1F` sobre blanco | 7.57 | 4.5 | ✅ |
| Cobre `#A8613A` sobre blanco / crema | 4.73 / 4.54 | 4.5 | ✅ (justo) |
| Etiquetas: Vigente / Vencida / Enviado / Rechazado / Aceptado / Borrador | 7.69 / 5.71 / 8.10 / 7.39 / 5.48 / 8.15 | 4.5 | ✅ |
| Anillo de foco verde sobre crema | 8.74 | 3.0 | ✅ |
| **Borde `#E7E3DC` sobre blanco** | **1.28** | **3.0** | ❌ |
| **Borde fuerte `#D6D0C6` sobre blanco / crema** | **1.53 / 1.47** | **3.0** | ❌ |

El criterio de contraste no textual (3:1) se aplica al **límite que permite identificar un control** —el recuadro de un campo de texto, de un desplegable o de un botón neutro—, no a los separadores decorativos ni al filo de una tarjeta, que están exentos. Por eso la corrección es quirúrgica: un token nuevo solo para controles, y los dos existentes se quedan donde sí son válidos.

Buscado el valor mínimo que pasa sobre los tres fondos del sistema (blanco, crema y superficie elevada), `#8C8373` da 3.74 / 3.59 / 3.38. El candidato más claro, `#9C917E`, da 3.10 sobre blanco pero **2.98 sobre crema**: se queda fuera por tres centésimas, y buena parte de los campos del producto se dibujan sobre crema.

**Dos consecuencias para FR-014a**: el cobre pasa con 4.73, un margen estrecho, así que queda restringido a texto de tamaño normal o mayor —nunca texto pequeño— y, por FR-009, nunca a un elemento pulsable. Y el borde de control pasa a ser visiblemente más oscuro que el separador: es un cambio de aspecto deliberado respecto a la revisión 1, donde los campos casi flotaban.

**Alternativas descartadas**: *aclarar los fondos para que los bordes pasen* — rompería el crema, que es la mitad de la dirección. *Subir `--color-border` a `#8C8373` en todas partes* — las tarjetas y las tablas quedarían rayadas y duras, lo contrario de «papel caro». *Dar a los controles un fondo distinto en lugar de un borde* — es una vía legítima del criterio, pero cambia más el aspecto y complica el estado deshabilitado.

---

## 2. Tipografías: dos familias, archivos locales, sin recortes

**Decisión**: **Source Serif 4** (variable, licencia SIL OFL) para títulos, folio y total; **Inter** (variable, SIL OFL) para todo lo demás, incluidos los importes, usando sus cifras de ancho fijo. Ambas en `woff2`, en `public/fonts/`, declaradas con `@font-face` en `styles.css` y con `font-display: swap`. Sin recortar subconjuntos.

**Razón**: la aclaración de 2026-10-22 dejó la identidad en dos familias, así que la monoespaciada de la pre-especificación §4.2 no entra. Inter incluye la variante de cifras tabulares, que se activa con `font-variant-numeric: tabular-nums`: eso basta para SC-013 (dígitos alineados en columna), que es lo que el producto necesita de verdad. Los dos archivos variables rondan los 150–250 KB en conjunto, una sola vez, y las dos licencias permiten redistribuirlas dentro del repositorio.

`font-display: swap` es la elección correcta aquí: el texto se lee de inmediato con la tipografía de reserva y cambia al llegar la definitiva. Para una herramienta que el dueño abre a diario y que sirve desde su propio disco, la ventana de cambio es mínima, y cumple el borde del caso de FR-014c (si la tipografía no llega, la aplicación sigue legible). Las reservas se eligen por métrica parecida: `Georgia` antes que `Times New Roman` para el serif; `system-ui` para la sans.

**Alternativas descartadas**: *tres familias con monoespaciada* — descartada por la persona dueña; añade una descarga para un matiz estético. *Recortar subconjuntos* — bajaría el peso, pero exige un paso de recorte de fuentes, es decir, compilación, prohibida por el proyecto. *Instrument Serif* — un solo peso y pensada para títulos grandes: se rompe en el folio dentro de una fila de tabla. *Tipografías del sistema* — es el punto de partida que esta revisión corrige.

---

## 3. El serif del PDF: la fuente estándar de jsPDF

**Decisión**: en `pdf.js`, los títulos y el folio pasan a `doc.setFont('times', ...)`; el cuerpo y la tabla se quedan en `helvetica`. No se incrusta ninguna tipografía.

**Razón**: jsPDF trae las 14 fuentes estándar del formato PDF, entre ellas `times` en sus cuatro variantes, sin necesidad de incrustar nada. Incrustar Source Serif 4 exigiría convertirla a un módulo de jsPDF y meter el archivo codificado en el producto: engorda cada PDF generado y choca de frente con SC-031 (el archivo no crece más de un 20 %). La aclaración de 2026-10-21 ya aceptó que «misma identidad» significa misma clase tipográfica, no la misma tipografía: `times` y Source Serif 4 son ambas serif de transición, y puestas una al lado de la otra se leen como el mismo registro.

**Alternativas descartadas**: *incrustar Source Serif 4* — rompe SC-031 por un parecido que nadie va a comparar carácter a carácter. *Dejar todo el PDF en `helvetica`* — el serif de los títulos es precisamente lo que hace que el documento se lea como un despacho; sin él, el PDF no cambia de registro.

---

## 4. El componente de confirmación: el elemento nativo de diálogo

**Decisión**: construir la confirmación sobre el elemento `<dialog>` nativo, abierto con `showModal()`, estilado con los tokens de la identidad y su pseudo-elemento de fondo. Vive en `ui.js` como función que devuelve una promesa, para sustituir a `confirmar()` sin tocar quien la llama.

**Razón**: es, con diferencia, el camino más simple que cumple FR-024a completo, porque el navegador ya resuelve gratis todo lo difícil: bloquea la interacción con el resto de la página, atrapa el foco dentro del diálogo, cierra con la tecla de escape, devuelve el foco al elemento que lo abrió y expone el rol correcto a las tecnologías de asistencia. Está disponible en las versiones vigentes de Chrome y de Firefox, que son las dos únicas que el producto soporta. Escribir eso a mano serían cien líneas de gestión de foco y teclado, cada una con su propia forma de fallar.

La firma actual, `confirmar(texto)`, es síncrona y devuelve un booleano. La nueva devuelve una promesa, y las tres llamadas existentes (eliminar cotización en `quotes.js:41`, cliente en `clients.js:61` y servicio en `services.js:53`) ya están dentro de funciones asíncronas, así que el cambio es añadir `await`. **No existe ninguna confirmación de «salir de un formulario con cambios sin guardar»**: no hay guardia de cambios en `public/js/`. La revisión 1 la daba por supuesta por error; construirla sería alcance nuevo y queda anotada como sugerencia, fuera de esta revisión. La acción por defecto es cancelar: el botón de cancelar recibe el foco al abrir.

**Alternativas descartadas**: *diálogo a mano con `div` y superposición* — reimplementa mal lo que el navegador ya hace bien. *Conservar `window.confirm`* — descartada por la persona dueña. *Una librería de diálogos* — prohibido añadir dependencias.

---

## 5. Hueco reservado durante la carga, sin salto

**Decisión**: en Inicio, las dos cifras del resumen se dibujan desde el principio dentro de un contenedor con altura y anchura mínima fijas, tomadas de los tokens, con un bloque de carga neutro en su interior en lugar del texto «Cargando…». El fallo de carga se distingue del cero por un texto breve, no por un guion.

**Razón**: hoy el hueco se inicializa con la cadena «Cargando…» dentro de la propia etiqueta de color, y al llegar el dato el ancho se desploma de nueve caracteres a uno: eso es el salto que SC-018 prohíbe. Reservar el espacio con los tokens de tamaño ya existentes evita el salto sin añadir ningún mecanismo. El bloque de carga no necesita animación: FR-020 y el borde del caso de movimiento reducido piden que nada se entienda solo por animación, y un rectángulo neutro ya comunica «aquí viene un dato».

Hoy un fallo de carga muestra `–` en las dos cifras, casi indistinguible de un cero, lo que incumple FR-005 y FR-021. Pasa a mostrar un texto corto en español.

**Alternativas descartadas**: *animación de pulso* — decorativa, y hay que neutralizarla con movimiento reducido para nada. *No mostrar nada hasta que llegue el dato* — el salto es peor: la página se reconstruye entera.

---

## 6. Densidad: qué cambia en cada tramo

**Decisión**: tres tramos, con un reparto explícito de responsabilidades.

| Tramo | Qué introduce |
|-------|---------------|
| Base (desde 360 px) | Alturas táctiles de 44 px, navegación inferior fija, listas apiladas, márgenes de 16 px |
| Desde 768 px | La navegación pasa arriba, las listas pasan a filas con encabezado, márgenes de 24 px. **Las alturas táctiles no bajan todavía** |
| Desde 1024 px | Densidad de escritorio: controles de 36 px, filas de 40 px, márgenes de 40 px, ancho máximo de 1200 px |
| Desde 1280 px | La rejilla de accesos de Inicio pasa de 2 a 4 columnas |

**Razón**: el defecto de la revisión 1 no es que faltaran tramos, es que mezclaba dos preguntas distintas en uno solo. «¿Cabe una tabla?» se responde a 768 px; «¿estoy en un dispositivo de ratón, donde 36 px de alto es cómodo?» se responde más arriba. Un portátil de 1024 px o una tableta en horizontal necesitan la tabla, pero no necesariamente la densidad reducida; separarlos deja a la tableta con tabla y dedo, que es lo correcto. Con filas de 40 px, SC-023 (14 filas en un monitor de 1440 px) se cumple con holgura.

**Alternativas descartadas**: *compactar desde 768 px* — castiga a la tableta táctil. *Un solo tramo* — es lo que hay y es el defecto. *Detectar si hay ratón en lugar de medir el ancho* — más preciso en teoría, pero introduce una condición nueva por una ganancia marginal, contra el Principio I.

---

## 7. El estado pulsado en pantalla táctil

**Decisión**: el estado pulsado se dibuja con el selector `:active`, con cambio de fondo y de color de borde —nunca con desplazamiento ni escala— y queda excluido del apagado por movimiento reducido, porque no es una animación sino un cambio de color.

**Razón**: `:active` funciona tanto con ratón como al tocar, y en táctil es el único indicio de que el toque se registró, ya que no hay estado de apuntado. Hacerlo con color y no con transformación evita dos problemas: que el botón «salte» en una lista densa, y tener que neutralizarlo con movimiento reducido. La regla actual de transición solo cubre fondo y borde, así que el cambio encaja sin tocarla.

**Alternativas descartadas**: *hundir el botón con una transformación* — se nota mal en listas densas y hay que apagarlo con movimiento reducido. *No marcar el pulsado en táctil* — es justamente el hueco que SC-017 cierra.

---

## 8. Campo inválido: borde, mensaje y anuncio

**Decisión**: el control inválido lleva `aria-invalid` y un borde en el rojo destructivo, además de su mensaje de texto, que se enlaza al control con `aria-describedby`. La ayuda `field()` de `ui.js` pasa a aceptar el estado inválido y a generar ese enlace.

**Razón**: hoy `field()` dibuja el mensaje de error como un párrafo debajo, pero el control no cambia de aspecto ni se marca, así que quien usa lector de pantalla no recibe el aviso al llegar al campo. Con `aria-invalid` y `aria-describedby` el anuncio llega sin añadir nada visible, y el borde rojo cumple la parte visual de FR-022. Como `field()` ya recibe el control y conoce su identificador, el enlace se genera sin cambiar la forma de llamarla desde las pantallas.

**Alternativas descartadas**: *solo el borde rojo* — incumple «ningún estado solo con color» y no anuncia nada. *Solo el mensaje* — es lo que hay hoy, y es el hueco. *Un icono de error* — el juego de iconos está fuera de alcance.

---

## 9. El botón que informa de su avance sin moverse

**Decisión**: el botón de exportación conserva su etiqueta y muestra el avance en un elemento interno de ancho reservado; el ancho del botón se fija al iniciar la exportación y se libera al terminar.

**Razón**: hoy el botón sustituye su propio texto por «Exportando… 3 de 12», con lo que se ensancha y empuja al botón de nueva cotización que tiene al lado, en la cabecera de la pantalla: exactamente lo que SC-020 prohíbe. Reservar el ancho es lo mínimo que lo resuelve; el contador sigue informando, que es lo valioso del comportamiento actual.

**Alternativas descartadas**: *mover el avance a un aviso* — aleja la información del sitio donde se pulsó. *Quitar el contador* — pierde información útil en una operación que tarda. *Dar al botón un ancho fijo en todos los casos* — un valor suelto en un componente, prohibido por FR-010.

---

## 10. Avisos: cerrables, con dos duraciones

**Decisión**: la franja de avisos pasa a llevar un botón de cierre. El aviso de éxito mantiene su desaparición automática a los 4 segundos; el de error pierde todo temporizador y se queda hasta que se cierra o se cambia de pantalla.

**Razón**: el comportamiento actual ya es casi el correcto —el éxito se va a los 4 s, el error se queda— pero el error no se puede cerrar, así que ocupa sitio indefinidamente en una página que la persona ya leyó. Añadir el cierre completa FR-024 sin cambiar las dos duraciones, que ya cumplen SC-021 (menos de 10 s para el éxito).

**Alternativas descartadas**: *convertirlo en notificaciones flotantes apiladas* — un componente nuevo y una cola que gestionar, sin ninguna necesidad escrita. *Que el error también desaparezca solo* — se perdería un mensaje que la persona quizá no llegó a leer.

---

## 11. Capturar la referencia del PDF antes de implementar

**Decisión**: la primera tarea de la implementación es recapturar los dos archivos de referencia (`baseline-hashes.txt` y `baseline-pdf-text.txt`) con el código actual, antes de tocar nada, y anotar también el tamaño en bytes de los tres PDF de ejemplo.

**Razón**: esos archivos describen el PDF de la revisión 1 y son la única base de comparación de SC-027 (contenido idéntico cifra por cifra) y de SC-031 (el archivo no crece más de un 20 %). Si se implementa primero, la referencia se pierde y los dos criterios quedan sin poder verificarse. El tamaño en bytes hoy no está registrado en ninguna parte, así que hay que añadirlo.

**Alternativas descartadas**: *reutilizar las referencias de la revisión 1* — describen un PDF anterior a la spec 003, que reorganizó `pdf.js` por dentro; comparar contra ellas mezclaría dos cambios distintos.
