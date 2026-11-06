import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import FiltroComunidades from './FiltroComunidades';

/**
 * Catálogo público de Comunidades y Programas Productivos (CU-04).
 * Visitantes y cooperantes consultan y filtran las áreas de intervención de FEDER.
 */
export default function Index({ comunidades, filtros, rubros, ubicaciones, totales }) {
    const hayFiltros = filtros?.buscar || filtros?.rubro || filtros?.ubicacion;

    return (
        <PublicLayout>
            <Head title="Comunidades y Programas - Fundación FEDER" />

            {/* Cabecera Hero con indicadores */}
            <section className="bg-gradient-to-r from-green-800 to-slate-900 text-white py-14 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <span className="text-xs uppercase tracking-widest bg-green-700/80 px-3 py-1 rounded-full font-bold">
                        Intervención Rural
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">Comunidades Chiquitanas</h1>
                    <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto leading-relaxed">
                        Conoce los municipios donde trabajamos y los programas de asistencia técnica que fortalecen la producción artesanal.
                    </p>
                    <div className="flex justify-center gap-8 mt-6">
                        <div>
                            <p className="text-3xl font-extrabold">{totales.comunidades}</p>
                            <p className="text-[11px] uppercase tracking-wider text-slate-300">Comunidades</p>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-orange-400">{totales.programas}</p>
                            <p className="text-[11px] uppercase tracking-wider text-slate-300">Programas activos</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <FiltroComunidades filtros={filtros} rubros={rubros} ubicaciones={ubicaciones} />

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">
                        {hayFiltros ? 'Resultados de búsqueda' : 'Catálogo de comunidades'}
                    </h2>
                    <span className="text-xs text-slate-500">
                        {comunidades.length} {comunidades.length === 1 ? 'comunidad encontrada' : 'comunidades encontradas'}
                    </span>
                </div>

                {/* Cuadrícula de fichas comunitarias */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comunidades.length > 0 ? comunidades.map((c) => (
                        <article key={c.id_comunidad} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-green-700 to-orange-500" />
                            <div className="p-5 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-bold text-slate-900 text-lg leading-snug">{c.nombre}</h3>
                                    <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                                        {c.programas_count} {c.programas_count === 1 ? 'programa' : 'programas'}
                                    </span>
                                </div>
                                <p className="text-xs text-green-700 font-semibold mt-1">📍 {c.ubicacion}</p>
                                {c.descripcion && (
                                    <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">{c.descripcion}</p>
                                )}

                                {c.programas.length > 0 && (
                                    <ul className="mt-4 space-y-2">
                                        {c.programas.slice(0, 3).map((p) => (
                                            <li key={p.id_programa} className="flex items-start gap-2 text-xs">
                                                <span className="text-orange-600 mt-0.5">●</span>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 truncate">{p.nombre}</p>
                                                    <p className="text-[10px] text-orange-700 font-medium">{p.area_productiva}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="px-5 pb-5">
                                <Link
                                    href={route('public.comunidades.show', c.id_comunidad)}
                                    className="block text-center w-full py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold transition"
                                >
                                    Ver ficha completa →
                                </Link>
                            </div>
                        </article>
                    )) : (
                        <div className="col-span-full py-14 text-center bg-white rounded-2xl border border-slate-200">
                            <p className="text-3xl mb-2">🔎</p>
                            <p className="text-sm text-slate-500">No encontramos comunidades o programas con esos criterios.</p>
                            <p className="text-xs text-slate-400 mt-1">Prueba con otro rubro o limpia los filtros.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}

