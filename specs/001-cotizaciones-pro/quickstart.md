# Quickstart: validar CotizacionesPro v0

Guía para comprobar que la app cumple la spec, sin leer código (Principio IV).

## Preparación

- Abrir la app publicada, o localmente: `npm install`, luego `npm start` y visitar
  `http://localhost:3000`.
- Probar en Chrome y en Firefox, y en pantalla de celular (o ventana angosta).
- Empezar con una base de datos vacía (sin archivo en `data/`, o con `DB_PATH` apuntando a uno nuevo).

## 1. Perfil (historia 2)

1. Intentar guardar el perfil vacío → se indica qué falta (nombre, RFC y régimen).
2. Capturar un RFC mal escrito → se rechaza. Capturar uno válido y elegir "Actividades
   Empresariales y Profesionales"; subir un logo → se guarda.

## 2. Clientes y servicios (historias 3 y 4)

1. Crear un cliente persona moral con razón social y otro persona física.
2. Crear dos servicios: "Diseño de página web" $15,000.00 y "Sesión de fotos de producto" $5,000.00.
3. Intentar un precio de 0 o negativo → se rechaza. Eliminar un servicio de prueba → pide
   confirmación; cancelar no lo borra.

## 3. Cotización y totales (historia 1)

1. Crear una cotización para el cliente persona moral con los dos servicios.
2. Comprobar: subtotal $20,000.00, IVA $3,200.00, ISR −$2,000.00, IVA retenido −$2,133.33, total
   **$19,066.67**.
3. Cambiar el cliente a persona física → desaparecen las retenciones; total **$23,200.00**.
4. En Perfil, cambiar el régimen a RESICO y crear una cotización nueva a la persona moral → ISR
   −$250.00 y total **$20,816.67**; la cotización anterior no cambia.
5. Salir de una cotización nueva sin conceptos → se descarta y no consume folio. Intentar guardarla
   sin conceptos → se avisa.

## 4. PDF

1. Descargar el PDF de la primera cotización (archivo `Cotizacion-AAAA-001.pdf`).
2. Verificar contra `contracts/pdf-cotizacion.md`: logo, folio, fechas, datos de ambas partes,
   tabla, desglose y total; sin notas.

## 5. Mis cotizaciones (historia 5)

1. Abrir la sección de cotizaciones: se ven folio, cliente, fecha, total y estado.
2. La segunda cotización del año tiene folio terminado en 002; eliminar una (con confirmación) y
   crear otra → el folio eliminado no se reutiliza.
3. Editar y guardar una cotización → su fecha de emisión pasa a hoy y conserva su folio.
4. Verificar que cada cotización muestra su fecha de vigencia y que las nuevas no dicen "vencida".
   *Verificación diferida:* pasados 31 días de una emisión, comprobar que aparece "vencida" y que, al
   editarla y guardarla, deja de estarlo. El 1 de enero, comprobar que el primer folio del año
   nuevo termina en 001. Antes de publicar, `npm test` cubre ambos casos con fecha simulada.

## 6. Persistencia

1. Cerrar el navegador y volver a abrir la app → perfil, catálogos y cotizaciones siguen ahí.
2. Abrirla desde otro dispositivo (por ejemplo, el celular) con la misma dirección → se ven los
   mismos datos.
3. Detener el servidor y abrir la app → se avisa claramente que no hay conexión con el servidor;
   al volver a encenderlo, nada se perdió.

## Cantidades

En un concepto, capturar cantidad `0.25` → se acepta; `0.255` → se rechaza; `0` o `-1` → se rechaza.

## Pruebas automáticas

`npm test` → todas pasan (ejemplos de `contracts/calculo-cotizacion.md` y reglas de
`contracts/api.md`).

## Publicación

Usar un hosting de Node.js con disco persistente (con `DB_PATH` apuntando a ese disco) y copiar el
archivo de datos de vez en cuando. La app no tiene contraseña: no compartir la dirección.

## Resultado esperado

Los criterios SC-001 a SC-009 de la spec se cumplen. En particular, una cotización completa se
emite en menos de 5 minutos con perfil y cliente ya capturados.
