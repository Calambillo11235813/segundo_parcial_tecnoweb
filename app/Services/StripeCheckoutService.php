<?php

namespace App\Services;

use App\Models\Aporte;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Servicio de integración con Stripe Checkout (API REST v1) en Bolivianos (BOB).
 * Utiliza el cliente HTTP nativo de Laravel sin modificar el esquema de la base de datos.
 */
class StripeCheckoutService
{
    private const API_BASE = 'https://api.stripe.com/v1';

    /**
     * Construye el cliente HTTP autenticado con verificación SSL compatible con Windows y Linux.
     */
    private function clienteHttp(string $secret): PendingRequest
    {
        $client = Http::withToken($secret)->timeout(15);

        $caBundle = $this->resolverCaBundle();
        if ($caBundle !== null) {
            $client = $client->withOptions(['verify' => $caBundle]);
        }

        return $client;
    }

    /**
     * Resuelve el archivo de certificados CA si php.ini en Windows no tiene curl.cainfo configurado.
     */
    private function resolverCaBundle(): ?string
    {
        $configurado = trim((string) config('services.stripe.ca_bundle', ''));
        if ($configurado !== '' && is_file($configurado)) {
            return $configurado;
        }

        $iniCurl = trim((string) ini_get('curl.cainfo'));
        $iniOpenSsl = trim((string) ini_get('openssl.cafile'));
        if (($iniCurl !== '' && is_file($iniCurl)) || ($iniOpenSsl !== '' && is_file($iniOpenSsl))) {
            return null;
        }

        if (PHP_OS_FAMILY !== 'Windows') {
            return null;
        }

        $candidatos = [
            'C:\\Program Files\\Git\\mingw64\\etc\\ssl\\certs\\ca-bundle.crt',
            'C:\\Program Files\\Git\\usr\\ssl\\certs\\ca-bundle.crt',
            'C:\\xampp\\apache\\bin\\curl-ca-bundle.crt',
            'C:\\xampp\\php\\extras\\ssl\\cacert.pem',
            'C:\\laragon\\etc\\ssl\\cacert.pem',
        ];

        foreach ($candidatos as $ruta) {
            if (is_file($ruta)) {
                return $ruta;
            }
        }

        return null;
    }

    /**
     * Indica si las credenciales de Stripe están configuradas en el entorno.
     */
    public function estaConfigurado(): bool
    {
        return trim((string) config('services.stripe.secret', '')) !== '';
    }

    /**
     * Crea una sesión de Stripe Checkout en BOB para un aporte registrado.
     *
     * @return array<string, mixed>
     */
    public function crearSesionCheckout(Aporte $aporte, string $successUrl, string $cancelUrl): array
    {
        $secret = trim((string) config('services.stripe.secret', ''));
        if ($secret === '') {
            throw new RuntimeException('La clave secreta de Stripe (STRIPE_SECRET) no está configurada.');
        }

        $aporte->loadMissing('campana.comunidad');

        $campana = $aporte->campana;
        $tituloCampana = $campana?->titulo ?: 'Campaña Comunitaria FEDER';
        $comunidad = $campana?->comunidad?->nombre ?: 'Chiquitanía';
        $moneda = strtolower(trim((string) config('services.stripe.currency', 'bob'))) ?: 'bob';
        $montoCentavos = (int) round(((float) $aporte->monto) * 100);

        $payload = [
            'mode' => 'payment',
            'locale' => 'es',
            'payment_method_types' => ['card'],
            'customer_email' => $aporte->correo_donante,
            'client_reference_id' => (string) $aporte->id_aporte,
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'line_items' => [
                [
                    'quantity' => 1,
                    'price_data' => [
                        'currency' => $moneda,
                        'unit_amount' => $montoCentavos,
                        'product_data' => [
                            'name' => 'Donación: ' . mb_substr($tituloCampana, 0, 110),
                            'description' => "Comprobante {$aporte->codigo_comprobante} • Comunidad {$comunidad} • Fundación FEDER",
                        ],
                    ],
                ],
            ],
            'metadata' => [
                'aporte_id' => (string) $aporte->id_aporte,
                'campana_id' => (string) $aporte->campana_id,
                'codigo_comprobante' => $aporte->codigo_comprobante,
            ],
        ];

        $response = $this->clienteHttp($secret)
            ->asForm()
            ->post(self::API_BASE . '/checkout/sessions', $payload);

        if (! $response->successful()) {
            $mensajeStripe = $response->json('error.message') ?: ('HTTP ' . $response->status());
            throw new RuntimeException("No se pudo iniciar la sesión de pago en Stripe: {$mensajeStripe}");
        }

        $data = $response->json();
        if (! is_array($data) || empty($data['url']) || empty($data['id'])) {
            throw new RuntimeException('Respuesta inválida de Stripe al crear la sesión de pago.');
        }

        return $data;
    }

    /**
     * Consulta una sesión de Stripe Checkout por su ID para verificar el estado real del pago.
     *
     * @return array<string, mixed>
     */
    public function obtenerSesion(string $sessionId): array
    {
        $secret = trim((string) config('services.stripe.secret', ''));
        if ($secret === '') {
            throw new RuntimeException('La clave secreta de Stripe (STRIPE_SECRET) no está configurada.');
        }

        $sessionId = trim($sessionId);
        if ($sessionId === '' || ! preg_match('/^cs_[a-zA-Z0-9_]+$/', $sessionId)) {
            throw new RuntimeException('Identificador de sesión de Stripe inválido.');
        }

        $response = $this->clienteHttp($secret)
            ->get(self::API_BASE . '/checkout/sessions/' . urlencode($sessionId));

        if (! $response->successful()) {
            $mensajeStripe = $response->json('error.message') ?: ('HTTP ' . $response->status());
            throw new RuntimeException("No se pudo verificar la sesión en Stripe: {$mensajeStripe}");
        }

        $data = $response->json();
        if (! is_array($data)) {
            throw new RuntimeException('Respuesta inválida al consultar la sesión en Stripe.');
        }

        return $data;
    }

    /**
     * Verifica la firma HMAC-SHA256 del encabezado Stripe-Signature para webhooks.
     */
    public function verificarFirmaWebhook(string $payload, ?string $signatureHeader, int $toleranciaSegundos = 300): bool
    {
        $webhookSecret = trim((string) config('services.stripe.webhook_secret', ''));
        if ($webhookSecret === '' || ! is_string($signatureHeader) || trim($signatureHeader) === '') {
            return false;
        }

        $timestamp = null;
        $firmasV1 = [];

        foreach (explode(',', $signatureHeader) as $parte) {
            $kv = explode('=', trim($parte), 2);
            if (count($kv) !== 2) {
                continue;
            }
            if ($kv[0] === 't') {
                $timestamp = (int) $kv[1];
            } elseif ($kv[0] === 'v1') {
                $firmasV1[] = $kv[1];
            }
        }

        if (! $timestamp || empty($firmasV1)) {
            return false;
        }

        if (abs(time() - $timestamp) > $toleranciaSegundos) {
            return false;
        }

        $esperada = hash_hmac('sha256', "{$timestamp}.{$payload}", $webhookSecret);

        foreach ($firmasV1 as $firma) {
            if (hash_equals($esperada, $firma)) {
                return true;
            }
        }

        return false;
    }
}
