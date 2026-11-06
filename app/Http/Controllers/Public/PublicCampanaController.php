<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Campana;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador Público del Catálogo de Campañas de Crowdfunding (CU-05, RF-09, RF-10).
 */
class PublicCampanaController extends Controller
{
    /**
     * Muestra el catálogo de proyectos comunitarios que requieren financiamiento.
     */
    public function index(Request $request): Response
    {
        $query = Campana::with('comunidad:id_comunidad,nombre,ubicacion')
            ->withCount(['aportes' => fn ($q) => $q->where('estado', 'Confirmado')])
            ->orderByRaw("CASE WHEN estado = 'Activa' THEN 0 ELSE 1 END")
            ->orderBy('fecha_limite', 'asc');

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

        $campanas = $query->paginate(9)->withQueryString();

        $campanas->getCollection()->transform(function ($c) {
            $c->porcentaje = $c->porcentaje;
            $c->dias_restantes = $c->dias_restantes;
            return $c;
        });

        return Inertia::render('Public/Campanas/Index', [
            'campanas' => $campanas,
            'filtros'  => $request->only(['buscar', 'estado']),
            'estadisticas' => [
                'total_recaudado' => (float) Campana::sum('monto_recaudado'),
                'campanas_activas' => Campana::where('estado', 'Activa')->count(),
                'metas_cumplidas'  => Campana::where('monto_recaudado', '>=', \DB::raw('meta_economica'))->count(),
            ],
        ]);
    }

    /**
     * Ficha de detalle de la campaña y avance de aportes confirmados.
     */
    public function show(int $id): Response
    {
        $campana = Campana::with([
            'comunidad:id_comunidad,nombre,ubicacion,descripcion',
            'aportes' => fn ($q) => $q->where('estado', 'Confirmado')->orderByDesc('fecha_registro')->take(10),
        ])->findOrFail($id);

        $campana->porcentaje = $campana->porcentaje;
        $campana->dias_restantes = $campana->dias_restantes;

        return Inertia::render('Public/Campanas/Show', [
            'campana' => $campana,
        ]);
    }
}

