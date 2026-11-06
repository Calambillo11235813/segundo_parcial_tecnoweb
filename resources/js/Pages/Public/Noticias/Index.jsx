import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

/**
 * Catálogo Público de Noticias y Experiencias Comunitarias (CU-03).
 */
export default function Index({ noticias, testimonios, filtros }) {
    const handleBuscar = (e) => {
        e.preventDefault();
        router.get(route('public.noticias.index'), {
            buscar: e.target.buscar.value,
        }, { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Noticias y Actualidad - Fundación FEDER" />

            {/* Cabecera Hero */}
            <section className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white py-14 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <span className="text-xs uppercase tracking-widest bg-emerald-700/80 px-3 py-1 rounded-full font-bold">
                        Difusión y Medios
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
                        Noticias y Actividades de Campo
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto leading-relaxed">
                        Conoce los avances, capacitaciones técnicas y proyectos productivos que impulsamos en la Chiquitanía.
                    </p>
                </div>
            </section>

            {/* Contenido Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
                {/* Buscador de Noticias */}
                <div className="max-w-xl mx-auto">
                    <form onSubmit={handleBuscar} className="flex gap-2">
                        <input
                            type="text"
                            name="buscar"
                            defaultValue={filtros?.buscar || ''}
                            placeholder="Buscar notas por tema, comunidad o palabra clave..."
                            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
                        />
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition"
                        >
                            Buscar
                        </button>
                    </form>
                </div>

                {/* Cuadrícula de Noticias */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                            <span>📰</span>
                            <span>Publicaciones Recientes</span>
                        </h2>
                        <span className="text-xs text-slate-500 font-medium">
                            {noticias.total} {noticias.total === 1 ? 'publicación' : 'publicaciones'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {noticias.data && noticias.data.length > 0 ? (
                            noticias.data.map((n) => (
                                <article
                                    key={n.id_noticia}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="relative h-48 overflow-hidden bg-slate-100">
                                            <img
                                                src={n.imagen_principal}
                                                alt={n.titulo}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600'; }}
                                            />
                                            {n.galerias_count > 0 && (
                                                <span className="absolute bottom-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-white flex items-center space-x-1">
                                                    <span>📷</span>
                                                    <span>+{n.galerias_count} fotos</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                                                <span>📅 {n.fecha_publicacion ? new Date(n.fecha_publicacion).toLocaleDateString() : 'Reciente'}</span>
                                                {n.etiquetas && (
                                                    <span className="text-emerald-700 font-semibold truncate max-w-[120px]">
                                                        {n.etiquetas.split(',')[0]}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug group-hover:text-emerald-700 transition mb-2">
                                                {n.titulo}
                                            </h3>

                                            <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                                                {n.contenido}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-5 pt-0">
                                        <Link
                                            href={route('public.noticias.show', n.id_noticia)}
                                            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                                        >
                                            <span>Leer artículo completo</span>
                                            <span>→</span>
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-slate-400 text-sm italic bg-white rounded-2xl border border-slate-200">
                                No se encontraron noticias que coincidan con la búsqueda.
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    {noticias.links && noticias.links.length > 3 && (
                        <div className="mt-8 flex justify-center space-x-1">
                            {noticias.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3.5 py-2 text-xs rounded-lg ${link.active ? 'bg-emerald-700 text-white font-bold' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'} ${!link.url && 'opacity-40 pointer-events-none'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección: Testimonios de la Chiquitanía */}
                {testimonios && testimonios.length > 0 && (
                    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="text-center max-w-2xl mx-auto">
                            <span className="text-xs uppercase tracking-wider text-emerald-700 font-bold">
                                Voces de la Comunidad
                            </span>
                            <h2 className="text-2xl font-bold text-slate-900 mt-1">
                                Testimonios de Artesanos Beneficiarios
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Conoce cómo las iniciativas de aprovechamiento sostenible del totaí y pesoé transforman familias.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {testimonios.map((t) => (
                                <div key={t.id_testimonio} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                                    <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed mb-4">
                                        "{t.texto}"
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={t.fotografia || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                                                alt={t.titulo}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600"
                                            />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-xs">{t.titulo}</h4>
                                                <span className="text-[10px] text-emerald-700 font-semibold block">
                                                    📍 {t.comunidad?.nombre || 'Chiquitanía'}
                                                </span>
                                            </div>
                                        </div>
                                        {t.enlace_audiovisual && (
                                            <a
                                                href={t.enlace_audiovisual}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[11px] transition"
                                            >
                                                <span>▶ Ver Video</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

