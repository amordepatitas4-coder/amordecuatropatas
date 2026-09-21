# Proyecto A+S 🐾 — Fundación Amor de Cuatro Patas

Sistema Web Integral de Gestión de Rescates, Trazabilidad Sanitaria y Adopciones Responsables, desarrollado bajo el modelo **Aprendizaje + Servicio (A+S)** para la **Fundación Amor de Cuatro Patas**.

---

## 🌐 Acceso y Despliegue en Línea

El sistema se encuentra desplegado y disponible públicamente en:

👉 **[https://amordepatitas4-coder.github.io/amordecuatropatas/](https://amordepatitas4-coder.github.io/amordecuatropatas/)**

* **Portal Ciudadano (Público):** Permite a cualquier persona de la comunidad ver el catálogo de perritos y gatitos rescatados y postular a una adopción responsable en línea regida por la Ley 21.020, sin necesidad de contraseñas.
* **Panel de Gestión (Equipo / Directiva):** Acceso administrativo protegido para la Presidenta y la Tesorera de la Fundación mediante el botón superior **`🔒 Ingreso Equipo / Directiva`**.

---

## ✨ Características Principales

1. **🐾 Portal Ciudadano de Adopción:**
   - Catálogo interactivo con filtros por especie (Caninos y Felinos).
   - Formulario digital de postulación basado en los estándares de la **Ley 21.020 de Tenencia Responsable**.
   - Evaluación y puntaje automático de aptitud del postulante.

2. **📋 Fichas Integrales de Animales:**
   - Registro de datos biométricos, fotografías, estado operativo, personalidad y descripción.
   - Pestañas completas de historial sanitario, hogares temporales, gastos y postulaciones asociadas.

3. **🩺 Historial Sanitario y Tratamientos:**
   - Control de vacunas (óctuple, antirrábica, triple felina), desparasitaciones, cirugías y tratamientos clínicos.

4. **✂️ Operativos de Esterilización Masiva:**
   - Planificación de campañas en terreno para animales comunitarios y en situación de calle.
   - Registro de pacientes, control de microchips y distribución por especie.

5. **🏡 Hogares Temporales y Familias de Paso:**
   - Base de datos de hogares de acogida con capacidad y asignación activa de rescatados.

6. **🤝 Formalización de Adopciones y Seguimiento:**
   - Generación de contratos oficiales con número de folio único.
   - Bitácora de seguimiento post-adopción con botón directo de contacto por **WhatsApp**.

7. **💰 Gestión Financiera y Finanzas Claras:**
   - Registro clasificado de ingresos, donaciones y egresos por rescate o general.

8. **🎨 Difusión y Asistente de Flyers:**
   - Generador automático de afiches en HTML5 Canvas listos para descargar y compartir en redes sociales.

9. **☁️ Sincronización en la Nube (Supabase Cloud):**
   - Base de datos relacional PostgreSQL alojada en región São Paulo con redundancia local offline.

---

## 📁 Estructura del Código

```
A_S/
├── index.html                   # Interfaz completa (Portal Público + Panel SPA)
├── index.css                    # Sistema de diseño responsivo y tema visual moderno
├── supabase_schema.sql          # Esquema relacional SQL (tablas, RLS y políticas)
├── README.md                    # Descripción general y acceso al proyecto
└── js/
    ├── app.js                   # Controlador principal y enrutador SPA
    ├── auth.js                  # Control de accesos criptográfico (PBKDF2) y roles
    ├── db.js                    # Motor de datos relacional y persistencia local
    ├── supabase_client.js       # Cliente de sincronización con Supabase Cloud
    └── modules/
        ├── adoptions.js         # Portal público ciudadano, adopciones y WhatsApp
        ├── animals.js           # Fichas clínicas y catálogo de animales
        ├── health.js            # Historial sanitario cronológico
        ├── homes.js             # Hogares temporales y asignaciones
        ├── esterilizaciones.js  # Módulo de operativos masivos en terreno
        ├── expenses.js          # Control de gastos e ingresos
        ├── documents.js         # Repositorio de actas y contratos
        ├── diffusion.js         # Creador de flyers en HTML5 Canvas
        └── reports.js           # Indicadores de gestión y reportes imprimibles
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: En Línea (Recomendada)
Accede directamente desde cualquier dispositivo o navegador web moderno:
👉 **[https://amordepatitas4-coder.github.io/amordecuatropatas/](https://amordepatitas4-coder.github.io/amordecuatropatas/)**

### Opción 2: Ejecución Local
Si deseas ejecutar o editar el proyecto en tu entorno local (VS Code, NetBeans u otro editor):
1. Clona el repositorio:
   ```bash
   git clone https://github.com/amordepatitas4-coder/amordecuatropatas.git
   ```
2. Inicia un servidor local ligero en la carpeta del proyecto:
   * Con **Python**: `python -m http.server 8080` y abre `http://localhost:8080`
   * Con la extensión **Live Server** de VS Code: clic derecho en `index.html` > *Open with Live Server*.
