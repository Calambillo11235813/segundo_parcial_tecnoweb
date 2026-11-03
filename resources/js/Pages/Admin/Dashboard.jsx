import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/**
 * Vista de Panel de Control General (Dashboard - CU-01).
 * Muestra métricas globales, accesos rápidos y visor histórico de auditoría.
 */
export default function Dashboard({ stats, ultimasAuditorias }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isDirector = user?.rol?.nombre_rol?.toLowerCase() === 'director';

    return (
        <AdminLayout title="Panel de Control Principal">
            <Head title="Dashboard - Portal FEDER" />

            {/* Tarjeta de Bienvenida */}
            <div className="bg-gradient-to-r from-emerald-800 to-slate-800 rounded-2xl p-6 text-white shadow-lg mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs uppercase bg-emerald-700/80 px-2.5 py-1 rounded-full font-semibold tracking-wider">
                                {user?.rol?.nombre_rol || 'Personal'}
                            </span>
                            <span className="text-xs text-emerald-200">Portal FEDER</span>
                        </div>
                        <h2 className="text-2xl font-bold mt-2">¡Bienvenido(a), {user?.nombre_completo}!</h2>
                        <p className="text-sm text-slate-300 mt-1">
                            Sistema de Difusión, CMS y Crowdfunding Comunitario para la Chiquitanía.
                        </p>
                    </div>
                    {isDirector && (
                        <Link
                            href={route('admin.usuarios.index')}
                            className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition self-start md:self-auto text-sm"
                        >
                            <span>👥</span>
                            <span>Administrar Usuarios</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Usuarios</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-2">{stats.total_usuarios}</p>
                    <p className="text-xs text-slate-500 mt-1">Registrados en PostgreSQL</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Usuarios Activos</p>
                    <p className="text-3xl font-extrabold text-emerald-700 mt-2">{stats.usuarios_activos}</p>
                    <p className="text-xs text-slate-500 mt-1">Habilitados para ingresar</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Roles del Sistema</p>
                    <p className="text-3xl font-extrabold text-blue-700 mt-2">{stats.total_roles}</p>
                    <p className="text-xs text-slate-500 mt-1">Director, Secretaria, Instructor</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Eventos de Auditoría</p>
                    <p className="text-3xl font-extrabold text-slate-700 mt-2">{stats.total_auditorias}</p>
                    <p className="text-xs text-slate-500 mt-1">Trazas históricas registradas</p>
                </div>
            </div>

            {/* Tabla de Actividad Reciente (Auditoría) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800">Trazabilidad y Auditoría Reciente</h3>
                        <p className="text-xs text-slate-500">Últimas acciones registradas en feder.auditoria</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">CU-01</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Fecha y Hora</th>
                                <th className="px-6 py-3">Acción</th>
                                <th className="px-6 py-3">Tabla</th>
                                <th className="px-6 py-3">Usuario</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {ultimasAuditorias && ultimasAuditorias.length > 0 ? (
                                ultimasAuditorias.map((item) => (
                                    <tr key={item.id_auditoria} className="hover:bg-slate-50/60">
                                        <td className="px-6 py-3.5 text-xs text-slate-500 font-mono">
                                            {new Date(item.fecha_hora).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3.5 font-semibold text-slate-800 text-xs">
                                            {item.accion_realizada}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                                {item.tabla_afectada}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-xs text-slate-600">
                                            {item.usuario?.nombre_completo || `Usuario #${item.usuario_id}`}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-6 text-center text-slate-400 text-xs">
                                        No se registran eventos de auditoría recientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
