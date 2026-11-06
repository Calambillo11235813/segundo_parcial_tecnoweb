import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

/**
 * Ficha pública de una Comunidad (CU-04): programas, testimonios y noticias relacionadas.
 */
export default function Show({ comunidad, noticias }) {
    return (
        <PublicLayout>
            <Head title={`${comunidad.nombre} - Comunidades FEDER`} />

            {/* Migas de pan */}
            <div className="bg-slate-100 border-b border-slate-200 py-3">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-xs text-slate-500 flex items-center gap-2">
                    <Link href={route('public.comunidades.index')} className="hover:text-green-700">Comunidades</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold">{comunidad.nombre}</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
                {/* Encabezado de la ficha */}
                <header className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider">📍 {comunidad.ubicacion}</p>
                    <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{comunidad.nombre}</h1>
                    {comunidad.descripcion && (
                        <p className="text-sm text-slate-700 leading-relaxed mt-3 whitespace-pre-line">{comunidad.descripcion}</p>
                    )}
                </header>

                {/* Programas productivos */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">🛠️ Programas de Asistencia Técnica</h2>
                    {comunidad.programas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {comunidad.programas.map((p) => (
                                <div key={p.id_programa} className="bg-white p-5 rounded-2xl border border-slate-200 border-l-4 border-l-orange-500 shadow-sm">
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                        {p.area_productiva}
                                    </span>
                                    <h3 className="font-bold text-slate-900 mt-2">{p.nombre}</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed mt-1 whitespace-pre-line">{p.descripcion}</p>
                                    {p.poblacion_beneficiaria && (
                                        <p className="text-xs text-green-800 font-semibold mt-3">👥 {p.poblacion_beneficiaria}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">Próximamente se publicarán programas en esta comunidad.</p>
                    )}
                </section>

                {/* Testimonios de la comunidad (CU-03) */}
                {comunidad.testimonios.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">💬 Voces de la Comunidad</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {comunidad.testimonios.map((t) => (
                                <blockquote key={t.id_testimonio} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                    <p className="text-sm text-slate-700 italic leading-relaxed">"{t.texto}"</p>
                                    <footer className="flex items-center gap-3 mt-4">
                                        {t.fotografia && (
                                            <img src={t.fotografia} alt={t.titulo} className="w-10 h-10 rounded-full object-cover border-2 border-green-700" />
                                        )}
                                        <span className="text-xs font-bold text-slate-900">{t.titulo}</span>
                                    </footer>
                                </blockquote>
                            ))}
                        </div>
                    </section>
                )}

                {/* Noticias relacionadas (RF-07) */}
                {noticias.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">📰 Actividades Recientes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {noticias.map((n) => (
                                <Link
                                    key={n.id_noticia}
                                    href={route('public.noticias.show', n.id_noticia)}
                                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition group"
                                >
                                    <img src={n.imagen_principal} alt={n.titulo} className="h-28 w-full object-cover" />
                                    <p className="p-3 text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-green-700">{n.titulo}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <div className="text-center">
                    <Link href={route('public.comunidades.index')} className="text-sm font-semibold text-green-700 hover:text-green-800">
                        ← Volver al catálogo de comunidades
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}

