import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import SocialIcon from '@/Components/SocialIcon';

/**
 * Página Pública de Contacto y Consultas Ciudadanas (CU-07, RF-16).
 * Permite a visitantes, aliados estratégicos y donantes enviar mensajes a la bandeja interna.
 */
export default function Contacto({ ubicacion, redes = [], asuntosSugeridos = [] }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre_remitente: '',
        correo_remitente: '',
        asunto: '',
        mensaje: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.contacto.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const textoUbicacion = (ubicacion?.contenido || 'San Joaquín 2052, Santa Cruz de la Sierra. Teléfono: +591 (3) 334-5678. Correo: contacto@feder.org.bo')
        .split('\n')[0];

    return (
        <PublicLayout>
            <Head title="Contacto y Consultas - Fundación FEDER" />

            {/* Cabecera Hero */}
            <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white py-14 px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-3">
                    <span className="text-xs uppercase tracking-widest bg-emerald-700/80 px-3.5 py-1 rounded-full font-bold">
                        Atención Ciudadana y Alianzas
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Buzón Institucional de Consultas
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        ¿Tienes consultas sobre nuestros programas rurales, alianzas estratégicas o campañas de recaudación? Escríbenos y nuestro equipo te responderá por correo electrónico.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {flash?.success && (
                    <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 shadow-xs">
                        <span className="text-2xl">✅</span>
                        <div className="text-xs sm:text-sm font-semibold">{flash.success}</div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Columna Izquierda: Información Institucional */}
                    <aside className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <span>📍</span> Sede y Canales Oficiales
                            </h2>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {textoUbicacion}
                            </p>

                            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                                <p><strong>Horario de Atención:</strong> Lunes a Viernes (08:30 - 16:30)</p>
                                <p><strong>Correo Oficial:</strong> contacto@feder.org.bo</p>
                            </div>

                            {redes.length > 0 && (
                                <div className="pt-3 border-t border-slate-100">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                                        Redes Sociales Oficiales
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {redes.map((r) => (
                                            <a
                                                key={r.id_red_social}
                                                href={r.url_enlace}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold transition"
                                            >
                                                <SocialIcon platform={r.plataforma} className="w-4 h-4" />
                                                <span>{r.plataforma}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-emerald-900 text-white rounded-2xl p-6 space-y-2 shadow-sm">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Compromiso de Atención</span>
                            <h3 className="text-sm font-bold">Seguimiento Transparente</h3>
                            <p className="text-xs text-emerald-100 leading-relaxed">
                                Todas las solicitudes son registradas en nuestra bandeja interna y atendidas directamente por Dirección o Secretaría General.
                            </p>
                        </div>
                    </aside>

                    {/* Columna Derecha: Formulario de Consulta (2 cols) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">
                            ✉️ Envíanos tu Consulta o Solicitud
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Nombre Completo o Institución *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nombre_remitente}
                                        onChange={(e) => setData('nombre_remitente', e.target.value)}
                                        placeholder="Ej: Juan Pérez / ONG Aliada"
                                        className={`w-full text-xs rounded-xl border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 ${errors.nombre_remitente ? 'border-red-400' : ''}`}
                                    />
                                    {errors.nombre_remitente && <p className="text-red-500 text-[11px] mt-1">{errors.nombre_remitente}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Correo Electrónico de Respuesta *
                                    </label>
                                    <input
                                        type="email"
                                        value={data.correo_remitente}
                                        onChange={(e) => setData('correo_remitente', e.target.value)}
                                        placeholder="ejemplo@correo.com"
                                        className={`w-full text-xs rounded-xl border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 ${errors.correo_remitente ? 'border-red-400' : ''}`}
                                    />
                                    {errors.correo_remitente && <p className="text-red-500 text-[11px] mt-1">{errors.correo_remitente}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Asunto de la Consulta *
                                </label>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {asuntosSugeridos.map((sug) => (
                                        <button
                                            key={sug}
                                            type="button"
                                            onClick={() => setData('asunto', sug)}
                                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${data.asunto === sug ? 'bg-emerald-700 text-white border-emerald-700 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                                        >
                                            {sug}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={data.asunto}
                                    onChange={(e) => setData('asunto', e.target.value)}
                                    placeholder="Escriba o seleccione el motivo de su mensaje..."
                                    className={`w-full text-xs rounded-xl border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 ${errors.asunto ? 'border-red-400' : ''}`}
                                />
                                {errors.asunto && <p className="text-red-500 text-[11px] mt-1">{errors.asunto}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Mensaje Detallado *
                                </label>
                                <textarea
                                    rows="5"
                                    value={data.mensaje}
                                    onChange={(e) => setData('mensaje', e.target.value)}
                                    placeholder="Describa su consulta, propuesta de cooperación o requerimiento de información..."
                                    className={`w-full text-xs rounded-xl border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 ${errors.mensaje ? 'border-red-400' : ''}`}
                                />
                                {errors.mensaje && <p className="text-red-500 text-[11px] mt-1">{errors.mensaje}</p>}
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                                >
                                    {processing ? 'Enviando Mensaje...' : '📨 Enviar Consulta a FEDER'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

