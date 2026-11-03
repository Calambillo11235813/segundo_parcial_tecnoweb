import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

/**
 * Punto de entrada del frontend en React para Inertia.js (Portal FEDER).
 */
const appName = import.meta.env.VITE_APP_NAME || 'Portal FEDER';

createInertiaApp({
    // Configura el título dinámico de cada página
    title: (title) => `${title} - ${appName}`,
    // Resuelve de forma asíncrona los componentes de la carpeta Pages
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    // Monta la aplicación React en el elemento raíz del DOM
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    // Barra de progreso de carga superior
    progress: {
        color: '#15803D', // Verde FEDER
    },
});
