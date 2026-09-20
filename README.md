# Proyecto A+S 🚀 — Fundación Amor de Cuatro Patas

Sistema Web Integral de Gestión de Rescate y Adopción Animal, desarrollado en contexto **Aprendizaje + Servicio (A+S)** para la **Fundación Amor de Cuatro Patas**.

> **Estado verificado (7 de septiembre de 2026):** MVP local con autenticación obligatoria, filtros e integridad mejorados. La conexión con Supabase, la IA generativa remota, el hosting público y la validación firmada del socio continúan pendientes. Consulte [`Registro de Cambios y Estado.md`](Registro de Cambios y Estado.md).

---

## 📚 Documentación Técnica y Académica Completa

0. 🎓 **[`Informe Final del Proyecto.md`](Informe Final del Proyecto.md)**:
   - **Monografía e Informe Final Académico Maestro (~24 páginas de extensión y profundidad formal).**
   - Estructurado en 12 capítulos: Resumen Ejecutivo, Marco Contextual Maule, Ley 21.020, Árbol de Problemas, Fundamentación A+S, Matriz MoSCoW RF/RNF, Arquitectura SPA, Diccionario de Datos Relacional, Casos de Prueba QA, Validación Comunitaria y Hoja de Ruta.

1. 📋 **[`Documentación del Proyecto.md`](Documentación del Proyecto.md)**:
   - Ficha técnica de especificación de requisitos levantados con el socio comunitario.

2. 📖 **[`Documentación del Código.md`](Documentación del Código.md)**:
   - Explicación didáctica y técnica de cada archivo, función y módulo JavaScript.

3. 📘 **[`Manual de Usuario.md`](Manual de Usuario.md)**:
   - Guía práctica no técnica para la Presidenta y la Tesorera de la Fundación.

4. 🧪 **[`Plan de Pruebas.md`](Plan de Pruebas.md)**:
   - Plan y matriz formal de pruebas funcionales (casos de prueba CP-01 a CP-13).

5. 🤝 **[`Pauta de Validación Socio Comunitario.md`](Pauta de Validación Socio Comunitario.md)**:
   - Instrumento formal de validación y escala de usabilidad SUS para el socio comunitario.

6. 🎤 **[`Guía de Exposición del Proyecto.md`](Guía de Exposición del Proyecto.md)**:
   - Guion de presentación y respuestas preparadas a preguntas de la comisión académica.

7. 🚀 **[`Guía de Despliegue y Alojamiento.md`](Guía de Despliegue y Alojamiento.md)**:
   - Instrucciones para publicar el sitio web gratis en GitHub Pages y Vercel.

8. 🗄️ **[`supabase_schema.sql`](supabase_schema.sql)**:
   - Script SQL relacional listo para ejecutar en PostgreSQL / Supabase con RLS y datos semilla.

9. ✅ **[`Registro de Cambios y Estado.md`](Registro de Cambios y Estado.md)**:
   - Cambios implementados, pruebas ejecutadas, límites actuales y orden seguro de conexión.

---

## 📁 Estructura del Proyecto

```
A_S/
├── index.html                   # Interfaz completa de la aplicación SPA
├── index.css                    # Sistema de diseño responsivo y Glassmorphic
├── supabase_schema.sql          # Esquema de base de datos relacional PostgreSQL / Supabase
├── Registro de Cambios y Estado.md # Estado comprobado y pendientes reales
├── Documentación del Proyecto.md # Levantamiento de requerimientos y especificación
├── Documentación del Código.md      # Manual explicativo del código fuente
├── README.md                    # Guía general de inicio
└── js/
    ├── db.js                    # Motor de datos relacional y persistencia local (con exportación JSON)
    ├── auth.js                  # Configuración de cuentas, login y sesión local protegida
    ├── app.js                   # Controlador principal y enrutador SPA
    └── modules/
        ├── animals.js           # Fichas de animales, filtros y Ficha Integral con pestañas
        ├── health.js            # Historial sanitario cronológico y atenciones médicas
        ├── homes.js             # Hogares temporales y familias de paso
        ├── adoptions.js         # Adopciones, contratos y seguimientos post-adopción
        ├── expenses.js          # Control de gastos clasificados (por animal o general)
        ├── documents.js         # Repositorio de documentos oficiales y enlaces Drive
        ├── diffusion.js         # Borradores locales y creador de Flyers en Canvas
        └── reports.js           # Indicadores clave (KPIs), métricas y reportes imprimibles
```

---

## 🌐 Cómo Ejecutar y Visualizar el Proyecto

Puedes abrir directamente el archivo en cualquier navegador web moderno:
👉 Abre `index.html` mediante un servidor local desde la carpeta del proyecto.
