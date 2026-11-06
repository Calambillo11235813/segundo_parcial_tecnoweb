<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ComunidadRequest;
use App\Models\Auditoria;
use App\Models\Comunidad;
use App\Models\ProgramaProductivo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador de Gestión de Comunidades Beneficiarias (CU-04, RF-05).
 * Accesible por Director e Instructor.
 */
class ComunidadController extends Controller
{
    /**
     * Lista las comunidades con sus programas, aplicando búsqueda y filtro de estado.
     */
    public function index(Request $request): Response
    {
        $this->inicializarProgramasBase();

        $query = Comunidad::with(['programas' => fn ($q) => $q->orderBy('id_programa')])
            ->withCount(['programas', 'testimonios'])
            ->orderBy('nombre');

        if ($request->filled('buscar')) {
            $termino = '%' . trim($request->input('buscar')) . '%';
            $query->where(function ($q) use ($termino) {
                $q->where('nombre', 'ilike', $termino)
                  ->orWhere('ubicacion', 'ilike', $termino)
                  ->orWhereHas('programas', fn ($p) => $p->where(fn ($s) => $s->where('nombre', 'ilike', $termino)
                      ->orWhere('area_productiva', 'ilike', $termino)));
            });
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        return Inertia::render('Admin/Comunidades/Index', [
            'comunidades'     => $query->get(),
            'filtros'         => $request->only(['buscar', 'estado']),
            'areasProductivas' => ProgramaProductivo::AREAS_PRODUCTIVAS,
        ]);
    }

    /**
     * Registra una nueva ficha comunitaria.
     */
    public function store(ComunidadRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['usuario_id'] = Auth::id();

        $comunidad = Comunidad::create($data);

        Auditoria::registrar("CREACION_COMUNIDAD [{$comunidad->nombre}]", 'COMUNIDAD');

        return redirect()->back()
            ->with('success', "Comunidad \"{$comunidad->nombre}\" registrada en el catálogo.");
    }

    /**
     * Actualiza los datos descriptivos de la comunidad.
     */
    public function update(ComunidadRequest $request, int $id): RedirectResponse
    {
        $comunidad = Comunidad::findOrFail($id);
        $comunidad->update($request->validated());

        Auditoria::registrar("ACTUALIZACION_COMUNIDAD [ID: {$id}]", 'COMUNIDAD');

        return redirect()->back()
            ->with('success', "Ficha de \"{$comunidad->nombre}\" actualizada correctamente.");
    }

    /**
     * Elimina la comunidad (y en cascada sus programas y testimonios).
     * Regla de negocio: no se permite si posee campañas de recaudación (FK RESTRICT).
     */
    public function destroy(int $id): RedirectResponse
    {
        $comunidad = Comunidad::findOrFail($id);

        $tieneCampanas = DB::table('feder.campana')->where('comunidad_id', $id)->exists();
        if ($tieneCampanas) {
            return redirect()->back()->with('error',
                "No se puede eliminar \"{$comunidad->nombre}\" porque tiene campañas de recaudación asociadas. Cámbiela a estado Inactiva.");
        }

        $nombre = $comunidad->nombre;
        $comunidad->delete();

        Auditoria::registrar("ELIMINACION_COMUNIDAD [{$nombre}]", 'COMUNIDAD');

        return redirect()->back()
            ->with('success', "Comunidad \"{$nombre}\" eliminada junto con sus programas.");
    }

    /**
     * Carga programas productivos de referencia si la tabla está vacía.
     */
    private function inicializarProgramasBase(): void
    {
        if (ProgramaProductivo::count() > 0) {
            return;
        }

        $base = [
            'San Jos' => ['Extracción de Aceite de Totaí', 'Aceites Naturales', 'Capacitación en prensado en frío, filtrado y envasado de aceite virgen de totaí.', 'Mujeres recolectoras (40 familias)'],
            'Robor'   => ['Jabonería Artesanal de Pesoé', 'Jabonería Artesanal', 'Elaboración de jabones naturales con manteca de pesoé y aceites nativos.', 'Asociación de productoras (25 socias)'],
            'Okinawa' => ['Harinas Nutritivas de Almendra Chiquitana', 'Harinas y Derivados', 'Transformación de almendra chiquitana en harinas y snacks nutritivos.', 'Jóvenes emprendedores (18 personas)'],
        ];

        foreach ($base as $prefijo => [$nombre, $area, $descripcion, $poblacion]) {
            $comunidad = Comunidad::where('nombre', 'ilike', "{$prefijo}%")->first();
            if ($comunidad) {
                ProgramaProductivo::create([
                    'nombre'                 => $nombre,
                    'descripcion'            => $descripcion,
                    'area_productiva'        => $area,
                    'poblacion_beneficiaria' => $poblacion,
                    'comunidad_id'           => $comunidad->id_comunidad,
                ]);
            }
        }
    }
}
