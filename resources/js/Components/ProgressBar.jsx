import React from 'react';

/**
 * Barra de progreso porcentual para campañas de Crowdfunding (UI_COMPONENTS_GUIDE §4.2, CU-05).
 */
export default function ProgressBar({ meta = 0, recaudado = 0, mostrarMontos = true, className = '' }) {
    const metaNum = parseFloat(meta) || 0;
    const recNum = parseFloat(recaudado) || 0;
    const porcentaje = metaNum > 0 ? Math.min(100, Math.round((recNum / metaNum) * 100)) : 0;
    const esCompletada = recNum >= metaNum && metaNum > 0;

    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                    <span className={esCompletada ? 'text-emerald-700' : 'text-orange-600'}>
                        {porcentaje}%
                    </span>
                    <span className="text-slate-500 font-normal">financiado</span>
                </span>
                {esCompletada && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        ¡Meta lograda!
                    </span>
                )}
            </div>

            {/* Barra de progreso */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                    style={{ width: `${porcentaje}%` }}
                    className={`h-full transition-all duration-500 rounded-full ${
                        esCompletada
                            ? 'bg-emerald-600'
                            : 'bg-gradient-to-r from-orange-500 to-emerald-600'
                    }`}
                />
            </div>

            {/* Montos formateados */}
            {mostrarMontos && (
                <div className="flex justify-between items-center text-[11px] text-slate-600 pt-0.5 font-medium">
                    <span>
                        Recaudado: <strong className="text-slate-900">Bs. {recNum.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </span>
                    <span className="text-slate-500">
                        Meta: Bs. {metaNum.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            )}
        </div>
    );
}

