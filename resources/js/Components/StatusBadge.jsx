import React from 'react';

/**
 * Insignia de estado reutilizable (UI_COMPONENTS_GUIDE §4.3).
 * Aplica colores semánticos según el estado recibido.
 */
const ESTILOS = {
    activo: 'bg-green-100 text-green-800 border-green-200',
    activa: 'bg-green-100 text-green-800 border-green-200',
    publicado: 'bg-green-100 text-green-800 border-green-200',
    confirmado: 'bg-green-100 text-green-800 border-green-200',
    atendido: 'bg-green-100 text-green-800 border-green-200',
    atendida: 'bg-green-100 text-green-800 border-green-200',
    pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
    borrador: 'bg-amber-100 text-amber-800 border-amber-200',
    'en proceso': 'bg-blue-100 text-blue-800 border-blue-200',
    rechazado: 'bg-red-100 text-red-800 border-red-200',
};

export default function StatusBadge({ status = '' }) {
    const clave = status.toLowerCase();
    const estilo = ESTILOS[clave]
        || (clave.startsWith('pendiente') ? ESTILOS.pendiente : 'bg-slate-100 text-slate-700 border-slate-200');

    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${estilo}`}>
            {status}
        </span>
    );
}

