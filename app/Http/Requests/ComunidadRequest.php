<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validación de la ficha de Comunidad Beneficiaria (CU-04, RF-05).
 * Se utiliza tanto para el registro como para la edición.
 */
class ComunidadRequest extends FormRequest
{
    /**
     * El control de acceso se aplica mediante el middleware de roles.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas alineadas a feder.comunidad (nombre 100, ubicacion 255, estado 20).
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nombre'      => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:2000'],
            'ubicacion'   => ['required', 'string', 'max:255'],
            'estado'      => ['required', 'in:Activa,Inactiva'],
        ];
    }

    /**
     * Mensajes de validación en español.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre.required'    => 'El nombre de la comunidad es obligatorio.',
            'nombre.max'         => 'El nombre no puede superar los 100 caracteres.',
            'ubicacion.required' => 'La ubicación (municipio/provincia) es obligatoria.',
            'estado.in'          => 'El estado debe ser Activa o Inactiva.',
        ];
    }
}

