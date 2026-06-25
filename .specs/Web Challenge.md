

## Web Challenge — Mini Wallet Web App
¡Hola! Bienvenido(a) al challenge técnico web de Spin. Estamos emocionados de que
estés en este proceso y queremos conocer tu forma de pensar y construir software.



El reto
Vas a construir una web app en NextJs + TypeScript que simule un flujo básico de una
wallet financiera:

## Login → Home → Nueva Transacción → Confirmación / Comprobante

La web app no necesita conectarse a servicios reales — los datos serán mockeados. Lo
que buscamos es ver cómo resuelves decisiones reales de desarrollo web: tipado,
arquitectura, estado, permisos, manejo de errores, componentes reutilizable.

Contexto: El sistema opera en un entorno de alto volumen con millones de
usuarios activos. Tus decisiones de diseño deben considerar escalabilidad y
mantenibilidad.



Pantallas requeridas

## 1. Login

## Aspecto Detalle
Formulario Teléfono o email
Validaciones Formato de entrada, campos requeridos
Estados Carga, error simulado
Sesión Persistencia simple de sesión mockeada
Navegación Al Home después del login exitoso
No se busca seguridad ni autenticación real. Se busca validar estructura, estado,
validación, navegación y separación de responsabilidades.



## 2. Home

## Aspecto Detalle
Datos Saldo disponible + nombre del usuario (mockeado)
Movimientos Lista de movimientos recientes
Estados Carga, vacío y error
Acción Botón para iniciar nueva transacción
Aquí se valida composición de componentes, listas, estado, diseño responsivo y manejo
de información asincrónica



## 3. Nueva Transacción
El candidato debe implementar un flujo de envío de dinero:

Funcionalidad base:


- Ingresar monto.
- Seleccionar un contacto de la lista de favoritos o ingresar manualmente un nuevo
contacto y guardarlo (mockeado)
- Mostrar resumen antes de confirmar.
- Confirmar transacción con respuesta mockeada.
- Mostrar comprobante o pantalla de éxito.




Reglas de Negocio
Tu web app debe implementar las siguientes validaciones antes de confirmar la
transacción:


- Monto mínimo: No se permite monto cero ni negativo.
- Saldo suficiente: El monto no puede superar el saldo disponible.
- Destinatario obligatorio: No se puede confirmar sin destinatario.

El cómo y dónde implementes estas reglas forma parte de la evaluación.



## 4. Confirmación

El candidato deberá generar una pantalla de confirmación que debe funcionar de manera
aleatoria.

Escenario Comportamiento esperado
Éxito Transacción confirmada, mostrar comprobante
Error de red Mostrar estado de error con opción de reintentar
Fondos insuficientes Mostrar error descriptivo
Timeout Manejar espera excesiva
Error desconocido Fallback genérico

Tu web app debe manejar estos escenarios — no solo el happy path.



Requerimientos técnicos

## Aspecto Detalle
Framework NextJs + TypeScript
Rendering Puedes considerar el uso de SSR, CSR o combinados en
ciertas páginas (justifica tu decisión)
Estructura de Navegación
## (paths)
Puedes escoger entre pages o router
Estado A tu elección (Context, Zustand, Redux, etc.). Justifica tu
decisión.
Servicios Uso de API router con datos mockeados.
Testing Se valora testing unitario de validaciones, hooks y
componentes críticos.
E2E Testing Se valora testing e2e con playwright o el motor que escojas
(justifica tu decisión)
## Documentación
README.md con instrucciones claras para levantar el proyecto.



## Entregables
- Código fuente en un repositorio Git.
- README.md con instrucciones para ejecutar el proyecto, librerías usadas y
limitaciones conocidas.
- DECISIONS.md con tus decisiones de diseño: por qué estructuraste el proyecto
así, cómo separaste UI y lógica de negocio, qué edge cases consideraste y qué
harías diferente con más tiempo.
- Nota sobre uso de IA (ver sección abajo).

Todo lo adicional que decidas incluir (tests, abstracciones de capabilities, manejo
avanzado de estados, etc.) es bienvenido y será considerado en la evaluación según el
nivel al que apliques.



¿Qué valoramos?
- TypeScript con intención — Tipos claros, modelos de dominio, evitar any,
contratos bien definidos.
- Composición React — Componentes limpios, hooks, separación UI/lógica,
renderizado condicional.
- Experiencia con renderizados — SSR, CSR, Server Actions.
- Implementación de servicios — Uso de API Routes.
- Reglas de negocio — Validaciones en el lugar correcto, no solo en la UI.
- Pragmatismo — Resolver de forma simple y extensible, sin sobre-ingenierizar.

Aplica las mejores prácticas que conozcas. Esperamos un código con la
calidad que usarías en un entorno profesional de producción.



Uso de Inteligencia Artificial
El uso de herramientas de IA (Copilot, ChatGPT, Claude, etc.) está permitido. La IA
es parte del flujo de trabajo moderno y no penalizamos su uso.

Te pedimos que documentes en un archivo AI_USAGE.md:


- Qué herramientas usaste y en qué partes del proyecto.
- Qué aceptaste directamente y qué corregiste o rechazaste.
- Qué decisiones tomaste tú y no la IA.

La IA es una herramienta; el criterio de ingeniería sigue siendo tuyo. En la
siguiente etapa del proceso podremos hacerte preguntas sobre tus decisiones
y pedirte modificaciones en vivo sobre tu código.



Plazo de entrega
3 días calendario desde la recepción de este challenge.

Envía el link a tu repositorio (si es privado, otorga acceso al correo que te indicará el
equipo de People).

Te pedimos que declares en el README cuánto tiempo real invertiste en el challenge.



¿Por qué Spin?
- Trabajamos con NextJs y TypeScript en un entorno financiero el cual es usado
por millones de personas.
- Valoramos ingenieros que escriben código con intención — que no solo
funcione, sino que comunique.
- La IA es aliada, no enemiga — la usamos para amplificar el talento del equipo.


Que la Fuerza te acompañe en este challenge.