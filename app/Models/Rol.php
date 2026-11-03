<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modelo Rol (CU-01)
 * Mapeo estricto a la tabla feder.rol en PostgreSQL.
 */
class Rol extends Model
{
    protected $table = 'feder.rol';
    protected $primaryKey = 'id_rol';
    public $timestamps = false;

    protected $fillable = [
        'nombre_rol',
        'descripcion',
    ];

    /**
     * Relación con los usuarios asociados a este rol.
     */
    public function usuarios(): HasMany
    {
        return $this->hasMany(Usuario::class, 'rol_id', 'id_rol');
    }
}

