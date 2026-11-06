import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Modal para Registrar / Editar Testimonio de Artesano o Beneficiario (CU-03, RF-08).
 */
export default function TestimonioModal({ testimonio, comunidades, isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'POST',
        titulo: '',
        texto: '',
        comunidad_id: '',
        fotografia: '',
        fotografia_archivo: null,
        enlace_audiovisual: '',
        estado: 'Publicado',
    });

    const [previewFoto, setPreviewFoto] = useState('');

    useEffect(() => {
        if (testimonio) {
            setData({
                _method: 'PUT',
                titulo: testimonio.titulo || '',
                texto: testimonio.texto || '',
                comunidad_id: testimonio.comunidad_id || '',
                fotografia: testimonio.fotografia || '',
                fotografia_archivo: null,
                enlace_audiovisual: testimonio.enlace_audiovisual || '',
                estado: testimonio.estado || 'Publicado',
            });
            setPreviewFoto(testimonio.fotografia || '');
        } else {
            reset();
            setData({
                _method: 'POST',
                titulo: '',
                texto: '',
                comunidad_id: comunidades?.[0]?.id_comunidad || '',
                fotografia: '',
                fotografia_archivo: null,
                enlace_audiovisual: '',
                estado: 'Publicado',
            });
            setPreviewFoto('');
        }
    }, [testimonio, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('fotografia_archivo', file);
            setPreviewFoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (testimonio) {
            post(route('admin.testimonios.update', testimonio.id_testimonio), {
                forceFormData: true,
                onSuccess: () => { onClose(); reset(); },
            });
        } else {
            post(route('admin.testimonios.store'), {
                forceFormData: true,
                onSuccess: () => { onClose(); reset(); },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                        <span>💬</span>
                        <span>{testimonio ? 'Modificar Testimonio' : 'Nuevo Testimonio Comunitario'}</span>
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Título o Protagonista *</label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            placeholder="ej. Doña Rosa - Asociación de Hilanderas de San José"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                            required
                        />
                        {errors.titulo && <p className="text-red-600 mt-1">{errors.titulo}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Comunidad Beneficiaria *</label>
                            <select
                                value={data.comunidad_id}
                                onChange={(e) => setData('comunidad_id', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            >
                                <option value="">Seleccionar Comunidad...</option>
                                {comunidades?.map((c) => (
                                    <option key={c.id_comunidad} value={c.id_comunidad}>
                                        {c.nombre} ({c.ubicacion})
                                    </option>
                                ))}
                            </select>
                            {errors.comunidad_id && <p className="text-red-600 mt-1">{errors.comunidad_id}</p>}
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Estado</label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="Publicado">Publicado</option>
                                <option value="Borrador">Borrador</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Relato / Experiencia *</label>
                        <textarea
                            rows={4}
                            value={data.texto}
                            onChange={(e) => setData('texto', e.target.value)}
                            placeholder="Describe cómo el programa o taller de FEDER impactó en su producción artesanal..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed font-normal"
                            required
                        />
                        {errors.texto && <p className="text-red-600 mt-1">{errors.texto}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Fotografía del Artesano</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:bg-emerald-50 file:text-emerald-700 cursor-pointer"
                            />
                            {previewFoto && (
                                <img src={previewFoto} alt="Preview" className="w-10 h-10 object-cover rounded-full mt-2 border border-slate-200" />
                            )}
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Enlace de Video (Opcional)</label>
                            <input
                                type="url"
                                value={data.enlace_audiovisual}
                                onChange={(e) => setData('enlace_audiovisual', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing} className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Guardar Testimonio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

