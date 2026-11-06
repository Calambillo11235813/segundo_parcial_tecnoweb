<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo Eloquent para Galería Multimedia (CU-03, RF-02).
 * Esquema físico: feder.galeria_multimedia
 */
class GaleriaMultimedia extends Model
{
    use HasFactory;

    protected $table = 'feder.galeria_multimedia';
    protected $primaryKey = 'id_multimedia';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'tipo',
        'url_archivo',
        'descripcion',
        'fecha_carga',
        'noticia_id',
    ];

    protected $casts = [
        'fecha_carga' => 'datetime',
    ];

    /**
     * Noticia a la que pertenece este elemento multimedia.
     */
    public function noticia(): BelongsTo
    {
        return $this->belongsTo(Noticia::class, 'noticia_id', 'id_noticia');
    }
}

