import React from 'react';

/**
 * Extrae el enlace embebido (embed) de cualquier URL de YouTube (watch, youtu.be, shorts, embed).
 */
export function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/;
    const match = url.trim().match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/**
 * Sección para configurar el video corto de YouTube (máx. 3 min) de la comunidad
 * y la breve descripción del destino del dinero para incentivar la donación.
 */
export default function SeccionVideoDestino({ data, setData, errors }) {
    const embedUrl = getYouTubeEmbedUrl(data.video_youtube);

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>🎥</span>
                    <span>Video de la Comunidad y Destino de los Fondos</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                    Agrega un video corto de YouTube (máx. 3 min) donde la comunidad explique su situación y detalla brevemente en qué se invertirá el dinero.
                </p>
            </div>

            <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Enlace de Video de YouTube (Máx. 3 min - Opcional)
                </label>
                <input
                    type="url"
                    value={data.video_youtube}
                    onChange={(e) => setData('video_youtube', e.target.value)}
                    placeholder="Ej: https://www.youtube.com/watch?v=... o https://youtu.be/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-[11px]"
                />
                {errors.video_youtube && <p className="text-red-600 mt-1">{errors.video_youtube}</p>}

                {embedUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video max-w-md shadow-xs">
                        <iframe
                            src={embedUrl}
                            title="Vista previa del video de la campaña"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
            </div>

            <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                    ¿En qué se invertirá el dinero? * (Breve descripción para motivar al donante)
                </label>
                <textarea
                    rows={4}
                    value={data.destino_fondos}
                    onChange={(e) => setData('destino_fondos', e.target.value)}
                    placeholder="Ej: El 100% de lo recaudado se destinará a la compra de una prensa hidráulica de acero inoxidable, insumos iniciales y capacitación técnica para 30 familias productoras..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed font-normal"
                />
                {errors.destino_fondos && <p className="text-red-600 mt-1">{errors.destino_fondos}</p>}
            </div>
        </div>
    );
}
