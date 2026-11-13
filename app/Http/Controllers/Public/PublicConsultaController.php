<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConsultaRequest;
use App\Models\Consulta;
use App\Models\PaginaInstitucional;
use App\Models\RedSocial;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador Público del Formulario de Contacto y Consultas Ciudadanas (CU-07, RF-16).
 */
class PublicConsultaController extends Controller
{
    /**
     * Despliega el formulario público de contacto junto a la información institucional.
     */
    public function create(): Response
    {
        $ubicacion = PaginaInstitucional::where('titulo', 'Ubicación y Contacto')->first();
        $redes = RedSocial::where('estado', 'Activo')->get();

        return Inertia::render('Public/Contacto', [
            'ubicacion' => $ubicacion,
            'redes'     => $redes,
            'asuntosSugeridos' => [
                'Información sobre Programas Productivos',
                'Alianza Estratégica / Cooperación Internacional',
                'Consultas sobre Donaciones y Crowdfunding',
                'Solicitud de Asistencia Técnica Comunitaria',
                'Prensa y Difusión Institucional',
                'Otro motivo',
            ],
        ]);
    }

    /**
     * Valida y almacena la consulta ciudadana en la bandeja interna con estado Pendiente.
     */
    public function store(StoreConsultaRequest $request): RedirectResponse
    {
        $datos = $request->validated();
        $datos['fecha_envio'] = now();
        $datos['estado'] = Consulta::ESTADO_PENDIENTE;
        $datos['usuario_id'] = null;

        Consulta::create($datos);

        return redirect()
            ->route('public.contacto.index')
            ->with('success', '¡Su mensaje ha sido enviado con éxito! Nuestro equipo institucional le responderá a su correo electrónico a la brevedad.');
    }
}

