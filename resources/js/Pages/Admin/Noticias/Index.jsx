import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/**
 * Listado Administrativo de Noticias y Comunicados (CU-03, RF-01).
 * Accesible por Director e Instructor.
 */
export default function Index({ noticias, filtros }) {
    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        router.get(route('admin.noticias.index'), {
            buscar: form.buscar.value,
            estado: form.estado.value,
        }, { preserveState: true });
    };

    const handleEliminar = (noticia) => {
        if (confirm(`¿Está seguro de eliminar la publicación "${noticia.titulo}"? Esta acción borrará también sus archivos multimedia asociados.`)) {
            router.delete(route('admin.noticias.destroy', noticia.id_noticia));
        }
    };

    const getEstadoBadge = (estado) => {
        switch (estado) {
            case 'Publicado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Borrador': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Archivado': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <AdminLayout title="Publicaciones y Noticias">
            <Head title="Gestión de Noticias - Portal FEDER" />

            {/* Cabecera del Módulo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Notas de Prensa y Artículos</h2>
                    <p className="text-xs text-slate-500">Publica novedades, actividades en comunidades y convocatorias oficiales.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link
                        href={route('public.noticias.index')}
                        target="_blank"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
                    >
                        <span>🌐</span>
                        <span>Ver Sala Pública</span>
                    </Link>
                    <Link
                        href={route('admin.noticias.create')}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition"
                    >
                        <span>➕</span>
                        <span>Nueva Publicación</span>
                    </Link>
                </div>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    name="buscar"
                    defaultValue={filtros?.buscar || ''}
                    placeholder="Buscar por título, etiquetas o contenido..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <select
                    name="estado"
                    defaultValue={filtros?.estado || ''}
                    className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                >
                    <option value="">Todos los Estados</option>
                    <option value="Publicado">Publicado</option>
                    <option value="Borrador">Borrador</option>
                    <option value="Archivado">Archivado</option>
                </select>
                <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
                >
                    Filtrar
                </button>
            </form>

            {/* Tabla de Publicaciones */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Portada</th>
                                <th className="px-4 py-3">Título y Etiquetas</th>
                                <th className="px-4 py-3">Autor</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Galería</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {noticias.data && noticias.data.length > 0 ? (
                                noticias.data.map((n) => (
                                    <tr key={n.id_noticia} className="hover:bg-slate-50/70 transition">
                                        <td className="px-4 py-3 w-16">
                                            <img
                                                src={n.imagen_principal}
                                                alt={n.titulo}
                                                className="w-12 h-10 object-cover rounded-md border border-slate-200 shadow-xs"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200'; }}
                                            />
                                        </td>
                                        <td className="px-4 py-3 max-w-sm">
                                            <p className="font-bold text-slate-800 line-clamp-1 text-sm">{n.titulo}</p>
                                            {n.etiquetas && (
                                                <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                                                    🏷️ {n.etiquetas}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{n.usuario?.nombre_completo || 'Equipo FEDER'}</td>
                                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                                            {n.fecha_publicacion ? new Date(n.fecha_publicacion).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                                <span>🖼️</span>
                                                <span>{n.galerias_count ?? 0}</span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getEstadoBadge(n.estado)}`}>
                                                {n.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <Link
                                                href={route('admin.noticias.edit', n.id_noticia)}
                                                className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleEliminar(n)}
                                                className="px-2.5 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-10 text-center text-slate-400 italic">
                                        No se encontraron publicaciones que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {noticias.links && noticias.links.length > 3 && (
                    <div className="p-4 border-t border-slate-100 flex justify-center space-x-1">
                        {noticias.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 text-xs rounded-lg ${link.active ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'} ${!link.url && 'opacity-40 pointer-events-none'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

