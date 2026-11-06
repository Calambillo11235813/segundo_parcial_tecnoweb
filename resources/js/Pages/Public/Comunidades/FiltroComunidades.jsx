import React, { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

/**
 * Motor de búsqueda interactiva del catálogo público (CU-04, RF-07).
 * Filtra por texto (con retardo de escritura), rubro productivo y ubicación.
 */
export default function FiltroComunidades({ filtros, rubros = [], ubicaciones = [] }) {
    const [valores, setValores] = useState({
        buscar: filtros?.buscar || '',
        rubro: filtros?.rubro || '',
        ubicacion: filtros?.ubicacion || '',
    });
    const primerRender = useRef(true);

    // Consulta al servidor 400 ms después del último cambio (debounce)
    useEffect(() => {
        if (primerRender.current) {
            primerRender.current = false;
            return;
        }
        const temporizador = setTimeout(() => {
            const parametros = Object.fromEntries(Object.entries(valores).filter(([, v]) => v));
            router.get(route('public.comunidades.index'), parametros, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 400);
        return () => clearTimeout(temporizador);
    }, [valores]);

    const actualizar = (campo, valor) => setValores((prev) => ({ ...prev, [campo]: valor }));
    const hayFiltros = valores.buscar || valores.rubro || valores.ubicacion;

    return (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                    <input
                        type="text"
                        value={valores.buscar}
                        onChange={(e) => actualizar('buscar', e.target.value)}
                        placeholder="Buscar comunidad, programa o actividad (ej. totaí, jabón)..."
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-green-600 focus:border-green-600"
                    />
                </div>
                <select
                    value={valores.rubro}
                    onChange={(e) => actualizar('rubro', e.target.value)}
                    className="px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-green-600 focus:border-green-600"
                >
                    <option value="">Todos los rubros</option>
                    {rubros.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <select
                    value={valores.ubicacion}
                    onChange={(e) => actualizar('ubicacion', e.target.value)}
                    className="px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-green-600 focus:border-green-600"
                >
                    <option value="">Todas las ubicaciones</option>
                    {ubicaciones.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>

            {/* Chips de rubros para filtrado rápido */}
            <div className="flex flex-wrap items-center gap-2">
                {rubros.map((r) => (
                    <button
                        key={r}
                        type="button"
                        onClick={() => actualizar('rubro', valores.rubro === r ? '' : r)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${valores.rubro === r
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'}`}
                    >
                        {r}
                    </button>
                ))}
                {hayFiltros && (
                    <button
                        type="button"
                        onClick={() => setValores({ buscar: '', rubro: '', ubicacion: '' })}
                        className="ml-auto text-xs text-slate-500 hover:text-red-600 font-semibold"
                    >
                        ✕ Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    );
}

