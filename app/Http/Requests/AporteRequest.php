<?php

namespace App\Http\Requests;

use App\Models\Aporte;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación para el Registro de Aportes y Donaciones (CU-06, RF-11).
 */
class AporteRequest extends FormRequest
{
    /**
     * Determina si el usuario tiene permiso para ejecutar esta solicitud.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación aplicadas a la solicitud de donación.
     */
    public function rules(): array
    {
        return [
            'nombre_donante' => ['required', 'string', 'max:150'],
            'correo_donante' => ['required', 'email', 'max:150'],
            'monto'          => ['required', 'numeric', 'min:1', 'max:99999999.99'],
            'modalidad'      => ['required', 'string', Rule::in(Aporte::MODALIDADES)],
            'campana_id'     => [
                'required',
                'integer',
                Rule::exists('feder.campana', 'id_campana')->where(function ($query) {
                    $query->where('estado', 'Activa');
                }),
            ],
        ];
    }

    /**
     * Mensajes de error personalizados en español.
     */
    public function messages(): array
    {
        return [
            'nombre_donante.required' => 'El nombre completo del donante es obligatorio.',
            'correo_donante.required' => 'El correo electrónico es indispensable para emitir su comprobante.',
            'correo_donante.email'    => 'Ingrese un correo electrónico válido.',
            'monto.required'          => 'Debe ingresar un monto para su aporte.',
            'monto.min'               => 'El monto mínimo de donación es de 1 Boliviano.',
            'modalidad.required'      => 'Seleccione una modalidad de pago.',
            'modalidad.in'            => 'La modalidad seleccionada no es válida.',
            'campana_id.required'     => 'Debe especificar la campaña de destino.',
            'campana_id.exists'       => 'La campaña seleccionada no existe o no se encuentra activa para recaudar fondos.',
        ];
    }
}

