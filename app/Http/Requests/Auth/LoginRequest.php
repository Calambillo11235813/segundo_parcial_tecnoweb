<?php

namespace App\Http\Requests\Auth;

use App\Models\Auditoria;
use App\Models\Usuario;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Solicitud de Autenticación de Usuarios (CU-01).
 * Valida credenciales contra la tabla feder.usuario.
 */
class LoginRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para realizar esta solicitud.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación aplicables a la solicitud de login.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'email'    => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Intenta autenticar las credenciales proporcionadas.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $email = trim($this->input('email'));
        $password = $this->input('password');

        $user = Usuario::where('correo_electronico', $email)->first();

        if (!$user) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'email' => 'No existe una cuenta registrada con este correo electrónico.',
            ]);
        }

        if (strtolower($user->estado) !== 'activo') {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'email' => 'Su cuenta se encuentra inactiva. Comuníquese con la Dirección.',
            ]);
        }

        $passwordValid = false;

        // 1. Verificación si coincide con contraseña en texto plano (semilla de BD docente)
        if ($password === $user->hash_contrasena) {
            $passwordValid = true;
        }
        // 2. Verificación si es hash SHA-256 (64 caracteres)
        elseif (strlen($user->hash_contrasena) === 64 && hash('sha256', $password) === $user->hash_contrasena) {
            $passwordValid = true;
        }
        // 3. Verificación estándar de Bcrypt protegida contra excepciones de formato
        else {
            try {
                if (Hash::check($password, $user->hash_contrasena)) {
                    $passwordValid = true;
                }
            } catch (\Throwable $e) {
                $passwordValid = false;
            }
        }

        if (!$passwordValid) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'password' => 'La contraseña ingresada es incorrecta.',
            ]);
        }

        // Si la contraseña no estaba en formato Bcrypt estándar, se actualiza automáticamente
        try {
            if (Hash::needsRehash($user->hash_contrasena)) {
                $user->hash_contrasena = Hash::make($password);
                $user->save();
            }
        } catch (\Throwable $e) {
            $user->hash_contrasena = Hash::make($password);
            $user->save();
        }

        Auth::login($user, $this->boolean('remember'));
        RateLimiter::clear($this->throttleKey());

        Auditoria::registrar('INICIO_SESION', 'USUARIO', $user->id_usuario);
    }

    /**
     * Asegura que la solicitud no exceda el límite de intentos permitidos.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));
        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Genera la clave de limitación de tasa para el usuario actual.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());
    }
}
