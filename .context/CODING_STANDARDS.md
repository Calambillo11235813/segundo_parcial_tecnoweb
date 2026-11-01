# ESTÁNDARES Y CONVENCIONES DE CODIFICACIÓN (PORTAL FEDER)

## 1. Reglas Generales de Modularidad y Estilo
* **Límite de líneas por archivo:** Ningún archivo debe exceder las **150 - 200 líneas de código**. Si una clase, controlador o componente crece más allá de este límite, debe modularizarse (dividir en subcomponentes, Form Requests, Services o Traits).
* **Idioma del código:**
  * Variables, métodos, tablas y columnas en español/snake_case o camelCase según el lenguaje, respetando el contrato estricto de la base de datos existente (`ESQUEMA_DB.sql`).
* **Documentación y comentarios:**
  * Cada archivo debe iniciar con un bloque de comentario indicando el propósito y el Caso de Uso asociado (ej. `CU-01`, `CU-05`).
  * Los métodos deben incluir comentarios concisos describiendo entradas, salidas y reglas de negocio aplicadas.

---

## 2. Backend (Laravel)
* **Base de datos heredada / existente:**
  * **PROHIBIDO** asumir llaves primarias por defecto `id`. Cada modelo Eloquent DEBE definir explícitamente:
    ```php
    protected $table = 'nombre_tabla';
    protected $primaryKey = 'id_columna';
    public $timestamps = false; // o true solo si existen created_at y updated_at
    ```
  * Respetar las llaves foráneas exactas en las relaciones (`belongsTo`, `hasMany`).
* **Controladores Delgados (Thin Controllers):**
  * Los controladores solo reciben peticiones HTTP, delegan la lógica y devuelven respuestas Inertia o JSON.
  * Validaciones complejas deben encapsularse en **Form Requests** dedicados (`php artisan make:request ...`).
* **Respuestas Inertia:**
  * Renderizar componentes con: `return Inertia::render('NombreModulo/Vista', [...]);`.

---

## 3. Frontend (React + Vite + Tailwind CSS)
* **Componentes Funcionales:**
  * Usar componentes basados en funciones y hooks (`useState`, `useEffect`, hooks de Inertia).
  * Estructura de carpetas en `resources/js/Pages/` organizada por caso de uso/módulo (`Campanas/`, `Usuarios/`, `Consultas/`, etc.).
* **Reutilización y Componentes UI:**
  * Los formularios, tablas y modales no deben escribirse completos en una sola página. Deben extraerse como componentes pequeños en `resources/js/Components/`.
* **Formularios con Inertia:**
  * Utilizar exclusivamente el hook `useForm` de `@inertiajs/react` para manejar inputs, validaciones, spinners de carga y errores de backend.

---

## 4. Trazabilidad y Seguridad
* **Auditoría:** Cada operación de inserción, actualización o eliminación crítica en tablas del CMS o Donaciones debe registrar su traza en la tabla `AUDITORIA` mediante observadores (Observers) o Middleware.
* **Control de Acceso:** Proteger las rutas con Middleware validando los roles (`Director`, `Secretaria`, `Instructor`) según la matriz de casos de uso.