 Estado del Proyecto - Portal FEDER

**Fecha de última actualización:** 2 de Noviembre de 2026  
**Stack:** Laravel 11 + Inertia.js v2 + React 18 + Tailwind CSS + PostgreSQL (Esquema: `feder`)

---

## 1. Resumen de Implementación Actual
- **Caso de uso completado:** **CU-01 (Autenticación, Gestión de Usuarios y Roles)**.
- **Archivos creados/modificados:**
  - **Modelos:**
    - `app/Models/Rol.php` (Mapeo a `feder.rol`, PK: `id_rol`, relación `hasMany` con Usuario).
    - `app/Models/Usuario.php` (Mapeo a `feder.usuario`, PK: `id_usuario`, implementación `Authenticatable`, helper `hasRole()`, relación `belongsTo` con Rol).
    - `app/Models/Auditoria.php` (Mapeo a `feder.auditoria`, PK: `id_auditoria`, método estático `registrar()`).
  - **Controladores y Requests:**
    - `app/Http/Controllers/Auth/AuthenticatedSessionController.php` (Login con validación en `feder.usuario` y auditoría de accesos).
    - `app/Http/Requests/Auth/LoginRequest.php` (Autenticación con correo, soporte Hash / SHA256 / texto plano con auto-upgrade y rate limiting).
    - `app/Http/Controllers/Admin/DashboardController.php` (Panel de bienvenida, métricas y visor de auditoría).
    - `app/Http/Controllers/Admin/UsuarioController.php` (CRUD completo de usuarios, thin controller con menos de 160 líneas y registro en auditoría).
    - `app/Http/Requests/StoreUsuarioRequest.php` (Validación de inserción con unicidad en `feder.usuario`).
    - `app/Http/Requests/UpdateUsuarioRequest.php` (Validación de edición ignorando ID actual y contraseña opcional).
  - **Vistas React:**
    - `resources/js/Layouts/AdminLayout.jsx` (Layout administrativo con sidebar condicional por rol, topbar, badges cromáticos de FEDER y alertas flash).
    - `resources/js/Pages/Auth/Login.jsx` (Pantalla de login institucional con paleta verde/naranja FEDER).
    - `resources/js/Pages/Admin/Dashboard.jsx` (Dashboard administrativo con métricas de usuarios, roles y tabla de auditoría).
    - `resources/js/Pages/Admin/Usuarios/Index.jsx` (Listado de usuarios con filtros por búsqueda, rol y estado, badges y acciones).
    - `resources/js/Pages/Admin/Usuarios/Create.jsx` (Formulario de creación con hook `useForm` de Inertia).
    - `resources/js/Pages/Admin/Usuarios/Edit.jsx` (Formulario de edición con hook `useForm` de Inertia).
  - **Rutas y Middlewares:**
    - `app/Http/Middleware/CheckRole.php` (Middleware de verificación de roles con alias `role`).
    - `app/Http/Middleware/HandleInertiaRequests.php` (Compartición de usuario autenticado con rol y notificaciones flash).
    - `routes/web.php` (Rutas `/login`, `/logout`, `/admin/dashboard` y `/admin/usuarios/*` protegidas por rol Director).
    - `config/auth.php` y `config/database.php` (Configuración de proveedor de autenticación hacia `Usuario` y search path `feder,public`).
- **Estado de compilación:**
  - Compilación exitosa con Vite (`npm run build`: 1003 módulos transformados sin errores).
  - Verificación de límite de líneas (todos los archivos bajo el umbral de 150-200 líneas).
  - Cumplimiento estricto de CODING_STANDARDS.md con comentarios y DocBlocks 100% en español.
  - Conexión activa a base de datos PostgreSQL institucional verificada.

---

## 2. Matriz de Casos de Uso

| Caso de Uso | Módulo / Descripción | Roles Permitidos | Estado |
| :--- | :--- | :--- | :--- |
| **CU-01** | Autenticación, Gestión de Usuarios y Roles | Director | **Implementado** |
| **CU-02** | Información Institucional y Redes | Director | Pendiente |
| **CU-03** | Publicaciones, Galerías y Testimonios | Director, Instructor | Pendiente |
| **CU-04** | Comunidades y Programas Productivos | Director, Instructor | Pendiente |
| **CU-05** | Campañas de Recaudación (Crowdfunding) | Director | Pendiente |
| **CU-06** | Intenciones de Aporte y Donaciones | Director, Secretaria | Pendiente |
| **CU-07** | Bandeja de Consultas Ciudadanas | Director, Secretaria | Pendiente |
| **CU-08** | Reportes Estadísticos y Exportación PDF | Director | Pendiente |

---

## 3. Próximos Pasos :
- Configurar y arrancar la implementación del **CU-02: Información Institucional y Redes Sociales**.

