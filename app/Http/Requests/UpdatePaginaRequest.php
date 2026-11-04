<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validación para la actualización de páginas institucionales (CU-02).
 * Restringido exclusivamente al rol Director.
 */
class UpdatePaginaRequest extends FormRequest
{
    /**
     * Determina si el usuario autenticado está autorizado para actualizar contenidos.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isDirector();
    }

    /**
     * Reglas de validación para el contenido institucional.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'titulo'    => ['required', 'string', 'max:100'],
            'contenido' => ['required', 'string'],
        ];
    }

    /**
     * Mensajes de error personalizados en español.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'titulo.required'    => 'El título del apartado institucional es obligatorio.',
            'titulo.max'         => 'El título no debe superar los 100 caracteres.',
            'contenido.required' => 'El contenido del apartado no puede estar vacío.',
        ];
    }
}

