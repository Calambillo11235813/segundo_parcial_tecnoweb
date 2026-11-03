import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/**
 * Formulario de Edición de Usuarios (CU-01).
 * Permite actualizar información, cambiar rol, estado y contraseña opcional.
 */
export default function Edit({ usuario, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre_completo: usuario.nombre_completo || '',
        correo_electronico: usuario.correo_electronico || '',
        contrasena: '',
        rol_id: usuario.rol_id || 1,
        estado: usuario.estado || 'Activo',
    });

    // Envío de la solicitud de actualización
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.usuarios.update', usuario.id_usuario));
    };

    return (
        <AdminLayout title={`Editar Usuario #${usuario.id_usuario}`}>
            <Head title={`Editar ${usuario.nombre_completo} - Portal FEDER`} />

            <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Modificar Datos de Personal</h2>
                        <p className="text-xs text-slate-500">Editando cuenta de {usuario.nombre_completo}</p>
                    </div>
                    <Link
                        href={route('admin.usuarios.index')}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                    >
                        ← Volver al listado
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                            Nombre Completo *
                        </label>
                        <input
                            type="text"
                            value={data.nombre_completo}
                            onChange={(e) => setData('nombre_completo', e.target.value)}
                            className={`w-full px-3.5 py-2 text-sm rounded-lg border ${errors.nombre_completo ? 'border-red-500' : 'border-slate-300'} focus:ring-emerald-500 focus:border-emerald-500`}
                            required
                        />
                        {errors.nombre_completo && <p className="text-xs text-red-600 mt-1">{errors.nombre_completo}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            value={data.correo_electronico}
                            onChange={(e) => setData('correo_electronico', e.target.value)}
                            className={`w-full px-3.5 py-2 text-sm rounded-lg border ${errors.correo_electronico ? 'border-red-500' : 'border-slate-300'} focus:ring-emerald-500 focus:border-emerald-500`}
                            required
                        />
                        {errors.correo_electronico && <p className="text-xs text-red-600 mt-1">{errors.correo_electronico}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                            Nueva Contraseña (Opcional)
                        </label>
                        <input
                            type="password"
                            value={data.contrasena}
                            onChange={(e) => setData('contrasena', e.target.value)}
                            placeholder="Dejar en blanco para mantener la contraseña actual"
                            className={`w-full px-3.5 py-2 text-sm rounded-lg border ${errors.contrasena ? 'border-red-500' : 'border-slate-300'} focus:ring-emerald-500 focus:border-emerald-500`}
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Solo llene este campo si desea cambiar la clave.</p>
                        {errors.contrasena && <p className="text-xs text-red-600 mt-1">{errors.contrasena}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                                Rol Jerárquico *
                            </label>
                            <select
                                value={data.rol_id}
                                onChange={(e) => setData('rol_id', Number(e.target.value))}
                                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {roles.map((r) => (
                                    <option key={r.id_rol} value={r.id_rol}>
                                        {r.nombre_rol}
                                    </option>
                                ))}
                            </select>
                            {errors.rol_id && <p className="text-xs text-red-600 mt-1">{errors.rol_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                                Estado de la Cuenta *
                            </label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                            {errors.estado && <p className="text-xs text-red-600 mt-1">{errors.estado}</p>}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                        <Link
                            href={route('admin.usuarios.index')}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition disabled:opacity-50"
                        >
                            {processing ? 'Actualizando...' : 'Actualizar Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
