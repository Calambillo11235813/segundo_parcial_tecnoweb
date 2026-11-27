<?php

namespace Tests\Unit;

use App\Models\Aporte;
use App\Models\Campana;
use App\Models\Comunidad;
use App\Services\StripeCheckoutService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class StripeCheckoutServiceTest extends TestCase
{
    public function test_esta_configurado_depende_de_stripe_secret(): void
    {
        $service = new StripeCheckoutService();

        config(['services.stripe.secret' => '']);
        $this->assertFalse($service->estaConfigurado());

        config(['services.stripe.secret' => 'sk_test_123456']);
        $this->assertTrue($service->estaConfigurado());
    }

    public function test_crea_sesion_checkout_en_bob_con_monto_en_centavos_y_metadata(): void
    {
        config([
            'services.stripe.secret' => 'sk_test_feder_bob',
            'services.stripe.currency' => 'bob',
        ]);

        Http::fake([
            'https://api.stripe.com/v1/checkout/sessions' => Http::response([
                'id' => 'cs_test_a1b2c3',
                'url' => 'https://checkout.stripe.com/c/pay/cs_test_a1b2c3',
                'payment_status' => 'unpaid',
            ], 200),
        ]);

        $comunidad = new Comunidad(['nombre' => 'San José de Chiquitos']);
        $campana = new Campana(['titulo' => 'Prensa de Aceite de Totaí']);
        $campana->id_campana = 7;
        $campana->setRelation('comunidad', $comunidad);

        $aporte = new Aporte([
            'nombre_donante' => 'María Roca',
            'correo_donante' => 'maria@example.com',
            'monto' => 150.50,
            'modalidad' => Aporte::MODALIDAD_STRIPE,
            'campana_id' => 7,
        ]);
        $aporte->id_aporte = 42;
        $aporte->setRelation('campana', $campana);

        $service = new StripeCheckoutService();
        $sesion = $service->crearSesionCheckout(
            $aporte,
            'http://localhost:8000/donaciones/42/stripe/exito?session_id={CHECKOUT_SESSION_ID}',
            'http://localhost:8000/donaciones/42/stripe/cancelado'
        );

        $this->assertSame('cs_test_a1b2c3', $sesion['id']);
        $this->assertSame('https://checkout.stripe.com/c/pay/cs_test_a1b2c3', $sesion['url']);

        Http::assertSent(function (Request $request) {
            $data = $request->data();

            return $request->url() === 'https://api.stripe.com/v1/checkout/sessions'
                && $request->hasHeader('Authorization', 'Bearer sk_test_feder_bob')
                && ($data['mode'] ?? null) === 'payment'
                && ($data['locale'] ?? null) === 'es'
                && ($data['customer_email'] ?? null) === 'maria@example.com'
                && ($data['client_reference_id'] ?? null) === '42'
                && ($data['metadata']['aporte_id'] ?? null) === '42'
                && ($data['line_items'][0]['price_data']['currency'] ?? null) === 'bob'
                && (int) ($data['line_items'][0]['price_data']['unit_amount'] ?? 0) === 15050;
        });
    }

    public function test_obtiene_sesion_y_rechaza_identificador_invalido(): void
    {
        config(['services.stripe.secret' => 'sk_test_feder_bob']);

        Http::fake([
            'https://api.stripe.com/v1/checkout/sessions/cs_test_ok123' => Http::response([
                'id' => 'cs_test_ok123',
                'payment_status' => 'paid',
                'metadata' => ['aporte_id' => '42'],
            ], 200),
        ]);

        $service = new StripeCheckoutService();
        $sesion = $service->obtenerSesion('cs_test_ok123');
        $this->assertSame('paid', $sesion['payment_status']);

        $this->expectException(RuntimeException::class);
        $service->obtenerSesion('invalid-id');
    }

    public function test_verifica_firma_hmac_de_webhook_de_stripe(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test_secret']);

        $payload = '{"id":"evt_1","type":"checkout.session.completed"}';
        $timestamp = time();
        $firmaValida = hash_hmac('sha256', "{$timestamp}.{$payload}", 'whsec_test_secret');

        $service = new StripeCheckoutService();

        $this->assertTrue($service->verificarFirmaWebhook($payload, "t={$timestamp},v1={$firmaValida}"));
        $this->assertFalse($service->verificarFirmaWebhook($payload, "t={$timestamp},v1=firma_falsa"));
        $this->assertFalse($service->verificarFirmaWebhook($payload, ''));
    }
}
