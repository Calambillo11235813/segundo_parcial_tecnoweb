# Estado del Proyecto - Portal FEDER

**Fecha de última actualización:** 6 de Noviembre de 2026  
**Stack:** Laravel 11 + Inertia.js v2 + React 18 + Tailwind CSS + PostgreSQL (Esquema: `feder`)

---

## 1. Resumen de Implementación Actual
- **Casos de uso completados:** 
  - **CU-01:** Autenticación, Gestión de Usuarios y Roles.
  - **CU-02:** Gestión de Contenidos Institucionales y Redes Sociales.
  - **CU-03:** Publicaciones, Galerías y Testimonios Comunitarios (CMS).
  - **CU-04:** Comunidades Beneficiarias y Programas Productivos.
  - **CU-05:** Gestión de Campañas de Recaudación (Crowdfunding Comunitario).
- **Archivos creados/modificados en CU-05:**
  - **Modelos:**
    - `app/Models/Aporte.php` (`feder.aporte`, PK: `id_aporte`, relación `belongsTo` Campana).
    - `app/Models/Campana.php` (`feder.campana`, PK: `id_campana`, relaciones `comunidad()`, `aportes()`, atributos calculados `porcentaje`, `dias_restantes`).
    - `app/Models/Comunidad.php` (ampliado con relación `campanas()`).
  - **Controladores y Form Requests:**
    - `app/Http/Controllers/Admin/CampanaController.php` (CRUD administrativo exclusivo para Director, cálculo de progreso en tiempo real, cierre de recaudación, auto-siembra inicial si la tabla está vacía, auditoría).
    - `app/Http/Controllers/Public/PublicCampanaController.php` (Catálogo público de crowdfunding con buscador, filtros y ficha de detalle con desglose de metas y aportes confirmados).
    - `app/Http/Requests/CampanaRequest.php` (Validación de metas > 0, fechas límite >= fecha inicio, estado y comunidad existente).
  - **Componentes UI reutilizables:**
    - `Components/ProgressBar.jsx` (Barra visual de avance porcentual con montos en Bs., cálculo de excedentes y badge de meta alcanzada).
    - `Components/CardCampana.jsx` (Tarjeta pública de campaña con estética Chiquitana, días restantes y barra integrada).
  - **Vistas React:**
    - `Admin/Campanas/Index.jsx` (Dashboard de campañas con métricas de recaudación, filtros, barra de progreso y modal de confirmación de cierre).
    - `Admin/Campanas/Create.jsx` (Formulario para parametrizar metas, plazos, comunidad y publicar campaña).
    - `Admin/Campanas/Edit.jsx` (Edición de parámetros y visualización del estado financiero).
    - `Public/Campanas/Index.jsx` (Catálogo público con métricas acumuladas de impacto, buscador y cuadrícula de tarjetas).
    - `Public/Campanas/Show.jsx` (Ficha detallada con plan comunitario, barra de progreso, tiempo restante y muro de aportes confirmados).
    - `Layouts/AdminLayout.jsx` y `PublicLayout.jsx` (Navegación actualizada con enlaces al módulo de Crowdfunding).
  - **Rutas Registradas:**
    - Públicas: `GET /campanas`, `GET /campanas/{id}`.
    - Administrativas (`role:Director`): `GET|POST /admin/campanas`, `GET /admin/campanas/crear`, `GET|PUT /admin/campanas/{id}/editar`, `PATCH /admin/campanas/{id}/cerrar`.
- **Archivos creados/modificados en CU-04:**
  - **Modelos:** `app/Models/ProgramaProductivo.php` (`feder.programa_productivo`, PK `id_programa`, catálogo `AREAS_PRODUCTIVAS`); `Comunidad.php` ampliado con relación `programas()`.
  - **Controladores y Requests:** `Admin/ComunidadController.php` (CRUD de fichas, bloqueo de eliminación si existen campañas por FK RESTRICT), `Admin/ProgramaController.php` (CRUD de programas por comunidad), `Public/PublicComunidadController.php` (catálogo con motor de búsqueda por texto, rubro y ubicación + ficha con programas, testimonios y noticias relacionadas); `ComunidadRequest.php`, `ProgramaRequest.php`.
  - **Componentes UI reutilizables:** `Components/StatusBadge.jsx`, `Components/ConfirmModal.jsx` (según UI_COMPONENTS_GUIDE §4.3 y §4.4).
  - **Vistas React:** `Admin/Comunidades/{Index, ComunidadCard, ComunidadModal, ProgramaModal}.jsx`; `Public/Comunidades/{Index, FiltroComunidades, Show}.jsx`. Layouts actualizados con navegación de Comunidades.
  - **Rutas:** Públicas `GET /comunidades`, `GET /comunidades/{id}`. Admin (`role:Director,Instructor`): `GET|POST /admin/comunidades`, `PUT|DELETE /admin/comunidades/{id}`, `POST /admin/comunidades/{id}/programas`, `PUT|DELETE /admin/programas/{id}`.
  - **Corrección transversal:** `Auditoria::registrar()` ahora trunca a VARCHAR(100)/(50); se corrigieron llamadas de CU-03 que enviaban el ID del registro como `usuario_id`.
- **Archivos creados/modificados en CU-03:**
  - **Modelos:**
    - `app/Models/Comunidad.php` (Mapeo a `feder.comunidad`, PK: `id_comunidad`, relación con Testimonio y Usuario).
    - `app/Models/Noticia.php` (Mapeo a `feder.noticia`, PK: `id_noticia`, relación con Usuario y GaleriaMultimedia).
    - `app/Models/GaleriaMultimedia.php` (Mapeo a `feder.galeria_multimedia`, PK: `id_multimedia`, tipo Imagen/Video).
    - `app/Models/Testimonio.php` (Mapeo a `feder.testimonio`, PK: `id_testimonio`, relación con Comunidad).
  - **Controladores y Form Requests:**
    - `app/Http/Controllers/Admin/NoticiaController.php` (CRUD administrativo de noticias, subida de portadas a `storage/noticias`, filtros y auditoría).
    - `app/Http/Controllers/Admin/GaleriaController.php` (Carga y eliminación de fotografías y videos de YouTube asociados a publicaciones).
    - `app/Http/Controllers/Admin/TestimonioController.php` (CRUD de testimonios comunitarios con fotos y videos).
    - `app/Http/Controllers/Public/PublicNoticiaController.php` (Catálogo público de noticias, buscador temático, vista de detalle con galería y testimonios).
    - Requests: `StoreNoticiaRequest.php`, `UpdateNoticiaRequest.php`, `StoreGaleriaRequest.php`, `StoreTestimonioRequest.php`, `UpdateTestimonioRequest.php`.
  - **Vistas React:**
    - `resources/js/Pages/Admin/Noticias/Index.jsx` (Listado administrativo con buscador, estado y contador de fotos).
    - `resources/js/Pages/Admin/Noticias/Create.jsx` (Redacción de noticias con carga de portada y estado).
    - `resources/js/Pages/Admin/Noticias/Edit.jsx` (Modificación de noticia y gestión de su galería multimedia).
    - `resources/js/Pages/Admin/Noticias/GaleriaModal.jsx` (Modal para carga de fotos o enlaces de video).
    - `resources/js/Pages/Admin/Noticias/GaleriaLista.jsx` (Componente modular para visualización de elementos multimedia).
    - `resources/js/Pages/Admin/Testimonios/Index.jsx` (Panel de historias de artesanos con fotos y enlaces de video).
    - `resources/js/Pages/Admin/Testimonios/TestimonioModal.jsx` (Modal de creación/edición de testimonios asociados a comunidades).
    - `resources/js/Pages/Public/Noticias/Index.jsx` (Portal público de noticias, buscador temático y testimonios de la Chiquitanía).
    - `resources/js/Pages/Public/Noticias/Show.jsx` (Artículo completo con galería multimedia interactiva, visor de fotos, videos de YouTube y notas relacionadas).
    - `resources/js/Layouts/AdminLayout.jsx` y `PublicLayout.jsx` actualizados con navegación para Director e Instructor.
  - **Rutas Registradas:**
    - Públicas: `GET /noticias`, `GET /noticias/{id}`.
    - Administrativas (`role:Director,Instructor`): `GET /admin/noticias`, `GET /admin/noticias/crear`, `POST /admin/noticias`, `GET /admin/noticias/{id}/editar`, `PUT /admin/noticias/{id}`, `DELETE /admin/noticias/{id}`, `POST /admin/noticias/{id}/galeria`, `DELETE /admin/galeria/{id}`, `GET /admin/testimonios`, `POST /admin/testimonios`, `PUT /admin/testimonios/{id}`, `DELETE /admin/testimonios/{id}`.
- **Estado de compilación y verificación:**
  - Sintaxis de código PHP 100% verificada (`php -l` sin errores en todos los archivos).
  - Límite estricto de líneas respetado (todos los archivos bajo el rango de 150-185 líneas).
  - DocBlocks y comentarios 100% en español.
  - Trazabilidad y auditoría registradas en `feder.auditoria`.

---

## 2. Matriz de Casos de Uso

| Caso de Uso | Módulo / Descripción | Roles Permitidos | Estado |
| :--- | :--- | :--- | :--- |
| **CU-01** | Autenticación, Gestión de Usuarios y Roles | Director | **Implementado** |
| **CU-02** | Información Institucional y Redes | Director | **Implementado** |
| **CU-03** | Publicaciones, Galerías y Testimonios | Director, Instructor | **Implementado** |
| **CU-04** | Comunidades y Programas Productivos | Director, Instructor | **Implementado** |
| **CU-05** | Campañas de Recaudación (Crowdfunding) | Director | **Implementado** |
| **CU-06** | Intenciones de Aporte y Donaciones | Director, Secretaria | Pendiente |
| **CU-07** | Bandeja de Consultas Ciudadanas | Director, Secretaria | Pendiente |
| **CU-08** | Reportes Estadísticos y Exportación PDF | Director | Pendiente |

---

## 3. Próximos Pasos :
- Iniciar la implementación del **CU-06: Intenciones de Aporte y Donaciones** (registro de aportes monetarios por donantes, modalidades de pago, validación y confirmación que impacta el `monto_recaudado` de las campañas del CU-05).
