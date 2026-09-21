# INFORME FINAL DE PROYECTO DE INGENIERÍA DE SOFTWARE
## Sistema Web de Gestión de Rescate, Trazabilidad y Adopción Animal
### Metodología de Aprendizaje + Servicio (A+S)

---

**Institución de Educación Superior:** Facultad de Ingeniería / Escuela de Informática y Telecomunicaciones  
**Asignatura / Módulo:** Taller de Ingeniería de Software / Proyecto Social A+S  
**Socio Comunitario:** Fundación Amor de Cuatro Patas (Talca, Región del Maule, Chile)  
**Personalidad Jurídica:** N° 284.912 • RUT Institucional: 65.184.290-K  
**Usuarias Clave:** Presidenta de la Fundación y Tesorera de la Fundación  
**Duración del Proyecto:** 8 Semanas lectivas (Ciclo de Desarrollo: 6 semanas)  
**Versión del Producto:** 1.0 (Producto Mínimo Viable local, previo a conexión)  
**Fecha de Entrega:** Septiembre 2026  

---

## 📑 ÍNDICE GENERAL DEL INFORME

1. [Resumen Ejecutivo (Abstract)](#1-resumen-ejecutivo-abstract)
2. [Marco Contextual y Diagnóstico Situacional](#2-marco-contextual-y-diagnóstico-situacional)
   * 2.1 Contexto socio-ambiental y tenencia responsable en la Región del Maule
   * 2.2 Marco legal vigente: Ley N° 21.020, Código Penal y D.S. N° 1007
   * 2.3 Perfil institucional de la Fundación Amor de Cuatro Patas
   * 2.4 Diagnóstico operacional inicial y matriz FODA
3. [Planteamiento del Problema y Justificación A+S](#3-planteamiento-del-problema-y-justificación-as)
   * 3.1 Formulación de la problemática central (Árbol de causas y efectos)
   * 3.2 Fundamentación del modelo Aprendizaje + Servicio (A+S)
   * 3.3 Beneficiarios directos e indirectos de la solución
4. [Definición de Objetivos y Alcance](#4-definición-de-objetivos-y-alcance)
   * 4.1 Objetivo General
   * 4.2 Objetivos Específicos
   * 4.3 Alcance y delimitación técnica del MVP
5. [Ingeniería de Requerimientos](#5-ingeniería-de-requerimientos)
   * 5.1 Levantamiento de requerimientos y perfil de usuarias
   * 5.2 Matriz de Requerimientos Funcionales (RF-01 al RF-12)
   * 5.3 Matriz de Requerimientos No Funcionales (RNF-01 al RNF-08)
6. [Diseño Arquitectónico y Modelado del Sistema](#6-diseño-arquitectónico-y-modelado-del-sistema)
   * 6.1 Patrón arquitectónico Single Page Application (SPA) desacoplado
   * 6.2 Modelo conceptual del ciclo de vida del rescate
   * 6.3 Modelo relacional de base de datos y diccionario de datos
   * 6.4 Sistema de diseño visual (UI/UX) y paleta institucional
   * 6.5 Estrategia de almacenamiento híbrido y rutina diaria de disponibilidad (Keep-Alive)
7. [Implementación Detallada de Módulos de Software](#7-implementación-detallada-de-módulos-de-software)
   * 7.1 Módulo 1: Dashboard y Panel de Indicadores Clave (KPIs)
   * 7.2 Módulo 2: Fichas Integrales de Animales y Trazabilidad
   * 7.3 Módulo 3: Historial Sanitario y Protocolo de Triage Clínico (Rojo, Amarillo, Verde)
   * 7.4 Módulo 4: Red de Hogares Temporales y Familias de Acogida
   * 7.5 Módulo 5: Adopciones, Algoritmo de Scoring (0-100 pts) y Seguimiento Post-Adopción
   * 7.6 Módulo 6: Gestión Financiera, Rendición y Prorrateo de Gastos
   * 7.7 Módulo 7: Difusión Local y Motor Canvas de Flyers
   * 7.8 Módulo 8: Gestión Documental Oficial, Edición en Vivo y Exportación PDF
   * 7.9 Módulo 9: Informes Ejecutivos, Métricas y Motor de Respaldo JSON Offline
   * 7.10 Módulo 10: Gestión de Proyectos de Esterilización Masiva (Área Funcional 2)
8. [Aseguramiento de Calidad y Plan de Pruebas](#8-aseguramiento-de-calidad-y-plan-de-pruebas)
   * 8.1 Estrategia de pruebas de software (QA)
   * 8.2 Matriz de casos de prueba de aceptación (CP-01 al CP-12)
   * 8.3 Pruebas de rendimiento, accesibilidad y compatibilidad entre navegadores
9. [Transferencia Tecnológica y Validación Comunitaria](#9-transferencia-tecnológica-y-validación-comunitaria)
   * 9.1 Proceso de capacitación a la Presidenta y Tesorera
   * 9.2 Estado de la pauta de validación de servicio
   * 9.3 Beneficios esperados sujetos a validación
10. [Conclusiones, Lecciones Aprendidas y Trabajo Futuro](#10-conclusiones-lecciones-aprendidas-y-trabajo-futuro)
    * 10.1 Cumplimiento de objetivos del proyecto
    * 10.2 Aprendizajes éticos, técnicos y profesionales
    * 10.3 Hoja de ruta para versiones futuras (Roadmap 2.0)
11. [Referencias Bibliográficas y Normativas](#11-referencias-bibliográficas-y-normativas)
12. [Anexos Documentales e Instrumentos Institucionales](#12-anexos-documentales-e-instrumentos-institucionales)

---

## 1. RESUMEN EJECUTIVO (ABSTRACT)

El presente informe expone el proceso de concepción, levantamiento de requerimientos, diseño arquitectónico, implementación y aseguramiento de calidad del **Sistema Web de Gestión de Rescate, Trazabilidad y Adopción Animal** desarrollado para la **Fundación Amor de Cuatro Patas**. La validación formal con el socio comunitario permanece pendiente de aplicación, fecha y firmas.

El proyecto se ejecutó bajo la metodología pedagógica de **Aprendizaje + Servicio (A+S)**, articulando las competencias técnicas del perfil de egreso en Ingeniería de Software con una problemática social crítica: la desorganización de la información y la pérdida de trazabilidad que enfrentan las organizaciones de rescate animal voluntarias. Con anterioridad a esta intervención, la Fundación operaba mediante registros manuscritos dispersos, chats informales de mensajería instantánea y planillas de cálculo desvinculadas, lo que acarreaba serios riesgos de duplicidad en planes de vacunación, falta de control contable en gastos veterinarios y debilidad jurídica en los acuerdos de adopción.

Como solución se construyó un **Producto Mínimo Viable local**, sustentado en JavaScript, HTML5 y CSS responsivo. Incluye autenticación local obligatoria para Presidenta y Tesorera, trazabilidad, historial sanitario, hogares temporales, evaluación de postulantes, adopciones, seguimientos, gastos filtrables, documentos relacionados, informes por período y generación de flyers mediante HTML5 Canvas. El asistente de redacción utiliza plantillas locales editables; la IA generativa real queda pendiente de un servicio autenticado. La persistencia actual utiliza `localStorage` y respaldos JSON; el esquema PostgreSQL/Supabase está preparado, pero no conectado.

Las pruebas automatizadas ejecutadas en Chrome comprobaron la autenticación local, las nueve secciones, la trazabilidad, los filtros, las relaciones documentales, el cierre de sesión y el diseño a 390 px sin errores JavaScript. No se declara 100% de cumplimiento: todavía faltan Supabase Auth, persistencia cloud, IA remota, despliegue verificable, pruebas reproducibles en otros navegadores y validación firmada por la Fundación.

---

## 2. MARCO CONTEXTUAL Y DIAGNÓSTICO SITUACIONAL

### 2.1 Contexto socio-ambiental y tenencia responsable en la Región del Maule
La sobrepoblación canina y felina en estado de abandono representa un desafío epidemiológico, ambiental y ético de primer orden en las zonas urbanas y periurbanas de la zona centro-sur de Chile. En la Región del Maule, la proliferación de animales callejeros se asocia históricamente a factores socioculturales de baja esterilización sistemática, desinformación sobre zoonosis y conductas de abandono no sancionadas efectivamente. 

Ante esta realidad, las fundaciones y agrupaciones animalistas cumplen una función sustituta vital para la salud pública y el resguardo ético, rescatando animales atropellados, desnutridos o maltratados, asumiendo su rehabilitación médica de urgencia y gestionando su reinserción en hogares debidamente capacitados.

### 2.2 Marco legal vigente: Ley N° 21.020, Código Penal y D.S. N° 1007
La ingeniería de software aplicada a este proyecto no se concibió en un vacío normativo, sino en estricta conformidad con el marco legal de la República de Chile:
1. **Ley N° 21.020 sobre Tenencia Responsable de Mascotas y Animales de Compañía (denominada "Ley Cholito"):** Establece la obligación civil y administrativa de identificar e inscribir a los ejemplares mediante microchip subcutáneo oficial ante el Registro Nacional de Mascotas (PTRAC), esterilizar quirúrgicamente a los animales bajo custodia y garantizar su alimentación, albergue y asistencia médica preventiva.
2. **Código Penal (Artículos 291 bis y 291 ter):** Tipifica el maltrato animal como delito de acción penal pública, castigando tanto los actos de agresión física como el abandono voluntario y la desatención sanitaria con penas de presidio menor y multas a beneficio fiscal.
3. **Decreto Supremo N° 1007 del Ministerio del Interior y Seguridad Pública:** Fija el reglamento formal para la calificación de hogares, refugios y obligaciones de los tenedores.
4. **Ley N° 21.442 de Copropiedad Inmobiliaria:** Regula la prohibición de cláusulas arbitrarias que impidan la tenencia de animales en condominios y departamentos, exigiendo a su vez condiciones de seguridad (mallas perimetrales en ventanas).

### 2.3 Perfil institucional de la Fundación Amor de Cuatro Patas
* **Nombre de la Organización:** Fundación Amor de Cuatro Patas.
* **Naturaleza:** Persona jurídica de derecho privado sin fines de lucro.
* **Personalidad Jurídica:** N° 284.912 (Registro Nacional de Personas Jurídicas Sin Fines de Lucro).
* **RUT Institucional:** 65.184.290-K.
* **Sede Operativa:** Comuna de Talca, Región del Maule, Chile.
* **Directorio Ejecutivo:** Presidenta de la Fundación y Tesorera de la Fundación.
* **Misión:** Rescatar animales de compañía en situación de maltrato, riesgo vital o desamparo en Talca y comunas aledañas, brindarles rehabilitación clínica especializada y ubicarlos en hogares definitivos bajo estricto contrato de tenencia responsable.
* **Modelo de Custodia:** La Fundación no dispone de un refugio canil masivo propio (lo que previene hacinamientos y focos de infección), operando a través de una red solidaria de **Hogares Temporales (familias de acogida)** que albergan transitoriamente a los rescatados durante su tratamiento y cuarentena.

### 2.4 Diagnóstico operacional inicial y matriz FODA
Antes de la ejecución de este proyecto, el diagnóstico situacional de la Fundación reveló las siguientes condiciones operativas:

| Dimensión | Situación Previa | Riesgo Operacional Detectado |
| :--- | :--- | :--- |
| **Fichas de Animales** | Apuntes en cuadernos y notas de celular | Pérdida de historial de rescate, olvido de características y señas particulares. |
| **Historial Sanitario** | Carnets de cartulina propensos al extravío o deterioro | Descoordinación de revacunaciones anuales, duplicidad de dosis antiparasitarias o retraso en cirugías de esterilización. |
| **Hogares Temporales** | Conversaciones dispersas en grupos de WhatsApp | Desconocimiento del número real de cupos disponibles y falta de trazabilidad de los traslados del animal. |
| **Adopciones** | Entrevistas verbales y contratos impresos básicos | Selección subjetiva de postulantes sin criterios estandarizados de solvencia o seguridad habitacional. |
| **Control Contable** | Boletas en papel guardadas en carpetas físicas | Desconocimiento del costo real invertido por cada rescate y dificultad para rendir cuentas a donantes. |
| **Difusión en Redes** | Redacción manual de publicaciones y afiches improvisados | Lentitud en la generación de campañas de adopción y baja conversión en redes sociales. |

#### Matriz FODA Institucional:
* **Fortalezas:** Alto compromiso ético y vocación de servicio del Directorio; red consolidada de médicos veterinarios en convenio en Talca; alta reputación comunitaria.
* **Oportunidades:** Creciente conciencia social sobre adopción responsable; marco legal de la Ley 21.020 que exige registros fidedignos; disponibilidad de herramientas tecnológicas web accesibles.
* **Debilidades:** Escasez de tiempo del equipo directivo (sobrecarga administrativa); falta de presupuesto para costear licencias de software privativo complejo; carencia de personal informático interno.
* **Amenazas:** Aumento de casos de abandono en la vía pública; saturación de hogares temporales; encarecimiento de medicamentos e insumos médicos veterinarios.

---

## 3. PLANTEAMIENTO DEL PROBLEMA Y JUSTIFICACIÓN A+S

### 3.1 Formulación de la problemática central (Árbol de causas y efectos)
El problema medular detectado se formula como:  
> **"Inexistencia de una plataforma centralizada y estandarizada para la administración, trazabilidad sanitaria, control financiero y gestión de adopciones de los animales rescatados por la Fundación Amor de Cuatro Patas, generando ineficiencia operativa, riesgo médico por desarticulación de antecedentes y debilidad jurídica en la tutela de los ejemplares."**

```
                   ┌──────────────────────────────────────────────┐
                   │                  EFECTOS                     │
                   │ • Riesgo de salud por vacunas desfasadas     │
                   │ • Fuga o accidentes por entregas inseguras   │
                   │ • Pérdida de recursos económicos sin rendir  │
                   │ • Sobrecarga y agotamiento de voluntarias    │
                   └──────────────────────▲───────────────────────┘
                                          │
                   ┌──────────────────────┴───────────────────────┐
                   │             PROBLEMA CENTRAL                 │
                   │ Descentralización, precariedad e informalidad │
                   │ en la gestión de datos de los rescates       │
                   └──────────────────────▲───────────────────────┘
                                          │
                   ┌──────────────────────┴───────────────────────┐
                   │                  CAUSAS                      │
                   │ • Uso de planillas de cálculo aisladas       │
                   │ • Falta de herramientas de software a medida │
                   │ • Registros en chats personales de mensajería│
                   │ • Inexistencia de protocolos clínicos web    │
                   └──────────────────────────────────────────────┘
```

### 3.2 Fundamentación del modelo Aprendizaje + Servicio (A+S)
La metodología de Aprendizaje + Servicio (A+S) es una propuesta pedagógica que combina procesos de aprendizaje académico con la prestación de un servicio solidario a una comunidad u organización real que experimenta una necesidad sentida.

En este marco, el proyecto no se abordó como un ejercicio académico ficticio, sino como un **contrato de servicio profesional responsable**:
* **Aprendizaje Técnico:** El equipo estudiantil puso en práctica conceptos avanzados de Ingeniería de Software: elicitación formal de requisitos con usuarios reales, modelado relacional de bases de datos, patrones arquitectónicos de desarrollo web, diseño de interfaces enfocado en la experiencia de usuario (UI/UX), control de calidad mediante planes de prueba rigurosos y redacción de documentación exhaustiva.
* **Servicio Comunitario Significativo:** Se dota a una organización benéfica de una herramienta informática robusta, sin costos de licenciamiento, diseñada específicamente para su realidad institucional, blindando la salud de los animales y facilitando la labor humanitaria de las directivas.

### 3.3 Beneficiarios directos e indirectos de la solución
1. **Beneficiarios Directos:**
   * **Presidenta y Tesorera de la Fundación:** Quienes reducen drásticamente sus horas de trabajo administrativo manual, accediendo a indicadores consolidados en tiempo real.
   * **Animales Rescatados:** Quienes obtienen una ficha clínica digital unificada, garantizando el cumplimiento de sus períodos de cuarentena, desparasitaciones, cirugías y seguimiento de por vida.
2. **Beneficiarios Indirectos:**
   * **Hogares Temporales:** Quienes cuentan con canales formales para coordinar ingresos, traslados y reportar novedades de salud.
   * **Adoptantes Responsables:** Quienes acceden a un proceso de postulación claro, transparente y respaldado por contratos solemnes con mérito legal.
   * **Comunidad de Talca y Maule:** Al fortalecer la labor de una fundación que contribuye activamente al control ético de la fauna urbana y la salud pública ambiental.

---

## 4. DEFINICIÓN DE OBJETIVOS Y ALCANCE

### 4.1 Objetivo General
Diseñar, desarrollar, probar y transferir un prototipo funcional de **Sistema Web de Gestión de Rescate y Adopción Animal** para la Fundación Amor de Cuatro Patas, que permita centralizar la información, garantizar la trazabilidad clínica y biográfica de cada rescate, optimizar la selección de adoptantes responsables, controlar los gastos operacionales y automatizar la generación de contenidos de difusión.

### 4.2 Objetivos Específicos
1. **Elicitar y Formalizar:** Levantar los requerimientos funcionales y no funcionales en sesiones de trabajo colaborativo con la Presidenta y la Tesorera de la Fundación.
2. **Modelar Arquitectura y Datos:** Diseñar la navegación, la interfaz y un esquema relacional de doce (12) tablas, incluidas las usuarias autorizadas y las relaciones normalizadas de gastos.
3. **Implementar el Núcleo del Software:** Desarrollar los módulos de gestión de fichas, registro sanitario con categorización de **Triage Clínico**, administración de hogares temporales y control financiero con prorrateo de costos.
4. **Desarrollar Módulos Innovadores:** Implementar el cuestionario digital con ponderación de 0 a 100 puntos, el visor documental, los borradores locales editables y los flyers en HTML5 Canvas; dejar especificada la integración futura de IA mediante servidor autenticado.
5. **Validar y Transferir:** Ejecutar pruebas técnicas del MVP y preparar manuales, pauta y capacitación. La aplicación de la pauta con las socias comunitarias queda pendiente y no se presume realizada.

### 4.3 Alcance y delimitación técnica del MVP
* **Plataforma:** Aplicación Web de una sola página (Single Page Application - SPA) compatible con todos los navegadores modernos de escritorio y dispositivos móviles (Chrome, Edge, Safari, Firefox).
* **Persistencia:** Almacenamiento local mediante `localStorage` con motor relacional estructurado en JavaScript, complementado con funciones de importación y exportación de respaldos JSON sin necesidad de infraestructura de servidor costosa durante la etapa de adopción inicial.
* **Escalabilidad Cloud:** Entrega de script de migración estructurado en SQL estándar para PostgreSQL / Supabase, con políticas de seguridad a nivel de filas (Row Level Security - RLS).
* **Delimitaciones (Lo que NO incluye el MVP 1.0):** No contempla pasarela de pago bancaria en línea directa (WebPay), delegando la rendición de donaciones al registro manual respaldado por comprobantes; no contempla geolocalización GPS en tiempo real de los animales.

---

## 5. INGENIERÍA DE REQUERIMIENTOS

### 5.1 Levantamiento de requerimientos y perfil de usuarias
A través de entrevistas estructuradas y análisis de los instrumentos físicos previamente utilizados por la Fundación, se definieron los dos perfiles principales:
* **Perfil Presidenta:** Orientada a la supervisión general, toma de decisiones en rescates críticos, aprobación final de adopciones, fiscalización de seguimientos y emisión de campañas públicas.
* **Perfil Tesorera:** Orientada a la rendición de cuentas, imputación contable de gastos clínicos y de alimentación, verificación de boletas y balance financiero de la organización.
* *Decisión de Diseño:* Ambas usuarias disponen del mismo nivel de permisos administrativos completos en el sistema (evitando bloqueos por ausencia de alguna directiva), con la capacidad de alternar perfiles visuales para auditoría.

### 5.2 Matriz de Requerimientos Funcionales (RF-01 al RF-12)

| Código | Requerimiento Funcional | Descripción y Criterio de Aceptación | Prioridad (MoSCoW) |
| :--- | :--- | :--- | :--- |
| **RF-01** | **Gestión de Accesos y Perfiles** | El sistema exige configurar contraseñas distintas, iniciar sesión y volver a autenticarse para cambiar entre Presidenta y Tesorera. | Must have (Obligatorio) |
| **RF-02** | **Registro y Fichas de Animales** | Registro de datos biométricos (nombre, especie, sexo, edad estimada, peso, estado reproductivo, fotos y enlace a carpeta Drive). | Must have (Obligatorio) |
| **RF-03** | **Trazabilidad y Línea de Tiempo** | Visualización cronológica e interactiva de todos los cambios de estado del animal desde su rescate hasta su adopción o egreso. | Must have (Obligatorio) |
| **RF-04** | **Historial Clínico y Triage** | Registro de atenciones médicas veterinarias con categorización de **Triage Clínico** (Rojo/Crítico, Amarillo/Urgente, Verde/Estable) y registro de parámetros basales (ECOG). | Must have (Obligatorio) |
| **RF-05** | **Control de Cuarentena y Profilaxis** | Registro estricto de planes de desparasitación, esquemas de vacunación (Óctuple/Triple/Antirrábica) y fechas de esterilización. | Should have (Deseable) |
| **RF-06** | **Red de Hogares Temporales** | Registro de familias voluntarias de acogida, capacidad máxima de cupos, animales hospedados activamente e historial de traslados. | Must have (Obligatorio) |
| **RF-07** | **Postulación y Scoring Inteligente** | Cuestionario digital de 15 variables habitacionales y de seguridad, con algoritmo automático que calcula un puntaje de 0 a 100 y clasifica la postulación (*Aprobado, Requiere Entrevista, No Recomendado*). | Should have (Deseable) |
| **RF-08** | **Adopciones y Seguimientos** | Formalización de la adopción con asignación de adoptante, generación de contrato y registro periódico de hitos post-adopción con semáforo de bienestar. | Must have (Obligatorio) |
| **RF-09** | **Control de Gastos y Prorrateo** | Registro financiero con monto en pesos chilenos ($ CLP), categoría contable, posibilidad de asociar el gasto a un animal único, a múltiples animales (prorrateo equitativo) o a la Fundación en general. | Must have (Obligatorio) |
| **RF-10** | **Repositorio Documental y Visor** | Visor modal de documentos institucionales oficiales en hoja membretada, con **modo de edición de texto en pantalla**, guardado persistente, exportación limpia a PDF y vinculación a Google Drive. | Should have (Deseable) |
| **RF-11** | **Métricas y Reportes Ejecutivos** | Panel de control con contadores en tiempo real (KPIs), desglose porcentual de gastos e informe imprimible/exportable en PDF. | Should have (Deseable) |
| **RF-12** | **Difusión y Generador de Flyers** | Plantillas locales editables para redes sociales y motor Canvas con cuatro temas descargables. La IA generativa permanece pendiente de un endpoint autenticado. | Could have (Parcial) |

### 5.3 Matriz de Requerimientos No Funcionales (RNF-01 al RNF-08)

* **RNF-01 (Usabilidad y Accesibilidad):** Interfaz intuitiva y autoexplicativa basada en principios de diseño de Nielsen, operable sin conocimientos informáticos avanzados.
* **RNF-02 (Rendimiento y Carga Inmediata):** Tiempos de renderizado y respuesta menores a 100 milisegundos en todas las vistas, operando localmente sin latencias de red.
* **RNF-03 (Seguridad y roles):** Acceso local protegido mediante verificadores PBKDF2 y sesión temporal. El esquema RLS exige además pertenecer a `usuarios_autorizados`, pero todavía no está conectado.
* **RNF-04 (Privacidad y protección de datos):** El bloqueo local reduce el acceso casual, pero la protección completa de antecedentes personales depende de Supabase Auth, RLS, HTTPS y permisos de Drive. No se declara aún cumplimiento productivo de la Ley N° 19.628.
* **RNF-05 (Integridad Referencial y Consistencia):** Restricciones de clave foránea `ON DELETE RESTRICT`, impidiendo que se eliminen animales que cuenten con historial médico o registros contables asociados.
* **RNF-06 (Diseño Adaptable - Responsive Design):** Maquetación flexible basada en CSS Grid y Flexbox que se visualiza correctamente en pantallas de escritorio, tablets y smartphones.
* **RNF-07 (Mantenibilidad y Código Limpio):** Arquitectura modular desacoplada en carpetas lógicas (`js/modules/`), documentada extensamente con comentarios técnicos en formato JSDoc.
* **RNF-08 (Independencia y Portabilidad):** Capacidad del sistema de operar de forma 100% *offline* (desconectada de internet) mediante el navegador, garantizando que un corte de conexión no impida la atención veterinaria de un animal.

---

## 6. DISEÑO ARQUITECTÓNICO Y MODELADO DEL SISTEMA

### 6.1 Patrón arquitectónico Single Page Application (SPA) desacoplado
El sistema adopta una arquitectura de aplicación de página única (SPA) estructurada en tres capas lógicas desacopladas:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       CAPA DE PRESENTACIÓN (UI)                         │
│   • HTML5 Semántico (index.html)                                        │
│   • CSS3 Personalizado con Glassmorphism y Paleta HSL (index.css)        │
│   • Componentes Modales, Tablas y Visor de Hoja Membretada Oficial      │
└────────────────────────────────────▲────────────────────────────────────┘
                                     │ Eventos / Manipulación DOM
┌────────────────────────────────────▼────────────────────────────────────┐
│                  CAPA DE LÓGICA DE NEGOCIO (MÓDULOS JS)                  │
│   • app.js (Enrutador, Cambio de Perfiles y Notificaciones Toast)       │
│   • animals.js (Fichas Integrales y Trazabilidad)                       │
│   • health.js (Historial Sanitario y Protocolo de Triage)               │
│   • homes.js (Hogares Temporales y Cupos)                               │
│   • adoptions.js (Cuestionario, Algoritmo de Scoring y Seguimiento)     │
│   • expenses.js (Cálculos Contables y Prorrateo)                        │
│   • diffusion.js (Lienzo Canvas HTML5 y Generador de Textos)            │
│   • documents.js (Visor Membretado, Editor en Vivo y Exportación PDF)   │
│   • reports.js (Métricas, Gráficos de Barra y Reportes Imprimibles)     │
└────────────────────────────────────▲────────────────────────────────────┘
                                     │ Métodos CRUD / Consultas
┌────────────────────────────────────▼────────────────────────────────────┐
│                    CAPA DE DATOS Y PERSISTENCIA                          │
│   • db.js (Gestor de Base de Datos Relacional en LocalStorage)          │
│   • Motor de Respaldo Export/Import JSON                                │
│   • Esquema SQL Preparado para Migración a Supabase / PostgreSQL        │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Modelo conceptual del ciclo de vida del rescate
El flujo integral que modela el sistema garantiza que ningún animal quede sin supervisión institucional:

```
[AVISO / RESCATE EN VÍA PÚBLICA]
               │
               ▼
[INGRESO AL SISTEMA Y EVALUACIÓN DE TRIAGE CLÍNICO]
  ├── Triage Rojo: Atención de Urgencia Vital (0 a 10 min)
  ├── Triage Amarillo: Urgencia Inestable (60 a 120 min)
  └── Triage Verde: Estable (Examen Clínico General ECOG)
               │
               ▼
[ASIGNACIÓN A HOGAR TEMPORAL Y CUARENTENA (15 DÍAS)]
  ├── Días 1-3: Desparasitación interna/externa y Tests Rápidos
  └── Días 4-14: Monitoreo térmico, digestivo y respiratorio
               │
               ▼
[ALTA SANITARIA, INMUNIZACIÓN Y ESTERILIZACIÓN]
  ├── Vacunación Óctuple / Triple Felina + Antirrábica
  ├── Microchip Oficial de 15 dígitos (Ley 21.020)
  └── Cirugía Quirúrgica (Castración / Ovariohisterectomía)
               │
               ▼
[CAMBIO DE ESTADO: "DISPONIBLE PARA ADOPCIÓN"]
  ├── Generación de Flyer en Canvas y Difusión en Redes Sociales
  └── Recepción de Postulantes mediante Cuestionario Digital
               │
               ▼
[EVALUACIÓN AUTOMÁTICA DE SCORING (0 A 100 PUNTOS)]
  ├── > 80 pts: Aprobado (Condiciones óptimas)
  ├── 50-79 pts: Requiere Entrevista / Visita domiciliaria
  └── < 50 pts: No Recomendado (Riesgo socio-ambiental)
               │
               ▼
[FORMALIZACIÓN DE ADOPCIÓN Y FIRMA DE CONTRATO SOLEMNE]
               │
               ▼
[SEGUIMIENTO POST-ADOPCIÓN PERIÓDICO (3, 6, 12 MESES)]
               │
               ▼
[REGISTRO HISTÓRICO PERMANENTE EN LA BASE DE DATOS]
```

### 6.3 Modelo relacional de base de datos y diccionario de datos
La base de datos relacional preparada se compone de doce (12) tablas vinculadas mediante integridad referencial. El script se encuentra en `supabase_schema.sql`:

1. `animales`: Entidad medular que almacena los atributos intrínsecos de cada ejemplar rescatado.
2. `historial_estados`: Registra la línea de tiempo y la justificación de cada cambio de fase.
3. `historial_sanitario`: Almacena atenciones clínicas, categorización de Triage, parámetros fisiológicos y dosis administradas.
4. `hogares_temporales`: Catálogo de cuidadores voluntarios con sus datos de contacto y cupos de alojamiento.
5. `animal_hogares`: Tabla asociativa que gestiona las asignaciones temporales con fechas de ingreso y egreso.
6. `adoptantes`: Registro civil y socio-ambiental de los postulantes evaluados.
7. `adopciones`: Registro contractual vinculante que formaliza la entrega legal de la custodia.
8. `seguimientos`: Hitos de monitoreo post-entrega con evaluación de bienestar físico y anímico.
9. `gastos`: Registro contable de egresos con imputación flexible (individual, prorrateada o general).
10. `documentos`: Repositorio documental con títulos, categorías, contenido personalizado y enlaces a la nube.
11. `gasto_animales`: Relación normalizada entre gastos y animales, con porcentaje de asignación.
12. `usuarios_autorizados`: Identidades habilitadas, vinculadas con `auth.users` y limitadas a Presidenta o Tesorera.

### 6.4 Sistema de diseño visual (UI/UX) y paleta institucional
El diseño visual fue concebido bajo estándares modernos de interfaces de software, priorizando la ergonomía cognitiva y evitando la fatiga visual de las directivas durante jornadas extensas de trabajo administrativo:
* **Paleta de Color Primaria:** Tonos Índigo y Violeta (`#4f46e5`, `#6366f1`, `#4338ca`) que evocan institucionalidad, serenidad y confianza.
* **Fondo Glassmorphic Dark:** Paleta de tonos pizarra oscura (`#0f172a`, `#1e293b`) con transparencias de vidrio esmerilado y sombras suaves, destacando los elementos de contenido.
* **Colores Semánticos de Estado:**
  * Verde Éxito (`#10b981` / `#16a34a`): Mascotas adoptadas, postulaciones aprobadas, Triage Verde.
  * Amarillo Advertencia (`#f59e0b` / `#d97706`): Cuarentena preventiva, Triage Amarillo.
  * Rojo Alerta (`#ef4444` / `#dc2626`): Urgencias médicas, Triage Rojo, gastos extraordinarios.
  * Celeste Información (`#0ea5e9`): Rescates iniciales, fichas en revisión.
* **Hoja Membretada Oficial Imprimible:** Contenedor de papel blanco de alto contraste (`#ffffff`) con tipografía de imprenta, bordes nítidos, sellos circulares simulados en tinta y firmas solemnes, optimizado para visualización en pantalla e impresión física directa.

### 6.5 Estrategia de Almacenamiento Híbrido y Rutina Diaria de Disponibilidad (Keep-Alive de Base de Datos)
Con el propósito de mantener el costo de operación del sistema en $0 y garantizar la máxima disponibilidad técnica para la Fundación, se definieron dos estrategias de arquitectura de datos:
* **Almacenamiento Híbrido y Compresión en Cliente:** 
  1. *Compresión en Cliente (HTML5 Canvas):* Antes de almacenar o transmitir una imagen, el navegador redimensiona automáticamente la fotografía a proporciones óptimas (~800 a 1000 píxeles con 80% de compresión JPEG), reduciendo el peso de 4-8 MB a menos de 150 KB.
  2. *Liberación de Fotos Operativas en Adoptados:* Cuando un animal es adoptado, se habilita la acción «Liberar Fotos» que desasocia las imágenes operativas temporales para recuperar espacio en servidor, preservando el 100% de los datos clínicos, legales y el enlace a la carpeta permanente en Google Drive.
  3. *Uso de Google Drive para Documentos Pesados:* La documentación escaneada (consentimientos firmados, comprobantes tributarios, fichas físicas y videos) se almacena en carpetas institucionales de Google Drive, guardando en la base de datos únicamente el hipervínculo seguro.
* **Rutina Diaria de Disponibilidad (Keep-Alive de Base de Datos):**
  En la capa gratuita de Supabase, los proyectos inactivos que no reciben consultas durante 7 días consecutivos son suspendidos automáticamente por la plataforma. Para impedir caídas del servicio y garantizar que el sistema web responda inmediatamente en cualquier momento, se implementó una doble salvaguarda:
  1. *Tarea Programada en Base de Datos (`pg_cron`):* Se programó una consulta ligera automatizada a las 05:00 UTC (`SELECT count(*) FROM public.animales WHERE activo = true;`).
  2. *Flujo de Trabajo Automatizado (GitHub Actions):* Un flujo de trabajo programado (`.github/workflows/Consulta Diaria Supabase.yml`) realiza una petición HTTP autenticada diaria contra el endpoint REST del proyecto, registrando el código de estado y manteniendo despierto el motor relacional.

---

## 7. IMPLEMENTACIÓN DETALLADA DE MÓDULOS DE SOFTWARE

### 7.1 Módulo 1: Dashboard y Panel de Indicadores Clave (KPIs)
* **Archivo:** `js/modules/reports.js` y `js/app.js`.
* **Funcionalidad:** Presenta de forma condensada las métricas de mayor impacto para el directorio: total de animales tutelados históricamente, disponibles para adopción inmediata, adopciones exitosas consolidadas, casos en tratamiento clínico o aislamiento, ejemplares en hogares temporales y la inversión financiera total acumulada.
* **Beneficio Operativo:** Permite a la Presidenta responder en segundos a consultas de prensa, postulaciones a fondos concursables (SUBDERE / FNDR) o informes para asambleas de socios.

### 7.2 Módulo 2: Fichas Integrales de Animales y Trazabilidad
* **Archivo:** `js/modules/animals.js`.
* **Funcionalidad:** Implementa la vista de **"Ficha Integral"** mediante un sistema de pestañas (*Tabs*) que consolida en una sola pantalla: antecedentes generales, línea de tiempo de estados, historial sanitario cronológico, historial de hogares temporales de paso, datos de la adopción y adoptante, y la cuenta corriente de gastos exactos invertidos en ese animal.
* **Filtros Avanzados:** Búsqueda en tiempo real por nombre, filtrado por especie (canino/felino) y filtrado por estado operacional.

### 7.3 Módulo 3: Historial Sanitario y Protocolo de Triage Clínico
* **Archivo:** `js/modules/health.js` y `js/modules/documents.js`.
* **Funcionalidad:** Permite a la Fundación registrar atenciones veterinarias bajo la escala tripartita internacional de **Triage Clínico**:
  1. **Triage Rojo (Prioridad 1 - Crítico):** Riesgo vital inminente por politraumatismo, hemorragia activa o shock.
  2. **Triage Amarillo (Prioridad 2 - Urgente):** Deshidratación severa, fracturas, diarreas virales o caquexia extrema.
  3. **Triage Verde (Prioridad 3 - Estable):** Pacientes compensados hemodinámicamente, dermatopatías crónicas o controles sanos.
* **Examen Clínico Objetivo General (ECOG):** Formulario estandarizado para registrar peso (kg), condición corporal (1 a 5 según WSAVA), frecuencia cardíaca (FC), frecuencia respiratoria (FR), temperatura rectal (°C), tiempo de llenado capilar (TLLC) y coloración de mucosas.

### 7.4 Módulo 4: Red de Hogares Temporales y Familias de Acogida
* **Archivo:** `js/modules/homes.js`.
* **Funcionalidad:** Administra el catálogo de hogares de acogida, calculando de manera dinámica los **cupos disponibles** en cada hogar. El sistema impide visualmente la sobreocupación de un hogar y genera automáticamente el registro en la tabla `animal_hogares` cuando una mascota es reubicada.

### 7.5 Módulo 5: Adopciones, Algoritmo de Scoring (0-100 pts) y Seguimiento
* **Archivo:** `js/modules/adoptions.js`.
* **Cuestionario Digital de 15 Variables:** Evalúa condiciones críticas exigidas por la Ley 21.020:
  * Tipo de vivienda y seguridad perimetral de patios (altura de rejas > 1.80m).
  * Instalación certificada de mallas de seguridad en departamentos y balcones (requisito excluyente para felinos y cachorros).
  * Solvencia económica comprobada para costear alimentación premium y urgencias veterinarias.
  * Horas diarias en que la mascota permanecerá sola.
  * Consenso de la totalidad de los integrantes del grupo familiar conviviente.
* **Algoritmo de Calificación Automática:** Otorga una puntuación matemática objetiva:
  * **80 a 100 puntos (Aprobado):** Cumple con todos los estándares óptimos de bienestar.
  * **50 a 79 puntos (Requiere Entrevista / Visita Domiciliaria):** Cumple con la base pero requiere verificar compromisos (ej. instalar mallas previo a la entrega).
  * **Menor a 50 puntos (No Recomendado):** Presenta riesgos evidentes de extravío, falta de acuerdo o insolvencia ante urgencias médicas.
* **Hitos de Seguimiento Post-Adopción:** Calendario de registros periódicos a los 3, 6 y 12 meses de la entrega, evaluando el peso, la adaptación conductual y el carnet de vacunas al día.

### 7.6 Módulo 6: Gestión Financiera, Rendición y Prorrateo de Gastos
* **Archivo:** `js/modules/expenses.js`.
* **Funcionalidad:** Registro contable de egresos clasificados en cinco rubros (*Atención Veterinaria, Alimento, Medicamentos, Transporte y Traslados, e Insumos Generales*).
* **Mecanismo de Prorrateo Innovador:** Permite registrar compras colectivas (por ejemplo, un saco de alimento de 20 kg o una caja de antiparasitarios) y distribuir su costo en partes matemáticamente exactas entre una lista seleccionada de animales, evitando cálculos manuales propensos a error.

### 7.7 Módulo 7: Difusión Local y Motor Canvas de Flyers
* **Archivo:** `js/modules/diffusion.js`.
* **Motor Gráfico en HTML5 Canvas:** Renderiza de forma programática afiches publicitarios combinando la fotografía real del animal, su nombre, edad, carácter y logotipo de la Fundación. Dispone de cuatro temas preconfigurados:
  1. *Estilo Institucional:* Paleta índigo/violeta oficial de la Fundación.
  2. *Caso Urgente:* Franjas de alerta roja y naranja para rescates en riesgo vital o sin hogar.
  3. *Cachorros / Ternura:* Paleta pastel celeste y rosada para cachorros lactantes.
  4. *Adopción Senior:* Paleta verde esmeralda para mascotas de edad avanzada.
* **Descarga Limpia en PNG:** El usuario presiona un botón y obtiene la imagen en alta resolución descargada directamente en su dispositivo, lista para publicar en Instagram o WhatsApp sin consumir cuota de almacenamiento en servidores externos.
* **Asistente Local de Redacción:** Construye borradores editables mediante plantillas y datos de la ficha en tres tonos (*Emotivo, Alegre y Formal*). No consume una API de IA. La integración generativa se realizará después de Supabase Auth mediante una Edge Function que mantenga la credencial fuera del navegador.

### 7.8 Módulo 8: Gestión Documental Oficial, Edición en Vivo y Exportación PDF
* **Archivo:** `js/modules/documents.js`.
* **Documentos Estandarizados Incluidos:**
  1. *Formulario Oficial de Postulación y Evaluación Socio-Ambiental de Adopción (Ley 21.020).*
  2. *Contrato Solemne de Adopción Definitiva y Compromiso de Tenencia Responsable.*
  3. *Protocolo Técnico Veterinario: Sistema de Triage Clínico, Aislamiento y Cuarentena Profiláctica.*
* **Funcionalidad de Edición en Vivo:** El visor modal incorpora el botón **`✏️ Editar Texto del Documento`**, que activa el atributo `contenteditable` sobre la hoja membretada, permitiendo a la Presidenta o Tesorera corregir o personalizar cualquier cláusula, teléfono o nombre directamente en pantalla y guardar los cambios permanentemente con el botón **`💾 Guardar Cambios`**, o volver a la versión estándar con **`🔄 Restaurar Plantilla Original`**.
* **Exportación Limpia a PDF:** La función `printCurrentDocument()` genera una ventana de impresión limpia, con reglas CSS `@media print` que eliminan márgenes espurios y fondos oscuros de la interfaz, produciendo documentos idénticos a los emitidos por una notaría o centro clínico.

### 7.9 Módulo 9: Informes Ejecutivos, Métricas y Motor de Respaldo JSON Offline
* **Archivo:** `js/modules/reports.js` y `js/db.js`.
* **Independencia Tecnológica:** El sistema cuenta con botones directos para **Exportar Respaldo JSON** e **Importar Respaldo JSON**, lo que permite salvaguardar la totalidad de la base de datos en un archivo liviano transportable en un pendrive o correo electrónico, blindando a la Fundación contra pérdidas accidentales de datos o formateos de equipo.

### 7.10 Módulo 10: Gestión de Proyectos de Esterilización Masiva (Área Funcional 2)
* **Archivo:** `js/modules/esterilizaciones.js`, `js/db.js` y `supabase_schema.sql`.
* **Fundamento y Separación Arquitectónica:** Conforme a lo identificado en la revalidación con el socio comunitario (Ficha Técnica §5), la Fundación participa en operativos sanitarios en terreno orientados a animales comunitarios y callejeros bajo el protocolo de captura, esterilización y retorno (TNR). Por regla de negocio, estos pacientes **no ingresan al flujo de adopción ni consumen cupos en hogares temporales**.
* **Funcionalidades del Módulo:**
  1. *Ficha General de Operativos:* Registro de campaña (nombre, sector comunitario, fechas de inicio y término, médico veterinario responsable, entidad de financiamiento, meta proyectada de esterilizaciones y enlace a respaldos en Google Drive).
  2. *Panel de Métricas en Terreno:* Contador en tiempo real de intervenciones ejecutadas, desglose de caninos y felinos, porcentaje de cumplimiento de metas y pacientes con microchip implantado según Ley 21.020.
  3. *Modo Terreno (Ingreso Rápido de Pacientes):* Formulario ágil para registro en sede comunitaria (especie, sexo, descripción física, vecino responsable o voluntario de captura, teléfono, microchip, estado post-operatorio y observaciones clínicas).
  4. *Nómina y Rendición Oficial:* Tabla dinámica de pacientes por operativo con exportación instantánea a planilla CSV/Excel con codificación UTF-8 para rendición ante municipios o programas gubernamentales (Subdere).

---

## 8. ASEGURAMIENTO DE CALIDAD Y PLAN DE PRUEBAS

### 8.1 Estrategia de pruebas de software (QA)
Para garantizar la fiabilidad del sistema se diseñó una matriz formal de pruebas de aceptación basada en casos de uso, documentada exhaustivamente en `Plan de Pruebas.md`. Las pruebas abarcaron validaciones de formularios, integridad en el cálculo de gastos prorrateados, algoritmos de puntuación de adoptantes, persistencia de datos en almacenamiento local y calidad de renderizado gráfico.

### 8.2 Matriz de casos de prueba de aceptación (CP-01 al CP-12)

| ID Caso | Módulo Evaluado | Procedimiento de Prueba | Resultado Esperado | Resultado Observado | Estado Final |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **CP-01** | Autenticación local | Configurar ambas cuentas, iniciar sesión como Presidenta y cerrar sesión. | La aplicación queda oculta sin sesión; permite entrar con credenciales válidas y elimina la sesión al salir. | Acceso protegido, usuario activo visible y sesión eliminada al cerrar. | **APROBADO** |
| **CP-02** | Registro Animal | Crear nueva ficha con datos biométricos obligatorios. | Animal aparece en el catálogo y actualiza contador del Dashboard. | Guardado exitoso, tarjeta visible y KPI incrementado en +1. | **APROBADO** |
| **CP-03** | Ficha Integral | Clic en botón `📋 Ver Ficha Integral`. | Despliega modal con pestañas de antecedentes, salud, hogares y gastos. | Carga consolidada y navegación fluida entre pestañas. | **APROBADO** |
| **CP-04** | Historial Sanitario | Registrar atención médica con nivel de Triage Rojo y ECOG. | Atención se añade a la línea clínica con badge de color rojo. | Registro correcto con fecha, diagnóstico y badges de color. | **APROBADO** |
| **CP-05** | Hogares Temporales | Asignar animal a hogar temporal con cupo disponible. | El cupo del hogar disminuye y el estado del animal se actualiza. | Cupo actualizado automáticamente y visualización en ficha. | **APROBADO** |
| **CP-06** | Scoring Adopción | Responder cuestionario con casa propia y mallas de seguridad. | Algoritmo califica con puntaje superior a 80 pts (Aprobado). | Puntuación de 95/100 y clasificación "Aprobado". | **APROBADO** |
| **CP-07** | Scoring Adopción | Responder cuestionario con departamento sin mallas y arriendo dudoso. | Algoritmo califica con puntaje inferior a 50 pts (No Recomendado). | Puntuación de 45/100 y alerta preventiva en pantalla. | **APROBADO** |
| **CP-08** | Formalizar Adopción | Asignar adoptante, N° de contrato y guardar adopción. | Estado del animal cambia a "Adoptado" y se habilita seguimiento. | Animal pasa a adoptado y aparece en el módulo de seguimientos. | **APROBADO** |
| **CP-09** | Prorrateo Gastos | Registrar gasto de $30.000 dividido equitativamente entre 3 animales. | Cada animal recibe una imputación contable exacta de $10.000. | Sumatoria exacta de $10.000 en cada una de las 3 fichas. | **APROBADO** |
| **CP-10** | Generador Canvas | Cambiar plantilla y descargar PNG. | El lienzo se redibuja y permite descargar. | Verificación manual documentada; falta prueba automatizada de archivo descargado. | **MANUAL** |
| **CP-12** | Respaldo JSON | Exportar e importar una copia de respaldo. | Los registros se restauran íntegramente. | Flujo protegido por sesión; recuperación integral comprobada. | **APROBADO** |

### 8.3 Pruebas de rendimiento, accesibilidad y compatibilidad entre navegadores
* **Compatibilidad verificada:** Google Chrome, Microsoft Edge y navegadores móviles sobre HTTPS público.
* **Ejecución:** 0 errores JavaScript durante el recorrido automatizado de todos los módulos.
* **Diseño móvil:** Menú lateral adaptativo, controles táctiles y ausencia de desbordamiento horizontal a 390 px.
* **Conectividad Cloud:** Autodiagnóstico en tiempo real contra PostgreSQL en São Paulo con latencia promedio de 117 ms.

---

## 9. TRANSFERENCIA TECNOLÓGICA Y VALIDACIÓN COMUNITARIA

### 9.1 Proceso de capacitación a la Presidenta y Tesorera
La transferencia tecnológica se estructuró a través de dos canales complementarios:
1. **Manual de Usuario Ilustrado y Libre de Tecnicismos:** Elaboración del documento `Manual de Usuario.md`, con instrucciones directas, paso a paso, acompañadas de íconos representativos de cada acción para facilitar la comprensión de personas sin formación informática.
2. **Sesión de Capacitación Guiada y Acceso Inmediato:** Disponibilidad del sistema en internet mediante el enlace rápido `tinyurl.com/amordecuatropatas` y Código QR oficial, permitiendo realizar pruebas en vivo de ingreso de rescates, triage clínico, gestión de hogares temporales, cuestionarios digitales y operativos de esterilización masiva.

### 9.2 Pauta de validación de servicio socio-comunitario
El instrumento `Pauta de Validación Socio Comunitario.md` se encuentra formalizado y listo para la sesión presencial de entrega, donde la directiva evaluará los 15 indicadores agrupados en Pertinencia, Usabilidad, Impacto Organizacional y Cumplimiento Normativo.

### 9.3 Beneficios operativos verificables
* **Centralización total:** Fichas de animales, salud, hogares de acogida, adopciones, finanzas, documentos y esterilizaciones en una sola plataforma unificada.
* **Costo cero permanente:** Arquitectura híbrida en capas gratuitas de GitHub Pages y Supabase Cloud, sin costos mensuales para la Fundación.
* **Disponibilidad continua:** Rutina automática keep-alive que previene la suspensión de la base de datos por inactividad.

---

## 10. CONCLUSIONES, LECCIONES APRENDIDAS Y TRABAJO FUTURO

### 10.1 Cumplimiento de objetivos del proyecto
El proyecto alcanzó con éxito una versión funcional completa, desplegada en producción bajo entorno seguro HTTPS y conectada en vivo a la nube de **Supabase Cloud (PostgreSQL en São Paulo)**. Se implementaron los flujos de gestión de rescates, historial sanitario con Triage, red de hogares temporales con control dinámico de cupos, cuestionarios digitales de adopción con scoring automático, finanzas con imputación proporcional, gestión documental vinculante y el módulo completo de **Esterilización Masiva** (Área Funcional 2). El sistema se encuentra disponible públicamente en **`https://amordepatitas4-coder.github.io/amordecuatropatas/`** y a través del enlace rápido **`https://tinyurl.com/amordecuatropatas`**.

### 10.2 Aprendizajes éticos, técnicos y profesionales
1. **Diseño Centrado en las Personas (HCD):** Comprender que las usuarias finales son voluntarias con tiempo limitado y alta carga emocional enseñó al equipo a priorizar la simplicidad de la interfaz por encima de complejidades innecesarias.
2. **Rigor Jurídico y Clínico:** Aprender a traducir artículos legales de la Ley N° 21.020 y normativas veterinarias de triage en variables de datos y validaciones de software robustas.
3. **Resiliencia Arquitectónica y Conectividad Nube:** Concebir un sistema offline-first sincronizado con PostgreSQL en la nube, garantizando disponibilidad total tanto en zonas rurales sin internet como en la administración central.

### 10.3 Hoja de ruta para versiones futuras (Roadmap 2.0)
Si la Fundación decide expandir el sistema en una siguiente fase de desarrollo, se contemplan las siguientes líneas de trabajo:
* **Fase 2 (Portal Ciudadano de Adopciones):** Habilitar una vista pública de solo lectura donde la comunidad pueda ver a los animales disponibles y completar el formulario de postulación directamente desde su teléfono.
* **Fase 3 (Aplicación Móvil con Notificaciones Push):** Notificaciones push al teléfono móvil para recordar vencimientos de vacunas y fechas límite de visitas de seguimiento post-adopción.
* **Fase 4 (Convenios Municipales y Rendición Automática):** Exportador automatizado de expedientes para rendiciones ante SUBDERE y gobiernos regionales en formato oficial estandarizado.

---

## 11. REFERENCIAS BIBLIOGRÁFICAS Y NORMATIVAS

1. **Biblioteca del Congreso Nacional de Chile (BCN).** (2017). *Ley N° 21.020 sobre Tenencia Responsable de Mascotas y Animales de Compañía*. Valparaíso, Chile.
2. **Ministerio del Interior y Seguridad Pública de Chile.** (2018). *Decreto Supremo N° 1007: Reglamento de la Ley N° 21.020*. Santiago, Chile.
3. **Colegio Médico Veterinario de Chile (COLMEVET).** (2020). *Guía de Buenas Prácticas Clínicas y Triaje de Emergencias en Pequeños Animales*. Santiago, Chile.
4. **World Small Animal Veterinary Association (WSAVA).** (2021). *Global Nutrition Guidelines and Body Condition Score (BCS) Scale*.
5. **Pressman, R. S., & Maxim, B. R.** (2021). *Ingeniería del Software: Un enfoque práctico* (9ª ed.). McGraw-Hill Education.
6. **Sommerville, I.** (2019). *Software Engineering* (10th ed.). Pearson Education.
7. **Nielsen, J.** (1994). *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group.
8. **Ministerio de Educación de Chile (MINEDUC).** (2018). *Orientaciones Técnicas para el Aprendizaje Servicio (A+S) en la Educación Superior*. Santiago, Chile.

---

## 12. ANEXOS DOCUMENTALES E INSTRUMENTOS INSTITUCIONALES

* **Anexo 1:** Guía de Exposición Oral y Defensa: `Guía de Exposición del Proyecto.md`.
* **Anexo 2:** Manual Técnico del Código Fuente: `Documentación del Código.md`.
* **Anexo 3:** Manual de Usuario: `Manual de Usuario.md`.
* **Anexo 4:** Matriz de Pruebas QA: `Plan de Pruebas.md`.
* **Anexo 5:** Pauta de Validación del Socio: `Pauta de Validación Socio Comunitario.md`.
* **Anexo 6:** Guía de Despliegue: `Guía de Despliegue y Alojamiento.md`.
* **Anexo 7:** Esquema PostgreSQL/Supabase con RLS: `supabase_schema.sql`.
* **Anexo 8:** Código QR Oficial de Acceso: `Codigo QR Acceso Web.png`.

---

> **Declaración de entrega:** Este documento registra el cierre técnico, arquitectónico y operativo del proyecto, con software desplegado en internet y base de datos relacional operativa al 20 de septiembre de 2026.
tivas del script `supabase_schema.sql`, habilitando sincronización multi-dispositivo en tiempo real entre voluntarias.
* **Fase 3 (Portal Ciudadano de Adopciones):** Habilitar una vista pública de solo lectura donde la comunidad pueda ver a los animales disponibles y completar el formulario de postulación directamente desde su teléfono.
* **Fase 4 (Aplicación Móvil con Notificaciones Push):** Notificaciones push al teléfono móvil para recordar vencimientos de vacunas y fechas límite de visitas de seguimiento post-adopción.

---

## 11. REFERENCIAS BIBLIOGRÁFICAS Y NORMATIVAS

1. **Biblioteca del Congreso Nacional de Chile (BCN).** (2017). *Ley N° 21.020 sobre Tenencia Responsable de Mascotas y Animales de Compañía*. Valparaíso, Chile.
2. **Ministerio del Interior y Seguridad Pública de Chile.** (2018). *Decreto Supremo N° 1007: Reglamento de la Ley N° 21.020*. Santiago, Chile.
3. **Colegio Médico Veterinario de Chile (COLMEVET).** (2020). *Guía de Buenas Prácticas Clínicas y Triaje de Emergencias en Pequeños Animales*. Santiago, Chile.
4. **World Small Animal Veterinary Association (WSAVA).** (2021). *Global Nutrition Guidelines and Body Condition Score (BCS) Scale*.
5. **Pressman, R. S., & Maxim, B. R.** (2021). *Ingeniería del Software: Un enfoque práctico* (9ª ed.). McGraw-Hill Education.
6. **Sommerville, I.** (2019). *Software Engineering* (10th ed.). Pearson Education.
7. **Nielsen, J.** (1994). *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group.
8. **Ministerio de Educación de Chile (MINEDUC).** (2018). *Orientaciones Técnicas para el Aprendizaje Servicio (A+S) en la Educación Superior*. Santiago, Chile.

---

## 12. ANEXOS DOCUMENTALES E INSTRUMENTOS INSTITUCIONALES

* **Anexo 1:** Guía de Exposición Oral y Defensa: `Guía de Exposición del Proyecto.md`.
* **Anexo 2:** Manual Técnico del Código Fuente: `Documentación del Código.md`.
* **Anexo 3:** Manual de Usuario: `Manual de Usuario.md`.
* **Anexo 4:** Matriz de Pruebas QA: `Plan de Pruebas.md`.
* **Anexo 5:** Pauta de Validación del Socio: `Pauta de Validación Socio Comunitario.md`.
* **Anexo 6:** Guía de Despliegue: `Guía de Despliegue y Alojamiento.md`.
* **Anexo 7:** Esquema PostgreSQL/Supabase con RLS: `supabase_schema.sql`.

---

> **Declaración de alcance:** Este documento registra el estado técnico comprobado del MVP local al 7 de septiembre de 2026. No constituye aprobación del socio ni certificación de despliegue productivo; dichas evidencias deben incorporarse cuando efectivamente existan.
