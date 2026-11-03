# GUÍA DE PLANTILLAS DE PROMPTS PARA AGENTES (PROMPTS_TEMPLATES.md)

Este documento contiene la secuencia estandarizada de prompts para delegar el desarrollo del **Portal FEDER** al agente autónomo de Antigravity. Cada prompt está estructurado para ejecutarse de forma aislada, garantizando el cumplimiento de los contratos de base de datos, arquitectura y límites de líneas de código.

---

## 0. Reglas de Oro para la Ejecución del Agente
1. **Lectura obligatoria:** Antes de ejecutar cualquier tarea, el agente debe revisar los archivos en `.context/`:
   - `ESQUEMA_DB.sql` (Contrato estricto de base de datos).
   - `CODING_STANDARDS.md` (Límites de 150-200 líneas, thin controllers, modularidad).
   - `ROUTES_MAP.md` (Estructura de URLs, permisos y nombres de ruta).
   - `UI_COMPONENTS_GUIDE.md` (Identidad institucional de FEDER, componentes reutilizables).
2. **Prohibición de migraciones destructivas:** La base de datos en PostgreSQL ya existe en el servidor. No se deben crear migraciones que intenten sobreescribir tablas como `USUARIO` con esquemas genéricos (`users`).

---

## FASE 1: Capa de Persistencia y Modelos Eloquent

### Prompt 1.1: Generación de Modelos Base (Mapeo a Base de Datos Existente)
```text
Actúa como desarrollador Senior en Laravel. Tu tarea es implementar los 12 modelos Eloquent necesarios para el sistema Portal FEDER, basándote estrictamente en el archivo `.context/ESQUEMA_DB.sql`.

Instrucciones estrictas:
1. Revisa .context/ESQUEMA_DB.sql y .context/CODING_STANDARDS.md.
2. Crea los siguientes modelos en `app/Models/`:
   - Rol.php
   - Usuario.php
   - Auditoria.php
   - PaginaInstitucional.php
   - RedSocial.php
   - Comunidad.php
   - ProgramaProductivo.php
   - Testimonio.php
   - Noticia.php
   - GaleriaMultimedia.php
   - Campana.php
   - Aporte.php
   - Consulta.php
3. En cada modelo debes especificar de forma obligatoria y explícita:
   - protected $table = 'NOMBRE_EXACTO_TABLA';
   - protected $primaryKey = 'nombre_exacto_pk';
   - public $timestamps = false; (o true únicamente si contiene created_at y updated_at).
   - protected $fillable = [...]; con todos los campos de inserción.
   - Relaciones Eloquent exactas (belongsTo, hasMany) con sus llaves foráneas y locales explícitas.
4. Cada archivo debe mantenerse bajo 150 líneas de código y contener comentarios claros sobre su función.
```

---

## FASE 2: Adaptación de Autenticación y Control de Roles (CU-01)

### Prompt 2.1: Adaptación de Modelo Usuario y Autenticación con Inertia
```text
Configura la autenticación en Laravel utilizando la tabla preexistente `USUARIO` y conectándola con Laravel Breeze + Inertia React.

Instrucciones:
1. Revisa en .context/ESQUEMA_DB.sql las tablas USUARIO y ROL.
2. Modifica `app/Models/Usuario.php` para que herede de `Illuminate\Foundation\Auth\User as Authenticatable`.
3. Ajusta `config/auth.php` para que el provider de usuarios utilice el modelo `App\Models\Usuario` y reconozca `hash_contrasena` como el campo de contraseña (sobrescribiendo `getAuthPassword()` en el modelo).
4. Implementa un método helper en Usuario: `hasRole(string|array $roles): bool`.
5. Modifica el controlador de inicio de sesión (`AuthenticatedSessionController`) para validar contra `correo_electronico` y `hash_contrasena` usando Hash::check().
```

### Prompt 2.2: Middleware de Control de Roles (RBAC)
```text
Implementa el middleware de verificación de roles para el panel administrativo según la matriz de acceso de `.context/ROUTES_MAP.md`.

Instrucciones:
1. Crea el middleware `app/Http/Middleware/CheckRole.php`.
2. El middleware debe recibir una lista de roles permitidos (ej. `role:Director,Secretaria`).
3. Si el usuario autenticado no posee uno de los roles permitidos, debe abortar con un error 403 o redirigir con un mensaje de alerta a `/admin/dashboard`.
4. Registra el middleware en `bootstrap/app.php` bajo el alias `role`.
```

---

## FASE 3: Componentes UI Base y Layouts (React + Tailwind)

### Prompt 3.1: Construcción de Layouts Base
```text
Crea los Layouts principales de la aplicación en React utilizando Tailwind CSS, siguiendo `.context/UI_COMPONENTS_GUIDE.md`.

Instrucciones:
1. Diseña `resources/js/Layouts/PublicLayout.jsx`:
   - Header institucional con logotipo FEDER, barra de navegación pública y botón CTA "Dona a una Campaña" (naranja).
   - Contenedor dinámico `{children}` centrado con `max-w-7xl`.
   - Footer con dirección oficial de FEDER en Santa Cruz de la Sierra y redes institucionales.
2. Diseña `resources/js/Layouts/AdminLayout.jsx`:
   - Barra lateral fija (Sidebar) con menú filtrado condicionalmente por el rol del usuario autenticado (`auth.user.rol`).
   - Topbar con nombre de usuario, badge del rol y botón de logout.
   - Contenedor de contenido con fondo `bg-slate-50 min-h-screen p-6`.
3. Ningún archivo debe exceder las 150 líneas de código.
```

### Prompt 3.2: Creación de Componentes UI Reutilizables
```text
Implementa los componentes UI base reutilizables en `resources/js/Components/` basándote en `.context/UI_COMPONENTS_GUIDE.md`.

Instrucciones:
1. Crea `DataTable.jsx`: Tabla reutilizable que recibe columnas y datos con paginación limpia.
2. Crea `ProgressBar.jsx`: Barra de progreso de recaudación que calcula porcentajes y formatea montos en Bs.
3. Crea `StatusBadge.jsx`: Badge estilizado con colores según el estado (Activo, Pendiente, Cerrada, Atendida).
4. Crea `ConfirmModal.jsx`: Modal de confirmación para acciones críticas y destructivas.
```

---

## FASE 4: Construcción Modular de Casos de Uso

### Prompt 4.1: CU-05 - Gestión de Campañas de Recaudación (Director)
```text
Desarrolla el módulo de gestión de campañas de financiamiento (CU-05, RF-09, RF-10) respetando `.context/ROUTES_MAP.md` y `.context/CODING_STANDARDS.md`.

Instrucciones:
1. Backend:
   - Crea el Form Request `app/Http/Requests/CampanaRequest.php` para validar campos (`titulo`, `meta_economica > 0`, `fecha_limite >= fecha_inicio`, `comunidad_id`).
   - Crea `app/Http/Controllers/Admin/CampanaController.php` con métodos: `index`, `create`, `store`, `edit`, `update` y `cerrar`.
   - En `index`, incluye la relación con `Comunidad` y calcula el progreso recaudado.
2. Frontend (React + Inertia):
   - Crea `resources/js/Pages/Admin/Campanas/Index.jsx` utilizando `AdminLayout`, `DataTable`, `ProgressBar` y `StatusBadge`.
   - Crea `resources/js/Pages/Admin/Campanas/Create.jsx` con formulario gestionado por `useForm`.
   - Moduliza los formularios para no exceder las 180 líneas de código por archivo.
```

### Prompt 4.2: CU-06 - Donaciones, Aportes y Descarga de Ficha Técnica
```text
Implementa el flujo de registro de intenciones de donación y emisión de fichas técnicas (CU-06, RF-11, RF-12, RF-13).

Instrucciones:
1. Backend:
   - Crea `app/Http/Controllers/Public/PublicAporteController.php`:
     - Método `store`: Valida monto > 0, registra el aporte con estado 'Pendiente de Confirmación' y despacha un correo de confirmación institucional vía Mailable.
   - Crea `app/Http/Controllers/Admin/AporteController.php` (para Director y Secretaria):
     - Métodos `confirmar` y `rechazar`. Al confirmar, debe sumar el monto validado a `monto_recaudado` en la tabla `CAMPANA`.
   - Agrega método `descargarFichaPdf` en `PublicCampanaController` usando DomPDF para emitir el resumen del proyecto.
2. Frontend:
   - Crea `resources/js/Pages/Public/Campanas/Donar.jsx` con formulario de aporte (Transferencia bancaria, QR, Efectivo).
   - Crea `resources/js/Pages/Admin/Aportes/Index.jsx` con opciones de validación para Director y Secretaria.
```

### Prompt 4.3: CU-07 - Bandeja de Consultas e Interacción Ciudadana
```text
Implementa la gestión centralizada de consultas ciudadanas (CU-07, RF-16).

Instrucciones:
1. Backend:
   - En `PublicConsultaController@store`: Valida y almacena mensajes de contacto con estado 'Pendiente'.
   - En `Admin/ConsultaController.php`:
     - `index`: Lista mensajes ordenados cronológicamente con filtros por estado (Pendiente, En Proceso, Atendido).
     - `show`: Muestra el detalle del remitente y mensaje.
     - `responder`: Despacha correo institucional al remitente, actualiza el estado a 'Atendido' y asigna el `usuario_id` del operador.
2. Frontend:
   - Crea `resources/js/Pages/Public/Contacto.jsx` con validación en tiempo real.
   - Crea `resources/js/Pages/Admin/Consultas/Index.jsx` y `Show.jsx`.
```

### Prompt 4.4: CU-03 y CU-04 - CMS (Publicaciones, Comunidades y Testimonios)
```text
Construye los módulos de gestión territorial y editorial (CU-03 y CU-04).

Instrucciones:
1. Desarrolla los controladores y vistas para:
   - `ComunidadController`: CRUD de municipios de la Chiquitanía y sus programas productivos asociados.
   - `NoticiaController`: Registro de comunicados con subida de imagen principal (`Storage::disk('public')`) y galería multimedia.
   - `TestimonioController`: Registro de casos de éxito de artesanos locales.
2. Asegura que los formularios utilicen multipart/form-data mediante el hook `useForm` de Inertia.
3. Respeta el límite estricto de 150 líneas por archivo separando subcomponentes.
```

### Prompt 4.5: CU-08 - Tablero de Reportes y Estadísticas (Director)
```text
Implementa el módulo de reportes consolidados para el Director (CU-08, RF-17).

Instrucciones:
1. Backend:
   - Crea `app/Http/Controllers/Admin/ReporteController.php`.
   - Consulta y calcula: total de fondos recaudados por campaña, porcentaje global de metas alcanzadas, total de consultas ciudadanas atendidas y cobertura por comunidad.
   - Método `exportarRecaudacionPdf`: Genera un informe ejecutivo consolidado en PDF con encabezado formal de FEDER.
2. Frontend:
   - Crea `resources/js/Pages/Admin/Reportes/Index.jsx` proyectando tarjetas de resumen numérico y tablas estadísticas.
```