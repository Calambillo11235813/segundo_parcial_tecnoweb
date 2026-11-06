import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GaleriaModal from './GaleriaModal';
import GaleriaLista from './GaleriaLista';

/**
 * Edición de Noticia y Gestión de Galería Multimedia (CU-03, RF-01, RF-02).
 */
export default function Edit({ noticia }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        titulo: noticia.titulo || '',
        contenido: noticia.contenido || '',
        etiquetas: noticia.etiquetas || '',
        estado: noticia.estado || 'Publicado',
        fecha_publicacion: noticia.fecha_publicacion ? noticia.fecha_publicacion.split('T')[0] : '',
        imagen_archivo: null,
        imagen_principal: noticia.imagen_principal || '',
    });

    const [modalGaleriaOpen, setModalGaleriaOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(noticia.imagen_principal);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('imagen_archivo', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.noticias.update', noticia.id_noticia), {
            forceFormData: true,
        });
    };

    const handleEliminarMultimedia = (item) => {
        if (confirm(`¿Eliminar el elemento multimedia "${item.titulo}" de la galería?`)) {
            router.delete(route('admin.galeria.destroy', item.id_multimedia));
        }
    };

    return (
        <AdminLayout title={`Editar: ${noticia.titulo}`}>
            <Head title={`Editar Noticia #${noticia.id_noticia} - Portal FEDER`} />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Cabecera */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Modificar Noticia #{noticia.id_noticia}</h2>
                        <p className="text-xs text-slate-500">Autor: {noticia.usuario?.nombre_completo || 'Personal FEDER'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {noticia.estado === 'Publicado' && (
                            <a
                                href={route('public.noticias.show', noticia.id_noticia)}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                🌐 Ver en Portal Público ↗
                            </a>
                        )}
                        <Link
                            href={route('admin.noticias.index')}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-white hover:bg-slate-900 transition"
                        >
                            ← Volver al Listado
                        </Link>
                    </div>
                </div>

                {/* Formulario Principal de la Noticia */}
                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Título de la Publicación *</label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                            required
                        />
                        {errors.titulo && <p className="text-red-600 mt-1">{errors.titulo}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Estado</label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                            >
                                <option value="Publicado">Publicado</option>
                                <option value="Borrador">Borrador</option>
                                <option value="Archivado">Archivado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Fecha</label>
                            <input
                                type="date"
                                value={data.fecha_publicacion}
                                onChange={(e) => setData('fecha_publicacion', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Etiquetas</label>
                            <input
                                type="text"
                                value={data.etiquetas}
                                onChange={(e) => setData('etiquetas', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Imagen Principal */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Actualizar Portada (Opcional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                            />
                        </div>
                        {previewUrl && (
                            <div className="flex items-center space-x-3">
                                <img src={previewUrl} alt="Portada" className="h-20 w-32 object-cover rounded-lg border border-slate-200 shadow-xs" />
                                <span className="text-[11px] text-slate-500">Portada activa</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Contenido de la Noticia *</label>
                        <textarea
                            rows={8}
                            value={data.contenido}
                            onChange={(e) => setData('contenido', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed font-normal"
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-3 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow transition disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Actualizar Publicación'}
                        </button>
                    </div>
                </form>

                {/* Galería Multimedia de la Noticia */}
                <GaleriaLista
                    galerias={noticia.galerias}
                    onAddClick={() => setModalGaleriaOpen(true)}
                    onDeleteClick={handleEliminarMultimedia}
                />
            </div>

            <GaleriaModal
                noticiaId={noticia.id_noticia}
                isOpen={modalGaleriaOpen}
                onClose={() => setModalGaleriaOpen(false)}
            />
        </AdminLayout>
    );
}
