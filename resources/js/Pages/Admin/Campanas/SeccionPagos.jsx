import React, { useEffect, useState } from 'react';

/**
 * Sección reutilizable de Configuración de Formas de Pago (QR y Cuenta Bancaria)
 * para creación y edición de campañas.
 */
export default function SeccionPagos({
    data,
    setData,
    errors,
    qrActualUrl = null,
}) {
    const [previewUrl, setPreviewUrl] = useState(qrActualUrl || null);

    useEffect(() => {
        if (!data.qr_imagen_archivo) {
            setPreviewUrl(data.eliminar_qr ? null : (qrActualUrl || null));
            return;
        }

        const objectUrl = URL.createObjectURL(data.qr_imagen_archivo);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.qr_imagen_archivo, data.eliminar_qr, qrActualUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setData((prev) => ({
                ...prev,
                qr_imagen_archivo: file,
                eliminar_qr: false,
            }));
        }
    };

    const handleQuitarQr = () => {
        setData((prev) => ({
            ...prev,
            qr_imagen_archivo: null,
            eliminar_qr: true,
        }));
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>💳</span>
                    <span>Configuración de Formas de Pago (QR y Cuenta / Tarjeta)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                    Define la cuenta bancaria o tarjeta y sube la imagen del código QR que verán los donantes al aportar a esta campaña.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Banco / Entidad Financiera
                    </label>
                    <input
                        type="text"
                        value={data.pago_banco}
                        onChange={(e) => setData('pago_banco', e.target.value)}
                        placeholder="Ej: Banco Unión S.A., Banco Mercantil..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {errors.pago_banco && <p className="text-red-600 mt-1">{errors.pago_banco}</p>}
                </div>

                <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Número de Cuenta o Tarjeta
                    </label>
                    <input
                        type="text"
                        value={data.pago_numero_cuenta}
                        onChange={(e) => setData('pago_numero_cuenta', e.target.value)}
                        placeholder="Ej: 1-12345678 o número de tarjeta"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    />
                    {errors.pago_numero_cuenta && <p className="text-red-600 mt-1">{errors.pago_numero_cuenta}</p>}
                </div>

                <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Titular de la Cuenta
                    </label>
                    <input
                        type="text"
                        value={data.pago_titular}
                        onChange={(e) => setData('pago_titular', e.target.value)}
                        placeholder="Ej: Fundación FEDER"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {errors.pago_titular && <p className="text-red-600 mt-1">{errors.pago_titular}</p>}
                </div>

                <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                        NIT / CI (Opcional)
                    </label>
                    <input
                        type="text"
                        value={data.pago_nit_ci}
                        onChange={(e) => setData('pago_nit_ci', e.target.value)}
                        placeholder="Ej: 1028374029"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    />
                    {errors.pago_nit_ci && <p className="text-red-600 mt-1">{errors.pago_nit_ci}</p>}
                </div>
            </div>

            <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Dirección / Punto de Recepción en Efectivo (Opcional)
                </label>
                <input
                    type="text"
                    value={data.pago_direccion_efectivo}
                    onChange={(e) => setData('pago_direccion_efectivo', e.target.value)}
                    placeholder="Ej: Oficina Central San Joaquín 2052, Santa Cruz (08:30 - 16:30)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.pago_direccion_efectivo && <p className="text-red-600 mt-1">{errors.pago_direccion_efectivo}</p>}
            </div>

            {/* Carga de imagen del Código QR */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-28 h-28 rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Vista previa QR"
                            className="w-full h-full object-contain p-1"
                        />
                    ) : (
                        <div className="text-center px-2 text-slate-400">
                            <span className="text-2xl block">📱</span>
                            <span className="text-[10px] font-semibold">Sin QR cargado</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <label className="block font-semibold text-slate-700 uppercase">
                        Imagen del Código QR (PNG, JPG o WEBP)
                    </label>
                    <p className="text-[11px] text-slate-500 leading-snug">
                        Sube el código QR generado por tu banco para esta campaña. Se mostrará al donante en el formulario y en su comprobante.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition">
                            <span>📤</span>
                            <span>{previewUrl ? 'Cambiar imagen QR' : 'Subir imagen QR'}</span>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        {previewUrl && (
                            <button
                                type="button"
                                onClick={handleQuitarQr}
                                className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition"
                            >
                                Quitar QR
                            </button>
                        )}
                    </div>
                    {errors.qr_imagen_archivo && (
                        <p className="text-red-600 text-[11px]">{errors.qr_imagen_archivo}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
