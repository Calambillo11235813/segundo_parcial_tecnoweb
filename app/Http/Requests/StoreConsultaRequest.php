<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validación del formulario público de consultas y contacto (CU-07, RF-16).
 */
class StoreConsultaRequest extends FormRequest
{
    /**
     * Cualquier visitante puede enviar una consulta pública.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación acordes al esquema feder.consulta.
     */
    public function rules(): array
    {
        return [
            'nombre_remitente' => ['required', 'string', 'min:3', 'max:150'],
            'correo_remitente' => ['required', 'email', 'max:150'],
            'asunto'           => ['required', 'string', 'min:4', 'max:150'],
            'mensaje'          => ['required', 'string', 'min:10', 'max:3000'],
        ];
    }

    /**
     * Mensajes de error personalizados en español.
     */
    public function messages(): array
    {
        return [
            'nombre_remitente.required' => 'Por favor ingrese su nombre completo o entidad.',
            'nombre_remitente.min'      => 'El nombre debe contener al menos 3 caracteres.',
            'nombre_remitente.max'      => 'El nombre no puede exceder los 150 caracteres.',
            'correo_remitente.required' => 'El correo electrónico es obligatorio para responderle.',
            'correo_remitente.email'    => 'Ingrese una dirección de correo electrónico válida.',
            'asunto.required'           => 'Indique el asunto o motivo de su consulta.',
            'asunto.min'                => 'El asunto debe tener al menos 4 caracteres.',
            'asunto.max'                => 'El asunto no puede superar los 150 caracteres.',
            'mensaje.required'          => 'Escriba el detalle de su mensaje o solicitud.',
            'mensaje.min'               => 'El mensaje debe contener al menos 10 caracteres.',
            'mensaje.max'               => 'El mensaje no puede exceder los 3000 caracteres.',
        ];
    }
}

