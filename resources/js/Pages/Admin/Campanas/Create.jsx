import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SeccionPagos from './SeccionPagos';
import SeccionVideoDestino from './SeccionVideoDestino';

const TABS = [
    { id: 'general', icono: '📋', titulo: '1. Datos Generales', subtitulo: 'Título, comunidad y meta' },
    { id: 'video', icono: '🎥', titulo: '2. Video y Destino', subtitulo: 'YouTube y uso de fondos' },
    { id: 'pagos', icono: '💳', titulo: '3. Formas de Pago', subtitulo: 'Cuenta bancaria y QR' },
];

/**
 * Parametrización y Publicación de Nueva Campaña de Crowdfunding (CU-05, RF-09).
 */
export default function Create({ comunidades = [] }) {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaFinDefault = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const [tabActiva, setTabActiva] = useState('general');

    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        descripcion: '',
        meta_economica: '',
        fecha_inicio: hoy,
        fecha_limite: fechaFinDefault,
        estado: 'Activa',
        comunidad_id: comunidades[0]?.id_comunidad || '',
        pago_banco: '',
        pago_numero_cuenta: '',
        pago_titular: '',
        pago_nit_ci: '',
        pago_direccion_efectivo: '',
        qr_imagen_archivo: null,
        eliminar_qr: false,
        video_youtube: '',
        destino_fondos: '',
    });

    const erroresPorTab = {
        general: Boolean(errors.titulo || errors.comunidad_id || errors.meta_economica || errors.fecha_inicio || errors.fecha_limite || errors.estado),
        video: Boolean(errors.video_youtube || errors.destino_fondos),
        pagos: Boolean(errors.pago_banco || errors.pago_numero_cuenta || errors.pago_titular || errors.pago_nit_ci || errors.pago_direccion_efectivo || errors.qr_imagen_archivo),
    };

    const completadoPorTab = {
        general: Boolean(data.titulo.trim() && data.comunidad_id && data.meta_economica && data.fecha_inicio && data.fecha_limite),
        video: Boolean(data.destino_fondos.trim()),
        pagos: Boolean(data.pago_banco.trim() || data.pago_numero_cuenta.trim() || data.qr_imagen_archivo),
    };

    const idxActual = TABS.findIndex((t) => t.id === tabActiva);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.campanas.store'), {
            forceFormData: true,
            onError: (errs) => {
                if (errs.titulo || errs.comunidad_id || errs.meta_economica || errs.fecha_inicio || errs.fecha_limite || errs.estado) {
                    setTabActiva('general');
                } else if (errs.video_youtube || errs.destino_fondos) {
                    setTabActiva('video');
                } else {
                    setTabActiva('pagos');
                }
            },
        });
    };

    return (
        <AdminLayout title="Nueva Campaña">
            <Head title="Nueva Campaña de Recaudación - Portal FEDER" />

            <div className="max-w-3xl mx-auto space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Crear Campaña de Financiamiento</h2>
                        <p className="text-xs text-slate-500">Completa cada sección para publicar el proyecto comunitario.</p>
                    </div>
                    <Link
                        href={route('admin.campanas.index')}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        ← Volver al Listado
                    </Link>
                </div>

                {/* Navegación por 3 secciones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TABS.map((tab) => {
                        const activa = tabActiva === tab.id;
                        const tieneError = erroresPorTab[tab.id];
                        const completa = completadoPorTab[tab.id];

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTabActiva(tab.id)}
                                className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                                    activa
                                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500 shadow-xs'
                                        : tieneError
                                            ? 'border-red-300 bg-red-50/40 hover:bg-red-50'
                                            : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                            >
                                <div className="min-w-0">
                                    <p className={`text-xs font-bold flex items-center gap-1.5 ${activa ? 'text-emerald-900' : 'text-slate-800'}`}>
                                        <span>{tab.icono}</span>
                                        <span className="truncate">{tab.titulo}</span>
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{tab.subtitulo}</p>
                                </div>
                                {tieneError ? (
                                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center shrink-0">!</span>
                                ) : completa ? (
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">✓</span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit} noValidate className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
                    {/* Sección 1: Datos Generales */}
                    {tabActiva === 'general' && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <span>📋</span>
                                    <span>Información Principal de la Campaña</span>
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">Define el título, la comunidad beneficiaria, meta económica y fechas.</p>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 uppercase mb-1">Título de la Campaña *</label>
                                <input
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    placeholder="ej. Adquisición de Prensa Hidráulica para Aceite de Totaí"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                                />
                                {errors.titulo && <p className="text-red-600 mt-1">{errors.titulo}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold text-slate-700 uppercase mb-1">Comunidad Beneficiaria *</label>
                                    <select
                                        value={data.comunidad_id}
                                        onChange={(e) => setData('comunidad_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        <option value="">Seleccione una comunidad...</option>
                                        {comunidades.map((c) => (
                                            <option key={c.id_comunidad} value={c.id_comunidad}>
                                                {c.nombre} ({c.ubicacion})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.comunidad_id && <p className="text-red-600 mt-1">{errors.comunidad_id}</p>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 uppercase mb-1">Meta Económica (Bs.) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-slate-400 font-bold">Bs.</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            value={data.meta_economica}
                                            onChange={(e) => setData('meta_economica', e.target.value)}
                                            placeholder="35000.00"
                                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-mono font-bold"
                                        />
                                    </div>
                                    {errors.meta_economica && <p className="text-red-600 mt-1">{errors.meta_economica}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block font-semibold text-slate-700 uppercase mb-1">Fecha de Inicio *</label>
                                    <input
                                        type="date"
                                        value={data.fecha_inicio}
                                        onChange={(e) => setData('fecha_inicio', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    {errors.fecha_inicio && <p className="text-red-600 mt-1">{errors.fecha_inicio}</p>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 uppercase mb-1">Fecha Límite *</label>
                                    <input
                                        type="date"
                                        value={data.fecha_limite}
                                        onChange={(e) => setData('fecha_limite', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    {errors.fecha_limite && <p className="text-red-600 mt-1">{errors.fecha_limite}</p>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 uppercase mb-1">Estado Inicial</label>
                                    <select
                                        value={data.estado}
                                        onChange={(e) => setData('estado', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                                    >
                                        <option value="Activa">Activa (Recibiendo donaciones)</option>
                                        <option value="Pausada">Pausada</option>
                                        <option value="Cerrada">Cerrada</option>
                                    </select>
                                    {errors.estado && <p className="text-red-600 mt-1">{errors.estado}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sección 2: Video y Destino */}
                    {tabActiva === 'video' && (
                        <SeccionVideoDestino data={data} setData={setData} errors={errors} />
                    )}

                    {/* Sección 3: Formas de Pago */}
                    {tabActiva === 'pagos' && (
                        <SeccionPagos data={data} setData={setData} errors={errors} />
                    )}

                    {/* Barra inferior de navegación y envío */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            {idxActual > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => setTabActiva(TABS[idxActual - 1].id)}
                                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition"
                                >
                                    ← Anterior
                                </button>
                            ) : (
                                <Link
                                    href={route('admin.campanas.index')}
                                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                                >
                                    Cancelar
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {idxActual < TABS.length - 1 && (
                                <button
                                    type="button"
                                    onClick={() => setTabActiva(TABS[idxActual + 1].id)}
                                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold transition"
                                >
                                    Siguiente →
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition disabled:opacity-50"
                            >
                                {processing ? 'Publicando...' : 'Publicar Campaña'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
