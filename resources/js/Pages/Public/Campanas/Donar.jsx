import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

/**
 * Formulario interactivo de compromiso de donación (CU-06, RF-11).
 * Permite al cooperante ingresar sus datos, seleccionar modalidad y aportar.
 */
export default function Donar({ campana, modalidades }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        es_anonimo: false,
        nombre_donante: '',
        correo_donante: '',
        monto: '',
        modalidad: modalidades[0] || 'Transferencia bancaria',
        campana_id: campana.id_campana,
    });

    const [montoRapido, setMontoRapido] = useState(null);
    const montosSugeridos = [50, 100, 250, 500, 1000];

    const seleccionarVisibilidad = (anonimo) => {
        setData('es_anonimo', anonimo);
        if (anonimo) {
            clearErrors('nombre_donante');
        }
    };

    const seleccionarMonto = (v) => {
        setMontoRapido(v);
        setData('monto', v.toString());
    };

    const handleMontoChange = (e) => {
        const normalizado = e.target.value.replace(',', '.');
        if (normalizado === '' || /^\d*(\.\d{0,2})?$/.test(normalizado)) {
            setMontoRapido(null);
            setData('monto', normalizado);
        }
    };

    const montoNumerico = Number(data.monto);
    const montoValido = Number.isFinite(montoNumerico) && montoNumerico >= 1;
    const pago = campana.config_pago || {};
    const tieneCuenta = Boolean(pago.banco || pago.numero_cuenta || pago.titular);

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

                    {/* Visibilidad del Donante */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">
                            ¿Cómo deseas que aparezca tu donación? *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label
                                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                                    !data.es_anonimo
                                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                                        : 'border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="es_anonimo"
                                    checked={!data.es_anonimo}
                                    onChange={() => seleccionarVisibilidad(false)}
                                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                />
                                <div>
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <span>👤</span>
                                        <span>Mostrar mi nombre</span>
                                    </span>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                        Tu nombre o entidad aparecerá en el muro de aportes confirmados.
                                    </p>
                                </div>
                            </label>

                            <label
                                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                                    data.es_anonimo
                                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                                        : 'border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="es_anonimo"
                                    checked={data.es_anonimo}
                                    onChange={() => seleccionarVisibilidad(true)}
                                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                />
                                <div>
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <span>🔒</span>
                                        <span>Donación anónima</span>
                                    </span>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                        Tu identidad será privada y figurarás como <strong>Donante Anónimo</strong>.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Datos del Donante */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                        {!data.es_anonimo ? (
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
                        ) : (
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
                                <span className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm shrink-0">
                                    🔒
                                </span>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Aporte como Donante Anónimo</p>
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                        No necesitas ingresar tu nombre. Tu aporte se publicará de forma anónima.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                            <input
                                type="email"
                                value={data.correo_donante}
                                onChange={(e) => setData('correo_donante', e.target.value)}
                                placeholder="Para despachar su comprobante oficial"
                                className={`w-full text-xs rounded-xl border-slate-300 focus:ring-emerald-500 ${errors.correo_donante && 'border-red-400'}`}
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                {data.es_anonimo
                                    ? 'Uso estrictamente privado para enviarte tu comprobante. Nunca se publica.'
                                    : 'Enviaremos tu comprobante oficial a esta dirección (no se publica).'}
                            </p>
                            {errors.correo_donante && <p className="text-red-500 text-[11px] mt-1">{errors.correo_donante}</p>}
                        </div>
                    </div>

                    {/* Vista previa en el muro público */}
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 font-medium">Así aparecerás en la campaña:</span>
                        <div className="flex items-center space-x-2">
                            <span
                                className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[10px] ${
                                    data.es_anonimo
                                        ? 'bg-slate-200 text-slate-600'
                                        : 'bg-emerald-100 text-emerald-800'
                                }`}
                            >
                                {data.es_anonimo ? '🔒' : (data.nombre_donante.trim()[0] || 'D').toUpperCase()}
                            </span>
                            <span className="font-bold text-slate-800">
                                {data.es_anonimo ? 'Donante Anónimo' : (data.nombre_donante.trim() || 'Tu nombre aquí')}
                            </span>
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
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            value={data.monto}
                            onChange={handleMontoChange}
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
                                        {mod === 'QR'
                                            ? (pago.qr_imagen ? 'QR listo para escanear' : 'Escaneo Simple')
                                            : mod === 'Transferencia bancaria'
                                                ? (pago.banco || 'Cuenta bancaria de campaña')
                                                : 'Entrega en oficina'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Guía de la modalidad */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                        <p className="font-bold text-slate-800">ℹ️ Información de {data.modalidad}:</p>
                        {data.modalidad === 'QR' && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {pago.qr_imagen && (
                                    <img
                                        src={pago.qr_imagen}
                                        alt="Código QR de la campaña"
                                        className="w-28 h-28 object-contain bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs shrink-0"
                                    />
                                )}
                                <p className="leading-relaxed">
                                    {pago.qr_imagen
                                        ? 'Escanea este código QR desde tu aplicación bancaria móvil. Al confirmar tu compromiso también podrás verlo en tamaño completo y descargarlo en tu comprobante.'
                                        : 'Al confirmar tu compromiso se emitirán las instrucciones para completar tu aporte mediante QR.'}
                                </p>
                            </div>
                        )}
                        {data.modalidad === 'Transferencia bancaria' && (
                            tieneCuenta ? (
                                <p className="leading-relaxed">
                                    {pago.banco && <>Banco: <strong>{pago.banco}</strong>{' '}</>}
                                    {pago.numero_cuenta && <>| Cuenta / Tarjeta: <strong className="font-mono">{pago.numero_cuenta}</strong>{' '}</>}
                                    {pago.nit_ci && <>| NIT/CI: <strong className="font-mono">{pago.nit_ci}</strong>{' '}</>}
                                    {pago.titular && <>| Titular: <strong>{pago.titular}</strong></>}
                                </p>
                            ) : (
                                <p>Esta campaña aún no tiene una cuenta bancaria personalizada configurada. Al confirmar, recibirás los datos de tesorería en tu comprobante.</p>
                            )
                        )}
                        {data.modalidad === 'Efectivo' && (
                            <p>
                                Punto de recepción: <strong>{pago.direccion_efectivo || 'Oficina Central: San Joaquín 2052, Santa Cruz (Horario 08:30 - 16:30)'}</strong>.
                            </p>
                        )}
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
                            {processing
                                ? 'Registrando...'
                                : montoValido
                                    ? `❤️ Confirmar Bs. ${montoNumerico.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : '❤️ Confirmar y Generar Comprobante'}
                        </button>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
