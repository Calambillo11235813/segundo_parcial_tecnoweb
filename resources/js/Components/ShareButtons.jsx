import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import SocialIcon from '@/Components/SocialIcon';

/**
 * Componente reutilizable para compartir campañas, noticias y programas productivos
 * en WhatsApp, Facebook, Instagram y mediante enlace copiado.
 *
 * Variantes:
 * - "inline": barra directa de botones (ideal para vistas públicas de detalle)
 * - "button": botón compacto que abre un modal limpio (ideal para tablas admin y tarjetas)
 */
export default function ShareButtons({
    url,
    title,
    description = '',
    category = 'Contenido',
    variant = 'inline',
    buttonClassName = '',
    buttonLabel = 'Compartir',
    heading = 'Compartir',
}) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const resolveFullUrl = () => {
        if (!url) {
            return typeof window !== 'undefined' ? window.location.href : '';
        }
        if (/^https?:\/\//i.test(url)) {
            return url;
        }
        if (typeof window !== 'undefined') {
            return new URL(url, window.location.origin).toString();
        }
        return url;
    };

    const fullUrl = resolveFullUrl();
    const textoCompartir = description
        ? `${title} — ${description}`
        : `${title} | Fundación FEDER`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${textoCompartir}\n${fullUrl}`)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(textoCompartir)}`;

    const copiarTexto = async (texto, mensajeOk) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(texto);
            } else {
                const area = document.createElement('textarea');
                area.value = texto;
                area.style.position = 'fixed';
                area.style.opacity = '0';
                document.body.appendChild(area);
                area.select();
                document.execCommand('copy');
                document.body.removeChild(area);
            }
            setFeedback(mensajeOk);
            setTimeout(() => setFeedback(null), 3500);
        } catch {
            setFeedback('No se pudo copiar automáticamente. Copia el enlace manualmente.');
            setTimeout(() => setFeedback(null), 3500);
        }
    };

    const handleInstagram = async () => {
        await copiarTexto(
            `${textoCompartir}\n${fullUrl}`,
            '¡Texto y enlace copiados! Pégalos en tu historia o publicación de Instagram.'
        );
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    };

    const handleCopiarEnlace = () => {
        copiarTexto(fullUrl, '¡Enlace copiado al portapapeles!');
    };

    const iconoCompartir = (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
        </svg>
    );

    if (variant === 'inline') {
        return (
            <div className="space-y-2.5">
                {heading && (
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        {iconoCompartir}
                        <span>{heading}</span>
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition"
                        title="Compartir por WhatsApp"
                    >
                        <SocialIcon platform="whatsapp" className="w-4 h-4" />
                        <span>WhatsApp</span>
                    </a>

                    <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 text-xs font-bold transition"
                        title="Compartir en Facebook"
                    >
                        <SocialIcon platform="facebook" className="w-4 h-4" />
                        <span>Facebook</span>
                    </a>

                    <button
                        type="button"
                        onClick={handleInstagram}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 text-pink-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:text-white border border-pink-200 text-xs font-bold transition"
                        title="Copiar enlace y abrir Instagram"
                    >
                        <SocialIcon platform="instagram" className="w-4 h-4" />
                        <span>Instagram</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleCopiarEnlace}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white border border-slate-200 text-xs font-bold transition"
                        title="Copiar enlace directo"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copiar</span>
                    </button>
                </div>

                {feedback && (
                    <div className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                        ✅ {feedback}
                    </div>
                )}
            </div>
        );
    }

    const modal = modalAbierto && typeof document !== 'undefined'
        ? createPortal(
            <div
                onClick={() => setModalAbierto(false)}
                className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
                >
                    <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                Compartir {category}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-2">{title}</h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModalAbierto(false)}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-3 gap-2.5">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition"
                            >
                                <SocialIcon platform="whatsapp" className="w-6 h-6" />
                                <span className="text-xs font-bold">WhatsApp</span>
                            </a>

                            <a
                                href={facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition"
                            >
                                <SocialIcon platform="facebook" className="w-6 h-6" />
                                <span className="text-xs font-bold">Facebook</span>
                            </a>

                            <button
                                type="button"
                                onClick={handleInstagram}
                                className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:text-white border border-pink-200 transition"
                            >
                                <SocialIcon platform="instagram" className="w-6 h-6" />
                                <span className="text-xs font-bold">Instagram</span>
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold text-slate-500">Enlace directo</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={fullUrl}
                                    onFocus={(e) => e.target.select()}
                                    className="flex-1 text-xs rounded-xl border-slate-200 bg-slate-50 text-slate-600 px-3 py-2 font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={handleCopiarEnlace}
                                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition whitespace-nowrap"
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>

                        {feedback && (
                            <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                                ✅ {feedback}
                            </div>
                        )}
                    </div>
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <>
            <button
                type="button"
                onClick={() => setModalAbierto(true)}
                className={
                    buttonClassName ||
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition'
                }
                title={`Compartir ${category.toLowerCase()}`}
            >
                {iconoCompartir}
                <span>{buttonLabel}</span>
            </button>
            {modal}
        </>
    );
}
