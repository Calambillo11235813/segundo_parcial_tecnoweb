import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/StatusBadge';

/**
 * Bandeja Administrativa de Consultas Ciudadanas (CU-07, RF-16).
 * Accesible para Director y Secretaria.
 */
export default function Index({ consultas, filtros, metricas, estados = [] }) {
    const handleFiltrar = (e) => {
        e.preventDefault();
        router.get(route('admin.consultas.index'), {
            buscar: e.target.buscar.value,
            estado: e.target.estado.value,
        }, { preserveState: true });
    };

    const handleCambiarEstadoRapido = (id, nuevoEstado) => {
        router.patch(route('admin.consultas.cambiarEstado', id), {
            estado: nuevoEstado,
        }, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Bandeja de Consultas">
            <Head title="Bandeja de Consultas - Portal FEDER" />

            {/* Cabecera */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Bandeja de Consultas y Solicitudes</h2>
                    <p className="text-xs text-slate-500">Gestiona y responde los mensajes recibidos desde el formulario público de contacto.</p>
                </div>
                <Link
                    href={route('public.contacto.index')}
                    target="_blank"
                    className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition self-start"
                >
                    🌐 Ver Formulario Público
                </Link>
            </div>

            {/* Tarjetas de Métricas de Atención */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Recibidas</span>
                    <p className="text-2xl font-extrabold text-slate-800 mt-1">{metricas.total}</p>
                    <span className="text-[10px] text-slate-500">Buzón histórico</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs">
                    <span className="text-[11px] font-bold text-amber-700 uppercase block">Pendientes</span>
                    <p className="text-2xl font-extrabold text-amber-600 mt-1">{metricas.pendientes}</p>
                    <span className="text-[10px] text-amber-700">Requieren atención</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-xs">
                    <span className="text-[11px] font-bold text-blue-700 uppercase block">En Proceso</span>
                    <p className="text-2xl font-extrabold text-blue-600 mt-1">{metricas.en_proceso}</p>
                    <span className="text-[10px] text-blue-700">En revisión interna</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase block">Atendidas</span>
                    <p className="text-2xl font-extrabold text-emerald-700 mt-1">{metricas.atendidos}</p>
                    <span className="text-[10px] text-emerald-700">Respondidas por correo</span>
                </div>
            </div>

            {/* Barra de Filtros */}
            <form onSubmit={handleFiltrar} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    name="buscar"
                    defaultValue={filtros?.buscar || ''}
                    placeholder="Buscar por remitente, correo, asunto o contenido..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500"
                />
                <select name="estado" defaultValue={filtros?.estado || ''} className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500 font-medium">
                    <option value="">Todos los Estados</option>
                    {estados.map((est) => (
                        <option key={est} value={est}>{est}</option>
                    ))}
                </select>
                <button type="submit" className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition">
                    Filtrar Bandeja
                </button>
            </form>

            {/* Tabla de Consultas */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">ID / Fecha</th>
                                <th className="px-4 py-3">Remitente</th>
                                <th className="px-4 py-3">Asunto y Extracto</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Responsable</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {consultas.data?.length > 0 ? (
                                consultas.data.map((c) => (
                                    <tr key={c.id_consulta} className={`hover:bg-slate-50/80 transition ${c.estado === 'Pendiente' ? 'bg-amber-50/20' : ''}`}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="font-mono font-bold text-slate-800 block">#{c.id_consulta}</span>
                                            <span className="text-[11px] text-slate-400">
                                                {c.fecha_envio ? new Date(c.fecha_envio).toLocaleDateString('es-BO') : 'N/D'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-slate-800">{c.nombre_remitente}</p>
                                            <a href={`mailto:${c.correo_remitente}`} className="text-[11px] text-emerald-700 hover:underline">
                                                {c.correo_remitente}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 max-w-md">
                                            <p className="font-bold text-slate-800 truncate">{c.asunto}</p>
                                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.mensaje}</p>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <StatusBadge status={c.estado} />
                                        </td>
                                        <td className="px-4 py-3 text-[11px] text-slate-500">
                                            {c.usuario?.nombre_completo || <span className="italic text-slate-400">Sin asignar</span>}
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                                            <select
                                                value={c.estado}
                                                onChange={(e) => handleCambiarEstadoRapido(c.id_consulta, e.target.value)}
                                                className="text-[11px] py-1 pl-2 pr-6 rounded-lg border-slate-200 focus:ring-emerald-500"
                                                title="Cambiar estado rápido"
                                            >
                                                {estados.map((est) => (
                                                    <option key={est} value={est}>{est}</option>
                                                ))}
                                            </select>
                                            <Link
                                                href={route('admin.consultas.show', c.id_consulta)}
                                                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs"
                                            >
                                                {c.estado === 'Atendido' ? '👁️ Ver Detalle' : '✉️ Atender / Responder'}
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-10 text-center text-slate-400 italic">
                                        No se encontraron consultas ciudadanas con los criterios seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {consultas.links && consultas.links.length > 3 && (
                    <div className="p-4 border-t border-slate-100 flex justify-center space-x-1">
                        {consultas.links.map((link, idx) => (
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
        </AdminLayout>
    );
}

