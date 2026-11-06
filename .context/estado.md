# Estado del Proyecto - Portal FEDER

**Fecha de última actualización:** 5 de Noviembre de 2026  
**Stack:** Laravel 11 + Inertia.js v2 + React 18 + Tailwind CSS + PostgreSQL (Esquema: `feder`)

---

## 1. Resumen de Implementación Actual
- **Casos de uso completados:** 
  - **CU-01:** Autenticación, Gestión de Usuarios y Roles.
  - **CU-02:** Gestión de Contenidos Institucionales y Redes Sociales.
  - **CU-03:** Publicaciones, Galerías y Testimonios Comunitarios (CMS).
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
| **CU-04** | Comunidades y Programas Productivos | Director, Instructor | Pendiente |
| **CU-05** | Campañas de Recaudación (Crowdfunding) | Director | Pendiente |
| **CU-06** | Intenciones de Aporte y Donaciones | Director, Secretaria | Pendiente |
| **CU-07** | Bandeja de Consultas Ciudadanas | Director, Secretaria | Pendiente |
| **CU-08** | Reportes Estadísticos y Exportación PDF | Director | Pendiente |

---

## 3. Próximos Pasos :
- Iniciar la implementación del **CU-04: Comunidades y Programas Productivos** (Catálogo de municipios chiquitanos, áreas de intervención y capacitaciones técnicas en jabonería, totaí y pesoé).
