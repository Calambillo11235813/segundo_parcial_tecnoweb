import axios from 'axios';

/**
 * Configuración cliente de Axios para peticiones HTTP auxiliares.
 */
window.axios = axios;

// Encabezado para identificar peticiones AJAX en Laravel
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
