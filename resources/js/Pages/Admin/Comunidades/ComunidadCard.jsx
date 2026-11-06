import React from 'react';
import StatusBadge from '@/Components/StatusBadge';

/**
 * Tarjeta administrativa de una comunidad con su lista de programas (CU-04).
 * Emite eventos hacia la página padre para editar/eliminar comunidad o programas.
 */
export default function ComunidadCard({ comunidad, onEditar, onEliminar, onNuevoPrograma, onEditarPrograma, onEliminarPrograma }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Cabecera de la ficha comunitaria */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-base">{comunidad.nombre}</h3>
                        <StatusBadge status={comunidad.estado} />
                    </div>
                    <p className="text-[11px] text-green-700 font-semibold mt-0.5">📍 {comunidad.ubicacion}</p>
                    {comunidad.descripcion && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">{comunidad.descripcion}</p>
                    )}
                    <div className="flex gap-3 mt-2 text-[11px] text-slate-500">
                        <span>🛠️ {comunidad.programas_count} programas</span>
                        <span>💬 {comunidad.testimonios_count} testimonios</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-[11px]">
                    <button onClick={onNuevoPrograma} className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-800 hover:bg-green-100 font-semibold transition">
                        ➕ Programa
                    </button>
                    <button onClick={onEditar} className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition">
                        Editar
                    </button>
                    <button onClick={onEliminar} className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition">
                        Eliminar
                    </button>
                </div>
            </div>

            {/* Programas productivos de la comunidad */}
            {comunidad.programas.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                    {comunidad.programas.map((p) => (
                        <li key={p.id_programa} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-slate-800 text-xs">{p.nombre}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                                        {p.area_productiva}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate max-w-xl">{p.descripcion}</p>
                                {p.poblacion_beneficiaria && (
                                    <p className="text-[10px] text-slate-400">👥 {p.poblacion_beneficiaria}</p>
                                )}
                            </div>
                            <div className="flex gap-2 text-[11px] flex-shrink-0">
                                <button onClick={() => onEditarPrograma(p)} className="text-blue-700 hover:underline font-semibold">Editar</button>
                                <button onClick={() => onEliminarPrograma(p)} className="text-red-600 hover:underline font-semibold">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="px-5 py-4 text-[11px] text-slate-400 italic">
                    Aún no hay programas productivos registrados en esta comunidad.
                </p>
            )}
        </div>
    );
}

