<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validación de Formulario para Creación de Noticias (CU-03, RF-01).
 */
class StoreNoticiaRequest extends FormRequest
{
    /**
     * Determina si el usuario autenticado está autorizado a ejecutar la acción.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación para la noticia.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:200'],
            'contenido' => ['required', 'string'],
            'etiquetas' => ['nullable', 'string', 'max:200'],
            'estado' => ['required', 'in:Publicado,Borrador,Archivado'],
            'fecha_publicacion' => ['nullable', 'date'],
            'imagen_archivo' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'imagen_principal' => ['nullable', 'string', 'max:255'],
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
            'titulo.required' => 'El título de la publicación es obligatorio.',
            'titulo.max' => 'El título no puede superar los 200 caracteres.',
            'contenido.required' => 'El cuerpo o contenido de la publicación es obligatorio.',
            'estado.required' => 'Debe seleccionar un estado para la publicación.',
            'imagen_archivo.image' => 'El archivo seleccionado debe ser una imagen válida.',
            'imagen_archivo.max' => 'La imagen no puede exceder los 5MB de tamaño.',
        ];
    }
}

