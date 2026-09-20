# Guía de Despliegue y Hosting Gratuito
## Sistema Web de Gestión — Fundación Amor de Cuatro Patas (A+S)

> **Estado y propósito:** Guía para una etapa posterior. **No se debe publicar con datos reales mientras la aplicación use autenticación y almacenamiento locales.** Primero se debe conectar Supabase Auth, verificar las políticas RLS, configurar secretos fuera del navegador y ejecutar pruebas de seguridad.

## Requisitos obligatorios antes de publicar

1. Crear el proyecto Supabase y aplicar `supabase_schema.sql`.
2. Crear las dos identidades autorizadas mediante Supabase Auth y asociarlas en `usuarios_autorizados`.
3. Sustituir el almacenamiento local por consultas autenticadas y comprobar que una sesión anónima no pueda leer ni modificar datos.
4. Mantener claves privadas e integraciones de IA únicamente en funciones de servidor.
5. Probar respaldo, recuperación, cierre de sesión, caducidad, RLS y acceso desde móvil.
6. Usar datos ficticios hasta obtener autorización y validación formal del socio.

---

## Opción 1: Despliegue en GitHub Pages (Recomendado para Proyectos Académicos)

Dado que el frontend es una aplicación web estática (HTML, CSS y JS), **GitHub Pages** ofrece alojamiento gratuito permanente con certificado de seguridad SSL (HTTPS).

### Pasos para publicar:
1. Si aún no tienes un repositorio en GitHub para el proyecto `A_S`:
   ```bash
   cd "C:\Users\smoli\Documents\Codex\A_S"
   git init
   git add .
   git commit -m "Versión MVP Sistema Web Fundación Amor de Cuatro Patas"
   ```
2. Crea un repositorio en tu cuenta de GitHub (ejemplo: `gestion-amor-cuatro-patas`).
3. Sube los archivos a GitHub:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/gestion-amor-cuatro-patas.git
   git branch -M main
   git push -u origin main
   ```
4. En GitHub, ve a la pestaña **Settings** (Configuración) de tu repositorio.
5. En el menú lateral izquierdo, haz clic en **Pages**.
6. En la sección **Build and deployment > Branch**, selecciona la rama `main` y la carpeta `/ (root)`.
7. Haz clic en **Save** (Guardar).
8. En 1 o 2 minutos, GitHub te entregará el enlace público:
   👉 `https://TU_USUARIO.github.io/gestion-amor-cuatro-patas/`

---

## Opción 2: Despliegue Inmediato en Vercel (Sin Comandos)

Vercel permite desplegar sitios web en menos de 30 segundos:

1. Ingresa a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub o correo.
2. Haz clic en **"Add New... > Project"**.
3. Importa tu repositorio de GitHub de la Fundación.
4. En **Root Directory**, selecciona la carpeta `A_S`.
5. Presiona **Deploy**.
6. Vercel te entregará un enlace instantáneo con dominio gratis:
   👉 `https://amor-de-cuatro-patas.vercel.app`

---

## Opción 3: Probar en el Celular por Red WiFi Local (Sin Subir a Internet)

Si quieres mostrarle la aplicación en el celular a alguien que esté contigo en la misma red WiFi:

1. Abre la terminal PowerShell en la carpeta `A_S`:
   ```powershell
   python -m http.server 8080 --directory "C:\Users\smoli\Documents\Codex\A_S"
   ```
2. Averigua la dirección IP de tu computador con el comando:
   ```powershell
   ipconfig
   ```
   *(Busca la línea "Dirección IPv4", por ejemplo `192.168.1.45`)*.
3. En el navegador del teléfono móvil conectado al mismo WiFi, escribe:
   `http://192.168.1.45:8080`
4. Podrás usar la aplicación en el celular de inmediato.
