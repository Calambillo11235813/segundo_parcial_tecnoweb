import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SocialIcon from '@/Components/SocialIcon';
import PaginaModal from './PaginaModal';
import RedSocialModal from './RedSocialModal';

/**
 * Gestión de Contenidos Institucionales y Redes Sociales (CU-02).
 * Exclusivo para el Director General de FEDER.
 */
export default function Index({ paginas, redes }) {
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(null);
    const [modalPaginaAbierto, setModalPaginaAbierto] = useState(false);

    const [redSeleccionada, setRedSeleccionada] = useState(null);
    const [modalRedAbierto, setModalRedAbierto] = useState(false);

    const handleEditarPagina = (pag) => {
        setPaginaSeleccionada(pag);
        setModalPaginaAbierto(true);
    };

    const handleNuevaRed = () => {
        setRedSeleccionada(null);
        setModalRedAbierto(true);
    };

    const handleEditarRed = (red) => {
        setRedSeleccionada(red);
        setModalRedAbierto(true);
    };

    const handleEliminarRed = (red) => {
        if (confirm(`¿Eliminar la red social "${red.plataforma}"?`)) {
            router.delete(route('admin.institucional.redes.destroy', red.id_red_social));
        }
    };

    return (
        <AdminLayout title="Contenidos Institucionales y Redes">
            <Head title="Contenidos Institucionales - Portal FEDER" />

            {/* Cabecera del Módulo con botón de vista previa */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Información Corporativa</h2>
                    <p className="text-xs text-slate-500">Actualiza los apartados de identidad, ubicación y redes oficiales.</p>
                </div>
                <a
                    href="/nosotros"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow transition"
                >
                    <span>🌐</span>
                    <span>Ver en Portal Público</span>
                </a>
            </div>

            {/* Apartados Institucionales */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center space-x-2">
                    <span>🏛️</span>
                    <span>Apartados Institucionales Editables (Páginas Estáticas)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginas.map((pag) => (
                        <div key={pag.id_pagina} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 text-base">{pag.titulo}</h4>
                                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-medium">
                                        ID #{pag.id_pagina}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-xs line-clamp-4 leading-relaxed mb-4 whitespace-pre-line">
                                    {(pag.contenido || '').split('\n').filter(l => !l.trim().startsWith('[MAPA]:')).join('\n')}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                <span>{pag.ultima_actualizacion ? new Date(pag.ultima_actualizacion).toLocaleDateString() : 'Activo'}</span>
                                <button
                                    onClick={() => handleEditarPagina(pag)}
                                    className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg transition"
                                >
                                    ✏️ Modificar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Redes Sociales Oficiales */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                            <span>📱</span>
                            <span>Canales y Redes Sociales Oficiales</span>
                        </h3>
                        <p className="text-xs text-slate-500">Enlaces mostrados en el pie de página y sección de contacto del portal.</p>
                    </div>
                    <button
                        onClick={handleNuevaRed}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow transition"
                    >
                        <span>➕</span>
                        <span>Añadir Red</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-2.5">Plataforma</th>
                                <th className="px-4 py-2.5">Enlace Oficial</th>
                                <th className="px-4 py-2.5">Estado</th>
                                <th className="px-4 py-2.5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {redes && redes.length > 0 ? (
                                redes.map((red) => (
                                    <tr key={red.id_red_social} className="hover:bg-slate-50/70">
                                        <td className="px-4 py-3 font-semibold text-slate-800">
                                            <div className="flex items-center space-x-2">
                                                <SocialIcon platform={red.plataforma} className="w-4 h-4 text-emerald-600" />
                                                <span>{red.plataforma}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 font-mono truncate max-w-xs">{red.url_enlace}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${red.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                                {red.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <button
                                                onClick={() => handleEditarRed(red)}
                                                className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminarRed(red)}
                                                className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-6 text-center text-slate-400 italic">
                                        No se han registrado redes sociales oficiales. Haz clic en "Añadir Red".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modales de Edición */}
            <PaginaModal
                pagina={paginaSeleccionada}
                isOpen={modalPaginaAbierto}
                onClose={() => setModalPaginaAbierto(false)}
            />

            <RedSocialModal
                red={redSeleccionada}
                isOpen={modalRedAbierto}
                onClose={() => setModalRedAbierto(false)}
            />
        </AdminLayout>
    );
}

