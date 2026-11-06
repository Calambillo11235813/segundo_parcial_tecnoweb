<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CampanaRequest;
use App\Models\Auditoria;
use App\Models\Campana;
use App\Models\Comunidad;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador para la Gestión de Campañas de Recaudación (CU-05, RF-09, RF-10).
 * Acceso exclusivo para el Director General de FEDER.
 */
class CampanaController extends Controller
{
    /**
     * Listado administrativo de campañas con métricas de avance y filtros.
     */
    public function index(Request $request): Response
    {
        $this->inicializarCampanasBase();

        $query = Campana::with('comunidad:id_comunidad,nombre,ubicacion')
            ->withCount(['aportes' => fn ($q) => $q->where('estado', 'Confirmado')])
            ->orderBy('id_campana', 'desc');

        if ($request->filled('buscar')) {
            $termino = '%' . trim($request->input('buscar')) . '%';
            $query->where(function ($q) use ($termino) {
                $q->where('titulo', 'ilike', $termino)
                  ->orWhere('descripcion', 'ilike', $termino)
                  ->orWhereHas('comunidad', fn ($c) => $c->where('nombre', 'ilike', $termino));
            });
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        $campanas = $query->paginate(10)->withQueryString();

        // Enriquecer cada registro con atributos calculados
        $campanas->getCollection()->transform(function ($c) {
            $c->porcentaje = $c->porcentaje;
            $c->dias_restantes = $c->dias_restantes;
            return $c;
        });

        return Inertia::render('Admin/Campanas/Index', [
            'campanas' => $campanas,
            'filtros'  => $request->only(['buscar', 'estado']),
            'metricas' => [
                'total_recaudado' => (float) Campana::sum('monto_recaudado'),
                'total_meta'      => (float) Campana::where('estado', 'Activa')->sum('meta_economica'),
                'activas'         => Campana::where('estado', 'Activa')->count(),
                'cerradas'        => Campana::where('estado', 'Cerrada')->count(),
            ],
        ]);
    }

    /**
     * Formulario para parametrizar una nueva campaña.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Campanas/Create', [
            'comunidades' => Comunidad::where('estado', 'Activa')->orderBy('nombre')->get(['id_comunidad', 'nombre', 'ubicacion']),
        ]);
    }

    /**
     * Almacena una nueva campaña en feder.campana.
     */
    public function store(CampanaRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['monto_recaudado'] = 0.00;

        $campana = Campana::create($data);

        Auditoria::registrar("CREACION_CAMPANA [{$campana->titulo}]", 'CAMPANA');

        return redirect()->route('admin.campanas.index')
            ->with('success', "Campaña \"{$campana->titulo}\" publicada exitosamente.");
    }

    /**
     * Formulario de edición de parámetros de la campaña.
     */
    public function edit(int $id): Response
    {
        $campana = Campana::with('comunidad')->findOrFail($id);
        $campana->porcentaje = $campana->porcentaje;
        $campana->dias_restantes = $campana->dias_restantes;

        return Inertia::render('Admin/Campanas/Edit', [
            'campana'     => $campana,
            'comunidades' => Comunidad::where('estado', 'Activa')->orderBy('nombre')->get(['id_comunidad', 'nombre', 'ubicacion']),
        ]);
    }

    /**
     * Actualiza la meta, plazos o datos de la campaña.
     */
    public function update(CampanaRequest $request, int $id): RedirectResponse
    {
        $campana = Campana::findOrFail($id);
        $campana->update($request->validated());

        Auditoria::registrar("ACTUALIZACION_CAMPANA [ID: {$id}]", 'CAMPANA');

        return redirect()->route('admin.campanas.index')
            ->with('success', "Campaña \"{$campana->titulo}\" actualizada correctamente.");
    }

    /**
     * Cierra anticipada o formalmente una campaña de recaudación.
     */
    public function cerrar(int $id): RedirectResponse
    {
        $campana = Campana::findOrFail($id);
        $campana->update(['estado' => 'Cerrada']);

        Auditoria::registrar("CIERRE_CAMPANA [ID: {$id}]", 'CAMPANA');

        return redirect()->back()
            ->with('success', "La campaña \"{$campana->titulo}\" ha sido cerrada exitosamente.");
    }

    /**
     * Si no existen campañas, precarga ejemplos de la Chiquitanía vinculados a comunidades base.
     */
    private function inicializarCampanasBase(): void
    {
        if (Campana::count() > 0) {
            return;
        }

        $comunidadSanJose = Comunidad::where('nombre', 'ilike', '%San Jos%')->first() ?? Comunidad::first();
        $comunidadRobore  = Comunidad::where('nombre', 'ilike', '%Robor%')->first() ?? Comunidad::first();

        if ($comunidadSanJose) {
            Campana::create([
                'titulo'          => 'Prensa Hidráulica para Extracción de Aceite de Totaí',
                'descripcion'     => 'Adquisición de una prensa de acero inoxidable con capacidad de 150 kg/día para beneficiar a 40 familias recolectoras de San José de Chiquitos.',
                'meta_economica'  => 35000.00,
                'monto_recaudado' => 21500.00,
                'fecha_inicio'    => now()->subDays(20)->toDateString(),
                'fecha_limite'    => now()->addDays(25)->toDateString(),
                'estado'          => 'Activa',
                'comunidad_id'    => $comunidadSanJose->id_comunidad,
            ]);
        }

        if ($comunidadRobore) {
            Campana::create([
                'titulo'          => 'Equipamiento del Taller de Jabonería con Manteca de Pesoé',
                'descripcion'     => 'Implementación de mesas de corte, moldes térmicos y ollas de saponificación para la Asociación de Mujeres Productoras de Roboré.',
                'meta_economica'  => 18000.00,
                'monto_recaudado' => 18000.00,
                'fecha_inicio'    => now()->subDays(45)->toDateString(),
                'fecha_limite'    => now()->subDays(5)->toDateString(),
                'estado'          => 'Cerrada',
                'comunidad_id'    => $comunidadRobore->id_comunidad,
            ]);
        }
    }
}

