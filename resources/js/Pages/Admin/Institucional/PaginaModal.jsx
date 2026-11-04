import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Parsea el texto y el enlace de Google Maps en caso de ser la página de Ubicación.
 */
function parsearContenidoUbicacion(contenido = '') {
    const lineas = (contenido || '').split('\n');
    let urlMapa = '';
    const textoLineas = [];

    for (const linea of lineas) {
        const limpia = linea.trim();
        if (limpia.startsWith('[MAPA]:')) {
            urlMapa = limpia.replace('[MAPA]:', '').trim();
        } else if (limpia.startsWith('https://maps.') || limpia.startsWith('https://goo.gl/maps') || limpia.startsWith('https://maps.app.goo.gl')) {
            urlMapa = limpia;
        } else {
            textoLineas.push(linea);
        }
    }

    return {
        texto: textoLineas.join('\n').trim(),
        urlMapa,
    };
}

/**
 * Modal para Editar Apartados Institucionales (CU-02).
 */
export default function PaginaModal({ pagina, isOpen, onClose }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        titulo: '',
        contenido: '',
    });

    const [mapaUrl, setMapaUrl] = useState('');
    const [textoUbicacion, setTextoUbicacion] = useState('');

    const esUbicacion = pagina?.titulo?.toLowerCase().includes('ubicaci');

    useEffect(() => {
        if (pagina) {
            setData('titulo', pagina.titulo || '');
            if (pagina.titulo?.toLowerCase().includes('ubicaci')) {
                const parsed = parsearContenidoUbicacion(pagina.contenido);
                setTextoUbicacion(parsed.texto);
                setMapaUrl(parsed.urlMapa);
                setData('contenido', pagina.contenido || '');
            } else {
                setData('contenido', pagina.contenido || '');
                setTextoUbicacion('');
                setMapaUrl('');
            }
        }
    }, [pagina, isOpen]);

    if (!isOpen || !pagina) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        let payloadContenido = data.contenido;

        if (esUbicacion) {
            payloadContenido = mapaUrl.trim()
                ? `${textoUbicacion.trim()}\n[MAPA]: ${mapaUrl.trim()}`
                : textoUbicacion.trim();
        }

        put(route('admin.institucional.pagina.update', pagina.id_pagina), {
            data: {
                titulo: data.titulo,
                contenido: payloadContenido,
            },
            onSuccess: () => { onClose(); reset(); },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">
                            Editar Contenido: {pagina.titulo}
                        </h3>
                        <p className="text-[11px] text-slate-500">Se reflejará inmediatamente en el portal público</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-semibold text-slate-700 uppercase mb-1">Título del Apartado *</label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                            required
                        />
                        {errors.titulo && <p className="text-red-600 mt-1">{errors.titulo}</p>}
                    </div>

                    {esUbicacion ? (
                        <>
                            <div>
                                <label className="block font-semibold text-slate-700 uppercase mb-1">
                                    Dirección y Canales de Contacto *
                                </label>
                                <textarea
                                    rows={4}
                                    value={textoUbicacion}
                                    onChange={(e) => {
                                        setTextoUbicacion(e.target.value);
                                        const final = mapaUrl.trim() ? `${e.target.value.trim()}\n[MAPA]: ${mapaUrl.trim()}` : e.target.value;
                                        setData('contenido', final);
                                    }}
                                    placeholder="San Joaquín 2052, Santa Cruz de la Sierra..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed font-normal"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block font-semibold text-slate-700 uppercase">
                                        🗺️ Enlace directo de Google Maps (Opcional)
                                    </label>
                                    {mapaUrl && (
                                        <a href={mapaUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-emerald-600 hover:underline font-semibold">
                                            Probar Enlace ↗
                                        </a>
                                    )}
                                </div>
                                <input
                                    type="url"
                                    value={mapaUrl}
                                    onChange={(e) => {
                                        setMapaUrl(e.target.value);
                                        const final = e.target.value.trim() ? `${textoUbicacion.trim()}\n[MAPA]: ${e.target.value.trim()}` : textoUbicacion;
                                        setData('contenido', final);
                                    }}
                                    placeholder="https://maps.app.goo.gl/... o https://google.com/maps/..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-[11px]"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Si dejas este campo vacío, el sistema generará automáticamente la búsqueda en Google Maps según la dirección escrita arriba.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block font-semibold text-slate-700 uppercase mb-1">Contenido Oficial *</label>
                            <textarea
                                rows={6}
                                value={data.contenido}
                                onChange={(e) => setData('contenido', e.target.value)}
                                placeholder="Escriba aquí el contenido detallado del apartado..."
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed"
                                required
                            />
                            {errors.contenido && <p className="text-red-600 mt-1">{errors.contenido}</p>}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing} className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Actualizar Apartado'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

