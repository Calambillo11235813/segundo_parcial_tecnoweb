import React from 'react';

/**
 * Modal de confirmación para acciones destructivas (UI_COMPONENTS_GUIDE §4.4).
 * Reemplaza el uso de window.confirm() nativo.
 */
export default function ConfirmModal({
    isOpen,
    title = 'Confirmar acción',
    message,
    confirmText = 'Eliminar',
    onConfirm,
    onClose,
    loading = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
                <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg flex-shrink-0">
                        ⚠️
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-3.5 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

