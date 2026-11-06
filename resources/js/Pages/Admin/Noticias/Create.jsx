import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/**
 * Redacción de Nueva Publicación (CU-03, RF-01).
 */
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        contenido: '',
        etiquetas: '',
        estado: 'Publicado',
        fecha_publicacion: new Date().toISOString().split('T')[0],
        imagen_archivo: null,
        imagen_principal: '',
    });

    const [modoImagen, setModoImagen] = useState('archivo'); // 'archivo' | 'url'
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('imagen_archivo', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.noticias.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Redactar Noticia">
            <Head title="Nueva Publicación - Portal FEDER" />

            <div className="max-w-4xl mx-auto">
                {/* Cabecera y Retorno */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Nueva Publicación Oficial</h2>
                        <p className="text-xs text-slate-500">Completa los campos para publicar un artículo o comunicado institucional.</p>
                    </div>
                    <Link
                        href={route('admin.noticias.index')}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        ← Volver al Listado
                    </Link>
                </div>

                {/* Formulario de Redacción */}
                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Título de la Publicación *</label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            placeholder="ej. Taller de Extracción Sostenible de Aceite de Totaí..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                            required
                        />
                        {errors.titulo && <p className="text-red-600 mt-1">{errors.titulo}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Estado de Publicación</label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="Publicado">Publicado (Visible en Portal)</option>
                                <option value="Borrador">Borrador (Edición Interna)</option>
                                <option value="Archivado">Archivado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Fecha de Publicación</label>
                            <input
                                type="date"
                                value={data.fecha_publicacion}
                                onChange={(e) => setData('fecha_publicacion', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Etiquetas (Separadas por coma)</label>
                            <input
                                type="text"
                                value={data.etiquetas}
                                onChange={(e) => setData('etiquetas', e.target.value)}
                                placeholder="Totaí, Roboré, Artesanía"
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Imagen Principal */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 uppercase text-[11px]">Imagen de Portada Principal</span>
                            <div className="flex space-x-2 text-[11px]">
                                <button
                                    type="button"
                                    onClick={() => setModoImagen('archivo')}
                                    className={`px-2.5 py-1 rounded font-semibold ${modoImagen === 'archivo' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                                >
                                    Subir Archivo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModoImagen('url')}
                                    className={`px-2.5 py-1 rounded font-semibold ${modoImagen === 'url' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                                >
                                    Enlace URL
                                </button>
                            </div>
                        </div>

                        {modoImagen === 'archivo' ? (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                />
                                {errors.imagen_archivo && <p className="text-red-600 mt-1">{errors.imagen_archivo}</p>}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="url"
                                    value={data.imagen_principal}
                                    onChange={(e) => {
                                        setData('imagen_principal', e.target.value);
                                        setPreviewUrl(e.target.value);
                                    }}
                                    placeholder="https://images.unsplash.com/photo-..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px]"
                                />
                            </div>
                        )}

                        {previewUrl && (
                            <div className="mt-2">
                                <p className="text-[10px] text-slate-500 mb-1">Vista previa de portada:</p>
                                <img src={previewUrl} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-slate-200 shadow-xs" />
                            </div>
                        )}
                    </div>

                    {/* Contenido Completo */}
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Cuerpo / Contenido del Artículo *</label>
                        <textarea
                            rows={10}
                            value={data.contenido}
                            onChange={(e) => setData('contenido', e.target.value)}
                            placeholder="Escribe el texto detallado de la noticia..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed font-normal"
                            required
                        />
                        {errors.contenido && <p className="text-red-600 mt-1">{errors.contenido}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                        <Link
                            href={route('admin.noticias.index')}
                            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow transition disabled:opacity-50"
                        >
                            {processing ? 'Publicando...' : 'Guardar y Continuar a Galería'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

