<?php

namespace App\Mail;

use App\Models\Aporte;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Notificación institucional de compromiso de donación y agradecimiento (CU-06, RF-12).
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
        return new Envelope(
            subject: "¡Gracias por tu apoyo! Compromiso de Aporte #{$this->aporte->codigo_comprobante} - FEDER",
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
}

