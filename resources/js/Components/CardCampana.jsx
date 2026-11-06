import React from 'react';
import { Link } from '@inertiajs/react';
import ProgressBar from '@/Components/ProgressBar';
import StatusBadge from '@/Components/StatusBadge';

/**
 * Tarjeta de visualización de Campaña de Crowdfunding (UI_COMPONENTS_GUIDE §4.5, CU-05).
 */
export default function CardCampana({ campana }) {
    const dias = campana.dias_restantes ?? 0;
    const esActiva = campana.estado === 'Activa';

    return (
        <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between group">
            <div>
                {/* Cabecera visual con gradiente Chiquitano */}
                <div className="h-28 bg-gradient-to-r from-emerald-800 to-slate-900 p-4 flex flex-col justify-between text-white relative">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                            📍 {campana.comunidad?.nombre || 'Comunidad Rural'}
                        </span>
                        <StatusBadge status={campana.estado} />
                    </div>
                    <div className="text-right">
                        <span className="text-[11px] font-medium text-emerald-300">
                            {esActiva
                                ? (dias > 0 ? `⏳ ${dias} días restantes` : '⏳ Finaliza hoy')
                                : 'Campaña Concluida'}
                        </span>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="p-5 space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition line-clamp-2">
                            {campana.titulo}
                        </h3>
                        <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                            {campana.descripcion}
                        </p>
                    </div>

                    {/* Barra de progreso */}
                    <ProgressBar
                        meta={campana.meta_economica}
                        recaudado={campana.monto_recaudado}
                        mostrarMontos={true}
                    />
                </div>
            </div>

            {/* Acciones */}
            <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 mt-2">
                <Link
                    href={route('public.campanas.show', campana.id_campana)}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition"
                >
                    Ver detalles →
                </Link>

                <Link
                    href={route('public.campanas.show', campana.id_campana)}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition"
                >
                    ❤️ Donar a Campaña
                </Link>
            </div>
        </article>
    );
}

