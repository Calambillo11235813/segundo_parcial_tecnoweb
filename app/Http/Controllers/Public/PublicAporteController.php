<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\AporteRequest;
use App\Mail\AporteAgradecimientoMail;
use App\Models\Aporte;
use App\Models\Campana;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador Público para Registro de Donaciones y Comprobantes Preliminares (CU-06, RF-11, RF-12).
 */
class PublicAporteController extends Controller
{
    /**
     * Muestra el formulario de registro de intención de donación para una campaña activa.
     */
    public function create(int $id): Response|RedirectResponse
    {
        $campana = Campana::with('comunidad:id_comunidad,nombre,ubicacion')
            ->findOrFail($id);

        if ($campana->estado !== 'Activa') {
            return redirect()
                ->route('public.campanas.show', $campana->id_campana)
                ->with('error', 'Esta campaña ha concluido su período de recaudación activa.');
        }

        $campana->porcentaje = $campana->porcentaje;
        $campana->dias_restantes = $campana->dias_restantes;

        return Inertia::render('Public/Campanas/Donar', [
            'campana'     => $campana,
            'modalidades' => Aporte::MODALIDADES,
        ]);
    }

    /**
     * Procesa la intención de aporte, despacha correo de agradecimiento y emite comprobante.
     */
    public function store(AporteRequest $request, int $id): RedirectResponse
    {
        $campana = Campana::findOrFail($id);

        if ($campana->estado !== 'Activa') {
            return redirect()
                ->route('public.campanas.show', $id)
                ->with('error', 'La campaña no se encuentra activa para recibir aportes.');
        }

        $datos = $request->validated();
        $datos['fecha_registro'] = now();
        $datos['estado'] = Aporte::ESTADO_PENDIENTE;
        $datos['campana_id'] = $campana->id_campana;

        $aporte = Aporte::create($datos);
        $aporte->load('campana.comunidad');

        // Despacho de correo institucional de confirmación y agradecimiento (RF-12)
        try {
            Mail::to($aporte->correo_donante)->send(new AporteAgradecimientoMail($aporte));
        } catch (\Throwable $e) {
            Log::warning("No se pudo enviar el correo de agradecimiento al donante ({$aporte->correo_donante}): " . $e->getMessage());
        }

        return redirect()
            ->route('public.donaciones.comprobante', $aporte->id_aporte)
            ->with('success', '¡Gracias por su apoyo! Su compromiso de aporte ha sido registrado con éxito.');
    }

    /**
     * Emite en pantalla el comprobante digital preliminar para el donante.
     */
    public function comprobante(int $id): Response
    {
        $aporte = Aporte::with('campana.comunidad')->findOrFail($id);

        return Inertia::render('Public/Campanas/Comprobante', [
            'aporte' => $aporte,
        ]);
    }
}

