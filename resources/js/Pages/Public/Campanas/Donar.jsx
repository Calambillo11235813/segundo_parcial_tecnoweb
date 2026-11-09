import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

/**
 * Formulario interactivo de compromiso de donación (CU-06, RF-11).
 * Permite al cooperante ingresar sus datos, seleccionar modalidad y aportar.
 */
export default function Donar({ campana, modalidades }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre_donante: '',
        correo_donante: '',
        monto: '',
        modalidad: modalidades[0] || 'Transferencia bancaria',
        campana_id: campana.id_campana,
    });

    const [montoRapido, setMontoRapido] = useState(null);
    const montosSugeridos = [50, 100, 250, 500, 1000];

    const seleccionarMonto = (v) => {
        setMontoRapido(v);
        setData('monto', v.toString());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.donaciones.store', campana.id_campana));
    };

    return (
        <PublicLayout>
            <Head title={`Aportar a ${campana.titulo} - Fundación FEDER`} />

            {/* Breadcrumbs */}
            <nav className="bg-slate-100 border-b border-slate-200 py-3">
                <div className="max-w-4xl mx-auto px-4 text-xs text-slate-500 flex items-center space-x-2">
                    <Link href="/" className="hover:text-emerald-700">Inicio</Link>
                    <span>/</span>
                    <Link href={route('public.campanas.index')} className="hover:text-emerald-700">Campañas</Link>
                    <span>/</span>
                    <Link href={route('public.campanas.show', campana.id_campana)} className="hover:text-emerald-700 truncate max-w-xs">{campana.titulo}</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold">Aportar</span>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Resumen del Proyecto y Descarga de Expediente */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            📍 {campana.comunidad?.nombre || 'Comunidad Rural'}
                        </span>
                        <h1 className="text-xl font-bold text-slate-900 mt-1">{campana.titulo}</h1>
                        <p className="text-xs text-slate-500">Tu contribución financia directamente este plan productivo.</p>
                    </div>

                    <a
                        href={route('public.campanas.pdf', campana.id_campana)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition whitespace-nowrap"
                    >
                        <span>📄</span>
                        <span>Descargar Ficha Técnica (PDF)</span>
                    </a>
                </div>

                {/* Formulario Principal de Aporte */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                        ❤️ Registro de Compromiso de Donación
                    </h2>

                    {/* Datos del Donante */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre completo o Entidad *</label>
                            <input
                                type="text"
                                value={data.nombre_donante}
                                onChange={(e) => setData('nombre_donante', e.target.value)}
                                placeholder="Ej: María Eugenia Roca / Cooperación"
                                className={`w-full text-xs rounded-xl border-slate-300 focus:ring-emerald-500 ${errors.nombre_donante && 'border-red-400'}`}
                            />
                            {errors.nombre_donante && <p className="text-red-500 text-[11px] mt-1">{errors.nombre_donante}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                            <input
                                type="email"
                                value={data.correo_donante}
                                onChange={(e) => setData('correo_donante', e.target.value)}
                                placeholder="Para despachar su comprobante oficial"
                                className={`w-full text-xs rounded-xl border-slate-300 focus:ring-emerald-500 ${errors.correo_donante && 'border-red-400'}`}
                            />
                            {errors.correo_donante && <p className="text-red-500 text-[11px] mt-1">{errors.correo_donante}</p>}
                        </div>
                    </div>

                    {/* Selección de Monto */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Monto a Aportar (en Bs.) *</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {montosSugeridos.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => seleccionarMonto(m)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${montoRapido === m ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                >
                                    Bs. {m}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            step="0.50"
                            min="1"
                            value={data.monto}
                            onChange={(e) => {
                                setMontoRapido(null);
                                setData('monto', e.target.value);
                            }}
                            placeholder="O ingrese un monto personalizado (ej: 350)"
                            className={`w-full text-xs rounded-xl border-slate-300 focus:ring-emerald-500 ${errors.monto && 'border-red-400'}`}
                        />
                        {errors.monto && <p className="text-red-500 text-[11px] mt-1">{errors.monto}</p>}
                    </div>

                    {/* Modalidad de Pago */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Modalidad de Aporte *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {modalidades.map((mod) => (
                                <label
                                    key={mod}
                                    className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition ${data.modalidad === mod ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="modalidad"
                                            value={mod}
                                            checked={data.modalidad === mod}
                                            onChange={(e) => setData('modalidad', e.target.value)}
                                            className="text-emerald-600 focus:ring-emerald-500 text-xs"
                                        />
                                        <span className="text-xs font-bold text-slate-800">{mod}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-2">
                                        {mod === 'QR' ? 'Escaneo Simple' : mod === 'Transferencia bancaria' ? 'Banco Unión Cta Cte' : 'Entrega en oficina'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Guía de la modalidad */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                        <p className="font-bold text-slate-800">ℹ️ Información de {data.modalidad}:</p>
                        {data.modalidad === 'QR' && <p>Se emitirá el código QR institucional de la cuenta FEDER para escanear desde cualquier app bancaria.</p>}
                        {data.modalidad === 'Transferencia bancaria' && <p>Banco Unión Cta Cte: <strong>1-12345678</strong> | NIT: <strong>1028374029</strong> | Titular: Fundación FEDER.</p>}
                        {data.modalidad === 'Efectivo' && <p>Oficina Central: <strong>San Joaquín 2052, Santa Cruz</strong> (Horario 08:30 - 16:30).</p>}
                    </div>

                    {/* Botones de acción */}
                    <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <Link href={route('public.campanas.show', campana.id_campana)} className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
                            ← Cancelar y volver
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                        >
                            {processing ? 'Registrando...' : '❤️ Confirmar y Generar Comprobante'}
                        </button>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
