# MAPA DE RUTAS Y ARQUITECTURA DE NAVEGACIÓN (ROUTES_MAP.md)

Este documento especifica la estructura completa de rutas HTTP (`routes/web.php`) para el proyecto **Portal FEDER**, articulando los 8 Casos de Uso del sistema, los niveles de acceso por rol y el mapeo con los componentes de frontend en Inertia.js / React.

---

## 1. Convenciones y Parámetros Arquitectónicos
* **Rutas Públicas:** No requieren autenticación. Enfocadas en el donante, entidades cooperantes y ciudadanía en general.
* **Rutas Administrativas (`/admin`):** Protegidas por los middlewares `auth` y un middleware personalizado de control de roles (`role:Director,Secretaria,Instructor`).
* **Nombres de Rutas:** Se utiliza notación estándar de Laravel en kebab-case/dot-notation (`admin.campanas.index`, `public.donaciones.store`).
* **Respuestas Inertia:** Cada controlador responde con `Inertia::render('Directorio/Componente', $data)`.

---

## 2. Rutas Públicas (Visitante / Donante)

| Caso de Uso | Método HTTP | URI | Nombre de Ruta | Controlador y Acción | Componente React (Inertia Page) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Inicio** | `GET` | `/` | `home` | `PublicController@index` | `Public/Home` |
| **CU-02** | `GET` | `/nosotros` | `public.nosotros` | `InstitucionalController@showPublic` | `Public/Nosotros` |
| **CU-04** | `GET` | `/comunidades` | `public.comunidades.index` | `PublicComunidadController@index` | `Public/Comunidades/Index` |
| **CU-04** | `GET` | `/comunidades/{id}` | `public.comunidades.show` | `PublicComunidadController@show` | `Public/Comunidades/Show` |
| **CU-03** | `GET` | `/noticias` | `public.noticias.index` | `PublicNoticiaController@index` | `Public/Noticias/Index` |
| **CU-03** | `GET` | `/noticias/{id}` | `public.noticias.show` | `PublicNoticiaController@show` | `Public/Noticias/Show` |
| **CU-05** | `GET` | `/campanas` | `public.campanas.index` | `PublicCampanaController@index` | `Public/Campanas/Index` |
| **CU-05** | `GET` | `/campanas/{id}` | `public.campanas.show` | `PublicCampanaController@show` | `Public/Campanas/Show` |
| **CU-06** | `GET` | `/campanas/{id}/donar` | `public.donaciones.create` | `PublicAporteController@create` | `Public/Campanas/Donar` |
| **CU-06** | `POST` | `/campanas/{id}/donar` | `public.donaciones.store` | `PublicAporteController@store` | *Redirección con Flash Message* |
| **CU-06** | `GET` | `/campanas/{id}/ficha-pdf` | `public.campanas.pdf` | `PublicCampanaController@descargarFichaPdf` | *Descarga Stream PDF* |
| **CU-07** | `GET` | `/contacto` | `public.contacto.index` | `PublicConsultaController@create` | `Public/Contacto` |
| **CU-07** | `POST` | `/contacto` | `public.contacto.store` | `PublicConsultaController@store` | *Redirección con Flash Message* |

---

## 3. Rutas de Autenticación (Laravel Breeze Adaptado)

| Caso de Uso | Método HTTP | URI | Nombre de Ruta | Controlador y Acción | Componente React |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CU-01** | `GET` | `/login` | `login` | `AuthenticatedSessionController@create` | `Auth/Login` |
| **CU-01** | `POST` | `/login` | `login.store` | `AuthenticatedSessionController@store` | *Redirección a /admin/dashboard* |
| **CU-01** | `POST` | `/logout` | `logout` | `AuthenticatedSessionController@destroy` | *Redirección a /login* |

---

## 4. Rutas Administrativas (`/admin`)

Todas estas rutas están agrupadas bajo el prefijo `/admin`, nombre base `admin.` y protegidas por autenticación.

### 4.1. Dashboard y Resumen General
* `GET /admin/dashboard` $\rightarrow$ `admin.dashboard` $\rightarrow$ `DashboardController@index` $\rightarrow$ `Admin/Dashboard` *(Acceso: Director, Secretaria, Instructor)*

### 4.2. Módulo CU-01: Usuarios y Roles (Exclusivo Director)
* `GET /admin/usuarios` $\rightarrow$ `admin.usuarios.index` $\rightarrow$ `UsuarioController@index` $\rightarrow$ `Admin/Usuarios/Index`
* `GET /admin/usuarios/crear` $\rightarrow$ `admin.usuarios.create` $\rightarrow$ `UsuarioController@create` $\rightarrow$ `Admin/Usuarios/Create`
* `POST /admin/usuarios` $\rightarrow$ `admin.usuarios.store` $\rightarrow$ `UsuarioController@store`
* `GET /admin/usuarios/{id}/editar` $\rightarrow$ `admin.usuarios.edit` $\rightarrow$ `UsuarioController@edit` $\rightarrow$ `Admin/Usuarios/Edit`
* `PUT /admin/usuarios/{id}` $\rightarrow$ `admin.usuarios.update` $\rightarrow$ `UsuarioController@update`
* `DELETE /admin/usuarios/{id}` $\rightarrow$ `admin.usuarios.destroy` $\rightarrow$ `UsuarioController@destroy`

### 4.3. Módulo CU-02: Información Institucional y Redes (Exclusivo Director)
* `GET /admin/institucional` $\rightarrow$ `admin.institucional.index` $\rightarrow$ `InstitucionalController@index` $\rightarrow$ `Admin/Institucional/Index`
* `PUT /admin/institucional/pagina/{id}` $\rightarrow$ `admin.institucional.pagina.update` $\rightarrow$ `InstitucionalController@updatePagina`
* `POST /admin/institucional/redes` $\rightarrow$ `admin.institucional.redes.store` $\rightarrow$ `InstitucionalController@storeRed`
* `PUT /admin/institucional/redes/{id}` $\rightarrow$ `admin.institucional.redes.update` $\rightarrow$ `InstitucionalController@updateRed`
* `DELETE /admin/institucional/redes/{id}` $\rightarrow$ `admin.institucional.redes.destroy` $\rightarrow$ `InstitucionalController@destroyRed`

### 4.4. Módulo CU-03: Publicaciones, Galerías y Testimonios (Director e Instructor)
* `GET /admin/noticias` $\rightarrow$ `admin.noticias.index` $\rightarrow$ `NoticiaController@index` $\rightarrow$ `Admin/Noticias/Index`
* `GET /admin/noticias/crear` $\rightarrow$ `admin.noticias.create` $\rightarrow$ `NoticiaController@create` $\rightarrow$ `Admin/Noticias/Create`
* `POST /admin/noticias` $\rightarrow$ `admin.noticias.store` $\rightarrow$ `NoticiaController@store`
* `GET /admin/noticias/{id}/editar` $\rightarrow$ `admin.noticias.edit` $\rightarrow$ `NoticiaController@edit` $\rightarrow$ `Admin/Noticias/Edit`
* `PUT /admin/noticias/{id}` $\rightarrow$ `admin.noticias.update` $\rightarrow$ `NoticiaController@update`
* `DELETE /admin/noticias/{id}` $\rightarrow$ `admin.noticias.destroy` $\rightarrow$ `NoticiaController@destroy`
* `POST /admin/noticias/{id}/galeria` $\rightarrow$ `admin.noticias.galeria.store` $\rightarrow$ `GaleriaController@store`
* `DELETE /admin/galeria/{id}` $\rightarrow$ `admin.galeria.destroy` $\rightarrow$ `GaleriaController@destroy`
* `GET /admin/testimonios` $\rightarrow$ `admin.testimonios.index` $\rightarrow$ `TestimonioController@index` $\rightarrow$ `Admin/Testimonios/Index`
* `POST /admin/testimonios` $\rightarrow$ `admin.testimonios.store` $\rightarrow$ `TestimonioController@store`
* `PUT /admin/testimonios/{id}` $\rightarrow$ `admin.testimonios.update` $\rightarrow$ `TestimonioController@update`
* `DELETE /admin/testimonios/{id}` $\rightarrow$ `admin.testimonios.destroy` $\rightarrow$ `TestimonioController@destroy`

### 4.5. Módulo CU-04: Comunidades y Programas (Director e Instructor)
* `GET /admin/comunidades` $\rightarrow$ `admin.comunidades.index` $\rightarrow$ `ComunidadController@index` $\rightarrow$ `Admin/Comunidades/Index`
* `POST /admin/comunidades` $\rightarrow$ `admin.comunidades.store` $\rightarrow$ `ComunidadController@store`
* `PUT /admin/comunidades/{id}` $\rightarrow$ `admin.comunidades.update` $\rightarrow$ `ComunidadController@update`
* `DELETE /admin/comunidades/{id}` $\rightarrow$ `admin.comunidades.destroy` $\rightarrow$ `ComunidadController@destroy`
* `POST /admin/comunidades/{id}/programas` $\rightarrow$ `admin.programas.store` $\rightarrow$ `ProgramaController@store`
* `PUT /admin/programas/{id}` $\rightarrow$ `admin.programas.update` $\rightarrow$ `ProgramaController@update`
* `DELETE /admin/programas/{id}` $\rightarrow$ `admin.programas.destroy` $\rightarrow$ `ProgramaController@destroy`

### 4.6. Módulo CU-05: Campañas de Recaudación (Exclusivo Director)
* `GET /admin/campanas` $\rightarrow$ `admin.campanas.index` $\rightarrow$ `CampanaController@index` $\rightarrow$ `Admin/Campanas/Index`
* `GET /admin/campanas/crear` $\rightarrow$ `admin.campanas.create` $\rightarrow$ `CampanaController@create` $\rightarrow$ `Admin/Campanas/Create`
* `POST /admin/campanas` $\rightarrow$ `admin.campanas.store` $\rightarrow$ `CampanaController@store`
* `GET /admin/campanas/{id}/editar` $\rightarrow$ `admin.campanas.edit` $\rightarrow$ `CampanaController@edit` $\rightarrow$ `Admin/Campanas/Edit`
* `PUT /admin/campanas/{id}` $\rightarrow$ `admin.campanas.update` $\rightarrow$ `CampanaController@update`
* `PATCH /admin/campanas/{id}/cerrar` $\rightarrow$ `admin.campanas.cerrar` $\rightarrow$ `CampanaController@cerrar`

### 4.7. Módulo CU-06: Gestión de Aportes y Donaciones (Director y Secretaria)
* `GET /admin/aportes` $\rightarrow$ `admin.aportes.index` $\rightarrow$ `AporteController@index` $\rightarrow$ `Admin/Aportes/Index`
* `PATCH /admin/aportes/{id}/confirmar` $\rightarrow$ `admin.aportes.confirmar` $\rightarrow$ `AporteController@confirmar`
* `PATCH /admin/aportes/{id}/rechazar` $\rightarrow$ `admin.aportes.rechazar` $\rightarrow$ `AporteController@rechazar`

### 4.8. Módulo CU-07: Bandeja de Consultas (Director y Secretaria)
* `GET /admin/consultas` $\rightarrow$ `admin.consultas.index` $\rightarrow$ `ConsultaController@index` $\rightarrow$ `Admin/Consultas/Index`
* `GET /admin/consultas/{id}` $\rightarrow$ `admin.consultas.show` $\rightarrow$ `ConsultaController@show` $\rightarrow$ `Admin/Consultas/Show`
* `POST /admin/consultas/{id}/responder` $\rightarrow$ `admin.consultas.responder` $\rightarrow$ `ConsultaController@responder`
* `PATCH /admin/consultas/{id}/estado` $\rightarrow$ `admin.consultas.cambiarEstado` $\rightarrow$ `ConsultaController@cambiarEstado`

### 4.9. Módulo CU-08: Reportes y Estadísticas (Exclusivo Director)
* `GET /admin/reportes` $\rightarrow$ `admin.reportes.index` $\rightarrow$ `ReporteController@index` $\rightarrow$ `Admin/Reportes/Index`
* `GET /admin/reportes/recaudacion-pdf` $\rightarrow$ `admin.reportes.pdf` $\rightarrow$ `ReporteController@exportarRecaudacionPdf`

---

## 5. Matriz de Control de Acceso por Roles (RBAC)
+-----------------------------------+----------+------------+------------+
| Módulo / Caso de Uso              | Director | Secretaria | Instructor |
+-----------------------------------+----------+------------+------------+
| Dashboard General                 |    SI    |     SI     |     SI     |
| CU-01 Usuarios y Roles            |    SI    |     NO     |     NO     |
| CU-02 Información Institucional   |    SI    |     NO     |     NO     |
| CU-03 Publicaciones y Medios      |    SI    |     NO     |     SI     |
| CU-04 Comunidades y Programas     |    SI    |     NO     |     SI     |
| CU-05 Campañas de Recaudación     |    SI    |     NO     |     NO     |
| CU-06 Confirmación de Aportes     |    SI    |     SI     |     NO     |
| CU-07 Bandeja de Consultas        |    SI    |     SI     |     NO     |
| CU-08 Reportes y Estadísticas     |    SI    |     NO     |     NO     |
+-----------------------------------+----------+------------+------------+

