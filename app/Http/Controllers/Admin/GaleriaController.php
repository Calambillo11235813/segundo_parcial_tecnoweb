<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGaleriaRequest;
use App\Models\Auditoria;
use App\Models\GaleriaMultimedia;
use App\Models\Noticia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

/**
 * Controlador de Galería Multimedia para Publicaciones (CU-03, RF-02).
 */
class GaleriaController extends Controller
{
    /**
     * Añade un recurso multimedia (fotografía o enlace de video) a la noticia.
     */
    public function store(StoreGaleriaRequest $request, int $noticiaId): RedirectResponse
    {
        $noticia = Noticia::findOrFail($noticiaId);
        $data = $request->validated();
        $data['noticia_id'] = $noticia->id_noticia;
        $data['fecha_carga'] = now();

        if ($data['tipo'] === 'Imagen' && $request->hasFile('archivo')) {
            $path = $request->file('archivo')->store('galeria', 'public');
            $data['url_archivo'] = '/storage/' . $path;
        } elseif (empty($data['url_archivo'])) {
            return redirect()->back()
                ->withErrors(['url_archivo' => 'Debe adjuntar una imagen o ingresar la URL del video/recurso.']);
        }

        $item = GaleriaMultimedia::create($data);

        Auditoria::registrar("CREACION_MULTIMEDIA [{$item->titulo} - {$item->tipo}]", 'GALERIA_MULTIMEDIA', $item->id_multimedia);

        return redirect()->back()
            ->with('success', "Recurso multimedia \"{$item->titulo}\" añadido a la galería.");
    }

    /**
     * Elimina un recurso de la galería.
     */
    public function destroy(int $id): RedirectResponse
    {
        $multimedia = GaleriaMultimedia::findOrFail($id);
        $titulo = $multimedia->titulo;

        if (str_starts_with($multimedia->url_archivo, '/storage/')) {
            $path = str_replace('/storage/', '', $multimedia->url_archivo);
            Storage::disk('public')->delete($path);
        }

        $multimedia->delete();

        Auditoria::registrar("ELIMINACION_MULTIMEDIA [{$titulo}]", 'GALERIA_MULTIMEDIA', $id);

        return redirect()->back()
            ->with('success', "Elemento \"{$titulo}\" eliminado de la galería.");
    }
}

