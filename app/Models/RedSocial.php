<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo RedSocial (CU-02).
 * Mapeo estricto a la tabla feder.red_social en PostgreSQL.
 */
class RedSocial extends Model
{
    protected $table = 'feder.red_social';
    protected $primaryKey = 'id_red_social';
    public $timestamps = false;

    protected $fillable = [
        'plataforma',
        'url_enlace',
        'estado',
        'usuario_id',
    ];

    /**
     * Usuario que registró o actualizó la red social.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id_usuario');
    }
}

