<?php

namespace App\Http\Requests;

use App\Models\Comunidad;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación de Formulario para Edición de Testimonios (CU-03, RF-08).
 */
class UpdateTestimonioRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado a realizar esta acción.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación para modificar testimonios.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:150'],
            'texto' => ['required', 'string'],
            'fotografia_archivo' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'fotografia' => ['nullable', 'string', 'max:255'],
            'enlace_audiovisual' => ['nullable', 'string', 'max:255'],
            'estado' => ['required', 'in:Publicado,Borrador,Inactivo'],
            'comunidad_id' => ['required', 'integer', Rule::exists(Comunidad::class, 'id_comunidad')],
        ];
    }

    /**
     * Mensajes descriptivos en español.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'titulo.required' => 'El título del testimonio o historia es obligatorio.',
            'texto.required' => 'El relato o texto del testimonio es obligatorio.',
            'comunidad_id.required' => 'Debe asociar el testimonio a una comunidad.',
            'comunidad_id.exists' => 'La comunidad seleccionada no es válida.',
        ];
    }
}

