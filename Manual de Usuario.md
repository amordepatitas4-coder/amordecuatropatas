# Manual de Usuario — Fundación Amor de Cuatro Patas
## Sistema Web de Gestión de Rescate y Adopción Animal

> **Bienvenidas:** Este manual fue elaborado especialmente para la **Presidenta y la Tesorera** de la Fundación Amor de Cuatro Patas. Su propósito es guiarlas paso a paso en el uso diario del sistema con explicaciones claras, amigables y libres de tecnicismos.

---

## 📑 Índice de Contenidos
1. [¿Cómo ingresar al sistema?](#1-cómo-ingresar-al-sistema)
2. [El Panel Principal (Dashboard)](#2-el-panel-principal-dashboard)
3. [Gestión de Fichas de Animales y Ahorro de Espacio](#3-gestión-de-fichas-de-animales-y-ahorro-de-espacio)
4. [Historial Sanitario y Atenciones Médicas](#4-historial-sanitario-y-atenciones-médicas)
5. [Hogares Temporales y Familias de Paso](#5-hogares-temporales-y-familias-de-paso)
6. [Adopciones, Cuestionario Digital y Seguimiento](#6-adopciones-cuestionario-digital-y-seguimiento)
7. [Operativos de Esterilización Masiva](#7-operativos-de-esterilización-masiva)
8. [Control de Gastos y Rendiciones](#8-control-de-gastos-y-rendiciones)
9. [Difusión Local y Generador de Flyers](#9-difusión-local-y-generador-de-flyers)
10. [Documentos Digitales en Google Drive](#10-documentos-digitales-en-google-drive)
11. [Informes y filtros](#11-informes-y-filtros)
12. [Cerrar sesión y respaldar datos](#12-cerrar-sesión-y-respaldar-datos)

---

## 1. ¿Cómo ingresar al sistema?
1. Abre tu navegador de internet favorito (Google Chrome, Microsoft Edge, Safari o Firefox).
2. Abre el archivo `index.html` del sistema en tu computador o ingresa al enlace web del proyecto.
3. En el primer uso aparecerá **Configuración inicial**. Crea una contraseña para la Presidenta y otra diferente para la Tesorera. Cada contraseña debe tener al menos 10 caracteres.
4. Después selecciona tu cargo, escribe tu contraseña y presiona **Ingresar**.
5. En la parte superior derecha verás la cuenta activa. Ambas cuentas tienen acceso completo, pero para cambiar de usuaria es obligatorio cerrar sesión e ingresar con la otra contraseña.

> **Importante:** Las contraseñas no pueden recuperarse desde la pantalla. Antes de ingresar datos reales, la Fundación debe conservarlas en un administrador de contraseñas. Esta protección corresponde a la etapa local; la conexión futura utilizará Supabase Auth.

---

## 2. El Panel Principal (Dashboard)
Al ingresar, lo primero que verás es una pantalla resumen con los números más importantes de la Fundación:
* **Total Animales Registrados:** Cantidad histórica de mascotas que han pasado por la Fundación.
* **Disponibles para Adopción:** Animales sanos, esterilizados y listos para encontrar un hogar definitivo.
* **Mascotas Adoptadas:** Casos de éxito que ya están con sus familias.
* **En Tratamiento / Cuarentena:** Animales que requieren cuidados veterinarios especiales antes de difundirse.
* **En Hogares Temporales:** Mascotas hospedadas con familias de acogida.
* **Inversión en Rescates:** El dinero total invertido en atenciones, comida e insumos.

---

## 3. Gestión de Fichas de Animales

### 🐾 ¿Cómo registrar un nuevo rescate?
1. En el menú de la izquierda, haz clic en **"Fichas de Animales"**.
2. Presiona el botón morado **"➕ Registrar Rescate"**.
3. Completa los datos:
   - Nombre de la mascota, especie (perro o gato), raza, sexo, edad aproximada y peso.
   - Estado inicial (generalmente *Rescate Inicial* o *Cuarentena*).
   - Enlace a su foto principal y enlace a su carpeta de Google Drive (opcional).
   - Escribe brevemente su historia de rescate y su carácter (si es tranquilo con niños, juguetón, etc.).
4. Presiona **"Guardar Ficha"**.

### 📋 ¿Cómo ver la historia completa de un animal (Ficha Integral)?
En la tarjeta de cualquier animal, haz clic en **"📋 Ver Ficha Integral"**. Se abrirá una ventana con pestañas:
* **Antecedentes:** Su historia y su hogar temporal actual.
* **Historial Sanitario:** Todas sus vacunas, desparasitaciones y cirugías ordenadas por fecha.
* **Hogares Temporales:** Por qué casas ha pasado y en qué fechas.
* **Adopción y Seguimiento:** Si ya fue adoptado, quién se lo llevó y cómo le ha ido.
* **Gastos:** Cuánto dinero exacto ha invertido la Fundación en esta mascota.
* **Trazabilidad:** La línea de tiempo desde que fue rescatado hasta hoy.

### 🧹 ¿Cómo liberar espacio en animales ya adoptados?
Cuando un animal ya fue adoptado definitivamente, sus fotos operativas ya no necesitan estar cargadas en la memoria activa del sistema:
* En la tarjeta del animal adoptado (o dentro de su Ficha Integral) verás el botón ámbar **"🧹 Liberar Fotos"**.
* Al hacer clic, el sistema elimina las imágenes operativas temporales para ahorrar espacio en el servidor, **pero conserva el 100% de la ficha médica, contrato de adopción, historial de hogares y enlaces a su carpeta de Google Drive**.

> **Regla de Oro:** Los animales **nunca se borran** del sistema, incluso después de ser adoptados. De esta forma la Fundación siempre conserva sus antecedentes para reportes y estadísticas.

---

## 4. Historial Sanitario y Atenciones Médicas

### 🩺 ¿Cómo registrar una vacuna o control veterinario?
1. Ve a la sección **"Historial Sanitario"** o entra a la ficha del animal.
2. Haz clic en **"➕ Registrar Atención Médica"**.
3. Selecciona la mascota atendida.
4. Elige el tipo de evento: *Vacunación*, *Desparasitación*, *Esterilización*, *Control Veterinario* o *Tratamiento*.
5. Escribe el nombre del veterinario o clínica, la fecha y la descripción (por ejemplo: *"Vacuna Óctuple dosis 1"*).
6. Si corresponde, indica la fecha de su **Próximo Control** para que el sistema te recuerde cuándo le toca la siguiente dosis.
7. Presiona **"Registrar en Ficha"**.

---

## 5. Hogares Temporales y Familias de Paso

### 🏡 ¿Cómo agregar un nuevo hogar de paso?
1. Ve a **"Hogares Temporales"** en el menú.
2. Haz clic en **"➕ Registrar Nuevo Hogar"**.
3. Ingresa el nombre del cuidador(a), teléfono, dirección, tipo de vivienda (casa con patio, departamento) y cuántos animales puede recibir a la vez.
4. Guarda el registro.

### 🔄 ¿Cómo hospedar a una mascota en un hogar?
1. En la tarjeta del hogar temporal, haz clic en **"➕ Hospedar Mascota"**.
2. Selecciona qué animal vas a trasladar y escribe notas de entrega (ej. *"Llevar 5 kg de alimento y collar"*).
3. Confirma la asignación. El sistema automáticamente anotará la fecha de llegada y cerrará su estancia en el hogar anterior.

---

## 6. Adopciones, Cuestionario Digital y Seguimiento

### 📝 Evaluar a un interesado (Cuestionario Digital)
Antes de entregar un animal, puedes evaluar a la persona con el cuestionario oficial:
1. Ve a **"Adopciones y Seguimiento"** y presiona **"📝 Evaluar Postulación (Cuestionario)"**.
2. Pregúntale sus datos y responde las preguntas de vivienda (¿tiene mallas?), rutina (¿cuántas horas estará sola la mascota?) y compromiso veterinario.
3. Haz clic en **"Evaluar y Guardar Postulación"**.
4. El sistema calculará automáticamente un puntaje sobre 100:
   - **80 a 100 puntos:** Postulación Aprobada (cumple con tenencia responsable).
   - **60 a 79 puntos:** Requiere Entrevista personal.
   - **Menos de 60 puntos:** No recomendada por condiciones desfavorables.
5. Si fue aprobada, el sistema te ofrecerá formalizar la adopción de inmediato.

### 🤝 Formalizar una Adopción
1. Haz clic en **"🤝 Concretar Adopción"**.
2. Selecciona la mascota y los datos del adoptante (nombre, RUT, teléfono, dirección).
3. Ingresa el número de folio del contrato firmado (ej. *CONTRATO-2026-004*).
4. Al guardar, el animal pasará automáticamente al estado de **Adoptado**.

### 📞 Registrar un Seguimiento Post-Adopción
1. En la lista de adopciones, haz clic en el botón **"📝 + Seguimiento"**.
2. Indica la fecha, el medio de contacto (*WhatsApp/Fotos*, *Llamada*, *Visita*) y el estado del animal (*Excelente*, *En Adaptación*, etc.).
3. Escribe lo conversado (ej. *"El adoptante envió fotos durmiendo en su camita. Se le nota muy feliz"*).
4. Guarda el seguimiento para que quede en el historial permanente de la mascota.

---

## 7. Operativos de Esterilización Masiva

Este módulo está destinado a las campañas comunitarias en terreno para animales comunitarios o callejeros (protocolo de captura, esterilización y retorno). 

> **Regla importante:** Los animales atendidos en operativos masivos **no son animales rescatados para adopción** y no ocupan cupos en los hogares temporales.

### 📋 ¿Cómo planificar un nuevo operativo?
1. En el menú lateral, haz clic en **"✂️ Esterilización Masiva"**.
2. Presiona el botón blanco **"➕ Planificar Nuevo Operativo"**.
3. Ingresa el nombre de la campaña (ej. *Operativo Comunitario Sector Norte*), el lugar o sede social, las fechas de inicio y término, el médico veterinario a cargo, la entidad que financia (ej. *Subdere / Fondos Municipales*) y la meta de animales proyectada.
4. Si tienes una carpeta en Google Drive para guardar los consentimientos en papel escaneados, pega el enlace en el campo correspondiente.
5. Presiona **"Guardar Operativo"**.

### ⚡ ¿Cómo ingresar pacientes en terreno (Modo Rápido)?
Durante la jornada de cirugías en la sede social o clínica móvil, puedes registrar a cada animal en segundos:
1. En la tarjeta del operativo, haz clic en **"📋 Ver Nómina y Modo Terreno"**.
2. En el recuadro superior verás el formulario de **Ingreso Rápido en Terreno**:
   - Selecciona especie (perro o gato) y sexo.
   - Escribe una descripción básica del animal (ej. *Quiltro barcino, orejas caídas*).
   - Ingresa el nombre del vecino o cuidador comunitario responsable y su teléfono.
   - Si se le implanta microchip durante la cirugía, escribe los 15 dígitos.
   - Elige el estado de salida: *Retornado a su sector*, *En observación* o *Derivado a rescate*.
3. Presiona **"💾 Registrar Paciente en Nómina"**. El contador y la barra de avance de meta se actualizarán de inmediato.

### 📥 ¿Cómo descargar la nómina para rendición de cuentas?
En la parte superior de la ventana del operativo, presiona **"📥 Exportar Nómina (Excel/CSV)"**. Se descargará una planilla completa con todos los pacientes, chips, tutores y diagnósticos lista para presentar ante la Municipalidad o Subdere.

---

## 8. Control de Gastos y Rendiciones

### 💰 ¿Cómo anotar un gasto?
1. Ve a **"Gestión de Gastos"** y haz clic en **"➕ Registrar Gasto"**.
2. Escribe la fecha, el monto en pesos chilenos y el concepto (ej. *"Compra de pipetas antipulgas"*).
3. Selecciona la categoría (*Veterinaria, Alimento, Medicamentos, Transporte o Insumos*).
4. Elige a quién corresponde:
   - **Asociado a un animal individual:** Por ejemplo, la ecografía de Luna.
   - **Compartido entre varios animales:** Por ejemplo, un saco de alimento para Luna y Rocky (el costo se repartirá entre ellos).
   - **Gasto General de la Fundación:** Por ejemplo, cloro y bolsas de basura.
5. Si tienes la foto de la boleta guardada en Google Drive, puedes pegar su enlace en el campo de comprobante.
6. Presiona **"Registrar Gasto"**.

### 🔎 ¿Cómo consultar gastos específicos?
En la barra superior del módulo puedes combinar categoría, fecha inicial, fecha final y animal. El total mostrado se recalcula con los registros que cumplen todos los filtros seleccionados.

---

## 9. Difusión Local y Generador de Flyers

### ✨ Generar un borrador local para redes sociales
1. Ve a **"✨ Difusión y Flyers"**.
2. En el panel izquierdo, selecciona la mascota que deseas publicar.
3. Elige el tono deseado:
   - **Emotivo y Tierno:** Historias conmovedoras para tocar el corazón de los adoptantes.
   - **Alegre y Juguetón:** Enfatiza la energía y diversión del animal.
   - **Informativo / Formal:** Datos clínicos directos y requisitos claros.
4. Elige el canal (*Instagram* o *Facebook/WhatsApp*) y haz clic en **"✨ Generar Borrador Local"**.
5. Lee el texto generado. Puedes editarlo o agregar lo que gustes y luego presionar **"📋 Copiar Texto"** para pegarlo en tus redes sociales.

> Esta versión utiliza plantillas locales y no está conectada a un proveedor de inteligencia artificial. La IA real se habilitará después de implementar Supabase Auth y un servicio seguro que mantenga la clave fuera del navegador.

### 🖼️ Generar y Descargar el Flyer Gráfico
1. En el panel derecho verás el afiche prediseñado con la foto real de la mascota.
2. Puedes cambiar la plantilla en el menú desplegable:
   - 🎨 **Estilo Institucional:** Colores oficiales violeta e índigo.
   - 🚨 **Caso Urgente:** Franja de alerta roja para animales en riesgo o que necesitan hogar ya.
   - 💖 **Cachorro / Ternura:** Estilo pastel para bebés.
   - 💚 **Adopción Senior:** Estilo verde esmeralda para adultos mayores.
3. Ajusta el nombre o las cualidades si lo deseas y presiona **"⬇️ Descargar Flyer (PNG)"**.
4. La imagen se guardará en tu computador lista para subir a Instagram o WhatsApp sin ocupar espacio en la nube.

---

## 9. Documentos Digitales, Edición en Vivo e Impresión
1. Ve a **"📁 Documentos Digitales"**.
2. **Leer y Visualizar Documentos Oficiales:**
   - Haz clic en **"👁️ Ver y Leer Documento Oficial"** en cualquiera de las fichas:
     * *Formulario Oficial de Postulación (Ley N° 21.020):* Cuestionario exhaustivo de 15 dimensiones.
     * *Contrato Solemne de Adopción:* Cláusulas vinculantes con prohibición de reventa y auxilio de la fuerza pública.
     * *Protocolo Clínico de Triage e Ingreso:* Escala de Triage (Rojo, Amarillo, Verde), examen ECOG y cuarentena de 15 días.
3. **¿Cómo modificar el texto de los documentos si lo requieren?**
   - **Edición directa en pantalla:** Al abrir el documento, presiona el botón **"✏️ Editar Texto del Documento"**. Podrás hacer clic en cualquier párrafo, cláusula, nombre, teléfono o tabla para escribir o borrar lo que necesiten.
   - **Guardar cambios:** Presiona **"💾 Guardar Cambios"** y tu versión modificada quedará guardada permanentemente en la base de datos de la Fundación.
   - **Restaurar original:** Si en algún momento deseas recuperar la redacción original de la plantilla estándar, presiona **"🔄 Restaurar Plantilla Original"**.
4. **Modificar datos de la ficha o vincular Google Drive:**
   - En la tarjeta del documento, presiona **"✏️ Modificar Ficha"** para cambiar el título, la descripción o pegar un enlace a un archivo editable en Google Docs / Google Drive.
   - En **Relacionar con**, selecciona Gestión general, Animal, Adopción o Gasto. Si eliges un registro, el documento quedará identificado con esa relación y podrás filtrarlo desde el repositorio.
5. **Impresión y Descarga en PDF:**
   - Presiona **"🖨️ Imprimir / Guardar en PDF"** para abrir la ventana de impresión limpia y sin márgenes innecesarios.
   - Presiona **"✓ Aceptar y Validar Documento"** para confirmar la conformidad institucional del archivo.

---

## 10. Informes y filtros
1. Ve a **"📈 Informes y Métricas"**.
2. Filtra por fecha inicial, fecha final, estado del animal y categoría de gasto.
3. Revisa la cantidad de animales y el total de gastos resultante, además del detalle del período.
4. Presiona **"🖨️ Imprimir / Guardar en PDF"** si necesitas conservar el informe.

---

## 11. Cerrar sesión y respaldar datos
Para cerrar el acceso, presiona el botón `↪` ubicado junto al nombre de la usuaria. La sesión también se cierra automáticamente después de 30 minutos sin actividad.

Para asegurar que nunca pierdas información ante cualquier eventualidad:
1. En la barra lateral izquierda, al final del menú, presiona **"💾 Exportar Respaldo JSON"**.
2. Se descargará a tu computador un archivo con toda la base de datos completa. Te recomendamos hacer esto una vez por semana.
3. Si en algún momento cambias de computador, solo debes presionar **"📥 Importar Respaldo JSON"** y seleccionar ese archivo para restaurar todos tus datos al instante.
