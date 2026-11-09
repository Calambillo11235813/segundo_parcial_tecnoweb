import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import StatusBadge from '@/Components/StatusBadge';

/**
 * Comprobante preliminar digital de compromiso de donación (CU-06, RF-12, Flujo 6).
 * Emite en pantalla el recibo y las instrucciones de validación bancaria.
 */
export default function Comprobante({ aporte }) {
    const campana = aporte.campana;
    const formatearBs = (val) =>
        new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(val || 0);

    const handleImprimir = () => {
        window.print();
    };

    return (
        <PublicLayout>
            <Head title={`Comprobante ${aporte.codigo_comprobante} - Fundación FEDER`} />

            <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
                {/* Alerta de Agradecimiento */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-xs flex items-center space-x-3 shadow-xs">
                    <span className="text-2xl">🎉</span>
                    <div>
                        <p className="font-bold">¡Intención de aporte registrada exitosamente!</p>
                        <p className="text-emerald-700 mt-0.5">
                            Se despachó una copia oficial y mensaje de agradecimiento a <strong>{aporte.correo_donante}</strong>.
                        </p>
                    </div>
                </div>

                {/* Recibo Oficial Digital */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden print:border-none print:shadow-none">
                    {/* Cabecera del Recibo */}
                    <div className="bg-gradient-to-r from-emerald-800 to-slate-900 p-6 text-white text-center relative">
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full">
                            Comprobante Preliminar de Aporte
                        </span>
                        <h1 className="text-2xl font-black mt-3">Fundación FEDER</h1>
                        <p className="text-xs text-emerald-200 mt-0.5">Desarrollo Rural Chiquitano • Santa Cruz, Bolivia</p>
                        <div className="mt-4 font-mono font-bold text-amber-300 text-sm tracking-wider">
                            Nº {aporte.codigo_comprobante}
                        </div>
                    </div>

                    {/* Cuerpo del Recibo */}
                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Importe Destacado */}
                        <div className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-100">
                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Monto Comprometido</span>
                            <p className="text-3xl font-black text-emerald-700 mt-1">
                                {formatearBs(aporte.monto)}
                            </p>
                            <div className="mt-2 flex justify-center">
                                <StatusBadge status={aporte.estado} />
                            </div>
                        </div>

                        {/* Desglose de Datos */}
                        <div className="divide-y divide-slate-100 text-xs text-slate-600">
                            <div className="py-2.5 flex justify-between">
                                <span className="font-medium text-slate-400">Donante / Benefactor:</span>
                                <span className="font-bold text-slate-800 text-right">{aporte.nombre_donante}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="font-medium text-slate-400">Correo Electrónico:</span>
                                <span className="font-bold text-slate-800 text-right">{aporte.correo_donante}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="font-medium text-slate-400">Campaña de Destino:</span>
                                <span className="font-bold text-slate-800 text-right max-w-xs">{campana?.titulo}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="font-medium text-slate-400">Comunidad Rural:</span>
                                <span className="font-bold text-slate-800 text-right">{campana?.comunidad?.nombre || 'Chiquitanía'}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="font-medium text-slate-400">Modalidad Elegida:</span>
                                <span className="font-bold text-slate-800 text-right">{aporte.modalidad}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="font-medium text-slate-400">Fecha y Hora de Emisión:</span>
                                <span className="font-bold text-slate-800 text-right font-mono">
                                    {aporte.fecha_registro ? new Date(aporte.fecha_registro).toLocaleString('es-BO') : new Date().toLocaleString('es-BO')}
                                </span>
                            </div>
                        </div>

                        {/* Instrucciones según Modalidad */}
                        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-2">
                            <p className="font-bold flex items-center space-x-1.5">
                                <span>📌</span>
                                <span>Pasos finales para la confirmación de su aporte:</span>
                            </p>
                            {aporte.modalidad === 'QR' && (
                                <div className="space-y-2">
                                    <p>Realice la transferencia escaneando el QR institucional de la cuenta FEDER con su banca móvil por el monto de <strong>{formatearBs(aporte.monto)}</strong>.</p>
                                    <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border border-amber-300 flex items-center justify-center text-center">
                                        <div className="text-[10px] text-slate-500 font-mono">
                                            [ QR Simple FEDER ]<br />
                                            {aporte.codigo_comprobante}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {aporte.modalidad === 'Transferencia bancaria' && (
                                <p>
                                    Deposite a: <strong>Banco Unión S.A.</strong> • Cta Cte: <strong>1-12345678</strong> (NIT: 1028374029, Fundación FEDER). Indique en la glosa su código: <strong>{aporte.codigo_comprobante}</strong>.
                                </p>
                            )}
                            {aporte.modalidad === 'Efectivo' && (
                                <p>
                                    Apersónese a la oficina central: <strong>San Joaquín 2052, Santa Cruz</strong> de 08:30 a 16:30 presentando este comprobante.
                                </p>
                            )}
                        </div>

                        {/* Acciones */}
                        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
                            <button
                                type="button"
                                onClick={handleImprimir}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5"
                            >
                                <span>🖨️</span>
                                <span>Imprimir / Guardar Recibo</span>
                            </button>

                            <Link
                                href={campana ? route('public.campanas.show', campana.id_campana) : route('public.campanas.index')}
                                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                            >
                                Volver a la campaña →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

