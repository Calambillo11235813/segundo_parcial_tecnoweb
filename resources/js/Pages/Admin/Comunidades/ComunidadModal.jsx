import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Modal de registro / edición de ficha comunitaria (CU-04, RF-05).
 */
export default function ComunidadModal({ comunidad, isOpen, onClose }) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        estado: 'Activa',
    });

    // Carga los datos de la comunidad al editar o limpia el formulario al crear
    useEffect(() => {
        clearErrors();
        if (comunidad) {
            setData({
                nombre: comunidad.nombre || '',
                descripcion: comunidad.descripcion || '',
                ubicacion: comunidad.ubicacion || '',
                estado: comunidad.estado || 'Activa',
            });
        } else {
            reset();
        }
    }, [comunidad, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const opciones = { onSuccess: () => { onClose(); reset(); } };
        if (comunidad) {
            put(route('admin.comunidades.update', comunidad.id_comunidad), opciones);
        } else {
            post(route('admin.comunidades.store'), opciones);
        }
    };

    const inputClass = 'w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-green-600 focus:border-green-600';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm">
                        🌾 {comunidad ? 'Editar Ficha Comunitaria' : 'Registrar Nueva Comunidad'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Nombre de la Comunidad *</label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="ej. San Rafael de Velasco"
                            className={`${inputClass} font-medium`}
                            required
                        />
                        {errors.nombre && <p className="text-red-600 text-xs mt-1">{errors.nombre}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Ubicación *</label>
                            <input
                                type="text"
                                value={data.ubicacion}
                                onChange={(e) => setData('ubicacion', e.target.value)}
                                placeholder="ej. Chiquitania, Santa Cruz"
                                className={inputClass}
                                required
                            />
                            {errors.ubicacion && <p className="text-red-600 text-xs mt-1">{errors.ubicacion}</p>}
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Estado</label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                className={inputClass}
                            >
                                <option value="Activa">Activa</option>
                                <option value="Inactiva">Inactiva</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Descripción de la Comunidad</label>
                        <textarea
                            rows={4}
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Características productivas, población, potencial artesanal..."
                            className={`${inputClass} leading-relaxed`}
                        />
                        {errors.descripcion && <p className="text-red-600 text-xs mt-1">{errors.descripcion}</p>}
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing} className="px-4 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Publicar Ficha'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

