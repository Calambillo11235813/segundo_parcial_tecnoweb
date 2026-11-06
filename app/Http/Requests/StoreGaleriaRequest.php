<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validación de Formulario para Carga de Recursos Multimedia (CU-03, RF-02).
 */
class StoreGaleriaRequest extends FormRequest
{
    /**
     * Determina si el usuario autenticado está autorizado a ejecutar la acción.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación para recursos multimedia.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:150'],
            'tipo' => ['required', 'in:Imagen,Video'],
            'archivo' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'url_archivo' => ['nullable', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:255'],
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
            'titulo.required' => 'El título del elemento multimedia es obligatorio.',
            'tipo.required' => 'Debe seleccionar el tipo (Imagen o Video).',
            'tipo.in' => 'El tipo debe ser Imagen o Video.',
            'archivo.image' => 'El archivo adjunto debe ser una imagen válida.',
            'archivo.max' => 'La imagen no puede exceder los 5MB.',
        ];
    }
}

