<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProgramaRequest;
use App\Models\Auditoria;
use App\Models\Comunidad;
use App\Models\ProgramaProductivo;
use Illuminate\Http\RedirectResponse;

/**
 * Controlador de Programas Productivos y Asistencia Técnica (CU-04, RF-06).
 * Accesible por Director e Instructor.
 */
class ProgramaController extends Controller
{
    /**
     * Registra un nuevo programa dentro de una comunidad.
     */
    public function store(ProgramaRequest $request, int $comunidadId): RedirectResponse
    {
        $comunidad = Comunidad::findOrFail($comunidadId);

        $programa = ProgramaProductivo::create(array_merge(
            $request->validated(),
            ['comunidad_id' => $comunidad->id_comunidad]
        ));

        Auditoria::registrar("CREACION_PROGRAMA [{$programa->nombre}]", 'PROGRAMA_PRODUCTIVO');

        return redirect()->back()
            ->with('success', "Programa \"{$programa->nombre}\" publicado en {$comunidad->nombre}.");
    }

    /**
     * Actualiza los datos de un programa productivo.
     */
    public function update(ProgramaRequest $request, int $id): RedirectResponse
    {
        $programa = ProgramaProductivo::findOrFail($id);
        $programa->update($request->validated());

        Auditoria::registrar("ACTUALIZACION_PROGRAMA [ID: {$id}]", 'PROGRAMA_PRODUCTIVO');

        return redirect()->back()
            ->with('success', "Programa \"{$programa->nombre}\" actualizado correctamente.");
    }

    /**
     * Elimina un programa productivo.
     */
    public function destroy(int $id): RedirectResponse
    {
        $programa = ProgramaProductivo::findOrFail($id);
        $nombre = $programa->nombre;
        $programa->delete();

        Auditoria::registrar("ELIMINACION_PROGRAMA [{$nombre}]", 'PROGRAMA_PRODUCTIVO');

        return redirect()->back()
            ->with('success', "Programa \"{$nombre}\" eliminado.");
    }
}

