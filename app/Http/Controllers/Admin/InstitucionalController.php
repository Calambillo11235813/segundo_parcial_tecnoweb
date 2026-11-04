<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRedSocialRequest;
use App\Http\Requests\UpdatePaginaRequest;
use App\Http\Requests\UpdateRedSocialRequest;
use App\Models\Auditoria;
use App\Models\PaginaInstitucional;
use App\Models\RedSocial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador de Gestión de Contenidos Institucionales (CU-02).
 * Permite al Director actualizar páginas corporativas y enlaces a redes sociales.
 */
class InstitucionalController extends Controller
{
    /**
     * Asegura la existencia de las secciones institucionales base.
     */
    private function inicializarSeccionesBase(): void
    {
        $secciones = [
            'Mision' => 'Ofrecer servicios financieros, asistencia técnica de negocio a negocio y apertura de mercados para artesanos y microempresarios rurales.',
            'Vision' => 'Ser una organización sólida, rentable y competitiva en el sector rural y microempresario de la Chiquitanía.',
            'Objetivos' => 'Impulsar el desarrollo socioeconómico de las comunidades chiquitanas, promover la producción sostenible de derivados de totaí y pesoé, y fortalecer capacidades productivas.',
            'Reseña Histórica' => 'La Fundación FEDER nace con el propósito de apoyar el desarrollo rural integral en la Chiquitanía, impulsando cadenas productivas artesanales y sostenibles.',
            'Ubicación y Contacto' => 'Oficinas Centrales: Calle Arenales esq. Puerto Suárez, Santa Cruz de la Sierra, Bolivia. Teléfono: +591 (3) 334-5678. Correo: contacto@feder.org.bo',
        ];

        $userId = Auth::id() ?? 1;

        foreach ($secciones as $titulo => $contenidoDefault) {
            PaginaInstitucional::firstOrCreate(
                ['titulo' => $titulo],
                [
                    'contenido' => $contenidoDefault,
                    'ultima_actualizacion' => now(),
                    'usuario_id' => $userId,
                ]
            );
        }
    }

    /**
     * Muestra el panel administrativo de edición de contenidos y redes sociales.
     */
    public function index(): Response
    {
        $this->inicializarSeccionesBase();

        $paginas = PaginaInstitucional::with('usuario:id_usuario,nombre_completo')
            ->orderBy('id_pagina')
            ->get();

        $redes = RedSocial::orderBy('id_red_social')
            ->get();

        return Inertia::render('Admin/Institucional/Index', [
            'paginas' => $paginas,
            'redes'   => $redes,
        ]);
    }

    /**
     * Actualiza el contenido de un apartado institucional específico.
     */
    public function updatePagina(UpdatePaginaRequest $request, int $id): RedirectResponse
    {
        $pagina = PaginaInstitucional::findOrFail($id);
        $data = $request->validated();
        $data['ultima_actualizacion'] = now();
        $data['usuario_id'] = Auth::id() ?? 1;

        $pagina->update($data);

        Auditoria::registrar("ACTUALIZACION_PAGINA [{$pagina->titulo}]", 'PAGINA_INSTITUCIONAL');

        return redirect()->back()
            ->with('success', "Apartado \"{$pagina->titulo}\" actualizado correctamente.");
    }

    /**
     * Registra un nuevo enlace a red social oficial.
     */
    public function storeRed(StoreRedSocialRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['usuario_id'] = Auth::id() ?? 1;

        $red = RedSocial::create($data);

        Auditoria::registrar("CREACION_RED_SOCIAL [{$red->plataforma}]", 'RED_SOCIAL');

        return redirect()->back()
            ->with('success', "Red social \"{$red->plataforma}\" registrada exitosamente.");
    }

    /**
     * Modifica los datos de una red social existente.
     */
    public function updateRed(UpdateRedSocialRequest $request, int $id): RedirectResponse
    {
        $red = RedSocial::findOrFail($id);
        $red->update($request->validated());

        Auditoria::registrar("ACTUALIZACION_RED_SOCIAL [ID: {$id}]", 'RED_SOCIAL');

        return redirect()->back()
            ->with('success', "Red social \"{$red->plataforma}\" actualizada correctamente.");
    }

    /**
     * Elimina un enlace a red social.
     */
    public function destroyRed(int $id): RedirectResponse
    {
        $red = RedSocial::findOrFail($id);
        $plataforma = $red->plataforma;
        $red->delete();

        Auditoria::registrar("ELIMINACION_RED_SOCIAL [{$plataforma}]", 'RED_SOCIAL');

        return redirect()->back()
            ->with('success', "Red social \"{$plataforma}\" eliminada correctamente.");
    }

    /**
     * Muestra la página pública "¿Quiénes Somos? / Nosotros" con la información institucional.
     */
    public function showPublic(): Response
    {
        $this->inicializarSeccionesBase();

        $paginas = PaginaInstitucional::all()->keyBy('titulo');
        $redes = RedSocial::where('estado', 'Activo')->get();

        return Inertia::render('Public/Nosotros', [
            'paginas' => $paginas,
            'redes'   => $redes,
        ]);
    }
}

