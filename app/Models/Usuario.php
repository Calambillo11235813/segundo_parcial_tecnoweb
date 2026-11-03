<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Modelo Usuario (CU-01)
 * Mapeo estricto a la tabla feder.usuario en PostgreSQL.
 */
class Usuario extends Authenticatable
{
    use Notifiable;

    protected $table = 'feder.usuario';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'nombre_completo',
        'correo_electronico',
        'hash_contrasena',
        'estado',
        'fecha_registro',
        'rol_id',
    ];

    protected $hidden = [
        'hash_contrasena',
    ];

    protected $casts = [
        'fecha_registro' => 'datetime',
    ];

    /**
     * Nombre de la columna que almacena la contraseña cifrada.
     */
    public function getAuthPassword(): string
    {
        return $this->hash_contrasena;
    }

    /**
     * Nombre de la clave primaria para autenticación.
     */
    public function getAuthIdentifierName(): string
    {
        return 'id_usuario';
    }

    /**
     * Relación con el rol del usuario.
     */
    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class, 'rol_id', 'id_rol');
    }

    /**
     * Relación con las acciones de auditoría registradas.
     */
    public function auditorias(): HasMany
    {
        return $this->hasMany(Auditoria::class, 'usuario_id', 'id_usuario');
    }

    /**
     * Valida si el usuario posee uno o más roles asignados.
     */
    public function hasRole(string|array $roles): bool
    {
        if (!$this->rol) {
            $this->load('rol');
        }

        if (!$this->rol) {
            return false;
        }

        $allowedRoles = is_array($roles) ? $roles : explode(',', $roles);
        $allowedRoles = array_map(fn($r) => strtolower(trim($r)), $allowedRoles);

        return in_array(strtolower($this->rol->nombre_rol), $allowedRoles);
    }

    /**
     * Comprueba si el usuario tiene rol de Director.
     */
    public function isDirector(): bool
    {
        return $this->hasRole('Director');
    }

    /**
     * Comprueba si el usuario tiene rol de Secretaria.
     */
    public function isSecretaria(): bool
    {
        return $this->hasRole('Secretaria');
    }

    /**
     * Comprueba si el usuario tiene rol de Instructor.
     */
    public function isInstructor(): bool
    {
        return $this->hasRole('Instructor');
    }
}
