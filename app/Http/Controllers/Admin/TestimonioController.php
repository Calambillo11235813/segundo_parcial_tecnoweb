<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestimonioRequest;
use App\Http\Requests\UpdateTestimonioRequest;
use App\Models\Auditoria;
use App\Models\Comunidad;
use App\Models\Testimonio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador de Gestión de Testimonios y Relatos Comunitarios (CU-03, RF-08).
 * Accesible por Director e Instructor.
 */
class TestimonioController extends Controller
{
    /**
     * Muestra la lista de testimonios y comunidades asociadas.
     */
    public function index(Request $request): Response
    {
        $this->inicializarComunidadesYTestimonios();

        $testimonios = Testimonio::with('comunidad:id_comunidad,nombre,ubicacion')
            ->orderBy('id_testimonio', 'desc')
            ->paginate(10);

        $comunidades = Comunidad::where('estado', 'Activa')
            ->orderBy('nombre')
            ->get(['id_comunidad', 'nombre', 'ubicacion']);

        return Inertia::render('Admin/Testimonios/Index', [
            'testimonios' => $testimonios,
            'comunidades' => $comunidades,
        ]);
    }

    /**
     * Registra un nuevo testimonio de beneficiario.
     */
    public function store(StoreTestimonioRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('fotografia_archivo')) {
            $path = $request->file('fotografia_archivo')->store('testimonios', 'public');
            $data['fotografia'] = '/storage/' . $path;
        } elseif (empty($data['fotografia'])) {
            $data['fotografia'] = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80';
        }

        $testimonio = Testimonio::create($data);

        Auditoria::registrar("CREACION_TESTIMONIO [{$testimonio->titulo}]", 'TESTIMONIO', $testimonio->id_testimonio);

        return redirect()->back()
            ->with('success', "Testimonio \"{$testimonio->titulo}\" registrado exitosamente.");
    }

    /**
     * Modifica los datos de un testimonio existente.
     */
    public function update(UpdateTestimonioRequest $request, int $id): RedirectResponse
    {
        $testimonio = Testimonio::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('fotografia_archivo')) {
            if (str_starts_with($testimonio->fotografia, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $testimonio->fotografia));
            }
            $path = $request->file('fotografia_archivo')->store('testimonios', 'public');
            $data['fotografia'] = '/storage/' . $path;
        }

        $testimonio->update($data);

        Auditoria::registrar("ACTUALIZACION_TESTIMONIO [ID: {$id}]", 'TESTIMONIO', $id);

        return redirect()->back()
            ->with('success', 'Testimonio actualizado correctamente.');
    }

    /**
     * Elimina el testimonio y su fotografía local.
     */
    public function destroy(int $id): RedirectResponse
    {
        $testimonio = Testimonio::findOrFail($id);
        $titulo = $testimonio->titulo;

        if (str_starts_with($testimonio->fotografia, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $testimonio->fotografia));
        }

        $testimonio->delete();

        Auditoria::registrar("ELIMINACION_TESTIMONIO [{$titulo}]", 'TESTIMONIO', $id);

        return redirect()->back()
            ->with('success', "Testimonio \"{$titulo}\" eliminado correctamente.");
    }

    /**
     * Inicializa comunidades chiquitanas y testimonios iniciales si la tabla está vacía.
     */
    private function inicializarComunidadesYTestimonios(): void
    {
        $userId = Auth::id() ?? 1;

        if (Comunidad::count() === 0) {
            $comunidades = [
                ['nombre' => 'San José de Chiquitos', 'descripcion' => 'Cuna de la chiquitanía y centro artesanal.', 'ubicacion' => 'Provincia Chiquitos', 'estado' => 'Activa', 'usuario_id' => $userId],
                ['nombre' => 'Roboré', 'descripcion' => 'Comunidades productoras de pesoé y artesanías en madera.', 'ubicacion' => 'Provincia Chiquitos', 'estado' => 'Activa', 'usuario_id' => $userId],
                ['nombre' => 'San Ignacio de Velasco', 'descripcion' => 'Talleres de tallado y textilería chiquitana.', 'ubicacion' => 'Provincia Velasco', 'estado' => 'Activa', 'usuario_id' => $userId],
            ];
            foreach ($comunidades as $com) {
                Comunidad::create($com);
            }
        }

        if (Testimonio::count() === 0) {
            $comunidad = Comunidad::first();
            if ($comunidad) {
                Testimonio::create([
                    'titulo' => 'El aceite de totaí transformó los ingresos de nuestra familia',
                    'texto' => 'Antes de la capacitación de FEDER, vendíamos el coco de totaí a intermediarios por muy poco dinero. Hoy producimos aceite prensado en frío con marca propia y abastecemos ferias locales.',
                    'fotografia' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
                    'enlace_audiovisual' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'estado' => 'Publicado',
                    'comunidad_id' => $comunidad->id_comunidad,
                ]);
            }
        }
    }
}

