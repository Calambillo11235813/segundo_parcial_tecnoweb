<?php

namespace App\Mail;

use App\Models\Aporte;
use App\Services\ComprobanteAportePdfService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Notificación institucional de donación y agradecimiento con comprobante PDF adjunto (CU-06, RF-12).
 */
class AporteAgradecimientoMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Aporte $aporte
    ) {
        $this->aporte->loadMissing('campana.comunidad');
    }

    /**
     * Define el sobre del correo electrónico.
     */
    public function envelope(): Envelope
    {
        $asunto = $this->aporte->estado === Aporte::ESTADO_CONFIRMADO
            ? "¡Gracias por tu donación! Comprobante Oficial #{$this->aporte->codigo_comprobante} - FEDER"
            : "¡Gracias por tu apoyo! Compromiso de Aporte #{$this->aporte->codigo_comprobante} - FEDER";

        return new Envelope(
            subject: $asunto,
        );
    }

    /**
     * Define el contenido visual del correo institucional.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.aporte_agradecimiento',
        );
    }

    /**
     * Adjunta automáticamente el comprobante oficial de aporte en formato PDF.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $nombreArchivo = 'comprobante_' . $this->aporte->codigo_comprobante . '.pdf';

        return [
            Attachment::fromData(
                fn () => app(ComprobanteAportePdfService::class)->generar($this->aporte),
                $nombreArchivo
            )->withMime('application/pdf'),
        ];
    }
}

