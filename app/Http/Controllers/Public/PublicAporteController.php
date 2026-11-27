<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\AporteRequest;
use App\Mail\AporteAgradecimientoMail;
use App\Models\Aporte;
use App\Models\Campana;
use App\Services\ComprobanteAportePdfService;
use App\Services\StripeCheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

/**
 * Controlador Público para Registro de Donaciones y Comprobantes Preliminares (CU-06, RF-11, RF-12).
 */
class PublicAporteController extends Controller
{
    /**
     * Muestra el formulario de registro de intención de donación para una campaña activa.
     */
    public function create(int $id, StripeCheckoutService $stripeService): Response|RedirectResponse
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
            'campana'           => $campana,
            'modalidades'       => Aporte::MODALIDADES,
            'stripeHabilitado'  => $stripeService->estaConfigurado(),
            'montoMinimoStripe' => Aporte::MONTO_MINIMO_STRIPE_BOB,
        ]);
    }

    /**
     * Procesa la intención de aporte:
     * - Si es Tarjeta (Stripe): crea Checkout Session en BOB y redirige a Stripe.
     * - Si es Transferencia / QR / Efectivo: despacha correo y emite comprobante preliminar.
     */
    public function store(AporteRequest $request, int $id, StripeCheckoutService $stripeService): SymfonyResponse
    {
        $campana = Campana::findOrFail($id);

        if ($campana->estado !== 'Activa') {
            return redirect()
                ->route('public.campanas.show', $id)
                ->with('error', 'La campaña no se encuentra activa para recibir aportes.');
        }

        $esAnonimo = $request->boolean('es_anonimo');
        $datos = $request->validated();
        unset($datos['es_anonimo']);

        $datos['nombre_donante'] = $esAnonimo
            ? Aporte::NOMBRE_ANONIMO
            : trim((string) $datos['nombre_donante']);
        $datos['fecha_registro'] = now();
        $datos['estado'] = Aporte::ESTADO_PENDIENTE;
        $datos['campana_id'] = $campana->id_campana;

        $aporte = Aporte::create($datos);
        $aporte->load('campana.comunidad');

        // Flujo de pago en línea con Stripe Checkout (BOB)
        if ($aporte->modalidad === Aporte::MODALIDAD_STRIPE) {
            if (! $stripeService->estaConfigurado()) {
                $aporte->delete();

                return redirect()
                    ->route('public.donaciones.create', $campana->id_campana)
                    ->with('error', 'El pago con tarjeta (Stripe) no está configurado en el servidor. Elija otra modalidad o configure STRIPE_SECRET.');
            }

            try {
                $successUrl = route('public.donaciones.stripe.exito', $aporte->id_aporte) . '?session_id={CHECKOUT_SESSION_ID}';
                $cancelUrl = route('public.donaciones.stripe.cancelado', $aporte->id_aporte);
                $sesion = $stripeService->crearSesionCheckout($aporte, $successUrl, $cancelUrl);

                return Inertia::location($sesion['url']);
            } catch (\Throwable $e) {
                Log::error("Error al crear sesión de Stripe para aporte #{$aporte->id_aporte}: " . $e->getMessage());
                $aporte->delete();

                return redirect()
                    ->route('public.donaciones.create', $campana->id_campana)
                    ->with('error', 'No se pudo conectar con Stripe para iniciar el pago. Inténtelo nuevamente o seleccione otra modalidad.');
            }
        }

        // Flujo manual (Transferencia bancaria, QR, Efectivo): despacho de correo (RF-12)
        $this->enviarCorreoAgradecimiento($aporte);

        return redirect()
            ->route('public.donaciones.comprobante', $aporte->id_aporte)
            ->with('success', '¡Gracias por su apoyo! Su compromiso de aporte ha sido registrado con éxito.');
    }

    /**
     * Retorno exitoso desde Stripe Checkout: verifica server-side y confirma el aporte.
     */
    public function stripeExito(Request $request, int $id, StripeCheckoutService $stripeService): RedirectResponse
    {
        $aporte = Aporte::with('campana.comunidad')->findOrFail($id);

        // Idempotencia: si ya fue confirmado (por recarga o webhook), mostrar comprobante directamente
        if ($aporte->estado === Aporte::ESTADO_CONFIRMADO) {
            return redirect()
                ->route('public.donaciones.comprobante', $aporte->id_aporte)
                ->with('success', '¡Gracias por su donación! Su pago con tarjeta ya se encuentra confirmado.');
        }

        $sessionId = trim((string) $request->query('session_id', ''));
        if ($sessionId === '') {
            return redirect()
                ->route('public.donaciones.create', $aporte->campana_id)
                ->with('error', 'No se recibió el identificador de pago de Stripe para validar la transacción.');
        }

        try {
            $sesion = $stripeService->obtenerSesion($sessionId);
        } catch (\Throwable $e) {
            Log::error("Error al verificar sesión Stripe ({$sessionId}) para aporte #{$aporte->id_aporte}: " . $e->getMessage());

            return redirect()
                ->route('public.donaciones.comprobante', $aporte->id_aporte)
                ->with('error', 'No se pudo verificar el estado de su pago en este momento. Nuestro equipo validará su aporte a la brevedad.');
        }

        $aporteIdMetadata = (int) ($sesion['metadata']['aporte_id'] ?? $sesion['client_reference_id'] ?? 0);
        $pagado = ($sesion['payment_status'] ?? '') === 'paid';

        if (! $pagado || $aporteIdMetadata !== (int) $aporte->id_aporte) {
            return redirect()
                ->route('public.donaciones.create', $aporte->campana_id)
                ->with('error', 'El pago con tarjeta aún no fue completado en Stripe.');
        }

        $this->confirmarAporteStripe($aporte);

        return redirect()
            ->route('public.donaciones.comprobante', $aporte->id_aporte)
            ->with('success', '¡Pago confirmado con Stripe! Su aporte en Bs. ya fue sumado a la campaña.');
    }

    /**
     * Retorno cuando el donante cancela o abandona la pasarela de Stripe sin pagar.
     */
    public function stripeCancelado(int $id): RedirectResponse
    {
        $aporte = Aporte::find($id);

        if (! $aporte) {
            return redirect()
                ->route('public.campanas.index')
                ->with('error', 'El pago con tarjeta fue cancelado.');
        }

        $campanaId = $aporte->campana_id;

        if ($aporte->modalidad === Aporte::MODALIDAD_STRIPE && $aporte->estado === Aporte::ESTADO_PENDIENTE) {
            $aporte->delete();
        }

        return redirect()
            ->route('public.donaciones.create', $campanaId)
            ->with('error', 'Pago con tarjeta cancelado. Puedes intentarlo nuevamente o elegir otra modalidad.');
    }

    /**
     * Webhook de Stripe (checkout.session.completed) para confirmación resiliente en segundo plano.
     */
    public function stripeWebhook(Request $request, StripeCheckoutService $stripeService): JsonResponse
    {
        $payload = $request->getContent();
        $firma = $request->header('Stripe-Signature');

        if (! $stripeService->verificarFirmaWebhook($payload, $firma)) {
            return response()->json(['error' => 'Firma de webhook inválida'], 400);
        }

        $evento = json_decode($payload, true);
        if (! is_array($evento)) {
            return response()->json(['error' => 'Payload inválido'], 400);
        }

        if (($evento['type'] ?? '') === 'checkout.session.completed') {
            $sesion = $evento['data']['object'] ?? [];
            $aporteId = (int) ($sesion['metadata']['aporte_id'] ?? $sesion['client_reference_id'] ?? 0);
            $pagado = ($sesion['payment_status'] ?? '') === 'paid';

            if ($pagado && $aporteId > 0) {
                $aporte = Aporte::with('campana.comunidad')->find($aporteId);
                if ($aporte && $aporte->estado !== Aporte::ESTADO_CONFIRMADO) {
                    $this->confirmarAporteStripe($aporte);
                }
            }
        }

        return response()->json(['received' => true]);
    }

    /**
     * Marca el aporte como Confirmado, recalcula la campaña y envía el correo al donante.
     */
    private function confirmarAporteStripe(Aporte $aporte): void
    {
        $aporte->estado = Aporte::ESTADO_CONFIRMADO;
        $aporte->save();

        if ($aporte->campana) {
            $aporte->campana->recalcularRecaudacion();
        }

        $this->enviarCorreoAgradecimiento($aporte);
    }

    /**
     * Despacha el correo institucional de confirmación y agradecimiento sin interrumpir el flujo si falla SMTP.
     */
    private function enviarCorreoAgradecimiento(Aporte $aporte): void
    {
        try {
            Mail::to($aporte->correo_donante)->send(new AporteAgradecimientoMail($aporte));
        } catch (\Throwable $e) {
            Log::warning("No se pudo enviar el correo de agradecimiento al donante ({$aporte->correo_donante}): " . $e->getMessage());
        }
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

    /**
     * Descarga directamente el comprobante preliminar de aporte en formato PDF (1 página).
     */
    public function descargarComprobantePdf(int $id, ComprobanteAportePdfService $pdfService): HttpResponse
    {
        $aporte = Aporte::with('campana.comunidad')->findOrFail($id);
        $pdfContent = $pdfService->generar($aporte);

        $nombreArchivo = 'comprobante_' . $aporte->codigo_comprobante . '.pdf';

        return response($pdfContent, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $nombreArchivo . '"',
        ]);
    }
}

