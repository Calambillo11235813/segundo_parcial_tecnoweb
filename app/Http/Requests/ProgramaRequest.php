<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validación de Programas Productivos de asistencia técnica (CU-04, RF-06).
 * Se utiliza tanto para el registro como para la edición.
 */
class ProgramaRequest extends FormRequest
{
    /**
     * El control de acceso se aplica mediante el middleware de roles.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas alineadas a feder.programa_productivo.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nombre'                 => ['required', 'string', 'max:150'],
            'descripcion'            => ['required', 'string'],
            'area_productiva'        => ['required', 'string', 'max:100'],
            'poblacion_beneficiaria' => ['nullable', 'string', 'max:150'],
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
            'nombre.required'          => 'El nombre del programa es obligatorio.',
            'nombre.max'               => 'El nombre no puede superar los 150 caracteres.',
            'descripcion.required'     => 'La descripción del programa es obligatoria.',
            'area_productiva.required' => 'Debe indicar el rubro o área productiva.',
            'poblacion_beneficiaria.max' => 'La población beneficiaria no puede superar los 150 caracteres.',
        ];
    }
}

