import React from 'react';
import { Link, usePage } from '@inertiajs/react';

/**
 * Plantilla Pública de Navegación (PublicLayout).
 * Cabecera institucional FEDER, navegación principal y pie de página corporativo.
 */
export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
            {/* Cabecera / Navbar Superior */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logotipo FEDER */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-11 h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-extrabold text-2xl shadow group-hover:bg-emerald-800 transition">
                            F
                        </div>
                        <div>
                            <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                                Fundación FEDER
                            </span>
                            <span className="text-[11px] text-emerald-700 font-semibold tracking-wider uppercase block">
                                Desarrollo Rural Chiquitano
                            </span>
                        </div>
                    </Link>

                    {/* Enlaces de Navegación Principal */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
                        <Link href="/nosotros" className={`hover:text-emerald-700 transition ${route().current('public.nosotros') ? 'text-emerald-700 font-bold' : ''}`}>
                            Quiénes Somos
                        </Link>
                        <Link href="/noticias" className={`hover:text-emerald-700 transition ${route().current('public.noticias.*') ? 'text-emerald-700 font-bold' : ''}`}>
                            Noticias y Medios
                        </Link>
                    </nav>

                    {/* Acciones y Acceso al Sistema */}
                    <div className="flex items-center space-x-3">
                        {user ? (
                            // Si el usuario ya está autenticado, acceso directo al panel
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <span className="block text-xs font-bold text-slate-800 leading-tight">
                                        {user.nombre_completo || user.nombre_usuario}
                                    </span>
                                    <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                                        {user.rol?.nombre_rol || 'Personal'}
                                    </span>
                                </div>
                                <Link
                                    href={route('admin.dashboard')}
                                    className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition"
                                >
                                    <span>Panel de Control</span>
                                    <span>➜</span>
                                </Link>
                            </div>
                        ) : (
                            // Si es visitante, botón destacado de Portal Interno / Iniciar Sesión
                            <Link
                                href={route('login')}
                                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
                            >
                                <span>🔒</span>
                                <span>Portal Interno</span>
                            </Link>
                        )}

                        {/* Botón de Acción Principal (Donaciones) */}
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow transition cursor-pointer">
                            ❤️ Donar
                        </span>
                    </div>
                </div>
            </header>

            {/* Contenido Dinámico de la Página */}
            <main className="flex-1">
                {children}
            </main>

            {/* Pie de Página Institucional (Footer) */}
            <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 text-white font-bold text-base mb-2">
                            <span className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-xs">F</span>
                            <span>Fundación FEDER</span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Impulsando la producción artesanal, microempresarial y el desarrollo socioeconómico sostenible de las comunidades rurales de la Chiquitanía.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-xs mb-3">
                            Sede y Contacto
                        </h4>
                        <p className="text-slate-400 leading-relaxed">
                            📍 Calle Arenales esq. Puerto Suárez<br />
                            Santa Cruz de la Sierra, Bolivia<br />
                            ✉️ contacto@feder.org.bo
                        </p>
                    </div>

                    <div>
                        <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-xs mb-3">
                            Portal Institucional
                        </h4>
                        <ul className="space-y-1.5">
                            <li><Link href="/nosotros" className="hover:text-white transition">Nuestra Misión y Visión</Link></li>
                            <li><Link href="/noticias" className="hover:text-white transition">Noticias y Publicaciones</Link></li>
                            <li><Link href={route('login')} className="hover:text-emerald-400 transition">Panel de Administración</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 text-center text-slate-500">
                    © {new Date().getFullYear()} Fundación FEDER - Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
}

