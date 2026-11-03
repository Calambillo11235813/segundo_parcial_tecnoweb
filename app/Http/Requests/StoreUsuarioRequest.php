<?php

namespace App\Http\Requests;

use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación para la creación de nuevos usuarios (CU-01).
 * Restringido exclusivamente al rol Director.
 */
class StoreUsuarioRequest extends FormRequest
{
    /**
     * Determina si el usuario autenticado está autorizado para realizar este registro.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isDirector();
    }

    /**
     * Reglas de validación para los campos del formulario de creación.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nombre_completo'    => ['required', 'string', 'max:150'],
            'correo_electronico' => [
                'required',
                'string',
                'email',
                'max:150',
                Rule::unique(Usuario::class, 'correo_electronico'),
            ],
            'contrasena'         => ['required', 'string', 'min:6'],
            'rol_id'             => ['required', 'integer', Rule::exists(Rol::class, 'id_rol')],
            'estado'             => ['required', 'string', 'in:Activo,Inactivo'],
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
            'correo_electronico.unique' => 'Ya existe un usuario registrado con este correo electrónico.',
            'rol_id.exists'             => 'El rol seleccionado no es válido.',
            'contrasena.min'            => 'La contraseña debe contener al menos 6 caracteres.',
        ];
    }
}
