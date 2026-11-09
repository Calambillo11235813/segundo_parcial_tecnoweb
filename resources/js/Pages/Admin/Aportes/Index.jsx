import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmModal from '@/Components/ConfirmModal';

/**
 * Tablero Administrativo de Gestión y Validación de Aportes (CU-06, RF-11).
 * Accesible para los roles Director y Secretaria.
 */
export default function Index({ aportes, filtros, metricas, modalidades, campanasLista }) {
    const [modal, setModal] = useState(null);
    const [procesando, setProcesando] = useState(false);

    const handleFiltrar = (e) => {
        e.preventDefault();
        router.get(route('admin.aportes.index'), {
            buscar: e.target.buscar.value,
            estado: e.target.estado.value,
            modalidad: e.target.modalidad.value,
            campana_id: e.target.campana_id.value,
        }, { preserveState: true });
    };

    const handleAccion = () => {
        if (!modal) return;
        setProcesando(true);
        const ruta = modal.tipo === 'confirmar' ? 'admin.aportes.confirmar' : 'admin.aportes.rechazar';
        router.patch(route(ruta, modal.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setProcesando(false);
                setModal(null);
            },
        });
    };

    const fmtBs = (v) => 'Bs. ' + Number(v || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 });

    return (
        <AdminLayout title="Aportes y Donaciones">
            <Head title="Gestión de Aportes - Portal FEDER" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Verificación de Aportes Económicos</h2>
                <p className="text-xs text-slate-500">Valida comprobantes bancarios, transferencias y confirma fondos para los proyectos.</p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Confirmado</span>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{fmtBs(metricas.total_recaudado)}</p>
                    <span className="text-[10px] text-slate-500">{metricas.confirmados_count} aportes consolidados</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Pendiente de Validación</span>
                    <p className="text-xl font-extrabold text-amber-600 mt-1">{fmtBs(metricas.total_pendiente)}</p>
                    <span className="text-[10px] text-slate-500">{metricas.pendientes_count} compromisos por verificar</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Registrados</span>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">{metricas.total_aportes}</p>
                    <span className="text-[10px] text-slate-500">Intenciones recibidas</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Rechazados / Anulados</span>
                    <p className="text-xl font-extrabold text-red-600 mt-1">{metricas.rechazados_count}</p>
                    <span className="text-[10px] text-slate-500">No concretados</span>
                </div>
            </div>

            {/* Filtros */}
            <form onSubmit={handleFiltrar} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <input type="text" name="buscar" defaultValue={filtros?.buscar || ''} placeholder="Buscar por donante..." className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500" />
                <select name="estado" defaultValue={filtros?.estado || ''} className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500">
                    <option value="">Todos los Estados</option>
                    <option value="Pendiente de Confirmación">Pendiente de Confirmación</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Rechazado">Rechazado</option>
                </select>
                <select name="modalidad" defaultValue={filtros?.modalidad || ''} className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500">
                    <option value="">Todas las Modalidades</option>
                    {modalidades?.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select name="campana_id" defaultValue={filtros?.campana_id || ''} className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500 truncate">
                    <option value="">Todas las Campañas</option>
                    {campanasLista?.map(c => <option key={c.id_campana} value={c.id_campana}>{c.titulo}</option>)}
                </select>
                <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition">Filtrar Aportes</button>
            </form>

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Código</th>
                                <th className="px-4 py-3">Donante / Contacto</th>
                                <th className="px-4 py-3">Campaña / Destino</th>
                                <th className="px-4 py-3">Monto</th>
                                <th className="px-4 py-3">Modalidad</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {aportes.data?.length > 0 ? (
                                aportes.data.map((a) => (
                                    <tr key={a.id_aporte} className="hover:bg-slate-50/70 transition">
                                        <td className="px-4 py-3 font-mono font-bold text-slate-800">#{a.codigo_comprobante}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-slate-800">{a.nombre_donante}</p>
                                            <span className="text-[11px] text-slate-400">{a.correo_donante}</span>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <p className="font-semibold text-slate-800 line-clamp-1">{a.campana?.titulo}</p>
                                            <span className="text-[10px] text-emerald-700">📍 {a.campana?.comunidad?.nombre}</span>
                                        </td>
                                        <td className="px-4 py-3 font-black text-emerald-700">{fmtBs(a.monto)}</td>
                                        <td className="px-4 py-3 font-medium text-slate-700">{a.modalidad}</td>
                                        <td className="px-4 py-3 text-slate-500 text-[11px] font-mono">{a.fecha_registro ? new Date(a.fecha_registro).toLocaleDateString('es-BO') : 'N/D'}</td>
                                        <td className="px-4 py-3"><StatusBadge status={a.estado} /></td>
                                        <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                                            {a.estado === 'Pendiente de Confirmación' ? (
                                                <>
                                                    <button onClick={() => setModal({ id: a.id_aporte, tipo: 'confirmar', title: 'Confirmar Aporte', message: `¿Confirma el ingreso de ${fmtBs(a.monto)} para la campaña?` })} className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition">Confirmar</button>
                                                    <button onClick={() => setModal({ id: a.id_aporte, tipo: 'rechazar', title: 'Rechazar Aporte', message: '¿Desea marcar este aporte como Rechazado?' })} className="px-2.5 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition">Rechazar</button>
                                                </>
                                            ) : a.estado === 'Confirmado' ? (
                                                <button onClick={() => setModal({ id: a.id_aporte, tipo: 'rechazar', title: 'Anular Aporte Confirmado', message: 'Se restará el monto del saldo acumulado de la campaña. ¿Continuar?' })} className="px-2 py-1 rounded text-slate-400 hover:text-red-600 text-[11px] transition">Anular</button>
                                            ) : (
                                                <button onClick={() => setModal({ id: a.id_aporte, tipo: 'confirmar', title: 'Reabrir y Confirmar', message: '¿Desea validar y sumar este aporte?' })} className="px-2 py-1 rounded text-slate-400 hover:text-emerald-700 text-[11px] transition">Reabrir</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="px-4 py-10 text-center text-slate-400 italic">No se encontraron registros de aportes.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {aportes.links && aportes.links.length > 3 && (
                    <div className="p-4 border-t border-slate-100 flex justify-center space-x-1">
                        {aportes.links.map((link, idx) => (
                            <Link key={idx} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-3 py-1.5 text-xs rounded-lg ${link.active ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'} ${!link.url && 'opacity-40 pointer-events-none'}`} />
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!modal}
                title={modal?.title || 'Confirmación'}
                message={modal?.message || '¿Desea procesar esta acción?'}
                confirmText={modal?.tipo === 'confirmar' ? 'Confirmar Aporte' : 'Rechazar Aporte'}
                loading={procesando}
                onConfirm={handleAccion}
                onClose={() => setModal(null)}
            />
        </AdminLayout>
    );
}
