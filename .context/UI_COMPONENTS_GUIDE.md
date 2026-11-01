# GUÍA DE INTERFAZ DE USUARIO, IDENTIDAD Y COMPONENTES (UI_COMPONENTS_GUIDE.md)

Este documento define la guía de diseño visual, la paleta cromática basada en la identidad corporativa de la Fundación FEDER, la tipografía y la arquitectura de componentes reutilizables en **React + Tailwind CSS** para el portal público y el panel administrativo.

---

## 1. Identidad Institucional y Paleta de Colores

Basado en la imagen corporativa oficial de FEDER (engranaje de desarrollo productivo y barras de crecimiento agrícola/empresarial):

### 1.1. Colores Principales (Tailwind Token Config)
* **Verde FEDER (Productividad y Sostenibilidad Rural):**
  * Primario: `#15803D` (`green-700`)
  * Hover / Interacción: `#166534` (`green-800`)
  * Fondo suave / Badges: `#DCFCE7` (`green-100`)
* **Naranja FEDER (Fuerza Emprendedora y Artesanía de la Chiquitanía):**
  * Secundario / Acento: `#EA580C` (`orange-600`)
  * Hover: `#C2410C` (`orange-700`)
  * Fondo suave: `#FFEDD5` (`orange-100`)
* **Gris Industrial (Solidez y Formalidad Institucional):**
  * Primario oscuro: `#334155` (`slate-700`)
  * Encabezados y texto principal: `#0F172A` (`slate-900`)
  * Bordes y separadores: `#E2E8F0` (`slate-200`)
  * Fondos de panel: `#F8FAFC` (`slate-50`)

### 1.2. Colores Semánticos de Estado
* **Éxito (Confirmado / Activo / Publicado):** `#16A34A` (`green-600`)
* **Pendiente / En Revisión (Aportes e Intenciones):** `#D97706` (`amber-600`)
* **Peligro / Eliminación / Rechazado:** `#DC2626` (`red-600`)
* **Información / En Proceso:** `#2563EB` (`blue-600`)

---

## 2. Tipografía y Jerarquía Visual
* **Fuente Principal:** Inter, Roboto o sans-serif nativo limpio.
* **Títulos de Sección (H1 / H2):** `text-2xl` o `text-3xl font-bold tracking-tight text-slate-900`.
* **Subtítulos y Metadatos:** `text-sm text-slate-500 font-medium`.
* **Cuerpo de Texto:** `text-base text-slate-700 leading-relaxed`.

---

## 3. Arquitectura de Layouts Base

### 3.1. Layout Público (`resources/js/Layouts/PublicLayout.jsx`)
Estructura para visitantes y cooperantes:
* **Header / Barra de Navegación:**
  * Logo de FEDER a la izquierda.
  * Enlaces: Inicio, Quiénes Somos, Comunidades Chiquitanas, Noticias, Campañas (Crowdfunding), Contacto.
  * Botón de Acción destacado (CTA): *Dona a una Campaña* (`bg-orange-600 text-white`).
  * Enlace discreto al final del menú o pie de página: *Portal Administrativo (Ingreso)*.
* **Contenido Principal (`children`):** Ancho máximo delimitado (`max-w-7xl mx-auto px-4 py-8`).
* **Footer:**
  * Datos institucionales de contacto (Calle Arenales / Puerto Suárez, Santa Cruz de la Sierra).
  * Redes sociales oficiales (Facebook, WhatsApp, Instagram).
  * Enlaces directos y leyenda institucional de propiedad.

### 3.2. Layout Administrativo (`resources/js/Layouts/AdminLayout.jsx`)
Estructura para el personal autenticado:
* **Sidebar Lateral Fijo:**
  * Cabecera con nombre del sistema y Rol del usuario autenticado en una insignia (`Director`, `Secretaria`, `Instructor`).
  * Menú jerárquico filtrado según permisos de usuario.
* **Barra Superior (Navbar):**
  * Título dinámico del módulo actual.
  * Indicador de notificaciones (nuevas consultas pendientes o donaciones sin confirmar).
  * Dropdown con nombre del usuario autenticado y botón para Cerrar Sesión (`POST /logout`).
* **Área de Trabajo:** Fondo `bg-slate-50 min-h-screen p-6`.

---

## 4. Biblioteca de Componentes UI Reutilizables

Ubicación obligatoria: `resources/js/Components/`

### 4.1. `DataTable.jsx` (Listados Generales)
* Componente para visualizar registros en tablas homogéneas.
* **Props:** `columns` (array con key y label), `data` (colección devuelta por Inertia), `actions` (render prop para botones de edición/borrado).
* **Estilo:** Cabecera `bg-slate-100 text-slate-700 uppercase text-xs font-semibold`, filas alternadas, bordes sutiles `border-b border-slate-200`.

### 4.2. `ProgressBar.jsx` (Módulo Crowdfunding - CU-05 y CU-06)
* Barra visual para mostrar el porcentaje recaudado en cada campaña.
* **Props:** `meta` (número), `recaudado` (número).
* **Comportamiento:**
  * Cálculo dinámico: `porcentaje = Math.min(100, Math.round((recaudado / meta) * 100))`.
  * Barra de relleno verde si está activa, con etiqueta visible del porcentaje y saldos formateados en moneda (`Bs.`).

### 4.3. `StatusBadge.jsx` (Insignias de Estado)
* Muestra el estado de usuarios, consultas, aportes o noticias.
* **Props:** `status` (string: `'Activo'`, `'Pendiente'`, `'Confirmado'`, `'Cerrada'`, etc.).
* Renderiza clases dinámicas:
  * `'Confirmado'` / `'Activo'` $\rightarrow$ `bg-green-100 text-green-800 border border-green-200`
  * `'Pendiente'` / `'Pendiente de Confirmación'` $\rightarrow$ `bg-amber-100 text-amber-800 border border-amber-200`
  * `'Cerrada'` / `'Inactivo'` $\rightarrow$ `bg-slate-100 text-slate-700 border border-slate-200`

### 4.4. `ConfirmModal.jsx` (Diálogos de Confirmación)
* Modal accesible para confirmar acciones destructivas (eliminar noticias, cerrar campañas, rechazar aportes).
* Evita el uso de `window.confirm()` nativo del navegador.
* **Props:** `isOpen`, `title`, `message`, `onConfirm`, `onClose`, `loading`.

### 4.5. `CardCampana.jsx` (Tarjeta de Campaña Pública)
* Visualización de planes comunitarios en el catálogo público.
* Incluye: Imagen destacada del rubro (jabonería, aceites), municipio de la Chiquitanía (badge), meta económica, fecha límite, barra de progreso integrada y botón directo para donar o descargar ficha técnica.

---

## 5. Directrices de Formularios con Inertia
* Todos los formularios deben implementarse mediante el hook `useForm` de `@inertiajs/react`.
* Cada campo con error de validación debe renderizar un mensaje claro con `text-red-600 text-xs mt-1`.
* Los botones de envío deben deshabilitarse automáticamente y mostrar un indicador visual cuando `processing` sea `true`.