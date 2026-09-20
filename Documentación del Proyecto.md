# Documentación del Proyecto: Sistema Web de Gestión — Fundación Amor de Cuatro Patas

> **Contexto:** Proyecto informático desarrollado en contexto A+S (Aprendizaje + Servicio).
> **Socio Comunitario:** Fundación Amor de Cuatro Patas.
> **Duración Estimada:** ~8 semanas (ejecución cercana a 6 semanas).
> **Tipo de Solución:** Sistema Web desarrollado como Producto Mínimo Viable (MVP) / Prototipo Funcional.

---

## 1. Identificación del Proyecto
* **Nombre Provisional:** Sistema Web de Gestión de Rescate y Adopción Animal — Fundación Amor de Cuatro Patas.
* **Socio Comunitario:** Fundación Amor de Cuatro Patas.
* **Tipo de Proyecto:** Proyecto A+S (Aprendizaje + Servicio).
* **Usuarias Principales:** Presidenta de la Fundación y Tesorera de la Fundación (ambas con el mismo nivel de acceso y permisos).

---

## 2. Problema Central
La Fundación Amor de Cuatro Patas gestiona la información de sus animales rescatados utilizando medios y registros dispersos. Esto dificulta:
- Centralizar los antecedentes de los animales.
- Mantener información histórica.
- Consultar rápidamente el estado de cada caso.
- Organizar antecedentes sanitarios.
- Mantener información de hogares temporales.
- Gestionar adopciones y seguimientos post-adopción.
- Organizar fotografías, videos y documentos.
- Conocer los gastos asociados por animal y generales.
- Obtener información consolidada para la toma de decisiones.
- Elaborar contenido de difusión para buscar adoptantes.

**Resumen:** Se requiere una herramienta centralizada que permita organizar, consultar y mantener la trazabilidad de la información asociada a los animales rescatados, apoyando sus procesos de cuidado, adopción, seguimiento, administración y difusión.

---

## 3. Información Levantada con el Socio
* **Necesidades Confirmadas:**
  - Fichas individuales con antecedentes sanitarios, rescates y adopciones.
  - Registro de hogares temporales y datos de adoptantes.
  - Registro de seguimientos y almacenamiento de multimedia (fotos/videos).
  - Control de gastos asociados a animales y gastos generales.
  - Informes consolidados y apoyo con Inteligencia Artificial (IA) generativa para crear contenido de difusión.
* **Perfiles de Acceso:** Presidenta y Tesorera (acceso total/mismos permisos).

---

## 4. Objetivos del Proyecto

### Objetivo General
Diseñar y desarrollar un prototipo funcional de un sistema web que permita centralizar y gestionar la información relacionada con los animales rescatados por la Fundación Amor de Cuatro Patas, manteniendo su trazabilidad y apoyando los procesos de cuidado, adopción, seguimiento, administración y difusión.

### Objetivos Específicos
1. **Diseño:** Diseñar un sistema web centralizado que organice la información mediante fichas individuales con datos principales, salud, estado dentro del proceso y contenido multimedia.
2. **Desarrollo:** Desarrollar un prototipo funcional que permita registrar, consultar, actualizar, buscar y filtrar las fichas, gestionando sus etapas y datos complementarios.
3. **IA Generativa:** Integrar una herramienta de IA generativa que utilice información autorizada de las fichas para generar borradores de difusión (con revisión humana obligatoria antes de publicar).

---

## 5. Unidad Central del Sistema y Modelo Conceptual
🐶 **El Animal es la entidad central del sistema.** Todas las áreas se relacionan directa o indirectamente con su ficha:

```
                                          ANIMAL
                                             │
       ┌──────────┬─────────┼─────────┬──────┴────┐
       ↓          ↓         ↓         ↓           ↓
    SALUD      ESTADOS   HOGARES   MULTIMEDIA   GASTOS
                                      │
                                      ↓
                                  ADOPCIÓN
                                      │
                                 ┌────┴─────────┐
                                 ↓              ↓
                             ADOPTANTE     SEGUIMIENTO

                                     DOCUMENTOS
                                         │
                        relacionados cuando corresponda
                                         │
                            Animal / Adopción / Gasto / etc.
```

---

## 6. Flujo General del Animal
```
RESCATE 
  ➔ INGRESO / REGISTRO 
  ➔ HOGAR TEMPORAL 
  ➔ CUARENTENA Y CUIDADOS 
  ➔ ATENCIÓN SANITARIA 
  ➔ VACUNACIÓN / ESTERILIZACIÓN 
  ➔ DISPONIBLE PARA ADOPCIÓN 
  ➔ BÚSQUEDA Y EVALUACIÓN DE ADOPTANTE 
  ➔ ADOPCIÓN 
  ➔ SEGUIMIENTO 
  ➔ REGISTRO HISTÓRICO
```

---

## 7. Principio de Trazabilidad
- **Conservación Histórica:** Los animales adoptados **NO se eliminan** de la base de datos.
- Su ficha continúa almacenando antecedentes generales, historial sanitario, hogares temporales, gastos, adoptante, seguimientos y documentación para generar estadísticas e informes futuros.

---

## 8. Componentes Funcionales del MVP

### 8.1 Gestión de Animales
- Registrar, consultar, actualizar, buscar, filtrar y gestionar estados.
- Consultar animales activos e históricos. Sin eliminación definitiva.

### 8.2 Historial Sanitario
- Historial cronológico con múltiples eventos (vacunación, desparasitación, control veterinario, esterilización, tratamientos, observaciones).

### 8.3 Hogares Temporales
- Registro del hogar temporal actual, fecha de ingreso, fecha de salida e historial de hogares previos por los que ha pasado el animal.

### 8.4 Adopciones y Adoptantes
- Relación: `ANIMAL ➔ ADOPCIÓN ➔ ADOPTANTE`.
- Registro de datos del adoptante, contrato y estado del proceso.
- *Pendiente:* Definir si se adjunta el formulario físico en PDF (Opción A) o si se digitaliza en un cuestionario del sistema (Opción B).

### 8.5 Seguimiento Post-Adopción
- Historial de seguimientos acumulativo (fecha, observaciones, medio de contacto como teléfono/email/visita).

### 8.6 Gestión de Gastos
- Clasificación de gastos:
  1. Gastos asociados a un animal específico (ej. veterinario Luna).
  2. Gastos compartidos entre varios animales (ej. saco de alimento).
  3. Gastos generales de la Fundación (ej. insumos de limpieza).

### 8.7 Gestión Documental Básica
- Registro de enlaces/referencias a formularios, cotizaciones, comprobantes y contratos en Google Drive o PDF.

### 8.8 Informes y Reportes
- Reportes filtrables por período: animales rescatados/adoptados, gastos por animal/categoría, resumen sanitario y seguimientos.

### 8.9 Estrategia Multimedia Híbrida
- **Fotos Operativas:** Hasta 2 fotos principales optimizadas en Supabase Storage (para fichas y flyers de difusión). Liberables tras la adopción para ahorrar espacio.
- **Fotos Adicionales y Videos:** Almacenamiento externo en Google Drive, registrando únicamente la URL en la base de datos.

### 8.10 Generación de Contenido e IA
- La IA lee datos autorizados del animal y genera un borrador de texto para redes sociales.
- **Revisión humana obligatoria:** La IA no publica de forma autónoma ni toma decisiones de adopción.

### 8.11 Generador de Flyers
- Herramienta frontend que combina la **fotografía real** + **datos del animal** + **texto de IA** + **plantilla gráfica con logo** para generar una imagen descargable sin ocupar espacio permanente en servidor.

---

## 9. Requerimientos Consolidados

### Requerimientos Funcionales (RF)
| ID | Requerimiento |
| :--- | :--- |
| **RF-01** | Autenticar usuarias autorizadas (Presidenta y Tesorera) con los mismos permisos. Implementado localmente; migración a Supabase Auth pendiente. |
| **RF-02** | Gestionar fichas de animales (registrar, consultar, actualizar, buscar, filtrar) conservando histórico. |
| **RF-03** | Gestionar el estado de cada animal durante sus distintas etapas conservando el historial. |
| **RF-04** | Registrar e inspeccionar el historial sanitario cronológico completo de cada animal. |
| **RF-05** | Gestionar los hogares temporales (actual e historial con fechas de ingreso/salida). |
| **RF-06** | Vincular fotografías operativas y enlaces externos de multimedia. |
| **RF-07** | Gestionar el proceso de adopción, adoptantes y documentación asociada. |
| **RF-08** | Gestionar el historial acumulativo de seguimientos post-adopción. |
| **RF-09** | Registrar y consultar gastos generales o asociados a uno o varios animales, con filtros por categoría, período y animal. |
| **RF-10** | Organizar referencias a documentos digitales y relacionarlas con animales, adopciones o gastos. |
| **RF-11** | Generar informes con filtros por período, estado y tipo de gasto. |
| **RF-12** | Generar borradores de contenido de difusión mediante IA generativa con revisión humana. Pendiente de endpoint seguro; la versión local utiliza plantillas. |
| **RF-13** | Excluir la publicación automática en redes sociales del alcance MVP (mejora futura). |

### Requerimientos No Funcionales (RNF)
| ID | Requerimiento |
| :--- | :--- |
| **RNF-01** | Interfaz sencilla, intuitiva y comprensible. |
| **RNF-02** | Diseño responsivo adaptado a PC, tablets y móviles. |
| **RNF-03** | Acceso restringido mediante autenticación segura. |
| **RNF-04** | Protección de datos personales de adoptantes. |
| **RNF-05** | Integridad relacional en la base de datos. |
| **RNF-06** | Trazabilidad histórica garantizada (sin borrado físico). |
| **RNF-07** | Arquitectura modular y mantenible. |
| **RNF-08** | Soporte para navegadores web modernos. |
| **RNF-09** | Protección de credenciales y claves API fuera del cliente web. |
| **RNF-10** | Almacenamiento multimedia optimizado/externo sin sobrecargar la base de datos. |
| **RNF-11** | Enlaces y documentos accesibles según permisos definidos. |
| **RNF-12** | Priorización de tecnologías y herramientas de bajo costo o gratuitas. |

### Estado verificado antes de la conexión

- **Implementado y probado localmente:** autenticación obligatoria de Presidenta/Tesorera, fichas, estados, salud, hogares, adopciones, seguimientos, gastos, documentos relacionados, informes filtrables, respaldos, flyers y diseño móvil.
- **Preparado pero no conectado:** esquema PostgreSQL, tabla de usuarias autorizadas, políticas RLS, relaciones normalizadas y claves foráneas.
- **Pendiente externo:** Supabase Auth, sincronización cloud, Storage, Edge Function de IA, hosting y configuración de permisos en Drive.
- **Pendiente comunitario:** completar, fechar y firmar `Pauta de Validación Socio Comunitario.md`.

La autenticación local almacena verificadores PBKDF2 y sesiones temporales, pero no sustituye la seguridad de servidor ni permite afirmar todavía cumplimiento productivo de RNF-03, RNF-04 y RNF-11.

---

## 10. Arquitectura y Tecnologías Candidatas
* **Frontend:** HTML5, CSS3 (Vanilla CSS con diseño responsivo / Glassmorphism), JavaScript ES6.
* **Backend as a Service (BaaS):** Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Edge Functions).
* **Integración de IA:** API Generativa (OpenAI / Gemini / Claude via Edge Functions).
* **Multimedia Externa & Respaldos:** Google Drive.

---

## 11. Alcance (Dentro vs Fuera del MVP)
* ✅ **Dentro del MVP local:** Web app, autenticación local, fichas de animales, historiales sanitarios, hogares temporales, adopciones, seguimientos, control de gastos, documentos relacionados, borradores locales, creador de flyers e informes filtrables.
* 🟡 **Siguiente fase obligatoria:** Supabase Auth y RLS antes de conectar datos; posteriormente, IA mediante Edge Function autenticada.
* ❌ **Fuera del MVP:** App móvil nativa, Sistema clínico veterinario completo, Contabilidad avanzada, Tienda online, Donaciones en línea, Publicación automática en redes sociales, Generación de fotos con IA, Selección autónoma de adoptantes.
