<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modelo Eloquent para Comunidades Beneficiarias (CU-03 y CU-04).
 * Esquema físico: feder.comunidad
 */
class Comunidad extends Model
{
    use HasFactory;

    protected $table = 'feder.comunidad';
    protected $primaryKey = 'id_comunidad';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'ubicacion',
        'estado',
        'usuario_id',
    ];

    /**
     * Relación con el usuario registrador.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id_usuario');
    }

    /**
     * Programas productivos ejecutados en esta comunidad (CU-04).
     */
    public function programas(): HasMany
    {
        return $this->hasMany(ProgramaProductivo::class, 'comunidad_id', 'id_comunidad');
    }

    /**
     * Campañas de recaudación asociadas a esta comunidad (CU-05).
     */
    public function campanas(): HasMany
    {
        return $this->hasMany(Campana::class, 'comunidad_id', 'id_comunidad');
    }

    /**
     * Testimonios asociados a esta comunidad.
     */
    public function testimonios(): HasMany
    {
        return $this->hasMany(Testimonio::class, 'comunidad_id', 'id_comunidad');
    }
}

