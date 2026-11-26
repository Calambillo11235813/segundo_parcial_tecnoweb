import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ProgressBar from '@/Components/ProgressBar';
import StatusBadge from '@/Components/StatusBadge';
import ShareButtons from '@/Components/ShareButtons';
import { getYouTubeEmbedUrl } from '@/Pages/Admin/Campanas/SeccionVideoDestino';

/**
 * Ficha de detalle de Campaña de Crowdfunding Comunitario (CU-05, RF-10).
 * Presenta el plan de negocio, desglose de financiamiento y aportes confirmados.
 */
export default function Show({ campana }) {
    const formatearBs = (val) =>
        new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(val || 0);

    const esActiva = campana.estado === 'Activa';
    const dias = campana.dias_restantes ?? 0;
    const videoUrl = campana.config_pago?.video_youtube || '';
    const videoEmbedUrl = getYouTubeEmbedUrl(videoUrl);
    const destinoFondos = campana.config_pago?.destino_fondos || '';
    const fechaCierreFormateada = campana.fecha_limite
        ? new Date(campana.fecha_limite).toLocaleDateString('es-BO')
        : 'Por definir';

    return (
        <PublicLayout>
            <Head title={`${campana.titulo} - Campaña FEDER`} />

            {/* Cabecera / Breadcrumbs */}
            <nav className="bg-slate-100 border-b border-slate-200 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex items-center space-x-2">
                    <Link href="/" className="hover:text-emerald-700">Inicio</Link>
                    <span>/</span>
                    <Link href={route('public.campanas.index')} className="hover:text-emerald-700">Campañas</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold truncate max-w-md">{campana.titulo}</span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Cuadrícula Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Columna Izquierda: Información de la Campaña y Comunidad (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                                    📍 Comunidad: {campana.comunidad?.nombre || 'Comunidad Rural'}
                                </span>
                                <StatusBadge status={campana.estado} />
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                                {campana.titulo}
                            </h1>

                            {!destinoFondos && campana.descripcion && (
                                <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                                    {campana.descripcion}
                                </div>
                            )}

                            {/* Video corto de la comunidad (YouTube, máx. 3 min) */}
                            {videoUrl && (
                                <div className="space-y-2.5 pt-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                            <span>🎥</span>
                                            <span>Mensaje de la Comunidad</span>
                                        </h2>
                                        <a
                                            href={videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] font-semibold text-red-600 hover:underline"
                                        >
                                            Ver en YouTube ↗
                                        </a>
                                    </div>
                                    {videoEmbedUrl ? (
                                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video shadow-sm">
                                            <iframe
                                                src={videoEmbedUrl}
                                                title={`Video comunitario - ${campana.titulo}`}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <a
                                            href={videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition text-xs font-bold"
                                        >
                                            <span>▶️ Ver video explicativo de la comunidad en YouTube</span>
                                            <span>↗</span>
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Destino del dinero para incentivar la donación */}
                            {destinoFondos && (
                                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                                        <span>💡</span>
                                        <span>¿En qué se invertirá tu aporte?</span>
                                    </p>
                                    <p className="text-sm text-emerald-950 leading-relaxed whitespace-pre-line">
                                        {destinoFondos}
                                    </p>
                                </div>
                            )}

                            {/* Tarjeta de la Comunidad Asociada */}
                            {campana.comunidad && (
                                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-slate-500">Comunidad Beneficiaria</p>
                                        <p className="text-sm font-bold text-slate-800">{campana.comunidad.nombre}</p>
                                        <p className="text-xs text-slate-600">Ubicación: {campana.comunidad.ubicacion}</p>
                                    </div>
                                    <Link
                                        href={route('public.comunidades.show', campana.comunidad.id_comunidad)}
                                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                                    >
                                        Ver Ficha Comunitaria →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Muro de Aportes y Transparencia */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900">
                                    🤝 Aportes Comunitarios Confirmados
                                </h3>
                                <span className="text-xs font-medium text-slate-500">
                                    {campana.aportes?.length || 0} contribuciones registradas
                                </span>
                            </div>

                            {campana.aportes && campana.aportes.length > 0 ? (
                                <ul className="divide-y divide-slate-100">
                                    {campana.aportes.map((aporte) => (
                                        <li key={aporte.id_aporte} className="py-3 flex justify-between items-center text-xs">
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-[10px] ${
                                                        aporte.es_anonimo
                                                            ? 'bg-slate-100 text-slate-500'
                                                            : 'bg-emerald-100 text-emerald-800'
                                                    }`}
                                                >
                                                    {aporte.es_anonimo ? '🔒' : (aporte.nombre_donante || 'A')[0].toUpperCase()}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                                                        <span>{aporte.es_anonimo ? 'Donante Anónimo' : (aporte.nombre_donante || 'Donante Anónimo')}</span>
                                                        {aporte.es_anonimo && (
                                                            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                                                                Anónimo
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        {aporte.fecha_registro
                                                            ? new Date(aporte.fecha_registro).toLocaleDateString('es-BO')
                                                            : 'Aporte confirmado'} • {aporte.modalidad || 'Transferencia'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-black text-emerald-700 text-sm">
                                                +{formatearBs(aporte.monto)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-slate-500 italic py-4 text-center">
                                    Aún no hay aportes registrados para esta iniciativa. ¡Sé el primero en colaborar!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha: Tarjeta de Recaudación y Acción (1 col) */}
                    <aside className="space-y-6 sticky top-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                Avance de Financiamiento
                            </h2>

                            <ProgressBar
                                meta={campana.meta_economica}
                                recaudado={campana.monto_recaudado}
                                mostrarMontos={true}
                            />

                            {/* Fechas e Indicadores */}
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-center">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Tiempo</p>
                                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                                        {esActiva ? (dias > 0 ? `${dias} días` : 'Último día') : 'Finalizada'}
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Fecha Cierre</p>
                                    <p className="text-xs font-bold text-slate-800 mt-1">
                                        {fechaCierreFormateada}
                                    </p>
                                </div>
                            </div>

                            {/* Botón de Donación o Mensaje */}
                            {esActiva ? (
                                <div className="space-y-2">
                                    <Link
                                        href={route('public.donaciones.create', campana.id_campana)}
                                        className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition text-center flex items-center justify-center gap-2"
                                    >
                                        <span>❤️</span> Aportar a este Plan Comunitario
                                    </Link>
                                    <a
                                        href={route('public.campanas.pdf', campana.id_campana)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-2.5 px-4 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs transition text-center flex items-center justify-center gap-2"
                                    >
                                        <span>📄</span> Descargar Ficha Técnica (PDF)
                                    </a>
                                    <p className="text-[11px] text-center text-slate-400 leading-tight">
                                        Aportes transparentes supervisados por la Dirección de FEDER.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="p-4 rounded-xl bg-slate-100 text-center text-xs text-slate-600 font-medium">
                                        Esta campaña ha concluido su período de recaudación activa.
                                    </div>
                                    <a
                                        href={route('public.campanas.pdf', campana.id_campana)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition text-center flex items-center justify-center gap-2"
                                    >
                                        <span>📄</span> Descargar Expediente de Cierre (PDF)
                                    </a>
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-100">
                                <ShareButtons
                                    url={route('public.campanas.show', campana.id_campana)}
                                    title={campana.titulo}
                                    description={`Apoya esta campaña comunitaria en ${campana.comunidad?.nombre || 'la Chiquitanía'} con Fundación FEDER`}
                                    category="Campaña"
                                    variant="inline"
                                    heading="Compartir esta campaña"
                                />
                            </div>

                            <div className="pt-2">
                                <Link
                                    href={route('public.campanas.index')}
                                    className="block text-center text-xs text-slate-600 hover:text-emerald-700 font-semibold"
                                >
                                    ← Volver a todas las campañas
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}

