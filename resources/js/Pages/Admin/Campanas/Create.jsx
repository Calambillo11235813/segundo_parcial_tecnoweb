import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/**
 * Parametrización y Publicación de Nueva Campaña de Crowdfunding (CU-05, RF-09).
 */
export default function Create({ comunidades = [] }) {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaFinDefault = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        descripcion: '',
        meta_economica: '',
        fecha_inicio: hoy,
        fecha_limite: fechaFinDefault,
        estado: 'Activa',
        comunidad_id: comunidades[0]?.id_comunidad || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.campanas.store'));
    };

    return (
        <AdminLayout title="Nueva Campaña">
            <Head title="Nueva Campaña de Recaudación - Portal FEDER" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Crear Campaña de Financiamiento</h2>
                        <p className="text-xs text-slate-500">Define la meta económica, el plazo y la comunidad beneficiaria del proyecto.</p>
                    </div>
                    <Link
                        href={route('admin.campanas.index')}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        ← Volver al Listado
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Título de la Campaña *</label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            placeholder="ej. Adquisición de Prensa Hidráulica para Aceite de Totaí"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                            required
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
                                required
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
                                    required
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
                                required
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
                                required
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

                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Descripción del Plan de Negocio / Inversión *</label>
                        <textarea
                            rows={6}
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Detalla el destino de los fondos, equipos a adquirir, impacto productivo y número de familias beneficiadas..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed font-normal"
                            required
                        />
                        {errors.descripcion && <p className="text-red-600 mt-1">{errors.descripcion}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                        <Link
                            href={route('admin.campanas.index')}
                            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition disabled:opacity-50"
                        >
                            {processing ? 'Publicando...' : 'Publicar Campaña'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

