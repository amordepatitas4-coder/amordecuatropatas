# Manual Técnico y Explicación del Código Fuente
## Sistema Web de Gestión — Fundación Amor de Cuatro Patas (Proyecto A+S)

> **Destinatarios:** Estudiantes, docentes evaluadores, desarrolladores y socias comunitarias de la Fundación Amor de Cuatro Patas.  
> **Objetivo:** Explicar con total claridad la arquitectura, el funcionamiento de cada archivo, las funciones implementadas y cómo se conecta cada componente con los requerimientos del proyecto.

---

## 1. 🏗️ Arquitectura General y Estructura de Archivos

El sistema está diseñado como una **Aplicación de Página Única (SPA - Single Page Application)** construida con tecnologías web estándar modernas (**HTML5 semántico, CSS3 con diseño responsivo y Glassmorphism, y JavaScript modular ES6**).

```
A_S/
├── index.html                   # Interfaz de usuario completa, secciones SPA y ventanas modales
├── index.css                    # Sistema de diseño visual, variables CSS, componentes y estilos de impresión
├── README.md                    # Descripción general y guía de ejecución
├── Documentación del Proyecto.md # Especificación formal de los 23 puntos del proyecto
├── Documentación del Código.md      # Este manual: explicación técnica detallada del código
└── js/
    ├── auth.js                  # Autenticación local, configuración y expiración de sesión
    ├── db.js                    # Capa de Base de Datos relacional (Data Access Layer)
    ├── app.js                   # Controlador principal y enrutador SPA
    └── modules/
        ├── animals.js           # Fichas de animales, filtros y Ficha Integral con pestañas
        ├── health.js            # Historial sanitario cronológico y controles clínicos
        ├── homes.js             # Hogares temporales y trazabilidad de cuidadores
        ├── adoptions.js         # Adopciones, adoptantes y seguimientos post-adopción
        ├── expenses.js          # Control de gastos (individuales, compartidos o generales)
        ├── diffusion.js         # Borradores locales y generador de Flyers (Canvas)
        └── reports.js           # Métricas, KPIs y reportes ejecutivos para la Fundación
```

---

## 2. 🗄️ Capa de Base de Datos y Persistencia (`js/db.js`)

### Puerta de acceso local (`js/auth.js`)
`AuthModule` impide mostrar o inicializar los módulos mientras no exista una sesión válida. El primer uso crea las cuentas Presidenta y Tesorera. Cada contraseña se transforma mediante PBKDF2-SHA-256, 210.000 iteraciones y una sal aleatoria; solo se guarda el verificador. La sesión vive en `sessionStorage`, expira tras 30 minutos de inactividad y se elimina al cerrar sesión. Este mecanismo es previo a Supabase y no sustituye la autorización de servidor.

### ¿Qué hace este archivo?
Actúa como el **Motor de Almacenamiento Central**. Simula de forma relacional las tablas que se desplegarán en **PostgreSQL / Supabase**, guardando los datos en `localStorage` del navegador para que el sistema funcione de inmediato sin dependencias ni instalaciones complejas.

### Principales Tablas Simuladas:
1. `animales`: Entidad central del sistema. Almacena nombre, especie, raza, edad, peso, estado actual y fotos operativas.
2. `historial_estados`: Guarda cada cambio de estado (*rescate ➔ cuarentena ➔ hogar temporal ➔ disponible ➔ adoptado*) con fecha y observaciones.
3. `historial_sanitario`: Registro cronológico de atenciones (*desparasitaciones, vacunas, cirugías, tratamientos*).
4. `hogares_temporales`: Registro de familias de acogida, capacidad y dirección.
5. `animal_hogares`: Relación N:M que indica qué animal estuvo en qué hogar y durante qué fechas.
6. `adoptantes`: Registro de personas que adoptan (RUT, nombre, teléfono, domicilio).
7. `adopciones`: Contratos formalizados que unen a un animal con un adoptante.
8. `seguimientos`: Bitácora acumulativa post-adopción (llamadas, visitas, fotos).
9. `gastos`: Costos clasificados como exclusivos de un animal, compartidos o generales de la Fundación.

### Métodos Clave de `window.DB`:
* `getAnimales(filtroEstado, busqueda)`: Retorna la lista filtrada de animales según su etapa en el proceso.
* `getFichaCompletaAnimal(animalId)`: Realiza una consulta relacional completa (JOIN virtual), recopilando el historial sanitario, hogares previos, gastos y seguimientos de un animal específico.
* `saveAnimal(data)`: Inserta o actualiza un animal, generando automáticamente un evento en `historial_estados` si hubo cambio de fase.
* `asignarAnimalAHogar(animalId, hogarId, obs)`: Verifica existencia y cupo del hogar receptor, evita duplicar una estancia activa y solo entonces cierra la estancia anterior y registra el traslado.
* `concretarAdopcion(animalId, adoptanteId, folio, obs)`: Actualiza el estado a `adoptado`, genera el registro legal y crea el primer hito de seguimiento.
* `resetToSeed()`: Permite restaurar los datos de ejemplo iniciales en cualquier momento.

---

## 3. 🧩 Módulos Funcionales (Carpeta `js/modules/`)

### 3.1 Módulo de Animales (`js/modules/animals.js`)
* **Propósito:** Cumplir los requerimientos **RF-02 y RF-03**.
* **Funciones Destacadas:**
  - `render()`: Dibuja las tarjetas de los animales con insignias de colores según su estado actual.
  - `getStatusBadge(estado)`: Asigna el texto y color correspondiente (*Rescate = Ámbar, Cuarentena = Rojo, Hogar = Azul, Disponible = Verde, Adoptado = Rosado*).
  - `viewFicha(animalId)`: Abre la **Ficha Integral del Rescatado**, un modal con pestañas dinámicas que consolida toda la vida del animal: antecedentes, historial clínico, hogares por los que pasó, adopción, gastos acumulados y línea de tiempo.

### 3.2 Módulo de Historial Sanitario (`js/modules/health.js`)
* **Propósito:** Cumplir el requerimiento **RF-04**.
* **Funciones Destacadas:**
  - `render()`: Muestra la tabla cronológica de todas las intervenciones médicas realizadas en la Fundación.
  - `openAddHealthModal(preselectedAnimalId)`: Despliega el formulario para registrar vacunas, desparasitaciones o cirugías, con opción de programar recordatorios para próximos controles.
  - `handleSaveHealth()`: Valida los campos y persiste la atención vinculándola directamente al animal.

### 3.3 Módulo de Hogares Temporales (`js/modules/homes.js`)
* **Propósito:** Cumplir el requerimiento **RF-05**.
* **Funciones Destacadas:**
  - `render()`: Muestra las tarjetas de los cuidadores voluntarios, indicando su capacidad máxima y los animales que tienen alojados en tiempo real.
  - `handleSaveHome()`: Registra nuevos hogares de paso con su tipo de vivienda (casa, departamento, parcela).
  - `handleSaveAssignment()`: Traslada una mascota, presenta al usuario los rechazos por falta de cupo y mantiene el registro del hogar anterior.

### 3.4 Módulo de Adopciones y Seguimientos (`js/modules/adoptions.js`)
* **Propósito:** Cumplir los requerimientos **RF-07 y RF-08**.
* **Funciones Destacadas:**
  - `openCuestionarioModal()`: Despliega el **Cuestionario Digital de Adopción (Alternativa B)** con 15 parámetros (vivienda, mallas de seguridad, horas a solas, solvencia médica y acuerdo familiar).
  - `handleProcessCuestionario()`: Algoritmo de evaluación automática que califica al postulante de 0 a 100 puntos (*Aprobado, Requiere Entrevista o No Recomendado*), autocompletando la ficha de adopción.
  - `handleSaveAdoption()`: Formaliza la adopción guardando los datos del adoptante, el número de contrato y cambiando el estado de la mascota a "Adoptado".
  - `handleSaveSeguimiento()`: Registra hitos periódicos post-adopción (ej. contacto por WhatsApp, llamada o visita) evaluando el bienestar del animal.

### 3.5 Módulo de Control de Gastos (`js/modules/expenses.js`)
* **Propósito:** Cumplir el requerimiento **RF-09**.
* **Funciones Destacadas:**
  - `render()`: Calcula la suma total y filtra gastos por categoría, fecha inicial, fecha final y animal asociado.
  - `handleSaveExpense()`: Permite imputar el costo a un animal en particular, repartirlo entre varios (prorrateo) o registrarlo como gasto administrativo de la Fundación.

### 3.6 Módulo de Gestión Documental (`js/modules/documents.js`)
* **Propósito:** Cumplir el requerimiento **RF-10** mediante visualización interactiva y gestión documental oficial.
* **Funciones Destacadas:**
  - `render()`: Muestra las tarjetas de documentos digitales categorizados (*Formularios oficiales, Contratos legales, Protocolos clínicos de Triage, Cotizaciones veterinarias, Comprobantes de pago*).
  - `viewDocument(docId)`: Despliega un visor modal con hoja membretada, estado local y estructura preparada para revisión.
  - `getDocumentOfficialContent(doc)`: Genera el cuerpo formal y jurídico completo según el tipo de documento:
    1. *Formulario Oficial de Postulación (Ley 21.020):* Evaluación socio-ambiental exhaustiva de 15 dimensiones (grupo familiar, mallas de seguridad, solvencia y declaración jurada).
    2. *Contrato Solemne de Adopción:* Cláusulas legales vinculantes de tutela, prohibición taxativa de abandono o reventa, restitución exclusiva y auxilio de la fuerza pública.
    3. *Protocolo Clínico de Triage e Ingreso:* Escala de Triage Veterinario (Rojo, Amarillo, Verde), examen ECOG, bioseguridad, aislamiento de 15 días y alta quirúrgica.
  - `getDocumentSignaturesHtml(doc)`: Genera la grilla de firmas solemnes y timbres institucionales según la naturaleza del documento.
  - `acceptDocument()`: Confirma una revisión local; no equivale a firma electrónica, certificación ni aprobación del socio.
  - `printCurrentDocument()`: Optimiza el formato para impresión directa o descarga en PDF con márgenes de imprenta limpia.
  - `handleSaveDocument()`: Permite indexar nuevos archivos o enlaces de Google Drive en el repositorio de la Fundación.
  - `populateRelationRecords(tipo)`: Carga animales, adopciones o gastos para vincular formalmente el documento con un registro.
  - `getRelationLabel(doc)`: Presenta y permite filtrar la relación registrada.
  - El membrete usa `.sheet-meta-row` y `.sheet-status-badge` para mantener folio, fecha y estado alineados; a 760 px el encabezado pasa a una sola columna.

### 3.7 Módulo Local de Difusión y Flyers (`js/modules/diffusion.js`)
* **Propósito:** Preparar la interfaz previa a **RF-12** y generar afiches localmente.
* **Funciones Destacadas:**
  - `generateAIText()`: Construye borradores mediante plantillas locales y datos de la ficha. No consume una API de IA. La integración generativa queda pendiente de un endpoint autenticado y protegido.
  - `drawFlyer()`: Utiliza la API de **HTML5 Canvas** para fusionar la foto real del animal con la plantilla gráfica. Soporta 4 temas visuales:
    1. *Institucional:* Paleta índigo/violeta de la Fundación.
    2. *Caso Urgente:* Alerta de alta prioridad con franjas rojas y naranjas.
    3. *Cachorros:* Paleta rosa y celeste para animales bebés.
    4. *Senior:* Paleta verde esmeralda para mascotas adultas.
  - `downloadFlyerPNG()`: Convierte el lienzo en un archivo PNG descargable en el equipo del usuario **sin consumir almacenamiento en el servidor**.

### 3.8 Módulo de Informes y Métricas (`js/modules/reports.js`)
* **Propósito:** Cumplir el requerimiento **RF-11**.
* **Funciones Destacadas:**
  - `render()`: Actualiza los contadores del Dashboard (total rescatados, en adopción, tasa de éxito) y dibuja barras de porcentaje de gastos por categoría.
  - `renderFilteredReport()`: Aplica período, estado y categoría, y construye el resumen y detalle de gastos resultante.
  - `printReport()`: Formatea la vista para generar un reporte ejecutivo imprimible o exportable en PDF.

---

## 4. 🎮 Controlador Principal y Enrutador (`js/app.js`)

* **Navegación SPA:** La función `navigateTo(sectionId)` oculta las secciones inactivas y muestra la sección solicitada sin recargar la página, refrescando los datos en pantalla automáticamente.
* **Sesión Autenticada (RF-01 local):** `AuthModule` entrega a `App` la identidad autenticada. Cambiar de Presidenta a Tesorera exige cerrar sesión y volver a ingresar con la contraseña correspondiente.
* **Navegación móvil:** `bindMobileMenu()` abre y cierra el panel lateral con estado accesible `aria-expanded`.
* **Notificaciones Flotantes (Toast):** `showNotification(msg)` provee retroalimentación visual al usuario cada vez que se crea o actualiza un registro.
* **Gestión de Respaldos:**
  - `exportBackupJSON()`: Genera un archivo `.json` con todas las tablas del sistema para guardarlo como copia de seguridad.
  - `handleImportBackup(event)`: Lee y valida un archivo JSON de respaldo, restaurando la base de datos de manera instantánea.

---

## 5. 🗄️ Esquema Relacional de Base de Datos (`supabase_schema.sql`)

* **Compatibilidad PostgreSQL:** Define las entidades operativas, `usuarios_autorizados` y la relación normalizada `gasto_animales`.
* **Seguridad RLS:** `es_usuario_autorizado()` comprueba que `auth.uid()` corresponda a una cuenta activa de la Fundación. Las políticas aplican `USING` y `WITH CHECK`.
* **Integridad Referencial:** Los gastos se relacionan mediante una tabla con claves foráneas y los documentos pueden apuntar a animales, adopciones o gastos.
* **Estado:** El esquema está preparado, pero aún no ha sido ejecutado ni conectado al frontend.

---

## 6. 🎨 Diseño y Experiencia de Usuario (`index.css`)

* **Enfoque Glassmorphism:** Fondo oscuro moderno con capas translúcidas difuminadas (`backdrop-filter: blur(16px)`), gradientes en violeta e índigo, y elementos interactivos con micro-animaciones al posar el cursor (`hover`).
* **Responsividad:** CSS Grid, Flexbox y menú lateral móvil desplegable, verificado a 390 px sin desbordamiento horizontal.
* **Accesibilidad y Legibilidad:** Tipografías del sistema, etiquetas asociadas a controles y navegación móvil con atributos accesibles. No depende de fuentes remotas.
* **Estilos de Impresión (`@media print`):** Oculta barras de navegación y controles de acción para generar reportes ejecutivos limpios en papel o PDF.
