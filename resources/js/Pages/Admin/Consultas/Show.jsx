import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/StatusBadge';

/**
 * Vista de Detalle y Contestación de Consulta Ciudadana (CU-07, RF-16).
 * Permite actualizar el estado y despachar respuesta oficial vía correo SMTP.
 */
export default function Show({ consulta, estados = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        respuesta: '',
    });

    const handleCambiarEstado = (nuevoEstado) => {
        router.patch(route('admin.consultas.cambiarEstado', consulta.id_consulta), {
            estado: nuevoEstado,
        }, { preserveScroll: true });
    };

    const handleResponder = (e) => {
        e.preventDefault();
        post(route('admin.consultas.responder', consulta.id_consulta), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout title={`Consulta #${consulta.id_consulta}`}>
            <Head title={`Atender Consulta #${consulta.id_consulta} - Portal FEDER`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Barra superior de retorno y estado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Link
                        href={route('admin.consultas.index')}
                        className="text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
                    >
                        ← Volver a la Bandeja de Consultas
                    </Link>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500 font-semibold">Cambiar estado:</span>
                        {estados.map((est) => (
                            <button
                                key={est}
                                type="button"
                                onClick={() => handleCambiarEstado(est)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                                    consulta.estado === est
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {est}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ficha del Mensaje Recibido */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <span className="text-[11px] font-mono text-slate-400 uppercase">
                                Mensaje #{consulta.id_consulta} • Recibido el {consulta.fecha_envio ? new Date(consulta.fecha_envio).toLocaleString('es-BO') : 'N/D'}
                            </span>
                            <h2 className="text-xl font-bold text-slate-900 mt-1">{consulta.asunto}</h2>
                        </div>
                        <StatusBadge status={consulta.estado} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                        <div>
                            <span className="text-slate-400 font-semibold block">Remitente:</span>
                            <span className="font-bold text-slate-800">{consulta.nombre_remitente}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-semibold block">Correo de Contacto:</span>
                            <a href={`mailto:${consulta.correo_remitente}`} className="font-bold text-emerald-700 hover:underline">
                                {consulta.correo_remitente}
                            </a>
                        </div>
                        <div>
                            <span className="text-slate-400 font-semibold block">Última Gestión por:</span>
                            <span className="font-bold text-slate-800">
                                {consulta.usuario?.nombre_completo || 'Pendiente de asignación'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Contenido de la Consulta y Trazabilidad
                        </h3>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {consulta.mensaje}
                        </div>
                    </div>
                </div>

                {/* Formulario de Respuesta Institucional vía SMTP */}
                <form onSubmit={handleResponder} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                ✉️ Redactar Contestación Oficial (SMTP)
                            </h3>
                            <p className="text-xs text-slate-500">
                                Se enviará un correo institucional a <strong>{consulta.correo_remitente}</strong> y la consulta quedará marcada como <strong>Atendido</strong>.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Mensaje de Respuesta *
                        </label>
                        <textarea
                            rows="5"
                            value={data.respuesta}
                            onChange={(e) => setData('respuesta', e.target.value)}
                            placeholder={`Estimado(a) ${consulta.nombre_remitente}, en respuesta a su consulta sobre "${consulta.asunto}" le informamos que...`}
                            className={`w-full text-xs rounded-xl border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 ${errors.respuesta ? 'border-red-400' : ''}`}
                        />
                        {errors.respuesta && <p className="text-red-500 text-[11px] mt-1">{errors.respuesta}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
                        >
                            {processing ? 'Despachando Correo...' : '📨 Enviar Respuesta por Correo y Marcar Atendido'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

