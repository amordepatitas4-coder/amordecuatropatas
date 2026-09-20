# Guía de Exposición y Defensa Académica
## Sistema Web de Gestión — Fundación Amor de Cuatro Patas (Proyecto A+S)

> **Propósito:** Esta guía prepara una demostración honesta del MVP local. Debe distinguir lo que ya fue verificado de lo que depende de conexión, despliegue o validación del socio.

---

## 1. 🎤 Estructura y Discurso de Apertura (2 a 3 minutos)

### Introducción Recomendada:
> *"Buenos días profesor(a), comisión evaluadora y compañeras(os). Hoy presentamos el **Sistema Web de Gestión de Rescate y Adopción Animal**, desarrollado en el marco del programa **Aprendizaje + Servicio (A+S)** para nuestro socio comunitario: la **Fundación Amor de Cuatro Patas**.*
>
> *Actualmente, la Fundación enfrenta una grave dispersión de información: manejan historiales sanitarios en libretas, antecedentes de cuidadores en chats de WhatsApp y fotos en teléfonos personales. Esta falta de centralización dificulta mantener la trazabilidad histórica de los rescatados, saber qué vacunas faltan, justificar gastos ante postulaciones a fondos y elaborar piezas de difusión para encontrar adoptantes responsables.*
>
> *Nuestra solución es un **Producto Mínimo Viable (MVP) web local**, que sitúa al **Animal como entidad central**, mantiene trazabilidad, facilita el control sanitario y financiero e incorpora un generador gráfico de flyers. La redacción usa plantillas locales editables; la IA remota y la persistencia en Supabase son la siguiente fase."*

---

## 2. 🖥️ Guion de Demostración en Vivo (Paso a Paso)

Sigue este orden exacto durante la demo en vivo para impresionar a los evaluadores:

### Paso 1: Autenticación y Panel Principal
* **Qué mostrar:** En el primer uso configura contraseñas distintas para Presidenta y Tesorera. Cierra sesión e inicia con una de ellas; luego muestra los indicadores del panel.
* **Qué explicar:** *"El contenido de gestión permanece oculto hasta autenticar. Ambas cuentas tienen los mismos permisos. Esta protección local evita el acceso casual antes de conectar Supabase Auth; no sustituye la seguridad de servidor requerida para producción."*

### Paso 2: Fichas de Animales y Trazabilidad (El Núcleo del Sistema)
* **Qué mostrar:** Ve a la sección **Fichas de Animales**. Muestra las tarjetas con fotos reales, razas y estados de colores. Filtra por *"Disponibles"* o busca *"Luna"*.
* **El momento clave (Ficha Integral):** Haz clic en el botón **"📋 Ver Ficha Integral"** de Luna:
  1. **Pestaña Antecedentes:** Muestra la historia del rescate, personalidad y el hogar temporal actual.
  2. **Pestaña Historial Sanitario:** Muestra la línea de tiempo cronológica: desparasitación (12/06), vacunación óctuple (25/06) y esterilización (05/07). Explica que cumple el **RF-04**.
  3. **Pestaña Hogares Temporales:** Muestra las fechas exactas de permanencia (**RF-05**).
  4. **Pestaña Gastos:** Muestra cuánto dinero ha invertido la Fundación en Luna de forma individual y compartida (**RF-09**).
  5. **Pestaña Trazabilidad:** Muestra la línea de tiempo de estados desde su rescate hasta quedar disponible.
* **Qué recalcar:** *"Bajo el principio de trazabilidad (**RNF-06**), ningún animal se elimina jamás de la base de datos; al adoptarse, pasa a registro histórico para estadísticas."*

### Paso 3: Hogares Temporales y Familias de Paso
* **Qué mostrar:** Ve a **Hogares Temporales**. Muestra las tarjetas de los cuidadores voluntarios (Marta y Carlos), su capacidad máxima (ej. 1/2 ocupados) y qué mascotas están alojadas actualmente.
* **Acción:** Haz clic en *"Hospedar Mascota"* para demostrar cómo se traslada un animal con registro de fecha de entrada.

### Paso 4: Adopciones, Cuestionario Digital y Seguimiento
* **Qué mostrar:** Ve a **Adopciones y Seguimiento**.
* **Alternativa B (Innovación del equipo):** Haz clic en **"📝 Evaluar Postulación (Cuestionario)"**. Completa una prueba rápida: tipo de vivienda (departamento con mallas), tiempo a solas (menos de 4 horas) y solvencia.
* **Qué explicar:** *"El sistema evalúa automáticamente la postulación calculando un puntaje de compatibilidad de tenencia responsable (ej. 85/100 puntos - Aprobado), permitiendo pre-rellenar el contrato de entrega."*
* **Seguimiento Post-Adopción:** Muestra los seguimientos acumulados de *Mimi* (WhatsApp del 15/08 y llamada del 01/09) (**RF-08**).

### Paso 5: Control de Gastos y Finanzas
* **Qué mostrar:** Ve a **Gestión de Gastos**. Muestra cómo se filtran por categoría (*Veterinaria, Alimento, Insumos*).
* **Qué explicar:** *"Cumpliendo con **RF-09**, el sistema permite registrar gastos asociados a un único animal (cirugía de Luna), gastos compartidos (saco de alimento para Luna y Rocky) y gastos generales de la Fundación."*

### Paso 6: Borradores Locales y Generador de Flyers en Canvas
* **Qué mostrar:** Ve a **Difusión y Flyers**.
* **Acción de borrador:** Selecciona a Luna, elige tono *"Emotivo y Tierno"*, canal *"Instagram"* y presiona **"Generar borrador local"**.
* **Qué explicar:** *"El MVP genera un texto editable mediante plantillas locales y exige revisión humana. La IA generativa real aún no está conectada: deberá incorporarse mediante un endpoint autenticado para no exponer claves en el navegador."*
* **Acción Flyer:** Cambia el tema visual a *"🎨 Estilo Institucional"*, *"🚨 Caso Urgente"* o *"💖 Cachorro"*, y presiona **"⬇️ Descargar Flyer (PNG)"**. Muestra cómo el archivo se descarga al instante sin ocupar espacio en la nube (**estrategia de ahorro de almacenamiento**).

### Paso 7: Documentos Digitales y Respaldo de Datos
* **Qué mostrar:** Ve a **Documentos Digitales** (**RF-10**). Muestra los enlaces a Google Drive para contratos oficiales y boletas.
* **Respaldo Local:** Muestra en el menú lateral los botones **"💾 Exportar Respaldo JSON"** e **"📥 Importar Respaldo JSON"**, explicando que la Fundación puede resguardar toda su información en cualquier momento.

---

## 3. 🎯 Matriz de Cumplimiento de Requerimientos

| Requerimiento | Descripción | ¿Dónde se demuestra en la Web? |
| :--- | :--- | :--- |
| **RF-01** | Acceso de Presidenta y Tesorera con mismos permisos | Configuración inicial, inicio y cierre de sesión local |
| **RF-02** | Fichas de animales (crear, buscar, filtrar) | Sección Fichas de Animales y modal de registro |
| **RF-03** | Trazabilidad del flujo de estados | Pestaña "Trazabilidad" en Ficha Integral |
| **RF-04** | Historial sanitario cronológico | Sección Historial Sanitario y pestaña en Ficha |
| **RF-05** | Hogares temporales e historial de permanencia | Sección Hogares Temporales y chip de ocupantes |
| **RF-06** | Multimedia (hasta 2 fotos y links a Drive) | Campo de fotos y enlace Drive en cada ficha |
| **RF-07** | Adopciones, adoptantes y cuestionario | Sección Adopciones y modal de Cuestionario Digital |
| **RF-08** | Seguimiento acumulativo post-adopción | Tabla de adopciones y modal de seguimientos periódicos |
| **RF-09** | Gastos (individual, múltiple o general) | Sección Gastos y desglose financiero en Ficha |
| **RF-10** | Documentos digitales vinculados a Drive | Sección Repositorio de Documentos Digitales |
| **RF-11** | Informes y métricas de gestión | Sección Informes y modo de impresión / PDF |
| **RF-12** | IA generativa para texto y flyers en Canvas | Cumplimiento parcial: borradores locales y flyer PNG; IA remota pendiente |
| **RF-13** | Exclusión de publicación automática en redes | Justificado como mejora futura fuera del MVP |

---

## 4. 💡 Preguntas Típicas de la Comisión y Cómo Responderlas

### Pregunta 1: *"¿Por qué eligieron una arquitectura BaaS con Supabase y Frontend desacoplado en vez de un monolito como Spring Boot?"*
> **Respuesta:** *"Se preparó el esquema para Supabase porque ofrece PostgreSQL, autenticación y políticas RLS con bajo costo operativo. La versión demostrada todavía es local; la conexión y sus pruebas de seguridad deben completarse antes de un despliegue con datos reales."*

### Pregunta 2: *"¿Cómo garantizan que los datos no se pierdan si un animal es adoptado?"*
> **Respuesta:** *"Implementamos el **Principio de Trazabilidad Histórica** (**RNF-06**). El sistema no aplica borrado físico (DROP ni DELETE) sobre la tabla de animales. Al adoptarse, su estado pasa a 'Adoptado', cerrando la estancia en el hogar temporal y congelando el carnet médico para consulta histórica permanente."*

### Pregunta 3: *"¿Cómo resuelven el problema del consumo de almacenamiento para fotos y videos?"*
> **Respuesta:** *"Implementamos una **estrategia multimedia híbrida**: en Supabase Storage se almacenan únicamente hasta dos fotografías operativas comprimidas por animal para visualización y generación de flyers. Todo el contenido histórico pesado (videos, carpetas completas) se referencia mediante enlaces a Google Drive, evitando sobrecostos de almacenamiento."*

### Pregunta 4: *"¿La Inteligencia Artificial toma decisiones o publica sola?"*
> **Respuesta:** *"No. En el MVP actual ni siquiera hay un servicio de IA conectado: se usan plantillas locales. La integración futura solo propondrá borradores editables, mediante un endpoint autenticado y con revisión humana obligatoria."*
