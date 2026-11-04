import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import SocialIcon from '@/Components/SocialIcon';

/**
 * Plataformas predefinidas con sugerencia de prefijo URL.
 */
const PLATAFORMAS_COMUNES = [
    { nombre: 'Facebook', placeholder: 'https://facebook.com/tu-pagina' },
    { nombre: 'YouTube', placeholder: 'https://youtube.com/@tu-canal' },
    { nombre: 'WhatsApp', placeholder: 'https://wa.me/591XXXXXXXX' },
    { nombre: 'Instagram', placeholder: 'https://instagram.com/tu-perfil' },
    { nombre: 'TikTok', placeholder: 'https://tiktok.com/@tu-usuario' },
    { nombre: 'X (Twitter)', placeholder: 'https://x.com/tu-cuenta' },
    { nombre: 'Otro', placeholder: 'https://...' },
];

/**
 * Modal para Crear / Editar Red Social Oficial (CU-02).
 */
export default function RedSocialModal({ red, isOpen, onClose }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        plataforma: 'Facebook',
        url_enlace: '',
        estado: 'Activo',
    });

    const [esOtro, setEsOtro] = useState(false);

    useEffect(() => {
        if (red) {
            const coincide = PLATAFORMAS_COMUNES.some(p => p.nombre.toLowerCase() === red.plataforma.toLowerCase());
            setEsOtro(!coincide);
            setData({
                plataforma: red.plataforma || 'Facebook',
                url_enlace: red.url_enlace || '',
                estado: red.estado || 'Activo',
            });
        } else {
            reset();
            setEsOtro(false);
            setData({
                plataforma: 'Facebook',
                url_enlace: '',
                estado: 'Activo',
            });
        }
    }, [red, isOpen]);

    if (!isOpen) return null;

    const handlePlataformaSelect = (e) => {
        const seleccion = e.target.value;
        if (seleccion === 'Otro') {
            setEsOtro(true);
            setData('plataforma', '');
        } else {
            setEsOtro(false);
            setData('plataforma', seleccion);
            const encontrada = PLATAFORMAS_COMUNES.find(p => p.nombre === seleccion);
            if (!data.url_enlace && encontrada) {
                setData(prev => ({ ...prev, plataforma: seleccion, url_enlace: encontrada.placeholder }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (red) {
            put(route('admin.institucional.redes.update', red.id_red_social), {
                onSuccess: () => { onClose(); reset(); },
            });
        } else {
            post(route('admin.institucional.redes.store'), {
                onSuccess: () => { onClose(); reset(); },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <SocialIcon platform={data.plataforma || 'red'} className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">
                            {red ? 'Modificar Red Social' : 'Añadir Enlace a Red Social'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">
                            Seleccionar Plataforma *
                        </label>
                        <select
                            value={esOtro ? 'Otro' : data.plataforma}
                            onChange={handlePlataformaSelect}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                        >
                            {PLATAFORMAS_COMUNES.map((p) => (
                                <option key={p.nombre} value={p.nombre}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {esOtro && (
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">
                                Nombre de Plataforma Personalizada *
                            </label>
                            <input
                                type="text"
                                placeholder="ej. Telegram, Pinterest, Spotify"
                                value={data.plataforma}
                                onChange={(e) => setData('plataforma', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>
                    )}
                    {errors.plataforma && <p className="text-red-600 mt-1">{errors.plataforma}</p>}

                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">
                            Enlace / URL Oficial *
                        </label>
                        <input
                            type="url"
                            placeholder="https://facebook.com/federbolivia"
                            value={data.url_enlace}
                            onChange={(e) => setData('url_enlace', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                            required
                        />
                        {errors.url_enlace && <p className="text-red-600 mt-1">{errors.url_enlace}</p>}
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Estado</label>
                        <select
                            value={data.estado}
                            onChange={(e) => setData('estado', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="Activo">Activo (Visible en portal público)</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing} className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

