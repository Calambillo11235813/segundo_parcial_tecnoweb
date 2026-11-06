import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TestimonioModal from './TestimonioModal';

/**
 * Gestión de Testimonios Comunitarios (CU-03, RF-08).
 * Accesible por Director e Instructor.
 */
export default function Index({ testimonios, comunidades }) {
    const [testimonioSeleccionado, setTestimonioSeleccionado] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    const handleNuevo = () => {
        setTestimonioSeleccionado(null);
        setModalAbierto(true);
    };

    const handleEditar = (t) => {
        setTestimonioSeleccionado(t);
        setModalAbierto(true);
    };

    const handleEliminar = (t) => {
        if (confirm(`¿Eliminar el testimonio "${t.titulo}"?`)) {
            router.delete(route('admin.testimonios.destroy', t.id_testimonio));
        }
    };

    return (
        <AdminLayout title="Testimonios Comunitarios">
            <Head title="Gestión de Testimonios - Portal FEDER" />

            {/* Cabecera */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Experiencias y Voces Chiquitanas</h2>
                    <p className="text-xs text-slate-500">Historias de superación, impacto productivo y relatos de artesanos.</p>
                </div>
                <button
                    onClick={handleNuevo}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition"
                >
                    <span>➕</span>
                    <span>Registrar Testimonio</span>
                </button>
            </div>

            {/* Cuadrícula de Testimonios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonios.data && testimonios.data.length > 0 ? (
                    testimonios.data.map((t) => (
                        <div key={t.id_testimonio} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <img
                                        src={t.fotografia || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120'}
                                        alt={t.titulo}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-xs flex-shrink-0"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120'; }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-slate-800 text-sm truncate">{t.titulo}</h3>
                                        <span className="text-[10px] text-emerald-700 font-semibold block truncate">
                                            📍 {t.comunidad?.nombre || 'Comunidad Rural'}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-slate-600 text-xs italic leading-relaxed line-clamp-4 mb-4">
                                    "{t.texto}"
                                </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.estado === 'Publicado' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                        {t.estado}
                                    </span>
                                    {t.enlace_audiovisual && (
                                        <a
                                            href={t.enlace_audiovisual}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-red-600 hover:text-red-700 font-semibold text-[11px] flex items-center space-x-0.5"
                                            title="Ver Video de Testimonio"
                                        >
                                            <span>🎥</span>
                                            <span>Video</span>
                                        </a>
                                    )}
                                </div>
                                <div className="space-x-1">
                                    <button
                                        onClick={() => handleEditar(t)}
                                        className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(t)}
                                        className="px-2.5 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-[11px] transition"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-400 text-xs italic bg-white rounded-2xl border border-slate-200">
                        No se registran testimonios comunitarios activos. Haz clic en "Registrar Testimonio".
                    </div>
                )}
            </div>

            {/* Paginación */}
            {testimonios.links && testimonios.links.length > 3 && (
                <div className="mt-6 flex justify-center space-x-1">
                    {testimonios.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 text-xs rounded-lg ${link.active ? 'bg-emerald-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'} ${!link.url && 'opacity-40 pointer-events-none'}`}
                        />
                    ))}
                </div>
            )}

            <TestimonioModal
                testimonio={testimonioSeleccionado}
                comunidades={comunidades}
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
            />
        </AdminLayout>
    );
}

