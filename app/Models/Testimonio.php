<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo Eloquent para Testimonios de Artesanos y Comunidades (CU-03, RF-08).
 * Esquema físico: feder.testimonio
 */
class Testimonio extends Model
{
    use HasFactory;

    protected $table = 'feder.testimonio';
    protected $primaryKey = 'id_testimonio';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'texto',
        'fotografia',
        'enlace_audiovisual',
        'estado',
        'comunidad_id',
    ];

    /**
     * Comunidad a la que pertenece el beneficiario o artesano.
     */
    public function comunidad(): BelongsTo
    {
        return $this->belongsTo(Comunidad::class, 'comunidad_id', 'id_comunidad');
    }
}

