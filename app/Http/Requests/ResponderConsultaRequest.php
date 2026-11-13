<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validación para el envío de respuesta institucional por correo (CU-07, RF-16).
 */
class ResponderConsultaRequest extends FormRequest
{
    /**
     * Autorizado para personal administrativo autenticado.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Reglas de validación para la contestación oficial.
     */
    public function rules(): array
    {
        return [
            'respuesta' => ['required', 'string', 'min:10', 'max:4000'],
        ];
    }

    /**
     * Mensajes de validación en español.
     */
    public function messages(): array
    {
        return [
            'respuesta.required' => 'Debe redactar el contenido de la respuesta institucional.',
            'respuesta.min'      => 'La respuesta debe contener al menos 10 caracteres.',
            'respuesta.max'      => 'La respuesta no debe superar los 4000 caracteres.',
        ];
    }
}

