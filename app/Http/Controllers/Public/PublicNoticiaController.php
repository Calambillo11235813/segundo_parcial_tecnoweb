<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Noticia;
use App\Models\Testimonio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador Público para Noticias, Medios y Testimonios (CU-03).
 */
class PublicNoticiaController extends Controller
{
    /**
     * Muestra el catálogo público de publicaciones y experiencias comunitarias.
     */
    public function index(Request $request): Response
    {
        $query = Noticia::where('estado', 'Publicado')
            ->withCount('galerias')
            ->orderBy('fecha_publicacion', 'desc')
            ->orderBy('id_noticia', 'desc');

        if ($request->filled('buscar')) {
            $termino = '%' . trim($request->input('buscar')) . '%';
            $query->where(function ($q) use ($termino) {
                $q->where('titulo', 'ilike', $termino)
                  ->orWhere('etiquetas', 'ilike', $termino)
                  ->orWhere('contenido', 'ilike', $termino);
            });
        }

        $noticias = $query->paginate(9)->withQueryString();

        $testimonios = Testimonio::where('estado', 'Publicado')
            ->with('comunidad:id_comunidad,nombre,ubicacion')
            ->orderBy('id_testimonio', 'desc')
            ->take(4)
            ->get();

        return Inertia::render('Public/Noticias/Index', [
            'noticias' => $noticias,
            'testimonios' => $testimonios,
            'filtros' => $request->only('buscar'),
        ]);
    }

    /**
     * Muestra el detalle de una noticia específica y su galería multimedia.
     */
    public function show(int $id): Response
    {
        $noticia = Noticia::where('estado', 'Publicado')
            ->with([
                'galerias' => function ($q) {
                    $q->orderBy('fecha_carga', 'desc');
                },
                'usuario:id_usuario,nombre_completo'
            ])
            ->findOrFail($id);

        $relacionadas = Noticia::where('estado', 'Publicado')
            ->where('id_noticia', '!=', $id)
            ->orderBy('fecha_publicacion', 'desc')
            ->take(3)
            ->get(['id_noticia', 'titulo', 'fecha_publicacion', 'imagen_principal', 'etiquetas']);

        return Inertia::render('Public/Noticias/Show', [
            'noticia' => $noticia,
            'relacionadas' => $relacionadas,
        ]);
    }
}

