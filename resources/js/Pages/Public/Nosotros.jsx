import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import SocialIcon from '@/Components/SocialIcon';

/**
 * Estilos y colores oficiales según la red social.
 */
function getBrandStyle(plataforma = '') {
    const p = plataforma.toLowerCase();
    if (p.includes('facebook')) return 'bg-[#1877F2] hover:bg-[#1464cc] text-white';
    if (p.includes('youtube') || p.includes('you tube')) return 'bg-[#FF0000] hover:bg-[#cc0000] text-white';
    if (p.includes('whatsapp') || p.includes('whasapt')) return 'bg-[#25D366] hover:bg-[#1fa952] text-white';
    if (p.includes('instagram') || p.includes('instagran')) return 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-95 text-white';
    if (p.includes('tiktok') || p.includes('twitter') || p === 'x') return 'bg-slate-900 hover:bg-black text-white';
    return 'bg-emerald-700 hover:bg-emerald-800 text-white';
}

/**
 * Vista Pública de Contenidos Institucionales (Quiénes Somos - CU-02).
 */
export default function Nosotros({ paginas, redes }) {
    const mision = paginas?.['Mision']?.contenido || 'Comprometidos con el desarrollo rural integral.';
    const vision = paginas?.['Vision']?.contenido || 'Liderar el crecimiento productivo de las comunidades.';
    const objetivos = paginas?.['Objetivos']?.contenido || 'Fortalecer la capacidad técnica y artesanal de la Chiquitanía.';
    const resena = paginas?.['Reseña Histórica']?.contenido || 'Fundación dedicada a la pequeña industria y artesanía rural.';
    const contactoBruto = paginas?.['Ubicación y Contacto']?.contenido || 'San Joaquin 2052, Santa Cruz de la Sierra, Bolivia.';

    // Parsea la dirección y extrae el enlace configurado por el Director
    let enlaceDirectoMapa = '';
    const lineasLimpias = (contactoBruto || '').split('\n').filter(l => {
        if (l.trim().startsWith('[MAPA]:')) {
            enlaceDirectoMapa = l.replace('[MAPA]:', '').trim();
            return false;
        }
        return true;
    });
    const contacto = lineasLimpias.join('\n').trim();
    const direccionLimpia = contacto.split('.')[0] || 'San Joaquin 2052, Santa Cruz de la Sierra';
    const googleMapsSearchUrl = enlaceDirectoMapa || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionLimpia + ', Bolivia')}`;
    const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(direccionLimpia + ', Bolivia')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <PublicLayout>
            <Head title="Quiénes Somos - Fundación FEDER" />

            {/* Cabecera Hero */}
            <section className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white py-14 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <span className="text-xs uppercase tracking-widest bg-emerald-700/80 px-3 py-1 rounded-full font-bold">
                        Identidad Institucional
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">Fundación FEDER</h1>
                    <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto leading-relaxed">
                        Fundación Empresarial para el Desarrollo Rural de la Pequeña Industria y Artesanía en la Chiquitanía boliviana.
                    </p>
                </div>
            </section>

            {/* Contenido Principal */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
                {/* Reseña Histórica */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">📜</span>
                        <h2 className="text-xl font-bold text-slate-800">Reseña Histórica</h2>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{resena}</p>
                </div>

                {/* Misión, Visión y Objetivos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-emerald-600">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">🎯</span>
                            <h3 className="text-lg font-bold text-slate-800">Misión</h3>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{mision}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-blue-600">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">🔭</span>
                            <h3 className="text-lg font-bold text-slate-800">Visión</h3>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{vision}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-orange-600">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">📌</span>
                            <h3 className="text-lg font-bold text-slate-800">Objetivos</h3>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{objetivos}</p>
                    </div>
                </div>

                {/* Ubicación Física y Google Maps interactivo */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">📍</span>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Sede y Ubicación Oficial</h2>
                            <p className="text-xs text-slate-500">Visítanos en nuestras oficinas centrales o contáctanos directamente.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {/* Columna Izquierda: Información de Contacto */}
                        <div className="flex flex-col justify-between bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <div>
                                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">
                                    Dirección y Canales
                                </span>
                                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium mb-6">
                                    {contacto}
                                </p>
                            </div>
                            <a
                                href={googleMapsSearchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow transition"
                            >
                                <span>🗺️</span>
                                <span>Abrir en Google Maps</span>
                                <span>↗</span>
                            </a>
                        </div>

                        {/* Columna Derecha: Mapa con enlace superpuesto */}
                        <div className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm min-h-[220px]">
                            <iframe
                                title="Mapa Sede Fundación FEDER"
                                src={googleMapsEmbedUrl}
                                className="w-full h-full min-h-[220px] border-0"
                                loading="lazy"
                            />
                            <a
                                href={googleMapsSearchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 bg-slate-900/10 hover:bg-slate-900/20 transition flex items-end justify-center p-3"
                                title="Clic para abrir ubicación completa en Google Maps"
                            >
                                <span className="bg-white/95 hover:bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border border-slate-200 flex items-center space-x-1.5 transform group-hover:scale-105 transition">
                                    <span>📍</span>
                                    <span>Ver mapa completo en Google Maps ↗</span>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Redes Sociales Oficiales con Logotipos de Marca */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                                <span>📱</span>
                                <span>Canales y Redes Sociales Oficiales</span>
                            </h3>
                            <p className="text-xs text-slate-500">
                                Síguenos en nuestras plataformas oficiales para estar al día de las actividades y proyectos.
                            </p>
                        </div>
                    </div>

                    {redes && redes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {redes.map((r) => (
                                <a
                                    key={r.id_red_social}
                                    href={r.url_enlace}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-between p-3.5 rounded-xl font-medium shadow transition transform hover:-translate-y-0.5 ${getBrandStyle(r.plataforma)}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <SocialIcon platform={r.plataforma} className="w-6 h-6 flex-shrink-0" />
                                        <span className="font-bold text-xs sm:text-sm tracking-wide">{r.plataforma}</span>
                                    </div>
                                    <span className="text-xs opacity-75 font-bold">↗</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-xs italic">
                            No se registran redes sociales oficiales activas en este momento.
                        </p>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}

