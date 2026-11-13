import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/StatusBadge';
import GraficosReportes from './GraficosReportes';

/**
 * Tablero Directivo de Reportes y Estadísticas Consolidadas (CU-08, RF-17).
 * Acceso exclusivo para el Director General de la Fundación FEDER.
 */
export default function Index({
    resumenFinanciero = {},
    campanasBalance = [],
    aportesPorModalidad = [],
    consultasStats = {},
    coberturaComunidades = [],
    filtros = {},
    comunidadesLista = [],
    campanasLista = [],
}) {
    const [categoriaActiva, setCategoriaActiva] = useState('todo');
    const [comunidadId, setComunidadId] = useState(filtros?.comunidad_id || '');
    const [campanaId, setCampanaId] = useState(filtros?.campana_id || '');
    const [fechaDesde, setFechaDesde] = useState(filtros?.fecha_desde || '');
    const [fechaHasta, setFechaHasta] = useState(filtros?.fecha_hasta || '');

    const paramsActuales = {
        comunidad_id: comunidadId || undefined,
        campana_id: campanaId || undefined,
        fecha_desde: fechaDesde || undefined,
        fecha_hasta: fechaHasta || undefined,
    };

    const aplicarParametros = (e) => {
        e.preventDefault();
        router.get(route('admin.reportes.index'), paramsActuales, { preserveState: true });
    };

    const limpiarParametros = () => {
        setComunidadId('');
        setCampanaId('');
        setFechaDesde('');
        setFechaHasta('');
        router.get(route('admin.reportes.index'));
    };

    const fmtBs = (v) => 'Bs. ' + Number(v || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 });

    const categorias = [
        { id: 'todo', label: '📊 Consolidado Integral' },
        { id: 'recaudacion', label: '💰 Recaudación y Donaciones' },
        { id: 'consultas', label: '📬 Consultas Atendidas' },
        { id: 'cobertura', label: '🌾 Cobertura de Comunidades' },
    ];

    return (
        <AdminLayout title="Reportes y Estadísticas">
            <Head title="Reportes y Estadísticas - Portal FEDER" />

            {/* Cabecera y Exportación PDF */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Centro de Inteligencia y Balance Directivo</h2>
                    <p className="text-xs text-slate-500">Monitorea metas financieras, compromisos de cooperantes, atención ciudadana e impacto comunitario.</p>
                </div>
                <a
                    href={route('admin.reportes.pdf', paramsActuales)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition self-start"
                >
                    <span>📥</span>
                    <span>Exportar Reporte Consolidado (PDF)</span>
                </a>
            </div>

            {/* Selector de Categorías de Análisis */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categorias.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoriaActiva(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            categoriaActiva === cat.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Parámetros de Consulta y Filtrado */}
            <form onSubmit={aplicarParametros} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Comunidad</label>
                    <select value={comunidadId} onChange={(e) => setComunidadId(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border-slate-300 focus:ring-emerald-500">
                        <option value="">Todas las Comunidades</option>
                        {comunidadesLista.map((com) => <option key={com.id_comunidad} value={com.id_comunidad}>{com.nombre}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Campaña Específica</label>
                    <select value={campanaId} onChange={(e) => setCampanaId(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border-slate-300 focus:ring-emerald-500 truncate">
                        <option value="">Todas las Campañas</option>
                        {campanasLista.map((c) => <option key={c.id_campana} value={c.id_campana}>{c.titulo}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Fecha Desde</label>
                    <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border-slate-300 focus:ring-emerald-500" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Fecha Hasta</label>
                    <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border-slate-300 focus:ring-emerald-500" />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition">Consultar</button>
                    {(comunidadId || campanaId || fechaDesde || fechaHasta) && (
                        <button type="button" onClick={limpiarParametros} className="py-2 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg">✕</button>
                    )}
                </div>
            </form>

            {/* Indicadores Numéricos Consolidados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Recaudación Confirmada</span>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{fmtBs(resumenFinanciero.recaudado_total)}</p>
                    <span className="text-[10px] text-slate-500">De {fmtBs(resumenFinanciero.meta_total)} proyectados</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Efectividad Global de Metas</span>
                    <p className="text-xl font-extrabold text-orange-600 mt-1">{resumenFinanciero.efectividad_global}%</p>
                    <span className="text-[10px] text-slate-500">{resumenFinanciero.metas_logradas} de {resumenFinanciero.campanas_analizadas} campañas al 100%</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Intenciones de Donación</span>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">{resumenFinanciero.aportes_confirmados} confirmados</p>
                    <span className="text-[10px] text-amber-600 font-semibold">{resumenFinanciero.aportes_pendientes} en revisión ({fmtBs(resumenFinanciero.monto_pendiente)})</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Consultas / Programas</span>
                    <p className="text-xl font-extrabold text-blue-700 mt-1">{consultasStats.atendidos}/{consultasStats.total} consultas</p>
                    <span className="text-[10px] text-slate-500">{resumenFinanciero.total_comunidades} comunidades • {resumenFinanciero.total_programas} programas</span>
                </div>
            </div>

            {/* Gráficos Estadísticos Interactivos */}
            <GraficosReportes
                categoriaActiva={categoriaActiva}
                campanasBalance={campanasBalance}
                aportesPorModalidad={aportesPorModalidad}
                consultasStats={consultasStats}
                coberturaComunidades={coberturaComunidades}
            />

            {/* Matriz Comparativa de Campañas Analizadas */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mt-6">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800">📋 Matriz Comparativa de Campañas Analizadas</h3>
                    <span className="text-[11px] text-slate-400">{campanasBalance.length} registros</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Campaña</th>
                                <th className="px-4 py-3">Comunidad</th>
                                <th className="px-4 py-3">Meta (Bs.)</th>
                                <th className="px-4 py-3">Recaudado (Bs.)</th>
                                <th className="px-4 py-3">Cumplimiento</th>
                                <th className="px-4 py-3 text-center">Aportes (Conf. / Pend.)</th>
                                <th className="px-4 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campanasBalance.map((c) => (
                                <tr key={c.id_campana} className="hover:bg-slate-50/70">
                                    <td className="px-4 py-3 font-bold text-slate-800 max-w-xs truncate">{c.titulo}</td>
                                    <td className="px-4 py-3 text-emerald-700 font-semibold">📍 {c.comunidad?.nombre}</td>
                                    <td className="px-4 py-3 font-mono">{fmtBs(c.meta_economica)}</td>
                                    <td className="px-4 py-3 font-mono font-bold text-emerald-700">{fmtBs(c.monto_recaudado)}</td>
                                    <td className="px-4 py-3 font-extrabold text-slate-800">{c.porcentaje}%</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-emerald-700 font-bold">{c.aportes_confirmados_count || 0}</span> / <span className="text-amber-600 font-semibold">{c.aportes_pendientes_count || 0}</span>
                                    </td>
                                    <td className="px-4 py-3"><StatusBadge status={c.estado} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
