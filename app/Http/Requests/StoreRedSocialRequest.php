<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validación para el registro de enlaces a redes sociales (CU-02).
 * Restringido exclusivamente al rol Director.
 */
class StoreRedSocialRequest extends FormRequest
{
    /**
     * Determina si el usuario autenticado está autorizado para registrar redes sociales.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isDirector();
    }

    /**
     * Reglas de validación para enlaces a redes sociales.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'plataforma' => ['required', 'string', 'max:50'],
            'url_enlace' => ['required', 'string', 'max:255'],
            'estado'     => ['required', 'string', 'in:Activo,Inactivo'],
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
            'plataforma.required' => 'El nombre de la plataforma o red social es obligatorio.',
            'url_enlace.required' => 'El enlace o URL oficial de la red social es obligatorio.',
            'estado.in'           => 'El estado debe ser Activo o Inactivo.',
        ];
    }
}

