<?php

namespace App\Http\Requests;

use App\Models\Comunidad;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación de Campañas de Financiamiento / Crowdfunding (CU-05, RF-09).
 */
class CampanaRequest extends FormRequest
{
    /**
     * Autorización aplicada vía middleware de rol Director.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación para crear/modificar campañas.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'titulo'          => ['required', 'string', 'max:200'],
            'descripcion'     => ['required', 'string'],
            'meta_economica'  => ['required', 'numeric', 'gt:0'],
            'fecha_inicio'    => ['required', 'date'],
            'fecha_limite'    => ['required', 'date', 'after_or_equal:fecha_inicio'],
            'estado'          => ['required', 'in:Activa,Cerrada,Pausada'],
            'comunidad_id'    => ['required', 'integer', Rule::exists(Comunidad::class, 'id_comunidad')],
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
            'titulo.required'          => 'El título de la campaña es obligatorio.',
            'titulo.max'               => 'El título no puede superar los 200 caracteres.',
            'descripcion.required'     => 'La descripción detallada del plan de financiamiento es obligatoria.',
            'meta_economica.required'  => 'La meta económica es obligatoria.',
            'meta_economica.gt'        => 'La meta económica debe ser mayor a 0 Bs.',
            'fecha_inicio.required'    => 'La fecha de inicio es obligatoria.',
            'fecha_limite.required'    => 'La fecha límite de recaudación es obligatoria.',
            'fecha_limite.after_or_equal' => 'La fecha límite debe ser igual o posterior a la fecha de inicio.',
            'comunidad_id.required'    => 'Debe vincular la campaña a una comunidad beneficiaria.',
            'comunidad_id.exists'      => 'La comunidad seleccionada no es válida.',
        ];
    }
}

