import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ProgressBar from '@/Components/ProgressBar';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmModal from '@/Components/ConfirmModal';

/**
 * Tablero Administrativo de Campañas de Crowdfunding (CU-05, RF-09, RF-10).
 * Exclusivo para el Director General de FEDER.
 */
export default function Index({ campanas, filtros, metricas }) {
    const [cerrandoId, setCerrandoId] = useState(null);
    const [procesando, setProcesando] = useState(false);

    const handleFiltrar = (e) => {
        e.preventDefault();
        router.get(route('admin.campanas.index'), {
            buscar: e.target.buscar.value,
            estado: e.target.estado.value,
        }, { preserveState: true });
    };

    const handleConfirmarCierre = () => {
        if (!cerrandoId) return;
        setProcesando(true);
        router.patch(route('admin.campanas.cerrar', cerrandoId), {}, {
            preserveScroll: true,
            onFinish: () => {
                setProcesando(false);
                setCerrandoId(null);
            },
        });
    };

    const fmtBs = (val) => 'Bs. ' + Number(val || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 });

    return (
        <AdminLayout title="Campañas de Recaudación">
            <Head title="Gestión de Campañas - Portal FEDER" />

            {/* Cabecera y accesos rápidos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Financiamiento Colectivo Comunitario</h2>
                    <p className="text-xs text-slate-500">Supervisa las metas económicas, plazos y avance de fondos para la Chiquitanía.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link
                        href={route('public.campanas.index')}
                        target="_blank"
                        className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
                    >
                        🌐 Ver Portal Público
                    </Link>
                    <Link
                        href={route('admin.campanas.create')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
                    >
                        ➕ Nueva Campaña
                    </Link>
                </div>
            </div>

            {/* Tarjetas de Métricas Ejecutivas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Recaudado</span>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{fmtBs(metricas.total_recaudado)}</p>
                    <span className="text-[10px] text-slate-500">Aportes validados</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Meta en Activas</span>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">{fmtBs(metricas.total_meta)}</p>
                    <span className="text-[10px] text-slate-500">Objetivo acumulado</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Campañas Activas</span>
                    <p className="text-xl font-extrabold text-orange-600 mt-1">{metricas.activas}</p>
                    <span className="text-[10px] text-slate-500">Recibiendo aportes</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Campañas Concluidas</span>
                    <p className="text-xl font-extrabold text-slate-700 mt-1">{metricas.cerradas}</p>
                    <span className="text-[10px] text-slate-500">Cerradas o cumplidas</span>
                </div>
            </div>

            {/* Barra de Filtros */}
            <form onSubmit={handleFiltrar} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    name="buscar"
                    defaultValue={filtros?.buscar || ''}
                    placeholder="Buscar por título, comunidad o descripción..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <select
                    name="estado"
                    defaultValue={filtros?.estado || ''}
                    className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500 font-medium"
                >
                    <option value="">Todos los Estados</option>
                    <option value="Activa">Activa</option>
                    <option value="Cerrada">Cerrada</option>
                    <option value="Pausada">Pausada</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition">
                    Filtrar
                </button>
            </form>

            {/* Tabla de Campañas */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Campaña / Comunidad</th>
                                <th className="px-4 py-3 min-w-[200px]">Progreso de Recaudación</th>
                                <th className="px-4 py-3">Plazos</th>
                                <th className="px-4 py-3 text-center">Aportes</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campanas.data && campanas.data.length > 0 ? (
                                campanas.data.map((c) => (
                                    <tr key={c.id_campana} className="hover:bg-slate-50/70 transition">
                                        <td className="px-4 py-3 max-w-xs">
                                            <p className="font-bold text-slate-800 line-clamp-1">{c.titulo}</p>
                                            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                                                📍 {c.comunidad?.nombre || 'Comunidad Rural'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <ProgressBar meta={c.meta_economica} recaudado={c.monto_recaudado} mostrarMontos={true} />
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-[11px] font-mono">
                                            <span>Hasta: {new Date(c.fecha_limite).toLocaleDateString()}</span>
                                            <span className="block text-[10px] text-slate-400">
                                                {c.estado === 'Activa' ? (c.dias_restantes > 0 ? `⏳ ${c.dias_restantes} d.` : 'Finaliza hoy') : 'Concluida'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-slate-700">{c.aportes_count ?? 0}</td>
                                        <td className="px-4 py-3"><StatusBadge status={c.estado} /></td>
                                        <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                                            <Link href={route('admin.campanas.edit', c.id_campana)} className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition">
                                                Editar
                                            </Link>
                                            {c.estado === 'Activa' && (
                                                <button onClick={() => setCerrandoId(c.id_campana)} className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold transition">
                                                    Cerrar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-10 text-center text-slate-400 italic">
                                        No se registran campañas que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {campanas.links && campanas.links.length > 3 && (
                    <div className="p-4 border-t border-slate-100 flex justify-center space-x-1">
                        {campanas.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 text-xs rounded-lg ${link.active ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'} ${!link.url && 'opacity-40 pointer-events-none'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!cerrandoId}
                title="Cerrar Campaña de Financiamiento"
                message="¿Está seguro de cerrar esta campaña? Una vez cerrada, ya no se recibirán nuevos aportes públicos."
                confirmText="Sí, Cerrar Campaña"
                loading={procesando}
                onConfirm={handleConfirmarCierre}
                onClose={() => setCerrandoId(null)}
            />
        </AdminLayout>
    );
}
