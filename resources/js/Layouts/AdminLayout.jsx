import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

/**
 * Plantilla de Diseño Administrativo (AdminLayout - CU-01).
 * Estructura de barra lateral responsiva, barra superior y gestión de sesión con roles.
 */
export default function AdminLayout({ title, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Cierra la sesión activa del usuario
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const roleName = user?.rol?.nombre_rol || 'Usuario';

    // Obtiene el color de la insignia según el rol asignado
    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'director': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
            case 'secretaria': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'instructor': return 'bg-amber-100 text-amber-800 border-amber-300';
            default: return 'bg-slate-100 text-slate-800 border-slate-300';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Barra lateral de navegación (Sidebar) */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow">F</span>
                            <span className="font-bold text-lg tracking-wide text-white">Portal FEDER</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Desarrollo Rural Chiquitano</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">✕</button>
                </div>

                {/* Perfil del usuario autenticado */}
                <div className="p-4 bg-slate-800/60 border-b border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Sesión Activa</p>
                    <p className="text-sm font-medium text-slate-100 truncate mt-0.5">{user?.nombre_completo}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getRoleBadgeColor(roleName)}`}>
                            {roleName}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-medium">● En línea</span>
                    </div>
                </div>

                {/* Menú de navegación jerárquico */}
                <nav className="p-4 space-y-1.5 flex-1">
                    <Link
                        href={route('admin.dashboard')}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${route().current('admin.dashboard') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className="mr-3">📊</span> Dashboard
                    </Link>

                    {/* Módulos exclusivos para el rol Director */}
                    {roleName.toLowerCase() === 'director' && (
                        <>
                            <Link
                                href={route('admin.usuarios.index')}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${route().current('admin.usuarios.*') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <span className="mr-3">👥</span> Usuarios y Roles
                            </Link>
                            <Link
                                href={route('admin.institucional.index')}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${route().current('admin.institucional.*') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <span className="mr-3">🏛️</span> Información Inst.
                            </Link>
                            <Link
                                href={route('admin.campanas.index')}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${route().current('admin.campanas.*') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <span className="mr-3">🎯</span> Crowdfunding
                            </Link>
                        </>
                    )}

                    {/* Módulos para Director e Instructor (CU-03) */}
                    {['director', 'instructor'].includes(roleName.toLowerCase()) && (
                        <>
                            <Link
                                href={route('admin.noticias.index')}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${route().current('admin.noticias.*') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <span className="mr-3">📰</span> Publicaciones
                            </Link>
                            <Link
                                href={route('admin.testimonios.index')}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${route().current('admin.testimonios.*') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <span className="mr-3">💬</span> Testimonios
                            </Link>
                            <Link
                                href={route('admin.comunidades.index')}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${route().current('admin.comunidades.*') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <span className="mr-3">🌾</span> Comunidades
                            </Link>
                        </>
                    )}

                    <div className="pt-4 pb-1">
                        <p className="px-3 text-[11px] uppercase tracking-wider text-slate-400 font-bold">Módulos en Desarrollo</p>
                    </div>

                    <div className="px-3 py-2 text-xs text-slate-400 space-y-2">
                        <div className="flex justify-between items-center opacity-60">
                            <span>💳 Donaciones y Pagos</span>
                            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">CU-06</span>
                        </div>
                    </div>
                </nav>

                {/* Botón para cerrar sesión */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <span>🚪</span>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Contenido principal de la página */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Barra superior de herramientas (Topbar) */}
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-600 hover:text-slate-900">
                            ☰
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">{title || 'Panel de Administración'}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('public.nosotros')}
                            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                            title="Ver portal público"
                        >
                            <span>🌐</span>
                            <span>Ver Portal Público</span>
                        </Link>
                        <div className="hidden sm:block text-right">
                            <span className="block text-sm font-semibold text-slate-700">{user?.nombre_completo}</span>
                            <span className="block text-xs text-slate-500">{user?.correo_electronico}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Cerrar Sesión"
                            className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                        >
                            🚪
                        </button>
                    </div>
                </header>

                {/* Notificaciones Flash del sistema */}
                <main className="flex-1 p-6">
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2">
                            <span>✅</span>
                            <span className="font-medium text-sm">{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center space-x-2">
                            <span>⚠️</span>
                            <span className="font-medium text-sm">{flash.error}</span>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
