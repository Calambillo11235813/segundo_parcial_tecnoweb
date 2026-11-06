import React from 'react';

/**
 * Subcomponente para listar la galería multimedia de una noticia (CU-03, RF-02).
 */
export default function GaleriaLista({ galerias, onAddClick, onDeleteClick }) {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                        <span>🖼️</span>
                        <span>Galería Multimedia Asociada ({galerias?.length || 0})</span>
                    </h3>
                    <p className="text-xs text-slate-500">Fotografías de campo y videos complementarios de la actividad.</p>
                </div>
                <button
                    type="button"
                    onClick={onAddClick}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition"
                >
                    <span>➕</span>
                    <span>Añadir a Galería</span>
                </button>
            </div>

            {galerias && galerias.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galerias.map((g) => (
                        <div key={g.id_multimedia} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col justify-between shadow-xs">
                            <div className="h-36 bg-slate-200 relative overflow-hidden flex items-center justify-center">
                                {g.tipo === 'Imagen' ? (
                                    <img src={g.url_archivo} alt={g.titulo} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-3">
                                        <span className="text-3xl">🎥</span>
                                        <p className="text-[11px] text-slate-600 font-mono truncate max-w-[200px] mt-1">{g.url_archivo}</p>
                                    </div>
                                )}
                                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white">
                                    {g.tipo}
                                </span>
                            </div>
                            <div className="p-3">
                                <p className="font-bold text-slate-800 text-xs truncate">{g.titulo}</p>
                                {g.descripcion && <p className="text-[11px] text-slate-500 truncate mt-0.5">{g.descripcion}</p>}
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                                    <span>{new Date(g.fecha_carga).toLocaleDateString()}</span>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteClick(g)}
                                        className="text-red-600 hover:text-red-800 font-semibold"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-8 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Esta noticia aún no cuenta con fotografías ni videos adicionales en su galería.
                </div>
            )}
        </div>
    );
}

