import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import CardCampana from '@/Components/CardCampana';

/**
 * Catálogo público de Campañas de Crowdfunding (CU-05, RF-09).
 * Permite a visitantes y donantes explorar iniciativas y monitorear el progreso económico.
 */
export default function Index({ campanas, filtros, estadisticas }) {
    const [buscar, setBuscar] = useState(filtros?.buscar || '');
    const [estado, setEstado] = useState(filtros?.estado || '');

    const aplicarFiltros = (e) => {
        e?.preventDefault();
        router.get(route('public.campanas.index'), {
            buscar: buscar || undefined,
            estado: estado || undefined,
        }, { preserveState: true, replace: true });
    };

    const limpiarFiltros = () => {
        setBuscar('');
        setEstado('');
        router.get(route('public.campanas.index'));
    };

    const formatearBs = (val) =>
        new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(val || 0);

    return (
        <PublicLayout>
            <Head title="Campañas de Crowdfunding - Fundación FEDER" />

            {/* Hero Principal con Métricas de Impacto */}
            <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white py-14 px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-4">
                    <span className="text-xs uppercase tracking-widest bg-emerald-700/80 px-3.5 py-1 rounded-full font-bold">
                        Crowdfunding Rural Chiquitano
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Financiamiento Comunitario
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Apoya los planes de negocio de las artesanas y productores chiquitanos. Conoce las metas de recaudación y el avance en tiempo real.
                    </p>

                    {/* Métricas Globales */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-2xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-2xl font-black text-emerald-400">
                                {formatearBs(estadisticas?.total_recaudado)}
                            </p>
                            <p className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold mt-1">
                                Total Recaudado
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-2xl font-black text-amber-400">
                                {estadisticas?.campanas_activas || 0}
                            </p>
                            <p className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold mt-1">
                                Campañas Activas
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-2xl font-black text-cyan-300">
                                {estadisticas?.metas_cumplidas || 0}
                            </p>
                            <p className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold mt-1">
                                Metas Cumplidas
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contenedor de Búsqueda y Resultados */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Barra de Filtros */}
                <form onSubmit={aplicarFiltros} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 w-full md:w-auto relative">
                        <input
                            type="text"
                            value={buscar}
                            onChange={(e) => setBuscar(e.target.value)}
                            placeholder="Buscar por título, comunidad o descripción..."
                            className="w-full text-sm rounded-xl border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 pl-4 pr-10 py-2.5"
                        />
                        {buscar && (
                            <button
                                type="button"
                                onClick={() => setBuscar('')}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="text-sm rounded-xl border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 py-2.5 px-3"
                        >
                            <option value="">Todos los Estados</option>
                            <option value="Activa">Activas</option>
                            <option value="Cerrada">Cerradas</option>
                            <option value="Pausada">Pausadas</option>
                        </select>

                        <button
                            type="submit"
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition"
                        >
                            Filtrar
                        </button>

                        {(filtros?.buscar || filtros?.estado) && (
                            <button
                                type="button"
                                onClick={limpiarFiltros}
                                className="text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </form>

                {/* Encabezado de Resultados */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">
                        {filtros?.buscar || filtros?.estado ? 'Iniciativas Filtradas' : 'Campañas Disponibles'}
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                        {campanas.total || campanas.data?.length || 0} proyectos registrados
                    </span>
                </div>

                {/* Cuadrícula de Tarjetas de Campaña */}
                {campanas.data && campanas.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campanas.data.map((campana) => (
                            <CardCampana key={campana.id_campana} campana={campana} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
                        <p className="text-3xl mb-2">🎯</p>
                        <h3 className="text-base font-bold text-slate-800">No se encontraron campañas</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            No existen iniciativas de financiamiento que coincidan con los criterios de búsqueda seleccionados.
                        </p>
                    </div>
                )}

                {/* Paginación */}
                {campanas.links && campanas.links.length > 3 && (
                    <div className="pt-6 flex justify-center space-x-1">
                        {campanas.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
                                    link.active
                                        ? 'bg-emerald-700 text-white font-bold'
                                        : link.url
                                        ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </main>
        </PublicLayout>
    );
}

