import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import ComunidadCard from './ComunidadCard';
import ComunidadModal from './ComunidadModal';
import ProgramaModal from './ProgramaModal';

/**
 * Panel administrativo de Comunidades y Programas Productivos (CU-04).
 * Accesible por Director e Instructor.
 */
export default function Index({ comunidades, filtros, areasProductivas }) {
    // Estado de modales: comunidad, programa y confirmación de borrado
    const [modalComunidad, setModalComunidad] = useState({ abierto: false, comunidad: null });
    const [modalPrograma, setModalPrograma] = useState({ abierto: false, programa: null, comunidad: null });
    const [confirmacion, setConfirmacion] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    // Aplica búsqueda y filtro de estado manteniendo el estado de la página
    const handleFiltrar = (e) => {
        e.preventDefault();
        router.get(route('admin.comunidades.index'), {
            buscar: e.target.buscar.value,
            estado: e.target.estado.value,
        }, { preserveState: true });
    };

    // Ejecuta la eliminación confirmada (comunidad o programa)
    const ejecutarEliminacion = () => {
        setEliminando(true);
        router.delete(confirmacion.url, {
            preserveScroll: true,
            onFinish: () => { setEliminando(false); setConfirmacion(null); },
        });
    };

    const totalProgramas = comunidades.reduce((suma, c) => suma + c.programas_count, 0);

    return (
        <AdminLayout title="Comunidades y Programas">
            <Head title="Comunidades y Programas - Portal FEDER" />

            {/* Cabecera del módulo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Áreas de Intervención Rural</h2>
                    <p className="text-xs text-slate-500">
                        {comunidades.length} comunidades • {totalProgramas} programas de asistencia técnica
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('public.comunidades.index')}
                        target="_blank"
                        className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
                    >
                        🌐 Ver Catálogo Público
                    </Link>
                    <button
                        onClick={() => setModalComunidad({ abierto: true, comunidad: null })}
                        className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-lg shadow transition"
                    >
                        ➕ Nueva Comunidad
                    </button>
                </div>
            </div>

            {/* Filtros de búsqueda */}
            <form onSubmit={handleFiltrar} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    name="buscar"
                    defaultValue={filtros?.buscar || ''}
                    placeholder="Buscar por comunidad, ubicación, programa o rubro..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-green-600 focus:border-green-600"
                />
                <select
                    name="estado"
                    defaultValue={filtros?.estado || ''}
                    className="px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-green-600 focus:border-green-600"
                >
                    <option value="">Todos los estados</option>
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition">
                    Filtrar
                </button>
            </form>

            {/* Listado de fichas comunitarias */}
            <div className="space-y-5">
                {comunidades.length > 0 ? comunidades.map((c) => (
                    <ComunidadCard
                        key={c.id_comunidad}
                        comunidad={c}
                        onEditar={() => setModalComunidad({ abierto: true, comunidad: c })}
                        onEliminar={() => setConfirmacion({
                            titulo: 'Eliminar comunidad',
                            mensaje: `Se eliminará "${c.nombre}" junto con sus ${c.programas_count} programas y ${c.testimonios_count} testimonios. Esta acción no se puede deshacer.`,
                            url: route('admin.comunidades.destroy', c.id_comunidad),
                        })}
                        onNuevoPrograma={() => setModalPrograma({ abierto: true, programa: null, comunidad: c })}
                        onEditarPrograma={(p) => setModalPrograma({ abierto: true, programa: p, comunidad: c })}
                        onEliminarPrograma={(p) => setConfirmacion({
                            titulo: 'Eliminar programa',
                            mensaje: `¿Eliminar el programa "${p.nombre}" de ${c.nombre}?`,
                            url: route('admin.programas.destroy', p.id_programa),
                        })}
                    />
                )) : (
                    <div className="py-12 text-center text-slate-400 text-xs italic bg-white rounded-2xl border border-slate-200">
                        No se encontraron comunidades con los filtros aplicados.
                    </div>
                )}
            </div>

            <ComunidadModal
                comunidad={modalComunidad.comunidad}
                isOpen={modalComunidad.abierto}
                onClose={() => setModalComunidad({ abierto: false, comunidad: null })}
            />

            <ProgramaModal
                programa={modalPrograma.programa}
                comunidad={modalPrograma.comunidad}
                areas={areasProductivas}
                isOpen={modalPrograma.abierto}
                onClose={() => setModalPrograma({ abierto: false, programa: null, comunidad: null })}
            />

            <ConfirmModal
                isOpen={!!confirmacion}
                title={confirmacion?.titulo}
                message={confirmacion?.mensaje}
                loading={eliminando}
                onConfirm={ejecutarEliminacion}
                onClose={() => setConfirmacion(null)}
            />
        </AdminLayout>
    );
}

