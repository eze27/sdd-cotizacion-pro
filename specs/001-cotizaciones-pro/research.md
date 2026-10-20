# Research: CotizacionesPro v0

No quedaban `NEEDS CLARIFICATION` en el contexto técnico. Estas son las decisiones tomadas.

## 1. Forma de la aplicación
- **Decision**: servidor Node.js + Express que sirve las páginas estáticas y una API JSON mínima;
  pantallas en HTML, CSS y JavaScript sin framework ni compilación, con navegación por `#`.
- **Rationale**: pila pedida por el dueño; sigue siendo lo más simple que cumple la spec con datos
  accesibles desde cualquier dispositivo.
- **Alternatives considered**: sitio 100 % estático con datos en el navegador (descartado: datos
  distintos por dispositivo); React/Vue (compilación y dependencias sin necesidad).

## 2. Almacenamiento
- **Decision**: SQLite (un archivo) con `better-sqlite3`, que es síncrono y no necesita servidor de
  base de datos aparte. Las tablas se crean al arrancar si no existen. El archivo se guarda en
  `DB_PATH` (por defecto `data/cotizaciones.db`).
- **Rationale**: una sola pieza, fácil de respaldar copiando el archivo; adecuado para un usuario.
- **Alternatives considered**: PostgreSQL/MySQL (servidor extra innecesario); `node:sqlite`
  integrado (aún con estatus experimental según versión); archivos JSON (sin transacciones para
  los folios).
- **Riesgo**: en hostings con disco temporal se perdería la base. Hay que elegir un hosting con
  volumen persistente. No hay respaldo automático en v0 (fuera de la spec); se recomienda copiar
  el archivo periódicamente.

## 3. Acceso y seguridad
- **Decision**: sin cuentas ni contraseña (respuesta explícita del dueño). El servidor aplica
  validación de todos los datos (no confía en la pantalla), consultas con parámetros (sin
  concatenar texto) y salida de texto escapada en pantalla.
- **Rationale**: la protección básica de entrada es necesaria incluso sin login; la falta de
  contraseña se asume como riesgo documentado en la spec.
- **Alternatives considered**: contraseña única por variable de entorno (propuesta y rechazada).

## 4. Dinero sin errores de redondeo
- **Decision**: enteros, nunca decimales flotantes. Precio en centavos; cantidad en centésimas
  (máximo 2 decimales, confirmado por el dueño: por ejemplo, 0.25). El subtotal exacto queda en
  diezmilésimas de peso; IVA, retención de ISR y retención de IVA se calculan con fracciones
  exactas sobre el subtotal sin redondear y luego se redondean a centavos con "0.005 sube". El
  subtotal mostrado se redondea igual; el total suma y resta los importes ya redondeados.
- **Rationale**: reproduce al centavo los tres ejemplos de la spec ($19,066.67, $20,816.67,
  $23,200.00).
- **Fórmulas exactas** (sobre subtotal exacto S): IVA = S × 16/100; ISR = S × 10/100 o S × 1.25/100;
  retención de IVA = S × 16/100 × 2/3.
- **Alternatives considered**: decimales normales (errores de representación); librería de
  decimales (dependencia innecesaria).

## 5. Un solo módulo de cálculo
- **Decision**: `public/js/calc.js` es un módulo ES sin dependencias del navegador. Las pantallas
  lo usan para mostrar totales en vivo y el servidor lo importa para validar y calcular la lista.
- **Rationale**: una sola fuente de verdad para las cifras.
- **Alternatives considered**: duplicar la lógica (riesgo de diferencias).

## 6. Generación del PDF
- **Decision**: se crea en el navegador con jsPDF, incluido como archivo local en
  `public/vendor/`; archivo `Cotizacion-AAAA-NNN.pdf`. Diseño en `contracts/pdf-cotizacion.md`.
- **Rationale**: "descargar PDF" funciona igual en celular y escritorio; sin trabajo extra del
  servidor ni dependencia de una CDN.
- **Alternatives considered**: PDF en el servidor (otra dependencia); imprimir a PDF (torpe en
  celular y resultado variable).

## 7. Logo
- **Decision**: PNG o JPG de hasta 2 MB; al cargarlo se reduce en el navegador a un ancho máximo
  de 400 píxeles y se envía al servidor, que lo guarda en la base.
- **Rationale**: cierra el pendiente de la clarificación; mantiene la base y el PDF ligeros.
- **Alternatives considered**: guardar el original; exigir tamaño exacto.

## 8. Folio, fechas y vigencia
- **Decision**: el servidor asigna el folio al guardar por primera vez, dentro de una transacción
  que incrementa el contador del año (tabla aparte); así un folio eliminado no se reutiliza y no
  hay duplicados. La fecha de emisión y el año se toman de la fecha actual en la zona horaria
  `America/Mexico_City`, y se renuevan al guardar una edición. "Vencida" cuando hoy (hora de
  México) es posterior a emisión + 30 días naturales; el día 30 aún es vigente.
- **Rationale**: cumple FR-013/FR-014; evita errores de fin de año por la hora del servidor.
- **Alternatives considered**: calcular el folio desde la lista (reutilizaría folios borrados);
  fecha del navegador (puede estar mal configurada).

## 9. Validación del RFC
- **Decision**: validación básica de formato, sin consulta al SAT: 3 letras (persona moral) o 4
  letras (persona física), 6 dígitos y 3 caracteres de homoclave; las letras pueden incluir Ñ y &;
  se acepta en minúsculas y se guarda en mayúsculas.
- **Rationale**: lo pedido en la clarificación.
- **Alternatives considered**: dígito verificador o consulta al SAT (fuera de alcance).

## 10. Pruebas
- **Decision**: `node --test` sin paquetes extra. `calc.test.js` cubre cálculo, redondeo, folio,
  vigencia y RFC; `api.test.js` levanta la app con SQLite en memoria y verifica guardado, reglas
  (sin conceptos, ceros, más de 2 decimales), folios y confirmación de que editar no cambia el
  folio ni las tasas. El resto se prueba usando la app con `quickstart.md` (Principio IV).
- **Alternatives considered**: pruebas de interfaz automatizadas (infraestructura extra para v1).

## 11. Publicación
- **Decision**: desplegar el servidor en un hosting de Node.js con disco persistente (por ejemplo,
  Render con disco, Railway o Fly.io con volumen) y apuntar `DB_PATH` a ese disco. La elección
  concreta se hace al publicar; no cambia el diseño. Sin claves ni secretos: solo `PORT` y `DB_PATH`.
- **Rationale**: publicar es subir el proyecto y definir dos ajustes; HTTPS lo da el hosting.
- **Alternatives considered**: contenedores o servidores propios (más trabajo sin beneficio en v1).
