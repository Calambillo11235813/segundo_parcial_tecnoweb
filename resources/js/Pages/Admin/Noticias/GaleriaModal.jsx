import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Modal para Carga de Recursos Multimedia a una Noticia (CU-03, RF-02).
 */
export default function GaleriaModal({ noticiaId, isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '',
        tipo: 'Imagen',
        archivo: null,
        url_archivo: '',
        descripcion: '',
    });

    const [modo, setModo] = useState('archivo'); // 'archivo' | 'url'

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.noticias.galeria.store', noticiaId), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                        <span>🖼️</span>
                        <span>Añadir Elemento Multimedia</span>
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Título / Pie de Foto *</label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            placeholder="ej. Taller práctico con artesanas de Roboré"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                            required
                        />
                        {errors.titulo && <p className="text-red-600 mt-1">{errors.titulo}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Tipo de Recurso</label>
                            <select
                                value={data.tipo}
                                onChange={(e) => {
                                    setData('tipo', e.target.value);
                                    if (e.target.value === 'Video') setModo('url');
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="Imagen">Fotografía (Imagen)</option>
                                <option value="Video">Video (YouTube / Enlace)</option>
                            </select>
                        </div>

                        {data.tipo === 'Imagen' && (
                            <div>
                                <label className="block font-semibold text-slate-700 uppercase mb-1">Modo de Carga</label>
                                <div className="flex rounded-lg border border-slate-300 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setModo('archivo')}
                                        className={`flex-1 py-1.5 font-semibold text-[11px] ${modo === 'archivo' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700'}`}
                                    >
                                        Archivo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModo('url')}
                                        className={`flex-1 py-1.5 font-semibold text-[11px] ${modo === 'url' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700'}`}
                                    >
                                        URL
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {data.tipo === 'Imagen' && modo === 'archivo' ? (
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Seleccionar Fotografía *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('archivo', e.target.files[0])}
                                className="w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                required
                            />
                            {errors.archivo && <p className="text-red-600 mt-1">{errors.archivo}</p>}
                        </div>
                    ) : (
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">
                                {data.tipo === 'Video' ? 'Enlace del Video (YouTube o MP4) *' : 'URL de la Imagen *'}
                            </label>
                            <input
                                type="url"
                                value={data.url_archivo}
                                onChange={(e) => setData('url_archivo', e.target.value)}
                                placeholder={data.tipo === 'Video' ? 'https://www.youtube.com/watch?v=...' : 'https://images.unsplash.com/...'}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px]"
                                required
                            />
                            {errors.url_archivo && <p className="text-red-600 mt-1">{errors.url_archivo}</p>}
                        </div>
                    )}

                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Descripción Breve (Opcional)</label>
                        <input
                            type="text"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Breve nota contextual para el pie de recurso..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing} className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50">
                            {processing ? 'Subiendo...' : 'Agregar a Galería'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

