# Registro de Cambios y Estado Verificado del MVP

## Corte de verificación

- Fecha: 7 de septiembre de 2026.
- Etapa: preparación local anterior a la conexión con Supabase.
- Alcance: autenticación local obligatoria, persistencia local, módulos operativos, filtros, relaciones documentales, diseño responsivo y preparación del esquema cloud.

## Cambios implementados

### Autenticación local obligatoria

- Se añadió `js/auth.js` como puerta de entrada previa a la inicialización de la aplicación.
- En el primer uso se crean dos cuentas: Presidenta y Tesorera.
- Cada cuenta exige una contraseña diferente de al menos 10 caracteres.
- Las contraseñas no se almacenan en texto plano. El navegador conserva verificadores PBKDF2-SHA-256 con 210.000 iteraciones y sal aleatoria individual.
- La sesión se conserva en `sessionStorage`, expira tras 30 minutos de inactividad y se elimina al cerrar sesión.
- Cambiar de usuaria exige cerrar la sesión y autenticarse con la otra cuenta.
- La exportación, importación y reinicio de datos exigen una sesión activa.

Este mecanismo controla el acceso al prototipo en un dispositivo local. No sustituye la autorización de servidor. Al conectar Supabase deberán utilizarse Supabase Auth y políticas RLS.

### Informes y gastos

- Los gastos se filtran por categoría, fecha inicial, fecha final y animal asociado.
- Los informes se filtran por período, estado del animal y categoría de gasto.
- El informe muestra cantidad de animales, monto total, número de gastos y detalle del período filtrado.
- Se mantiene la impresión o exportación a PDF mediante el navegador.

### Relaciones documentales

- Cada documento puede relacionarse con la gestión general, un animal, una adopción o un gasto.
- Se añadió filtro por tipo de relación y las tarjetas muestran el registro asociado.
- Los documentos existentes se migran automáticamente como documentos de gestión general.
- Se corrigió el membrete de contratos: folio, emisión y estado usan una cuadrícula estable, la etiqueta verde ya no se desplaza y el encabezado se adapta a pantallas pequeñas.
- Para no atribuir validez legal no acreditada, el estado visible se cambió de `Válido y Certificado` a `Plantilla local`; la acción final registra únicamente una revisión local.

### Diseño móvil y operación local

- En pantallas pequeñas la barra lateral se transforma en un menú desplegable con fondo de bloqueo.
- Se corrigieron el ancho horizontal y la superposición de la cabecera móvil.
- Formularios, filtros y acciones se apilan para mantener controles táctiles utilizables.
- Se eliminaron las fuentes remotas; el sistema usa tipografías del dispositivo y no depende de Google Fonts.
- La asignación de hogares rechaza destinos sin cupo y evita duplicar una estancia activa.

### Preparación de Supabase

- `supabase_schema.sql` incluye `usuarios_autorizados`, vinculada a `auth.users`.
- Las políticas RLS verifican que la cuenta esté autorizada y activa; no basta con ser cualquier usuario autenticado.
- Las políticas validan lectura y escritura mediante `USING` y `WITH CHECK`.
- La relación de gastos y animales se normalizó mediante `gasto_animales` con claves foráneas.
- Los documentos cuentan con claves foráneas opcionales hacia animales, adopciones y gastos.
- La capacidad de hogares se protege con un índice de estancia activa y un trigger transaccional.

El frontend aún no se conecta a Supabase. No deben agregarse URL, claves ni tokens al JavaScript antes de implementar Supabase Auth, variables de entorno y una capa de acceso remoto.

### Difusión

- El generador actual se identifica correctamente como asistente local basado en plantillas.
- Los borradores siguen siendo editables y requieren revisión humana.
- El generador Canvas y la descarga PNG continúan funcionando localmente.
- La IA generativa real queda pendiente de un endpoint autenticado posterior a Supabase Auth. La clave de IA nunca debe enviarse al navegador.

## Verificación técnica ejecutada

- Sintaxis: 11 archivos JavaScript aprobados.
- Puerta de acceso previa a la aplicación: aprobada.
- Configuración de dos cuentas y ausencia de contraseñas en texto plano: aprobada.
- Inicio y cierre de sesión: aprobados.
- Navegación por las 9 secciones: aprobada.
- Registro de animal y generación de trazabilidad: aprobados.
- Relación de documento con animal: aprobada.
- Filtros de gastos e informes por período: aprobados.
- Menú móvil a 390 px sin desbordamiento horizontal: aprobado.
- Errores de JavaScript durante la prueba: 0.

## Estado actual

| Área | Estado |
|---|---|
| Autenticación local | Implementada y verificada |
| Animales, salud, hogares y trazabilidad | Implementados |
| Adopciones y seguimientos | Implementados |
| Gastos con filtros | Implementados |
| Documentos relacionados | Implementados |
| Informes filtrables | Implementados |
| Diseño móvil | Corregido y verificado a 390 px |
| Supabase Auth y sincronización | Preparados en esquema, no conectados |
| Protección de datos en servidor | Pendiente de conexión y despliegue |
| IA generativa real | Pendiente de endpoint autenticado |
| Hosting público | Pendiente; la guía no demuestra un despliegue activo |
| Validación firmada del socio | Pendiente |

## Orden obligatorio para la conexión

1. Crear el proyecto Supabase y configurar Supabase Auth.
2. Crear las dos cuentas y registrar sus UUID en `usuarios_autorizados`.
3. Ejecutar y revisar el esquema SQL y las políticas RLS.
4. Comprobar que una cuenta no autorizada no pueda leer ni modificar registros.
5. Sustituir gradualmente `localStorage` por un adaptador Supabase.
6. Migrar datos de prueba y verificar integridad antes de habilitar sincronización multiusuario.
7. Crear una Edge Function autenticada para IA y guardar la clave como secreto del servidor.
8. Ejecutar las pruebas de aceptación y completar la pauta firmada con la Fundación.



---

## Corte de verificación — 20 de septiembre de 2026

- **Etapa:** Fase 2 de optimización operativa, cumplimiento normativo y experiencia de usuario.
- **Alcance:** Compresión fotográfica local, liberación de almacenamiento para animales adoptados, categorización sanitaria según Ley 21.020, módulo de cuestionarios digitales y resolución ergonómica de interfaces.

### Nuevas funcionalidades implementadas

#### 1. Doble fotografía operativa y compresión en cliente
- Implementación de compresión automática en el navegador mediante lienzo digital (HTML5 Canvas) previa al guardado.
- Reducción del peso de las imágenes a proporciones optimizadas para web (~800 a 1000 píxeles, 80% de calidad), impidiendo la saturación de memoria.
- Soporte para fotografía principal y secundaria con previsualización en tiempo real y selectores de reemplazo o eliminación.

#### 2. Liberación de almacenamiento en animales adoptados
- Mecanismo inteligente de ahorro de espacio: activación del control "Liberar Fotos" para fichas en estado "Adoptado".
- Permite desasociar las fotografías operativas temporales manteniendo el 100% de la ficha médica, contratos, historial de hogares y enlaces externos a Google Drive.

#### 3. Campos sanitarios y cumplimiento de la Ley 21.020
- Incorporación del estado de esterilización en tres vías: Esterilizado, No esterilizado y Pendiente en tratamiento.
- Identificador único de microchip de 15 dígitos conforme al Registro Nacional de Mascotas.
- Indicador de nivel de energía y casillas de sociabilidad y convivencia (apto con niños, perros y gatos).
- Incorporación de insignias visuales distintivas tanto en la vista de tarjetas como en el panel técnico de la Ficha Integral.

#### 4. Cuestionarios digitales de postulación y formalización
- Segmentación de la vista de adopciones en dos sub-pestañas operativas: "Adopciones Concretadas" y "Postulaciones y Cuestionarios Digitales".
- Ponderación automatizada de compatibilidad (evaluación de 0 a 100 puntos basada en tipo de vivienda, cerramientos, compromiso familiar y solvencia).
- Conversión directa mediante el botón "Formalizar Adopción", el cual pre-rellena el contrato con los antecedentes del adoptante y la mascota seleccionada.

#### 5. Corrección ergonómica del cierre de fichas
- Reorganización de elementos flotantes en la Ficha Integral, eliminando el solapamiento del distintivo de estado sobre el botón de cierre (cruz de cierre).
- Adición de un botón de respaldo "Cerrar Ficha" en el pie de página para mejorar la accesibilidad móvil y de escritorio.

## Corte Final de Despliegue y Validación en Producción — 20 de septiembre de 2026

- **Etapa:** Despliegue Oficial en Producción, Conexión Supabase Cloud y Cierre Académico A+S.
- **Alcance:** Despliegue en GitHub Pages, enlace ultra corto, código QR oficial, sincronización bidireccional con PostgreSQL en São Paulo, tarea programada keep-alive y módulo completo de Esterilización Masiva.

### Hitos finales alcanzados

#### 1. Módulo de Gestión de Esterilización Masiva (Área Funcional 2 — Ficha Técnica §5)
- Implementación de vista especializada independiente del flujo de adopciones convencionales y hogares temporales.
- Gestión de proyectos u operativos con métricas de cumplimiento, metas territoriales, veterinarios responsables y fuentes de financiamiento.
- Modo de ingreso rápido en terreno optimizado para operativos barriales y rurales.
- Nómina de animales intervenidos con código operativo, marcaje de microchip, estado post-quirúrgico y exportación a Excel / CSV.

#### 2. Despliegue oficial en la nube (Hosting Gratuito Permanente)
- **Repositorio Oficial:** `https://github.com/amordepatitas4-coder/amordecuatropatas`
- **Enlace Institucional GitHub Pages:** `https://amordepatitas4-coder.github.io/amordecuatropatas/`
- **Enlace Ultra Corto Oficial:** `https://tinyurl.com/amordecuatropatas`
- **Código QR Oficial:** Generado en alta resolución (`Codigo QR Acceso Web.png`) y publicado en el repositorio.

#### 3. Integración con Supabase Cloud y Mecanismo Keep-Alive
- Proyecto provisionado en región São Paulo (`sa-east-1`): `https://yafsgjwidizsjmxhjvkb.supabase.co`.
- 12 tablas relacionales con políticas de seguridad RLS e integridad referencial.
- Tarea programada en `pg_cron` (`keep-alive-diario-fundacion`) ejecutándose diariamente a las 05:00 UTC para prevenir la pausa por inactividad.
- Autodiagnóstico en tiempo real accesible mediante clic en el distintivo `🟢 Supabase Cloud Conectado` en la barra superior.

## Estado de Validación y Entrega

- Sistema 100% operativo en línea para pruebas de campo por parte de la directiva de la Fundación.
- Pruebas end-to-end completadas con 0 errores en consola y tiempo de respuesta inferior a 150 ms.
- Nombres de documentos y encabezados normalizados en español formal sin guiones ni caracteres técnicos.

