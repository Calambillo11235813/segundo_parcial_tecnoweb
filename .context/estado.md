# Estado del Proyecto - Portal FEDER

**Fecha de última actualización:** 3 de Noviembre de 2026  
**Stack:** Laravel 11 + Inertia.js v2 + React 18 + Tailwind CSS + PostgreSQL (Esquema: `feder`)

---

## 1. Resumen de Implementación Actual
- **Casos de uso completados:** 
  - **CU-01:** Autenticación, Gestión de Usuarios y Roles.
  - **CU-02:** Gestión de Contenidos Institucionales y Redes Sociales.
- **Archivos creados/modificados en CU-02:**
  - **Modelos:**
    - `app/Models/PaginaInstitucional.php` (Mapeo a `feder.pagina_institucional`, PK: `id_pagina`, relación con Usuario).
    - `app/Models/RedSocial.php` (Mapeo a `feder.red_social`, PK: `id_red_social`, relación con Usuario).
  - **Controladores y Requests:**
    - `app/Http/Controllers/Admin/InstitucionalController.php` (Gestión de páginas institucionales, redes sociales y vista pública `/nosotros`).
    - `app/Http/Requests/UpdatePaginaRequest.php` (Validación de título y contenido institucional).
    - `app/Http/Requests/StoreRedSocialRequest.php` (Validación de alta de enlace a red social).
    - `app/Http/Requests/UpdateRedSocialRequest.php` (Validación de edición de red social y estado).
  - **Vistas React:**
    - `resources/js/Layouts/PublicLayout.jsx` (Layout público oficial con navbar inteligente, CTA de donaciones y footer corporativo).
    - `resources/js/Components/SocialIcon.jsx` (Componente de logotipos vectoriales oficiales SVG para redes sociales).
    - `resources/js/Pages/Public/Nosotros.jsx` (Página pública institucional que refleja dinámicamente Misión, Visión, Objetivos, Reseña, Ubicación con Google Maps interactivo y Redes con logos de marca).
    - `resources/js/Pages/Admin/Institucional/Index.jsx` (Panel administrativo para el Director con edición de páginas estáticas y redes sociales).
    - `resources/js/Pages/Admin/Institucional/PaginaModal.jsx` (Modal modular para edición de contenido institucional).
    - `resources/js/Pages/Admin/Institucional/RedSocialModal.jsx` (Modal modular para alta y edición de redes sociales).
    - `resources/js/Layouts/AdminLayout.jsx` (Actualizado con acceso directo al módulo de Información Institucional para Director).
  - **Rutas:**
    - `GET /nosotros` (`public.nosotros`): Vista pública institucional.
    - `GET /admin/institucional`, `PUT /admin/institucional/pagina/{id}`, `POST /admin/institucional/redes`, `PUT /admin/institucional/redes/{id}`, `DELETE /admin/institucional/redes/{id}`.
- **Estado de compilación:**
  - Compilación exitosa con Vite (`npm run build`: 1008 módulos empaquetados sin errores).
  - Verificación de límite de líneas (todos los archivos bajo el umbral de 150-180 líneas).
  - Cumplimiento estricto de comentarios y DocBlocks 100% en español.
  - Trazabilidad y auditoría registradas en `feder.auditoria`.

---

## 2. Matriz de Casos de Uso

| Caso de Uso | Módulo / Descripción | Roles Permitidos | Estado |
| :--- | :--- | :--- | :--- |
| **CU-01** | Autenticación, Gestión de Usuarios y Roles | Director | **Implementado** |
| **CU-02** | Información Institucional y Redes | Director | **Implementado** |
| **CU-03** | Publicaciones, Galerías y Testimonios | Director, Instructor | Pendiente |
| **CU-04** | Comunidades y Programas Productivos | Director, Instructor | Pendiente |
| **CU-05** | Campañas de Recaudación (Crowdfunding) | Director | Pendiente |
| **CU-06** | Intenciones de Aporte y Donaciones | Director, Secretaria | Pendiente |
| **CU-07** | Bandeja de Consultas Ciudadanas | Director, Secretaria | Pendiente |
| **CU-08** | Reportes Estadísticos y Exportación PDF | Director | Pendiente |

---

## 3. Próximos Pasos :
- Configurar y arrancar la implementación del **CU-03: Gestión de Publicaciones, Galerías y Testimonios (CMS)**.
