import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/**
 * Listado y Directorio de Usuarios (CU-01).
 * Permite filtrar por búsqueda, rol y estado, con acciones de edición e inactivación.
 */
export default function Index({ usuarios, roles, filtros }) {
    const [buscar, setBuscar] = useState(filtros?.buscar || '');
    const [rolId, setRolId] = useState(filtros?.rol_id || '');
    const [estado, setEstado] = useState(filtros?.estado || '');

    // Aplica los filtros seleccionados
    const handleFiltrar = (e) => {
        e.preventDefault();
        router.get(route('admin.usuarios.index'), { buscar, rol_id: rolId, estado }, { preserveState: true });
    };

    // Restablece los filtros del formulario
    const handleLimpiar = () => {
        setBuscar('');
        setRolId('');
        setEstado('');
        router.get(route('admin.usuarios.index'));
    };

    // Solicita confirmación antes de eliminar o inactivar
    const handleEliminar = (usuario) => {
        if (confirm(`¿Estás seguro de que deseas eliminar o inactivar a "${usuario.nombre_completo}"?`)) {
            router.delete(route('admin.usuarios.destroy', usuario.id_usuario));
        }
    };

    // Retorna estilos de insignia según el rol
    const getRoleBadge = (rolNombre) => {
        switch (rolNombre?.toLowerCase()) {
            case 'director': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
            case 'secretaria': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'instructor': return 'bg-amber-100 text-amber-800 border-amber-300';
            default: return 'bg-slate-100 text-slate-800 border-slate-300';
        }
    };

    return (
        <AdminLayout title="Gestión de Usuarios y Roles">
            <Head title="Usuarios y Roles - Portal FEDER" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Directorio de Usuarios</h2>
                    <p className="text-xs text-slate-500">Administra cuentas, credenciales y privilegios jerárquicos.</p>
                </div>
                <Link
                    href={route('admin.usuarios.create')}
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow transition"
                >
                    <span>➕</span>
                    <span>Nuevo Usuario</span>
                </Link>
            </div>

            {/* Formulario de Filtros */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <form onSubmit={handleFiltrar} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <select
                        value={rolId}
                        onChange={(e) => setRolId(e.target.value)}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="">Todos los Roles</option>
                        {roles.map((r) => (
                            <option key={r.id_rol} value={r.id_rol}>{r.nombre_rol}</option>
                        ))}
                    </select>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="">Todos los Estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <div className="flex space-x-2">
                        <button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2 rounded-lg transition">
                            Filtrar
                        </button>
                        <button type="button" onClick={handleLimpiar} className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold py-2 rounded-lg transition">
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-5 py-3">ID</th>
                                <th className="px-5 py-3">Nombre Completo</th>
                                <th className="px-5 py-3">Correo Electrónico</th>
                                <th className="px-5 py-3">Rol</th>
                                <th className="px-5 py-3">Estado</th>
                                <th className="px-5 py-3">Fecha Registro</th>
                                <th className="px-5 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {usuarios.data.map((u) => (
                                <tr key={u.id_usuario} className="hover:bg-slate-50/70">
                                    <td className="px-5 py-3 text-xs font-mono text-slate-400">#{u.id_usuario}</td>
                                    <td className="px-5 py-3 font-semibold text-slate-800 text-xs">{u.nombre_completo}</td>
                                    <td className="px-5 py-3 text-xs text-slate-600">{u.correo_electronico}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${getRoleBadge(u.rol?.nombre_rol)}`}>
                                            {u.rol?.nombre_rol || 'Sin Rol'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${u.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                            {u.estado}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-[11px] text-slate-400">
                                        {u.fecha_registro ? new Date(u.fecha_registro).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-5 py-3 text-right space-x-2">
                                        <Link
                                            href={route('admin.usuarios.edit', u.id_usuario)}
                                            className="inline-flex px-2.5 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleEliminar(u)}
                                            className="inline-flex px-2.5 py-1 text-xs font-medium rounded bg-red-50 text-red-700 hover:bg-red-100 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Controles de Paginación */}
                {usuarios.links && usuarios.links.length > 3 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Mostrando {usuarios.from || 0} a {usuarios.to || 0} de {usuarios.total} usuarios</span>
                        <div className="flex space-x-1">
                            {usuarios.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded text-xs font-medium ${link.active ? 'bg-emerald-600 text-white font-bold' : link.url ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'text-slate-300 pointer-events-none'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
