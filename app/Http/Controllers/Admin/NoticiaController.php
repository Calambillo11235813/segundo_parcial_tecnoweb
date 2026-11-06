<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoticiaRequest;
use App\Http\Requests\UpdateNoticiaRequest;
use App\Models\Auditoria;
use App\Models\Noticia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador para la Gestión Editorial de Noticias y Comunicados (CU-03, RF-01).
 * Accesible por Director e Instructor.
 */
class NoticiaController extends Controller
{
    /**
     * Lista las noticias registradas con filtros por búsqueda y estado.
     */
    public function index(Request $request): Response
    {
        $this->inicializarNoticiasBase();

        $query = Noticia::with(['usuario:id_usuario,nombre_completo'])
            ->withCount('galerias')
            ->orderBy('id_noticia', 'desc');

        if ($request->filled('buscar')) {
            $termino = '%' . trim($request->input('buscar')) . '%';
            $query->where(function ($q) use ($termino) {
                $q->where('titulo', 'ilike', $termino)
                  ->orWhere('etiquetas', 'ilike', $termino);
            });
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        $noticias = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Noticias/Index', [
            'noticias' => $noticias,
            'filtros' => $request->only(['buscar', 'estado']),
        ]);
    }

    /**
     * Muestra el formulario para redactar una nueva noticia.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Noticias/Create');
    }

    /**
     * Almacena una nueva noticia en el esquema feder.noticia.
     */
    public function store(StoreNoticiaRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['usuario_id'] = Auth::id() ?? 1;
        $data['fecha_publicacion'] = $data['fecha_publicacion'] ?? now()->toDateString();

        // Procesamiento de imagen principal (archivo o enlace externo)
        if ($request->hasFile('imagen_archivo')) {
            $path = $request->file('imagen_archivo')->store('noticias', 'public');
            $data['imagen_principal'] = '/storage/' . $path;
        } elseif (empty($data['imagen_principal'])) {
            $data['imagen_principal'] = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80';
        }

        $noticia = Noticia::create($data);

        Auditoria::registrar("CREACION_NOTICIA [{$noticia->titulo}]", 'NOTICIA', $noticia->id_noticia);

        return redirect()->route('admin.noticias.edit', $noticia->id_noticia)
            ->with('success', 'Publicación creada exitosamente. Ahora puedes añadir elementos a su galería.');
    }

    /**
     * Formulario de edición de noticia y gestión de su galería multimedia.
     */
    public function edit(int $id): Response
    {
        $noticia = Noticia::with(['galerias' => function ($q) {
            $q->orderBy('fecha_carga', 'desc');
        }, 'usuario:id_usuario,nombre_completo'])->findOrFail($id);

        return Inertia::render('Admin/Noticias/Edit', [
            'noticia' => $noticia,
        ]);
    }

    /**
     * Actualiza los datos de la noticia.
     */
    public function update(UpdateNoticiaRequest $request, int $id): RedirectResponse
    {
        $noticia = Noticia::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('imagen_archivo')) {
            // Eliminar imagen anterior si era local
            if (str_starts_with($noticia->imagen_principal, '/storage/')) {
                $antiguo = str_replace('/storage/', '', $noticia->imagen_principal);
                Storage::disk('public')->delete($antiguo);
            }
            $path = $request->file('imagen_archivo')->store('noticias', 'public');
            $data['imagen_principal'] = '/storage/' . $path;
        }

        $noticia->update($data);

        Auditoria::registrar("ACTUALIZACION_NOTICIA [ID: {$id}]", 'NOTICIA', $id);

        return redirect()->back()
            ->with('success', 'Publicación actualizada correctamente.');
    }

    /**
     * Elimina la noticia y sus archivos asociados.
     */
    public function destroy(int $id): RedirectResponse
    {
        $noticia = Noticia::with('galerias')->findOrFail($id);
        $titulo = $noticia->titulo;

        // Limpieza de archivos locales si existen
        if (str_starts_with($noticia->imagen_principal, '/storage/')) {
            $archivo = str_replace('/storage/', '', $noticia->imagen_principal);
            Storage::disk('public')->delete($archivo);
        }

        foreach ($noticia->galerias as $multimedia) {
            if (str_starts_with($multimedia->url_archivo, '/storage/')) {
                $arch = str_replace('/storage/', '', $multimedia->url_archivo);
                Storage::disk('public')->delete($arch);
            }
        }

        $noticia->delete();

        Auditoria::registrar("ELIMINACION_NOTICIA [{$titulo}]", 'NOTICIA', $id);

        return redirect()->route('admin.noticias.index')
            ->with('success', "La noticia \"{$titulo}\" ha sido eliminada.");
    }

    /**
     * Inicializa noticias predeterminadas de la Chiquitanía si la tabla está vacía.
     */
    private function inicializarNoticiasBase(): void
    {
        if (Noticia::count() > 0) return;

        $userId = Auth::id() ?? 1;
        $noticias = [
            [
                'titulo' => 'Taller de Extracción Sostenible de Aceite de Totaí en San José de Chiquitos',
                'contenido' => "Más de 40 mujeres artesanas y recolectoras participaron en el taller técnico impartido por la Fundación FEDER en San José de Chiquitos. \n\nDurante tres jornadas intensivas, se capacitaron en métodos ecológicos de prensado en frío para la obtención de aceite virgen de totaí, un recurso forestal no maderable de gran valor cosmético y medicinal.",
                'fecha_publicacion' => now()->subDays(5)->toDateString(),
                'imagen_principal' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
                'etiquetas' => 'Capacitación, Totaí, San José, Artesanía',
                'estado' => 'Publicado',
                'usuario_id' => $userId,
            ],
            [
                'titulo' => 'FEDER promueve la producción de jabones artesanales a base de Pesoé en Roboré',
                'contenido' => "Comunidades rurales de Roboré fortalecen sus unidades productivas familiares mediante la elaboración de jabonería natural con manteca de pesoé y aceites nativos de la Chiquitanía.\n\nEl proyecto brinda asistencia técnica continua y equipamiento básico para el control de calidad y envasado biodegradable.",
                'fecha_publicacion' => now()->subDays(12)->toDateString(),
                'imagen_principal' => 'https://images.unsplash.com/photo-1607006314170-c0d1b46a2a91?w=800&auto=format&fit=crop&q=80',
                'etiquetas' => 'Jabonería, Pesoé, Roboré, Innovación',
                'estado' => 'Publicado',
                'usuario_id' => $userId,
            ]
        ];

        foreach ($noticias as $item) {
            Noticia::create($item);
        }
    }
}

