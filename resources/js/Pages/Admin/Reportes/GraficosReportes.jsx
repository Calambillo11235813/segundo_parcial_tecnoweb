import React from 'react';

/**
 * Componente modular de visualizaciones y gráficos estadísticos interactivos (CU-08, RF-17).
 * Proyecta barras comparativas de recaudación, distribución de modalidades, consultas y cobertura.
 */
export default function GraficosReportes({
    categoriaActiva = 'todo',
    campanasBalance = [],
    aportesPorModalidad = [],
    consultasStats = {},
    coberturaComunidades = [],
}) {
    const fmtBs = (v) => 'Bs. ' + Number(v || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 });

    const totalModalidad = aportesPorModalidad.reduce((acc, m) => acc + Number(m.monto_total || 0), 0);
    const maxMetaCampana = Math.max(...campanasBalance.map((c) => Math.max(Number(c.meta_economica || 0), Number(c.monto_recaudado || 0))), 1);

    const mostrarRecaudacion = categoriaActiva === 'todo' || categoriaActiva === 'recaudacion';
    const mostrarConsultas = categoriaActiva === 'todo' || categoriaActiva === 'consultas';
    const mostrarCobertura = categoriaActiva === 'todo' || categoriaActiva === 'cobertura';

    return (
        <div className="space-y-6">
            {mostrarRecaudacion && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico 1: Comparativo de Metas vs Recaudación por Campaña */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">📊 Efectividad de Metas Económicas por Campaña</h3>
                                <p className="text-[11px] text-slate-500">Comparativa entre presupuesto meta (gris) y fondos confirmados (esmeralda)</p>
                            </div>
                        </div>

                        {campanasBalance.length > 0 ? (
                            <div className="space-y-4 pt-1">
                                {campanasBalance.map((c) => {
                                    const meta = Number(c.meta_economica || 0);
                                    const rec = Number(c.monto_recaudado || 0);
                                    const anchoMeta = Math.max(8, Math.round((meta / maxMetaCampana) * 100));
                                    const anchoRec = Math.min(100, Math.round((rec / maxMetaCampana) * 100));
                                    return (
                                        <div key={c.id_campana} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-800 truncate max-w-xs" title={c.titulo}>
                                                    {c.titulo} <span className="text-[10px] font-normal text-slate-400">({c.comunidad?.nombre})</span>
                                                </span>
                                                <span className="font-mono text-[11px] font-bold text-emerald-700">
                                                    {fmtBs(rec)} / <span className="text-slate-500">{fmtBs(meta)} ({c.porcentaje}%)</span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-lg h-4 relative overflow-hidden">
                                                <div
                                                    className="bg-slate-300/70 h-full rounded-lg transition-all duration-300"
                                                    style={{ width: `${anchoMeta}%` }}
                                                    title={`Meta: ${fmtBs(meta)}`}
                                                />
                                                <div
                                                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-full rounded-lg absolute top-0 left-0 transition-all duration-500"
                                                    style={{ width: `${anchoRec}%` }}
                                                    title={`Recaudado: ${fmtBs(rec)}`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic py-6 text-center">Sin campañas en el período filtrado.</p>
                        )}
                    </div>

                    {/* Gráfico 2: Distribución por Modalidad de Aporte */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-800">💳 Aportes por Modalidad</h3>
                            <p className="text-[11px] text-slate-500">Preferencia de canales de pago confirmados</p>
                        </div>

                        <div className="space-y-4 pt-1">
                            {aportesPorModalidad.map((m) => {
                                const porc = totalModalidad > 0 ? Math.round((Number(m.monto_total) / totalModalidad) * 100) : 0;
                                const colorBarra = m.modalidad === 'QR' ? 'bg-cyan-600' : m.modalidad === 'Transferencia bancaria' ? 'bg-emerald-600' : 'bg-amber-500';
                                return (
                                    <div key={m.modalidad} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-800">{m.modalidad}</span>
                                            <span className="font-extrabold text-slate-900">{fmtBs(m.monto_total)}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div className={`${colorBarra} h-full rounded-full`} style={{ width: `${porc}%` }} />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>{m.cantidad} aportes validados</span>
                                            <span className="font-bold">{porc}% del volumen</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {(mostrarConsultas || mostrarCobertura) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico 3: Volumen y Estado de Consultas Ciudadanas */}
                    {mostrarConsultas && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">📬 Eficiencia de Atención Ciudadana (CU-07)</h3>
                                    <p className="text-[11px] text-slate-500">Clasificación por estado de respuesta institucional</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                                    {consultasStats.tasa_atencion || 0}% Resueltas
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center pt-1">
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                                    <p className="text-xl font-black text-amber-600">{consultasStats.pendientes || 0}</p>
                                    <span className="text-[10px] font-bold uppercase text-amber-800">Pendientes</span>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                                    <p className="text-xl font-black text-blue-600">{consultasStats.en_proceso || 0}</p>
                                    <span className="text-[10px] font-bold uppercase text-blue-800">En Proceso</span>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <p className="text-xl font-black text-emerald-700">{consultasStats.atendidos || 0}</p>
                                    <span className="text-[10px] font-bold uppercase text-emerald-800">Atendidas</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gráfico 4: Cobertura de Comunidades y Programas Productivos */}
                    {mostrarCobertura && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-800">🌾 Cobertura por Comunidad Chiquitana (CU-04)</h3>
                                <p className="text-[11px] text-slate-500">Programas de asistencia técnica, campañas y relatos por municipio</p>
                            </div>

                            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                                {coberturaComunidades.map((com) => (
                                    <div key={com.id_comunidad} className="py-2.5 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="font-bold text-slate-800">{com.nombre}</p>
                                            <span className="text-[10px] text-slate-400">📍 {com.ubicacion}</span>
                                        </div>
                                        <div className="flex gap-2 text-[10px] font-bold">
                                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">{com.programas_count} prog.</span>
                                            <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700">{com.campanas_count} camp.</span>
                                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">{com.testimonios_count} test.</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

