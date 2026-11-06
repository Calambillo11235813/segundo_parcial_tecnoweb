import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

/**
 * Función auxiliar para formatear enlaces de YouTube a formato embed.
 */
function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

/**
 * Detalle Público de Noticia y Galería Multimedia (CU-03).
 */
export default function Show({ noticia, relacionadas }) {
    const [fotoModal, setFotoModal] = useState(null);

    return (
        <PublicLayout>
            <Head title={`${noticia.titulo} - Fundación FEDER`} />

            {/* Migas de Pan (Breadcrumbs) */}
            <div className="bg-slate-100 border-b border-slate-200 py-3">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-xs text-slate-500 flex items-center space-x-2">
                    <Link href="/" className="hover:text-emerald-700">Inicio</Link>
                    <span>/</span>
                    <Link href={route('public.noticias.index')} className="hover:text-emerald-700">Noticias</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold truncate max-w-md">{noticia.titulo}</span>
                </div>
            </div>

            <article className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
                {/* Encabezado del Artículo */}
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Comunicado Oficial
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">
                            📅 {noticia.fecha_publicacion ? new Date(noticia.fecha_publicacion).toLocaleDateString() : 'Reciente'}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">
                            ✍️ {noticia.usuario?.nombre_completo || 'Equipo Técnico FEDER'}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                        {noticia.titulo}
                    </h1>

                    {noticia.etiquetas && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {noticia.etiquetas.split(',').map((tag, i) => (
                                <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium">
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Fotografía de Portada Principal */}
                <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 max-h-[460px] bg-slate-100">
                    <img
                        src={noticia.imagen_principal}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000'; }}
                    />
                </div>

                {/* Contenido Completo del Artículo */}
                <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line py-4 border-b border-slate-200">
                    {noticia.contenido}
                </div>

                {/* Galería Multimedia Complementaria */}
                {noticia.galerias && noticia.galerias.length > 0 && (
                    <div className="space-y-5 pt-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">📸</span>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Galería Fotográfica y Audiovisual</h2>
                                <p className="text-xs text-slate-500">Imágenes y grabaciones capturadas en el trabajo de campo.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {noticia.galerias.map((g) => (
                                <div key={g.id_multimedia} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                                    {g.tipo === 'Imagen' ? (
                                        <div
                                            onClick={() => setFotoModal(g)}
                                            className="h-48 overflow-hidden cursor-pointer group relative"
                                        >
                                            <img
                                                src={g.url_archivo}
                                                alt={g.titulo}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                            <span className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                                                🔍 Ampliar Foto
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-black">
                                            {getYouTubeEmbedUrl(g.url_archivo) ? (
                                                <iframe
                                                    src={getYouTubeEmbedUrl(g.url_archivo)}
                                                    title={g.titulo}
                                                    className="w-full h-full border-0"
                                                    allowFullScreen
                                                />
                                            ) : (
                                                <a
                                                    href={g.url_archivo}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full h-full flex flex-col items-center justify-center text-white hover:text-red-400 p-4 text-center"
                                                >
                                                    <span className="text-3xl mb-1">▶️</span>
                                                    <span className="text-xs font-bold underline">Reproducir Video Externo</span>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    <div className="p-3">
                                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{g.titulo}</h4>
                                        {g.descripcion && (
                                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{g.descripcion}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Publicaciones Relacionadas */}
                {relacionadas && relacionadas.length > 0 && (
                    <div className="pt-8 border-t border-slate-200 space-y-4">
                        <h3 className="font-bold text-lg text-slate-900">Otras Noticias de Interés</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {relacionadas.map((r) => (
                                <Link
                                    key={r.id_noticia}
                                    href={route('public.noticias.show', r.id_noticia)}
                                    className="p-3 bg-white border border-slate-200 rounded-xl hover:shadow-md transition flex flex-col justify-between group"
                                >
                                    <img
                                        src={r.imagen_principal}
                                        alt={r.titulo}
                                        className="h-28 w-full object-cover rounded-lg mb-2"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300'; }}
                                    />
                                    <h4 className="font-bold text-xs text-slate-800 line-clamp-2 group-hover:text-emerald-700 transition">
                                        {r.titulo}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 mt-2 block">
                                        {r.fecha_publicacion ? new Date(r.fecha_publicacion).toLocaleDateString() : ''}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            {/* Modal para Ver Foto Ampliada */}
            {fotoModal && (
                <div
                    onClick={() => setFotoModal(null)}
                    className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center cursor-pointer"
                >
                    <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
                        <img
                            src={fotoModal.url_archivo}
                            alt={fotoModal.titulo}
                            className="max-h-[80vh] w-auto rounded-lg shadow-2xl object-contain"
                        />
                        <p className="text-white text-xs sm:text-sm font-semibold mt-3 text-center">{fotoModal.titulo}</p>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

