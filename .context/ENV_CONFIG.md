# CONFIGURACIÓN DEL ENTORNO DE TRABAJO (ENV_CONFIG.md)

Este documento define los lineamientos, directivas y parámetros de configuración para el entorno de desarrollo y despliegue del proyecto **Portal FEDER** en Laravel, Inertia.js, React y PostgreSQL.

---

## 1. Directivas Críticas del Entorno (Advertencias de Cátedra)

* **Persistencia de Sesiones Inicial (`SESSION_DRIVER`):**
  * En versiones modernas de Laravel, las sesiones vienen configuradas para base de datos (`SESSION_DRIVER=database`), lo que produce un error de arranque inmediato al no existir la tabla `sessions` en PostgreSQL[cite: 5].
  * Se debe configurar explícitamente en el `.env`:
    ```env
    SESSION_DRIVER=file
    ```
  * Esto permite que la aplicación arranque de inmediato utilizando el almacenamiento en archivos locales sin depender de tablas temporales de sesión[cite: 5].

* **Permisos del Servidor y Sistema Operativo (Linux / SELinux):**
  * Para servidores Linux (Fedora/CentOS/RedHat) en entornos institucionales, se debe asegurar que el servicio web (`httpd` / `nginx`) tenga permisos explícitos de lectura y escritura[cite: 5]:
    ```bash
    chmod -R 775 storage bootstrap/cache
    # En caso de SELinux activo:
    chcon -R -t httpd_sys_rw_content_t storage bootstrap/cache
    ```

* **Prevención de Sobrescritura de Migraciones Base:**
  * Al integrar herramientas de autenticación (como Laravel Breeze) o ejecutar migraciones, **no** se deben ejecutar migraciones que creen tablas genéricas (`users`, `failed_jobs`, `password_reset_tokens`) si estas entran en conflicto con la base de datos preexistente en PostgreSQL (`USUARIO`, `ROL`, etc.)[cite: 2, 5].

---

## 2. Configuración de Variables de Entorno (`.env`)

El archivo `.env` del backend debe reflejar la conexión a la base de datos PostgreSQL alojada en el servidor institucional del docente:

```env
APP_NAME="Portal FEDER"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE="America/La_Paz"
APP_URL=http://localhost:8000

APP_LOCALE=es
APP_FALLBACK_LOCALE=es
APP_FAKER_LOCALE=es_ES

LOG_CHANNEL=stack
LOG_LEVEL=debug

# ==============================================================================
# CONEXIÓN A BASE DE DATOS (POSTGRESQL - SERVIDOR DOCENTE)
# ==============================================================================
DB_CONNECTION=pgsql
DB_HOST="mail.tecnoweb.org.bo   # Reemplazar por la IP del servidor institucional si es remoto
DB_PORT=5432
DB_DATABASE=db_grupo16sc        # Nombre exacto asignado en el servidor
DB_USERNAME=grupo16sc       # Usuario asignado al grupo

DB_PASSWORD=grup016grup016* # Contraseña del servidor

# ==============================================================================
# GESTIÓN DE SESIONES Y CACHÉ
# ==============================================================================
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
CACHE_STORE=file
CACHE_PREFIX=

# Mantener en 'file' para evitar fallas antes de migrar tablas de sesión
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

# ==============================================================================
# CONFIGURACIÓN DE CORREO SALIENTE (SMTP - NOTIFICACIONES Y DONACIONES)
# ==============================================================================
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=mail.tecnoweb.org.bo  # Servidor SMTP de la materia o proveedor
MAIL_PORT=587
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="no-reply@feder.org.bo"
MAIL_FROM_NAME="${APP_NAME}"

# ==============================================================================
# VITE / FRONTEND (REACT)
# ==============================================================================
VITE_APP_NAME="${APP_NAME}"