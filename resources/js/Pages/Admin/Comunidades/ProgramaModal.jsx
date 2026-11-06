import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Modal de registro / edición de Programa Productivo (CU-04, RF-06).
 * Si recibe "programa" edita; si no, crea dentro de "comunidad".
 */
export default function ProgramaModal({ programa, comunidad, areas = [], isOpen, onClose }) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        descripcion: '',
        area_productiva: areas[0] || '',
        poblacion_beneficiaria: '',
    });

    // Sincroniza el formulario con el programa seleccionado
    useEffect(() => {
        clearErrors();
        if (programa) {
            setData({
                nombre: programa.nombre || '',
                descripcion: programa.descripcion || '',
                area_productiva: programa.area_productiva || '',
                poblacion_beneficiaria: programa.poblacion_beneficiaria || '',
            });
        } else {
            setData({ nombre: '', descripcion: '', area_productiva: areas[0] || '', poblacion_beneficiaria: '' });
        }
    }, [programa, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const opciones = { preserveScroll: true, onSuccess: () => { onClose(); reset(); } };
        if (programa) {
            put(route('admin.programas.update', programa.id_programa), opciones);
        } else {
            post(route('admin.programas.store', comunidad.id_comunidad), opciones);
        }
    };

    const inputClass = 'w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-green-600 focus:border-green-600';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">
                            🛠️ {programa ? 'Editar Programa Productivo' : 'Nuevo Programa de Asistencia'}
                        </h3>
                        {comunidad && <p className="text-[11px] text-slate-500">Comunidad: {comunidad.nombre}</p>}
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Nombre del Programa *</label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="ej. Taller de Jabonería con Manteca de Pesoé"
                            className={`${inputClass} font-medium`}
                            required
                        />
                        {errors.nombre && <p className="text-red-600 text-xs mt-1">{errors.nombre}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Rubro / Área Productiva *</label>
                            <input
                                list="areas-productivas"
                                value={data.area_productiva}
                                onChange={(e) => setData('area_productiva', e.target.value)}
                                placeholder="Seleccione o escriba un rubro"
                                className={inputClass}
                                required
                            />
                            <datalist id="areas-productivas">
                                {areas.map((a) => <option key={a} value={a} />)}
                            </datalist>
                            {errors.area_productiva && <p className="text-red-600 text-xs mt-1">{errors.area_productiva}</p>}
                        </div>
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Población Beneficiaria</label>
                            <input
                                type="text"
                                value={data.poblacion_beneficiaria}
                                onChange={(e) => setData('poblacion_beneficiaria', e.target.value)}
                                placeholder="ej. 30 mujeres artesanas"
                                className={inputClass}
                            />
                            {errors.poblacion_beneficiaria && <p className="text-red-600 text-xs mt-1">{errors.poblacion_beneficiaria}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Descripción y Objetivos *</label>
                        <textarea
                            rows={4}
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Actividades de capacitación, equipamiento entregado, resultados esperados..."
                            className={`${inputClass} leading-relaxed`}
                            required
                        />
                        {errors.descripcion && <p className="text-red-600 text-xs mt-1">{errors.descripcion}</p>}
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing} className="px-4 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Publicar Programa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

