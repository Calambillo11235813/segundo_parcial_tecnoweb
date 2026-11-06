<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modelo Eloquent para Noticias y Comunicados (CU-03, RF-01).
 * Esquema físico: feder.noticia
 */
class Noticia extends Model
{
    use HasFactory;

    protected $table = 'feder.noticia';
    protected $primaryKey = 'id_noticia';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'contenido',
        'fecha_publicacion',
        'imagen_principal',
        'etiquetas',
        'estado',
        'usuario_id',
    ];

    protected $casts = [
        'fecha_publicacion' => 'date',
    ];

    /**
     * Relación con el autor o personal que registró la noticia.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id_usuario');
    }

    /**
     * Elementos multimedia (fotografías o videos) vinculados a la noticia.
     */
    public function galerias(): HasMany
    {
        return $this->hasMany(GaleriaMultimedia::class, 'noticia_id', 'id_noticia');
    }
}

