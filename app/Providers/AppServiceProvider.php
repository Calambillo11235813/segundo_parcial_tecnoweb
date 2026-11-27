<?php

namespace App\Providers;

use Illuminate\Mail\Events\MessageSending;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Transport\Smtp\Stream\SocketStream;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        $this->configurarCertificadosSslParaSmtpEnWindows();
    }

    /**
     * Inyecta el bundle CA del sistema en el SocketStream SMTP cuando PHP en Windows
     * no tiene openssl.cafile configurado, evitando fallos TLS con Gmail u otros SMTP.
     */
    private function configurarCertificadosSslParaSmtpEnWindows(): void
    {
        if (PHP_OS_FAMILY !== 'Windows') {
            return;
        }

        $iniOpenSsl = trim((string) ini_get('openssl.cafile'));
        if ($iniOpenSsl !== '' && is_file($iniOpenSsl)) {
            return;
        }

        $caBundle = $this->buscarCaBundleWindows();
        if ($caBundle === null) {
            return;
        }

        Event::listen(MessageSending::class, function () use ($caBundle): void {
            $transport = Mail::mailer()->getSymfonyTransport();
            if (! $transport instanceof EsmtpTransport) {
                return;
            }

            $stream = $transport->getStream();
            if (! $stream instanceof SocketStream) {
                return;
            }

            $opciones = $stream->getStreamOptions();
            if (empty($opciones['ssl']['cafile'])) {
                $opciones['ssl']['cafile'] = $caBundle;
                $stream->setStreamOptions($opciones);
            }
        });
    }

    private function buscarCaBundleWindows(): ?string
    {
        $candidatos = [
            trim((string) config('services.stripe.ca_bundle', '')),
            'C:\\Program Files\\Git\\mingw64\\etc\\ssl\\certs\\ca-bundle.crt',
            'C:\\Program Files\\Git\\usr\\ssl\\certs\\ca-bundle.crt',
            'C:\\xampp\\apache\\bin\\curl-ca-bundle.crt',
            'C:\\xampp\\php\\extras\\ssl\\cacert.pem',
            'C:\\laragon\\etc\\ssl\\cacert.pem',
        ];

        foreach ($candidatos as $ruta) {
            if ($ruta !== '' && is_file($ruta)) {
                return $ruta;
            }
        }

        return null;
    }
}
