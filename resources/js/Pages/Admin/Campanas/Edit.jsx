import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ProgressBar from '@/Components/ProgressBar';

/**
 * Modificación de Parámetros de Campaña de Financiamiento (CU-05, RF-09).
 */
export default function Edit({ campana, comunidades = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        titulo: campana.titulo || '',
        descripcion: campana.descripcion || '',
        meta_economica: campana.meta_economica || '',
        fecha_inicio: campana.fecha_inicio ? campana.fecha_inicio.split('T')[0] : '',
        fecha_limite: campana.fecha_limite ? campana.fecha_limite.split('T')[0] : '',
        estado: campana.estado || 'Activa',
        comunidad_id: campana.comunidad_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.campanas.update', campana.id_campana));
    };

    return (
        <AdminLayout title={`Editar Campaña #${campana.id_campana}`}>
            <Head title={`Editar Campaña #${campana.id_campana} - Portal FEDER`} />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Modificar Campaña #{campana.id_campana}</h2>
                        <p className="text-xs text-slate-500">Actualiza las metas, plazos o descripción del plan comunitario.</p>
                    </div>
                    <Link
                        href={route('admin.campanas.index')}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        ← Volver al Listado
                    </Link>
                </div>

                {/* Resumen del avance financiero en tiempo real */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avance de Recaudación en Vivo</span>
                    <ProgressBar
                        meta={campana.meta_economica}
                        recaudado={campana.monto_recaudado}
                        mostrarMontos={true}
                    />
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Título de la Campaña *</label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
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
                            <input
                                type="number"
                                step="0.01"
                                min="1"
                                value={data.meta_economica}
                                onChange={(e) => setData('meta_economica', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-mono font-bold"
                                required
                            />
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
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Estado</label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                            >
                                <option value="Activa">Activa</option>
                                <option value="Pausada">Pausada</option>
                                <option value="Cerrada">Cerrada</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Descripción del Plan de Negocio *</label>
                        <textarea
                            rows={6}
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed font-normal"
                            required
                        />
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
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

