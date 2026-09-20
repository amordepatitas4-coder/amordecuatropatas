# Plan y Matriz de Pruebas Funcionales
## Sistema Web de Gestión — Fundación Amor de Cuatro Patas (Proyecto A+S)

> **Tipo de Documento:** Aseguramiento de Calidad y Verificación de Requerimientos de Software.  
> **Versión:** 1.0 (MVP)  
> **Responsable:** Equipo de Desarrollo A+S.

---

## 1. 🎯 Objetivos y Alcance de las Pruebas

El objetivo de este plan de pruebas es verificar y validar el correcto funcionamiento de todos los requerimientos funcionales (**RF-01 a RF-13**) y no funcionales (**RNF-01 a RNF-12**) del sistema web desarrollado para la Fundación Amor de Cuatro Patas, garantizando la integridad de los datos, la trazabilidad histórica de los animales y una experiencia de usuario fluida y libre de errores.

---

## 2. 💻 Entorno de Pruebas

* **Navegador automatizado verificado:** Google Chrome instalado en el equipo de desarrollo.
* **Tamaños automatizados verificados:** Escritorio 1440x1000 y teléfono 390x844.
* **Pendiente:** Repetir la matriz en Edge, Firefox y Safari físico antes de declarar compatibilidad completa.
* **Motor de Datos:** LocalStorage Data Access Layer con compatibilidad de esquema PostgreSQL / Supabase.
* **Tiempo de Ejecución:** Pruebas funcionales de extremo a extremo (E2E).

---

## 3. 🧪 Matriz de Casos de Prueba (RF-01 a RF-13)

### CP-01: Autenticación y Sesión de Usuarias (RF-01)
* **Objetivo:** Verificar que la aplicación permanezca bloqueada sin sesión y que Presidenta y Tesorera accedan únicamente con su contraseña.
* **Pasos:**
  1. Cargar la aplicación sin configuración previa y verificar que el contenido permanezca oculto.
  2. Crear contraseñas diferentes para Presidenta y Tesorera.
  3. Iniciar sesión con la Presidenta y verificar su identidad en la cabecera.
  4. Cerrar sesión y comprobar que el contenido vuelva a quedar oculto.
  5. Confirmar que el almacenamiento de cuentas no contenga las contraseñas en texto plano.
* **Resultado Esperado:** Dos cuentas configuradas, sesión válida en `sessionStorage`, verificadores PBKDF2 en `localStorage` y cierre efectivo.
* **Estado:** ✅ **Aprobado**

---

### CP-02: Registro y Consulta de Ficha de Animal (RF-02)
* **Objetivo:** Comprobar la creación de un nuevo rescate y su disponibilidad inmediata en el catálogo.
* **Pasos:**
  1. Ir a la sección *"Fichas de Animales"*.
  2. Presionar *"➕ Registrar Rescate"*.
  3. Completar: Nombre = "Toby", Especie = "Canino", Raza = "Poodle", Sexo = "Macho", Edad = "2 años", Peso = 6.5 kg, Estado = "rescate".
  4. Presionar *"Guardar Ficha"*.
* **Resultado Esperado:** La tarjeta de "Toby" aparece en la grilla con badge ámbar *"Rescate Inicial"* y se incrementa el contador del Dashboard.
* **Estado:** ✅ **Aprobado**

---

### CP-03: Trazabilidad y Cambio de Estado sin Borrado (RF-03, RNF-06)
* **Objetivo:** Verificar que el cambio de estado de un animal preserve el historial cronológico y que el registro histórico nunca se destruya.
* **Pasos:**
  1. Abrir la Ficha Integral de "Luna".
  2. Ir a la pestaña *"Trazabilidad de Estados"*.
  3. Comprobar los registros históricos de Rescate y Cuarentena.
  4. Editar el animal y cambiar su estado a "adoptado".
* **Resultado Esperado:** El nuevo estado se añade a la línea de tiempo con fecha y observación, conservando intactos todos los registros previos.
* **Estado:** ✅ **Aprobado**

---

### CP-04: Historial Sanitario Cronológico (RF-04)
* **Objetivo:** Validar el registro de eventos médicos múltiples (vacuna, desparasitación, esterilización) por animal.
* **Pasos:**
  1. Ir a *"Historial Sanitario"* y presionar *"➕ Registrar Atención Médica"*.
  2. Seleccionar animal "Luna", Tipo = "Vacunación", Fecha = Hoy, Procedimiento = "Vacuna Antirrábica Anual", Veterinario = "Dr. Soto", Próximo Control = Fecha en 1 año.
  3. Guardar atención.
* **Resultado Esperado:** El evento aparece en la tabla general de salud y en la pestaña *"Historial Sanitario"* de la ficha de Luna con la alerta de próximo control.
* **Estado:** ✅ **Aprobado**

---

### CP-05: Asignación y Traslado en Hogares Temporales (RF-05)
* **Objetivo:** Comprobar la gestión de capacidad y el registro de fecha de entrada y salida entre hogares de paso.
* **Pasos:**
  1. Ir a *"Hogares Temporales"*.
  2. Verificar que el hogar de "Carlos Sepúlveda" tiene a "Rocky" como ocupante activo.
  3. Asignar a "Luna" a un nuevo hogar temporal.
* **Resultado Esperado:** El contador de ocupantes del hogar aumenta, se genera un registro en la tabla de estancias y el estado de la mascota se actualiza a *"Hogar Temporal"*.
* **Estado:** ✅ **Aprobado**

---

### CP-06: Gestión Multimedia Híbrida (RF-06)
* **Objetivo:** Verificar la visualización de fotos operativas y el acceso a carpetas pesadas en Google Drive.
* **Pasos:**
  1. Ingresar una URL de imagen válida en el campo de fotografía de la ficha.
  2. Ingresar una URL de carpeta de Google Drive en el campo correspondiente.
  3. Abrir la Ficha Integral.
* **Resultado Esperado:** La fotografía se renderiza correctamente en la tarjeta y ficha, y el enlace externo a Google Drive abre la carpeta en una nueva pestaña.
* **Estado:** ✅ **Aprobado**

---

### CP-07: Evaluación con Cuestionario y Concreción de Adopción (RF-07)
* **Objetivo:** Validar el algoritmo de calificación de postulación y la formalización del contrato.
* **Pasos:**
  1. Ir a *"Adopciones"* y presionar *"📝 Evaluar Postulación (Cuestionario)"*.
  2. Seleccionar vivienda con patio, departamento con mallas y solvencia completa.
  3. Presionar *"Evaluar y Guardar Postulación"*.
  4. Confirmar formalización de adopción.
* **Resultado Esperado:** El sistema calcula puntaje >= 80, notifica postulación aprobada, pre-rellena el contrato con los datos del adoptante y cambia el estado de la mascota a *"Adoptado"*.
* **Estado:** ✅ **Aprobado**

---

### CP-08: Bitácora de Seguimiento Post-Adopción (RF-08)
* **Objetivo:** Verificar la adición acumulativa de seguimientos sin sobreescritura.
* **Pasos:**
  1. En la lista de adopciones, hacer clic en *"📝 + Seguimiento"* para la adopción de Mimi.
  2. Ingresar Medio = "WhatsApp / Fotos", Estado = "Excelente", Observación = "Mascota adaptada al 100%".
  3. Guardar y abrir la ficha de Mimi.
* **Resultado Esperado:** El nuevo seguimiento se agrega a la línea de tiempo junto a los seguimientos anteriores de agosto y septiembre, sin borrar ninguno.
* **Estado:** ✅ **Aprobado**

---

### CP-09: Imputación y Prorrateo de Gastos (RF-09)
* **Objetivo:** Validar los tres tipos de asignación financiera (animal único, compartido y general).
* **Pasos:**
  1. Registrar un gasto de $40.000 asignado exclusivamente a "Rocky".
  2. Registrar un gasto de $50.000 de alimento compartido entre "Luna" y "Rocky".
  3. Consultar la Ficha Integral de Rocky.
* **Resultado Esperado:** La ficha de Rocky refleja un total gastado de $65.000 ($40.000 propios + $25.000 de su mitad del saco de alimento). El gasto general se computa en el total de la Fundación.
* **Estado:** ✅ **Aprobado**

---

### CP-10: Repositorio de Documentos Digitales (RF-10)
* **Objetivo:** Comprobar la categorización y consulta de documentos oficiales.
* **Pasos:**
  1. Ir a *"Documentos Digitales"*.
  2. Filtrar por *"Formularios de Adopción"*.
  3. Hacer clic en *"Abrir Documento en Google Drive"*.
* **Resultado Esperado:** La grilla muestra únicamente los formularios y el enlace abre el recurso en la nube de Google Drive.
* **Estado:** ✅ **Aprobado**

---

### CP-11: Métricas en Tiempo Real e Impresión de Reportes (RF-11)
* **Objetivo:** Validar el cálculo de porcentajes y el formato de salida imprimible.
* **Pasos:**
  1. Ir a *"Informes y Métricas"*.
  2. Verificar que la tasa de adopción se calcula como (Adoptados / Total Rescatados) * 100.
  3. Hacer clic en *"🖨️ Imprimir / Guardar en PDF"*.
* **Resultado Esperado:** La ventana de impresión del navegador se activa con estilos `@media print` limpios, sin barras de menú ni botones.
* **Estado:** ✅ **Aprobado**

---

### CP-12: Borradores Locales y Generación de Flyers en Canvas (Preparación RF-12)
* **Objetivo:** Probar las plantillas locales editables y el renderizado gráfico de flyers con descarga local en PNG.
* **Pasos:**
  1. Ir a *"Difusión y Flyers"*.
  2. Seleccionar animal "Luna", tono "Emotivo" y presionar *"✨ Generar Borrador Local"*.
  3. Modificar el texto generado en la caja de texto (revisión humana).
  4. Cambiar el tema gráfico a *"🚨 Caso Urgente"*.
  5. Presionar *"⬇️ Descargar Flyer (PNG)"*.
* **Resultado Esperado:** El texto local se construye con los datos de Luna, el canvas se redibuja y se descarga `flyer_adopcion_luna.png`.
* **Estado:** ⚠️ **Aprobado para modo local; IA generativa real pendiente de endpoint autenticado.**

---

### CP-13: Exportación e Importación de Respaldos JSON (RNF-06, RNF-12)
* **Objetivo:** Asegurar la portabilidad y recuperación total de datos sin pérdida.
* **Pasos:**
  1. Presionar *"💾 Exportar Respaldo JSON"*.
  2. Modificar registros o agregar un nuevo animal de prueba.
  3. Presionar *"📥 Importar Respaldo JSON"* y seleccionar el archivo descargado en el paso 1.
* **Resultado Esperado:** La base de datos se restaura a su estado original de forma inmediata y consistente.
* **Estado:** ✅ **Aprobado**

---

## 4. Pruebas adicionales de cierre previo a conexión

| ID | Verificación | Resultado |
|---|---|---|
| CP-14 | Aplicación oculta antes del inicio de sesión | Aprobado |
| CP-15 | Dos cuentas y contraseñas no almacenadas en texto plano | Aprobado |
| CP-16 | Filtros de gastos e informes por período | Aprobado |
| CP-17 | Documento relacionado con un animal y filtro por relación | Aprobado |
| CP-18 | Menú móvil a 390 px y ausencia de desbordamiento horizontal | Aprobado |
| CP-19 | Rechazo de asignación a hogar sin cupo | Implementado localmente; integración PostgreSQL pendiente |
| CP-20 | Alineación del estado en membrete de contratos | Corregido en escritorio y regla responsiva incorporada |
| CP-21 | Módulo de Esterilización Masiva: creación de operativo, modo terreno y exportación | Aprobado (aislado de hogares temporales y nómina descargable en CSV) |
| CP-22 | Compresión Canvas en cliente y liberación de fotos operativas en adoptados | Aprobado (imágenes reducidas a ~150KB y liberación sin pérdida clínica) |
| CP-23 | Cuestionario Digital de Adopción y formalización automática | Aprobado (evaluación 0-100 pts y conversión pre-rellenada) |
| CP-24 | Rutina Diaria de Disponibilidad (Keep-Alive de Base de Datos) | Aprobado (flujo GitHub Actions y tarea pg_cron configurados) |

La automatización recorrió las diez secciones, creó un animal temporal, comprobó eventos de trazabilidad, aplicó filtros, vinculó un documento, abrió el menú móvil, probó la nómina de esterilización masiva y cerró la sesión. No se detectaron errores JavaScript.

CP-19 cuenta con validación defensiva en `db.js`; `supabase_schema.sql` replica la regla mediante un índice único y un trigger transaccional. La prueba concurrente contra PostgreSQL debe ejecutarse al realizar la conexión.

CP-20 comprueba que el folio, la fecha y la etiqueta de estado permanezcan dentro de la columna del membrete. La etiqueta se define como `Plantilla local` hasta que exista una validación formal verificable.

---

## 5. 📊 Resumen de Resultados de Calidad

* **Pruebas automatizadas de cierre previo a conexión:** aprobadas en Chrome, escritorio y 390 px.
* **Comprobación de sintaxis:** 11 / 11 archivos JavaScript aprobados.
* **Errores JavaScript durante la ejecución automatizada:** 0.
* **Pendientes que impiden declarar 100%:** Supabase Auth, persistencia cloud, IA generativa remota, pruebas reproducibles en otros navegadores, hosting público y validación firmada del socio.
* **Conclusión:** La versión local está preparada para iniciar la fase de conexión. No corresponde declarar cumplimiento productivo ni validación comunitaria hasta completar los pendientes anteriores.
