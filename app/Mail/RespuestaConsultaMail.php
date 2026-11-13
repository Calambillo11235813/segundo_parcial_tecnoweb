<?php

namespace App\Mail;

use App\Models\Consulta;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Correo electrónico oficial de contestación a consultas ciudadanas (CU-07, RF-16).
 */
class RespuestaConsultaMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Consulta $consulta,
        public string $respuestaTexto,
        public string $responsableNombre = 'Administración FEDER'
    ) {}

    /**
     * Define el sobre y asunto de la contestación institucional.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Respuesta a su consulta: {$this->consulta->asunto} - Fundación FEDER",
        );
    }

    /**
     * Define la plantilla de contenido del correo.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.respuesta_consulta',
        );
    }
}

