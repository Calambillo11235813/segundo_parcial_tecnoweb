import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

/**
 * Pantalla de Inicio de Sesión Institucional (CU-01).
 * Autentica usuarios contra feder.usuario con diseño y colores FEDER.
 */
export default function Login() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Envío del formulario de autenticación
    const submit = (e) => {
        e.preventDefault();
        post(route('login.store'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
            <Head title="Iniciar Sesión - Portal FEDER" />

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                {/* Cabecera Institucional FEDER */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl shadow-lg mb-3">
                        F
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fundación FEDER</h1>
                    <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mt-1">
                        Portal Institucional y Administrativo
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Desarrollo Rural de la Chiquitanía</p>
                </div>

                {/* Mensajes Flash */}
                {flash?.info && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg">
                        {flash.info}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                        {flash.error}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="ej. usuario@tecnoweb.org.bo"
                            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-emerald-500 transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-emerald-600'}`}
                            required
                        />
                        {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-emerald-500 transition-all ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-emerald-600'}`}
                            required
                        />
                        {errors.password && <p className="text-red-600 text-xs mt-1 font-medium">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <span>Recordar sesión</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50"
                    >
                        {processing ? 'Verificando credenciales...' : 'Ingresar al Sistema'}
                    </button>
                </form>

                {/* Nota para desarrollo institucional */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-400">
                        Acceso restringido para personal autorizado: <br />
                        <span className="font-semibold text-slate-600">Director</span> • 
                        <span className="font-semibold text-slate-600"> Secretaria</span> • 
                        <span className="font-semibold text-slate-600"> Instructor</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
