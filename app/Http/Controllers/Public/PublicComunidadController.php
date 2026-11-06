<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Comunidad;
use App\Models\Noticia;
use App\Models\ProgramaProductivo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador Público del Catálogo de Comunidades y Programas (CU-04, RF-05, RF-06, RF-07).
 * Incluye el motor de búsqueda y filtrado por comunidad, ubicación o rubro.
 */
class PublicComunidadController extends Controller
{
    /**
     * Catálogo público con filtros: texto libre, rubro productivo y ubicación.
     */
    public function index(Request $request): Response
    {
        $buscar = trim((string) $request->input('buscar', ''));
        $rubro = $request->input('rubro');
        $ubicacion = $request->input('ubicacion');

        // Filtro aplicado sobre los programas (para mostrar solo los coincidentes)
        $filtroProgramas = function ($q) use ($buscar, $rubro) {
            if ($rubro) {
                $q->where('area_productiva', $rubro);
            }
            if ($buscar !== '') {
                $q->where(fn ($s) => $s->where('nombre', 'ilike', "%{$buscar}%")
                    ->orWhere('descripcion', 'ilike', "%{$buscar}%"));
            }
        };

        $query = Comunidad::where('estado', 'Activa')->orderBy('nombre');

        if ($ubicacion) {
            $query->where('ubicacion', $ubicacion);
        }

        if ($rubro) {
            $query->whereHas('programas', fn ($q) => $q->where('area_productiva', $rubro));
        }

        if ($buscar !== '') {
            $query->where(function ($q) use ($buscar, $filtroProgramas) {
                $q->where('nombre', 'ilike', "%{$buscar}%")
                  ->orWhere('descripcion', 'ilike', "%{$buscar}%")
                  ->orWhereHas('programas', $filtroProgramas);
            });
        }

        // Si se buscó por nombre de comunidad, se muestran todos sus programas
        $comunidades = $query->with(['programas' => function ($q) use ($rubro) {
            if ($rubro) {
                $q->where('area_productiva', $rubro);
            }
        }])->withCount('programas')->get();

        return Inertia::render('Public/Comunidades/Index', [
            'comunidades' => $comunidades,
            'filtros'     => $request->only(['buscar', 'rubro', 'ubicacion']),
            'rubros'      => ProgramaProductivo::query()->distinct()->orderBy('area_productiva')->pluck('area_productiva'),
            'ubicaciones' => Comunidad::where('estado', 'Activa')->distinct()->orderBy('ubicacion')->pluck('ubicacion'),
            'totales'     => [
                'comunidades' => Comunidad::where('estado', 'Activa')->count(),
                'programas'   => ProgramaProductivo::whereHas('comunidad', fn ($q) => $q->where('estado', 'Activa'))->count(),
            ],
        ]);
    }

    /**
     * Ficha pública de una comunidad: programas, testimonios y noticias relacionadas.
     */
    public function show(int $id): Response
    {
        $comunidad = Comunidad::where('estado', 'Activa')
            ->with([
                'programas' => fn ($q) => $q->orderBy('area_productiva'),
                'testimonios' => fn ($q) => $q->where('estado', 'Publicado')->orderByDesc('id_testimonio'),
            ])
            ->findOrFail($id);

        // Noticias vinculadas por coincidencia del nombre de la comunidad (RF-07)
        $clave = mb_substr($comunidad->nombre, 0, 8);
        $noticias = Noticia::where('estado', 'Publicado')
            ->where(fn ($q) => $q->where('etiquetas', 'ilike', "%{$clave}%")
                ->orWhere('titulo', 'ilike', "%{$clave}%"))
            ->orderByDesc('fecha_publicacion')
            ->take(3)
            ->get(['id_noticia', 'titulo', 'fecha_publicacion', 'imagen_principal']);

        return Inertia::render('Public/Comunidades/Show', [
            'comunidad' => $comunidad,
            'noticias'  => $noticias,
        ]);
    }
}

