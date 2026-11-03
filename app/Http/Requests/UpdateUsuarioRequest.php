<?php

namespace App\Http\Requests;

use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación para la actualización de datos de usuarios (CU-01).
 * Restringido exclusivamente al rol Director.
 */
class UpdateUsuarioRequest extends FormRequest
{
    /**
     * Determina si el usuario autenticado está autorizado para realizar la actualización.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isDirector();
    }

    /**
     * Reglas de validación para la edición de usuarios.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $usuarioId = $this->route('id') ?? $this->route('usuario');

        return [
            'nombre_completo'    => ['required', 'string', 'max:150'],
            'correo_electronico' => [
                'required',
                'string',
                'email',
                'max:150',
                Rule::unique(Usuario::class, 'correo_electronico')->ignore($usuarioId, 'id_usuario'),
            ],
            'contrasena'         => ['nullable', 'string', 'min:6'],
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
            'correo_electronico.unique' => 'Este correo ya pertenece a otro usuario registrado.',
            'rol_id.exists'             => 'El rol seleccionado no es válido.',
            'contrasena.min'            => 'La contraseña debe tener mínimo 6 caracteres si decide cambiarla.',
        ];
    }
}
