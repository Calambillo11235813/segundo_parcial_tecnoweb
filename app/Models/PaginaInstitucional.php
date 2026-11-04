<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo PaginaInstitucional (CU-02).
 * Mapeo estricto a la tabla feder.pagina_institucional en PostgreSQL.
 */
class PaginaInstitucional extends Model
{
    protected $table = 'feder.pagina_institucional';
    protected $primaryKey = 'id_pagina';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'contenido',
        'ultima_actualizacion',
        'usuario_id',
    ];

    protected $casts = [
        'ultima_actualizacion' => 'datetime',
    ];

    /**
     * Usuario que realizó la última actualización del contenido.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id_usuario');
    }
}

