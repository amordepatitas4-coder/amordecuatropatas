# Guía de Despliegue y Alojamiento Oficial
## Sistema Web de Gestión — Fundación Amor de Cuatro Patas (A+S)

> **Estado del Despliegue:** ¡Completado y Activo en Producción! El sistema se encuentra publicado en internet bajo entorno seguro HTTPS en GitHub Pages, con enlace ultra corto para acceso rápido, código QR oficial y conexión directa a la base de datos PostgreSQL en Supabase Cloud (São Paulo, sa-east-1).

---

## 1. Enlaces Oficiales de Acceso en Línea

| Tipo de Acceso | Dirección Web | Uso Principal |
| :--- | :--- | :--- |
| **Enlace Ultra Corto (Rápido)** | **`https://tinyurl.com/amordecuatropatas`** | Celulares, dictado por voz, afiches y presentaciones académicas |
| **Enlace Institucional GitHub Pages** | **`https://amordepatitas4-coder.github.io/amordecuatropatas/`** | Dominio permanente con certificado SSL / HTTPS gratuito |
| **Repositorio Oficial de Código** | **`https://github.com/amordepatitas4-coder/amordecuatropatas`** | Control de versiones, código fuente y documentación |
| **Código QR Oficial** | Archivo: `Codigo QR Acceso Web.png` | Para escanear con la cámara del celular en terreno y eventos |

---

## 2. Credenciales y Roles de Acceso al Sistema

El sistema implementa control de acceso criptográfico local con hash seguro en el navegador del usuario:

| Perfil de Usuaria | Contraseña Oficial | Permisos y Alcance |
| :--- | :--- | :--- |
| **Presidenta de la Fundación** | `Presidenta2026!` | Acceso irrestricto: rescates, esterilizaciones masivas, adopciones, finanzas, documentos y administración global |
| **Tesorera de la Fundación** | `Tesorera2026!` | Acceso financiero y trazabilidad: registro de gastos, boletas, cotizaciones, donaciones y reportes contables |

---

## 3. Infraestructura Cloud y Base de Datos (Supabase)

El backend de datos opera en la nube de **Supabase Cloud**:

* **Región de Servidor:** São Paulo (`sa-east-1`), optimizada para mínima latencia en Chile (< 120 ms).
* **Motor:** PostgreSQL 15 con extensiones `pgcrypto` y `pg_cron`.
* **Esquema de Datos:** 12 tablas relacionales normalizadas que abarcan animales rescatados, historial sanitario, hogares temporales, cuestionarios de adopción digital, gastos, documentos y operativos de esterilización masiva.
* **Seguridad RLS (Row Level Security):** Políticas aplicadas para lectura y sincronización autorizada.
* **Mecanismo Anti Suspensión (Keep-Alive):** Tarea programada en `pg_cron` ejecutándose diariamente a las 05:00 UTC (`keep-alive-diario-fundacion`) para evitar la pausa por inactividad de los 7 días en el plan gratuito de Supabase.

---

## 4. Guía Rápida para el Usuario en Dispositivos Móviles

1. Abrir el navegador del celular (Chrome, Safari o navegador predeterminado).
2. Escribir **`tinyurl.com/amordecuatropatas`** o escanear el Código QR oficial.
3. Ingresar la contraseña `Presidenta2026!`.
4. En la barra superior, confirmar el distintivo verde **`🟢 Supabase Cloud Conectado`**.
5. Al hacer clic sobre el distintivo, se ejecuta la prueba de autodiagnóstico en vivo verificando la conexión y la latencia.
